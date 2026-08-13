import MkHeader from '../components/landing/MkHeader.jsx'
import SearchHero from '../components/landing/SearchHero.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import BenefitBlock from '../components/landing/BenefitBlock.jsx'
import EcosystemStrip from '../components/landing/EcosystemStrip.jsx'
import GoalsExplorer from '../components/landing/GoalsExplorer.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Eyebrow, Heading, MkButton } from '../components/landing/Section.jsx'

/*
 * Redesigned landing page (2026-08-11 client meeting). Section order:
 *  1. Search front and center (degree level + modality selectors)
 *  2. Ally below search, as the benefits-questions entry point
 *  3. Education benefit block (known / unknown states)
 *  4. "How this works" ecosystem strip (mental-model gap)
 *  5. Skills by area (replaces the random program carousel)
 *  6. Learner stories (swappable by partner)
 *  7. Partner school logos (stays)
 *  8. FAQ (stays, bottom)
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
        onSearch={({ q, area, skill, degree, modality }) =>
          goBrowse({ q, area, skill, degree, modality })
        }
      />

      <AllyEntry partner={partner} />

      <BenefitBlock
        partner={partner}
        onSeeFullyCovered={() => goBrowse({ covered: 1 })}
        onCheckEmployer={() => goBrowse({})}
      />

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Eyebrow>How this works</Eyebrow>
        <Heading className="mb-6 mt-2">Four parts, one path to your degree</Heading>
        <EcosystemStrip variant="landing" />
      </section>

      <div className="pt-16">
        <GoalsExplorer
          partner={partner}
          onSelectGoal={(goal) => goBrowse({ goal: goal.id })}
          onSelectArea={(area) => goBrowse({ area: area.id })}
        />
      </div>

      <StoryCards partner={partner} />

      <LogoStrip onSelectSchool={(s) => onNavigate(`/school/${s.id}`)} />

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
