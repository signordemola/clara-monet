import { formatDate, formatCurrency } from "./utils"

interface ContractParams {
  clientName: string
  photographerName: string
  sessionTypeName: string
  sessionDate: string
  sessionTime: string
  sessionLocation: string
  imageCount: string
  turnaround: string
  totalPrice: number
  bookingFee: number
  balanceAmount: number
  balanceDueDescription: string
}

export function generateContractText(params: ContractParams): string {
  const date = new Date()
  const formattedDate = formatDate(date)

  return `
CONTRACT FOR PORTRAIT PHOTOGRAPHY SERVICES

This Agreement is made on ${formattedDate}.

1. PARTIES
Photographer: ${params.photographerName}
Client: ${params.clientName}

2. SCOPE OF WORK
Session type: ${params.sessionTypeName}
Date: ${params.sessionDate}
Time: ${params.sessionTime}
Location: ${params.sessionLocation}
Number of edited images: ${params.imageCount}
Delivery format: Digital files via online gallery link

3. TURNAROUND TIME
Edited images will be delivered within ${params.turnaround} of the session date.

4. DELIVERY METHOD
Images will be delivered via an online gallery hosted on Pic-Time or Pixieset.
The client will receive a link via email when the gallery is ready.

5. PAYMENT TERMS
Total fee: ${formatCurrency(params.totalPrice)}
Booking fee: ${formatCurrency(params.bookingFee)} (non-refundable, secures the date)
Balance due: ${formatCurrency(params.balanceAmount)} — payable on gallery delivery
${params.balanceDueDescription}

6. LATE PAYMENT
Interest may be charged on overdue balances at 8% per annum in accordance with
the Late Payment of Commercial Debts (Interest) Act 1998.

7. CANCELLATION
14 or more days before the session: Full booking fee refunded.
7 to 14 days before the session: 50% of the booking fee refunded.
Fewer than 7 days before the session: Booking fee forfeited in full.
Client no-show: Booking fee forfeited. Session may be rescheduled at the
photographer's discretion.
If the photographer cancels: Full booking fee refunded and an alternative date offered.

8. COPYRIGHT
Under the Copyright, Designs and Patents Act 1988, the photographer retains
full copyright of all images taken. The client receives a non-exclusive,
non-transferable licence for personal use, commercial use, social media,
website, and print.

9. LICENCE GRANTED TO CLIENT
Personal and commercial use on the client's own website, social media, and print.
The licence is non-exclusive and non-transferable.

10. RAW FILES
RAW or unedited image files are not included in any package.

11. MODEL RELEASE
The client consents to the photographer using images from this session in
their portfolio and marketing materials. This is optional and the client
may opt out without affecting the booking.

12. DATA PROTECTION AND GDPR
Data collected during this booking is used solely for the purpose of
delivering portrait photography services. Data is stored securely and
will not be shared with third parties. The client has the right to
request erasure of their data at any time in accordance with UK GDPR.

13. LIABILITY
The photographer is not liable for events outside their reasonable control,
including but not limited to equipment failure, illness, or circumstances
beyond their control.

14. GOVERNING LAW
This Agreement is governed by the laws of England and Wales.

Signed electronically by:

${params.clientName}
Date: ${formattedDate}

${params.photographerName}
Date: ${formattedDate}
`.trim()
}
