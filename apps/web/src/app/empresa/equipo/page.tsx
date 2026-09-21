"use client"

import { useEffect, useState } from "react"
import { DEMO_EMPRESA_ID, getDataSource, type EmpresaAfiliado, type EmpresaTeamMember } from "@verdex/shared"

export default function EquipoPage() {
  const [afiliados, setAfiliados] = useState<EmpresaAfiliado[]>([])
  const [team, setTeam] = useState<EmpresaTeamMember[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)

  const load = () => {
    const ds = getDataSource()
    ds.listEmpresaAfiliados(DEMO_EMPRESA_ID).then(setAfiliados)
    ds.listEmpresaTeam(DEMO_EMPRESA_ID).then(setTeam)
  }

  useEffect(load, [])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setBusy(true)
    await getDataSource().inviteEmpresaTeamMember(DEMO_EMPRESA_ID, { name, email })
    setName("")
    setEmail("")
    setBusy(false)
    load()
  }

  async function remove(memberId: string) {
    await getDataSource().removeEmpresaTeamMember(DEMO_EMPRESA_ID, memberId)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Empleados afiliados</h1>
      <p className="mt-1 text-verdex-ink-3">
        Empleados registrados como usuarios afiliados a tu empresa — su reciclaje ya cuenta en el
        Dashboard ESG.
      </p>

      <div className="mt-6 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {afiliados.map((a, i) => (
          <div
            key={a.id}
            className="flex animate-fade-in-up items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="text-verdex-ink">{a.name}</span>
            <span className="font-mono text-verdex-ink-2">{a.kg.toFixed(1)} kg</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-verdex-ink-3">
        Se invita por email/dominio corporativo una vez que exista Supabase Auth — hoy es un roster
        de demostración.
      </p>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Acceso al panel</h2>
      <p className="mt-1 text-sm text-verdex-ink-3">Quiénes de tu equipo pueden entrar a este panel.</p>

      <form onSubmit={invite} className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="w-full rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:w-auto sm:min-w-40 sm:flex-1"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email@empresa.com"
          className="w-full rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:w-auto sm:min-w-50 sm:flex-1"
        />
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
              <span className="font-mono text-[10px] uppercase text-verdex-ink-3">{m.role}</span>
              {m.role !== "admin" && (
                <button
                  onClick={() => remove(m.id)}
                  className="text-xs text-verdex-amber-deep transition-opacity hover:underline"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
