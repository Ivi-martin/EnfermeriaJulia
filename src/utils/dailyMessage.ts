import { FAMILY_MESSAGES, FamilyMessage } from '../data/familyMessages';

// Día en el que empieza el ciclo de 100 mensajes (año, mes, día). Ese día sale el mensaje nº 1.
const CYCLE_START = { year: 2026, month: 11, day: 9 };
const SHUFFLE_SEED = 20261109;

const MS_PER_DAY = 86_400_000;

// Número de día según el calendario LOCAL (así el mensaje cambia a medianoche en su zona horaria)
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

// Generador pseudoaleatorio con semilla: da siempre el mismo orden
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Orden fijo de los mensajes: mezclado para alternar categorías, empezando por el nº 1,
// sin que dos días seguidos (ni el último y el primero del ciclo) sean de la misma categoría.
export function buildMessageOrder(messages: FamilyMessage[]): FamilyMessage[] {
  const rand = mulberry32(SHUFFLE_SEED);
  const list = [...messages];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  const firstIdx = list.findIndex((m) => m.id === 1);
  if (firstIdx > 0) [list[0], list[firstIdx]] = [list[firstIdx], list[0]];

  const n = list.length;
  const clash = (i: number) => list[i].category === list[(i + 1) % n].category;
  // Corrige repeticiones de categoría intercambiando con otro mensaje (el nº 1 se queda el primero)
  for (let pass = 0; pass < 20; pass++) {
    let changed = false;
    for (let i = 1; i < n; i++) {
      if (!clash(i - 1)) continue;
      for (let j = 1; j < n; j++) {
        if (j === i || j === i - 1) continue;
        [list[i], list[j]] = [list[j], list[i]];
        const touched = [i - 1, i, j - 1, j].map((k) => (k + n) % n);
        if (touched.every((k) => !clash(k))) {
          changed = true;
          break;
        }
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    if (!changed) break;
  }
  return list;
}

const MESSAGE_ORDER = buildMessageOrder(FAMILY_MESSAGES);

// Mensaje de una fecha: uno distinto cada día, sin repetir hasta completar el ciclo de 100
export function getMessageForDate(date: Date = new Date()): FamilyMessage {
  const start = localDayNumber(new Date(CYCLE_START.year, CYCLE_START.month - 1, CYCLE_START.day));
  const diff = localDayNumber(date) - start;
  const n = MESSAGE_ORDER.length;
  return MESSAGE_ORDER[((diff % n) + n) % n];
}
