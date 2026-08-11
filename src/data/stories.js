/*
 * Learner stories, keyed by corporate partner to demonstrate the meeting
 * requirement that stories are swappable by channel partner / employer.
 * FICTIONAL people and quotes (FPO), written to model the "relatable
 * narrative" structure: person + constraint + benefit use + outcome.
 * Photos are FPO gradients until real learner photography is licensed.
 */

const DEFAULT_STORIES = [
  {
    id: 'maria',
    name: 'Maria T.',
    role: 'Store team lead',
    hue: 208,
    program: 'BS Supply Chain Management',
    quote:
      'I work full time and still finished a course every eight weeks. My tuition benefit covered most of it, and I only paid a few hundred dollars out of pocket.',
  },
  {
    id: 'devon',
    name: 'Devon R.',
    role: 'Operations supervisor',
    hue: 152,
    program: 'Project Management Certificate',
    quote:
      'I didn’t know where to start, so I asked about my benefit first. Once I saw what my employer covered, picking the certificate was easy.',
  },
  {
    id: 'amara',
    name: 'Amara N.',
    role: 'Patient services coordinator',
    hue: 268,
    program: 'Healthcare Administration, Associate',
    quote:
      'The part I expected to be hard, tuition, turned out to be the easy part. The discount applied automatically because I enrolled through my employer’s program.',
  },
]

const STORIES_BY_PARTNER = {
  'duncan-avn': [
    {
      id: 'kyle',
      name: 'Kyle S.',
      role: 'Avionics technician',
      hue: 214,
      program: 'BS Computer Science',
      quote:
        'I wanted to move from the hangar floor toward systems work. My benefit covered the first year, and I studied on nights between shifts.',
    },
    {
      id: 'renata',
      name: 'Renata M.',
      role: 'Maintenance planner',
      hue: 32,
      program: 'Data Analytics Certificate',
      quote:
        'The certificate was fully covered under our benefit. Six months later I moved into a planning-analytics role.',
    },
    {
      id: 'devon',
      name: 'Devon R.',
      role: 'Operations supervisor',
      hue: 152,
      program: 'Project Management Certificate',
      quote:
        'I didn’t know where to start, so I asked about my benefit first. Once I saw what my employer covered, picking the certificate was easy.',
    },
  ],
}

export function storiesForPartner(partnerId) {
  return STORIES_BY_PARTNER[partnerId] || DEFAULT_STORIES
}
