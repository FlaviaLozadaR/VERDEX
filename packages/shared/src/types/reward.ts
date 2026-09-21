export interface Reward {
  id: string
  nm: string
  partner: string
  cat: string
  pts: number
  ic: string
  color: string
  /** `pausado` rewards stay visible to admin but drop out of the usuario catalog. */
  status: 'activo' | 'pausado'
}

export interface Redemption {
  id: string
  usuarioId: string
  rewardId: string
  code: string
  status: 'pendiente' | 'usado'
  redeemedAt: number
}
