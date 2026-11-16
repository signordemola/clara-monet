# Clara Monét Photography

A studio management system for a portrait photographer. It covers the client journey from first inquiry to gallery delivery and final payment.

<!-- Screenshot: add an image of the owner dashboard here -->
<!-- ![Clara Monét Photography](docs/screenshot.png) -->

**Live site:** https://clara-monet.vercel.app

## The problem

A portrait photographer handles inquiries, contracts, fees, questionnaires and gallery delivery, often across email and several separate tools.
Steps get missed and clients do not know what happens next.
This system keeps each job in one pipeline, and gives each client one private link to follow their session.

## Features

**For clients**

- Inquiry form on the public site, with an acknowledgement email.
- Private booking link after the owner approves. The client reads and signs the contract, then pays the booking fee with Stripe.
- A PDF of the signed contract.
- Client portal with a private link: session progress, pre-session questionnaire, and balance payment.
- Portal lookup by email address.

**For the owner**

- Sign-in with an encrypted session cookie.
- Dashboard, and an inquiry inbox to review, approve or decline.
- Job pipeline with seven stages, from booked to complete.
- Gallery delivery: add the gallery link and the client gets an email.
- Client directory with contact details, consent status and session history.
- Service settings to edit session prices and booking fees.

**Under the hood**

- Emails for each step: inquiry received, inquiry declined, booking link, booking confirmed, questionnaire, editing underway, gallery delivery and review request.
- Stripe webhook with signature check.
- Request validation with Zod on the API routes.
- Security headers, including a Content Security Policy.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- PostgreSQL with Prisma 7
- Stripe
- Resend and React Email
- iron-session
- TanStack Query and Zustand
- Tailwind CSS 4 and shadcn/ui
- Vitest and Testing Library
- pnpm

## Run locally

You need:

- Node.js 20.19+, 22.12+ or 24+ (the versions Prisma 7 supports)
- pnpm 12
- A PostgreSQL database
- Stripe test keys and a Resend API key

```bash
pnpm install
cp .env.example .env
pnpm exec prisma migrate deploy
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000`. The owner sign-in page is at `/owner/login`.

To receive Stripe webhooks on your machine:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

In Stripe test mode, pay with card `4242 4242 4242 4242`, any future expiry date and any CVC.

### Environment variables

Set these in `.env`. The values in `.env.example` are fake.

| Variable                             | Purpose                                         |
| ------------------------------------ | ----------------------------------------------- |
| `DATABASE_URL`                       | PostgreSQL connection URL                       |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                               |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret                   |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                          |
| `RESEND_API_KEY`                     | Resend API key                                  |
| `EMAIL_FROM`                         | Sender name and address                         |
| `OWNER_EMAIL`                        | Owner sign-in email                             |
| `OWNER_PASSWORD_HASH`                | SHA-256 hex of the owner password               |
| `SESSION_SECRET`                     | Key that encrypts the owner session cookie      |
| `NEXT_PUBLIC_BASE_URL`               | Site URL, used for links in emails              |
| `REVIEW_URL`                         | Link to the review page, used in the last email |

Create the password hash with:

```bash
printf 'your-password' | shasum -a 256
```

### Other commands

```bash
pnpm typecheck   # TypeScript check
pnpm lint        # ESLint
pnpm test        # Vitest tests
pnpm build       # type check, lint and production build
pnpm db:studio   # database browser
```

## Status and what's next

The full journey works: inquiry, approval, contract, booking fee, questionnaire, gallery delivery and balance payment.
The live site runs Stripe in test mode. Owner sign-in details for the live site are in `login.txt`.
The seed adds session types, clients, jobs and inquiries, so the dashboard has content on first run.

Not built yet:

- Rate limits on the public endpoints.
- End-to-end browser tests. The current tests cover hooks, API helpers, stages and policy rules.
- Gallery hosting. The owner pastes a link to a gallery that is hosted elsewhere.

---

Built by [Adedamola](https://github.com/signordemola) · [Demola Studio](https://www.demolastudio.com)

See also: [booking-engine](https://github.com/signordemola/booking-engine)
