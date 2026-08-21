import { useEffect, useMemo, useRef, useState } from 'react'
import { PROGRAMS, money } from '../data/model.js'
import { SCHOOLS } from '../data/schools.js'
import { bestDiscountPercent } from '../data/benefit.js'
import { START_OPTIONS, BENEFIT_OPTIONS, AREA_OPTIONS, startLabel, matchPrograms } from '../data/pathfinder.js'
import { getArea } from '../data/taxonomy.js'
import { SubjectIconTile } from './landing/SubjectIcon.jsx'

/*
 * The pathfinder (2026-08-21 reset). A light modal, deliberately NOT a page:
 * three questions building an education profile, then the homepage
 * personalizes in place.
 *
 * Copy rules (user directive, from Brigid's session):
 * - Every screen says WHY we ask and what answering gets you.
 * - Every don't-know path gets explicit reassurance. "Check with your
 *   employer" as a dead end loses the user 10x over (Brigid) — we plan for
 *   both cases instead.
 * - Every screen ends with clear direction on what happens next.
 *
 * The Amazon car-battery model: the partner landing page already tells us the
 * benefit, so Q3 CONFIRMS what we know instead of asking cold.
 */

const stepTitles = { start: 'Starting point', area: 'Field', benefit: 'Your benefit', summary: 'Your profile' }

