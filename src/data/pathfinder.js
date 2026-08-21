import { AREAS } from './taxonomy.js'

/*
 * Pathfinder model (2026-08-21 reset, Brigid's Aug 20 session).
 *
 * The premise: ~80% of enrollees need hand-holding (Brigid places 80% of the
 * people who start classes). The pathfinder collects 2-3 answers into an
 * education profile, confirming what the partner landing page already tells
 * us (the Amazon car-battery model) and collecting only what it can't.
 *
 * Starting points, not personas: her follow-up note splits arrivals into
 * school-in-mind checkers (a large %), confidence-seekers who need the big
 * picture before options, and self-servers who skip this entirely.
 */
export const START_OPTIONS = [
  {
    id: 'school-in-mind',
    label: 'I already have a school in mind',
    why: 'We check whether it is in the network, so your discount and benefit apply.',
  },
  {
    id: 'finish',
    label: 'Finish a degree I started',
    why: 'We lead with completion-friendly programs that take the credits you have.',
  },
  {
    id: 'move-up',
    label: 'Move up in my field',
    why: 'We lead with graduate degrees and certificates that build on your experience.',
  },
  {
    id: 'change',
    label: 'Change careers',
    why: 'We lead with entry credentials that open a new field.',
  },
  {
    id: 'exploring',
    label: 'Just exploring for now',
    why: 'No pressure. We show the full range and you narrow at your own pace.',
  },
]

export const BENEFIT_OPTIONS = [
  { id: 'have', label: 'Yes, my employer reimburses tuition' },
  { id: 'none', label: 'No reimbursement, just the discounts' },
  { id: 'unsure', label: 'I honestly don’t know' },
]

export const AREA_OPTIONS = AREAS

/** Friendly labels for the profile summary and the hero card. */
export function startLabel(id) {
  return START_OPTIONS.find((o) => o.id === id)?.label || null
}

/**
 * Profile -> programs. Deliberately simple and explainable: the profile is a
 * lens, never a wall. An empty or exploring profile matches everything.
 */
export function matchPrograms(profile, programs) {
  let out = programs
  if (profile?.schoolId) {
    out = out.filter((p) => p.schoolId === profile.schoolId)
  }
  if (profile?.areaId && profile.areaId !== 'unsure') {
    out = out.filter((p) => p.areaId === profile.areaId)
  }
  switch (profile?.start) {
    case 'finish':
      out = out.filter((p) => p.degreeLevel === "Bachelor's" || p.degreeLevel === 'Associate')
      break
    case 'move-up':
      out = out.filter((p) => p.degreeLevel === "Master's" || p.degreeLevel === 'Certificate')
      break
    case 'change':
      out = out.filter((p) => p.degreeLevel === "Bachelor's" || p.degreeLevel === 'Certificate')
      break
    default:
      break
  }
  return out
}
