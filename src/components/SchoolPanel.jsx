import { AwardIcon, MapPinIcon, CheckCircleIcon } from './icons.jsx'

/*
 * Normalized school entity (2B/2C). Surfaced the same way for every program so
 * school info stops being sporadic. Trust signals (accreditation, completion
 * rate) lead because they answer the "is this legit / worth it" question that
 * the New Learner and Career Changer ask. Missing fields are hidden gracefully,
 * but the goal is data completeness, not hiding.
 *
 * NOTE: stats are mock; replace with sourced, verified data before external use.
 */
export default function SchoolPanel({ school }) {
  if (!school) return null
  const rate = school.completionRate != null ? `${Math.round(school.completionRate * 100)}%` : null
  const facts = [
    school.accreditation && { icon: AwardIcon, label: 'Accreditation', value: school.accreditation },
    rate && { icon: CheckCircleIcon, label: 'Completion rate', value: rate },
    school.location && { icon: MapPinIcon, label: 'Location', value: school.location },
  ].filter(Boolean)

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

      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {facts.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.label} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 shrink-0 text-xl text-brand-500" />
                <div className="min-w-0">
                  <dt className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                    {f.label}
                  </dt>
                  <dd className="text-[15px] font-semibold text-ink-900">{f.value}</dd>
                </div>
              </div>
            )
          })}
        </dl>
      )}

      {/* No off-site link, this page is meant to convert, not send users away.
          Reaching the school happens only through the gated CTA flow. */}

      {school.completionRate == null && (
        <p className="mt-3 text-[12px] text-ink-400">
          Accreditation and completion data for this school are still being gathered.
        </p>
      )}
    </div>
  )
}
