import { SCHOOLS } from '../../data/schools.js'

/*
 * Partner school logo strip (stays, per 2026-08-11 meeting). Monogram
 * placeholders stand in for real school logos; clicking one opens that
 * school's page.
 */

export default function LogoStrip({ onSelectSchool, onSeeAll }) {
  // Cap the band at 10 logos. The catalog now holds 24 universities and
  // rendering all 24 floods the band; the rest sit behind a "see all" button.
  const allSchools = Object.values(SCHOOLS)
  const schools = allSchools.slice(0, 10)
  const remaining = allSchools.length - schools.length
  return (
    <section className="border-y border-mk-line bg-white py-12">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-6 text-center font-display text-[12px] font-bold uppercase tracking-[0.16em] text-mk-body">
          {allSchools.length} partner universities, one application path
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
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[14px] font-black text-white shadow-sm"
              style={{ background: s.logoColor }}
            >
              {s.logoMonogram}
            </span>
            <span className="font-display text-[13.5px] font-bold text-mk-slate group-hover:text-mk-teal-700">
              {s.name}
            </span>
          </button>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => onSeeAll?.()}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-mk-band"
            >
              <span className="font-display text-[13.5px] font-bold text-mk-teal-700 group-hover:underline">
                +{remaining} more universities →
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
