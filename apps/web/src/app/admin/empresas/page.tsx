"use client"

import { useEffect, useState } from "react"
import { getDataSource, type EmpresaProfile, type PlanTier } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

const STATUS_LABEL: Record<EmpresaProfile["status"], string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}
const STATUS_CLASS: Record<EmpresaProfile["status"], string> = {
  pendiente: "bg-verdex-amber-soft text-verdex-amber-deep",
  aprobada: "bg-verdex-green-soft text-verdex-green-deep",
  rechazada: "bg-verdex-bg-2 text-verdex-ink-3",
}
const PLANS: PlanTier[] = ["starter", "crecimiento", "enterprise"]

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<EmpresaProfile[]>([])

  const load = () => {
    getDataSource().listEmpresas().then(setEmpresas)
  }

  useEffect(load, [])

  async function approve(id: string) {
    await getDataSource().approveEmpresa(id)
    load()
  }

  async function reject(id: string) {
    await getDataSource().rejectEmpresa(id)
    load()
  }

  async function changePlan(id: string, plan: PlanTier) {
    await getDataSource().setEmpresaPlan(id, plan)
    load()
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Gestión de empresas</h1>
      <p className="mt-1 text-verdex-ink-3">
        Aprobar registros nuevos, cambiar de plan y revisar el estado de cada empresa cliente.
      </p>

      {empresas.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-verdex-rule bg-verdex-paper p-4">
          <SkeletonLines count={4} />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
          {empresas.map((e, i) => (
            <div
              key={e.profileId}
              className="flex animate-fade-in-up flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div>
                <div className="text-sm text-verdex-ink">{e.companyName}</div>
                <div className="text-xs text-verdex-ink-3">{e.industry ?? "Sin rubro"}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${STATUS_CLASS[e.status]}`}
                >
                  {STATUS_LABEL[e.status]}
                </span>
                {e.status === "aprobada" && (
                  <select
                    value={e.planTier}
                    onChange={(ev) => changePlan(e.profileId, ev.target.value as PlanTier)}
                    className="rounded-lg border border-verdex-rule bg-verdex-bg px-2 py-1 text-xs text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
                  >
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
                {e.status === "pendiente" && (
                  <>
                    <button
                      onClick={() => approve(e.profileId)}
                      className="rounded-full bg-verdex-green px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => reject(e.profileId)}
                      className="text-xs text-verdex-amber-deep transition-opacity hover:underline"
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
