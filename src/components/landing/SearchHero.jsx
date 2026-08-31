import { useState } from 'react'
import { MkButton } from './Section.jsx'
import AreaSkillSelect from './AreaSkillSelect.jsx'
import SkillsNavigator from './SkillsNavigator.jsx'
import SchoolPicker from './SchoolPicker.jsx'
import { heroImage } from '../../data/images.js'
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


export default function SearchHero({ partner, onSearch, navigator = false, onNavigate, onAskSchool }) {
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
          <SchoolPicker value={school} onChange={setSchool} onRequestSchool={onAskSchool} />
          <MkButton tone="green" onClick={submit} className="h-[42px] px-7">
            Search
          </MkButton>
        </form>
        )}

        {/* Replaces the Format filter: one platform property, not a choice. */}
        <p className="mt-3 flex items-center gap-2 text-[13px] font-bold text-mk-body">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mk-band px-3 py-1 text-mk-teal-text">
            <span aria-hidden>●</span> 100% online
          </span>
          Every program in the catalog is online and built to fit around a full-time job.
        </p>
      </div>
    </section>
  )
}
