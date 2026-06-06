# Email Templates

Four core templates wire into the demo flow. The remaining eight can be added when dashboard manual-trigger buttons are built in Phase 9.

## Active (Phase 5)

| Template                      | Triggers                                      | API Route                                      |
| ----------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `inquiry-acknowledgement.tsx` | Client submits inquiry form                   | `app/api/inquiry/route.ts`                     |
| `booking-link.tsx`            | Clara approves inquiry                        | `app/api/owner/inquiries/[inquiryId]/route.ts` |
| `booking-confirmed.tsx`       | Booking fee payment succeeds (Stripe webhook) | `app/api/stripe/webhook/route.ts`              |
| `gallery-delivery.tsx`        | Clara delivers gallery                        | `app/api/owner/jobs/[jobId]/gallery/route.ts`  |

## To Add (Phase 9)

| Template                     | When                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `questionnaire-prompt.tsx`   | Clara manually sends questionnaire (dashboard button) |
| `questionnaire-reminder.tsx` | Clara manually sends reminder if overdue              |
| `session-reminder-48h.tsx`   | Clara manually sends 48hr reminder                    |
| `session-reminder-24h.tsx`   | Clara manually sends 24hr reminder                    |
| `editing-underway.tsx`       | Clara advances stage to SESSION_COMPLETE              |
| `balance-reminder.tsx`       | Clara manually sends balance chaser                   |
| `review-request.tsx`         | Clara advances stage to COMPLETE                      |
| `inquiry-declined.tsx`       | Clara declines inquiry                                |

## Brand Tokens

- Font: Fraunces (display) + Inter (sans, only via inline styles for email compat)
- Base: `#f7f4f0`
- Card: `#ffffff`
- Ink: `#2c241c`
- Muted: `#8c827a`
- Hairline: `#e6e0d8`
- Clay accent: `#b8a898`
- All emails include ICO notice and UK date formatting
