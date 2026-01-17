import { getCalendarEvents } from '../../lib/calendar';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const maxResults = searchParams.get('maxResults') || 9;

  try {
    const events = await getCalendarEvents(Number(maxResults));
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
