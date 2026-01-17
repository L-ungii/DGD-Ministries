// lib/calendar.js
const CALENDAR_API_KEY = process.env.CALENDAR_API_KEY;
const CALENDAR_ID = process.env.CALENDAR_ID;
const BASE_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`;

export const getCalendarEvents = async (maxResults = 8) => {
  if (!CALENDAR_API_KEY || !CALENDAR_ID) {
    throw new Error("Missing CALENDAR_API_KEY or CALENDAR_ID");
  }

  const params = new URLSearchParams({
    orderBy: "startTime",
    singleEvents: "true",
    timeMin: new Date().toISOString(),
    key: CALENDAR_API_KEY,
  });

  if (maxResults) params.append("maxResults", maxResults);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();

  if (!data.items) return [];
  return data.items.map((item) => ({
    id: item.id,
    name: item.summary,
    description: item.description,
    location: item.location,
    start: item.start,
    end: item.end,
    link: item.htmlLink,
  }));
};
