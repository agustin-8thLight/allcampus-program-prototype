import { useState } from 'react'
import { MkButton } from './Section.jsx'
import AreaSkillSelect from './AreaSkillSelect.jsx'
import SkillsNavigator from './SkillsNavigator.jsx'
import SchoolPicker from './SchoolPicker.jsx'
import { heroImage } from '../../data/images.js'
import { PROGRAMS, money } from '../../data/model.js'
import { SCHOOLS } from '../../data/schools.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { WHY_COUNTS } from '../../data/landingCopy.js'
import Img from '../Img.jsx'

/*
 * Landing hero: search front and center. Three controls as of the 2026-08-28
 * review — keyword, area/skill, and school. Degree level and modality are both
 * gone; the stated goal was less to think about, not more to filter by.
 * Pattern mirrors the live BenefitEd template: dimmed hero with
 * white display heading, floating white search card with labeled fields and
 * a green Search action. Hero photography is stock (Unsplash) standing in
 * until licensed imagery is supplied.
 */

/*
 * Fact boxes, restored 2026-08-31 review. James: "you guys need a way for
 * people to land on this page and visually see right away who you are and what
 * you do... even without having to scroll," and "that's not what we talked
 * about last week, keeping some of the high-level value props at the top there.
 * Like, they had the little boxes."
 *
 * They came out because the page was text-heavy and these duplicated the Why
 * AllCampus block. The resolution in the meeting was not to pick one: keep both
 * and let them divide the labor. So these four are FACTOIDS — the size and
 * shape of the offer, no sentences — and Why AllCampus keeps the argument.
 * Same figures in both places, so the two cannot contradict each other.
 *
 * Counts are Brigid's literals via landingCopy.js (WHY_COUNTS), which is the
 * standing convention: her doc sanctions mock counts, and the 2026-08-28
 * direction was to use her figures wherever they appear. The catalog's own
 * 24 schools / 135 programs is a different scope (see LogoStrip). The discount
 * and the cap are computed off the catalog instead of typed in, so neither box
 * can promise something a visitor will not actually find.
 */
const MAX_PCT = bestDiscountPercent(PROGRAMS)
const TUITION_CAPS = Object.values(SCHOOLS)
  .map((s) => s.tuitionCap)
  .filter(Boolean)
const TUITION_CAP = TUITION_CAPS.length ? Math.min(...TUITION_CAPS) : null

const HERO_FACTS = [
  { v: WHY_COUNTS.schools, l: 'Partner schools' },
  { v: WHY_COUNTS.programs, l: 'Online programs' },
  MAX_PCT ? { v: `Up to ${MAX_PCT}%`, l: 'Off tuition' } : null,
  TUITION_CAP ? { v: `${money(TUITION_CAP)}/yr`, l: 'Tuition cap, select schools' } : null,
].filter(Boolean)

