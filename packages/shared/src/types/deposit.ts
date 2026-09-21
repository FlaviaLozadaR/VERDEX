export type MaterialId = 'pet' | 'alu' | 'cart' | 'vid' | 'tetra' | 'mix'
export type DepositStatus = 'pendiente' | 'validado' | 'rechazado'

export interface Material {
  id: MaterialId
  nm: string
  sub: string
  ptsPerUnit: number
  kgPerUnit: number
  ic: string
}

export interface Deposit {
  id: string
  usuarioId: string
  collectionPointId: string
  material: MaterialId
  kg: number
  pointsAwarded: number
  status: DepositStatus
  /** Set once a reciclador confirms the weight/material in the field. */
  validatedByRecicladorId: string | null
  createdAt: string
}
