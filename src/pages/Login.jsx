import { api } from '../api'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🛡️</span>
        </div>
        <h1 className="text-xl font-medium text-white mb-2">PySecured Dashboard</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Manage anti-hack protection for your Discord servers.
        </p>
        <a
          href={api.loginUrl()}
          className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium py-2.5 px-4"
        >
          Continue with Discord
        </a>
        <p className="text-xs text-zinc-600 mt-6">
          You'll only see servers where you're an admin and PySecured is already added.
        </p>
      </div>
    </div>
  )
}