export default function Pathfinder({ open, partner, initialStep = 'start', onComplete, onNavigate, onAlly, onClose }) {
  const [step, setStep] = useState(initialStep)
  const [answers, setAnswers] = useState({})
  const [schoolQuery, setSchoolQuery] = useState('')
  const [schoolMiss, setSchoolMiss] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (open) {
      setStep(initialStep)
      setSchoolQuery('')
      setSchoolMiss(false)
      // Editing one answer from the profile card keeps the others.
      if (initialStep === 'start') setAnswers({})
      setTimeout(() => panelRef.current?.querySelector('button, input')?.focus(), 50)
    }
  }, [open, initialStep])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const maxPct = useMemo(() => bestDiscountPercent(PROGRAMS), [])
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  const noTr =
    !reimburses &&
    (partner?.partnerType === 'perks' ||
      partner?.partnerType === 'direct-no-tr' ||
      (partner?.benefitKnown && !reimburses))

  if (!open) return null

  const order = ['start', 'area', 'benefit', 'summary']
  const dotIndex = step === 'school' ? 0 : Math.max(0, order.indexOf(step))

  const pick = (patch, next) => {
    setAnswers((a) => ({ ...a, ...patch }))
    setStep(next)
  }

  const finish = (patch = {}) => {
    onComplete?.({ ...answers, ...patch })
  }

  const schoolHits = schoolQuery.trim()
    ? Object.values(SCHOOLS)
        .filter((s) => s.name.toLowerCase().includes(schoolQuery.trim().toLowerCase()))
        .slice(0, 6)
    : []

  /* ---------- screens ---------- */

  const screens = {
    start: (
      <>
        <QuestionHead
          eyebrow="Question 1 of 3"
          title="Where are you starting from?"
          why="Your answer decides what we show first, so you never wade through programs that don't fit."
        />
        <div className="mt-5 space-y-2.5">
          {START_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                o.id === 'school-in-mind' ? pick({ start: o.id }, 'school') : pick({ start: o.id }, 'area')
              }
              className="block w-full rounded-xl border border-mk-line bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-mk-teal-600 hover:shadow-[0_8px_20px_rgba(69,120,140,0.14)]"
            >
              <span className="block font-display text-[15px] font-extrabold text-mk-slate">{o.label}</span>
              <span className="mt-1 block font-display text-[12.5px] leading-relaxed text-mk-body">{o.why}</span>
            </button>
          ))}
        </div>
        <NextLine>Whatever you pick, nothing is locked in. You can change any answer later.</NextLine>
      </>
    ),

    school: schoolMiss ? (
      <>
        <QuestionHead
          eyebrow="Your school"
          title={`We don’t partner with ${schoolQuery.trim() || 'that school'} yet.`}
          why="That's worth being straight about. But the reason people check here still applies: your discount and benefit only work inside the network."
        />
        <p className="mt-4 font-display text-[14px] leading-relaxed text-mk-body">
          The good news: {Object.keys(SCHOOLS).length} in-network schools run similar programs, with
          discounts up to {maxPct}% already negotiated. Tell us your field on the next screen and
          we&rsquo;ll show you the closest matches.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <PrimaryBtn onClick={() => setStep('area')}>Show me close matches</PrimaryBtn>
          <GhostBtn
            onClick={() => {
              onAlly?.()
              onClose?.()
            }}
          >
            ✦ Talk it through with Ally
          </GhostBtn>
        </div>
        <NextLine>Next: your field of study, then your benefit. Two taps and you&rsquo;re done.</NextLine>
      </>
    ) : (
      <>
        <QuestionHead
          eyebrow="Your school"
          title="Which school do you have in mind?"
          why="If it's in the network, your discount is already negotiated there and your benefit applies. We check in one step."
        />
        <input
          value={schoolQuery}
          onChange={(e) => setSchoolQuery(e.target.value)}
          placeholder="Start typing a school name"
          className="mt-5 w-full rounded-lg border border-mk-line px-4 py-3 font-display text-[15px] text-mk-slate outline-none placeholder:text-mk-body/50 focus:border-mk-teal-600"
        />
        {schoolHits.length > 0 && (
          <div className="mt-3 space-y-2">
            {schoolHits.map((s) => {
              const pct = bestDiscountPercent(PROGRAMS.filter((p) => p.schoolId === s.id))
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick({ schoolId: s.id }, 'benefit')}
                  className="flex w-full items-center gap-3 rounded-xl border border-mk-line bg-white px-4 py-3 text-left transition hover:border-mk-teal-600"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-black text-white"
                    style={{ background: s.logoColor }}
                  >
                    {s.logoMonogram}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[14px] font-extrabold text-mk-slate">
                      {s.name}
                    </span>
                    <span className="block font-display text-[12px] font-bold text-mk-green-700">
                      In the network{pct != null ? ` · up to ${pct}% off` : ''}
                    </span>
                  </span>
                  <span className="ml-auto font-display text-[13px] font-bold text-mk-teal-700">Select →</span>
                </button>
              )
            })}
          </div>
        )}
        {schoolQuery.trim().length > 1 && (
          <button
            type="button"
            onClick={() => setSchoolMiss(true)}
            className="mt-4 font-display text-[13.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            {schoolHits.length ? "My school isn't listed" : `“${schoolQuery.trim()}” isn’t coming up — what now?`}
          </button>
        )}
        <NextLine>
          Pick your school and we keep building your profile around it. Not listed? We&rsquo;ll show
          you what&rsquo;s close, never a dead end.
        </NextLine>
      </>
    ),

    area: (
      <>
        <QuestionHead
          eyebrow="Question 2 of 3"
          title="What field are you drawn to?"
          why="This narrows the catalog to programs worth your time. Not sure is a fine answer, most people aren't sure yet."
        />
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {AREA_OPTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => pick({ areaId: a.id }, 'benefit')}
              className="flex items-center gap-2.5 rounded-xl border border-mk-line bg-white px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-mk-teal-600"
            >
              <SubjectIconTile id={a.id} size="sm" />
              <span className="font-display text-[13.5px] font-extrabold leading-snug text-mk-slate">
                {a.label}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => pick({ areaId: 'unsure' }, 'benefit')}
          className="mt-3 block w-full rounded-xl border border-dashed border-mk-line bg-white px-5 py-3.5 text-left font-display text-[14px] font-bold text-mk-body transition hover:border-mk-teal-600 hover:text-mk-teal-700"
        >
          I&rsquo;m not sure yet — show me everything
        </button>
        <NextLine>Next: your benefit. One tap, and we usually already know the answer.</NextLine>
      </>
    ),

    benefit: (
      <>
        <QuestionHead
          eyebrow="Question 3 of 3"
          title={
            reimburses
              ? 'Here’s what we already know about your benefit.'
              : noTr
                ? 'Here’s where your benefit stands.'
                : 'Does your employer reimburse tuition?'
          }
          why="This decides which costs we show you: list prices, discounted prices, or what's left after your employer's money."
        />
        {reimburses ? (
          <>
            <div className="mt-5 rounded-xl border border-mk-teal-600/40 bg-mk-band/60 p-5">
              <p className="font-display text-[15px] font-extrabold text-mk-slate">
                {partner.name} offers tuition reimbursement, about{' '}
                {money(partner.employerReimbursement)} a year.
              </p>
              <p className="mt-1.5 font-display text-[13px] leading-relaxed text-mk-body">
                It stacks on top of your AllCampus discount. Your employer owns eligibility and
                approvals, and we help you through that part when you get there.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <PrimaryBtn onClick={() => pick({ benefit: 'confirmed' }, 'summary')}>
                That&rsquo;s right, use it
              </PrimaryBtn>
              <GhostBtn onClick={() => pick({ benefit: 'unsure' }, 'summary')}>
                Not sure that&rsquo;s me
              </GhostBtn>
            </div>
            <NextLine>
              Either answer is safe. If you&rsquo;re not sure, we plan for both cases and help you
              confirm it later, right from your profile.
            </NextLine>
          </>
        ) : noTr ? (
          <>
            <div className="mt-5 rounded-xl border border-mk-line bg-white p-5">
              <p className="font-display text-[15px] font-extrabold text-mk-slate">
                No reimbursement program is attached here, and that is worth being straight about.
              </p>
              <p className="mt-1.5 font-display text-[13px] leading-relaxed text-mk-body">
                The discount network is yours regardless. Every program you&rsquo;ll see carries partner
                pricing, up to {maxPct}% off, no reimbursement required.
              </p>
            </div>
            <div className="mt-5">
              <PrimaryBtn onClick={() => pick({ benefit: 'none' }, 'summary')}>
                Got it, show my numbers
              </PrimaryBtn>
            </div>
            <NextLine>Next: your profile summary, then your matched programs.</NextLine>
          </>
        ) : (
          <>
            <div className="mt-5 space-y-2.5">
              {BENEFIT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => pick({ benefit: o.id }, 'summary')}
                  className="block w-full rounded-xl border border-mk-line bg-white px-5 py-4 text-left font-display text-[15px] font-extrabold text-mk-slate transition hover:-translate-y-0.5 hover:border-mk-teal-600"
                >
                  {o.label}
                  {o.id === 'unsure' && (
                    <span className="mt-1 block text-[12.5px] font-medium leading-relaxed text-mk-body">
                      A fine answer. You&rsquo;re in the right place either way: we plan for both cases
                      and help you confirm it as you go, so nothing stalls.
                    </span>
                  )}
                </button>
              ))}
            </div>
            <NextLine>Last step after this: your profile summary. You&rsquo;re nearly there.</NextLine>
          </>
        )}
      </>
    ),

    summary: (
      <>
        <QuestionHead
          eyebrow="Your education profile"
          title="Here’s what we heard."
          why="This profile filters everything you see from here on. Every line is editable, nothing is locked, and none of it goes to your employer."
        />
        <div className="mt-5 space-y-2">
          <SummaryRow label="Starting point" value={startLabel(answers.start) || 'Just exploring'} onEdit={() => setStep('start')} />
          {answers.schoolId && (
            <SummaryRow
              label="School"
              value={SCHOOLS[answers.schoolId]?.name}
              onEdit={() => {
                setSchoolMiss(false)
                setStep('school')
              }}
            />
          )}
          {!answers.schoolId && (
          <SummaryRow
            label="Field"
            value={answers.areaId && answers.areaId !== 'unsure' ? getArea(answers.areaId)?.label : 'Open to anything'}
            onEdit={() => setStep('area')}
          />
          )}
          <SummaryRow
            label="Benefit"
            value={
              answers.benefit === 'confirmed' || answers.benefit === 'have'
                ? `Tuition reimbursement${reimburses ? `, ${money(partner.employerReimbursement)}/yr` : ''}`
                : answers.benefit === 'none'
                  ? 'Discounts only, and that still counts'
                  : 'Not sure yet, planning for both cases'
            }
            onEdit={() => setStep('benefit')}
          />
        </div>
        <p className="mt-4 font-display text-[13.5px] leading-relaxed text-mk-body">
          {matchPrograms(answers, PROGRAMS).length} of {PROGRAMS.length} programs fit this profile,
          every one discounted through AllCampus.
        </p>
        <div className="mt-5">
          <PrimaryBtn onClick={() => finish()}>Show my matches</PrimaryBtn>
        </div>
        <NextLine>Next: your matches appear right on this page, with filters for value and speed.</NextLine>
      </>
    ),
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-mk-slate/50 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Program pathfinder"
    >
      <div
        ref={panelRef}
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(30,45,58,0.35)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" aria-hidden>
            {order.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${i <= dotIndex ? 'w-6 bg-mk-teal-600' : 'w-3 bg-mk-line'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {step !== 'start' && (
              <button
                type="button"
                onClick={() => setStep(step === 'school' ? 'start' : order[Math.max(0, order.indexOf(step) - 1)])}
                className="font-display text-[13px] font-bold text-mk-body hover:text-mk-slate"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close pathfinder"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] text-mk-body transition hover:bg-mk-band hover:text-mk-slate"
            >
              ×
            </button>
          </div>
        </div>
        <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-mk-teal-text">
          {stepTitles[step === 'school' ? 'start' : step]}
        </p>
        {screens[step]}
      </div>
    </div>
  )
}

/* ---------- little pieces ---------- */

function QuestionHead({ eyebrow, title, why }) {
  return (
    <>
      <span className="sr-only">{eyebrow}</span>
      <h2 className="mt-1 font-display text-[24px] font-extrabold leading-snug text-mk-slate">{title}</h2>
      <p className="mt-2 font-display text-[13.5px] leading-relaxed text-mk-body">
        <span className="font-bold text-mk-teal-text">Why we ask: </span>
        {why}
      </p>
    </>
  )
}

function NextLine({ children }) {
  return <p className="mt-5 border-t border-mk-line pt-3.5 font-display text-[12.5px] leading-relaxed text-mk-body/80">{children}</p>
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-mk-line bg-white px-4 py-3">
      <span className="w-28 shrink-0 font-display text-[12px] font-bold uppercase tracking-wide text-mk-body/70">
        {label}
      </span>
      <span className="min-w-0 truncate font-display text-[14px] font-extrabold text-mk-slate">{value}</span>
      <button
        type="button"
        onClick={onEdit}
        className="ml-auto font-display text-[12.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
      >
        Edit
      </button>
    </div>
  )
}

function PrimaryBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-lg bg-mk-teal-600 px-5 py-2.5 font-display text-[14px] font-bold text-white transition hover:bg-mk-teal-700"
    >
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-lg border border-mk-line bg-white px-5 py-2.5 font-display text-[14px] font-bold text-mk-slate transition hover:border-mk-purple hover:text-mk-purple"
    >
      {children}
    </button>
  )
}
