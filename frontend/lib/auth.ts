import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./session";

/**
 * Reads and verifies the admin session cookie from a server component or
 * API route (Node runtime only — see lib/session.ts for why the JWT
 * verification itself lives in a separate, Edge-safe module).
 *
 * Returns null when signed out; proxy.ts is what actually blocks page
 * access, so callers use this to read *who* is signed in, not to gate
 * access by itself.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

export class UnauthorizedError extends Error {}
export class ValidationError extends Error {}

/** Throws inside an API route (catch it with `apiRoute`) if signed out. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/**
 * Wraps a route handler so `requireAdmin()` / `throw new ValidationError(...)`
 * turn into the right HTTP status instead of an unhandled 500.
 */
export function apiRoute<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (err instanceof ValidationError) {
        return Response.json({ error: err.message }, { status: 400 });
      }
      console.error(err);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  };
}
