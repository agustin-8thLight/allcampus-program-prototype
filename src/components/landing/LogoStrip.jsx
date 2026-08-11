import { SCHOOLS } from '../../data/schools.js'

/*
 * Partner school logo strip (stays, per 2026-08-11 meeting). Monogram
 * placeholders stand in for real school logos; clicking one opens that
 * school's page.
 */

export default function LogoStrip({ onSelectSchool }) {
  const schools = Object.values(SCHOOLS)
  return (
    <section className="border-y border-mk-line bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-5">
        {schools.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectSchool(s)}
            title={`${s.name} page`}
            className="group flex items-center gap-2 opacity-75 transition hover:opacity-100"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-black text-white"
              style={{ background: s.logoColor }}
            >
              {s.logoMonogram}
            </span>
            <span className="font-display text-[13.5px] font-bold text-mk-slate group-hover:underline">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
