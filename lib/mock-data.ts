export type SessionType = "personal-brand" | "family" | "headshots"

export const SESSION_TYPES: Record<
  SessionType,
  {
    name: string
    blurb: string
    duration: string
    images: string
    turnaround: string
    price: number // pence
    fee: number // pence
  }
> = {
  "personal-brand": {
    name: "Personal Brand",
    blurb:
      "A three-hour session for founders, coaches and consultants. A library of images you'll use everywhere — website, LinkedIn, press.",
    duration: "3 hours",
    images: "40–60 edited",
    turnaround: "2–3 weeks",
    price: 35000,
    fee: 8800,
  },
  family: {
    name: "Family Portrait",
    blurb:
      "Ninety minutes, on location in London or in your home. Documentary in spirit — quiet moments, not posed grids.",
    duration: "90 minutes",
    images: "25–35 edited",
    turnaround: "1–2 weeks",
    price: 25000,
    fee: 6300,
  },
  headshots: {
    name: "Professional Headshots",
    blurb:
      "Sixty focused minutes for one polished, contemporary headshot set. Studio or your office, north-facing light.",
    duration: "60 minutes",
    images: "15–25 edited",
    turnaround: "1 week",
    price: 17500,
    fee: 4400,
  },
}

export const formatPence = (p: number) =>
  `£${(p / 100).toLocaleString("en-GB", { minimumFractionDigits: 0 })}`
