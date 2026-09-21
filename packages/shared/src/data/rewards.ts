import type { Reward } from '../types/reward'

export const REWARDS: Reward[] = [
  { id: 'r1', nm: 'Café americano gratis',      partner: 'Cafetería UPSA',      cat: 'Comida',   pts: 150,  ic: 'C', color: '',      status: 'activo' },
  { id: 'r2', nm: 'Snack saludable 10% off',    partner: 'Aliado local',        cat: 'Comida',   pts: 300,  ic: 'S', color: '',      status: 'activo' },
  { id: 'r3', nm: 'Vale Bs. 20 supermercado',   partner: 'Hipermaxi',           cat: 'Super',    pts: 800,  ic: 'H', color: 'ink',   status: 'activo' },
  { id: 'r4', nm: '20% off entrada cine',       partner: 'MultiCine',           cat: 'Ocio',     pts: 1500, ic: 'M', color: 'amber', status: 'activo' },
  { id: 'r5', nm: 'Coca-Cola + envío gratis',   partner: 'Coca-Cola Bolivia',   cat: 'Bebidas',  pts: 2000, ic: 'K', color: '',      status: 'activo' },
  { id: 'r6', nm: 'Vale Bs. 100 compra total',  partner: 'Fidalga',             cat: 'Super',    pts: 3500, ic: 'F', color: '',      status: 'activo' },
  { id: 'r7', nm: 'Pack Pepsi familiar',        partner: 'Pepsi Bolivia',       cat: 'Bebidas',  pts: 2400, ic: 'P', color: 'ink',   status: 'pausado' },
  { id: 'r8', nm: 'Sorteo trimestral Verdex',   partner: 'Verdex',              cat: 'Sorteos',  pts: 6000, ic: 'V', color: 'amber', status: 'activo' },
  { id: 'r9', nm: 'Donación ONG ambiental',     partner: 'Red aliada',          cat: 'Impacto',  pts: 1000, ic: '♥', color: '',      status: 'activo' },
]

export const REWARD_CATS = ['Todos', 'Comida', 'Bebidas', 'Super', 'Ocio', 'Sorteos', 'Impacto']
