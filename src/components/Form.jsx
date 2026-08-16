import { useState } from 'react'
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react'

export function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white">{label}</p>
        {description && <p className="text-xs text-[var(--mist-dim)] mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 border ${
          checked ? 'bg-[var(--py-blue)] border-[var(--py-blue)]' : 'bg-[var(--bg-raised)] border-[var(--line)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block py-3">
      <span className="block text-sm text-white mb-1.5">{label}</span>
      {children}
    </label>
  )
}

const controlClass =
  'w-full rounded-lg bg-[var(--bg-raised)] border border-[var(--line)] text-sm text-white px-3 py-2 field-focus font-mono'

export function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={controlClass}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function NumberInput({ value, onChange, min, max }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className={controlClass}
    />
  )
}

export function TextInput({ value, onChange, placeholder, maxLength }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${controlClass} font-sans`}
    />
  )
}

export function TextArea({ value, onChange, placeholder, maxLength, rows = 3 }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      className={`${controlClass} font-sans resize-none`}
    />
  )
}

export function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value || '#5865F2'}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-9 rounded-lg border border-[var(--line)] bg-[var(--bg-raised)] cursor-pointer"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#5865F2"
        className={`${controlClass} font-sans w-32`}
      />
    </div>
  )
}

export function Section({ title, description, icon: Icon, children }) {
  return (
    <div className="surface rounded-2xl border border-[var(--line)] p-5 sm:p-6 mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        {Icon && (
          <div className="w-6 h-6 rounded-md bg-[var(--py-blue)]/10 border border-[var(--py-blue)]/25 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-[var(--py-blue)]" strokeWidth={2.25} />
          </div>
        )}
        <h2 className="font-display text-base font-bold text-white">{title}</h2>
      </div>
      {description && <p className="text-xs text-[var(--mist-dim)] mb-3 leading-relaxed">{description}</p>}
      <div className="divide-y divide-[var(--line)]">{children}</div>
    </div>
  )
}

export function ActionButton({ label, description, onRun, resultText }) {
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  async function run() {
    setState('loading')
    setMessage('')
    try {
      const result = await onRun()
      setMessage(resultText ? resultText(result) : 'Done.')
      setState('done')
    } catch (e) {
      setMessage(e.message)
      setState('error')
    }
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-white">{label}</p>
          {description && <p className="text-xs text-[var(--mist-dim)] mt-0.5">{description}</p>}
        </div>
        <button
          onClick={run}
          disabled={state === 'loading'}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-raised)] hover:brightness-125 disabled:opacity-50 border border-[var(--line)] transition-all text-white text-xs font-medium px-3 py-1.5"
        >
          {state === 'loading' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.25} />
          ) : (
            <Play className="w-3.5 h-3.5" strokeWidth={2.25} />
          )}
          {state === 'loading' ? 'Running...' : 'Run'}
        </button>
      </div>
      {message && (
        <p className={`flex items-center gap-1.5 text-xs mt-2 ${state === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
          {state === 'error' ? (
            <XCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.25} />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.25} />
          )}
          {message}
        </p>
      )}
    </div>
  )
}
