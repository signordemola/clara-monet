# Clara Monét Photography

A studio management system for a UK portrait photography business. Handles the full client lifecycle from inquiry to gallery delivery and balance payment.

## What it does

- **Public inquiry form** on the landing page
- **Owner dashboard** to review, approve, and decline inquiries
- **Booking flow** where clients sign a contract and pay a booking fee via Stripe
- **Client portal** to track session progress, submit a questionnaire, and pay the balance
- **Job pipeline** to manage sessions from booking through delivery
- **Client directory** with contact details, GDPR consent status, and session history
- **Service settings** to edit session type pricing and booking fees inline

## Tech stack

- Next.js 16 App Router
- Prisma 7 + PostgreSQL
- Stripe (test mode)
- Resend + React Email
- iron-session (owner auth)
- TanStack Query + Zustand
- shadcn Base UI + Tailwind v4

## Getting started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the values

   ```bash
   cp .env.example .env
   ```

3. Set up the database

   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

4. Run the Stripe CLI to forward webhooks to localhost

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

5. Start the dev server

   ```bash
   pnpm dev
   ```

## Environment variables

| Variable                             | Purpose                                        |
| ------------------------------------ | ---------------------------------------------- |
| `DATABASE_URL`                       | PostgreSQL connection string                   |
| `STRIPE_SECRET_KEY`                  | Stripe secret key (test mode)                  |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret                  |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                         |
| `RESEND_API_KEY`                     | Resend API key                                 |
| `EMAIL_FROM`                         | Sender address for all emails                  |
| `OWNER_PASSWORD_HASH`                | SHA-256 hex of the owner password              |
| `SESSION_SECRET`                     | iron-session cookie encryption key             |
| `NEXT_PUBLIC_BASE_URL`               | Public base URL (e.g. `http://localhost:3000`) |
| `REVIEW_URL`                         | Link to your Google review page                |

Generate the owner password hash:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"
```

## Owner access

- Log in at `/owner/login`
- Default password is whatever you hashed into `OWNER_PASSWORD_HASH`

## Client portal

After a booking is confirmed, the client receives a unique portal link. The footer of the public site links to one seeded client portal for convenience.

## Seeded data

`prisma/seed.ts` creates three session types, seven clients, and seven jobs — one at each pipeline stage. New inquiries are also seeded so the owner dashboard has content on first run.

## Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `pnpm dev`        | Start development server |
| `pnpm build`      | Production build         |
| `pnpm test`       | Run Vitest once          |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm lint`       | Run ESLint               |
| `pnpm typecheck`  | Run TypeScript           |

## Testing payments

Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC.

## Licence

Private — built for Clara Monét Photography.
