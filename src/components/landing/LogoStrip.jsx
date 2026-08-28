import { SCHOOLS } from '../../data/schools.js'
import { WHY_COUNTS } from '../../data/landingCopy.js'
import { MkButton } from './Section.jsx'

/*
 * Partner school logo strip (stays, per 2026-08-11 meeting). Monogram
 * placeholders stand in for real school logos; clicking one opens that
 * school's page.
 *
 * 2026-08-28: the label leads with Brigid's network figure, not the mock
 * catalog's count. It used to say "24 partner universities" three screens
 * under a hero claiming 50+, which is the page arguing with itself. The
 * "See all" button dropped its number for the same reason: the directory
 * below genuinely holds 24 records, and a real count sitting beside a
 * network claim it contradicts is worse than no count.
 */

export default function LogoStrip({ onSelectSchool, onSeeAll }) {
  // Cap the band at 10 logos. The catalog now holds 24 universities and
  // rendering all 24 floods the band; the rest sit behind a "see all" button.
  const allSchools = Object.values(SCHOOLS)
  const schools = allSchools.slice(0, 10)
  return (
    <section className="bg-mk-surface pb-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-6 text-center font-display text-[12px] font-bold uppercase tracking-[0.16em] text-mk-body">
          {WHY_COUNTS.schools} partner universities, one application path
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        {schools.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectSchool(s)}
            title={`${s.name} page`}
            className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-mk-band"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[15px] font-black text-white shadow-sm"
              style={{ background: s.logoColor }}
            >
              {s.logoMonogram}
            </span>
            <span className="font-display text-[13px] font-bold text-mk-slate group-hover:text-mk-teal-700">
              {s.name}
            </span>
          </button>
          ))}
        </div>
        {/* The "+N more" tile alone didn't read as a door to the directory —
            reviewers assumed the full-schools view didn't exist, so this
            explicit CTA was added. 2026-08-25 copy pass: with the button
            here, the +N tile was a third way of saying the same thing. */}
        <div className="mt-7 text-center">
          <MkButton tone="outline" onClick={() => onSeeAll?.()}>
            See all schools →
          </MkButton>
        </div>
      </div>
    </section>
  )
}
