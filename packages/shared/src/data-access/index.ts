import { mockDataSource } from './mock'
import type { VerdexDataSource } from './types'

export { DEMO_USUARIO_ID, DEMO_RECICLADOR_ID, DEMO_EMPRESA_ID } from './mock'

let current: VerdexDataSource = mockDataSource

export function getDataSource(): VerdexDataSource {
  return current
}

/**
 * Called once at app startup to swap in a real implementation (e.g. a
 * SupabaseDataSource built in apps/web or apps/mobile). packages/shared
 * deliberately does not depend on @supabase/supabase-js itself, so it stays
 * usable from any client without dragging that dependency along.
 */
export function setDataSource(source: VerdexDataSource) {
  current = source
}

export type {
  VerdexDataSource,
  UsuarioSummary,
  NetworkImpact,
  CreateDepositInput,
  DepositCorrection,
  CreateRewardInput,
  PendingPayoutEntry,
} from './types'
