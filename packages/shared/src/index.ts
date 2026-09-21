// Types
export * from './types/role'
export * from './types/usuario'
export * from './types/empresa'
export * from './types/reciclador'
export * from './types/deposit'
export * from './types/reward'
export * from './types/admin'

// Data (hardcoded for now — same shape the real Supabase queries will return later)
export * from './data/materials'
export * from './data/rewards'
export * from './data/levels'
export * from './data/collectionPoints'
export * from './data/empresaDemo'

// Data access — read through this, not the hardcoded arrays above, so
// swapping in Supabase later doesn't touch any screen.
export * from './data-access'
