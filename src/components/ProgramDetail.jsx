import Badge from './Badge.jsx'
import ValueCard from './ValueCard.jsx'
import SchoolPanel from './SchoolPanel.jsx'
import { startDateDisplay, durationDisplay, programTypeLabel } from '../data/model.js'
import {
  CalendarIcon,
  ClockIcon,
  CapIcon,
  MonitorIcon,
  LayersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HeadsetIcon,
} from './icons.jsx'

/*
 * Shared program-detail content block. Two concepts after convergence:
 *   '1A' Baseline  — cost-first, traditional sections, no advisor/who-for/school panel.
 *   '2B' Guided    — adds "Who this program is for", School Highlights, and a
 *                    "Talk to an advisor" prompt. Favored direction.
 * Cost follows Brigid's spec (see ValueCard). Empty sections are hidden.
 */
export default function ProgramDetail({ program, onPrimaryCta, onAdvisor, variant = '1A' }) {
  const p = program
  const start = startDateDisplay(p)

  const header = (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-black leading-tight sm:text-[34px]">{p.name}</h1>
        <p className="mt-3 max-w-prose text-[18px] leading-relaxed text-ink-700">{p.headline}</p>
      </div>
      <ProgramImage src={p.programImageUrl} alt={p.name} hue={p.programImageHue} className="h-36 w-full shrink-0 sm:h-32 sm:w-60" />
    </header>
  )

  const valueCard = <ValueCard program={p} onAdvisor={onAdvisor} />
  const glance = <AtAGlance program={p} start={start} />

  const whoFor = p.whoFor?.length > 0 && (
    <Section title="Who this program is for">
      <ul className="space-y-2.5">
        {p.whoFor.map((w) => (
          <li key={w} className="flex items-start gap-2.5 text-[15px] text-ink-700">
            <CheckCircleIcon className="mt-0.5 shrink-0 text-lg text-brand-500" />
            <span>{w}</span>
          </li>
        ))}
      </ul>
      {p.notFitIf?.length > 0 && (
        <div className="mt-3 rounded-lg bg-surface-100 px-4 py-3">
          <div className="text-[12px] font-bold uppercase tracking-wide text-ink-400">Not the best fit if</div>
          <ul className="mt-1.5 space-y-1 text-[14px] text-ink-600">
            {p.notFitIf.map((n) => (
              <li key={n} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-400" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )

  const schoolPanel = <SchoolPanel school={p.school} />

  // v1 "Have questions?" routes to an advisor (Ally chat is phase 2).
  const advisorPrompt = (
    <button
      type="button"
      onClick={() => onAdvisor?.(p)}
      className="flex w-full items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-left transition hover:bg-brand-100"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-0 text-xl text-brand-600">
        <HeadsetIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold text-ink-900">Have questions? Talk to an advisor</span>
        <span className="block text-[14px] leading-snug text-ink-500">
          Get personalized guidance on the program, tuition savings, and next steps. No commitment.
        </span>
      </span>
      <ArrowRightIcon className="shrink-0 text-lg text-brand-600" />
    </button>
  )

  const about = (
    <Section title="About the program">
      <p className="max-w-prose text-[17px] leading-relaxed text-ink-700">{p.description}</p>
    </Section>
  )

  const benefits = p.benefits?.length > 0 && (
    <Section title="Benefits">
      <ul className="space-y-2.5">
        {p.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[16px] text-ink-700">
            <CheckCircleIcon className="mt-0.5 shrink-0 text-xl text-brand-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Section>
  )

  const admission = p.admissionRequirements?.length > 0 && (
    <Section title="Admission requirements">
      <ul className="space-y-2 text-[16px] text-ink-700">
        {p.admissionRequirements.map((r) => (
          <li key={r} className="flex items-start gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-400" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </Section>
  )

  const curriculum = p.curriculumHighlights?.length > 0 && (
    <Section title="Curriculum highlights">
      <div className="flex flex-wrap gap-2">
        {p.curriculumHighlights.map((c) => (
          <span key={c} className="rounded-lg bg-surface-100 px-3.5 py-2 text-[15px] font-medium text-ink-700">
            {c}
          </span>
        ))}
      </div>
    </Section>
  )

  const concentrations = p.concentrations?.length > 0 && (
    <Section title="Concentrations">
      <div className="flex flex-wrap gap-2">
        {p.concentrations.map((c) => (
          <span key={c} className="rounded-full border border-surface-200 px-3.5 py-1.5 text-[15px] text-ink-700">
            {c}
          </span>
        ))}
      </div>
    </Section>
  )

  const terms = (
    <footer className="border-t border-surface-200 pt-4">
      <p className="text-[13px] leading-relaxed text-ink-400">
        Cost figures are estimates and may change. AllCampus is not a financial aid office and does
        not guarantee coverage. Confirm current pricing, fees, and eligibility with the university.
      </p>
    </footer>
  )

  const blocks =
    variant === '2B'
      ? [header, valueCard, glance, whoFor, schoolPanel, advisorPrompt, about, admission, curriculum, concentrations, terms]
      : [header, valueCard, glance, about, benefits, admission, curriculum, concentrations, terms]

  return (
    <article className="flex flex-col gap-6 text-ink-900">
      {blocks.filter(Boolean).map((block, i) => (
        <div key={i}>{block}</div>
      ))}
    </article>
  )
}

/* ------------------------------------------------------------------ */

export function PrimaryCta({ program, onPrimaryCta }) {
  return (
    <button
      type="button"
      onClick={() => onPrimaryCta?.(program)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-4 text-[17px] font-bold text-white transition hover:bg-brand-700"
    >
      Get Program Details
      <ArrowRightIcon className="text-lg" />
    </button>
  )
}

function AtAGlance({ program: p, start }) {
  const dur = durationDisplay(p)
  const items = [
    start && { icon: CalendarIcon, label: 'Start', value: start },
    p.degreeLevel && { icon: CapIcon, label: 'Level', value: p.degreeLevel },
    p.duration && { icon: ClockIcon, label: 'Duration', value: dur.value, note: dur.note },
    p.courseModality && { icon: MonitorIcon, label: 'Format', value: p.courseModality },
    { icon: LayersIcon, label: 'Program type', value: programTypeLabel(p) },
  ].filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-surface-200 py-4 sm:grid-cols-3">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <div key={it.label} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 text-2xl text-brand-500" />
            <div className="min-w-0">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">{it.label}</div>
              <div className="truncate text-[16px] font-bold text-ink-900">{it.value}</div>
              {it.note && <div className="text-[11px] leading-tight text-ink-400">{it.note}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-[15px] font-bold uppercase tracking-wide text-ink-500">{title}</h2>
      {children}
    </section>
  )
}

function SchoolMark({ school }) {
  if (!school) return null
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-black text-white"
      style={{ background: school.logoColor }}
      aria-hidden
    >
      {school.logoMonogram}
    </span>
  )
}

function ProgramImage({ hue, src, alt = '', className = '' }) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={`rounded-[var(--radius-card)] object-cover ${className}`} />
  }
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 48%), hsl(${(hue + 28) % 360} 60% 32%))` }}
      aria-hidden
    />
  )
}

/* School + badge for the drawer's top bar. Badge only on Baseline (1A). */
function DrawerIdentity({ program, variant = '1A' }) {
  if (!program) return null
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {variant === '1A' && <Badge program={program} />}
      <SchoolMark school={program.school} />
      <span className="truncate text-sm font-semibold text-ink-500">{program.school?.name}</span>
      {program.school?.partnerHighlight && (
        <span className="shrink-0 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
          Partner
        </span>
      )}
    </div>
  )
}

export { ProgramImage, SchoolMark, DrawerIdentity }
