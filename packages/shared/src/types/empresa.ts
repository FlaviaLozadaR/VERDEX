export type PlanTier = 'starter' | 'crecimiento' | 'enterprise'
export type EsgLevel = 'bronce' | 'plata' | 'oro'
export type MetricsPeriod = 'mes' | 'trimestre' | 'anio'
export type EmpresaStatus = 'pendiente' | 'aprobada' | 'rechazada'

export interface EmpresaProfile {
  profileId: string
  companyName: string
  industry: string | null
  planTier: PlanTier
  esgLevel: EsgLevel
  /** Admin approval state — a new empresa registration starts `pendiente`. */
  status: EmpresaStatus
}

export interface Invoice {
  id: string
  empresaId: string
  period: string
  amountBs: number
  status: 'pagada' | 'pendiente'
}

export interface EmpresaAfiliado {
  id: string
  name: string
  kg: number
}

export interface EmpresaTeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'miembro'
}

export interface EmpresaMetricsSummary {
  period: MetricsPeriod
  kgTotal: number
  kgDeltaLabel: string
  co2Kg: number
  aguaLitros: number
  usuariosActivos: number
  puntosRecoleccion: number
}

export interface EmpresaMonthPoint {
  month: string
  kg: number
}

export interface EmpresaRankingEntry {
  name: string
  kg: number
}
