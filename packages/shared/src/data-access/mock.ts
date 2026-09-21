import { MATERIALS } from '../data/materials'
import { REWARDS } from '../data/rewards'
import { COLLECTION_POINTS } from '../data/collectionPoints'
import {
  EMPRESA_AFILIADOS_BASE,
  EMPRESA_INVOICES,
  EMPRESA_PERIOD_METRICS,
  EMPRESA_MONTHLY_TREND,
  EMPRESA_PROFILE,
  EMPRESA_RANKING_BASE,
} from '../data/empresaDemo'
import type { EmpresaProfile, EmpresaTeamMember, MetricsPeriod } from '../types/empresa'
import type { Deposit, MaterialId } from '../types/deposit'
import type { CollectionPoint, Payout, RecicladorProfile } from '../types/reciclador'
import type { Redemption, Reward } from '../types/reward'
import type { Txn, UsuarioAccount } from '../types/usuario'
import type { AdminTeamMember, AuditLogEntry, FraudFlag } from '../types/admin'
import type { CreateDepositInput, DepositCorrection, PendingPayoutEntry, VerdexDataSource } from './types'

// Same "scale the demo ranking by period" logic that used to live duplicated
// inside the Empresa dashboard component — centralized here so every
// consumer (web today, mobile later) gets identical numbers.
const RANK_SCALE: Record<MetricsPeriod, number> = { mes: 1, trimestre: 2.6, anio: 10.1 }

// Single source of truth for the demo identities used until Supabase Auth is
// wired — shared across mobile and web.
export const DEMO_USUARIO_ID = 'demo-usuario'
export const DEMO_RECICLADOR_ID = 'demo-reciclador'
export const DEMO_EMPRESA_ID = 'demo-empresa'

// --- id sequences ---
let depositSeq = 0
function nextDepositId() {
  depositSeq += 1
  return `dep-${depositSeq}`
}

let redemptionSeq = 0
function nextRedemptionCode() {
  redemptionSeq += 1
  return `VDX-${String(redemptionSeq).padStart(4, '0')}`
}

let empresaTeamSeq = 0
function nextEmpresaTeamId() {
  empresaTeamSeq += 1
  return `emt-${empresaTeamSeq}`
}

let rewardSeq = REWARDS.length
function nextRewardId() {
  rewardSeq += 1
  return `r${rewardSeq}`
}

let fraudFlagSeq = 0
function nextFraudFlagId() {
  fraudFlagSeq += 1
  return `flag-${fraudFlagSeq}`
}

let adminTeamSeq = 0
function nextAdminTeamId() {
  adminTeamSeq += 1
  return `adm-${adminTeamSeq}`
}

let auditSeq = 0
function nextAuditId() {
  auditSeq += 1
  return `log-${auditSeq}`
}

let payoutSeq = 2
function nextPayoutId() {
  payoutSeq += 1
  return `pay-${payoutSeq}`
}

// --- mutable in-memory state ---
// Everything below is in-memory only — resets on reload. That's fine for the
// mock: every role (usuario, reciclador, empresa, admin) runs in the same
// app/session, so a mutation from one panel is immediately visible to another
// without needing persistence.

let collectionPoints: CollectionPoint[] = [...COLLECTION_POINTS]

