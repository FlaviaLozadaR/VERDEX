/**
 * The four account roles in the Verdex ecosystem.
 * See packages/shared/README (or the project chat log) for the full
 * per-role section breakdown that drives apps/web and apps/mobile.
 */
export type Role = 'usuario' | 'empresa' | 'reciclador' | 'admin'

export interface Profile {
  id: string
  authId: string
  role: Role
  name: string
  email: string
  createdAt: string
}
