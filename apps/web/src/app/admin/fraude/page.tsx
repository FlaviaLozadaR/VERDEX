"use client"

import { useEffect, useState } from "react"
import { getDataSource, type Deposit, type FraudFlag } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

const SEVERITY_CLASS: Record<FraudFlag["severity"], string> = {
  baja: "bg-verdex-bg-2 text-verdex-ink-3",
  media: "bg-verdex-amber-soft text-verdex-amber-deep",
  alta: "bg-red-100 text-red-700",
}

export default function AdminFraudePage() {
  const [flags, setFlags] = useState<FraudFlag[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loaded, setLoaded] = useState(false)

  const load = () => {
    const ds = getDataSource()
    ds.listFraudFlags().then((list) => {
      setFlags(list)
      setLoaded(true)
    })
    ds.listDeposits().then(setDeposits)
  }

  useEffect(load, [])

  async function resolve(id: string) {
    await getDataSource().resolveFraudFlag(id)
    load()
  }

  async function block(usuarioId: string) {
    await getDataSource().suspendUsuario(usuarioId)
    load()
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Moderación y anomalías</h1>
      <p className="mt-1 text-verdex-ink-3">
        Depósitos con peso fuera de rango se marcan acá automáticamente — probá Escanear con una
        cantidad grande para ver una alerta nueva.
      </p>

      {!loaded ? (
        <div className="mt-6 rounded-2xl border border-verdex-rule bg-verdex-paper p-4">
          <SkeletonLines count={2} />
        </div>
      ) : flags.length === 0 ? (
        <p className="mt-6 animate-fade-in-up text-sm text-verdex-ink-3">No hay alertas registradas.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {flags.map((f, i) => {
            const deposit = deposits.find((d) => d.id === f.depositId)
            return (
              <div
                key={f.id}
                className="animate-fade-in-up rounded-2xl border border-verdex-rule bg-verdex-paper p-4 transition-shadow hover:shadow-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${SEVERITY_CLASS[f.severity]}`}>
                      {f.severity}
                    </span>
                    <p className="mt-2 text-sm text-verdex-ink">{f.reason}</p>
                    <p className="mt-1 text-xs text-verdex-ink-3">Depósito {f.depositId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.status === "pendiente" ? (
                      <>
                        <button
                          onClick={() => resolve(f.id)}
                          className="rounded-full border border-verdex-rule px-3 py-1.5 text-xs font-medium text-verdex-ink-2 transition-colors hover:border-verdex-green hover:text-verdex-green-deep"
                        >
                          Marcar revisado
                        </button>
                        {deposit && (
                          <button
                            onClick={() => block(deposit.usuarioId)}
                            className="text-xs text-red-600 transition-opacity hover:underline"
                          >
                            Bloquear cuenta
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="font-mono text-[10px] uppercase text-verdex-ink-3">revisado</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
