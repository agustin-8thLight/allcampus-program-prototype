/*
 * Catalog generator (v6, 2026-08-18): "the options actually feel too limited."
 * Production shows "We found 1093 programs" across dozens of universities; the
 * prototype had 11 programs at 8 schools, which made every list read as a
 * demo. This script grows the catalog to production-feeling density while
 * keeping it inspectable: the curated records stay verbatim, everything
 * generated is deterministic (seeded LCG, stable across runs → stable diffs),
 * and the output is plain JSON a reviewer or Terrence can open.
 *
 * Run:  node scripts/generate-catalog.mjs
 * Writes: src/data/programs.json (curated records first, generated after)
 *
 * ALL FIGURES ARE MOCK/FPO. Same caveat as everything else in this prototype.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '../src/data/programs.json')

// Deterministic PRNG so regeneration never churns the diff.
let seed = 42
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const between = (min, max, step = 1) => min + Math.floor(rand() * ((max - min) / step + 1)) * step

// ---- Topics: skillId → naming + area (mirrors src/data/taxonomy.js) --------
const TOPICS = {
  'mba-general': { area: 'business', topic: 'Business Administration', levels: ["Master's", "Bachelor's"] },
  'accounting-finance': { area: 'business', topic: 'Accounting & Finance', levels: ["Master's", "Bachelor's", 'Certificate'] },
  marketing: { area: 'business', topic: 'Marketing', levels: ["Master's", "Bachelor's", 'Certificate'] },
  'leadership-org': { area: 'business', topic: 'Organizational Leadership', levels: ["Master's", 'Certificate'] },
  'human-resources': { area: 'business', topic: 'Human Resource Management', levels: ["Master's", "Bachelor's", 'Certificate'] },
  'project-management': { area: 'business', topic: 'Project Management', levels: ["Master's", 'Certificate'] },
  'operations-supply-chain': { area: 'business', topic: 'Supply Chain Management', levels: ["Master's", "Bachelor's"] },
  cybersecurity: { area: 'it', topic: 'Cybersecurity', levels: ["Master's", "Bachelor's", 'Certificate'] },
  'cs-software': { area: 'it', topic: 'Computer Science', levels: ["Master's", "Bachelor's", 'Associate'] },
  'data-analytics-ai': { area: 'it', topic: 'Data Analytics', levels: ["Master's", "Bachelor's", 'Certificate'] },
  'it-systems': { area: 'it', topic: 'Information Technology Management', levels: ["Master's", "Bachelor's"] },
  'cloud-certs': { area: 'it', topic: 'Cloud Computing', levels: ['Certificate', 'Associate'] },
  'mech-aero': { area: 'engineering', topic: 'Mechanical Engineering', levels: ["Master's", "Bachelor's"] },
  civil: { area: 'engineering', topic: 'Civil Engineering', levels: ["Master's", "Bachelor's"] },
  'electrical-computer': { area: 'engineering', topic: 'Electrical & Computer Engineering', levels: ["Master's", "Bachelor's"] },
  'industrial-systems': { area: 'engineering', topic: 'Industrial & Systems Engineering', levels: ["Master's", "Bachelor's"] },
  'engineering-mgmt': { area: 'engineering', topic: 'Engineering Management', levels: ["Master's", 'Certificate'] },
  nursing: { area: 'healthcare', topic: 'Nursing (RN to BSN)', levels: ["Bachelor's", "Master's"] },
  'nurse-practitioner': { area: 'healthcare', topic: 'Family Nurse Practitioner', levels: ["Master's"] },
  'health-admin': { area: 'healthcare', topic: 'Healthcare Administration', levels: ["Master's", "Bachelor's", 'Associate'] },
  'public-health': { area: 'healthcare', topic: 'Public Health', levels: ["Master's", "Bachelor's"] },
  'health-informatics': { area: 'healthcare', topic: 'Health Informatics', levels: ["Master's", 'Certificate'] },
  'health-compliance': { area: 'healthcare', topic: 'Healthcare Compliance & Coding', levels: ['Certificate', 'Associate'] },
  'teaching-licensure': { area: 'education', topic: 'Teaching', levels: ["Bachelor's", "Master's"] },
  'early-childhood': { area: 'education', topic: 'Early Childhood Education', levels: ["Bachelor's", 'Associate'] },
  'special-education': { area: 'education', topic: 'Special Education', levels: ["Master's", "Bachelor's"] },
  'ed-leadership': { area: 'education', topic: 'Educational Leadership', levels: ["Master's"] },
  'curriculum-instruction': { area: 'education', topic: 'Curriculum & Instruction', levels: ["Master's", 'Certificate'] },
  'criminal-justice': { area: 'justice-legal', topic: 'Criminal Justice', levels: ["Bachelor's", "Master's", 'Associate'] },
  'legal-paralegal': { area: 'justice-legal', topic: 'Paralegal Studies', levels: ['Certificate', 'Associate', "Bachelor's"] },
  'public-admin': { area: 'justice-legal', topic: 'Public Administration', levels: ["Master's", "Bachelor's"] },
  'homeland-security': { area: 'justice-legal', topic: 'Homeland Security & Emergency Management', levels: ["Bachelor's", "Master's"] },
  communication: { area: 'liberal-arts', topic: 'Communication', levels: ["Bachelor's", "Master's"] },
  'psychology-counseling': { area: 'liberal-arts', topic: 'Psychology', levels: ["Bachelor's", "Master's"] },
  'english-writing': { area: 'liberal-arts', topic: 'English & Professional Writing', levels: ["Bachelor's"] },
  'general-studies': { area: 'liberal-arts', topic: 'General Studies', levels: ["Bachelor's", 'Associate'] },
  history: { area: 'liberal-arts', topic: 'History', levels: ["Bachelor's"] },
  ministry: { area: 'liberal-arts', topic: 'Ministry & Religious Studies', levels: ["Master's", "Bachelor's"] },
  'social-work-bsw-msw': { area: 'social-work', topic: 'Social Work', levels: ["Bachelor's", "Master's"] },
  'human-services': { area: 'social-work', topic: 'Human Services', levels: ["Bachelor's", 'Associate'] },
  aba: { area: 'social-work', topic: 'Applied Behavior Analysis', levels: ["Master's", 'Certificate'] },
}

const SCHOOL_IDS = [
  'txwes', 'abilene', 'franklin', 'mckendree', 'nursing-u', 'snhu', 'state-online', 'metro-tech',
  'herzing', 'westcliff', 'upper-iowa', 'umsl', 'csu-global', 'lakeland-state', 'meridian',
  'pacific-crest', 'northgate-tech', 'camden-valley', 'summit-ridge', 'riverside-pub',
  'blue-ash', 'harborview', 'aurora-state', 'cedarfield',
]

// Verified Unsplash photo ids already used elsewhere in the prototype
// (images.js, checked 2026-08-13) — reused per area so no new dead-link risk.
const U = (id, w = 900, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`
const AREA_PHOTOS = {
  business: ['1552581234-26160f608093', '1556742049-0cfed4f6a45d', '1553413077-190dd305871c', '1517245386807-bb43f82c33c4'],
  it: ['1550751827-4bd374c3f58b', '1551288049-bebda4e38f71', '1531427186611-ecfd6d936c79', '1607237138185-eedd9c632b0b'],
  engineering: ['1581091226825-a6a2a5aee158', '1581092160562-40aa08e78837', '1567789884554-0b844b597180', '1581092918056-0c4c3acd3789'],
  healthcare: ['1631217868264-e5b90bb7e133', '1584982751601-97dcc096659c', '1519494026892-80bbd2d6fd0d', '1571260899304-425eee4c7efc'],
  education: ['1509062522246-3755977927d7', '1523240795612-9a054b0db644', '1580489944761-15a19d654956'],
  'justice-legal': ['1589829545856-d10d557cf95f', '1575505586569-646b2ca898fc', '1519085360753-af0119f7cbe7'],
  'liberal-arts': ['1481627834876-b7833e8f5570', '1455390582262-044cdead277a', '1494790108377-be9c29b29330'],
  'social-work': ['1573497019940-1c28c88b4f3e', '1552664730-d307ca884978', '1573496359142-b8d87734a5a2'],
}

const LEVEL = {
  "Master's": { credits: [30, 36], perCredit: [520, 780], duration: ['2 years', '20 months', '18 months'], namers: [(t) => `MS in ${t}`, (t) => `Master of ${t}`, (t) => `MA in ${t}`] },
  "Bachelor's": { credits: [120, 120], perCredit: [350, 560], duration: ['4 years', '3 years with transfer credit'], namers: [(t) => `BS in ${t}`, (t) => `Bachelor of Science in ${t}`, (t) => `BA in ${t}`] },
  Associate: { credits: [60, 60], perCredit: [280, 380], duration: ['2 years', '18 months'], namers: [(t) => `${t} — Associate of Science`, (t) => `AS in ${t}`] },
  Certificate: { credits: [12, 18], perCredit: [320, 520], duration: ['6 months', '9 months', '12 months'], namers: [(t) => `${t} Certificate`, (t) => `Graduate Certificate in ${t}`] },
}

const STARTS = ['2026-09-08', '2026-10-05', '2027-01-11', '2027-03-08']
const HEADLINES = [
  (t) => `Build real ${t.toLowerCase()} skills online, on a working adult's schedule.`,
  (t) => `Advance in ${t.toLowerCase()} with a program designed around full-time work.`,
  (t) => `A career-focused ${t.toLowerCase()} credential from an accredited in-network university.`,
]

const curated = JSON.parse(readFileSync(OUT, 'utf8')).filter((p) => !p.generated)
const usedNames = new Set(curated.map((p) => `${p.schoolId}|${p.name}`))
const out = [...curated]
let schoolCursor = 0

for (const [skillId, def] of Object.entries(TOPICS)) {
  const n = between(2, 4)
  for (let i = 0; i < n; i++) {
    const level = def.levels[i % def.levels.length]
    const L = LEVEL[level]
    const schoolId = SCHOOL_IDS[schoolCursor++ % SCHOOL_IDS.length]
    const name = pick(L.namers)(def.topic)
    if (usedNames.has(`${schoolId}|${name}`)) continue
    usedNames.add(`${schoolId}|${name}`)

    const credits = between(L.credits[0], L.credits[1], 3)
    const per = between(L.perCredit[0], L.perCredit[1], 5)
    const discounted = rand() < 0.68
    const pct = discounted ? pick([10, 10, 15, 15, 20, 20, 25]) : null
    const std = discounted ? Math.round(per / (1 - pct / 100) / 5) * 5 : null
    const flatCert = level === 'Certificate' && rand() < 0.5
    const total = per * credits
    const years = level === "Bachelor's" ? 4 : level === 'Associate' || level === "Master's" ? 2 : 1
    const rolling = rand() < 0.3
    const start = pick(STARTS)

    out.push({
      generated: true,
      id: `${schoolId}-${skillId}-${level.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
      schoolId,
      corporatePartnerId: null,
      name,
      headline: pick(HEADLINES)(def.topic),
      description: `${def.topic} coursework built for working professionals: applied projects, instructors with industry experience, and every class online. Offered through the AllCampus partner network${discounted ? ' at partnership pricing' : ''}.`,
      programImageHue: { business: 262, it: 150, engineering: 24, healthcare: 196, education: 330, 'justice-legal': 208, 'liberal-arts': 45, 'social-work': 178 }[def.area],
      imageUrl: U(pick(AREA_PHOTOS[def.area])),
      startDate: rolling ? null : start,
      rollingEnrollment: rolling,
      applicationDeadline: rolling ? null : start.replace(/-\d\d$/, '-01'),
      duration: pick(L.duration),
      timeCommitment: `${between(8, 14)} hrs/week`,
      degreeLevel: level,
      programType: level === 'Certificate' ? 'Certificate' : def.topic,
      certLevel: level === 'Certificate' ? (rand() < 0.5 ? "Master's-level" : 'Undergraduate') : undefined,
      certBilling: flatCert ? 'upfront' : undefined,
      courseModality: 'Online',
      tuitionPerCredit: flatCert ? null : per,
      standardTuitionPerCredit: flatCert ? null : std,
      requiredCredits: credits,
      creditsPerSession: 6,
      creditsPerClass: 3,
      totalTuitionCost: total,
      standardTotalTuitionCost: discounted ? (flatCert ? Math.round(total / (1 - pct / 100) / 10) * 10 : std * credits) : null,
      annualEstimatedCost: Math.round(total / years / 10) * 10,
      deferredPaymentAvailable: rand() < 0.25,
      discount: discounted ? { type: 'percent', percentUsed: pct, terms: 'AllCampus partner discount, applied at enrollment.' } : null,
      admissionRequirements: level === "Master's"
        ? ["Bachelor's degree from an accredited institution", 'Official transcripts', 'No GRE/GMAT required']
        : ['High school diploma or GED', 'Official transcripts', 'Transfer credits evaluated free'],
      benefits: ['100% online coursework', 'Multiple start dates per year', 'AllCampus enrollment support at no cost'],
      curriculumHighlights: [`Foundations of ${def.topic.toLowerCase()}`, 'Applied capstone project', 'Electives to match your role'],
      concentrations: [],
      applicationUrl: `https://example.com/apply/${schoolId}`,
      areaId: def.area,
      skillIds: [skillId],
    })
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
console.log(`programs.json: ${curated.length} curated + ${out.length - curated.length} generated = ${out.length}`)
