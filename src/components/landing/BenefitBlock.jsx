import { Eyebrow, Heading, Body, MkButton } from './Section.jsx'
import { money, PROGRAMS } from '../../data/model.js'
import { estimatedOutOfPocket, fullyCoveredPrograms } from '../../data/benefit.js'

/*
 * Education benefit block (2026-08-11 meeting): show the known benefit
 * clearly, with estimated out-of-pocket and a CTA that filters fully covered
 * programs. Unknown-benefit employers get the fallback state.
 *
 * ESTIMATES ONLY — mock figures, labeled as such in the UI. Real benefit
 * math must be verified before anything client-facing ships.
 */

export default function BenefitBlock({ partner, onSeeFullyCovered, onCheckEmployer, programs = PROGRAMS }) {
  const known = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0

  if (!known) {
    return (
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Eyebrow>Your education benefit</Eyebrow>
        <div className="mt-3 grid grid-cols-1 items-center gap-8 rounded-xl border border-mk-line bg-white p-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Heading size="sm">Does your employer help pay for school?</Heading>
            <Body className="mt-2 max-w-lg">
              Many employers cover part of your tuition every year, and AllCampus partner
              discounts stack on top. Check whether your employer participates — it changes what
              you&rsquo;d actually pay.
            </Body>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <MkButton tone="teal" onClick={onCheckEmployer}>
              Check if your employer participates
            </MkButton>
            <p className="font-display text-[12.5px] text-mk-body">
              Not sure? Ask Ally below, or browse with partner pricing anyway.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const covered = fullyCoveredPrograms(programs, partner)
  const cheapestOop = programs
    .map((p) => estimatedOutOfPocket(p, partner))
    .filter((v) => v != null)
    .sort((a, b) => a - b)[0]

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16">
      <Eyebrow>Your education benefit</Eyebrow>
      <div className="mt-3 grid grid-cols-1 items-center gap-8 rounded-xl bg-mk-band p-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Heading size="sm">Your tuition benefit is ready to go when you are</Heading>
          <Body className="mt-2 max-w-lg">
            {partner.name} offers up to{' '}
            <strong className="text-mk-slate">{money(partner.employerReimbursement)}/year</strong> in
            tuition support. Through its partnership with AllCampus, that benefit applies to
            discounted, career-focused programs — some fully covered.
          </Body>
          <p className="mt-3 font-display text-[13px] text-mk-body">
            Estimated out-of-pocket starts at{' '}
            <strong className="text-mk-slate">{money(cheapestOop ?? 0)}</strong> for your first
            year.{' '}
            <span className="text-mk-body/70">Estimates with mock data; confirm with your benefits administrator.</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <MkButton tone="teal" onClick={onSeeFullyCovered}>
            See fully covered programs{covered.length ? ` (${covered.length})` : ''}
          </MkButton>
          <p className="font-display text-[12.5px] text-mk-body">
            Or browse everything with your discount applied.
          </p>
        </div>
      </div>
    </section>
  )
}
