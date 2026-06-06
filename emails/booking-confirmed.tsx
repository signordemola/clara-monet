import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components"
import { formatDate, formatCurrency } from "@/lib/utils"

interface BookingConfirmedProps {
  clientName: string
  sessionType: string
  sessionDate: string
  sessionLocation?: string
  bookingFee: number
  balanceAmount: number
  portalUrl: string
}

export function BookingConfirmedEmail({
  clientName,
  sessionType,
  sessionDate,
  sessionLocation,
  bookingFee,
  balanceAmount,
  portalUrl,
}: BookingConfirmedProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>You&apos;re booked — Clara Monét Photography</Preview>
      <Body
        style={{
          backgroundColor: "#f7f4f0",
          fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Section style={{ marginBottom: "40px" }}>
            <Text
              style={{
                fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                fontSize: "20px",
                fontWeight: 300,
                color: "#2c241c",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Clara Monét
            </Text>
            <Text
              style={{
                fontSize: "10px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.22em",
                color: "#8c827a",
                margin: "4px 0 0",
              }}
            >
              Photography · East London
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              border: "1px solid #e6e0d8",
            }}
          >
            <Text
              style={{
                fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                fontSize: "24px",
                fontWeight: 300,
                color: "#2c241c",
                margin: "0 0 24px",
                letterSpacing: "-0.01em",
              }}
            >
              You&apos;re booked, {clientName}.
            </Text>

            <Section
              style={{
                backgroundColor: "#f7f4f0",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <Row label="Session" value={sessionType} />
              <Row label="Date" value={sessionDate} />
              {sessionLocation && (
                <Row label="Location" value={sessionLocation} />
              )}
              <Row
                label="Booking fee paid"
                value={formatCurrency(bookingFee)}
              />
              <Row
                label="Balance due on delivery"
                value={formatCurrency(balanceAmount)}
              />
            </Section>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              Your signed contract is attached to this email. You&apos;ll
              receive a pre-session questionnaire in the next 48 hours to help
              me prepare for your session.
            </Text>

            <Section style={{ marginTop: "32px", marginBottom: "16px" }}>
              <Link
                href={portalUrl}
                style={{
                  backgroundColor: "#2c241c",
                  color: "#f7f4f0",
                  padding: "16px 32px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View your session portal →
              </Link>
            </Section>
          </Section>

          <Section style={{ marginTop: "32px" }}>
            <Text
              style={{
                fontSize: "11px",
                lineHeight: "1.6",
                color: "#a6988a",
                margin: 0,
              }}
            >
              Clara Monét Photography · Hackney E8
              <br />
              ICO ZA834912 · England & Wales
              <br />
              {formatDate(now)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #e6e0d8",
        fontSize: "14px",
      }}
    >
      <Text style={{ color: "#8c827a", margin: 0, fontSize: "14px" }}>
        {label}
      </Text>
      <Text
        style={{
          color: "#2c241c",
          margin: 0,
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        {value}
      </Text>
    </div>
  )
}
