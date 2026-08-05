import { SignJWT, jwtVerify } from "jose";

/**
 * Signs and verifies the admin session cookie as a JWT.
 *
 * Deliberately dependency-light (no database, no bcrypt): this file is
 * imported by proxy.ts, which runs on the Edge runtime and can only use
 * Web Crypto — `jose` works there, `pg`/`postgres` and `bcryptjs` do not.
 */

export const SESSION_COOKIE = "dgd_admin_session";
const SESSION_DURATION = "7d";

export type SessionPayload = {
  sub: string; // admin_users.id
  email: string;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is not set (or is too short) — see ADMIN_SETUP.md."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
