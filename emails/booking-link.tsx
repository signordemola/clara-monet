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
import { formatDate } from "@/lib/utils"

interface BookingLinkProps {
  clientName: string
  sessionType: string
  bookingUrl: string
  ownerMessage?: string
}

export function BookingLinkEmail({
  clientName,
  sessionType,
  bookingUrl,
  ownerMessage,
}: BookingLinkProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>
        I&apos;d love to work with you — Clara Monét Photography
      </Preview>
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
              I&apos;d love to work with you, {clientName}.
            </Text>

            {ownerMessage && (
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4a4038",
                  margin: "0 0 20px",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{ownerMessage}&rdquo;
              </Text>
            )}

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              Your {sessionType} session is ready to book. Follow the link below
              to review your contract, sign, and pay the booking fee to secure
              your date.
            </Text>

            <Section style={{ marginTop: "32px", marginBottom: "32px" }}>
              <Link
                href={bookingUrl}
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
                View your booking →
              </Link>
            </Section>

            <Text
              style={{
                fontSize: "12px",
                lineHeight: "1.5",
                color: "#a6988a",
                margin: 0,
              }}
            >
              This link is unique to you. The booking fee is 25% of your session
              total and is non-refundable.
            </Text>
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
