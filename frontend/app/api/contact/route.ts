import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
      c
    ] as string)
  );

export async function POST(req: Request) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("Contact form: SMTP environment variables are not set");
    return Response.json(
      { error: "Email is not configured yet. Please call us instead." },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans never see them.
  if (body.website) return Response.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json(
      { error: "Please fill in your name, email and message." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }

  try {
    const port = Number(SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"DGD Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `Website message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <h2 style="font-family:sans-serif;color:#172554">New message from the website</h2>
        <p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(
          name
        )}<br/>
        <strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="font-family:sans-serif;white-space:pre-wrap;border-left:3px solid #172554;padding-left:12px">${escapeHtml(
          message
        )}</p>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return Response.json(
      { error: "We couldn't send your message. Please try again or call us." },
      { status: 500 }
    );
  }
}
