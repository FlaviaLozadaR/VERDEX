export type RecicladorStatus = 'pendiente' | 'aprobado'

export interface RecicladorProfile {
  profileId: string
  operatorName: string
  zone: string
  payoutRateBsKg: number
  /** Admin approval state — a new operator starts `pendiente`. */
  status: RecicladorStatus
}

export type CollectionPointType = 'contenedor' | 'aliado' | 'campus' | 'maquina'

export interface CollectionPoint {
  id: string
  name: string
  meta: string
  lat: number | null
  lng: number | null
  type: CollectionPointType
  recicladorId: string | null
}

export interface Payout {
  id: string
  recicladorId: string
  period: string
  kgTotal: number
  amountBs: number
  status: 'pendiente' | 'pagado'
}
