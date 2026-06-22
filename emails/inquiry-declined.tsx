import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components"
import { formatDate } from "@/lib/utils"

interface InquiryDeclinedProps {
  clientName: string
}

export function InquiryDeclinedEmail({ clientName }: InquiryDeclinedProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>Clara Monét Photography</Preview>
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
              Thank you for reaching out, {clientName}.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              I really appreciate you considering Clara Monét Photography for
              your session. Unfortunately, I&apos;m not able to take on new
              bookings at the moment.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: 0,
              }}
            >
              I wish you all the best with your shoot and hope our paths cross
              another time.
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
