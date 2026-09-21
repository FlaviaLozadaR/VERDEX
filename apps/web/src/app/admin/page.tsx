"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getDataSource, type NetworkImpact } from "@verdex/shared"
import { Skeleton } from "@/components/Skeleton"

export default function AdminOverviewPage() {
  const [impact, setImpact] = useState<NetworkImpact | null>(null)
  const [empresasPendientes, setEmpresasPendientes] = useState(0)
  const [recicladoresPendientes, setRecicladoresPendientes] = useState(0)
  const [fraudePendiente, setFraudePendiente] = useState(0)

  useEffect(() => {
    const ds = getDataSource()
    ds.getNetworkImpact().then(setImpact)
    ds.listEmpresas().then((list) => setEmpresasPendientes(list.filter((e) => e.status === "pendiente").length))
    ds.listRecicladores().then((list) =>
      setRecicladoresPendientes(list.filter((r) => r.status === "pendiente").length)
    )
    ds.listFraudFlags().then((list) => setFraudePendiente(list.filter((f) => f.status === "pendiente").length))
  }, [])

  const alerts = [
    { count: empresasPendientes, label: "Empresas por aprobar", href: "/admin/empresas" },
    { count: recicladoresPendientes, label: "Recicladores por aprobar", href: "/admin/recicladores" },
    { count: fraudePendiente, label: "Alertas de fraude sin revisar", href: "/admin/fraude" },
  ].filter((a) => a.count > 0)

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Toda la red, de un vistazo.</h1>
      <p className="mt-1 text-verdex-ink-3">Analítica global y lo que necesita tu atención hoy.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {impact ? (
          <>
            <Stat label="Kg reciclados (red)" value={Math.round(impact.kgTotal).toLocaleString("es-BO")} />
            <Stat label="Usuarios activos" value={impact.usuariosActivos.toLocaleString("es-BO")} />
            <Stat label="Empresas en la red" value={String(impact.empresasActivas)} />
            <Stat label="Recicladores activos" value={String(impact.recicladoresActivos)} />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-verdex-rule bg-verdex-paper p-5">
              <Skeleton className="mx-auto h-7 w-16" />
              <Skeleton className="mx-auto mt-2 h-2 w-20" />
            </div>
          ))
        )}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Alertas que necesitan revisión</h2>
      {impact && alerts.length === 0 ? (
        <p className="mt-3 animate-fade-in-up text-sm text-verdex-ink-3">
          Todo al día — no hay nada pendiente de revisión.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
          {alerts.map((a, i) => (
            <Link
              key={a.label}
              href={a.href}
              className={`stagger-${i + 1} animate-fade-in-up rounded-xl border border-verdex-amber-deep bg-verdex-amber-soft p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5`}
            >
              <div className="font-serif text-lg text-verdex-amber-deep sm:text-3xl">{a.count}</div>
              <div className="mt-1 text-[11px] leading-tight text-verdex-ink-2 sm:text-sm">{a.label}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-verdex-rule bg-verdex-paper p-5 text-center">
      <div className="font-serif text-2xl text-verdex-ink">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-verdex-ink-3">{label}</div>
    </div>
  )
}
