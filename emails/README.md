# Email Templates

Eight templates cover the client lifecycle from inquiry to review request. They are sent inline by route handlers rather than via a scheduled cron.

## Active

| Template                      | Triggers                                      | API Route                                      |
| ----------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `inquiry-acknowledgement.tsx` | Client submits inquiry form                   | `app/api/inquiry/route.ts`                     |
| `booking-link.tsx`            | Clara approves inquiry                        | `app/api/owner/inquiries/[inquiryId]/route.ts` |
| `booking-confirmed.tsx`       | Booking fee payment succeeds (Stripe webhook) | `app/api/stripe/webhook/route.ts`              |
| `questionnaire-prompt.tsx`    | Booking is confirmed                          | `app/api/stripe/webhook/route.ts`              |
| `editing-underway.tsx`        | Clara advances stage to SESSION_COMPLETE      | `app/api/owner/jobs/[jobId]/stage/route.ts`    |
| `gallery-delivery.tsx`        | Clara delivers gallery                        | `app/api/owner/jobs/[jobId]/gallery/route.ts`  |
| `review-request.tsx`          | Clara advances stage to COMPLETE              | `app/api/owner/jobs/[jobId]/stage/route.ts`    |
| `inquiry-declined.tsx`        | Clara declines inquiry                        | `app/api/owner/inquiries/[inquiryId]/route.ts` |

## Brand Tokens

- Font: Fraunces (display) + Inter (sans, only via inline styles for email compat)
- Base: `#f7f4f0`
- Card: `#ffffff`
- Ink: `#2c241c`
- Muted: `#8c827a`
- Hairline: `#e6e0d8`
- Clay accent: `#b8a898`
- All emails include ICO notice and UK date formatting
