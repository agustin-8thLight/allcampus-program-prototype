/*
 * "Who this program is for" content (Brigid's recommendation: let users
 * self-select early). Keyed by program id. MOCK / FPO, swap with real content.
 * Optional notFitIf sharpens the fit.
 */
export const WHO_FOR = {
  'txwes-mba-corporate': {
    whoFor: [
      'Professionals looking to move into management roles',
      'Early-career employees building business fundamentals',
      'Career changers entering business-focused roles',
    ],
    notFitIf: ['You want highly technical finance or accounting training', 'You want an in-person program'],
  },
  'abilene-prehealth-cert': {
    whoFor: [
      'People preparing to apply to nursing or allied-health programs',
      'Career changers moving into healthcare',
      'Those who need prerequisite courses before a graduate program',
    ],
  },
  'nursing-u-healthcare-admin': {
    whoFor: [
      'People entering healthcare administration',
      'Current healthcare workers moving into an admin role',
      'New learners who want an associate degree to start',
    ],
  },
  'snhu-ba-english': {
    whoFor: [
      'Lifelong readers and writers',
      'Those planning to pursue an MA in English',
      'Career changers moving into writing or communications',
    ],
  },
  'state-online-supply-chain': {
    whoFor: [
      'People entering logistics, procurement, or operations',
      'Working adults who need flexible pacing',
      'Career changers moving into supply chain',
    ],
  },
  'metro-tech-cs': {
    whoFor: [
      'Aspiring software engineers',
      'Career changers moving into tech',
      'Those building a portfolio to show employers',
    ],
  },
}
