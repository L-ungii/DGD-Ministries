"use client";

import { useEffect, useState } from "react";

const formatDate = (dateObj) => {
  if (!dateObj) return "";
  const date = new Date(dateObj.dateTime || `${dateObj.date}T00:00:00`);
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const isAM = hour < 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute}${isAM ? " AM" : " PM"}`;
};

const getDay = (dateObj) => new Date(dateObj.dateTime || `${dateObj.date}T00:00:00`).getDate();

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [eventsToShow, setEventsToShow] = useState(5);

  // For calendar view
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar?maxResults=50`);
      const data = await res.json();
      data.sort(
        (a, b) =>
          new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date)
      );
      setEvents(data);
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => {
    const start = new Date(e.start.dateTime || e.start.date);
    return start >= now;
  });
  const visibleEvents = view === "list" ? upcomingEvents.slice(0, eventsToShow) : events;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Calendar calculations ---
  const calendarDate = new Date();
  calendarDate.setMonth(calendarDate.getMonth() + monthOffset);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // weekday of first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events by date for the current month
  const eventsByDate = {};
  events.forEach((e) => {
    const date = new Date(e.start.dateTime || e.start.date);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      if (!eventsByDate[day]) eventsByDate[day] = [];
      eventsByDate[day].push(e);
    }
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-700 p-4 md:p-6 lg:p-8 min-h-screen text-slate-600 dark:text-slate-100">
      <header className="text-center grid p-4 place-items-center gap-4">
        <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br pb-4 md:pb-6 from-blue-500 to-violet-700 dark:from-blue-400">
          Events
        </h1>

        {/* View Toggle */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md font-bold ${
              view === "list"
                ? "bg-blue-950 text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-md font-bold ${
              view === "calendar"
                ? "bg-blue-950 text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
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
          <>
            <section className="grid gap-4 md:gap-6 lg:gap-8 items-start grid-cols-1 md:grid-cols-cards">
              {visibleEvents.map((e) => {
                const dateObj = new Date(e.start?.dateTime || e.start?.date);
                const weekday = dateObj.toLocaleDateString("default", { weekday: "short" });
                const month = dateObj.toLocaleDateString("default", { month: "short" });
                const day = dateObj.getDate();

                return (
                  <article
                    key={e.id}
                    className="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg overflow-hidden"
                  >
                    {/* Header with date */}
                    <div className="p-3 shadow bg-blue-950 text-indigo-50 uppercase grid place-items-center rounded-t-lg">
                      <div className="text-sm">{`${weekday}, ${month}`}</div>
                      <div className="text-3xl font-bold">{day}</div>
                    </div>

                    {/* Event details */}
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

            {eventsToShow < upcomingEvents.length && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setEventsToShow(eventsToShow + 5)}
                  className="px-6 py-2 bg-blue-950 text-white rounded-md font-bold"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          // Calendar view
          <>
            {/* Month navigation */}
            <div className="flex justify-between mb-2 items-center">
              <button
                onClick={() => setMonthOffset(monthOffset - 1)}
                className="px-4 py-1 bg-blue-950 text-white rounded"
              >
                Prev
              </button>
              <h2 className="text-xl font-bold">
                {calendarDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => setMonthOffset(monthOffset + 1)}
                className="px-4 py-1 bg-blue-950 text-white rounded"
              >
                Next
              </button>
            </div>

            <section className="grid grid-cols-7 gap-1">
              {weekDays.map((wd) => (
                <div
                  key={wd}
                  className="font-bold text-center p-2 bg-blue-950 text-white rounded-t-md"
                >
                  {wd}
                </div>
              ))}

              {/* Empty cells for first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="border min-h-[80px] p-1 bg-white dark:bg-slate-800" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayEvents = eventsByDate[day] || [];
                return (
                  <div
                    key={day}
                    className="border min-h-[80px] p-1 bg-white dark:bg-slate-800 flex flex-col gap-1"
                  >
                    <div className="font-bold">{day}</div>
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className="text-xs md:text-sm p-1 bg-blue-950 text-white rounded"
                      >
                        {e.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
