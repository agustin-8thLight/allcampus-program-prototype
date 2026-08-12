/*
 * Story-driven use cases (2026-08-12 direction): the prototype opens on four
 * realistic learner walkthroughs, each keyed to a REAL partner and paying off
 * specific moves from the Search & Ally recommendation. The StoryCoach reads
 * `steps` and advances when `advanceOn` matches an app event (see
 * emitStoryEvent) or a route prefix.
 *
 * Personas come from the Workplace Platform persona research; the four
 * archetypes and their employers come from the journey research (AllCampus
 * Flows, May 2026). Internal review only.
 */

export const USE_CASES = [
  {
    id: 'devon',
    name: 'Devon',
    employerId: 'sheetz',
    title: 'Use my Sheetz benefit to move up',
    who: 'Store team lead · direct partner · benefit known',
    personas: 'Career Advancer · New Learner',
    entry: '/',
    intentSuggestion: 'soon',
    color: 208,
    blurb:
      'Devon got an email from Sheetz about the education benefit. She wants a business credential that her benefit actually pays for — and a clear answer on what she’d owe.',
    steps: [
      { advanceOn: { route: '/' }, hint: 'This is Devon’s front door: Sheetz-branded, search first. Find the benefit block — her employer’s money is explained on the page.' },
      { advanceOn: { event: 'search' }, hint: 'Search “business” from the hero — Devon knows roughly what she wants.' },
      { advanceOn: { event: 'save' }, hint: 'Browse the results, then tap Save on a program that looks right. Saving is the value moment…' },
      { advanceOn: { event: 'gate-join' }, hint: '…so the account ask appears only now. Join — and notice what it promises: your exact price.' },
      { advanceOn: { event: 'intent' }, hint: 'Devon is “looking to start soon.” Pick that intent and watch the results reshape around affordability and deadlines.' },
      { advanceOn: { event: 'drawer' }, hint: 'Open a program. The cost block now does the math: total, and Devon’s estimated out-of-pocket with the Sheetz benefit.' },
      { advanceOn: { event: 'fork' }, hint: 'Choose “Get program details.” The benefits specialist leads the fork — Devon’s benefit questions get a human, without losing her place.' },
      { advanceOn: null, hint: 'That’s Devon’s path: door → browse → join at the value moment → a real price → a person. Moves 1, 2, 3, 5 and 6, paid off.' },
    ],
  },
  {
    id: 'samir',
    name: 'Samir',
    employerId: 'texas-roadhouse',
    title: 'No benefit — the cheapest real option',
    who: 'Server · direct partner · no reimbursement',
    personas: 'New Learner · Career Changer',
    entry: '/',
    intentSuggestion: 'exploring',
    color: 152,
    blurb:
      'Samir found the education program on a work flyer. Texas Roadhouse doesn’t reimburse tuition — so the only thing that matters is what things actually cost.',
    steps: [
      { advanceOn: { route: '/' }, hint: 'Samir’s landing page is honest about his situation: no reimbursement, but partner discounts still apply. No false promises.' },
      { advanceOn: { event: 'search' }, hint: 'Search “healthcare” — Samir wants a certification that changes his week, not a four-year plan.' },
      { advanceOn: { event: 'quick-filter' }, hint: 'Use the Most affordable quick filter. For Samir, cost order IS relevance.' },
      { advanceOn: { event: 'gate-join' }, hint: 'Try to save or compare two certificates — the account ask arrives only when it’s useful. Join as Samir.' },
      { advanceOn: { event: 'intent' }, hint: 'He’s “exploring options for down the road.” Pick that intent: the guided start, not a hard sell.' },
      { advanceOn: { event: 'drawer' }, hint: 'Open a certificate. Total cost up front — no per-credit puzzle, no benefit that doesn’t exist.' },
      { advanceOn: null, hint: 'Samir’s path proves the experience works without a benefit: honesty, cost-first ordering, and a gentle start. Moves 2, 3 and 5.' },
    ],
  },
  {
    id: 'carl',
    name: 'Carl',
    employerId: 'boeing',
    title: 'A niche skill through BenefitHub',
    who: 'Boeing technician · channel partner · ~$10,000/yr benefit',
    personas: 'Upskiller · Career Advancer',
    entry: '/school/franklin',
    intentSuggestion: 'benefits',
    color: 214,
    blurb:
      'Carl clicked through from BenefitHub and landed on a school page — not a homepage. He wants welding credit toward an engineering role, and he has ten thousand Boeing dollars a year to spend.',
    steps: [
      { advanceOn: { route: '/school/' }, hint: 'Carl lands where channel visitors actually land: a school page. Notice it’s browsable now — filters, real prices, his Boeing benefit named.' },
      { advanceOn: { event: 'search' }, hint: 'Search “welding” — Carl’s actual skill. The catalog doesn’t have it…' },
      { advanceOn: { event: 'empty-state' }, hint: '…and this is the payoff: the empty state tells the truth, suggests nearby fields, offers to request the program — and Ally steps in carrying his exact words.' },
      { advanceOn: { event: 'ally-related' }, hint: 'Take Ally’s suggestion: Industrial & systems engineering — welding-adjacent, credit for trade experience.' },
      { advanceOn: { event: 'drawer' }, hint: 'Open the Engineering Technology program. Boeing’s $10,000 turns a $12,300 year into a real number Carl can say out loud.' },
      { advanceOn: null, hint: 'Carl’s dead end became a conversation, and a conversation became a plan. Move 4, plus the school page and the math.' },
    ],
  },
  {
    id: 'tina',
    name: 'Tina',
    employerId: 'lowes',
    title: 'Just looking, on a phone',
    who: 'Lowe’s associate · channel partner · no reimbursement',
    personas: 'The Explorer · New Learner',
    entry: '/',
    intentSuggestion: 'benefits',
    color: 32,
    mobile: true,
    blurb:
      'Tina opened the link from a benefits portal on her phone, on a break. She isn’t sure school is for her. The first screen decides whether there’s a second one.',
    steps: [
      { advanceOn: { route: '/' }, hint: 'Narrow your window (or open devtools mobile view). Tina’s first screen is content — headline, search, a story — not blank space.' },
      { advanceOn: { event: 'ally-entry' }, hint: 'She pokes the helper — same name, same voice it will have after she joins. It helps first; it never opens with an account question.' },
      { advanceOn: { event: 'gate-join' }, hint: 'Search something affordable, then tap Save on a program — the join ask appears only now. Join as Tina.' },
      { advanceOn: { event: 'intent' }, hint: 'The benefit explainer is honest: Lowe’s doesn’t reimburse — so it pivots to partner discounts and low-cost, self-paced options.' },
      { advanceOn: { event: 'drawer' }, hint: 'Browse the affordable certificates it suggests and open one. Total cost, plain language, no pressure.' },
      { advanceOn: null, hint: 'Tina never hit a wall, a blank screen, or a stranger. Move 1 on mobile, and the one-assistant story, paid off.' },
    ],
  },
]

export function getUseCase(id) {
  return USE_CASES.find((u) => u.id === id) || null
}

/*
 * Story event bus: app surfaces fire named events; the StoryCoach listens and
 * advances the active story when the current step's `advanceOn.event` matches.
 * Events: search, quick-filter, save, gate-join, intent, drawer, fork,
 * empty-state, ally-related, ally-entry.
 */
export function emitStoryEvent(type, detail = {}) {
  window.dispatchEvent(new CustomEvent('story-event', { detail: { type, ...detail } }))
}
