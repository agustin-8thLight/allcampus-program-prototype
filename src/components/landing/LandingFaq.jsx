import { Heading } from './Section.jsx'

/*
 * Page-level FAQ (stays at the bottom, per 2026-08-11 meeting). Questions
 * echo the live template's accordion; answers double as mental-model copy
 * (who does what across employer / AllCampus / school).
 */

const FAQS = [
  {
    q: 'How does my employer’s tuition benefit work here?',
    a: 'Your employer funds a yearly tuition benefit. When you enroll through AllCampus, partner discounts apply automatically and your benefit covers some or all of what remains. Your HR team owns the benefit itself; we help you use it.',
  },
  {
    q: 'Why enroll through AllCampus instead of going straight to the school?',
    a: 'AllCampus is how your discount gets applied. The school delivers your program either way, but enrolling directly means paying standard tuition without the partnership pricing your employer set up.',
  },
  {
    q: 'Can I earn a degree or certificate while working full-time?',
    a: 'Yes — nearly every program in the network is online or hybrid, built for working adults, with multiple start dates per year.',
  },
  {
    q: 'What are my options to pay for school?',
    a: 'Employer tuition benefits, AllCampus partner discounts, and standard financial aid can combine. An Education Benefits Specialist can walk through your exact numbers, free.',
  },
]

export default function LandingFaq() {
  return (
    <section className="bg-mk-surface pb-20 pt-4">
      <div className="mx-auto max-w-3xl px-5">
      {/* Centered, per 2026-08-25 direction. The FAQS eyebrow went: it was
          the heading again, one line higher. */}
      <div className="text-center">
        <Heading>Your questions, answered</Heading>
      </div>
      <div className="mt-7 space-y-2.5">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-lg border border-mk-line bg-white px-5 py-4 open:bg-mk-surface"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-mk-slate">
              {f.q}
              <span className="text-mk-teal-600 transition group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">{f.a}</p>
          </details>
        ))}
      </div>
      </div>
    </section>
  )
}
