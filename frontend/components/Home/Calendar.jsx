"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { HiOutlineListBullet, HiOutlineCalendarDays } from "react-icons/hi2";

const startOf = (e) => new Date(e.start.dateTime || `${e.start.date}T00:00:00`);

const formatTime = (dateObj) => {
  if (!dateObj) return "";
  if (!dateObj.dateTime) return "All day";
  const date = new Date(dateObj.dateTime);
  return date.toLocaleTimeString("default", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [eventsToShow, setEventsToShow] = useState(6);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar?maxResults=50");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => startOf(e) >= now);
  const visibleEvents = upcomingEvents.slice(0, eventsToShow);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Calendar grid calculations ---
  const calendarDate = new Date();
  calendarDate.setDate(1);
  calendarDate.setMonth(calendarDate.getMonth() + monthOffset);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = {};
  events.forEach((e) => {
    const date = startOf(e);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      (eventsByDate[day] ||= []).push(e);
    }
  });

  const isToday = (day) =>
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day;

  return (
    <section id="events" className="bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <header className="text-center mb-10">
            <p className="text-blue-900 font-semibold tracking-[0.3em] uppercase text-xs mb-3">
              What&apos;s coming up
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-blue-950">
              Church Events
            </h2>
            <div className="w-20 h-1 bg-yellow-300 mx-auto mt-5 rounded-full" />

            <div className="inline-flex gap-1 mt-8 bg-white p-1 rounded-full shadow-sm">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  view === "list"
                    ? "bg-blue-950 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <HiOutlineListBullet size={18} /> List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  view === "calendar"
                    ? "bg-blue-950 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <HiOutlineCalendarDays size={18} /> Calendar
              </button>
            </div>
          </header>
        </Reveal>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-64 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : view === "list" ? (
          upcomingEvents.length === 0 ? (
            <p className="text-center text-slate-400 py-16">
              No upcoming events right now — please check back soon.
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleEvents.map((e, i) => {
                  const date = startOf(e);
                  return (
                    <Reveal key={e.id} delay={(i % 3) * 100}>
                      <article
                        onClick={() => setSelected(e)}
                        className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {e.imageUrl ? (
                          <div className="relative h-40 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={e.imageUrl}
                              alt={e.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 text-center shadow-lg">
                              <p className="text-[10px] uppercase text-blue-900 font-bold leading-none">
                                {date.toLocaleDateString("default", {
                                  month: "short",
                                })}
                              </p>
                              <p className="text-xl font-bold text-blue-950 leading-tight">
                                {date.getDate()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-950 text-white p-4 grid place-items-center">
                            <p className="text-xs uppercase tracking-widest opacity-80">
                              {date.toLocaleDateString("default", {
                                weekday: "long",
                              })}
                            </p>
                            <p className="text-4xl font-bold leading-tight">
                              {date.getDate()}
                            </p>
                            <p className="text-xs uppercase tracking-widest opacity-80">
                              {date.toLocaleDateString("default", {
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        )}

                        <div className="p-5 flex-1 flex flex-col gap-2">
                          <h3 className="font-bold text-lg text-blue-950 leading-snug">
                            {e.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            ⏰ {formatTime(e.start)}
                            {e.end && e.end.dateTime
                              ? ` – ${formatTime(e.end)}`
                              : ""}
                          </p>
                          {e.location && (
                            <p className="text-sm text-slate-500">
                              📍 {e.location}
                            </p>
                          )}
                          {e.description && (
                            <p className="text-sm text-slate-600 line-clamp-3 mt-1">
                              {e.description}
                            </p>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              {eventsToShow < upcomingEvents.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setEventsToShow(eventsToShow + 6)}
                    className="px-8 py-3 border-2 border-blue-950 text-blue-950 rounded-lg font-semibold hover:bg-blue-950 hover:text-white transition-all duration-300"
                  >
                    Load More Events
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          <Reveal>
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
              <div className="flex justify-between items-center mb-5">
                <button
                  onClick={() => setMonthOffset(monthOffset - 1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-950 font-semibold transition"
                >
                  ‹ Prev
                </button>
                <h3 className="text-lg md:text-xl font-bold text-blue-950">
                  {calendarDate.toLocaleDateString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => setMonthOffset(monthOffset + 1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-950 font-semibold transition"
                >
                  Next ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {weekDays.map((wd) => (
                  <div
                    key={wd}
                    className="text-center text-[11px] md:text-sm font-bold text-blue-950 pb-2"
                  >
                    <span className="hidden sm:inline">{wd}</span>
                    <span className="sm:hidden">{wd[0]}</span>
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[70px]" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dayEvents = eventsByDate[day] || [];
                  return (
                    <div
                      key={day}
                      className={`min-h-[70px] md:min-h-[90px] rounded-lg p-1 md:p-1.5 flex flex-col gap-1 border transition ${
                        isToday(day)
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          isToday(day) ? "text-yellow-700" : "text-slate-500"
                        }`}
                      >
                        {day}
                      </span>
                      {dayEvents.slice(0, 2).map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setSelected(e)}
                          title={e.name}
                          className="text-[9px] md:text-[11px] leading-tight px-1 py-0.5 bg-blue-950 text-white rounded truncate text-left hover:bg-blue-800 transition"
                        >
                          {e.name}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-slate-400">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* Event detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-[fadeInUp_0.3s_ease-out]"
            onClick={(ev) => ev.stopPropagation()}
          >
            {selected.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="w-full h-52 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-blue-900 font-bold mb-2">
                {startOf(selected).toLocaleDateString("default", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mb-3">
                {selected.name}
              </h3>
              <p className="text-sm text-slate-500 mb-1">
                ⏰ {formatTime(selected.start)}
                {selected.end?.dateTime ? ` – ${formatTime(selected.end)}` : ""}
              </p>
              {selected.location && (
                <p className="text-sm text-slate-500 mb-4">
                  📍 {selected.location}
                </p>
              )}
              {selected.description && (
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selected.description}
                </p>
              )}
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
