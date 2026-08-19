/*
 * Areas of study ↔ skills taxonomy (2026-08-11 meeting direction).
 *
 * Source: "Programs Options in the network (list for new landing page)" PDF —
 * 8 areas, each with named skill buckets. This replaces the random program
 * carousel on the landing page with broad, high-value skill buckets.
 *
 * Model rules:
 *  - Each skill belongs to exactly ONE area (the source list is a strict
 *    tree). Revisit if Brigid's keyword data (affordability-filter project)
 *    turns out to be many-to-many.
 *  - The landing skills section shows FEATURED_SKILL_IDS by default (broad,
 *    high-value buckets across areas); selecting an area SHORTENS the list to
 *    just that area's skills.
 *  - Employers can emphasize areas (see corporatePartners.js): emphasized
 *    areas' skills sort first and hidden areas' skills drop from the default
 *    view (e.g. an aviation employer shows engineering, not nursing).
 *  - Selecting a skill routes into the program-browse surface filtered by
 *    that skill (programs are tagged with areaId + skillIds).
 *
 * INTERIM source of truth: swap in Brigid's skill/keyword data when shared.
 */

export const AREAS = [
  { id: 'business', label: 'Business' },
  { id: 'it', label: 'Information Technology' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'justice-legal', label: 'Criminal Justice & Legal' },
  { id: 'liberal-arts', label: 'Liberal Arts' },
  { id: 'social-work', label: 'Social Work' },
]

export const SKILLS = [
  // Business
  { id: 'mba-general', label: 'MBA & general business', areaId: 'business' },
  { id: 'accounting-finance', label: 'Accounting & finance', areaId: 'business' },
  { id: 'marketing', label: 'Marketing', areaId: 'business' },
  { id: 'leadership-org', label: 'Leadership & org development', areaId: 'business' },
  { id: 'human-resources', label: 'Human resources', areaId: 'business' },
  { id: 'project-management', label: 'Project management', areaId: 'business' },
  { id: 'operations-supply-chain', label: 'Operations & supply chain', areaId: 'business' },
  // Information technology
  { id: 'cybersecurity', label: 'Cybersecurity', areaId: 'it' },
  { id: 'cs-software', label: 'Computer science & software dev', areaId: 'it' },
  { id: 'data-analytics-ai', label: 'Data analytics & AI', areaId: 'it' },
  { id: 'it-systems', label: 'IT & systems management', areaId: 'it' },
  { id: 'cloud-certs', label: 'Cloud computing & certifications', areaId: 'it' },
  // Engineering
  { id: 'mech-aero', label: 'Mechanical & aerospace', areaId: 'engineering' },
  { id: 'civil', label: 'Civil', areaId: 'engineering' },
  { id: 'electrical-computer', label: 'Electrical & computer', areaId: 'engineering' },
  { id: 'industrial-systems', label: 'Industrial & systems', areaId: 'engineering' },
  { id: 'engineering-mgmt', label: 'Engineering management', areaId: 'engineering' },
  // Healthcare
  { id: 'nursing', label: 'Nursing (RN to BSN & MSN)', areaId: 'healthcare' },
  { id: 'nurse-practitioner', label: 'Nurse practitioner & advanced practice', areaId: 'healthcare' },
  { id: 'health-admin', label: 'Health administration & management', areaId: 'healthcare' },
  { id: 'public-health', label: 'Public health', areaId: 'healthcare' },
  { id: 'health-informatics', label: 'Health informatics', areaId: 'healthcare' },
  { id: 'health-compliance', label: 'Healthcare compliance & coding', areaId: 'healthcare' },
  // Education
  { id: 'teaching-licensure', label: 'Teaching & licensure', areaId: 'education' },
  { id: 'early-childhood', label: 'Early childhood education', areaId: 'education' },
  { id: 'special-education', label: 'Special education', areaId: 'education' },
  { id: 'ed-leadership', label: 'Educational leadership & admin', areaId: 'education' },
  { id: 'curriculum-instruction', label: 'Curriculum & instruction', areaId: 'education' },
  // Criminal justice & legal
  { id: 'criminal-justice', label: 'Criminal justice', areaId: 'justice-legal' },
  { id: 'legal-paralegal', label: 'Legal studies & paralegal', areaId: 'justice-legal' },
  { id: 'public-admin', label: 'Public administration & policy', areaId: 'justice-legal' },
  { id: 'homeland-security', label: 'Homeland security & emergency mgmt', areaId: 'justice-legal' },
  // Liberal arts
  { id: 'communication', label: 'Communication', areaId: 'liberal-arts' },
  { id: 'psychology-counseling', label: 'Psychology & counseling', areaId: 'liberal-arts' },
  { id: 'english-writing', label: 'English & writing', areaId: 'liberal-arts' },
  { id: 'general-studies', label: 'General studies', areaId: 'liberal-arts' },
  { id: 'history', label: 'History', areaId: 'liberal-arts' },
  { id: 'ministry', label: 'Ministry & religious studies', areaId: 'liberal-arts' },
  // Social work
  { id: 'social-work-bsw-msw', label: 'Social work (BSW & MSW)', areaId: 'social-work' },
  { id: 'human-services', label: 'Human services & life coaching', areaId: 'social-work' },
  { id: 'aba', label: 'Applied behavior analysis', areaId: 'social-work' },
]

