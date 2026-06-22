import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { formatDate } from "./utils"

interface ContractPDFParams {
  clientName: string
  contractText: string
}

export async function generateSignedContractPDF({
  clientName,
  contractText,
}: ContractPDFParams): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const [font, boldFont] = await Promise.all([
    doc.embedFont(StandardFonts.TimesRoman),
    doc.embedFont(StandardFonts.TimesRomanBold),
  ])
  const fontSize = 10
  const margin = 50
  const pageWidth = 595
  const pageHeight = 842
  const maxLineWidth = pageWidth - margin * 2
  const lineHeight = fontSize * 1.5

  let page = doc.addPage([pageWidth, pageHeight])

  const signedAt = formatDate(new Date())

  page.drawText("Clara Monét Photography", {
    x: margin,
    y: pageHeight - margin,
    size: 14,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
  })

  page.drawText("Portrait Photography Services Agreement", {
    x: margin,
    y: pageHeight - margin - 25,
    size: 11,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  })

  let cursorY = pageHeight - margin - 60

  const paragraphs = contractText.split("\n")
  for (const paragraph of paragraphs) {
    if (cursorY < margin + 100) {
      page = doc.addPage([pageWidth, pageHeight])
      cursorY = pageHeight - margin
    }

    const isSectionHeader = /^[A-Z][A-Z ]{2,}$/.test(paragraph.trim())
    const isClauseHeader = /^\d+\.\s[A-Z]/.test(paragraph.trim())

    const currentFont = isSectionHeader || isClauseHeader ? boldFont : font
    const currentSize = isSectionHeader ? 11 : fontSize
    const currentColor = isSectionHeader
      ? rgb(0.15, 0.15, 0.15)
      : rgb(0.2, 0.2, 0.2)

    if (paragraph.trim() === "") {
      cursorY -= lineHeight * 0.5
      continue
    }

    const words = paragraph.split(" ")
    let line = ""

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word
      const testWidth = currentFont.widthOfTextAtSize(testLine, currentSize)

      if (testWidth > maxLineWidth && line.length > 0) {
        page.drawText(line, {
          x: margin,
          y: cursorY,
          size: currentSize,
          font: currentFont,
          color: currentColor,
        })
        cursorY -= lineHeight
        line = word
      } else {
        line = testLine
      }
    }

    if (line) {
      page.drawText(line, {
        x: margin,
        y: cursorY,
        size: currentSize,
        font: currentFont,
        color: currentColor,
      })
      cursorY -= lineHeight
    }

    if (isSectionHeader || isClauseHeader) {
      cursorY -= 4
    }
  }

  cursorY -= 30
  page.drawText("Signed electronically:", {
    x: margin,
    y: cursorY,
    size: 11,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
  })

  cursorY -= 30
  page.drawText(`${clientName}`, {
    x: margin,
    y: cursorY,
    size: 12,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
  })

  cursorY -= 18
  page.drawText(`Signed on: ${signedAt}`, {
    x: margin,
    y: cursorY,
    size: 9,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  })

  cursorY -= 35
  page.drawText("Clara Monét", {
    x: margin,
    y: cursorY,
    size: 12,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
  })

  cursorY -= 18
  page.drawText(`Signed on: ${signedAt}`, {
    x: margin,
    y: cursorY,
    size: 9,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  })

  return doc.save()
}
