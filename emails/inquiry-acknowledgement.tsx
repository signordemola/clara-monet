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

interface InquiryAcknowledgementProps {
  clientName: string
  sessionTypePref?: string
  message: string
}

export function InquiryAcknowledgementEmail({
  clientName,
  sessionTypePref,
  message,
}: InquiryAcknowledgementProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>Thank you for your inquiry — Clara Monét Photography</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={wordmark}>Clara Monét</Text>
            <Text style={subtitle}>Photography · East London</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Thank you, {clientName}.</Text>
            <Text style={paragraph}>
              I&apos;ve received your inquiry
              {sessionTypePref ? ` for ${sessionTypePref}` : ""} and I&apos;ll
              review it personally. You can expect a reply within the hour
              during studio days — within the morning on a weekend.
            </Text>

            {message && (
              <Section style={quoteBox}>
                <Text style={quoteText}>Your message:</Text>
                <Text style={quoteBody}>&ldquo;{message}&rdquo;</Text>
              </Section>
            )}

            <Text style={paragraph}>
              Nothing is committed until I&apos;ve sent you a booking link with
              full details. Feel free to reply to this email with any questions.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
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

const body: React.CSSProperties = {
  backgroundColor: "#f7f4f0",
  fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
}

const header: React.CSSProperties = {
  marginBottom: "40px",
}

const wordmark: React.CSSProperties = {
  fontFamily: "'Fraunces', ui-serif, Georgia, serif",
  fontSize: "20px",
  fontWeight: 300,
  color: "#2c241c",
  margin: 0,
  letterSpacing: "-0.01em",
}

const subtitle: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "#8c827a",
  margin: "4px 0 0",
}

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "40px",
  border: "1px solid #e6e0d8",
}

const greeting: React.CSSProperties = {
  fontFamily: "'Fraunces', ui-serif, Georgia, serif",
  fontSize: "24px",
  fontWeight: 300,
  color: "#2c241c",
  margin: "0 0 24px",
  letterSpacing: "-0.01em",
}

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4038",
  margin: "0 0 20px",
}

const quoteBox: React.CSSProperties = {
  backgroundColor: "#f7f4f0",
  padding: "20px",
  marginBottom: "20px",
}

const quoteText: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: "#b8a898",
  margin: "0 0 8px",
}

const quoteBody: React.CSSProperties = {
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "1.5",
  color: "#6b5e52",
  margin: 0,
}

const footer: React.CSSProperties = {
  marginTop: "32px",
}

const footerText: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "1.6",
  color: "#a6988a",
  margin: 0,
}
