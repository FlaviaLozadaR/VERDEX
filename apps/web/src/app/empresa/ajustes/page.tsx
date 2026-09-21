"use client"

import { useEffect, useState } from "react"
import { DEMO_EMPRESA_ID, getDataSource, type EmpresaProfile, type EmpresaTeamMember } from "@verdex/shared"

export default function AjustesPage() {
  const [profile, setProfile] = useState<EmpresaProfile | null>(null)
  const [team, setTeam] = useState<EmpresaTeamMember[]>([])
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [notifyWeekly, setNotifyWeekly] = useState(true)
  const [notifyMilestones, setNotifyMilestones] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const ds = getDataSource()
    ds.getEmpresaProfile(DEMO_EMPRESA_ID).then((p) => {
      setProfile(p)
      setCompanyName(p.companyName)
      setIndustry(p.industry ?? "")
    })
    ds.listEmpresaTeam(DEMO_EMPRESA_ID).then(setTeam)
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Configuración de cuenta</h1>
      <p className="mt-1 text-verdex-ink-3">Datos de la empresa, accesos y notificaciones.</p>

      <form
        className="mt-8 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
      >
        <label className="text-xs font-medium uppercase tracking-widest text-verdex-ink-3">
          Nombre de la empresa
        </label>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <label className="mt-2 text-xs font-medium uppercase tracking-widest text-verdex-ink-3">Rubro</label>
        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-verdex-green px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95"
        >
          Guardar cambios
        </button>
        {saved && (
          <p className="animate-fade-in-up text-xs text-verdex-ink-3">
            Guardado solo en esta pantalla — no hay backend todavía para persistirlo entre sesiones.
          </p>
        )}
        {profile && <p className="mt-1 text-xs text-verdex-ink-3">Plan actual: {profile.planTier}</p>}
      </form>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Usuarios con acceso al panel</h2>
      <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {team.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
          >
            <div>
              <div className="text-verdex-ink">{m.name}</div>
              <div className="text-xs text-verdex-ink-3">{m.email}</div>
            </div>
            <span className="font-mono text-[10px] uppercase text-verdex-ink-3">{m.role}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-verdex-ink-3">Para invitar o quitar accesos, andá a Equipo.</p>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Notificaciones</h2>
      <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-verdex-rule bg-verdex-paper p-5">
        <label className="flex cursor-pointer items-center justify-between text-sm text-verdex-ink">
          Resumen semanal de impacto
          <input
            type="checkbox"
            checked={notifyWeekly}
            onChange={(e) => setNotifyWeekly(e.target.checked)}
            className="accent-verdex-green"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between text-sm text-verdex-ink">
          Alertas de hitos (nuevo nivel ESG, récord mensual)
          <input
            type="checkbox"
            checked={notifyMilestones}
            onChange={(e) => setNotifyMilestones(e.target.checked)}
            className="accent-verdex-green"
          />
        </label>
      </div>
    </div>
  )
}
