import Badge from './Badge.jsx'
import ValueCard from './ValueCard.jsx'
import SchoolPanel from './SchoolPanel.jsx'
import QuestionsAnswered from './QuestionsAnswered.jsx'
import { startDateDisplay, deadlineDisplay } from '../data/model.js'
import {
  CalendarIcon,
  ClockIcon,
  CapIcon,
  MonitorIcon,
  LayersIcon,
  CheckCircleIcon,
  ExternalIcon,
  ArrowRightIcon,
  SparkleIcon,
} from './icons.jsx'

/*
 * Shared program-detail content block (build plan §2, §10.3).
 * Rendered identically in the search drawer, the chatbot drawer, and the
 * standalone program page. Built once.
 *
 * Two information architectures, switchable for side-by-side review (§10.8):
 *   variant '1A' (affordability-first): cost leads, right under the headline.
 *     The low-maintenance baseline.
 *   variant '2B' (structured + normalized + Ally): cost + fit + the normalized
 *     school panel (trust signals) + an inline "Ask Ally" prompt, in
 *     decision-question order. Incorporates the Phase 2 normalization work.
 *   variant '2C' (questions-first): a departure. Leads with the questions
 *     people actually ask, answered up front, with Ally as the spine. No
 *     persona model required.
 *
 * Empty sections are hidden, never rendered as placeholder gaps (§D9).
 */
export default function ProgramDetail({ program, onOpenAlly, variant = '1A' }) {
  const p = program
  const start = startDateDisplay(p)
  const deadline = deadlineDisplay(p)

  {/* School + badge now live in the drawer's top bar (see DrawerIdentity). */}
  const header = (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-black leading-tight sm:text-[34px]">{p.name}</h1>
        <p className="mt-3 max-w-prose text-[18px] leading-relaxed text-ink-700">{p.headline}</p>
      </div>
      <ProgramImage
        src={p.programImageUrl}
        alt={p.name}
        hue={p.programImageHue}
        className="h-36 w-full shrink-0 sm:h-32 sm:w-60"
      />
    </header>
  )

  const valueCard = <ValueCard program={p} />

  // The CTA lives in the drawer's pinned footer panel (always visible), not
  // in the scroll flow. See PrimaryCta, rendered by the Drawer footer.

  // Inline Ally entry point (2A). Low-commitment way to ask questions first.
  const allyPrompt = (
    <button
      type="button"
      onClick={() => onOpenAlly?.(p)}
      className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-brand-200 bg-brand-50/60 px-4 py-3.5 text-left transition hover:border-brand-300 hover:bg-brand-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl text-white">
        <SparkleIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold text-ink-900">Have questions? Ask Ally</span>
        <span className="block text-[14px] leading-snug text-ink-500">
          Will it fit your schedule? What will you really pay? Get instant answers, no call needed.
        </span>
      </span>
      <ArrowRightIcon className="shrink-0 text-lg text-brand-600" />
    </button>
  )

  const glance = <AtAGlance program={p} start={start} deadline={deadline} />

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

  const schoolPanel = <SchoolPanel school={p.school} />
  const questionsBlock = <QuestionsAnswered program={p} onOpenAlly={onOpenAlly} />

  const terms = (
    <footer className="border-t border-surface-200 pt-4">
      <p className="text-[13px] leading-relaxed text-ink-400">
        Cost figures are estimates and may change. AllCampus is not a financial aid office and does
        not guarantee coverage. Confirm current pricing, fees, and eligibility with the university.
      </p>
    </footer>
  )

  // Block order per variant. 1A: cost-first. 1B/2A: fit-first with sticky CTA.
  // 2A inserts the inline Ally prompt right after the at-a-glance facts.
  let blocks
  if (variant === '2C') {
    // Questions-first departure: title -> cost -> questions answered up front
    // (Ally spine) -> normalized school -> supporting detail.
    blocks = [header, valueCard, questionsBlock, schoolPanel, about, curriculum, concentrations, terms]
  } else if (variant === '2B') {
    // Structured + normalized: decision-question order, school trust panel surfaced.
    blocks = [header, valueCard, glance, schoolPanel, allyPrompt, benefits, about, admission, curriculum, concentrations, terms]
  } else {
    // 1A: cost-first baseline.
    blocks = [header, valueCard, glance, about, benefits, admission, curriculum, concentrations, terms]
  }

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
  if (program.isDirectHandoff) {
    // directHandoff: single CTA links straight out, no gate (§8).
    return (
      <a
        href={program.applicationUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-4 text-[17px] font-bold text-white transition hover:bg-brand-700"
      >
        {/* TODO(copy) */}
        Continue on {program.school?.name?.split(' ')[0]} site
        <ExternalIcon className="text-lg" />
      </a>
    )
  }
  // standard: single CTA opens the chooser (request info / specialist / school).
  return (
    <button
      type="button"
      onClick={() => onPrimaryCta?.(program)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-base font-bold text-white transition hover:bg-brand-700"
    >
      {/* TODO(copy) */}
      Take the next step
      <ArrowRightIcon className="text-lg" />
    </button>
  )
}

function AtAGlance({ program: p, start, deadline }) {
  const items = [
    start && { icon: CalendarIcon, label: 'Start', value: start },
    p.duration && { icon: ClockIcon, label: 'Duration', value: p.duration },
    p.timeCommitment && { icon: ClockIcon, label: 'Time', value: p.timeCommitment },
    p.degreeLevel && { icon: CapIcon, label: 'Level', value: p.degreeLevel },
    p.courseModality && { icon: MonitorIcon, label: 'Format', value: p.courseModality },
    deadline && { icon: LayersIcon, label: 'Apply by', value: deadline },
  ].filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 p-4 sm:grid-cols-3">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <div key={it.label} className="flex items-center gap-2.5">
            <Icon className="text-2xl text-brand-500" />
            <div className="min-w-0">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                {it.label}
              </div>
              <div className="truncate text-[16px] font-bold text-ink-900">{it.value}</div>
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
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`rounded-[var(--radius-card)] object-cover ${className}`}
      />
    )
  }
  // Gradient fallback when a program has no image.
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 48%), hsl(${(hue + 28) % 360} 60% 32%))`,
      }}
      aria-hidden
    />
  )
}

/* School + badge for the drawer's top bar (same row as the close button). */
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
