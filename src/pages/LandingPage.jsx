import MkHeader from '../components/landing/MkHeader.jsx'
import SearchHero from '../components/landing/SearchHero.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import BenefitsAndHow from '../components/landing/BenefitsAndHow.jsx'
import GoalsExplorer from '../components/landing/GoalsExplorer.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Heading, MkButton } from '../components/landing/Section.jsx'

/*
 * Landing page (2026-08-19 Brigid session structure):
 *  1. Hero: search card (Current) or the always-open skills navigator
 *     (Navigator variant; search moves to the nav)
 *  2. BenefitsAndHow: the education benefit + how-this-works, combined into
 *     one band ("the two big benefits, here's how this works")
 *  3. Discovery band: outcome image cards + compact subject-tile strip
 *  4. Learner stories
 *  5. Partner school logos (kept, capped)
 *  6. FAQ
 *  7. Ally: tertiary at the very bottom, generic copy, no promises
 */

export default function LandingPage({ partner, homeVariant = 'current', joined = false, onGate, onNavigate }) {
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
        navigator={homeVariant === 'navigator'}
        onNavigate={onNavigate}
        onSearch={({ q, area, skill, goal, degree }) => goBrowse({ q, area, skill, goal, degree })}
      />

      {/* 2026-08-19 session: the education-benefit block and the
          how-this-works section combine into one idea. "Here are the two big
          benefits for you, here's how this works." */}
      <BenefitsAndHow partner={partner} joined={joined} onGate={onGate} />

      {/* One discovery band (2026-08-19): outcomes lead as the emotive image
          cards, the four subject tiles ride along as a compact strip inside —
          two entries, one block, no lookalike sections. Tiles open the
          category landing pages (Aug 14 ask). */}
      <GoalsExplorer
        partner={partner}
        onSelectGoal={(goal) => goBrowse({ goal: goal.id })}
        onSelectCategory={(c) => onNavigate(`/category/${c.id}`)}
      />

      <StoryCards partner={partner} />

      <LogoStrip
        onSelectSchool={(s) => onNavigate(`/school/${s.id}`)}
        onSeeAll={() => onNavigate('/schools')}
      />

      <LandingFaq />

      {/* Ally, tertiary at the very bottom (2026-08-19: "this Alley block is
          the right one to put at the bottom of the page"). Generic copilot
          framing, no out-of-pocket promises. */}
      <AllyEntry partner={partner} />

      {/* Closing CTA: the dark bookend. Mirrors the hero (and the account
          card's gradient) so the page opens and closes with the same weight,
          then flows into the slate footer. A pale band here read as an
          afterthought. */}
      <section className="bg-gradient-to-br from-mk-teal-600 to-mk-slate py-14 text-center">
        <Heading size="sm" className="text-white">Unlock your potential</Heading>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => goBrowse({})}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
          >
            Explore programs
          </button>
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus landing-page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
