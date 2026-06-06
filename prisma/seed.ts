import { prisma } from "../lib/db"

async function main() {
  const personalBrand = await prisma.sessionType.upsert({
    where: { slug: "personal-brand" },
    update: {},
    create: {
      slug: "personal-brand",
      name: "Personal Brand",
      description:
        "A three-hour session for founders, coaches and consultants.",
      duration: 180,
      price: 35000,
      bookingFee: 8800,
      imageCount: "40–60 edited images",
      turnaround: "2–3 weeks",
      displayOrder: 1,
    },
  })

  const family = await prisma.sessionType.upsert({
    where: { slug: "family" },
    update: {},
    create: {
      slug: "family",
      name: "Family Portrait",
      description:
        "Ninety minutes, on location in London or in your home. Documentary in spirit.",
      duration: 90,
      price: 25000,
      bookingFee: 6300,
      imageCount: "25–35 edited images",
      turnaround: "1–2 weeks",
      displayOrder: 2,
    },
  })

  const headshots = await prisma.sessionType.upsert({
    where: { slug: "headshots" },
    update: {},
    create: {
      slug: "headshots",
      name: "Professional Headshots",
      description:
        "Sixty focused minutes for one polished, contemporary headshot set.",
      duration: 60,
      price: 17500,
      bookingFee: 4400,
      imageCount: "15–25 edited images",
      turnaround: "1 week",
      displayOrder: 3,
    },
  })

  const clients = await Promise.all([
    prisma.client.upsert({
      where: { email: "sarah@devlinco.co.uk" },
      update: {},
      create: {
        email: "sarah@devlinco.co.uk",
        name: "Sarah Devlin",
        gdprConsent: true,
        gdprConsentAt: new Date("2026-05-12T09:14:00Z"),
      },
    }),
    prisma.client.upsert({
      where: { email: "priya.okafor@gmail.com" },
      update: {},
      create: {
        email: "priya.okafor@gmail.com",
        name: "Priya & James Okafor",
        gdprConsent: true,
        gdprConsentAt: new Date("2026-05-04T19:31:00Z"),
      },
    }),
    prisma.client.upsert({
      where: { email: "m.hall@hallstrategy.com" },
      update: {},
      create: {
        email: "m.hall@hallstrategy.com",
        name: "Marcus Hall",
        gdprConsent: true,
        gdprConsentAt: new Date("2026-05-01T11:02:00Z"),
      },
    }),
    prisma.client.upsert({
      where: { email: "imogen@studio-est.co" },
      update: {},
      create: {
        email: "imogen@studio-est.co",
        name: "Imogen Estévez",
        gdprConsent: true,
        gdprConsentAt: new Date("2026-04-18T08:40:00Z"),
      },
    }),
    prisma.client.upsert({
      where: { email: "louisa.wright@me.com" },
      update: {},
      create: {
        email: "louisa.wright@me.com",
        name: "The Wright Family",
        gdprConsent: true,
        gdprConsentAt: new Date("2026-04-10T20:11:00Z"),
      },
    }),
  ])

  const [sarah, priya, marcus, imogen, wright] = clients

  await prisma.inquiry.createMany({
    data: [
      {
        name: "Hana Westbrook",
        email: "hana@westbrook.studio",
        sessionTypePref: "personal-brand",
        preferredDate: "Late June, weekday mornings",
        message:
          "I'm relaunching my coaching practice in July and need a proper library — website, LinkedIn, press kit.",
        status: "NEW",
      },
      {
        name: "Daniel Park",
        email: "d.park@parkventures.io",
        sessionTypePref: "headshots",
        preferredDate: "Any Tuesday in June",
        message:
          "Need a refreshed headshot set for a board appointment announcement. Happy to travel to Hackney.",
        status: "NEW",
      },
      {
        name: "Lina Caruso",
        email: "lina.c@gmail.com",
        sessionTypePref: "family",
        preferredDate: "Weekend, mid-July",
        message:
          "Our youngest turns two in August and we'd love something outdoors, maybe Victoria Park. Three of us.",
        status: "NEW",
      },
    ],
    skipDuplicates: true,
  })

  await prisma.job.createMany({
    data: [
      {
        clientId: sarah.id,
        sessionTypeId: personalBrand.id,
        stage: "BOOKED",
        sessionDate: new Date("2026-06-08T10:00:00Z"),
        sessionLocation: "Hackney studio",
        totalPrice: 35000,
        bookingFee: 8800,
        balanceAmount: 26200,
        bookingFeeStatus: "HELD",
        balanceStatus: "PENDING",
        sessionToken: "demo-sarah",
        contractSignedAt: new Date("2026-05-25T09:21:00Z"),
        modelReleaseGranted: true,
        ownerNotes: "Coach launching new programme. Wants warm, approachable.",
      },
      {
        clientId: priya.id,
        sessionTypeId: family.id,
        stage: "QUESTIONNAIRE_DONE",
        sessionDate: new Date("2026-06-14T09:00:00Z"),
        sessionLocation: "Victoria Park",
        totalPrice: 25000,
        bookingFee: 6300,
        balanceAmount: 18700,
        bookingFeeStatus: "HELD",
        balanceStatus: "PENDING",
        sessionToken: "demo-priya",
        contractSignedAt: new Date("2026-05-20T10:00:00Z"),
        modelReleaseGranted: true,
        questionnaireSentAt: new Date("2026-05-22T08:00:00Z"),
      },
      {
        clientId: marcus.id,
        sessionTypeId: headshots.id,
        stage: "SESSION_COMPLETE",
        sessionDate: new Date("2026-06-03T14:00:00Z"),
        sessionLocation: "His office, London Bridge",
        totalPrice: 17500,
        bookingFee: 4400,
        balanceAmount: 13100,
        bookingFeeStatus: "HELD",
        balanceStatus: "PENDING",
        sessionToken: "demo-marcus",
        contractSignedAt: new Date("2026-05-10T14:00:00Z"),
        modelReleaseGranted: true,
        questionnaireSentAt: new Date("2026-05-12T08:00:00Z"),
      },
      {
        clientId: imogen.id,
        sessionTypeId: personalBrand.id,
        stage: "GALLERY_SENT",
        sessionDate: new Date("2026-05-21T11:00:00Z"),
        sessionLocation: "Hackney studio",
        totalPrice: 35000,
        bookingFee: 8800,
        balanceAmount: 26200,
        bookingFeeStatus: "HELD",
        balanceStatus: "PENDING",
        sessionToken: "demo-imogen",
        contractSignedAt: new Date("2026-04-25T09:00:00Z"),
        modelReleaseGranted: true,
        galleryUrl: "https://claramonet.pic-time.com/demo-gallery",
        galleryDeliveredAt: new Date("2026-05-28T10:00:00Z"),
        imageCount: 55,
        balanceInvoiceSentAt: new Date("2026-05-28T10:00:00Z"),
        balanceDueAt: new Date("2026-06-04T10:00:00Z"),
        questionnaireSentAt: new Date("2026-04-27T08:00:00Z"),
        editingEmailSentAt: new Date("2026-05-23T12:00:00Z"),
      },
      {
        clientId: wright.id,
        sessionTypeId: family.id,
        stage: "PAID",
        sessionDate: new Date("2026-05-18T16:30:00Z"),
        sessionLocation: "Their home, Clapham",
        totalPrice: 25000,
        bookingFee: 6300,
        balanceAmount: 18700,
        bookingFeeStatus: "HELD",
        balanceStatus: "PAID",
        sessionToken: "demo-wright",
        contractSignedAt: new Date("2026-04-20T12:00:00Z"),
        modelReleaseGranted: false,
        galleryUrl: "https://claramonet.pic-time.com/wright-family",
        galleryDeliveredAt: new Date("2026-05-04T09:00:00Z"),
        imageCount: 32,
        balanceInvoiceSentAt: new Date("2026-05-04T09:00:00Z"),
        balanceDueAt: new Date("2026-05-11T09:00:00Z"),
        balancePaidAt: new Date("2026-05-08T14:00:00Z"),
        questionnaireSentAt: new Date("2026-04-22T08:00:00Z"),
        editingEmailSentAt: new Date("2026-04-28T12:00:00Z"),
      },
    ],
    skipDuplicates: true,
  })

  const marcusJob = await prisma.job.findUnique({
    where: { sessionToken: "demo-marcus" },
  })
  if (marcusJob) {
    await prisma.questionnaire.upsert({
      where: { jobId: marcusJob.id },
      update: {},
      create: {
        jobId: marcusJob.id,
        sessionGoal: "LinkedIn and company website headshots",
        participants: "Just me",
        locationPref: "My office, London Bridge",
        mood: "professional and polished",
        outfitPlans: "Navy suit, one tie change",
        imageUsage: "LinkedIn, website",
        additionalNotes: "North-facing windows in meeting room",
        modelRelease: true,
      },
    })
  }

  const priyaJob = await prisma.job.findUnique({
    where: { sessionToken: "demo-priya" },
  })
  if (priyaJob) {
    await prisma.questionnaire.upsert({
      where: { jobId: priyaJob.id },
      update: {},
      create: {
        jobId: priyaJob.id,
        sessionGoal: "Family memories with our little one",
        participants: "Priya, James and Aanya (2)",
        locationPref: "Victoria Park",
        mood: "warm and natural",
        outfitPlans: "Coordinated but not matching",
        modelRelease: true,
      },
    })
  }

  console.log("Seed complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
