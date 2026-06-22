import { prisma } from "../lib/db"

// ─── Date helpers (relative to NOW so stats always look alive) ────────
const now = new Date()
const dayOfWeek = now.getUTCDay() // 0=Sun
const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
const monday = new Date(now)
monday.setUTCDate(now.getUTCDate() + diffToMon)
monday.setUTCHours(0, 0, 0, 0)

/** Day of current week: 0=Mon … 6=Sun */
const thisWeek = (day: number, hour: number) => {
  const d = new Date(monday)
  d.setUTCDate(monday.getUTCDate() + day)
  d.setUTCHours(hour, 0, 0, 0)
  return d
}

const ago = (days: number, hour = 12) => {
  const d = new Date(now)
  d.setUTCDate(now.getUTCDate() - days)
  d.setUTCHours(hour, 0, 0, 0)
  return d
}

async function main() {
  // ─── Session types ──────────────────────────────────────────────
  const personalBrand = await prisma.sessionType.upsert({
    where: { slug: "personal-brand" },
    update: {},
    create: {
      slug: "personal-brand",
      name: "Personal Brand",
      description:
        "A three-hour personal branding session for founders, coaches and consultants. Pre-shoot styling brief, on-location or studio, and a curated gallery of 40–60 polished images for your website, socials and press.",
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
        "Ninety relaxed minutes on location in London or at home. Documentary-style — real laughter, real movement — so your family looks like your family, not a Christmas card.",
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
        "Sixty focused minutes for a sharp, contemporary headshot set. Two outfit changes, natural light or studio, and 15–25 retouched images delivered within one week.",
      duration: 60,
      price: 17500,
      bookingFee: 4400,
      imageCount: "15–25 edited images",
      turnaround: "1 week",
      displayOrder: 3,
    },
  })

  // ─── 11 Clients (3 will have repeat bookings) ──────────────────
  const clientData = [
    {
      email: "sarah@devlinco.co.uk",
      name: "Sarah Devlin",
      phone: "07912 345 678",
      marketingConsent: true,
      gdprConsentAt: ago(50),
    },
    {
      email: "priya.okafor@gmail.com",
      name: "Priya & James Okafor",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(25),
    },
    {
      email: "m.hall@hallstrategy.com",
      name: "Marcus Hall",
      phone: "07834 221 490",
      marketingConsent: true,
      gdprConsentAt: ago(18),
    },
    {
      email: "imogen@studio-est.co",
      name: "Imogen Estévez",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(55),
    },
    {
      email: "louisa.wright@me.com",
      name: "The Wright Family",
      phone: null,
      marketingConsent: false,
      gdprConsentAt: ago(35),
    },
    {
      email: "elena.kowalski@post.co",
      name: "Elena Kowalski",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(12),
    },
    {
      email: "tom.brennan@brennan.io",
      name: "Tom Brennan",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(60),
    },
    {
      email: "amara@osei-coaching.com",
      name: "Amara Osei",
      phone: "07723 456 891",
      marketingConsent: true,
      gdprConsentAt: ago(16),
    },
    {
      email: "nikhil@patel.dev",
      name: "Nikhil Patel",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(15),
    },
    {
      email: "claire.bennett@btinternet.com",
      name: "The Bennett-Johnsons",
      phone: null,
      marketingConsent: true,
      gdprConsentAt: ago(5),
    },
    {
      email: "ayo.adeyemi@chambers.law",
      name: "Ayo Adeyemi",
      phone: "07445 901 234",
      marketingConsent: true,
      gdprConsentAt: ago(8),
    },
  ] as const

  const clients = await Promise.all(
    clientData.map((c) =>
      prisma.client.upsert({
        where: { email: c.email },
        update: {},
        create: {
          email: c.email,
          name: c.name,
          phone: c.phone,
          gdprConsent: true,
          marketingConsent: c.marketingConsent,
          gdprConsentAt: c.gdprConsentAt,
        },
      })
    )
  )

  const [
    sarah,
    priya,
    marcus,
    imogen,
    wright,
    elena,
    tom,
    amara,
    nikhil,
    bennetts,
    ayo,
  ] = clients

  // ─── Inquiries (4 NEW + 1 REVIEWED) ────────────────────────────
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Hana Westbrook",
        email: "hana@westbrook.studio",
        sessionTypePref: "personal-brand",
        preferredDate: "Late June, weekday mornings",
        message:
          "I'm relaunching my coaching practice in July and need a proper library — website hero, LinkedIn banner, press kit thumbnail, and about 20 lifestyle shots. I've got a moodboard on Pinterest I'd love to share.",
        status: "NEW",
        createdAt: ago(0, 4),
      },
      {
        name: "Daniel Park",
        email: "d.park@parkventures.io",
        sessionTypePref: "headshots",
        preferredDate: "Any Tuesday in June",
        message:
          "Just been appointed to the board at a health-tech startup and need something sharper than my LinkedIn selfie. Looking for two or three clean shots — one corporate for the press release, one relaxed.",
        status: "NEW",
        createdAt: ago(1, 14),
      },
      {
        name: "Lina Caruso",
        email: "lina.c@gmail.com",
        phone: "07399 104 221",
        sessionTypePref: "family",
        preferredDate: "Weekend, mid-July",
        message:
          "Our youngest turns two in August and this feels like the right time before she stops sitting still! Three of us — somewhere outdoors, maybe Victoria Park.",
        status: "NEW",
        createdAt: ago(2, 11),
      },
      {
        name: "Rory McMahon",
        email: "rory@mcmahon-physio.co.uk",
        sessionTypePref: "personal-brand",
        preferredDate: "Early July, flexible",
        message:
          "Opening my own physiotherapy clinic in Bermondsey in September. Need shots for the website and Google Business profile — treatment room, candid with clients, and a few clean headshots.",
        status: "NEW",
        createdAt: ago(3, 16),
      },
      {
        name: "Jasmine Kaur",
        email: "jasmine.kaur@outlook.com",
        sessionTypePref: "family",
        preferredDate: "Any Saturday in July",
        message:
          "My parents are visiting from Birmingham for two weeks and I'd love a proper family photo — four generations, twelve of us! Somewhere with space.",
        status: "REVIEWED",
        createdAt: ago(5, 10),
      },
    ],
    skipDuplicates: true,
  })

  // ─── 14 Jobs — 11 clients, 3 returning (Tom, Imogen, Sarah) ───
  // Returning clients show repeat bookings on client detail page.
  //
  // This-week sessions (Mon–Sat):
  //   Mon: Marcus (SESSION_COMPLETE)
  //   Tue: Amara (SESSION_COMPLETE)
  //   Wed: Tom 2nd session (QUESTIONNAIRE_DONE)
  //   Thu: Elena (QUESTIONNAIRE_DONE)
  //   Fri: Ayo (QUESTIONNAIRE_SENT)
  //   Sat: Bennett-Johnsons (BOOKED)
  //
  // Past: old sessions at COMPLETE / PAID / GALLERY_SENT
  // Future: Sarah 2nd session next Mon (BOOKED)

  // Helper: create job and return it (for questionnaire linking + timestamp control)
  const createJob = async (
    data: Parameters<typeof prisma.job.create>[0]["data"],
    updatedAt: Date
  ) => {
    const job = await prisma.job.create({ data })
    // Stagger updatedAt so "Recent Activity" shows varied times
    await prisma.$executeRaw`UPDATE "Job" SET "updatedAt" = ${updatedAt} WHERE id = ${job.id}`
    return job
  }

  // ── COMPLETE (3) — returning clients' first sessions ──

  // Tom's first session (headshots, 8 weeks ago) — he loved it, came back for personal brand
  await createJob(
    {
      clientId: tom.id,
      sessionTypeId: headshots.id,
      stage: "COMPLETE",
      sessionDate: ago(56, 10),
      sessionLocation: "His studio, Shoreditch",
      totalPrice: 17500,
      bookingFee: 4400,
      balanceAmount: 13100,
      bookingFeeStatus: "HELD",
      balanceStatus: "PAID",
      sessionToken: "N1mK3jH5gF7dS9aP2oIuY",
      contractSignedAt: ago(63),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(61),
      editingEmailSentAt: ago(55),
      galleryUrl: "https://claramonet.pic-time.com/brennan-headshots",
      galleryDeliveredAt: ago(49),
      imageCount: 22,
      balanceInvoiceSentAt: ago(49),
      balanceDueAt: ago(42),
      balancePaidAt: ago(45),
      reviewRequestSentAt: ago(41),
      ownerNotes:
        "First session. Published on his website. Left a Google review — 5 stars.",
    },
    ago(41)
  )

  // Imogen's first session (personal brand, 7 weeks ago) — seasonal refresh coming
  await createJob(
    {
      clientId: imogen.id,
      sessionTypeId: personalBrand.id,
      stage: "COMPLETE",
      sessionDate: ago(49, 11),
      sessionLocation: "Her showroom, Notting Hill",
      totalPrice: 35000,
      bookingFee: 8800,
      balanceAmount: 26200,
      bookingFeeStatus: "HELD",
      balanceStatus: "PAID",
      sessionToken: "R7wE2tY5uI8oP3aS6dFgH",
      contractSignedAt: ago(56),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(54),
      editingEmailSentAt: ago(48),
      galleryUrl: "https://claramonet.pic-time.com/estevez-spring-brand",
      galleryDeliveredAt: ago(42),
      imageCount: 48,
      balanceInvoiceSentAt: ago(42),
      balanceDueAt: ago(35),
      balancePaidAt: ago(38),
      reviewRequestSentAt: ago(34),
      ownerNotes:
        "Interior designer. Shot in her Notting Hill showroom. Great natural light. Booked again for summer refresh.",
    },
    ago(34)
  )

  // Sarah's first session (headshots, 6 weeks ago) — upgrading to full brand
  await createJob(
    {
      clientId: sarah.id,
      sessionTypeId: headshots.id,
      stage: "COMPLETE",
      sessionDate: ago(42, 14),
      sessionLocation: "Hackney studio",
      totalPrice: 17500,
      bookingFee: 4400,
      balanceAmount: 13100,
      bookingFeeStatus: "HELD",
      balanceStatus: "PAID",
      sessionToken: "Z2xC5vB8nM1kL4jH7gFwE",
      contractSignedAt: ago(49),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(47),
      editingEmailSentAt: ago(41),
      galleryUrl: "https://claramonet.pic-time.com/devlin-headshots",
      galleryDeliveredAt: ago(35),
      imageCount: 18,
      balanceInvoiceSentAt: ago(35),
      balanceDueAt: ago(28),
      balancePaidAt: ago(31),
      reviewRequestSentAt: ago(27),
      ownerNotes:
        "Headshots went brilliantly — she's now booked the full Personal Brand session.",
    },
    ago(27)
  )

  // ── PAID (2) ──
  await createJob(
    {
      clientId: priya.id,
      sessionTypeId: family.id,
      stage: "PAID",
      sessionDate: ago(18, 9),
      sessionLocation: "Victoria Park",
      totalPrice: 25000,
      bookingFee: 6300,
      balanceAmount: 18700,
      bookingFeeStatus: "HELD",
      balanceStatus: "PAID",
      sessionToken: "L3nFy7hT5vB9qX2kM4pSrN",
      contractSignedAt: ago(26),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(24),
      editingEmailSentAt: ago(17),
      galleryUrl: "https://claramonet.pic-time.com/okafor-family-summer",
      galleryDeliveredAt: ago(10),
      imageCount: 30,
      balanceInvoiceSentAt: ago(10),
      balanceDueAt: ago(3),
      balancePaidAt: ago(5),
      ownerNotes:
        "Warm natural tones. Aanya loved the bubbles! Ready for review request.",
    },
    ago(5)
  )

  await createJob(
    {
      clientId: wright.id,
      sessionTypeId: family.id,
      stage: "PAID",
      sessionDate: ago(20, 16),
      sessionLocation: "Their home, Clapham",
      totalPrice: 25000,
      bookingFee: 6300,
      balanceAmount: 18700,
      bookingFeeStatus: "HELD",
      balanceStatus: "PAID",
      sessionToken: "M8qW2eR5tY9uI4oP7aS1dF",
      contractSignedAt: ago(28),
      modelReleaseGranted: false,
      questionnaireSentAt: ago(26),
      editingEmailSentAt: ago(19),
      galleryUrl: "https://claramonet.pic-time.com/wright-family-spring",
      galleryDeliveredAt: ago(12),
      imageCount: 32,
      balanceInvoiceSentAt: ago(12),
      balanceDueAt: ago(5),
      balancePaidAt: ago(7),
      ownerNotes:
        "Opted out of model release — cannot use on website or socials.",
    },
    ago(7)
  )

  // ── GALLERY_SENT (2) — awaiting balance ──

  // Imogen's SECOND session — seasonal content refresh
  await createJob(
    {
      clientId: imogen.id,
      sessionTypeId: personalBrand.id,
      stage: "GALLERY_SENT",
      sessionDate: ago(12, 11),
      sessionLocation: "Hackney studio",
      totalPrice: 35000,
      bookingFee: 8800,
      balanceAmount: 26200,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "Q4tY7uI2oP5aS9dF6gHjK",
      contractSignedAt: ago(20),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(18),
      editingEmailSentAt: ago(11),
      galleryUrl: "https://claramonet.pic-time.com/estevez-summer-brand",
      galleryDeliveredAt: ago(3),
      imageCount: 55,
      balanceInvoiceSentAt: ago(3),
      balanceDueAt: thisWeek(4, 10),
      ownerNotes:
        "Second session — summer content refresh. Wants hero crop for website and 3:4 for social.",
    },
    ago(3)
  )

  await createJob(
    {
      clientId: nikhil.id,
      sessionTypeId: headshots.id,
      stage: "GALLERY_SENT",
      sessionDate: ago(8, 14),
      sessionLocation: "WeWork, Moorgate",
      totalPrice: 17500,
      bookingFee: 4400,
      balanceAmount: 13100,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "T5rY8uI1oP4aS7dF0gHjK",
      contractSignedAt: ago(15),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(13),
      editingEmailSentAt: ago(7),
      galleryUrl: "https://claramonet.pic-time.com/patel-headshots",
      galleryDeliveredAt: ago(1),
      imageCount: 20,
      balanceInvoiceSentAt: ago(1),
      balanceDueAt: thisWeek(5, 10),
      ownerNotes:
        "SaaS founder. Clean white background set. Sent Figma-ready crops.",
    },
    ago(1)
  )

  // ── SESSION_COMPLETE (2) — shot Mon/Tue this week ──
  await createJob(
    {
      clientId: marcus.id,
      sessionTypeId: headshots.id,
      stage: "SESSION_COMPLETE",
      sessionDate: thisWeek(0, 10),
      sessionLocation: "His office, London Bridge",
      totalPrice: 17500,
      bookingFee: 4400,
      balanceAmount: 13100,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "J8rWz3cD6gH1jL5mP7sQxY",
      contractSignedAt: ago(14),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(12),
      editingEmailSentAt: thisWeek(0, 17),
      ownerNotes:
        "North-facing windows in meeting room. Navy suit, one tie change. Editing underway.",
    },
    thisWeek(0, 17)
  )

  await createJob(
    {
      clientId: amara.id,
      sessionTypeId: personalBrand.id,
      stage: "SESSION_COMPLETE",
      sessionDate: thisWeek(1, 11),
      sessionLocation: "Hackney studio",
      totalPrice: 35000,
      bookingFee: 8800,
      balanceAmount: 26200,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "U6tY9uI2oP5aS8dF1gHjK",
      contractSignedAt: ago(16),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(14),
      editingEmailSentAt: thisWeek(1, 18),
      ownerNotes:
        "Life coach rebrand. Warm editorial. Great energy — session ran 20 min over. Bring gold reflector next time.",
    },
    thisWeek(1, 18)
  )

  // ── QUESTIONNAIRE_DONE (2) — sessions Wed/Thu this week ──

  // Tom's SECOND session — loved headshots, now doing full personal brand
  const tomJob2 = await createJob(
    {
      clientId: tom.id,
      sessionTypeId: personalBrand.id,
      stage: "QUESTIONNAIRE_DONE",
      sessionDate: thisWeek(2, 10),
      sessionLocation: "Hackney studio + rooftop",
      totalPrice: 35000,
      bookingFee: 8800,
      balanceAmount: 26200,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "W6eR9tY3uI7oP2aS5dFgH",
      contractSignedAt: ago(10),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(8),
      ownerNotes:
        "Returning client — loved his headshots, upgraded to full brand. Wants outdoor rooftop set too.",
    },
    ago(2)
  )

  const elenaJob = await createJob(
    {
      clientId: elena.id,
      sessionTypeId: family.id,
      stage: "QUESTIONNAIRE_DONE",
      sessionDate: thisWeek(3, 9),
      sessionLocation: "Hampstead Heath",
      totalPrice: 25000,
      bookingFee: 6300,
      balanceAmount: 18700,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "X3fG6hJ9kL2mN5pQ8rS1tU",
      contractSignedAt: ago(8),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(6),
      ownerNotes: "Twins age 4, one shy. Bring bubble wand and stickers.",
    },
    ago(1, 15)
  )

  // ── QUESTIONNAIRE_SENT (1) — session Fri ──
  await createJob(
    {
      clientId: ayo.id,
      sessionTypeId: headshots.id,
      stage: "QUESTIONNAIRE_SENT",
      sessionDate: thisWeek(4, 14),
      sessionLocation: "Lincoln's Inn Fields",
      totalPrice: 17500,
      bookingFee: 4400,
      balanceAmount: 13100,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "Y4gH7jK0lM3nP6qR9sT2uV",
      contractSignedAt: ago(5),
      modelReleaseGranted: true,
      questionnaireSentAt: ago(3),
      ownerNotes:
        "Newly qualified barrister. Needs chambers-website headshots. Chase questionnaire before Friday.",
    },
    ago(3)
  )

  // ── BOOKED (2) ──
  await createJob(
    {
      clientId: bennetts.id,
      sessionTypeId: family.id,
      stage: "BOOKED",
      sessionDate: thisWeek(5, 9),
      sessionLocation: "Dulwich Park",
      totalPrice: 25000,
      bookingFee: 6300,
      balanceAmount: 18700,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "A5hJ8kL1mN4pQ7rS0tU3vW",
      contractSignedAt: ago(3),
      modelReleaseGranted: true,
      ownerNotes:
        "Interracial family, toddler Ezra (18 months). Mum wants autumn tones.",
    },
    ago(3)
  )

  // Sarah's SECOND session — upgraded from headshots to full brand
  await createJob(
    {
      clientId: sarah.id,
      sessionTypeId: personalBrand.id,
      stage: "BOOKED",
      sessionDate: thisWeek(7, 10),
      sessionLocation: "Hackney studio",
      totalPrice: 35000,
      bookingFee: 8800,
      balanceAmount: 26200,
      bookingFeeStatus: "HELD",
      balanceStatus: "PENDING",
      sessionToken: "B6jK9lM2nP5qR8sT1uV4wX",
      contractSignedAt: ago(2),
      modelReleaseGranted: true,
      ownerNotes:
        "Returning client — headshots went so well she booked the full Personal Brand. Launching group programme mid-July.",
    },
    ago(2)
  )

  // ─── Questionnaires ────────────────────────────────────────────
  // Tom's 2nd session
  await prisma.questionnaire.create({
    data: {
      jobId: tomJob2.id,
      sessionGoal:
        "Full personal brand library — website, LinkedIn, speaking profile",
      participants: "Just me, plus my co-founder for 2–3 duo shots",
      locationPref: "Hackney studio + rooftop if weather holds",
      mood: "Confident but relaxed — think startup founder, not corporate",
      outfitPlans:
        "Three looks — charcoal blazer, black turtleneck, casual shirt",
      moodBoardUrl: "Shared via email — 'Tom Brand Inspo' folder",
      imageUsage:
        "Website, LinkedIn, conference speaker profiles, podcast cover",
      additionalNotes: "Need one landscape crop for Twitter/X banner",
      modelRelease: true,
    },
  })

  // Elena's family session
  await prisma.questionnaire.create({
    data: {
      jobId: elenaJob.id,
      sessionGoal: "Family memories with the twins before they start school",
      participants: "Elena, partner David, twins Mila & Leon (4)",
      locationPref: "Hampstead Heath — near the ponds",
      mood: "Warm and natural, lots of movement and giggles",
      outfitPlans: "Coordinating earth tones — no matching outfits",
      avoidsNotes:
        "Leon doesn't like being picked up by strangers. Let him come to us.",
      imageUsage: "Personal — one framed print for grandparents",
      modelRelease: true,
    },
  })

  // Marcus headshots (SESSION_COMPLETE)
  const marcusJob = await prisma.job.findUnique({
    where: { sessionToken: "J8rWz3cD6gH1jL5mP7sQxY" },
  })
  if (marcusJob) {
    await prisma.questionnaire.create({
      data: {
        jobId: marcusJob.id,
        sessionGoal: "LinkedIn and company website headshots",
        participants: "Just me",
        locationPref:
          "My office, London Bridge — meeting room has north-facing windows",
        mood: "Professional and polished but not stiff",
        outfitPlans: "Navy suit, one tie change, one without jacket",
        imageUsage: "LinkedIn, website, board announcement press kit",
        additionalNotes: "Need one horizontal crop for email signature",
        modelRelease: true,
      },
    })
    // Re-stagger after questionnaire bumped updatedAt
    await prisma.$executeRaw`UPDATE "Job" SET "updatedAt" = ${thisWeek(0, 17)} WHERE id = ${marcusJob.id}`
  }

  // Amara personal brand (SESSION_COMPLETE)
  const amaraJob = await prisma.job.findUnique({
    where: { sessionToken: "U6tY9uI2oP5aS8dF1gHjK" },
  })
  if (amaraJob) {
    await prisma.questionnaire.create({
      data: {
        jobId: amaraJob.id,
        sessionGoal:
          "Complete rebrand — website, course platform, social content",
        participants: "Just me, possibly one with a client (they've consented)",
        locationPref: "Hackney studio — both white and textured backgrounds",
        mood: "Confident but approachable — think Brené Brown meets Vogue",
        outfitPlans:
          "Four outfit changes — rust blazer, black turtleneck, white shirt, casual",
        moodBoardUrl: "https://pin.it/amara-rebrand",
        imageUsage: "Website, Kajabi course platform, Instagram, LinkedIn",
        additionalNotes:
          "Also launching a podcast — need a few 'speaking into camera' setups",
        modelRelease: true,
      },
    })
    // Re-stagger after questionnaire bumped updatedAt
    await prisma.$executeRaw`UPDATE "Job" SET "updatedAt" = ${thisWeek(1, 18)} WHERE id = ${amaraJob.id}`
  }

  // Priya family (PAID)
  const priyaJob = await prisma.job.findUnique({
    where: { sessionToken: "L3nFy7hT5vB9qX2kM4pSrN" },
  })
  if (priyaJob) {
    await prisma.questionnaire.create({
      data: {
        jobId: priyaJob.id,
        sessionGoal: "Family memories with our little one",
        participants: "Priya, James and Aanya (2)",
        locationPref: "Victoria Park — near the lakes",
        mood: "Warm and natural — giggly, not posed",
        outfitPlans: "Coordinated mustard and cream tones",
        avoidsNotes: "Please no photos of Aanya crying — she's in a phase",
        imageUsage: "Personal, prints for the hallway",
        modelRelease: true,
      },
    })
  }

  console.log(
    "Seed complete — 11 clients, 14 jobs (3 returning), 5 inquiries, 5 questionnaires"
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
