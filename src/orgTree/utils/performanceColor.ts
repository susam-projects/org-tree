export function getPerformanceColor(performance: number): string {
  if (performance >= 70) return '#16a34a'
  if (performance >= 40) return '#d97706'
  return '#dc2626'
}
