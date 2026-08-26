/*
 * Imagery map (punch list F1). The prototype previously ran on FPO hue
 * gradients; demo fidelity needs real photography.
 *
 * SOURCE: Unsplash (hotlinked, `?auto=format&fit=crop` sized per slot).
 * Internal-only prototype behind the AccessGate passcode — fine for review,
 * NOT licensed placement for production. Replace with licensed or school-supplied
 * photography before anything client-facing ships.
 *
 * Every consumer renders through <Img>, which falls back to the existing
 * hue gradient if a fetch fails (offline, rate limit), so layout never breaks.
 * Bundled local assets in src/assets/programs still win for the six programs
 * that have them (see model.js imageForId) — this map covers the rest plus
 * goals, stories, personas, and heroes.
 */

const U = (id, w = 900, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`

/* Programs without a bundled local asset. Keyed by program id. */
export const PROGRAM_IMAGES = {
  'franklin-msn-np': U('1631217868264-e5b90bb7e133'), // clinician with patient chart
  'franklin-bs-engtech': U('1581091226825-a6a2a5aee158'), // technician at work
  'mckendree-ma-perf-psych': U('1552664730-d307ca884978'), // team session
  'state-online-pm-cert': U('1454165804606-c3d57bc86b40'), // planning board
  'metro-tech-data-cert': U('1551288049-bebda4e38f71'), // analytics dashboards
}

/* Goal cards (landing Goals block), keyed by goal id. */
export const GOAL_IMAGES = {
  'become-np': U('1584982751601-97dcc096659c', 800, 400),
  'move-into-management': U('1552581234-26160f608093', 800, 400),
  'get-pm-certified': U('1517245386807-bb43f82c33c4', 800, 400),
  'break-into-cyber': U('1550751827-4bd374c3f58b', 800, 400),
  'work-with-data': U('1551288049-bebda4e38f71', 800, 400),
  'trade-to-engineering': U('1567789884554-0b844b597180', 800, 400),
  'finish-bachelors': U('1509062522246-3755977927d7', 800, 400),
  'run-healthcare-ops': U('1519494026892-80bbd2d6fd0d', 800, 400),
  'supply-chain': U('1553413077-190dd305871c', 800, 400),
}

/* Learner story portraits, keyed by story id (stories.js). */
export const STORY_IMAGES = {
  maria: U('1494790108377-be9c29b29330', 600, 700),
  devon: U('1507003211169-0a1dd7228f2d', 600, 700),
  amara: U('1573496359142-b8d87734a5a2', 600, 700),
  kyle: U('1519085360753-af0119f7cbe7', 600, 700),
  renata: U('1580489944761-15a19d654956', 600, 700),
}

/* Use-case personas (story launcher + coach avatar), keyed by use case id. */
export const PERSONA_IMAGES = {
  devon: U('1494790108377-be9c29b29330', 300, 300),
  samir: U('1531427186611-ecfd6d936c79', 300, 300),
  carl: U('1519085360753-af0119f7cbe7', 300, 300),
  tina: U('1573497019940-1c28c88b4f3e', 300, 300),
}

/* Marketing heroes. Partner-specific where it helps the story land. */
export const HERO_IMAGES = {
  /* 2026-08-25: the previous default read as teenagers in a library, which is
     the wrong audience for an employer-benefit page. Two colleagues at a
     laptop, subjects right of frame so the headline has clear ground. */
  default: U('1531482615713-2afd69097998', 1800, 900), // colleagues at work
  sheetz: U('1556742049-0cfed4f6a45d', 1800, 900), // retail and service team
  'texas-roadhouse': U('1552566626-52f8b828add9', 1800, 900), // restaurant staff
  boeing: U('1581092918056-0c4c3acd3789', 1800, 900), // industrial technician
  lowes: U('1581092160562-40aa08e78837', 1800, 900), // warehouse associate
}

/* School page heroes, keyed by school id. */
export const SCHOOL_IMAGES = {
  franklin: U('1562774053-701939374585', 1800, 800),
  snhu: U('1541339907198-e08756dedf3f', 1800, 800),
  txwes: U('1571260899304-425eee4c7efc', 1800, 800),
  abilene: U('1498243691581-b145c3f54a5a', 1800, 800),
  mckendree: U('1607237138185-eedd9c632b0b', 1800, 800),
  'nursing-u': U('1516549655169-df83a0774514', 1800, 800),
  'state-online': U('1592280771190-3e2e4d571952', 1800, 800),
  'metro-tech': U('1581092795360-fd1ca04f0952', 1800, 800),
  /* Directory build-out (2026-08-20): every school gets a photo. All ids
     curl-verified 200 AND eyeballed on a contact sheet before landing here —
     a 200 can still be a hamburger. Mock pairings; production uses
     school-supplied photography. */
  'aurora-state': U('1541829070764-84a7d30dd3f3', 1800, 800),
  'blue-ash': U('1568792923760-d70635a89fdc', 1800, 800),
  'camden-valley': U('1580537659466-0a9bfa916a54', 1800, 800),
  cedarfield: U('1517486808906-6ca8b3f04846', 1800, 800),
  'csu-global': U('1523580494863-6f3031224c94', 1800, 800),
  harborview: U('1574958269340-fa927503f3dd', 1800, 800),
  herzing: U('1524995997946-a1c2e315a42f', 1800, 800),
  'lakeland-state': U('1481627834876-b7833e8f5570', 1800, 800),
  meridian: U('1507842217343-583bb7270b66', 1800, 800),
  'northgate-tech': U('1521587760476-6c12a4b040da', 1800, 800),
  'pacific-crest': U('1580582932707-520aed937b7b', 1800, 800),
  'riverside-pub': U('1519452635265-7b1fbfd1e4e0', 1800, 800),
  'summit-ridge': U('1591123120675-6f7f1aae0e5b', 1800, 800),
  umsl: U('1543505298-b8be9b52a21a', 1800, 800),
  'upper-iowa': U('1527891751199-7225231a68dd', 1800, 800),
  westcliff: U('1583373834259-46cc92173cb7', 1800, 800),
}

/* Category landing heroes (2026-08-20). Reuses ids already verified above. */
export const CATEGORY_IMAGES = {
  'business-leadership': U('1552581234-26160f608093', 1800, 600),
  'tech-engineering': U('1550751827-4bd374c3f58b', 1800, 600),
  healthcare: U('1519494026892-80bbd2d6fd0d', 1800, 600),
  'people-public': U('1509062522246-3755977927d7', 1800, 600),
}

/*
 * Editorial photo for the Why-AllCampus band.
 *
 * 2026-08-26: reassigned. This slot previously reused
 * 1552581234-26160f608093, which is ALSO GOAL_IMAGES['move-into-management'] —
 * and that goal is the first outcome card under every employer that emphasizes
 * business, so the same photograph appeared twice on one page, once as a
 * full-height editorial shot. The goal photo keeps the id because it does
 * identification work for a specific outcome; this slot is decorative, so it
 * moved. New id eyeballed on a contact sheet, not just curl-checked.
 */
export const WHY_IMAGE = U('1522202176988-66273c2fd55f', 900, 1100)

/*
 * Subject photography for program thumbnails (2026-08-25 polish).
 *
 * The catalog's own imageUrl field draws from a 28-image pool that includes
 * the same head-and-shoulders portraits used for learner stories and personas.
 * The result: 25 programs showed a stranger's face as their subject thumbnail,
 * and one face appeared BOTH as a testimonial and as a program tile. These
 * area-keyed photographs replace only those portrait hits, so the pool's
 * variety survives everywhere else. All ids eyeballed on a contact sheet.
 */
const PORTRAIT_IDS = new Set([
  '1494790108377-be9c29b29330',
  '1507003211169-0a1dd7228f2d',
  '1573496359142-b8d87734a5a2',
  '1519085360753-af0119f7cbe7',
  '1580489944761-15a19d654956',
  '1531427186611-ecfd6d936c79',
  '1573497019940-1c28c88b4f3e',
])

const AREA_PROGRAM_IMAGES = {
  business: ['1454165804606-c3d57bc86b40', '1552581234-26160f608093'],
  it: ['1522071820081-009f0129c71c', '1551288049-bebda4e38f71'],
  engineering: ['1567789884554-0b844b597180', '1581092918056-0c4c3acd3789'],
  healthcare: ['1631217868264-e5b90bb7e133', '1519494026892-80bbd2d6fd0d'],
  education: ['1509062522246-3755977927d7', '1497215728101-856f4ea42174'],
  'justice-legal': ['1589829545856-d10d557cf95f', '1436450412740-6b988f486c6b'],
  'liberal-arts': ['1481627834876-b7833e8f5570', '1505664194779-8beaceb93744'],
  'social-work': ['1544027993-37dbfe43562a', '1552664730-d307ca884978'],
}

/* Is this url one of the portraits that shouldn't stand in for a subject? */
export const isPortraitUrl = (url) => {
  if (!url) return false
  const m = /photo-([\w-]+)/.exec(url)
  return !!m && PORTRAIT_IDS.has(m[1])
}

/* Deterministic pick so a program keeps the same photo across renders. */
export const areaProgramImage = (areaId, seed = '') => {
  const options = AREA_PROGRAM_IMAGES[areaId]
  if (!options) return null
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973
  return U(options[h % options.length])
}

/* Ally band (2026-08-25): someone working a decision through, not a diagram. */
export const ALLY_IMAGE = U('1522071820081-009f0129c71c', 900, 800)

export const programImage = (id) => PROGRAM_IMAGES[id] || null
export const categoryImage = (id) => CATEGORY_IMAGES[id] || null
export const goalImage = (id) => GOAL_IMAGES[id] || null
export const storyImage = (id) => STORY_IMAGES[id] || null
export const personaImage = (id) => PERSONA_IMAGES[id] || null
export const heroImage = (partnerId) => HERO_IMAGES[partnerId] || HERO_IMAGES.default
export const schoolImage = (id) => SCHOOL_IMAGES[id] || null
