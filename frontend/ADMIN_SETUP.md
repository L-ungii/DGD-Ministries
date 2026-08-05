# DGD Website — Admin Panel Setup

The admin dashboard lets you add events, upload photos, post notices and read
prayer requests without touching any code. It stores everything — including
uploaded photos — in a plain **PostgreSQL** database, which you can browse or
edit directly with **pgAdmin** any time. No separate storage service needed.

Two things to set up: a Postgres database and your own admin login. About 10
minutes total.

---

## 1. Create a Postgres database

Since this site deploys to Vercel/Netlify (no persistent server of their own),
the database needs to live somewhere reachable over the network. **Neon**
(recommended) is built for exactly this — serverless-friendly, generous free
tier, and it's still 100% plain Postgres underneath, so pgAdmin connects to it
exactly like any other database.

1. Go to <https://neon.tech> and sign up.
2. Create a project (any name/region).
3. On the project dashboard, copy the **connection string** — it looks like:
   ```
   postgres://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Paste it into `frontend/.env.local` as:
   ```
   DATABASE_URL=postgres://user:password@ep-xxxx.region.aws.neon.tech/dbname
   ```

Railway and Render both work the same way if you'd rather use one of those —
just copy their connection string into `DATABASE_URL`.

### Connecting with pgAdmin

Open pgAdmin → **Add New Server** → paste the host/port/user/password/database
from the same connection string (pgAdmin wants them as separate fields, not
the one-line URL). You can now browse every table, run queries, or edit rows
by hand whenever you like — the website and pgAdmin are just two different
clients talking to the same database.

## 2. Create the tables

1. Open the file [`db/schema.sql`](db/schema.sql) in this repo and copy it.
2. Paste it into pgAdmin's **Query Tool** (right-click your database → Query
   Tool) and click **Execute** (▶).

That creates the seven tables (events, gallery, media, announcements,
prayer_requests, quiz_scores, admin_users) and some indexes. It's safe to run
more than once. `media` is where uploaded photo bytes actually live — events
and gallery photos just point at a row in it.

## 3. Set the session secret

The admin login uses a signed cookie instead of a database session, so it
works on serverless hosting. Generate a random secret:

```bash
openssl rand -base64 32
```

Add it to `.env.local`:

```
SESSION_SECRET=paste-the-random-string-here
```

## 4. Create your admin login

There's deliberately no public "sign up" page — accounts are only created
from the command line, so nobody can register themselves as an admin.

```bash
cd frontend
DATABASE_URL="postgres://..." node scripts/create-admin.mjs admin@church.co.za "a strong password"
```

(Use the same `DATABASE_URL` you put in `.env.local`.) Run it again with a
different email to add a second admin, or with the same email to reset a
password.

## 5. Restart and sign in

```bash
npm run dev
```

Open <http://localhost:3000/admin> and sign in with the account from step 4.

---

## Using the dashboard

| Page              | What it does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| **Dashboard**     | Counts at a glance and your next five events.                                 |
| **Events**        | Add/edit/delete events with a date, time, location, description and poster. Untick "Visible" to draft one. These appear on the homepage next to your Google Calendar events. |
| **Gallery**       | Upload many photos at once, group them into albums, add captions. They show on `/gallery` and in the homepage strip. |
| **Announcements** | Short notices that scroll in a yellow banner under the navbar. Set a "hide after" time and it disappears by itself. |
| **Prayer Requests** | Everything submitted at `/prayer`. Mark them as prayed for, or reply by email. |

Deleting a gallery photo also deletes its row from `media`, so the database
doesn't fill up with orphaned images over time. Uploads are capped at 5MB each
and resized nowhere — keep source photos reasonably compressed, since every
one adds directly to your database's storage usage.

---

## 6. Contact form email (optional but recommended)

The contact form at `/contact` sends real email through SMTP. Add to
`.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourchurchaddress@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_TO=whoever-should-receive-messages@gmail.com
```

For Gmail you must use an **App Password**, not your normal password:
<https://myaccount.google.com/apppasswords> (requires 2-step verification on).

Until these are set, the form politely tells visitors to phone instead.

---

## Deploying

Add **every** variable from `.env.local` to your host's Environment Variables
settings (Vercel: Project Settings → Environment Variables). Photos and
events live in Neon, so they survive every deploy — nothing depends on the app
server's own disk.

---

## If something isn't working

**"Admin panel not connected yet"** — `DATABASE_URL` is missing or misspelt in
`.env.local`. Restart the dev server after editing that file; Next.js only
reads it at startup.

**"Incorrect email or password"** — the account doesn't exist yet, or the
password was typed wrong. Re-run `create-admin.mjs` to reset it.

**Events save but don't show on the homepage** — check the event is ticked
"Visible on the website" and that its date is in the future. The homepage only
lists upcoming events.

**Can't connect from pgAdmin** — make sure you copied the host/port/database
name from the connection string correctly, and that "Require SSL" is turned on
in the connection's SSL tab (Neon requires it).

**Database storage filling up** — since photos live in Postgres, a lot of
high-resolution uploads will grow your database faster than it would with
external file storage. Neon's free tier includes several GB, which is plenty
for typical church-photo use, but it's worth knowing where the growth comes
from if you ever hit a limit.
