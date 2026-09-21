export interface FraudFlag {
  id: string
  depositId: string
  reason: string
  severity: 'baja' | 'media' | 'alta'
  status: 'pendiente' | 'revisado'
  createdAt: string
}

export type AdminLevel = 'super_admin' | 'ops' | 'soporte'

export interface AdminTeamMember {
  id: string
  name: string
  email: string
  level: AdminLevel
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  ts: number
}
