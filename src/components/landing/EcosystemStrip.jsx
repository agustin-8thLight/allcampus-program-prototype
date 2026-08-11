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

const NODES = (schoolName) => [
  {
    key: 'you',
    label: 'You',
    does: 'Pick a program and put your education benefit to work.',
    contact: null,
  },
  {
    key: 'employer',
    label: 'Your employer',
    does: 'Funds your education benefit and sets how much is covered.',
    contact: 'Benefit questions: your HR or benefits portal',
  },
  {
    key: 'allcampus',
    label: 'AllCampus',
    does: 'The vehicle that gets you there: your discount applies here, and this is where you get help.',
    contact: 'Program & cost questions: Ally or an Education Benefits Specialist',
    highlight: true,
  },
  {
    key: 'school',
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

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nodes.map((n, i) => (
          <li key={n.key} className="relative">
            <div
              className={`h-full rounded-xl border p-5 ${
                n.highlight
                  ? 'border-mk-teal-600 bg-white shadow-[0_2px_12px_rgba(69,120,140,0.14)]'
                  : 'border-mk-line bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-extrabold ${
                    n.highlight ? 'bg-mk-teal-600 text-white' : 'bg-mk-band text-mk-teal-700'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] font-extrabold text-mk-slate">{n.label}</span>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-mk-body">{n.does}</p>
              {n.contact && (
                <p className="mt-2 text-[12px] leading-snug text-mk-teal-text">{n.contact}</p>
              )}
            </div>
            {/* Connector arrow between nodes (desktop) */}
            {i < nodes.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-mk-teal-600 lg:block"
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
