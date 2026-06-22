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

interface QuestionnairePromptProps {
  clientName: string
  sessionType: string
  sessionDate: string
  questionnaireUrl: string
}

export function QuestionnairePromptEmail({
  clientName,
  sessionType,
  sessionDate,
  questionnaireUrl,
}: QuestionnairePromptProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>
        Help me prepare for your session — Clara Monét Photography
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
              Help me prepare for your {sessionType}, {clientName}.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              Your session is scheduled for {sessionDate}. I&apos;ve put
              together a few questions that help me plan the best session for
              you — mood, location preferences, outfit plans, and how
              you&apos;ll use the images.
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#4a4038",
                margin: "0 0 20px",
              }}
            >
              It only takes a few minutes and makes a real difference to the
              photos we make together.
            </Text>

            <Section style={{ marginTop: "32px", marginBottom: "32px" }}>
              <Link
                href={questionnaireUrl}
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
                Complete questionnaire →
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
              If you have any trouble with the link, just reply to this email.
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
