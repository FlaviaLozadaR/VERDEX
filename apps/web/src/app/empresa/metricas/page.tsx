"use client"

import { useEffect, useState } from "react"
import {
  DEMO_EMPRESA_ID,
  getDataSource,
  type EmpresaMetricsSummary,
  type EmpresaMonthPoint,
  type EmpresaRankingEntry,
  type MetricsPeriod,
} from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

const PERIOD_LABELS: Record<MetricsPeriod, string> = { mes: "Este mes", trimestre: "Trimestre", anio: "Año" }
const PERIODS = Object.keys(PERIOD_LABELS) as MetricsPeriod[]

export default function MetricasPage() {
  const [periodA, setPeriodA] = useState<MetricsPeriod>("mes")
  const [periodB, setPeriodB] = useState<MetricsPeriod>("trimestre")
  const [metricsA, setMetricsA] = useState<EmpresaMetricsSummary | null>(null)
  const [metricsB, setMetricsB] = useState<EmpresaMetricsSummary | null>(null)
  const [ranking, setRanking] = useState<EmpresaRankingEntry[]>([])
  const [monthly, setMonthly] = useState<EmpresaMonthPoint[]>([])

  useEffect(() => {
    getDataSource().getEmpresaMetrics(DEMO_EMPRESA_ID, periodA).then(setMetricsA)
  }, [periodA])

  useEffect(() => {
    getDataSource().getEmpresaMetrics(DEMO_EMPRESA_ID, periodB).then(setMetricsB)
  }, [periodB])

  useEffect(() => {
    const ds = getDataSource()
    ds.getEmpresaRanking(DEMO_EMPRESA_ID, "mes").then(setRanking)
    ds.getEmpresaMonthlyTrend(DEMO_EMPRESA_ID).then(setMonthly)
  }, [])

  function exportCsv() {
    const rows = [
      ["mes", "kg"],
      ...monthly.map((m) => [m.month, String(m.kg)]),
      [],
      ["sede", "kg"],
      ...ranking.map((r) => [r.name, String(r.kg)]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "verdex-metricas.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-verdex-ink">Métricas por periodo</h1>
          <p className="mt-1 text-verdex-ink-3">Comparación lado a lado y exportación para tu reporte.</p>
        </div>
        <button
          onClick={exportCsv}
          className="rounded-full border border-verdex-rule px-4 py-2 text-xs font-medium text-verdex-ink-2 transition-colors duration-150 hover:border-verdex-green hover:text-verdex-green-deep active:scale-95"
        >
          Exportar CSV
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <ComparisonCard period={periodA} onChange={setPeriodA} metrics={metricsA} />
        <ComparisonCard period={periodB} onChange={setPeriodB} metrics={metricsB} />
      </div>

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Ranking por sede (este mes)</h2>
      <div className="mt-3 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
        {ranking.length === 0 ? (
          <div className="p-4">
            <SkeletonLines count={4} />
          </div>
        ) : (
          ranking.map((r, i) => (
            <div
              key={r.name}
              className="flex animate-fade-in-up items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-verdex-ink">{r.name}</span>
              <span className="font-mono text-verdex-ink-2">{r.kg.toLocaleString("es-BO")} kg</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ComparisonCard({
  period,
  onChange,
  metrics,
}: {
  period: MetricsPeriod
  onChange: (p: MetricsPeriod) => void
  metrics: EmpresaMetricsSummary | null
}) {
  return (
    <div className="rounded-2xl border border-verdex-rule bg-verdex-paper p-5">
      <div className="flex gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={
              "rounded-full px-3 py-1 font-mono text-[11px] transition-colors duration-150 " +
              (period === p
                ? "bg-verdex-green text-white"
                : "border border-verdex-rule text-verdex-ink-2 hover:border-verdex-green")
            }
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
      {metrics ? (
        <div key={period} className="mt-4 animate-fade-in-up space-y-2 text-sm">
          <Row label="Kg totales" value={`${metrics.kgTotal.toLocaleString("es-BO")} kg`} />
          <Row label="CO₂ evitado" value={`${metrics.co2Kg.toLocaleString("es-BO")} kg`} />
          <Row label="Agua ahorrada" value={`${(metrics.aguaLitros / 1000).toFixed(1)} m³`} />
          <Row label="Usuarios activos" value={String(metrics.usuariosActivos)} />
          <Row label="Puntos de recolección" value={String(metrics.puntosRecoleccion)} />
        </div>
      ) : (
        <div className="mt-4">
          <SkeletonLines count={5} />
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-verdex-rule pt-2 first:border-t-0 first:pt-0">
      <span className="text-verdex-ink-3">{label}</span>
      <span className="font-mono text-verdex-ink">{value}</span>
    </div>
  )
}
