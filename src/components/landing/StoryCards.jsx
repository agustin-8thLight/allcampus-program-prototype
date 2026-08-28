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
    <section className="bg-mk-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
      <Eyebrow>Learner stories</Eyebrow>
      <Heading className="mt-2">People like you, already using their benefit</Heading>
      {partnerSpecific && (
        <Body className="mt-2">Stories from {partner.name} team members.</Body>
      )}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {stories.map((s) => (
          <figure
            key={s.id}
            className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-mk-line bg-white"
          >
            {/* Learner portrait */}
            <div className="relative h-52">
              <Img
                src={storyImage(s.id)}
                alt={s.name}
                hue={s.hue}
                rounded=""
                focus="top"
                className="h-52 w-full"
                overlay="bg-gradient-to-t from-mk-slate/80 via-mk-slate/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display text-white">
                <span className="block text-[15px] font-extrabold">{s.name}</span>
                <span className="block text-[13px] text-white/85">{s.role}</span>
              </figcaption>
            </div>
            <blockquote className="flex flex-1 flex-col p-6">
              <p className="font-display text-[15px] leading-relaxed text-mk-slate">
                &ldquo;{s.quote}&rdquo;
              </p>
              {/* 2026-08-27: the program and the outcome were two arrowed text
                  lines that landed at a different height on every card. They
                  are tags now, pinned to the card's bottom by mt-auto, so the
                  row reads as one band instead of three floating footers. */}
              <span className="mt-auto flex flex-wrap gap-2 pt-4">
                <span className="rounded-full border border-mk-line bg-mk-surface px-3 py-1 font-display text-[12px] font-bold text-mk-teal-700">
                  {s.program}
                </span>
                {s.outcome && (
                  <span className="rounded-full border border-mk-green-600/30 bg-mk-green-600/10 px-3 py-1 font-display text-[12px] font-bold text-mk-green-700">
                    {s.outcome}
                  </span>
                )}
              </span>
            </blockquote>
          </figure>
        ))}
      </div>
      </div>
    </section>
  )
}
