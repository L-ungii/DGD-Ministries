import Link from "next/link";
import { getDb } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import {
  HiOutlineCalendarDays,
  HiOutlinePhoto,
  HiOutlineMegaphone,
  HiOutlineHeart,
} from "react-icons/hi2";

export const dynamic = "force-dynamic";

const tiles = [
  {
    href: "/admin/events",
    label: "Upcoming Events",
    Icon: HiOutlineCalendarDays,
    accent: "bg-blue-50 text-blue-900",
  },
  {
    href: "/admin/gallery",
    label: "Photos",
    Icon: HiOutlinePhoto,
    accent: "bg-violet-50 text-violet-900",
  },
  {
    href: "/admin/announcements",
    label: "Active Notices",
    Icon: HiOutlineMegaphone,
    accent: "bg-amber-50 text-amber-900",
  },
  {
    href: "/admin/prayers",
    label: "Prayer Requests",
    Icon: HiOutlineHeart,
    accent: "bg-rose-50 text-rose-900",
  },
];

export default async function AdminDashboard() {
  // The layout renders a setup notice in this case, but Next still evaluates
  // the page as `children`, so it has to bail out on its own too.
  if (!isDbConfigured) return null;

  const sql = getDb();

  const [
    [{ count: eventCount }],
    [{ count: photoCount }],
    [{ count: noticeCount }],
    [{ count: prayerCount }],
    [{ count: unansweredCount }],
    nextEvents,
  ] = await Promise.all([
    sql`select count(*)::int from events where starts_at >= now()`,
    sql`select count(*)::int from gallery`,
    sql`select count(*)::int from announcements where active = true`,
    sql`select count(*)::int from prayer_requests`,
    sql`select count(*)::int from prayer_requests where answered = false`,
    sql`
      select id, title, starts_at, location from events
      where starts_at >= now()
      order by starts_at asc
      limit 5
    `,
  ]);

  const counts = [eventCount, photoCount, noticeCount, prayerCount];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
        Welcome back
      </h1>
      <p className="text-slate-500 mt-1 mb-8 text-sm">
        Everything you publish here appears on the public website straight away.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {tiles.map(({ href, label, Icon, accent }, i) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`w-11 h-11 rounded-lg grid place-items-center mb-4 ${accent}`}
            >
              <Icon size={22} />
            </div>
            <p className="text-3xl font-bold text-blue-950">{counts[i]}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blue-950">Next 5 Events</h2>
            <Link
              href="/admin/events"
              className="text-sm text-blue-700 hover:underline"
            >
              Manage
            </Link>
          </div>

          {!nextEvents?.length ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No upcoming events yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {nextEvents.map((e) => (
                <li key={e.id} className="py-3 flex items-center gap-4">
                  <div className="shrink-0 w-14 text-center bg-blue-950 text-white rounded-lg py-1.5">
                    <p className="text-[10px] uppercase">
                      {new Date(e.starts_at).toLocaleDateString("default", {
                        month: "short",
                      })}
                    </p>
                    <p className="text-lg font-bold leading-none">
                      {new Date(e.starts_at).getDate()}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {e.title}
                    </p>
                    {e.location && (
                      <p className="text-xs text-slate-400 truncate">
                        📍 {e.location}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-blue-950 mb-4">Quick Actions</h2>
          <div className="grid gap-3">
            <Link
              href="/admin/events"
              className="border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-900 hover:text-blue-900 transition"
            >
              ➕ Add an event
            </Link>
            <Link
              href="/admin/gallery"
              className="border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-900 hover:text-blue-900 transition"
            >
              🖼️ Upload photos to the gallery
            </Link>
            <Link
              href="/admin/announcements"
              className="border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-900 hover:text-blue-900 transition"
            >
              📣 Post a notice on the homepage
            </Link>
            <Link
              href="/admin/prayers"
              className="border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-900 hover:text-blue-900 transition"
            >
              🙏 Read prayer requests
              {unansweredCount > 0 && (
                <span className="ml-2 bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full">
                  {unansweredCount} new
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
