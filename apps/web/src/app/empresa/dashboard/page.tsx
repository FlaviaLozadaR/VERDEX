"use client"

import { useEffect, useState } from "react"
import {
  DEMO_EMPRESA_ID,
  getDataSource,
  type EmpresaProfile,
  type MetricsPeriod,
  type EmpresaMetricsSummary,
  type EmpresaMonthPoint,
  type EmpresaRankingEntry,
} from "@verdex/shared"
import { Skeleton } from "@/components/Skeleton"

const ESG_LABELS: Record<EmpresaProfile["esgLevel"], string> = {
  bronce: "Bronce",
  plata: "Plata",
  oro: "Oro",
}

const PERIOD_LABELS: Record<MetricsPeriod, string> = {
  mes: "Este mes",
  trimestre: "Trimestre",
  anio: "Año",
}

export default function EmpresaDashboardPage() {
  const [period, setPeriod] = useState<MetricsPeriod>("mes")
  const [profile, setProfile] = useState<EmpresaProfile | null>(null)
  const [metrics, setMetrics] = useState<EmpresaMetricsSummary | null>(null)
  const [ranking, setRanking] = useState<EmpresaRankingEntry[]>([])
  const [monthly, setMonthly] = useState<EmpresaMonthPoint[]>([])

  useEffect(() => {
    const ds = getDataSource()
    ds.getEmpresaMetrics(DEMO_EMPRESA_ID, period).then(setMetrics)
    ds.getEmpresaRanking(DEMO_EMPRESA_ID, period).then(setRanking)
  }, [period])

  useEffect(() => {
    const ds = getDataSource()
    ds.getEmpresaMonthlyTrend(DEMO_EMPRESA_ID).then(setMonthly)
    ds.getEmpresaProfile(DEMO_EMPRESA_ID).then(setProfile)
  }, [])

  const maxMonth = Math.max(1, ...monthly.map((m) => m.kg))
  const maxRank = Math.max(1, ...ranking.map((r) => r.kg))

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">
        Hola, <em className="not-italic text-verdex-green">{profile?.companyName ?? "..."}</em>
      </h1>
      <p className="mt-1 text-verdex-ink-3">Así impacta tu marca a través de Verdex.</p>

      <div className="mt-6 flex gap-2">
        {(Object.keys(PERIOD_LABELS) as MetricsPeriod[]).map((key) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={
              "rounded-full px-4 py-1.5 font-mono text-xs transition " +
              (period === key
                ? "bg-verdex-green text-white"
                : "border border-verdex-rule text-verdex-ink-2 hover:border-verdex-green")
            }
          >
            {PERIOD_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[176px] rounded-3xl bg-gradient-to-br from-verdex-green to-verdex-green-deep p-7 text-white">
        {metrics ? (
          <div className="animate-fade-in-up">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-85">
              Material reciclado a través de tu marca
            </div>
            <div className="mt-1.5 font-serif text-5xl">
              {metrics.kgTotal.toLocaleString("es-BO")}
              <small className="ml-1 text-lg opacity-85">kg</small>
            </div>
            <div className="mt-1 font-mono text-xs text-verdex-green-bright">{metrics.kgDeltaLabel}</div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px]">
              Nivel ESG: {profile ? ESG_LABELS[profile.esgLevel] : "..."}
            </div>
          </div>
        ) : (
          <div className="flex animate-pulse flex-col gap-3">
            <div className="h-3 w-48 rounded bg-white/20" />
            <div className="h-10 w-40 rounded bg-white/20" />
            <div className="h-6 w-28 rounded-full bg-white/20" />
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-verdex-rule bg-verdex-paper p-5 md:grid-cols-4">
        {metrics ? (
          <>
            <Stat label="CO₂ evitado" value={metrics.co2Kg.toLocaleString("es-BO")} unit="kg" />
            <Stat label="Agua ahorrada" value={(metrics.aguaLitros / 1000).toFixed(1)} unit="m³" />
            <Stat label="Usuarios activos" value={String(metrics.usuariosActivos)} />
            <Stat label="Puntos de recolección" value={String(metrics.puntosRecoleccion)} />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-2 w-16" />
            </div>
          ))
        )}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Tendencia mensual</h2>
      <div className="mt-3 grid grid-cols-3 gap-2.5 rounded-2xl border border-verdex-rule bg-verdex-paper p-5 sm:grid-cols-6">
        {monthly.map(({ month, kg }) => (
          <div key={month} className="flex flex-col items-center">
            <div className="flex h-28 w-full items-end overflow-hidden rounded-md bg-verdex-bg-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-verdex-green to-verdex-green-bright transition-[height] duration-500 ease-out"
                style={{ height: `${(kg / maxMonth) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-verdex-ink-2">{kg}</div>
            <div className="font-mono text-[10px] uppercase text-verdex-ink-3">{month}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Ranking por sede</h2>
      <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {ranking.map((r, i) => (
          <div
            key={r.name}
            className="grid animate-fade-in-up grid-cols-[24px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-verdex-bg-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="text-center font-mono text-xs text-verdex-ink-3">{i + 1}</div>
            <div>
              <div className="text-sm text-verdex-ink">{r.name}</div>
              <div className="mt-1.5 h-1.5 rounded-full bg-verdex-bg-2">
                <div
                  className="h-full rounded-full bg-verdex-green transition-[width] duration-500 ease-out"
                  style={{ width: `${(r.kg / maxRank) * 100}%` }}
                />
              </div>
            </div>
            <div className="font-mono text-sm text-verdex-ink-2">{r.kg.toLocaleString("es-BO")} kg</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl text-verdex-ink">
        {value}
        {unit && <span className="ml-1 font-mono text-xs text-verdex-ink-3">{unit}</span>}
      </div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-verdex-ink-3">{label}</div>
    </div>
  )
}
