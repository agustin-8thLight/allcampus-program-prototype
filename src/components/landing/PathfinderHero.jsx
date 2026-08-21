import Img from '../Img.jsx'
import { heroImage } from '../../data/images.js'
import { PROGRAMS, money } from '../../data/model.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { getArea } from '../../data/taxonomy.js'
import { startLabel, matchPrograms } from '../../data/pathfinder.js'

/*
 * PathfinderHero (2026-08-21 reset): replaces the search-card hero. One value
 * statement, ONE primary action (the pathfinder), and a quiet self-serve
 * outlet for the minority who know exactly what they want.
 *
 * With a profile set, the floating card slot (where the search card used to
 * hang) holds the education profile instead: answers echoed, each editable,
 * the Amazon "here's everything we know about you, is this true?" moment.
 */
export default function PathfinderHero({ partner, profile, onStart, onEdit, onBrowse }) {
  const known = !!partner?.benefitKnown
  const reimburses = known && (partner?.employerReimbursement ?? 0) > 0
  const maxPct = bestDiscountPercent(PROGRAMS)

  return (
    <section className="relative font-display">
      <div className={`relative pt-16 text-white ${profile ? 'pb-24' : 'pb-16'}`}>
        <Img
          src={heroImage(partner?.id)}
          alt=""
          hue={206}
          rounded=""
          eager
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(112deg,rgba(30,45,58,0.93)_0%,rgba(51,71,91,0.84)_45%,rgba(69,120,140,0.62)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">
            {known ? `${partner.name} + AllCampus` : 'AllCampus'}
          </p>
          <h1 className="mt-3 max-w-2xl text-[36px] font-extrabold leading-tight sm:text-[44px]">
            Going back to school is confusing. Using your benefit shouldn&rsquo;t be.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/85">
            AllCampus is how{known && !/^your /i.test(partner.name) ? ` ${partner.name} people` : ' you'} get discounted tuition
            {reimburses ? ' and real help using the reimbursement benefit' : ''} at accredited
            universities. We&rsquo;ll walk you through it, one clear step at a time.
          </p>

          {!profile && (
            <>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onStart?.()}
                  className="inline-flex items-center justify-center rounded-md bg-white px-7 py-3 text-[15px] font-bold text-mk-teal-700 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:bg-mk-band"
                >
                  Let&rsquo;s get started
                </button>
                <span className="text-[13px] font-semibold text-white/75">
                  3 questions, about a minute. No account needed.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onBrowse?.()}
                className="mt-5 block text-[13.5px] font-bold text-white/80 underline-offset-2 hover:text-white hover:underline"
              >
                I know what I&rsquo;m looking for, take me to the programs →
              </button>
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
              <ProfileCell
                label="Field"
                value={
                  profile.areaId && profile.areaId !== 'unsure'
                    ? getArea(profile.areaId)?.label
                    : 'Open to anything'
                }
                onEdit={() => onEdit?.('area')}
              />
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
            <p className="mt-3 text-[13px] font-semibold text-mk-body">
              {matchPrograms(profile, PROGRAMS).length} programs fit this profile. They&rsquo;re right
              below, and every answer here stays editable.
            </p>
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
