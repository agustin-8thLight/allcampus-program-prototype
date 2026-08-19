import MkHeader from '../components/landing/MkHeader.jsx'
import SearchHero from '../components/landing/SearchHero.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import BenefitBlock from '../components/landing/BenefitBlock.jsx'
import EcosystemStrip from '../components/landing/EcosystemStrip.jsx'
import GoalsExplorer from '../components/landing/GoalsExplorer.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { hasBenefitAdmin, policyOwner, PREAPPROVAL_RULE } from '../data/corporatePartners.js'

/*
 * Landing page: the 8/11 structure with the Aug 14 meeting's requested
 * updates applied as increments (2026-08-19):
 *  1. Search front and center (Format filter removed, 100% online badge)
 *  2. Education benefit block (known / unknown states)
 *  3. "How this works" strip + an accurate "what you do next" step list
 *     (the meeting's top priority: steps that build confidence)
 *  4. Discovery band: outcome image cards + a compact subject-tile strip
 *     (four buckets → category landing pages) inside one section
 *  6. Learner stories
 *  7. Ally — MOVED below stories and reframed to career guidance per the
 *     meeting ("helpful copilot, not the anchor feature")
 *  8. Partner school logos, FAQ (unchanged)
 */

export default function LandingPage({ partner, onNavigate }) {
  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')),
    ).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      <SearchHero
        partner={partner}
        onSearch={({ q, area, skill, goal, degree }) => goBrowse({ q, area, skill, goal, degree })}
      />

      <BenefitBlock
        partner={partner}
        onSeeFullyCovered={() => goBrowse({ covered: 1 })}
        onSeeBestValue={() => goBrowse({ filter: 'mostAffordable' })}
        onCheckEmployer={() => goBrowse({})}
      />

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Eyebrow>How this works</Eyebrow>
        <Heading className="mb-6 mt-2">
          {hasBenefitAdmin(partner) ? 'Five parts' : 'Four parts'}, one path to your degree
        </Heading>
        <EcosystemStrip variant="landing" partner={partner} />

        {/* "What do you do next" (Aug 14: users ask exactly this, and the
            current steps were "close but not accurate enough"). Accuracy
            anchors: the AllCampus discount and an employer benefit are two
            different things that stack, and pre-approval needs a program
            picked first (Brigid's journey map + her Quick Guide's own Step 1).
            DRAFT copy for James and Brigid's wordsmithing. */}
        <div className="mt-8 rounded-xl border border-mk-line bg-white p-5 sm:p-6">
          <h3 className="font-display text-[16px] font-extrabold text-mk-slate">
            What you do, in order
          </h3>
          <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: 'Find a qualifying program',
                b: 'Search or browse by subject or outcome. Nothing needs approving at this stage.',
              },
              {
                t: 'Create a free account',
                b: 'It attaches your employer pricing, so you see your real cost instead of list prices.',
              },
              {
                t: 'Confirm your benefit',
                b: `${policyOwner(partner) || 'Your employer'} decides eligibility and approves funding. A free specialist call walks you through it first. ${PREAPPROVAL_RULE}`,
              },
              {
                t: 'Apply through AllCampus',
                b: 'Applying through AllCampus keeps your discount attached; going straight to the school means standard tuition.',
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mk-blue-50 font-display text-[13px] font-black text-mk-teal-700 ring-1 ring-mk-blue-200">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-[14px] font-extrabold text-mk-slate">
                    {s.t}
                  </span>
                  <span className="mt-1 block font-display text-[13px] leading-relaxed text-mk-body">
                    {s.b}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <Body className="mt-4 text-[13px]">
            <span className="font-bold text-mk-slate">Two kinds of savings, and they stack:</span>{' '}
            the AllCampus discount is a lower rate that applies automatically when you enroll
            through us. An employer benefit is money toward that discounted amount, with its own
            eligibility, approval, and paperwork owned by your employer.
          </Body>
        </div>
      </section>

      {/* One discovery band (2026-08-19): outcomes lead as the emotive image
          cards, the four subject tiles ride along as a compact strip inside —
          two entries, one block, no lookalike sections. Tiles open the
          category landing pages (Aug 14 ask). */}
      <div className="pt-16">
        <GoalsExplorer
          partner={partner}
          onSelectGoal={(goal) => goBrowse({ goal: goal.id })}
          onSelectCategory={(c) => onNavigate(`/category/${c.id}`)}
        />
      </div>

      <StoryCards partner={partner} />

      <AllyEntry partner={partner} />

      <LogoStrip onSelectSchool={(s) => onNavigate(`/school/${s.id}`)} onSeeAll={() => goBrowse({})} />

      <LandingFaq />

      {/* Closing CTA band, mirrors the live template's "Unlock your potential" */}
      <section className="bg-mk-band py-14 text-center">
        <Heading size="sm">Unlock your potential</Heading>
        <div className="mt-4">
          <MkButton tone="teal" onClick={() => goBrowse({})}>
            Explore programs
          </MkButton>
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus landing-page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
