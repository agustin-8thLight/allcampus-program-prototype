import { SCHOOLS } from '../../data/schools.js'

/*
 * Partner school logo strip (stays, per 2026-08-11 meeting). Monogram
 * placeholders stand in for real school logos; clicking one opens that
 * school's page.
 */

export default function LogoStrip({ onSelectSchool }) {
  const schools = Object.values(SCHOOLS)
  return (
    <section className="border-y border-mk-line bg-white py-12">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-6 text-center font-display text-[12px] font-bold uppercase tracking-[0.16em] text-mk-body">
          {schools.length} partner universities, one application path
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
        </div>
      </div>
    </section>
  )
}
