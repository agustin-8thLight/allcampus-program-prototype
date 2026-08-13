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
  default: U('1523240795612-9a054b0db644', 1800, 900), // adults collaborating
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
}

export const programImage = (id) => PROGRAM_IMAGES[id] || null
export const goalImage = (id) => GOAL_IMAGES[id] || null
export const storyImage = (id) => STORY_IMAGES[id] || null
export const personaImage = (id) => PERSONA_IMAGES[id] || null
export const heroImage = (partnerId) => HERO_IMAGES[partnerId] || HERO_IMAGES.default
export const schoolImage = (id) => SCHOOL_IMAGES[id] || null
