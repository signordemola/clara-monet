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
import { formatCurrency } from "@/lib/utils"

interface GalleryDeliveryProps {
  clientName: string
  galleryUrl: string
  imageCount: number
  balanceAmount: number
  balanceDueDate: string
  portalUrl: string
}

export function GalleryDeliveryEmail({
  clientName,
  galleryUrl,
  imageCount,
  balanceAmount,
  balanceDueDate,
  portalUrl,
}: GalleryDeliveryProps) {
  const now = new Date()

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>Your gallery is ready — Clara Monét Photography</Preview>
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
              Your gallery is ready, {clientName}.
            </Text>

            <Section
              style={{
                border: "1px solid #e6e0d8",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.2em",
                  color: "#b8a898",
                  margin: "0 0 8px",
                }}
              >
                Your Gallery
              </Text>
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4a4038",
                  margin: "0 0 16px",
                }}
              >
                {imageCount} edited images are waiting for you. You can view,
                download and share from your gallery.
              </Text>
              <Link
                href={galleryUrl}
                style={{
                  backgroundColor: "#2c241c",
                  color: "#f7f4f0",
                  padding: "14px 28px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View your gallery →
              </Link>
            </Section>

            <Section
              style={{
                border: "1px solid #e6e0d8",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.2em",
                  color: "#b8a898",
                  margin: "0 0 8px",
                }}
              >
                Balance Invoice
              </Text>
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4a4038",
                  margin: "0 0 8px",
                }}
              >
                Balance due: {formatCurrency(balanceAmount)}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#8c827a",
                  margin: "0 0 16px",
                }}
              >
                Due by {balanceDueDate}
              </Text>
              <Link
                href={portalUrl}
                style={{
                  backgroundColor: "#2c241c",
                  color: "#f7f4f0",
                  padding: "14px 28px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Pay balance in your portal →
              </Link>
            </Section>

            <Text
              style={{
                fontSize: "13px",
                lineHeight: "1.5",
                color: "#8c827a",
                margin: 0,
              }}
            >
              Payment is due within 7 days. You can view and download your
              images immediately — the gallery is not held against payment.
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
              {now.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
