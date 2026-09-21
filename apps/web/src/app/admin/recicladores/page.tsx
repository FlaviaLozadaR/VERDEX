"use client"

import { useEffect, useState } from "react"
import { getDataSource, type CollectionPoint, type PendingPayoutEntry, type RecicladorProfile } from "@verdex/shared"

export default function AdminRecicladoresPage() {
  const [recicladores, setRecicladores] = useState<RecicladorProfile[]>([])
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [pending, setPending] = useState<PendingPayoutEntry[]>([])

  const load = () => {
    const ds = getDataSource()
    ds.listRecicladores().then(setRecicladores)
    ds.listCollectionPoints().then(setPoints)
    ds.listAllPendingPayouts().then(setPending)
  }

  useEffect(load, [])

  async function approve(id: string) {
    await getDataSource().approveReciclador(id)
    load()
  }

  async function assign(recicladorId: string, pointId: string) {
    if (!pointId) return
    await getDataSource().assignRecicladorZone(recicladorId, pointId)
    load()
  }

  const pendingKg = (recicladorId: string) => pending.find((p) => p.recicladorId === recicladorId)?.kgTotal ?? 0

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Gestión de recicladores</h1>
      <p className="mt-1 text-verdex-ink-3">
        Aprobar operadores nuevos, asignarles zona/puntos de acopio y revisar su actividad.
      </p>

      <div className="mt-6 space-y-3">
        {recicladores.map((r, i) => {
          const assigned = points.filter((p) => p.recicladorId === r.profileId)
          const unassigned = points.filter((p) => !p.recicladorId)
          return (
            <div
              key={r.profileId}
              className="animate-fade-in-up rounded-2xl border border-verdex-rule bg-verdex-paper p-4 transition-shadow hover:shadow-sm"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-verdex-ink">{r.operatorName}</div>
                  <div className="text-xs text-verdex-ink-3">
                    {r.zone} · Bs {r.payoutRateBsKg}/kg · {pendingKg(r.profileId).toFixed(1)} kg sin cobrar
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                      r.status === "aprobado"
                        ? "bg-verdex-green-soft text-verdex-green-deep"
                        : "bg-verdex-amber-soft text-verdex-amber-deep"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.status === "pendiente" && (
                    <button
                      onClick={() => approve(r.profileId)}
                      className="rounded-full bg-verdex-green px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95"
                    >
                      Aprobar
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-verdex-rule pt-3 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="text-xs text-verdex-ink-3">Puntos asignados:</span>
                {assigned.length === 0 && unassigned.length === 0 ? null : (
                  <div className="flex flex-wrap items-center gap-2">
                    {assigned.length === 0 ? (
                      <span className="text-xs text-verdex-ink-3">ninguno</span>
                    ) : (
                      assigned.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-full bg-verdex-bg-2 px-2.5 py-1 text-xs text-verdex-ink-2"
                        >
                          {p.name}
                        </span>
                      ))
                    )}
                  </div>
                )}
                {unassigned.length > 0 && (
                  <select
                    defaultValue=""
                    onChange={(e) => assign(r.profileId, e.target.value)}
                    className="w-full rounded-lg border border-verdex-rule bg-verdex-bg px-2 py-1.5 text-xs text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none sm:ml-auto sm:w-auto sm:py-1"
                  >
                    <option value="">+ Asignar punto</option>
                    {unassigned.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
