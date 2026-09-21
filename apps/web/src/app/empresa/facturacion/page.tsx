"use client"

import { useEffect, useState } from "react"
import { DEMO_EMPRESA_ID, getDataSource, type EmpresaProfile, type Invoice } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

const PLAN_LABELS: Record<EmpresaProfile["planTier"], string> = {
  starter: "Starter",
  crecimiento: "Crecimiento",
  enterprise: "Enterprise",
}

export default function FacturacionPage() {
  const [profile, setProfile] = useState<EmpresaProfile | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const ds = getDataSource()
    ds.getEmpresaProfile(DEMO_EMPRESA_ID).then(setProfile)
    ds.listInvoices(DEMO_EMPRESA_ID).then(setInvoices)
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Suscripción y facturación</h1>
      <p className="mt-1 text-verdex-ink-3">Tu plan actual, historial de pagos y método de pago.</p>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-verdex-green to-verdex-green-deep p-6 text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-85">Plan actual</div>
        {profile ? (
          <div className="animate-fade-in-up">
            <div className="mt-1.5 font-serif text-3xl">{PLAN_LABELS[profile.planTier]}</div>
            <div className="mt-2 text-sm opacity-90">Próxima renovación: 1 de septiembre de 2026</div>
          </div>
        ) : (
          <div className="mt-2 h-11 w-32 animate-pulse rounded bg-white/20" />
        )}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Historial de facturas</h2>
      <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {invoices.length === 0 ? (
          <div className="p-4">
            <SkeletonLines count={3} />
          </div>
        ) : (
          invoices.map((inv, i) => (
            <div
              key={inv.id}
              className="flex animate-fade-in-up items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-verdex-ink">{inv.period}</span>
              <span className="font-mono text-verdex-ink-2">Bs {inv.amountBs.toLocaleString("es-BO")}</span>
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                  inv.status === "pagada"
                    ? "bg-verdex-green-soft text-verdex-green-deep"
                    : "bg-verdex-amber-soft text-verdex-amber-deep"
                }`}
              >
                {inv.status}
              </span>
            </div>
          ))
        )}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Método de pago</h2>
      <div className="mt-3 rounded-2xl border border-verdex-rule bg-verdex-paper p-5">
        <p className="text-sm text-verdex-ink-3">
          Todavía no hay una pasarela de pago conectada — cuando exista, el método de pago se
          gestiona desde acá.
        </p>
        <button
          disabled
          className="mt-4 rounded-full border border-verdex-rule px-4 py-2 text-xs font-medium text-verdex-ink-2 transition-colors disabled:opacity-50"
        >
          Agregar método de pago
        </button>
      </div>
    </div>
  )
}
