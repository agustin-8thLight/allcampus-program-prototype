import { useState } from 'react'
import { Eyebrow, Heading, Body, MkButton } from './Section.jsx'
import { money, PROGRAMS } from '../../data/model.js'
import {
  estimatedOutOfPocket,
  fullyCoveredPrograms,
  discountSavings,
  bestSavingsProgram,
  bestDiscountPercent,
  lowestOutOfPocket,
} from '../../data/benefit.js'
import { PREAPPROVAL_RULE, hasBenefitAdmin } from '../../data/corporatePartners.js'
import AllyOverlay from '../AllyOverlay.jsx'

/*
 * Education benefit module (A4, 2026-08-13 — restores the wireframe's
 * three-tile fidelity). Three employer states:
 *   1. Known benefit  — amount tile · estimate tile (opens Ally seeded with
 *      the out-of-pocket conversation) · fully-covered tile (routes to
 *      covered search)
 *   2. Known, NO reimbursement (Texas Roadhouse, Lowe's) — honest headline;
 *      discount-forward tiles
 *   3. Unknown employer — check-my-employer fallback
 *
 * ESTIMATES ONLY — mock figures, labeled in the UI. Verify real benefit
 * math before anything client-facing ships.
 */

function Tile({ onClick, children, tone = 'plain' }) {
  const Cmp = onClick ? 'button' : 'div'
  return (
    <Cmp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex h-full flex-col rounded-xl border p-6 text-left transition ${
        tone === 'accent'
          ? 'border-mk-teal-600/40 bg-white hover:border-mk-teal-600 hover:shadow-[0_6px_20px_rgba(69,120,140,0.14)]'
          : tone === 'purple'
            ? 'border-mk-purple/40 bg-white hover:border-mk-purple hover:shadow-[0_6px_20px_rgba(123,97,196,0.16)]'
            : 'border-mk-line bg-white'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </Cmp>
  )
}

const TileLabel = ({ children }) => (
  <span className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-mk-body">
    {children}
  </span>
)

export default function BenefitBlock({
  partner,
  onSeeFullyCovered,
  onSeeBestValue,
  onCheckEmployer,
  programs = PROGRAMS,
}) {
  const [allyOpen, setAllyOpen] = useState(false)
  const amount = partner?.employerReimbursement ?? 0
  const state = !partner?.benefitKnown ? 'unknown' : amount > 0 ? 'known' : 'none'

  const covered = fullyCoveredPrograms(programs, partner)
  const cheapestOop = lowestOutOfPocket(programs, partner)
  // Nothing fully covered? Lead with what IS true: what the partner discount
  // is worth and the cheapest real out-of-pocket — never a green zero.
  const topSaver = bestSavingsProgram(programs)
  const topSavings = topSaver ? discountSavings(topSaver) : null
  const topPercent = bestDiscountPercent(programs)

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16">
      <Eyebrow>Your education benefit</Eyebrow>

      {state === 'known' && (
        <>
          <Heading size="sm" className="mt-2">
            Your tuition benefit is ready to go when you are
          </Heading>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Tile 1: the benefit itself */}
            <Tile>
              <TileLabel>The {partner.name} benefit</TileLabel>
              <span className="mt-3 font-display text-[34px] font-black leading-none text-mk-slate">
                {money(amount)}
                <span className="text-[16.5px] font-bold text-mk-body">/year</span>
              </span>
              <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                Tuition support
                {hasBenefitAdmin(partner) ? `, administered by ${partner.benefitAdmin.name}` : ''} — it
                stacks on top of AllCampus partner discounts.
              </span>
              <span className="mt-auto pt-3 font-display text-[12px] leading-relaxed text-mk-body/70">
                Estimate.{' '}
                {partner.policyLocation
                  ? `Your policy and procedures live in ${partner.policyLocation}.`
                  : 'Confirm the current policy with your benefits administrator.'}
              </span>
            </Tile>

            {/* Tile 2: estimate my out-of-pocket → Ally overlay, seeded */}
            <Tile tone="purple" onClick={() => setAllyOpen(true)}>
              <TileLabel>What you’d actually pay</TileLabel>
              <span className="mt-3 font-display text-[22px] font-black leading-snug text-mk-slate">
                Estimate my out-of-pocket
                <span className="ml-1 text-mk-purple">→</span>
              </span>
              <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                First-year estimates start at{' '}
                <strong className="text-mk-slate">{money(cheapestOop ?? 0)}</strong> with your
                benefit applied. Ask Ally to walk your numbers — same math as every price card.
              </span>
              <span className="mt-auto flex items-center gap-1.5 pt-3 font-display text-[13px] font-bold text-mk-purple">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mk-purple text-[12px] text-white">✦</span>
                Opens Ally
              </span>
            </Tile>

            {/* Tile 3: fully covered when there are any; otherwise the honest
                positive — what the discount saves and the cheapest real price. */}
            {covered.length > 0 ? (
              <Tile tone="accent" onClick={onSeeFullyCovered}>
                <TileLabel>Zero out-of-pocket</TileLabel>
                <span className="mt-3 font-display text-[34px] font-black leading-none text-mk-green-700">
                  {covered.length}
                  <span className="ml-2 text-[16.5px] font-bold text-mk-slate">
                    fully covered program{covered.length === 1 ? '' : 's'}
                  </span>
                </span>
                <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                  Programs whose yearly cost fits inside your benefit — verified per program on its
                  price card.
                </span>
                <span className="mt-auto pt-3 font-display text-[13px] font-bold text-mk-teal-700">
                  See them in search →
                </span>
              </Tile>
            ) : (
              <Tile tone="accent" onClick={() => onSeeBestValue?.()}>
                <TileLabel>What the discount is worth</TileLabel>
                <span className="mt-3 font-display text-[34px] font-black leading-none text-mk-green-700">
                  {topSavings ? `Save ${money(topSavings)}` : 'Partner pricing'}
                </span>
                <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                  {topPercent
                    ? `Partner discounts reach ${topPercent}% off — up to ${money(topSavings || 0)} off a full program before your benefit is applied.`
                    : 'Every program here is priced below its standard tuition.'}
                  {cheapestOop != null && (
                    <>
                      {' '}
                      With your benefit, the lowest first-year out-of-pocket is{' '}
                      <strong className="text-mk-slate">{money(cheapestOop)}</strong>.
                    </>
                  )}
                </span>
                <span className="mt-auto pt-3 font-display text-[13px] font-bold text-mk-teal-700">
                  See the best-value programs →
                </span>
              </Tile>
            )}
          </div>
          <p className="mt-3 font-display text-[13px] text-mk-body">
            <span className="font-bold text-mk-slate">Order matters:</span> {PREAPPROVAL_RULE}
          </p>
        </>
      )}

      {state === 'none' && (
        <>
          <Heading size="sm" className="mt-2">
            {partner.name} doesn’t reimburse tuition — here’s what still works for you
          </Heading>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Tile>
              <TileLabel>The honest part</TileLabel>
              <span className="mt-3 font-display text-[15px] leading-relaxed text-mk-slate">
                {partner.policy ||
                  `${partner.name} doesn’t currently offer tuition reimbursement for this catalog.`}
              </span>
              <span className="mt-auto pt-3 font-display text-[12px] text-mk-body/70">
                Policies change — worth re-checking with your benefits team each year.
              </span>
            </Tile>
            <Tile tone="accent" onClick={() => onCheckEmployer?.()}>
              <TileLabel>Your lever: partner pricing</TileLabel>
              <span className="mt-3 font-display text-[22px] font-black leading-snug text-mk-slate">
                Every program here is discounted <span className="text-mk-teal-700">→</span>
              </span>
              <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                The {partner.name} partnership prices every program below its standard tuition —
                certificates start around {money(cheapestOop ?? 3600)} total.
              </span>
              <span className="mt-auto pt-3 font-display text-[13px] font-bold text-mk-teal-700">
                Browse most affordable first →
              </span>
            </Tile>
            <Tile tone="purple" onClick={() => setAllyOpen(true)}>
              <TileLabel>Plan it out</TileLabel>
              <span className="mt-3 font-display text-[22px] font-black leading-snug text-mk-slate">
                Ask Ally what things cost <span className="ml-1 text-mk-purple">→</span>
              </span>
              <span className="mt-2 font-display text-[13px] leading-relaxed text-mk-body">
                Cheapest real paths, payment options, and how deferred tuition works — no benefit
                required.
              </span>
              <span className="mt-auto flex items-center gap-1.5 pt-3 font-display text-[13px] font-bold text-mk-purple">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mk-purple text-[12px] text-white">✦</span>
                Opens Ally
              </span>
            </Tile>
          </div>
        </>
      )}

      {state === 'unknown' && (
        <div className="mt-3 grid grid-cols-1 items-center gap-8 rounded-[var(--radius-card)] border border-mk-line bg-white p-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Heading size="sm">Does your employer help pay for school?</Heading>
            <Body className="mt-2 max-w-lg">
              Many employers cover part of your tuition every year, and AllCampus partner discounts
              stack on top. Check whether your employer participates — it changes what you&rsquo;d
              actually pay.
            </Body>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <MkButton tone="teal" onClick={onCheckEmployer}>
              Check if your employer participates
            </MkButton>
            <button
              type="button"
              onClick={() => setAllyOpen(true)}
              className="font-display text-[13px] font-bold text-mk-purple underline-offset-2 hover:underline"
            >
              Not sure? Ask Ally ✦
            </button>
          </div>
        </div>
      )}

      <AllyOverlay
        open={allyOpen}
        partner={partner}
        seedQuestionId="oop"
        onClose={() => setAllyOpen(false)}
      />
    </section>
  )
}
