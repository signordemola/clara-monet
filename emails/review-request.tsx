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

interface ReviewRequestProps {
  clientName: string
  sessionType: string
  reviewUrl: string
}

export function ReviewRequestEmail({
  clientName,
  sessionType,
  reviewUrl,
}: ReviewRequestProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>A quick favour — Clara Monét Photography</Preview>
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
              I hope you&apos;re loving your {sessionType} images, {clientName}.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              If you have a moment, I&apos;d be so grateful for a review. It
              makes a huge difference to a small studio like mine and helps
              other people find their way here.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              No pressure at all — just a link below if you&apos;d like to.
            </Text>

            <Section style={{ marginTop: "32px", marginBottom: "32px" }}>
              <Link
                href={reviewUrl}
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
                Leave a review →
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