/*
 * Default landing view: one broad, high-value bucket per theme, per the
 * meeting's examples (AI, nursing, leadership, web dev, supply chain).
 * Employer emphasis reorders / prunes this (see skillsForEmployer).
 */
export const FEATURED_SKILL_IDS = [
  'data-analytics-ai',
  'nursing',
  'leadership-org',
  'cs-software',
  'operations-supply-chain',
  'cybersecurity',
  'health-admin',
  'project-management',
  'teaching-licensure',
  'engineering-mgmt',
]

export const getArea = (id) => AREAS.find((a) => a.id === id) || null
export const getSkill = (id) => SKILLS.find((s) => s.id === id) || null
export const skillsForArea = (areaId) => SKILLS.filter((s) => s.areaId === areaId)

/*
 * The landing skill list for a given employer + optional selected area.
 *  - Area selected: that area's full skill list (the "shortening" rule).
 *  - No area: featured buckets, employer-emphasized areas first, hidden
 *    areas removed.
 */
export function skillsForEmployer(partner, selectedAreaId = null) {
  if (selectedAreaId) return skillsForArea(selectedAreaId)
  const hidden = new Set(partner?.hiddenAreaIds || [])
  const emphasized = partner?.emphasizedAreaIds || []
  const featured = FEATURED_SKILL_IDS.map(getSkill).filter(
    (s) => s && !hidden.has(s.areaId),
  )
  const rank = (s) => {
    const i = emphasized.indexOf(s.areaId)
    return i === -1 ? emphasized.length : i
  }
  return [...featured].sort((a, b) => rank(a) - rank(b))
}

/** Areas visible for an employer (hidden areas pruned from the chip row). */
export function areasForEmployer(partner) {
  const hidden = new Set(partner?.hiddenAreaIds || [])
  return AREAS.filter((a) => !hidden.has(a.id))
}

/*
 * Goals (2026-08-12 direction): the relatable, outcome-shaped labels people
 * actually recognize and search for — "the end result users might want" —
 * as opposed to catalog categories. Goals are the recognition language on
 * marketing surfaces; skills/areas remain the catalog's filter language.
 * Each goal MAPS into the taxonomy (skillIds and/or a degreeLevel).
 *
 * LABEL COPY IS DRAFT — validate exact wording with Brigid before launch;
 * she owns the student-friction vocabulary.
 */
export const GOALS = [
  { id: 'become-np', label: 'Become a nurse practitioner', sub: 'RN today, advanced practice next', skillIds: ['nurse-practitioner', 'nursing'], areaId: 'healthcare', hue: 196 },
  { id: 'move-into-management', label: 'Move into management', sub: 'Lead a team, a shift, a store', skillIds: ['leadership-org', 'mba-general'], areaId: 'business', hue: 262 },
  { id: 'get-pm-certified', label: 'Get certified in project management', sub: 'A credential that changes your week', skillIds: ['project-management'], areaId: 'business', hue: 208 },
  { id: 'break-into-cyber', label: 'Break into IT & cybersecurity', sub: 'From curious to qualified', skillIds: ['cybersecurity', 'it-systems', 'cs-software'], areaId: 'it', hue: 150 },
  { id: 'work-with-data', label: 'Work with data & AI', sub: 'Analytics roles in any industry', skillIds: ['data-analytics-ai'], areaId: 'it', hue: 90 },
  { id: 'trade-to-engineering', label: 'Turn trade experience into an engineering degree', sub: 'Welding, machining, maintenance — it counts', skillIds: ['industrial-systems', 'engineering-mgmt'], areaId: 'engineering', hue: 24 },
  { id: 'finish-bachelors', label: 'Finish my bachelor’s degree', sub: 'Credits you have, a degree you finish', degreeLevel: "Bachelor's", hue: 330 },
  { id: 'run-healthcare-ops', label: 'Advance in healthcare administration', sub: 'Run the clinic, not just the desk', skillIds: ['health-admin'], areaId: 'healthcare', hue: 178 },
  { id: 'supply-chain', label: 'Run operations & supply chain', sub: 'From the floor to the planning room', skillIds: ['operations-supply-chain'], areaId: 'business', hue: 45 },
]

export const getGoal = (id) => GOALS.find((g) => g.id === id) || null

