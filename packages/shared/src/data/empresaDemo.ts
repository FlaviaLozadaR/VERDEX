import type {
  EmpresaAfiliado,
  EmpresaMetricsSummary,
  EmpresaMonthPoint,
  EmpresaProfile,
  EmpresaRankingEntry,
  Invoice,
  MetricsPeriod,
} from '../types/empresa'

/** Hardcoded demo dataset — mirrors the numbers used in the Verdex pitch deck. Swap for real queries once Supabase is wired. */
export const EMPRESA_PERIOD_METRICS: Record<MetricsPeriod, EmpresaMetricsSummary> = {
  mes: {
    period: 'mes',
    kgTotal: 1240,
    kgDeltaLabel: '+12% vs. mes anterior',
    co2Kg: 620,
    aguaLitros: 18600,
    usuariosActivos: 348,
    puntosRecoleccion: 6,
  },
  trimestre: {
    period: 'trimestre',
    kgTotal: 3260,
    kgDeltaLabel: '+28% vs. trimestre anterior',
    co2Kg: 1630,
    aguaLitros: 48900,
    usuariosActivos: 412,
    puntosRecoleccion: 7,
  },
  anio: {
    period: 'anio',
    kgTotal: 12480,
    kgDeltaLabel: '+41% vs. año anterior',
    co2Kg: 6240,
    aguaLitros: 187200,
    usuariosActivos: 512,
    puntosRecoleccion: 9,
  },
}

export const EMPRESA_MONTHLY_TREND: EmpresaMonthPoint[] = [
  { month: 'Feb', kg: 780 },
  { month: 'Mar', kg: 860 },
  { month: 'Abr', kg: 910 },
  { month: 'May', kg: 990 },
  { month: 'Jun', kg: 1080 },
  { month: 'Jul', kg: 1240 },
]

export const EMPRESA_RANKING_BASE: EmpresaRankingEntry[] = [
  { name: 'UPSA · Campus Norte', kg: 410 },
  { name: 'Hipermaxi Equipetrol', kg: 305 },
  { name: 'Plaza Blacutt', kg: 265 },
  { name: 'Torre Empresarial', kg: 260 },
]

export const EMPRESA_PROFILE: EmpresaProfile = {
  profileId: 'demo-empresa',
  companyName: 'Grupo Nortex S.A.',
  industry: 'Retail',
  planTier: 'crecimiento',
  esgLevel: 'oro',
  status: 'aprobada',
}

export const EMPRESA_INVOICES: Invoice[] = [
  { id: 'inv-1', empresaId: 'demo-empresa', period: '2026-06', amountBs: 890, status: 'pagada' },
  { id: 'inv-2', empresaId: 'demo-empresa', period: '2026-07', amountBs: 890, status: 'pagada' },
  { id: 'inv-3', empresaId: 'demo-empresa', period: '2026-08', amountBs: 890, status: 'pendiente' },
]

export const EMPRESA_AFILIADOS_BASE: EmpresaAfiliado[] = [
  { id: 'af-1', name: 'Lucía Fernández', kg: 24.6 },
  { id: 'af-2', name: 'Marco Suárez', kg: 18.1 },
  { id: 'af-3', name: 'Daniela Roca', kg: 15.4 },
  { id: 'af-4', name: 'Iván Céspedes', kg: 9.8 },
]
