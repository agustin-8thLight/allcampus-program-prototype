/*
 * Ecosystem role communication (2026-08-11 meeting, "mental model gap"):
 * users don't understand how employer, AllCampus, and school fit together,
 * and only 20-30% of high-intent users follow through. This strip names the
 * four parties and one plain job each, framing AllCampus as "the vehicle
 * that gets you there."
 *
 * Two variants:
 *  - 'landing'  : neutral "How this works" band.
 *  - 'school'   : the pre-bounce value-prop moment on a school page. Adds
 *                 the explicit retention argument (leaving to enroll
 *                 directly at the school forfeits the AllCampus discount).
 *
 * COPY IS DRAFT: align with Brigid's journey map when she shares it. Her map
 * also formalizes who-to-contact-for-what (employer HR vs AllCampus support
 * vs school admissions); the `contact` line per node sketches that here.
 */

/*
 * Simple line illustrations, one per ecosystem role. Inline SVG (no assets to
 * license) drawn on currentColor so they inherit the node's accent.
 */
const Art = {
  you: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <circle cx="32" cy="22" r="9" />
      <path d="M14 54c0-9.5 8-16 18-16s18 6.5 18 16" />
    </svg>
  ),
  employer: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M12 54V20l14-8 14 8v34" />
      <path d="M40 54V30h12v24" />
      <path d="M8 54h48M20 28h6M20 38h6M32 28h.01M32 38h.01" />
    </svg>
  ),
  allcampus: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M32 12l22 10-22 10-22-10 22-10z" />
      <path d="M18 27v11c0 5 6.3 8.5 14 8.5S46 43 46 38V27" />
      <path d="M54 22v13" />
    </svg>
  ),
  school: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M10 26h44M14 26v26M50 26v26M8 52h48" />
      <path d="M32 10l20 12H12l20-12z" />
      <path d="M24 52V36h16v16" />
    </svg>
  ),
}

const NODES = (schoolName) => [
  {
    key: 'you',
    art: 'you',
    label: 'You',
    does: 'Pick a program and put your education benefit to work.',
    contact: null,
  },
  {
    key: 'employer',
    art: 'employer',
    label: 'Your employer',
    does: 'Funds your education benefit and sets how much is covered.',
    contact: 'Benefit questions: your HR or benefits portal',
  },
  {
    key: 'allcampus',
    art: 'allcampus',
    label: 'AllCampus',
    does: 'The vehicle that gets you there: your discount applies here, and this is where you get help.',
    contact: 'Program & cost questions: Ally or an Education Benefits Specialist',
    highlight: true,
  },
  {
    key: 'school',
    art: 'school',
    label: schoolName || 'The school',
    does: 'Delivers the program, the classes, and the degree.',
    contact: 'Admissions & enrollment: the school, after you apply',
  },
]

export default function EcosystemStrip({ variant = 'landing', schoolName = null }) {
  const nodes = NODES(schoolName)
  return (
    <div className="font-display">
      {variant === 'school' && (
        <div className="mb-5 rounded-xl border border-mk-teal-600/30 bg-mk-band px-5 py-4">
          <p className="text-[15px] font-bold text-mk-slate">
            Your discount lives here, not on {schoolName || 'the school'}&rsquo;s site.
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-mk-body">
            Enrolling through AllCampus is how your employer&rsquo;s partnership pricing gets
            applied. Going directly to {schoolName || 'the school'} means paying their standard
            tuition without your benefit&rsquo;s discount.
          </p>
        </div>
      )}

      {/* One container holds the whole explanation; the AllCampus column is
          highlighted in light blue as the hinge of the four parts. */}
      <ol className="grid grid-cols-1 gap-2 rounded-3xl border border-mk-line bg-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {nodes.map((n, i) => (
          <li key={n.key} className="relative">
            <div
              className={`flex h-full flex-col rounded-2xl px-5 py-6 ${
                n.highlight ? 'bg-mk-blue-50 ring-1 ring-mk-blue-200' : ''
              }`}
            >
              {/* Illustration: large and centered above the column. */}
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-2xl ${
                  n.highlight ? 'bg-white text-mk-teal-700 shadow-sm' : 'bg-mk-band text-mk-teal-700'
                }`}
              >
                {Art[n.art] ? Art[n.art]({ className: 'h-14 w-14' }) : null}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span
                  className={`text-[13px] font-extrabold ${
                    n.highlight ? 'text-mk-teal-700' : 'text-mk-body/60'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[20px] font-extrabold leading-snug text-mk-slate">
                  {n.label}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-mk-body">{n.does}</p>
              {n.contact && (
                <p className="mt-auto pt-3 text-[12.5px] leading-snug text-mk-teal-text">
                  {n.contact}
                </p>
              )}
            </div>
            {/* Connector between columns, aligned to the illustration row */}
            {i < nodes.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-[9px] top-[74px] z-10 hidden text-[17px] text-mk-teal-600/60 lg:block"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