/*
 * CATEGORIES (2026-08-14 meeting): a four-bucket top level above the eight
 * areas, because the area-of-study dropdown is "directionally right but too
 * overwhelming." Pattern borrowed from Coursera: a small set of high-level
 * category tiles that expand into the skills underneath, with a category
 * landing page in between (route #/category/:id).
 *
 * LABELS ARE A STRAWMAN. The meeting named "Bridget's four subject-area
 * buckets" as the intended top level, and we hold no such list — nothing in
 * the doc set or the network PDF contains it. These four collapse the eight
 * existing AREAS without stranding any of them, and Brigid should correct or
 * replace them. (It is Brigid O'Connor, not "Bridget.")
 *
 * Healthcare stands alone rather than merging into a broader bucket because
 * nursing carries the catalog, and burying it one level deeper would make the
 * highest-volume path longer than everything around it.
 */
export const CATEGORIES = [
  {
    id: 'business-leadership',
    label: 'Business & Leadership',
    blurb: 'Run a team, a budget, or an operation. The widest set of programs in the network.',
    pitch: 'Management is the most common promotion path in the network, and the discounts here run among the deepest. MBAs, project management, HR, and supply chain, all built for people leading while they learn.',
    areaIds: ['business'],
    hue: 262,
  },
  {
    id: 'tech-engineering',
    label: 'Technology & Engineering',
    blurb: 'Build, secure, and maintain the systems everything else depends on.',
    pitch: 'From help desk to cloud architect, these are the credentials employers fund most. Cybersecurity, data, and engineering paths that credit the experience you already have.',
    areaIds: ['it', 'engineering'],
    hue: 150,
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    blurb: 'Advance at the bedside or move into administration, informatics, and public health.',
    pitch: 'The busiest corner of the catalog. Clear RN-to-BSN and nurse practitioner ladders, plus administration and informatics for moving from the floor to the office.',
    areaIds: ['healthcare'],
    hue: 196,
  },
  {
    id: 'people-public',
    label: 'People & Public Service',
    blurb: 'Teaching, social work, criminal justice, counseling, and public administration.',
    pitch: 'Credentials for work that serves people, on schedules that respect yours. Licensure-track teaching and social work, plus justice and public administration.',
    areaIds: ['education', 'social-work', 'justice-legal', 'liberal-arts'],
    hue: 24,
  },
]

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || null

/** The category an area rolls up into (every area belongs to exactly one). */
export const categoryForArea = (areaId) =>
  CATEGORIES.find((c) => c.areaIds.includes(areaId)) || null

/** Every skill under a category, grouped by its parent area for display. */
export function areasForCategory(category) {
  if (!category) return []
  return category.areaIds.map(getArea).filter(Boolean)
}

export function skillsForCategory(category) {
  if (!category) return []
  return category.areaIds.flatMap(skillsForArea)
}

/** Does a program sit under this category? */
export function programMatchesCategory(program, category) {
  if (!category) return true
  return category.areaIds.includes(program.areaId)
}

/*
 * Categories for an employer: a category drops out only when EVERY area
 * beneath it is hidden, and emphasized areas float their category up. Mirrors
 * the area/goal treatment so the employer emphasis survives the new level.
 */
export function categoriesForEmployer(partner) {
  const hidden = new Set(partner?.hiddenAreaIds || [])
  const emphasized = partner?.emphasizedAreaIds || []
  const visible = CATEGORIES.filter((c) => c.areaIds.some((a) => !hidden.has(a)))
  const rank = (c) => {
    const hits = c.areaIds.map((a) => emphasized.indexOf(a)).filter((i) => i !== -1)
    return hits.length ? Math.min(...hits) : emphasized.length
  }
  return [...visible].sort((a, b) => rank(a) - rank(b))
}

/** Goals that map into a category, for the category landing page. */
export function goalsForCategory(category) {
  if (!category) return []
  return GOALS.filter((g) => g.areaId && category.areaIds.includes(g.areaId))
}

/** Does a program serve this goal? Skill intersection OR degree-level match. */
export function programMatchesGoal(program, goal) {
  if (!goal) return true
  if (goal.skillIds?.length && program.skillIds?.some((s) => goal.skillIds.includes(s))) return true
  if (goal.degreeLevel && program.degreeLevel === goal.degreeLevel) return true
  return false
}

/** Goals for an employer: hidden areas pruned, emphasized areas first. */
export function goalsForEmployer(partner) {
  const hidden = new Set(partner?.hiddenAreaIds || [])
  const emphasized = partner?.emphasizedAreaIds || []
  const visible = GOALS.filter((g) => !g.areaId || !hidden.has(g.areaId))
  const rank = (g) => {
    const i = emphasized.indexOf(g.areaId)
    return i === -1 ? emphasized.length : i
  }
  return [...visible].sort((a, b) => rank(a) - rank(b))
}
