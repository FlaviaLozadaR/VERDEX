"use client"

import { useEffect, useState } from "react"
import { getDataSource, type AdminLevel, type AdminTeamMember, type AuditLogEntry } from "@verdex/shared"

const LEVELS: AdminLevel[] = ["super_admin", "ops", "soporte"]

export default function AdminEquipoPage() {
  const [team, setTeam] = useState<AdminTeamMember[]>([])
  const [log, setLog] = useState<AuditLogEntry[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [level, setLevel] = useState<AdminLevel>("ops")
  const [busy, setBusy] = useState(false)

  const load = () => {
    const ds = getDataSource()
    ds.listAdminTeam().then(setTeam)
    ds.listAuditLog().then(setLog)
  }

  useEffect(load, [])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setBusy(true)
    await getDataSource().inviteAdminTeamMember({ name, email, level })
    setName("")
    setEmail("")
    setBusy(false)
    load()
  }

  async function remove(id: string) {
    await getDataSource().removeAdminTeamMember(id)
    load()
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Permisos del equipo Verdex</h1>
      <p className="mt-1 text-verdex-ink-3">Quién tiene acceso al panel de admin y con qué nivel.</p>

      <form onSubmit={invite} className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="w-full rounded-lg border border-verdex-rule bg-verdex-paper px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:w-auto sm:min-w-40 sm:flex-1"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email@verdex.app"
          className="w-full rounded-lg border border-verdex-rule bg-verdex-paper px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:w-auto sm:min-w-50 sm:flex-1"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as AdminLevel)}
          className="w-full rounded-lg border border-verdex-rule bg-verdex-paper px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:w-auto"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-verdex-green px-4 py-2 text-sm font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95 disabled:opacity-50 sm:w-auto"
        >
          Invitar
        </button>
      </form>

      <div className="mt-4 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {team.map((m) => (
          <div
            key={m.id}
            className="flex animate-fade-in-up items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
          >
            <div>
              <div className="text-verdex-ink">{m.name}</div>
              <div className="text-xs text-verdex-ink-3">{m.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase text-verdex-ink-3">{m.level}</span>
              <button
                onClick={() => remove(m.id)}
                className="text-xs text-verdex-amber-deep transition-opacity hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Registro de acciones</h2>
      {log.length === 0 ? (
        <p className="mt-3 text-sm text-verdex-ink-3">Sin acciones registradas todavía.</p>
      ) : (
        <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
          {log.map((entry, i) => (
            <div
              key={entry.id}
              className="animate-fade-in-up px-4 py-2.5 text-xs text-verdex-ink-2 transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
            >
              <span className="font-medium text-verdex-ink">{entry.actor}</span> {entry.action}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
