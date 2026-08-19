import { useState } from 'react'
import { MkButton } from './Section.jsx'
import AreaSkillSelect from './AreaSkillSelect.jsx'
import { heroImage } from '../../data/images.js'
import Img from '../Img.jsx'

/*
 * Landing hero: search front and center with degree-level and modality
 * selectors (2026-08-11 meeting; modality stays — some programs are
 * on-campus). Pattern mirrors the live BenefitEd template: dimmed hero with
 * white display heading, floating white search card with labeled fields and
 * a green Search action. Hero photography is stock (Unsplash) standing in
 * until licensed imagery is supplied.
 */

const DEGREE_LEVELS = ['Any degree level', 'Certificate', 'Associate', "Bachelor's", "Master's"]
const MODALITIES = ['Any format', 'Online', 'Hybrid', 'On campus']

export default function SearchHero({ partner, onSearch }) {
  const [q, setQ] = useState('')
  const [degree, setDegree] = useState(DEGREE_LEVELS[0])
  const [modality, setModality] = useState(MODALITIES[0])
  // Field selector covers areas of study AND their skills in one control:
  // value is 'area:<id>' or 'skill:<id>' so people can pick either
  // granularity without choosing between two menus.
  const [field, setField] = useState('')

  const submit = (e) => {
    e?.preventDefault()
    const [kind, id] = field ? field.split(':') : []
    onSearch({
      q: q.trim(),
      area: kind === 'area' ? id : null,
      skill: kind === 'skill' ? id : null,
      goal: kind === 'goal' ? id : null,
      degree: degree === DEGREE_LEVELS[0] ? null : degree,
      modality: modality === MODALITIES[0] ? null : modality,
    })
  }

  const selectCls =
    'w-full appearance-none rounded-md border border-mk-line bg-white px-3 py-2.5 font-display text-[14px] text-mk-slate outline-none focus:border-mk-teal-600'

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
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/85">
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
          clip the top label row. */}
      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-5">
        <form
          onSubmit={submit}
          className="relative grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(51,71,91,0.14)] sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_.9fr_.9fr_auto] sm:items-end"
        >
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">
              What do you want to study?
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Program, subject, or school"
              className="w-full rounded-md border border-mk-line px-3 py-2.5 text-[14px] text-mk-slate outline-none placeholder:text-mk-body/60 focus:border-mk-teal-600"
            />
          </label>
          {/* Custom picker, kept from the gate-flow explorations (2026-08-19):
              opens on a Popular tab of outcome labels, area tabs beside it —
              the one piece retained from that branch after client review. */}
          <AreaSkillSelect value={field} onChange={setField} />
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">Degree level</span>
            <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectCls}>
              {DEGREE_LEVELS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">Format</span>
            <select value={modality} onChange={(e) => setModality(e.target.value)} className={selectCls}>
              {MODALITIES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <MkButton tone="green" onClick={submit} className="h-[42px] px-7">
            Search
          </MkButton>
        </form>
      </div>
    </section>
  )
}