let deposits: Deposit[] = [
  {
    id: nextDepositId(),
    usuarioId: 'demo-usuario-2',
    collectionPointId: 'p1',
    material: 'pet',
    kg: 0.04 * 6,
    pointsAwarded: 50 * 6,
    status: 'pendiente',
    validatedByRecicladorId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: nextDepositId(),
    usuarioId: 'demo-usuario-3',
    collectionPointId: 'p3',
    material: 'cart',
    kg: 2.3,
    pointsAwarded: Math.round(80 * 2.3),
    status: 'pendiente',
    validatedByRecicladorId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
]

let redemptions: Redemption[] = []

let rewards: Reward[] = [...REWARDS]

let recicladorProfiles: RecicladorProfile[] = [
  { profileId: DEMO_RECICLADOR_ID, operatorName: 'Carlos Mamani', zone: 'UPSA · Equipetrol', payoutRateBsKg: 2, status: 'aprobado' },
  { profileId: 'reciclador-2', operatorName: 'Rosa Quispe', zone: 'Segundo anillo', payoutRateBsKg: 1.8, status: 'pendiente' },
]

// Closed, already-paid periods — the current period's kg/Bs are computed live
// from validated deposits (minus whatever's already in `paidOutKg`) instead of
// being seeded.
let payouts: Payout[] = [
  { id: 'pay-1', recicladorId: DEMO_RECICLADOR_ID, period: '2026-06', kgTotal: 182.4, amountBs: 364.8, status: 'pagado' },
  { id: 'pay-2', recicladorId: DEMO_RECICLADOR_ID, period: '2026-07', kgTotal: 210.1, amountBs: 420.2, status: 'pagado' },
]

let paidOutKg: Record<string, number> = {}

let empresaProfiles: EmpresaProfile[] = [
  EMPRESA_PROFILE,
  {
    profileId: 'empresa-2',
    companyName: 'Fábrica Boliviana de Textiles',
    industry: 'Manufactura',
    planTier: 'starter',
    esgLevel: 'bronce',
    status: 'pendiente',
  },
  {
    profileId: 'empresa-3',
    companyName: 'Café Origen',
    industry: 'Gastronomía',
    planTier: 'starter',
    esgLevel: 'bronce',
    status: 'pendiente',
  },
  {
    profileId: 'empresa-4',
    companyName: 'Constructora Andina',
    industry: 'Construcción',
    planTier: 'starter',
    esgLevel: 'bronce',
    status: 'rechazada',
  },
]

let empresaTeam: EmpresaTeamMember[] = [
  { id: nextEmpresaTeamId(), name: 'Andrea Rojas', email: 'andrea.rojas@nortex.com.bo', role: 'admin' },
]

let usuarioAccounts: UsuarioAccount[] = [
  { id: DEMO_USUARIO_ID, name: 'Demo Verdex', email: 'demo@verdex.app', status: 'activo' },
  { id: 'demo-usuario-2', name: 'Valeria Antelo', email: 'valeria.antelo@upsa.edu.bo', status: 'activo' },
  { id: 'demo-usuario-3', name: 'Renato Justiniano', email: 'renato.justiniano@upsa.edu.bo', status: 'activo' },
]

let fraudFlags: FraudFlag[] = [
  {
    id: nextFraudFlagId(),
    depositId: 'dep-2',
    reason: 'Cartón: 2.3 kg en un solo depósito — más del doble del promedio del punto.',
    severity: 'media',
    status: 'pendiente',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
]

let adminTeam: AdminTeamMember[] = [
  { id: nextAdminTeamId(), name: 'Flavia Lozada', email: 'flavialozadar@gmail.com', level: 'super_admin' },
  { id: nextAdminTeamId(), name: 'Andrés Melgar', email: 'andres@verdex.app', level: 'super_admin' },
]

let auditLog: AuditLogEntry[] = []

function currentAdminActor() {
  return adminTeam[0]?.name ?? 'Admin'
}

function logAction(action: string) {
  auditLog = [{ id: nextAuditId(), actor: currentAdminActor(), action, ts: Date.now() }, ...auditLog]
}

// --- lookups ---
function materialOrThrow(id: MaterialId) {
  const material = MATERIALS.find((m) => m.id === id)
  if (!material) throw new Error(`Unknown material: ${id}`)
  return material
}

function depositOrThrow(id: string) {
  const deposit = deposits.find((d) => d.id === id)
  if (!deposit) throw new Error(`Unknown deposit: ${id}`)
  return deposit
}

function rewardOrThrow(id: string) {
  const reward = rewards.find((r) => r.id === id)
  if (!reward) throw new Error(`Unknown reward: ${id}`)
  return reward
}

function empresaProfileOrThrow(empresaId: string) {
  const profile = empresaProfiles.find((e) => e.profileId === empresaId)
  if (!profile) throw new Error(`Unknown empresa: ${empresaId}`)
  return profile
}

function recicladorProfileOrThrow(recicladorId: string) {
  const profile = recicladorProfiles.find((r) => r.profileId === recicladorId)
  if (!profile) throw new Error(`Unknown reciclador: ${recicladorId}`)
  return profile
}

function usuarioAccountOrThrow(usuarioId: string) {
  const account = usuarioAccounts.find((u) => u.id === usuarioId)
  if (!account) throw new Error(`Unknown usuario: ${usuarioId}`)
  return account
}

function pointOrThrow(pointId: string) {
  const point = collectionPoints.find((p) => p.id === pointId)
  if (!point) throw new Error(`Unknown collection point: ${pointId}`)
  return point
}

function fraudFlagOrThrow(flagId: string) {
  const flag = fraudFlags.find((f) => f.id === flagId)
  if (!flag) throw new Error(`Unknown fraud flag: ${flagId}`)
  return flag
}

function computePendingPayout(recicladorId: string): PendingPayoutEntry {
  const profile = recicladorProfileOrThrow(recicladorId)
  const validatedKg = deposits
    .filter((d) => d.validatedByRecicladorId === recicladorId && d.status === 'validado')
    .reduce((sum, d) => sum + d.kg, 0)
  const kgTotal = Math.max(0, validatedKg - (paidOutKg[recicladorId] ?? 0))
  return {
    recicladorId,
    operatorName: profile.operatorName,
    kgTotal,
    amountBs: Math.round(kgTotal * profile.payoutRateBsKg * 100) / 100,
  }
}

// A deposit far outside what one person would realistically drop off in a
// single visit gets flagged for admin review — same idea as the "picos de
// actividad anómalos" the Fraude stub described, just triggered live instead
// of only from seed data.
function maybeFlagFraud(deposit: Deposit) {
  const material = materialOrThrow(deposit.material)
  const unitsEquivalent = deposit.kg / material.kgPerUnit
  if (deposit.kg <= 15 && unitsEquivalent <= 100) return
  fraudFlags = [
    {
      id: nextFraudFlagId(),
      depositId: deposit.id,
      reason: `Peso reportado (${deposit.kg.toFixed(1)} kg) muy por encima de lo típico para un depósito individual.`,
      severity: 'alta',
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    },
    ...fraudFlags,
  ]
}

export const mockDataSource: VerdexDataSource = {
  async getEmpresaMetrics(_empresaId, period) {
    return EMPRESA_PERIOD_METRICS[period]
  },

  async getEmpresaMonthlyTrend(_empresaId) {
    return EMPRESA_MONTHLY_TREND
  },

  async getEmpresaRanking(_empresaId, period) {
    const scale = RANK_SCALE[period]
    return [...EMPRESA_RANKING_BASE]
      .map((r) => ({ ...r, kg: Math.round(r.kg * scale) }))
      .sort((a, b) => b.kg - a.kg)
  },

  async getEmpresaProfile(empresaId) {
    return empresaProfileOrThrow(empresaId)
  },

  async listInvoices(empresaId) {
    empresaProfileOrThrow(empresaId)
    return [...EMPRESA_INVOICES].sort((a, b) => b.period.localeCompare(a.period))
  },

  async listEmpresaAfiliados(empresaId) {
    empresaProfileOrThrow(empresaId)
    return [...EMPRESA_AFILIADOS_BASE].sort((a, b) => b.kg - a.kg)
  },

  async listEmpresaTeam(empresaId) {
    empresaProfileOrThrow(empresaId)
    return empresaTeam
  },

  async inviteEmpresaTeamMember(empresaId, { name, email }) {
    empresaProfileOrThrow(empresaId)
    const member: EmpresaTeamMember = { id: nextEmpresaTeamId(), name, email, role: 'miembro' }
    empresaTeam = [...empresaTeam, member]
    return member
  },

  async removeEmpresaTeamMember(empresaId, memberId) {
    empresaProfileOrThrow(empresaId)
    empresaTeam = empresaTeam.filter((m) => m.id !== memberId)
  },

  async listRewards() {
    return rewards.filter((r) => r.status === 'activo')
  },

  async listCollectionPoints() {
    return collectionPoints
  },

  async listMaterials() {
    return MATERIALS
  },

  async getUsuarioSummary(usuarioId) {
    // Same seed used by the old app's "Explorar con demo", plus whatever this
    // usuario has gotten validated since — pendiente deposits don't count yet,
    // which is the whole point of the reciclador role (Parte 3). `totalEarned`
    // is lifetime (never shrinks); `points` is the spendable balance, so it
    // drops when a reward is redeemed.
    const seed = { points: 3840, totalEarned: 4150, kg: 14.6 }
    const validated = deposits.filter((d) => d.usuarioId === usuarioId && d.status === 'validado')
    const earnedPts = validated.reduce((sum, d) => sum + d.pointsAwarded, 0)
    const earnedKg = validated.reduce((sum, d) => sum + d.kg, 0)
    const spentPts = redemptions
      .filter((r) => r.usuarioId === usuarioId)
      .reduce((sum, r) => sum + rewardOrThrow(r.rewardId).pts, 0)
    return {
      points: seed.points + earnedPts - spentPts,
      totalEarned: seed.totalEarned + earnedPts,
      kg: seed.kg + earnedKg,
    }
  },

  async createDeposit({ usuarioId, collectionPointId, material, qty }: CreateDepositInput) {
    const m = materialOrThrow(material)
    const deposit: Deposit = {
      id: nextDepositId(),
      usuarioId,
      collectionPointId,
      material,
      kg: qty * m.kgPerUnit,
      pointsAwarded: Math.round(qty * m.ptsPerUnit),
      status: 'pendiente',
      validatedByRecicladorId: null,
      createdAt: new Date().toISOString(),
    }
    deposits = [deposit, ...deposits]
    maybeFlagFraud(deposit)
    return deposit
  },

  async listPendingDepositsForReciclador(recicladorId) {
    const myPointIds = new Set(collectionPoints.filter((p) => p.recicladorId === recicladorId).map((p) => p.id))
    return deposits
      .filter((d) => d.status === 'pendiente' && myPointIds.has(d.collectionPointId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async validateDeposit(depositId, recicladorId, correction?: DepositCorrection) {
    const deposit = depositOrThrow(depositId)
    const material = correction?.material ?? deposit.material
    const qty = correction ? (correction.qty ?? deposit.kg / materialOrThrow(deposit.material).kgPerUnit) : null
    const m = materialOrThrow(material)
    const updated: Deposit = {
      ...deposit,
      material,
      kg: qty !== null ? qty * m.kgPerUnit : deposit.kg,
      pointsAwarded: qty !== null ? Math.round(qty * m.ptsPerUnit) : deposit.pointsAwarded,
      status: 'validado',
      validatedByRecicladorId: recicladorId,
    }
    deposits = deposits.map((d) => (d.id === depositId ? updated : d))
    return updated
  },

  async rejectDeposit(depositId, recicladorId) {
    const deposit = depositOrThrow(depositId)
    const updated: Deposit = { ...deposit, status: 'rechazado', validatedByRecicladorId: recicladorId }
    deposits = deposits.map((d) => (d.id === depositId ? updated : d))
    return updated
  },

  async redeemReward(usuarioId, rewardId) {
    const reward = rewardOrThrow(rewardId)
    const summary = await mockDataSource.getUsuarioSummary(usuarioId)
    if (summary.points < reward.pts) {
      throw new Error('No tenés suficientes puntos para este canje.')
    }
    const redemption: Redemption = {
      id: `red-${redemptions.length + 1}`,
      usuarioId,
      rewardId,
      code: nextRedemptionCode(),
      status: 'pendiente',
      redeemedAt: Date.now(),
    }
    redemptions = [redemption, ...redemptions]
    return redemption
  },

  async listRedemptions(usuarioId) {
    return redemptions.filter((r) => r.usuarioId === usuarioId).sort((a, b) => b.redeemedAt - a.redeemedAt)
  },

  async listUsuarioActivity(usuarioId) {
    const depositTxns: Txn[] = deposits
      .filter((d) => d.usuarioId === usuarioId)
      .map((d) => {
        const material = materialOrThrow(d.material)
        const point = collectionPoints.find((p) => p.id === d.collectionPointId)
        return {
          id: `dep-${d.id}`,
          type: 'deposit',
          label: material.nm,
          sub: `${point?.name ?? d.collectionPointId} · ${d.status}`,
          pts: d.pointsAwarded,
          ic: material.ic,
          ts: new Date(d.createdAt).getTime(),
        }
      })
    const redeemTxns: Txn[] = redemptions
      .filter((r) => r.usuarioId === usuarioId)
      .map((r) => {
        const reward = rewardOrThrow(r.rewardId)
        return {
          id: `red-${r.id}`,
          type: 'redeem',
          label: reward.nm,
          sub: r.code,
          pts: -reward.pts,
          ic: reward.ic,
          ts: r.redeemedAt,
        }
      })
    return [...depositTxns, ...redeemTxns].sort((a, b) => b.ts - a.ts)
  },

  async getRecicladorProfile(recicladorId) {
    return recicladorProfileOrThrow(recicladorId)
  },

  async listPayouts(recicladorId) {
    return payouts.filter((p) => p.recicladorId === recicladorId).sort((a, b) => b.period.localeCompare(a.period))
  },

  async getRecicladorPendingPayout(recicladorId) {
    const { kgTotal, amountBs } = computePendingPayout(recicladorId)
    return { kgTotal, amountBs }
  },

  async getNetworkImpact() {
    // Same conversion factors already used across the app (co2 = kg*0.5, agua =
    // kg*15 — see EMPRESA_PERIOD_METRICS) applied to the whole network, plus a
    // baseline seed on top of which live validated deposits accumulate.
    const seed = { kgTotal: 18400, usuariosActivos: 640 }
    const validatedKg = deposits.filter((d) => d.status === 'validado').reduce((sum, d) => sum + d.kg, 0)
    const kgTotal = seed.kgTotal + validatedKg
    return {
      kgTotal,
      co2Kg: kgTotal * 0.5,
      aguaLitros: kgTotal * 15,
      usuariosActivos: seed.usuariosActivos,
      empresasActivas: empresaProfiles.filter((e) => e.status === 'aprobada').length,
      recicladoresActivos: recicladorProfiles.filter((r) => r.status === 'aprobado').length,
      puntosRecoleccion: collectionPoints.length,
    }
  },

  // --- Admin ---
  async listUsuarios() {
    return usuarioAccounts
  },

  async suspendUsuario(usuarioId) {
    const account = usuarioAccountOrThrow(usuarioId)
    const updated: UsuarioAccount = { ...account, status: 'suspendido' }
    usuarioAccounts = usuarioAccounts.map((u) => (u.id === usuarioId ? updated : u))
    logAction(`Suspendió la cuenta de ${account.name}`)
    return updated
  },

  async reactivateUsuario(usuarioId) {
    const account = usuarioAccountOrThrow(usuarioId)
    const updated: UsuarioAccount = { ...account, status: 'activo' }
    usuarioAccounts = usuarioAccounts.map((u) => (u.id === usuarioId ? updated : u))
    logAction(`Reactivó la cuenta de ${account.name}`)
    return updated
  },

  async listEmpresas() {
    return empresaProfiles
  },

  async approveEmpresa(empresaId) {
    const profile = empresaProfileOrThrow(empresaId)
    const updated: EmpresaProfile = { ...profile, status: 'aprobada' }
    empresaProfiles = empresaProfiles.map((e) => (e.profileId === empresaId ? updated : e))
    logAction(`Aprobó la empresa ${profile.companyName}`)
    return updated
  },

  async rejectEmpresa(empresaId) {
    const profile = empresaProfileOrThrow(empresaId)
    const updated: EmpresaProfile = { ...profile, status: 'rechazada' }
    empresaProfiles = empresaProfiles.map((e) => (e.profileId === empresaId ? updated : e))
    logAction(`Rechazó la empresa ${profile.companyName}`)
    return updated
  },

  async setEmpresaPlan(empresaId, planTier) {
    const profile = empresaProfileOrThrow(empresaId)
    const updated: EmpresaProfile = { ...profile, planTier }
    empresaProfiles = empresaProfiles.map((e) => (e.profileId === empresaId ? updated : e))
    logAction(`Cambió el plan de ${profile.companyName} a ${planTier}`)
    return updated
  },

  async listRecicladores() {
    return recicladorProfiles
  },

  async approveReciclador(recicladorId) {
    const profile = recicladorProfileOrThrow(recicladorId)
    const updated: RecicladorProfile = { ...profile, status: 'aprobado' }
    recicladorProfiles = recicladorProfiles.map((r) => (r.profileId === recicladorId ? updated : r))
    logAction(`Aprobó al reciclador ${profile.operatorName}`)
    return updated
  },

  async assignRecicladorZone(recicladorId, pointId) {
    const profile = recicladorProfileOrThrow(recicladorId)
    const point = pointOrThrow(pointId)
    const updated: CollectionPoint = { ...point, recicladorId }
    collectionPoints = collectionPoints.map((p) => (p.id === pointId ? updated : p))
    logAction(`Asignó el punto ${point.name} a ${profile.operatorName}`)
    return updated
  },

  async listAllRewards() {
    return rewards
  },

  async createReward(input) {
    const reward: Reward = { id: nextRewardId(), status: 'activo', ...input }
    rewards = [reward, ...rewards]
    logAction(`Creó la recompensa ${reward.nm}`)
    return reward
  },

  async updateReward(rewardId, patch) {
    const reward = rewardOrThrow(rewardId)
    const updated: Reward = { ...reward, ...patch }
    rewards = rewards.map((r) => (r.id === rewardId ? updated : r))
    logAction(`Editó la recompensa ${updated.nm}`)
    return updated
  },

  async pauseReward(rewardId) {
    const reward = rewardOrThrow(rewardId)
    const updated: Reward = { ...reward, status: 'pausado' }
    rewards = rewards.map((r) => (r.id === rewardId ? updated : r))
    logAction(`Pausó la recompensa ${reward.nm}`)
    return updated
  },

  async activateReward(rewardId) {
    const reward = rewardOrThrow(rewardId)
    const updated: Reward = { ...reward, status: 'activo' }
    rewards = rewards.map((r) => (r.id === rewardId ? updated : r))
    logAction(`Reactivó la recompensa ${reward.nm}`)
    return updated
  },

  async listAllRedemptions() {
    return [...redemptions].sort((a, b) => b.redeemedAt - a.redeemedAt)
  },

  async listAllPendingPayouts() {
    return recicladorProfiles.map((p) => computePendingPayout(p.profileId))
  },

  async closePayout(recicladorId) {
    const pending = computePendingPayout(recicladorId)
    paidOutKg[recicladorId] = (paidOutKg[recicladorId] ?? 0) + pending.kgTotal
    const payout: Payout = {
      id: nextPayoutId(),
      recicladorId,
      period: new Date().toISOString().slice(0, 7),
      kgTotal: pending.kgTotal,
      amountBs: pending.amountBs,
      status: 'pagado',
    }
    payouts = [payout, ...payouts]
    logAction(`Cerró el pago de ${pending.operatorName} (Bs ${pending.amountBs.toLocaleString('es-BO')})`)
    return payout
  },

  async listDeposits() {
    return deposits
  },

  async listFraudFlags() {
    return [...fraudFlags].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async resolveFraudFlag(flagId) {
    const flag = fraudFlagOrThrow(flagId)
    const updated: FraudFlag = { ...flag, status: 'revisado' }
    fraudFlags = fraudFlags.map((f) => (f.id === flagId ? updated : f))
    logAction(`Marcó como revisada la alerta de fraude ${flagId}`)
    return updated
  },

  async listAdminTeam() {
    return adminTeam
  },

  async inviteAdminTeamMember({ name, email, level }) {
    const member: AdminTeamMember = { id: nextAdminTeamId(), name, email, level }
    adminTeam = [...adminTeam, member]
    logAction(`Invitó a ${name} al equipo (${level})`)
    return member
  },

  async removeAdminTeamMember(memberId) {
    const member = adminTeam.find((m) => m.id === memberId)
    adminTeam = adminTeam.filter((m) => m.id !== memberId)
    if (member) logAction(`Quitó a ${member.name} del equipo`)
  },

  async listAuditLog() {
    return auditLog
  },
}
