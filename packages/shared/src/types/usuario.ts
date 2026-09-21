export interface UsuarioProfile {
  profileId: string
  uni: string
  /** Company this user's recycling counts toward for ESG rollups, if any. */
  empresaId: string | null
  points: number
  totalEarned: number
  kg: number
  levelIdx: number
}

/** Admin's simplified view of a usuario account — not the full UsuarioProfile. */
export interface UsuarioAccount {
  id: string
  name: string
  email: string
  status: 'activo' | 'suspendido'
}

export interface Txn {
  id: string
  type: 'deposit' | 'redeem'
  label: string
  sub: string
  pts: number
  ic: string
  ts: number
}
