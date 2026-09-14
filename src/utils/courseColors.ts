const COLOR_PALETTE = [
  '#0e7490',
  '#7c3aed',
  '#c2410c',
  '#1d4ed8',
  '#be123c',
  '#15803d',
  '#b45309',
  '#6d28d9',
  '#0f766e',
  '#a21caf',
]

/** Deterministically assigns a unique color accent per course code. */
export function getCourseColor(code: string): string {
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) | 0
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length]
}