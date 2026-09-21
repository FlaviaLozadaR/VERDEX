export interface Level {
  id: string
  nm: string
  min: number
  max: number
}

export const LEVELS: Level[] = [
  { id: 'semilla', nm: 'Semilla', min: 0, max: 500 },
  { id: 'brote', nm: 'Brote', min: 500, max: 2500 },
  { id: 'arbol', nm: 'Árbol', min: 2500, max: 10000 },
  { id: 'bosque', nm: 'Bosque', min: 10000, max: 100000 },
]

export function levelFor(pts: number): Level & { idx: number } {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (pts >= LEVELS[i].min) return { ...LEVELS[i], idx: i }
  }
  return { ...LEVELS[0], idx: 0 }
}
