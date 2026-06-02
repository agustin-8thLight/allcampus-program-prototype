import { useEffect, useRef } from 'react'

/*
 * Drawer shell (§10.6). One sliding panel over a dimmed background. It hosts
 * swappable VIEWS (program detail, Ally) rather than stacking a second drawer.
 * The active view owns its own header/scroll/footer; the shell only provides
 * the panel, the open/close slide, and a smooth view-to-view transition.
 *
 * viewKey changes animate the inner content (detail <-> ally) so the swap reads
 * as one continuous space, not a new surface.
 */
export default function Drawer({ open, onClose, label, viewKey = 'detail', children }) {
  const viewRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Move keyboard focus into each view as it opens or swaps, so screen-reader
  // and keyboard users land in the new content rather than being left behind.
  useEffect(() => {
    if (open) viewRef.current?.focus()
  }, [open, viewKey])

  // Detail is the "home" view (enters from the left); ally/flow are forward
  // steps (enter from the right).
  const enter = viewKey === 'detail' ? 'view-enter-left' : 'view-enter-right'

  // The "take the next step" flow holds small, centered content, so the panel
  // narrows to fit it; detail and Ally keep the full reading width.
  const maxW = viewKey === 'flow' ? 'max-w-[520px]' : 'max-w-[860px]'

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-12 z-40 overflow-hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Dimmed background */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink-900/45 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sliding panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`absolute right-0 top-0 h-full w-full ${maxW} bg-surface-0 shadow-2xl transition-[transform,max-width] duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Keyed view: remounts and animates whenever the view changes. */}
        {open && (
          <div key={viewKey} ref={viewRef} tabIndex={-1} className={`h-full outline-none ${enter}`}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
