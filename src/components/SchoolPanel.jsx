import { CheckCircleIcon } from './icons.jsx'

/*
 * School Highlights (Guided). Up to three school benefits/highlights, the
 * fields AllCampus can actually populate. Completion rate, location, and
 * accreditation were dropped per stakeholder feedback. Highlights are MOCK.
 */
export default function SchoolPanel({ school }) {
  if (!school) return null
  const highlights = (school.highlights || []).slice(0, 3)

  return (
    <div className="rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white"
          style={{ background: school.logoColor }}
          aria-hidden
        >
          {school.logoMonogram}
        </span>
        <div className="min-w-0">
          <div className="text-[17px] font-bold leading-tight text-ink-900">{school.name}</div>
          {school.about && <p className="mt-0.5 text-[14px] leading-snug text-ink-500">{school.about}</p>}
        </div>
      </div>

      {highlights.length > 0 && (
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-[14px] text-ink-700">
              <CheckCircleIcon className="mt-0.5 shrink-0 text-lg text-brand-500" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
