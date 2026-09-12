# Therapy With Rachel — setup (Rachel's accounts)

This project is account-agnostic. Use **Rachel's** GitHub, Vercel, and Sanity accounts — do not wire personal or agency accounts into production.

## 1. GitHub (Rachel)

1. Create a private repo under Rachel's GitHub (or a practice org).
2. Push this codebase.
3. Do not commit `.env.local` (already gitignored).

## 2. Sanity (Rachel)

1. Sign up / sign in at [sanity.io/manage](https://www.sanity.io/manage) with Rachel's email.
2. Create a project named **Therapy With Rachel**, dataset `production`.
3. Create API tokens:
   - **Viewer** (optional) → `SANITY_API_READ_TOKEN`
   - **Editor** with create permission → `SANITY_API_WRITE_TOKEN` (required for contact form inbox)
4. Add CORS origins:
   - `http://localhost:3000`
   - Production domain (e.g. `https://therapywithrachel.com`)
   - Vercel preview pattern if needed (`https://*.vercel.app`)

## 3. Local env

```bash
cp .env.example .env.local
```

Fill in Rachel's Sanity project ID and tokens. Leave Resend blank to use Studio-only inquiries (no email cost).

```bash
npm install
npm run dev
```

Optional: seed editable page documents in Sanity (safe to re-run):

```bash
node scripts/seed-pages.mjs
```

- Site: http://localhost:3000
- Admin editor: http://localhost:3000/admin (Sanity login required)

Sign in at `/admin` with Rachel’s Sanity account. The left menu includes:

- **New messages** — contact form inquiries
- **Edit website pages** — Home, About, Rates, Contact, Privacy (labeled sections)
- **Services** / **Write a blog post** — blog supports images + book CTA blocks
- **Site settings** — practice name, location, Thrizer link

The site ships with fallback copy until CMS content exists.

## 4. Vercel (Rachel)

1. Import the GitHub repo into Rachel's Vercel team/account.
2. Add the same env vars from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL once the domain is ready.
4. Deploy. Connect Rachel's domain when she has it.

## 5. Optional email (Resend)

Free tier is enough for consult inquiries:

1. Create a Resend account (Rachel's).
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and a verified `CONTACT_FROM_EMAIL`.
3. Without these, submissions still save in Sanity Studio.

## 6. Thrizer widget

1. In Thrizer Clinician Portal → Benefits → Widget settings, copy the shareable link or embed URL.
2. Set `NEXT_PUBLIC_THRIZER_WIDGET_URL`, **or** paste the URL into Sanity **Site Settings → Thrizer widget URL**.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local Next.js + Studio |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
