import type { Material } from '../types/deposit'

export const MATERIALS: Material[] = [
  { id: 'pet',   nm: 'PET',       sub: 'Botella plástica', ptsPerUnit: 50, kgPerUnit: 0.04, ic: 'PET' },
  { id: 'alu',   nm: 'Aluminio',  sub: 'Lata',              ptsPerUnit: 60, kgPerUnit: 0.015, ic: 'AL' },
  { id: 'cart',  nm: 'Cartón',    sub: 'Por kg',            ptsPerUnit: 80, kgPerUnit: 1.0, ic: 'CRT' },
  { id: 'vid',   nm: 'Vidrio',    sub: 'Botella',           ptsPerUnit: 40, kgPerUnit: 0.4, ic: 'VID' },
  { id: 'tetra', nm: 'Tetra',     sub: 'Brik',              ptsPerUnit: 30, kgPerUnit: 0.03, ic: 'TT' },
  { id: 'mix',   nm: 'Mixto',     sub: 'Por kg',            ptsPerUnit: 35, kgPerUnit: 1.0, ic: 'MX' },
]
