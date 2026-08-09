import { useState } from 'react'

export function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-indigo-600' : 'bg-zinc-700'
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
  'w-full rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 focus:outline-none focus:border-indigo-500'

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

export function Section({ title, description, children }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mb-4">
      <h2 className="text-sm font-medium text-white mb-0.5">{title}</h2>
      {description && <p className="text-xs text-zinc-500 mb-2">{description}</p>}
      <div className="divide-y divide-zinc-800">{children}</div>
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
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
        <button
          onClick={run}
          disabled={state === 'loading'}
          className="shrink-0 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 border border-zinc-700 transition-colors text-white text-xs font-medium px-3 py-1.5"
        >
          {state === 'loading' ? 'Running...' : 'Run'}
        </button>
      </div>
      {message && (
        <p className={`text-xs mt-2 ${state === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{message}</p>
      )}
    </div>
  )
}
