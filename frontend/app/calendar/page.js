"use client";

import { useEffect, useState } from "react";

const colors = ["blue", "amber", "rose", "indigo", "pink"];
const getRandomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

const formatDate = (dateObj) => {
  if (!dateObj) return "";
  const date = new Date(dateObj.dateTime || `${dateObj.date}T00:00:00`);
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const isAM = hour < 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${date.toDateString()} ${formattedHour}:${minute}${isAM ? " AM" : " PM"}`;
};

// Returns the day of month
const getDay = (dateObj) => new Date(dateObj.dateTime || `${dateObj.date}T00:00:00`).getDate();

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "calendar"

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar?maxResults=50`);
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  // Group events by day for calendar view
  const eventsByDay = {};
  events.forEach((e) => {
    const day = getDay(e.start);
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(e);
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-700 p-4 md:p-6 lg:p-8 min-h-screen text-slate-600 dark:text-slate-100">
      <header className="text-center grid p-4 place-items-center gap-4">
        <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br pb-4 md:pb-6 from-blue-500 to-violet-700 dark:from-blue-400">
          My Calendar Events
        </h1>

        {/* View Toggle */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md font-bold ${
              view === "list" ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-md font-bold ${
              view === "calendar" ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            Calendar View
          </button>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto mt-6">
        {loading ? (
          <p className="text-center text-3xl animate-pulse">Loading Events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-2xl">No events found</p>
        ) : view === "list" ? (
          <section className="grid gap-4 md:gap-6 lg:gap-8 items-start grid-cols-cards">
            {events.map((e) => {
              const color = getRandomColor();
              return (
                <article
                  key={e.id}
                  className="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg overflow-hidden"
                >
                  <div
                    className={`p-3 shadow bg-${color}-500 text-indigo-50 uppercase grid place-items-center rounded-t-lg`}
                  >
                    <div className="text-sm">
                      {new Date(e.start?.dateTime || e.start?.date).toLocaleString(
                        "default",
                        { month: "short" }
                      )}
                    </div>
                    <div className="text-3xl font-bold">
                      {new Date(e.start?.dateTime || e.start?.date).getDate()}
                    </div>
                  </div>

                  <div className="p-4 md:p-6 lg:p-8 grid gap-2">
                    <h2 className="font-bold text-2xl">{e.name}</h2>
                    {e.location && <p className="text-slate-400 text-sm">📍 {e.location}</p>}
                    {e.description && <p className="text-slate-400">📝 {e.description}</p>}
                    <p className="text-slate-400 text-sm">
                      ⏰ {formatDate(e.start)} - {formatDate(e.end)}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          // Calendar view
          <section className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              return (
                <div key={day} className="border rounded p-2 bg-white dark:bg-slate-800">
                  <div className="font-bold">{day}</div>
                  {eventsByDay[day] &&
                    eventsByDay[day].map((e) => (
                      <div key={e.id} className="text-sm mt-1 p-1 bg-blue-100 dark:bg-blue-900 rounded">
                        {e.name}
                      </div>
                    ))}
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
