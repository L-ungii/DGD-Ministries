import { getSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/env";
import AdminShell from "@/components/Admin/AdminShell";

export const metadata = {
  title: "Admin — DGD Ministries",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDbConfigured) return <SetupNotice />;

  const session = await getSession();

  // Signed out (i.e. the login page) — it renders its own full-screen layout.
  // proxy.ts is what actually blocks access to the other admin routes.
  if (!session) return <>{children}</>;

  return <AdminShell email={session.email}>{children}</AdminShell>;
}

function SetupNotice() {
  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
      <div className="max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-xl font-bold text-blue-950 mb-3">
          Admin panel not connected yet
        </h1>
        <p className="text-slate-600 text-sm mb-5">
          The dashboard needs a Postgres database before it can store events,
          photos and notices. Add this to{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            frontend/.env.local
          </code>{" "}
          and restart the server:
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto">
          {`DATABASE_URL=postgres://user:password@host:5432/dbname
SESSION_SECRET=... (32+ random characters)`}
        </pre>
        <p className="text-slate-500 text-xs mt-5">
          Full walkthrough:{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded">
            frontend/ADMIN_SETUP.md
          </code>
        </p>
      </div>
    </div>
  );
}
