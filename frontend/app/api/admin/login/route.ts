import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import { signSession, SESSION_COOKIE } from "@/lib/session";
import { apiRoute, ValidationError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const POST = apiRoute(async (req: Request) => {
  if (!isDbConfigured) {
    return Response.json(
      { error: "The database isn't connected yet." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").toString().trim().toLowerCase();
  const password = (body?.password ?? "").toString();

  if (!email || !password) {
    throw new ValidationError("Please enter your email and password.");
  }

  const sql = getDb();
  const [user] = await sql`
    select id, email, password_hash from admin_users where email = ${email}
  `;

  // Compare against a dummy hash even when the user doesn't exist, so the
  // response time doesn't leak whether an email is registered.
  const hash =
    user?.password_hash ??
    "$2a$12$CwTycUXWue0Thq9StjUM0uJ8G8JZoQ5jJZ0uZ0uZ0uZ0uZ0uZ0uZO";
  const valid = await bcrypt.compare(password, hash);

  if (!user || !valid) {
    return Response.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const token = await signSession({ sub: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
});
