import { useState } from 'react'
import { MkButton } from './Section.jsx'
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

  const submit = (e) => {
    e?.preventDefault()
    onSearch({
      q: q.trim(),
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

      {/* Floating search card */}
      <div className="mx-auto -mt-14 max-w-5xl px-5">
        <form
          onSubmit={submit}
          className="grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(51,71,91,0.14)] sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end"
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
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">Degree level</span>
            <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectCls}>
              {DEGREE_LEVELS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-mk-slate">
              How would you like to attend?
            </span>
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
