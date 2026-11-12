/**
 * Utilidades de fecha local para España/zona del usuario.
 * Evita el desfase horario nocturno (00:00 - 02:00) de toISOString().
 */

export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

export function addDaysToDateStr(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

export function getDaysDifference(targetDate: string, baseDate: string = getLocalDateString()): number {
  const t = parseLocalDate(targetDate).getTime();
  const b = parseLocalDate(baseDate).getTime();
  return Math.round((t - b) / (1000 * 60 * 60 * 24));
}
