"use client"

import { useEffect, useState } from "react"
import { getDataSource, type Payout, type PendingPayoutEntry, type RecicladorProfile } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

export default function AdminPagosPage() {
  const [pending, setPending] = useState<PendingPayoutEntry[]>([])
  const [history, setHistory] = useState<Payout[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    const ds = getDataSource()
    const [pendingList, recicladores] = await Promise.all([ds.listAllPendingPayouts(), ds.listRecicladores()])
    setPending(pendingList)
    const perReciclador = await Promise.all(
      recicladores.map((r: RecicladorProfile) => ds.listPayouts(r.profileId))
    )
    setHistory(perReciclador.flat().sort((a, b) => b.period.localeCompare(a.period)))
  }

  useEffect(() => {
    load()
  }, [])

  async function close(recicladorId: string) {
    setBusyId(recicladorId)
    await getDataSource().closePayout(recicladorId)
    setBusyId(null)
    load()
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Conciliación de pagos a recicladores</h1>
      <p className="mt-1 text-verdex-ink-3">
        Kg validados en el periodo actual por cada reciclador — cerrá el pago cuando ya lo hayas
        transferido.
      </p>

      {pending.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-verdex-rule bg-verdex-paper p-4">
          <SkeletonLines count={2} />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
          {pending.map((p, i) => (
            <div
              key={p.recicladorId}
              className="flex animate-fade-in-up items-center justify-between px-4 py-3 transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <div className="text-sm text-verdex-ink">{p.operatorName}</div>
                <div className="text-xs text-verdex-ink-3">{p.kgTotal.toFixed(1)} kg sin pagar</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-verdex-ink">Bs {p.amountBs.toLocaleString("es-BO")}</span>
                <button
                  onClick={() => close(p.recicladorId)}
                  disabled={p.kgTotal === 0 || busyId === p.recicladorId}
                  className="rounded-full bg-verdex-green px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                >
                  {busyId === p.recicladorId ? "Cerrando..." : "Marcar como pagado"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Historial de pagos</h2>
      <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {history.length === 0 ? (
          <div className="p-4">
            <SkeletonLines count={3} />
          </div>
        ) : (
          history.map((p, i) => (
            <div
              key={p.id}
              className="flex animate-fade-in-up items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className="text-verdex-ink">{p.period}</span>
              <span className="text-verdex-ink-3">{p.kgTotal.toFixed(1)} kg</span>
              <span className="font-mono text-verdex-ink">Bs {p.amountBs.toLocaleString("es-BO")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
