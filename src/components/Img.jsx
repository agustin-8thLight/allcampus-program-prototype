import { useState } from 'react'

/*
 * <Img> (punch list F1): one image primitive for the whole prototype.
 * Fixed-aspect slot so nothing shifts while loading, and a hue-gradient
 * fallback that renders if the photo fails (offline, rate limit, bad id) —
 * the prototype's original FPO treatment, kept as the safety net.
 *
 * Pass `hue` for a program/goal-appropriate gradient; `className` sets the
 * slot's size (always give it a height or aspect class).
 */
export default function Img({
  src,
  alt = '',
  hue = 208,
  className = '',
  rounded = 'rounded-[var(--radius-card)]',
  overlay = null,
  eager = false,
  // 'relative' (default, in-flow slot) or 'absolute' (full-bleed backdrop —
  // the caller positions it with inset classes). Must be explicit: passing
  // `absolute` via className loses to Tailwind's `relative` in stylesheet order.
  position = 'relative',
  // object-position for the photo. Portraits framed head-and-shoulders lose
  // the face to a centered crop in a short slot, so callers pass 'top'.
  focus = 'center',
}) {
  const [failed, setFailed] = useState(false)
  const gradient = `linear-gradient(135deg, hsl(${hue} 55% 48%), hsl(${(hue + 28) % 360} 60% 32%))`

  return (
    <div
      className={`${position} overflow-hidden ${rounded} ${className}`}
      style={{ background: gradient }}
    >
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${
            focus === 'top' ? 'object-[center_22%]' : 'object-center'
          }`}
        />
      )}
      {overlay && <div className={`absolute inset-0 ${overlay}`} aria-hidden />}
    </div>
  )
}
