/*
 * School model (build plan §5, §8).
 *
 * routingType drives the CTA flow:
 *   'standard'     -> AllCampus-managed RFI: single CTA -> guided step ->
 *                     school-contact confirmation gate. Nothing reaches the
 *                     school until the user confirms.
 *   'directHandoff'-> hands the user entirely to the school's own funnel.
 *                     Single CTA links straight out, no gate, no specialist step.
 *
 * partnerHighlight is merchandising only (corporate-partner programs surfaced
 * or sorted up), NOT a routing concern.
 *
 * HANDOFF NOTE: field names here are best-guess and must be reconciled
 * one-to-one with the developer's content-types doc before Bubble build.
 *
 * The normalized fields below (accreditation, location, completionRate, about,
 * website) are the "school as a first-class entity" model: surfaced
 * consistently in 2B/2C to fix the sporadic school-info problem. VALUES HERE
 * ARE MOCK and must be replaced with sourced, verified data before any external
 * use. metro-tech is intentionally left sparse to test graceful handling.
 */

export const SCHOOLS = {
  'txwes': {
    id: 'txwes',
    name: 'Texas Wesleyan University',
    logoMonogram: 'TW',
    logoColor: '#5b2a86',
    routingType: 'standard',
    partnerHighlight: true,
    accreditation: 'SACSCOC accredited',
    location: 'Fort Worth, TX, and online',
    completionRate: 0.62,
    about: 'Private university known for small classes and programs built for working adults.',
    website: 'https://example.com/txwes',
    highlights: ['Small class sizes', 'Faculty who are working professionals', 'Career coaching included'],
  },
  'abilene': {
    id: 'abilene',
    name: 'Abilene Christian University',
    logoMonogram: 'AC',
    logoColor: '#4f2d7f',
    routingType: 'standard',
    partnerHighlight: false,
    accreditation: 'SACSCOC accredited',
    location: 'Abilene, TX, and online',
    completionRate: 0.58,
    about: 'Faith-based private university with a growing online catalog.',
    website: 'https://example.com/abilene',
    highlights: ['Faith-based community', 'Flexible online scheduling', 'Dedicated student support'],
  },
  'nursing-u': {
    id: 'nursing-u',
    name: 'Nursing University',
    logoMonogram: 'NU',
    logoColor: '#0f766e',
    routingType: 'standard',
    partnerHighlight: false,
    accreditation: 'CCNE and regionally accredited',
    location: 'Online',
    completionRate: 0.71,
    about: 'Health-focused institution specializing in nursing and allied health.',
    website: 'https://example.com/nursing-u',
    highlights: ['Specialized in healthcare', 'Clinically experienced faculty', 'Strong employer connections'],
  },
  'state-online': {
    id: 'state-online',
    name: 'State Online University',
    logoMonogram: 'SO',
    logoColor: '#1d4ed8',
    routingType: 'standard',
    partnerHighlight: false,
    accreditation: 'HLC accredited',
    location: 'Online',
    completionRate: 0.55,
    about: 'Public online university focused on flexible, career-aligned degrees.',
    website: 'https://example.com/state-online',
    highlights: ['Public-university affordability', 'Fully online and flexible', 'Credit for prior learning'],
  },
  'snhu': {
    id: 'snhu',
    name: 'Southern New Hampshire University',
    logoMonogram: 'SN',
    logoColor: '#003366',
    // Direct-handoff school #1 (configured by id, not hardcoded in components).
    routingType: 'directHandoff',
    partnerHighlight: false,
    accreditation: 'NECHE accredited',
    location: 'Manchester, NH, and online',
    completionRate: 0.51,
    about: 'One of the largest nonprofit online universities in the US.',
    website: 'https://example.com/snhu',
    highlights: ['Large nonprofit online university', '8-week terms', '24/7 student support'],
  },
  'metro-tech': {
    id: 'metro-tech',
    name: 'Metro Tech Institute',
    logoMonogram: 'MT',
    logoColor: '#b45309',
    // Direct-handoff school #2. Intentionally sparse: tests graceful handling
    // of missing accreditation / completion data.
    routingType: 'directHandoff',
    partnerHighlight: false,
    accreditation: null,
    location: 'Online',
    completionRate: null,
    about: 'Career-focused technical institute.',
    website: 'https://example.com/metro-tech',
    highlights: ['Project-based learning', 'Industry-aligned curriculum', 'Career services'],
  },
}

/** Ids that hand the user straight to the school's own funnel. */
export const DIRECT_HANDOFF_SCHOOL_IDS = Object.values(SCHOOLS)
  .filter((s) => s.routingType === 'directHandoff')
  .map((s) => s.id)

export function getSchool(schoolId) {
  return SCHOOLS[schoolId] || null
}

export function isDirectHandoff(schoolId) {
  return DIRECT_HANDOFF_SCHOOL_IDS.includes(schoolId)
}
