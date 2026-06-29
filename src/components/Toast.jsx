import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircleIcon, CloseIcon } from './icons.jsx'

/*
 * One toast system for every product confirmation/message (06-29 review). All
 * action confirmations — details shared with a school, specialist call booked,
 * application opened — surface here as a colored, dismissible toast pinned to
 * the top of the product page, so they're hard to miss. Tones mirror the app's
 * semantics: `info` = school-channel (blue), `good` = AllCampus success (green),
 * `brand` = neutral house tone.
 *
 * The viewport sits below the prototype review bar (z-[55] < the bar's z-[60])
 * and above the drawer (z-40), so toasts read over an open drawer.
 */
const ToastContext = createContext(null)

let toastSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((spec) => {
    const id = ++toastSeq
    // Default: green success, auto-dismiss after 6s. Pass duration: null to pin.
    setToasts((list) => [...list, { id, tone: 'good', duration: 6000, ...spec }])
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

/* ------------------------------------------------------------------ */

const TONES = {
  good: { wrap: 'border-good-600/25 bg-good-50', icon: 'text-good-600', title: 'text-good-700' },
  info: { wrap: 'border-info-700/25 bg-info-50', icon: 'text-info-700', title: 'text-info-700' },
  brand: { wrap: 'border-brand-600/25 bg-brand-50', icon: 'text-brand-600', title: 'text-brand-700' },
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-14 z-[55] flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const tone = TONES[toast.tone] || TONES.good

  useEffect(() => {
    if (!toast.duration) return
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role="status"
      className={`toast-enter pointer-events-auto flex items-start gap-3 rounded-xl border ${tone.wrap} px-4 py-3 shadow-lg`}
    >
      <CheckCircleIcon className={`mt-0.5 shrink-0 text-xl ${tone.icon}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-[14px] font-bold ${tone.title}`}>{toast.title}</p>
        {toast.body && <p className="mt-0.5 text-[13px] leading-snug text-ink-700">{toast.body}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="-mr-1 shrink-0 rounded-full p-1 text-ink-400 transition hover:bg-black/5 hover:text-ink-700"
      >
        <CloseIcon className="text-base" />
      </button>
    </div>
  )
}
