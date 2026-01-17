import express from "express";
import path from "path";
import { getCalendarEvents } from "./calendar.js";

const app = express();
const PORT = 3000;

// Serve your static frontend
app.use(express.static(path.resolve('.')));

// Backend endpoint for frontend to fetch events
app.get("/api/calendar", async (req, res) => {
  const maxResults = req.query.maxResults ? Number(req.query.maxResults) : 8;
  try {
    const events = await getCalendarEvents(maxResults);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
