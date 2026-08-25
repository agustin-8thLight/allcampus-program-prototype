import Img from '../Img.jsx'
import { heroImage } from '../../data/images.js'
import { PROGRAMS, money } from '../../data/model.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { getArea } from '../../data/taxonomy.js'
import { SCHOOLS } from '../../data/schools.js'
import { startLabel, matchPrograms } from '../../data/pathfinder.js'

/*
 * PathfinderHero (2026-08-21 reset): replaces the search-card hero. One value
 * statement, one primary action, and a quiet self-serve outlet for the
 * minority who know exactly what they want.
 *
 * 2026-08-25 direction: the action this page pushes is SIGNING UP, so the
 * account is the primary button and the pathfinder steps down to a real
 * second option — visible and labelled, not a whisper. This deliberately
 * revises the Aug 20/21 "lead with ONE action (the pathfinder)" decision;
 * the pathfinder is now the way in for anyone not ready to commit.
 *
 * With a profile set, the floating card slot (where the search card used to
 * hang) holds the education profile instead: answers echoed, each editable,
 * the Amazon "here's everything we know about you, is this true?" moment.
 */
export default function PathfinderHero({ partner, profile, joined = false, onSignup, onStart, onEdit, onBrowse }) {
  const known = !!partner?.benefitKnown
  const reimburses = known && (partner?.employerReimbursement ?? 0) > 0
  const maxPct = bestDiscountPercent(PROGRAMS)

  return (
    <section className="relative font-display">
      <div className={`relative pt-24 text-white sm:pt-28 ${profile ? 'pb-28' : 'pb-24'}`}>
        <Img
          src={heroImage(partner?.id)}
          alt=""
          hue={206}
          rounded=""
          eager
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(104deg,rgba(26,40,52,0.94)_0%,rgba(33,52,68,0.86)_38%,rgba(51,71,91,0.52)_70%,rgba(69,120,140,0.30)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">
            {known ? `${partner.name} + AllCampus` : 'AllCampus'}
          </p>
          <h1 className="mt-3 max-w-2xl text-[36px] font-extrabold leading-tight sm:text-[44px]">
            Going back to school is confusing. Using your benefit shouldn&rsquo;t be.
          </h1>
          {/* 2026-08-25 copy pass: "We'll walk you through it" restated the
              headline's own promise. The dek carries what's on offer. */}
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-white/85">
            Discounted tuition{reimburses ? ', your reimbursement benefit,' : ''} and real help
            using {reimburses ? 'both' : 'it'}.
          </p>

          {!profile && (
            <>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => (joined ? onBrowse?.() : onSignup?.())}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-10 py-4 text-[17px] font-bold text-mk-teal-700 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-mk-band"
                >
                  {joined ? 'Browse all programs' : 'Create your free account'}
                  <span aria-hidden>→</span>
                </button>
                <p className="mt-3 text-[13px] font-semibold text-white/75">
                  {joined
                    ? 'Your matches and your pricing are saved.'
                    : 'Free, and it keeps your employer pricing with you.'}
                </p>
              </div>
              {/* The two lower-commitment routes, in commitment order. */}
              <div className="mt-7 flex flex-col items-start gap-2.5">
                {!joined && (
                  <button
                    type="button"
                    onClick={() => onStart?.()}
                    className="text-[14px] font-bold text-white underline-offset-2 hover:underline"
                  >
                    Not sure yet? Answer 3 questions &rarr;
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onBrowse?.()}
                  className="text-[13.5px] font-bold text-white/75 underline-offset-2 hover:text-white hover:underline"
                >
                  Browse all programs &rarr;
                </button>
              </div>

              {/* Proof row (2026-08-25 polish): the network numbers used to
                  live only in the Why section's body copy, three screens
                  down. They belong beside the first decision. */}
              <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/20 pt-6">
                {[
                  `${Object.keys(SCHOOLS).length} partner universities`,
                  `${PROGRAMS.length} programs`,
                  maxPct != null ? `Up to ${maxPct}% off tuition` : 'Negotiated tuition discounts',
                ].map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-bold text-white/90 backdrop-blur-sm"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* The profile card floats over the hero edge, where search used to. */}
      {profile && (
        <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-5">
          <div className="rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(51,71,91,0.18)] sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                Your education profile
              </p>
              <button
                type="button"
                onClick={() => onStart?.()}
                className="text-[12.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
              >
                Start over
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <ProfileCell
                label="Starting point"
                value={startLabel(profile.start) || 'Just exploring'}
                onEdit={() => onEdit?.('start')}
              />
              {profile.schoolId ? (
                <ProfileCell
                  label="School"
                  value={SCHOOLS[profile.schoolId]?.name}
                  onEdit={() => onEdit?.('school')}
                />
              ) : (
                <ProfileCell
                  label="Field"
                  value={
                    profile.areaId && profile.areaId !== 'unsure'
                      ? getArea(profile.areaId)?.label
                      : 'Open to anything'
                  }
                  onEdit={() => onEdit?.('area')}
                />
              )}
              <ProfileCell
                label="Benefit"
                value={
                  profile.benefit === 'confirmed' || profile.benefit === 'have'
                    ? `Reimbursement${reimburses ? `, ${money(partner.employerReimbursement)}/yr` : ''}`
                    : profile.benefit === 'none'
                      ? `Discounts, up to ${maxPct}% off`
                      : 'Unsure, planning for both'
                }
                onEdit={() => onEdit?.('benefit')}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mk-line pt-3.5">
              <p className="text-[13px] font-semibold text-mk-body">
                {matchPrograms(profile, PROGRAMS).length} programs fit this profile.{' '}
                {joined ? 'Saved to your account.' : 'They\u2019re right below.'}
              </p>
              {!joined && (
                <button
                  type="button"
                  onClick={() => onSignup?.()}
                  className="inline-flex items-center gap-2 rounded-lg bg-mk-teal-600 px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-mk-teal-700"
                >
                  Save this with a free account
                  <span aria-hidden>&rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ProfileCell({ label, value, onEdit }) {
  return (
    <div className="rounded-lg border border-mk-line bg-white px-3.5 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-mk-body/70">{label}</p>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[13.5px] font-extrabold text-mk-slate">{value}</p>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[12px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  )
}
