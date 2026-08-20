import { Eyebrow, Heading, Body } from './Section.jsx'
import { storiesForPartner } from '../../data/stories.js'
import { storyImage } from '../../data/images.js'
import Img from '../Img.jsx'

/*
 * Learner stories (2026-08-11 meeting): real photos, relatable narratives,
 * swappable by channel partner or employer. Stories are keyed by partner id
 * in data/stories.js; portraits are stock photography (Unsplash) standing in until real
 * learner photography is licensed. People and quotes are FICTIONAL placeholders.
 */

export default function StoryCards({ partner }) {
  const stories = storiesForPartner(partner?.id)
  const partnerSpecific = partner?.benefitKnown && storiesForPartner(partner.id) !== storiesForPartner(null)

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Learner stories</Eyebrow>
      <Heading className="mt-2">People like you, already using their benefit</Heading>
      {partnerSpecific && (
        <Body className="mt-2">Stories from {partner.name} team members.</Body>
      )}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {stories.map((s) => (
          <figure
            key={s.id}
            className="overflow-hidden rounded-xl border border-mk-line bg-white"
          >
            {/* Learner portrait */}
            <div className="relative h-52">
              <Img
                src={storyImage(s.id)}
                alt={s.name}
                hue={s.hue}
                rounded=""
                className="h-52 w-full"
                overlay="bg-gradient-to-t from-mk-slate/80 via-mk-slate/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display text-white">
                <span className="block text-[15px] font-extrabold">{s.name}</span>
                <span className="block text-[12.5px] text-white/85">{s.role}</span>
              </figcaption>
            </div>
            <blockquote className="p-5">
              <p className="font-display text-[14px] leading-relaxed text-mk-slate">
                &ldquo;{s.quote}&rdquo;
              </p>
              <p className="mt-3 font-display text-[12.5px] font-bold text-mk-teal-700">
                {s.program}
              </p>
              {s.outcome && (
                <p className="mt-1 flex items-center gap-1.5 font-display text-[12.5px] font-bold text-mk-green-700">
                  <span aria-hidden>→</span> {s.outcome}
                </p>
              )}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  )
}
