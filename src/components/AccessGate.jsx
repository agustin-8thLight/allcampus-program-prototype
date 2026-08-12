import { useState } from 'react'

/*
 * Static passcode gate for the deployed build (2026-08-12 decision: real
 * names stay in — the experience is protected by a passphrase + noindex
 * instead of anonymization). Client-side only: scrub-resistant, not
 * cryptographic. Off in local dev.
 */
const PASS = import.meta.env.VITE_GATE_PASS || 'searchleads'
const KEY = 'ac-proto-gate-ok'

export default function AccessGate({ children }) {
  const enabled = import.meta.env.PROD
  const [ok, setOk] = useState(() => !enabled || sessionStorage.getItem(KEY) === '1')
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)

  if (ok) return children

  const submit = (e) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === PASS) {
      sessionStorage.setItem(KEY, '1')
      setOk(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <form onSubmit={submit} className={`w-full max-w-sm text-center ${shake ? 'animate-pulse' : ''}`}>
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40">
          AllCampus × 8th Light
        </p>
        <h1 className="mt-2 text-2xl font-black text-white">Internal prototype</h1>
        <p className="mt-2 text-sm text-white/60">Enter the review passphrase to continue.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          className="mt-5 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center text-white outline-none placeholder:text-white/30 focus:border-white/50"
          placeholder="Passphrase"
        />
        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-white px-4 py-3 font-bold text-ink-900 transition hover:bg-white/90"
        >
          Enter
        </button>
      </form>
    </div>
  )
}
