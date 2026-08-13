/*
 * DeviceFrame (punch list E3): shows the product at a 390px phone viewport so
 * mobile stories (Tina) demo correctly without asking the reviewer to resize
 * their window. Review chrome, not product UI.
 *
 * Why an iframe and not a narrow div: CSS media queries (Tailwind's `sm:`
 * etc.) resolve against the VIEWPORT, not the container — so a 390px-wide div
 * inside a 1440px window still renders the desktop layout. An iframe has its
 * own viewport, so what's shown here is genuinely the mobile experience.
 *
 * The iframe loads the same app with `chrome=0`, which tells PrototypeFrame to
 * render the page alone (no review bar, no coach, no nested frame).
 */
export default function DeviceFrame({ enabled, onToggle, params = {}, children }) {
  if (!enabled) return children

  // Sync review state the iframe can't see (employer + concept live in React
  // state, not the URL) so the phone view shows the same story context.
  const url = new URL(window.location.href)
  url.searchParams.set('chrome', '0')
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v))

  return (
    <div className="min-h-screen bg-ink-900/95 px-4 py-8">
      <div className="mx-auto flex w-full max-w-[430px] flex-col items-center">
        <div className="mb-3 flex w-full items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wide text-white/55">
            Phone view · 390px
          </span>
          <button
            onClick={onToggle}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[12.5px] font-bold text-white transition hover:bg-white/10"
          >
            Exit phone view
          </button>
        </div>
        {/* Device shell */}
        <div className="overflow-hidden rounded-[2.25rem] border-[10px] border-ink-900 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <div className="mx-auto h-6 w-28 rounded-b-2xl bg-ink-900" aria-hidden />
          <iframe
            title="Phone view"
            src={url.toString()}
            className="block h-[720px] w-[390px] border-0"
          />
        </div>
        <p className="mt-3 max-w-[390px] text-center text-[12px] leading-relaxed text-white/45">
          A real 390px viewport, so the app&rsquo;s own responsive rules apply — not a scaled
          desktop view. The coach bar below keeps guiding the walk.
        </p>
      </div>
    </div>
  )
}