export default function SearchHero({
  partner,
  onSearch,
  navigator = false,
  onNavigate,
  onAskSchool,
  // 2026-08-31: routes the outlet-valve nudge to the account gate, NOT to
  // Ally. James: "we don't want to be burning tokens for people who will never
  // create an account." Undefined by default, and the action below is omitted
  // entirely when it is, so the copy still does its job with no handler wired.
  onExploreValue,
}) {
  const [q, setQ] = useState('')
  // Degree level gave up its slot to the school picker (2026-08-28 review).
  // Brigid: "most people probably already have a school in mind and are
  // looking for a discount." Four controls also fought the stated goal of
  // reducing cognitive load, so the hero carries three.
  const [school, setSchool] = useState(null)
  // Field selector covers areas of study AND their skills in one control:
  // value is 'area:<id>' or 'skill:<id>' so people can pick either
  // granularity without choosing between two menus.
  const [field, setField] = useState('')

  /*
   * Routing agreed in the 2026-08-28 review, verbatim:
   *   school only            -> the school homepage, where the discounts and
   *                             programs for that school are explained
   *   skill or keyword only  -> filtered browse, lowest tuition surfaced first
   *   both                   -> filtered browse scoped to that school
   */
  const submit = (e) => {
    e?.preventDefault()
    const [kind, id] = field ? field.split(':') : []
    const term = q.trim()
    const hasCriteria = Boolean(term || field)

    if (school && !hasCriteria) {
      onNavigate?.(`/school/${school}`)
      return
    }
    onSearch({
      q: term,
      area: kind === 'area' ? id : null,
      skill: kind === 'skill' ? id : null,
      goal: kind === 'goal' ? id : null,
      school: school || null,
      // Cost order IS relevance when someone has narrowed by field but not by
      // program (Samir's case, useCases.js:68).
      filter: hasCriteria && !school ? 'mostAffordable' : null,
    })
  }


  return (
    <section className="relative font-display">
      {/* Hero: photography with a slate wash so type stays legible */}
      <div className="relative pb-24 pt-16 text-white">
        <Img
          src={heroImage(partner?.id)}
          alt=""
          hue={206}
          rounded=""
          eager
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(112deg,rgba(30,45,58,0.92)_0%,rgba(51,71,91,0.82)_45%,rgba(69,120,140,0.62)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <h1 className="max-w-2xl text-[36px] font-extrabold leading-tight sm:text-[44px]">
            Advance your career through education
          </h1>
          <p className="mt-3 max-w-xl text-[16.5px] leading-relaxed text-white/85">
            Find the degree or certificate that moves you forward, with exclusive discounts
            {partner?.benefitKnown ? (
              <> through {partner.name}&rsquo;s partnership with AllCampus.</>
            ) : (
              <> through AllCampus&rsquo;s university partnerships.</>
            )}
          </p>

          {/* Four facts, sized DOWN on purpose. PathfinderHero runs the same
              row at 22px/font-black because stats are the only thing on that
              hero; here the white search card is the primary action, so these
              sit at card-title weight on a translucent ground and read as hero
              furniture rather than a second CTA. 2x2 on phones, 4-up from sm.
              max-w-2xl keeps them from spanning wider than the dek above.
              auto-rows-fr because the 2x2 phone layout puts a one-line label
              beside a wrapping one, and independent row heights made the four
              boxes read as two different components. */}
          <dl className="mt-8 grid max-w-2xl auto-rows-fr grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {HERO_FACTS.map((f) => (
              <div
                key={f.l}
                className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 backdrop-blur-sm"
              >
                <dt className="text-mk-cardtitle font-extrabold leading-none text-white">{f.v}</dt>
                <dd className="mt-1 text-mk-caption font-semibold leading-snug text-white/75">
                  {f.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Floating search card. `relative z-10` matters: the hero's absolutely
          positioned photo would otherwise paint over this static sibling and
          clip the top label row. The `navigator` variant (2026-08-19 session)
          replaces the whole form with the always-open skills navigator: the
          job logged out is recognition, not search — search lives in the nav. */}
      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-5">
        {navigator ? (
          <SkillsNavigator onNavigate={onNavigate} />
        ) : (
        <form
          onSubmit={submit}
          className="relative grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(51,71,91,0.14)] sm:grid-cols-2 lg:grid-cols-[1.4fr_1.3fr_1fr_auto] sm:items-end"
        >
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">
              What do you want to study?
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Program or subject"
              className="w-full rounded-md border border-mk-line px-3 py-2.5 text-[15px] text-mk-slate outline-none placeholder:text-mk-body/60 focus:border-mk-teal-600"
            />
          </label>
          {/* Custom picker, kept from the gate-flow explorations (2026-08-19):
              opens on a Popular tab of outcome labels, area tabs beside it —
              the one piece retained from that branch after client review. */}
          <AreaSkillSelect value={field} onChange={setField} />
          <SchoolPicker value={school} onChange={setSchool} onRequestSchool={onAskSchool} onExploreValue={onExploreValue} />
          <MkButton tone="green" onClick={submit} className="h-[42px] px-7">
            Search
          </MkButton>
        </form>
        )}

        {/* Outlet valve, reframed 2026-08-31. This was the Format filter's
            replacement — one platform property, not a choice — and it still is,
            but it now does a second job.

            Brigid kept the idea and rejected the wording: "that actual content
            isn't totally accurate, but I do want it somewhere. I do want that
            somewhere. Getting that across is important." So the absolute claim
            ("Every program in the catalog is online") is gone and the online /
            fits-around-work idea stays.

            The second job is her real worry: someone types their local
            community college, does not find it, "and then they just leave... I
            want them to be curious about what we could offer, even if their one
            school isn't here." A dead end after one search is the leak. So the
            line now says out loud that a missing school is not a missing offer.

            This is CONTENT, not a chat launcher. Ally stays behind login
            (James, on tokens) and Brigid agreed: "I think it's a content
            thing." The optional action goes to onExploreValue, which the call
            site points at the account gate. */}
        <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-mk-band px-3 py-1 text-mk-meta font-bold text-mk-teal-text">
            <span aria-hidden>●</span> Online, around work
          </span>
          <div className="min-w-0">
            <p className="text-mk-meta font-bold leading-relaxed text-mk-slate">
              These are online programs, built to fit around a full-time job.
            </p>
            <p className="mt-1 text-mk-meta leading-relaxed text-mk-body">
              Don&rsquo;t see your school or your program? You may still have options. Ally can find
              the closest match across {WHY_COUNTS.schools} partner universities and show you what it
              would cost.
            </p>
            {onExploreValue && (
              <MkButton tone="outline" size="sm" onClick={onExploreValue} className="mt-2.5">
                Explore with Ally
              </MkButton>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
