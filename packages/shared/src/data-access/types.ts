import type { Deposit, Material, MaterialId } from '../types/deposit'
import type { CollectionPoint, Payout, RecicladorProfile } from '../types/reciclador'
import type { Redemption, Reward } from '../types/reward'
import type { Txn, UsuarioAccount } from '../types/usuario'
import type { AdminLevel, AdminTeamMember, AuditLogEntry, FraudFlag } from '../types/admin'
import type {
  EmpresaAfiliado,
  EmpresaMetricsSummary,
  EmpresaMonthPoint,
  EmpresaProfile,
  EmpresaRankingEntry,
  EmpresaTeamMember,
  Invoice,
  MetricsPeriod,
  PlanTier,
} from '../types/empresa'

export interface UsuarioSummary {
  points: number
  totalEarned: number
  kg: number
}

export interface NetworkImpact {
  kgTotal: number
  co2Kg: number
  aguaLitros: number
  usuariosActivos: number
  empresasActivas: number
  recicladoresActivos: number
  puntosRecoleccion: number
}

export interface CreateDepositInput {
  usuarioId: string
  collectionPointId: string
  material: MaterialId
  /** Units for per-unit materials (bottles, cans), or kg directly for "por kg" materials. */
  qty: number
}

export interface DepositCorrection {
  material?: MaterialId
  qty?: number
}

export interface CreateRewardInput {
  nm: string
  partner: string
  cat: string
  pts: number
  ic: string
  color: string
}

export interface PendingPayoutEntry {
  recicladorId: string
  operatorName: string
  kgTotal: number
  amountBs: number
}

/**
 * Every screen reads through this interface instead of importing hardcoded
 * data directly. Swapping `mockDataSource` for a real Supabase-backed one
 * (via `setDataSource`) changes nothing on the calling side — every method
 * is already async, matching what a real network call will look like.
 */
export interface VerdexDataSource {
  getEmpresaMetrics(empresaId: string, period: MetricsPeriod): Promise<EmpresaMetricsSummary>
  getEmpresaMonthlyTrend(empresaId: string): Promise<EmpresaMonthPoint[]>
  getEmpresaRanking(empresaId: string, period: MetricsPeriod): Promise<EmpresaRankingEntry[]>
  getEmpresaProfile(empresaId: string): Promise<EmpresaProfile>
  listInvoices(empresaId: string): Promise<Invoice[]>
  listEmpresaAfiliados(empresaId: string): Promise<EmpresaAfiliado[]>
  listEmpresaTeam(empresaId: string): Promise<EmpresaTeamMember[]>
  inviteEmpresaTeamMember(empresaId: string, input: { name: string; email: string }): Promise<EmpresaTeamMember>
  removeEmpresaTeamMember(empresaId: string, memberId: string): Promise<void>
  listRewards(): Promise<Reward[]>
  listCollectionPoints(): Promise<CollectionPoint[]>
  listMaterials(): Promise<Material[]>
  getUsuarioSummary(usuarioId: string): Promise<UsuarioSummary>

  /** Creates a deposit in `pendiente` status — a reciclador must validate it in the field. */
  createDeposit(input: CreateDepositInput): Promise<Deposit>
  /** Deposits still `pendiente` at collection points assigned to this reciclador. */
  listPendingDepositsForReciclador(recicladorId: string): Promise<Deposit[]>
  validateDeposit(depositId: string, recicladorId: string, correction?: DepositCorrection): Promise<Deposit>
  rejectDeposit(depositId: string, recicladorId: string): Promise<Deposit>

  /** Spends points on a reward; rejects if the usuario doesn't have enough balance. */
  redeemReward(usuarioId: string, rewardId: string): Promise<Redemption>
  listRedemptions(usuarioId: string): Promise<Redemption[]>
  /** Unified activity feed (deposits + redemptions) for the usuario's Perfil screen. */
  listUsuarioActivity(usuarioId: string): Promise<Txn[]>

  getRecicladorProfile(recicladorId: string): Promise<RecicladorProfile>
  listPayouts(recicladorId: string): Promise<Payout[]>
  /** Kg/Bs validated by this reciclador since the last closed payout. */
  getRecicladorPendingPayout(recicladorId: string): Promise<{ kgTotal: number; amountBs: number }>

  /** Aggregate impact across the whole network — public Impacto page + Admin overview. */
  getNetworkImpact(): Promise<NetworkImpact>

  // --- Admin ---
  listUsuarios(): Promise<UsuarioAccount[]>
  suspendUsuario(usuarioId: string): Promise<UsuarioAccount>
  reactivateUsuario(usuarioId: string): Promise<UsuarioAccount>

  listEmpresas(): Promise<EmpresaProfile[]>
  approveEmpresa(empresaId: string): Promise<EmpresaProfile>
  rejectEmpresa(empresaId: string): Promise<EmpresaProfile>
  setEmpresaPlan(empresaId: string, planTier: PlanTier): Promise<EmpresaProfile>

  listRecicladores(): Promise<RecicladorProfile[]>
  approveReciclador(recicladorId: string): Promise<RecicladorProfile>
  assignRecicladorZone(recicladorId: string, pointId: string): Promise<CollectionPoint>

  /** Admin view of the rewards catalog — includes `pausado` rewards too. */
  listAllRewards(): Promise<Reward[]>
  createReward(input: CreateRewardInput): Promise<Reward>
  updateReward(rewardId: string, patch: Partial<CreateRewardInput>): Promise<Reward>
  pauseReward(rewardId: string): Promise<Reward>
  activateReward(rewardId: string): Promise<Reward>
  /** All redemptions across every usuario — admin view of "canjes por recompensa". */
  listAllRedemptions(): Promise<Redemption[]>

  listAllPendingPayouts(): Promise<PendingPayoutEntry[]>
  /** Closes the current period for this reciclador: turns the live pending amount into a `pagado` Payout. */
  closePayout(recicladorId: string): Promise<Payout>

  /** Every deposit network-wide — admin visibility (e.g. resolving a fraud flag back to its usuario). */
  listDeposits(): Promise<Deposit[]>
  listFraudFlags(): Promise<FraudFlag[]>
  resolveFraudFlag(flagId: string): Promise<FraudFlag>

  listAdminTeam(): Promise<AdminTeamMember[]>
  inviteAdminTeamMember(input: { name: string; email: string; level: AdminLevel }): Promise<AdminTeamMember>
  removeAdminTeamMember(memberId: string): Promise<void>
  listAuditLog(): Promise<AuditLogEntry[]>
}
