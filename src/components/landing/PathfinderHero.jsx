import Img from '../Img.jsx'
import { MkButton } from './Section.jsx'
import { heroImage } from '../../data/images.js'
import { PROGRAMS, money } from '../../data/model.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { getArea } from '../../data/taxonomy.js'
import { SCHOOLS } from '../../data/schools.js'
import { WHY_COUNTS } from '../../data/landingCopy.js'
import { startLabel, matchPrograms } from '../../data/pathfinder.js'

/*
 * PathfinderHero (2026-08-21 reset): replaces the search-card hero. One value
 * statement, one primary action, and a quiet self-serve outlet for the
 * minority who know exactly what they want.
 *
 * 2026-08-27: the three-question flow is TABLED. The client likes the idea
 * but it introduces complexity this first version doesn't need, so every
 * entry point to it is gone and the hero's one action is the account. The
 * Pathfinder component and the whole profile path stay in the codebase,
 * parked, for when it comes back.
 *
 * Per James's notes the hero is eyebrow, headline, dek, one CTA, and a stat
 * row — nothing else, so it does not compete with itself.
 *
 * With a profile set, the floating card slot (where the search card used to
 * hang) holds the education profile instead: answers echoed, each editable,
 * the Amazon "here's everything we know about you, is this true?" moment.
 */
export default function PathfinderHero({ partner, profile, joined = false, onSignup, onBrowse, onEdit }) {
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
              <div className="mt-9">
                {/* Paired CTAs (hubspot.com): filled + outlined, identical
                    heights because both carry a 2px border. */}
                <div className="flex flex-wrap items-center gap-3">
                  <MkButton
                    tone="light"
                    size="lg"
                    onClick={() => (joined ? onBrowse?.() : onSignup?.())}
                  >
                    {joined ? 'Browse all programs' : 'Create an account'}
                    <span aria-hidden>→</span>
                  </MkButton>
                  <MkButton tone="ghostLight" size="lg" onClick={() => onBrowse?.()}>
                    Browse programs
                  </MkButton>
                </div>
              </div>

              {/* Stat row: James's four-card layout and labels, Brigid's
                  figures. His mockup had 1,100+ programs, which matches no
                  document; hers says 1,200+. One set of numbers now governs
                  both here and the Why AllCampus headline. The logo strip
                  still counts the mock catalog (24 schools), which is a
                  different scope and still worth reconciling. */}
              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { v: WHY_COUNTS.schools, l: 'Partner schools' },
                  { v: WHY_COUNTS.programs, l: 'Programs' },
                  { v: 'Tuition', l: 'Discounts' },
                  { v: 'Education', l: 'Support' },
                ].map((st) => (
                  <div
                    key={st.l}
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
                  >
                    <dt className="text-[22px] font-black leading-none text-white">{st.v}</dt>
                    <dd className="mt-1 text-[12px] font-semibold leading-snug text-white/75">
                      {st.l}
                    </dd>
                  </div>
                ))}
              </dl>
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
              <span />
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
                {joined ? (
                  <span className="text-mk-green-700">Saved to your account.</span>
                ) : (
                  <span className="text-mk-body/80">Not saved yet.</span>
                )}
              </p>
              {!joined && (
                <button
                  type="button"
                  onClick={() => onSignup?.()}
                  className="inline-flex items-center gap-2 rounded-lg bg-mk-teal-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-mk-teal-700"
                >
                  Save this to your account
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
      <p className="text-[12px] font-bold uppercase tracking-wide text-mk-body/70">{label}</p>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[13px] font-extrabold text-mk-slate">{value}</p>
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
