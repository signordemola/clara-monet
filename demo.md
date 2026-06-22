# Clara Monét — Demo & Test Guide

## Owner Login

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `hello@claramonet.co.uk` |
| Password | `changeme123`            |
| URL      | `/owner/login`           |

---

## Production Booking Test

Use these details to submit a real inquiry through the public form, then approve it as owner and complete a live test payment.

### Step 1 — Submit an inquiry

Go to the public site → click **Begin an inquiry** and fill in:

| Field            | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| Name             | `Alex Morgan`                                           |
| Email            | _(use a real inbox you can check)_                      |
| Session interest | Personal Brand                                          |
| Preferred window | Any weekday morning                                     |
| Message          | Testing the booking flow — please approve this inquiry. |

### Step 2 — Approve as owner

1. Log in at `/owner/login`
2. Open the inquiry → fill in date, location, message → **Approve & send link**
3. Check the inbox for the booking email

### Step 3 — Complete the booking

Click **View your booking →** in the email, then:

1. Review and sign the contract
2. Proceed to payment

### Step 4 — Pay with Stripe test card

| Field       | Value                          |
| ----------- | ------------------------------ |
| Card number | `4242 4242 4242 4242`          |
| Expiry      | Any future date (e.g. `12/29`) |
| CVC         | Any 3 digits (e.g. `123`)      |
| Postcode    | Any (e.g. `E8 1AA`)            |

### Step 5 — Verify in owner dashboard

After payment, the job should move to **Questionnaire Sent** in the pipeline.

---

## Stripe Test Cards (other scenarios)

| Scenario           | Card number           |
| ------------------ | --------------------- |
| Payment succeeds   | `4242 4242 4242 4242` |
| Payment declined   | `4000 0000 0000 0002` |
| Requires 3D Secure | `4000 0025 0000 3155` |
| Insufficient funds | `4000 0000 0000 9995` |

---

## Notes

- This project uses **Stripe test mode** — no real money is charged.
- Booking emails are sent via **Resend** from `hello@demoladevop.com`.
- The Stripe webhook endpoint is `/api/stripe/webhook`.
- All timestamps are in UTC.
