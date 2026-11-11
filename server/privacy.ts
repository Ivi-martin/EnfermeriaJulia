/**
 * Best-effort server-side guard for obvious patient identifiers before sending
 * free text to an external AI provider. This is not a de-identification system:
 * the UI must still instruct users never to submit patient information.
 */
function collectText(value: unknown, chunks: string[] = []): string[] {
  if (typeof value === 'string') chunks.push(value);
  else if (Array.isArray(value)) value.forEach(item => collectText(item, chunks));
  else if (value && typeof value === 'object') Object.values(value as Record<string, unknown>).forEach(item => collectText(item, chunks));
  return chunks;
}

const SENSITIVE_PATTERNS = [
  /\b\d{8}[A-HJ-NP-TV-Z]\b/i,                         // DNI
  /\b[XYZ]\d{7}[A-HJ-NP-TV-Z]\b/i,                    // NIE
  /\b(?:\+34[\s.-]?)?[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/, // Spanish phone
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,     // email
  /\b(?:CIP|NHC|DNI|NIE|n[uú]mero\s+de\s+historia|historia\s+cl[ií]nica|tarjeta\s+sanitaria)\b\s*(?:n[ºo.]?\s*)?[:#-]?\s*[A-Z0-9/-]{4,}/i,
  /\bfecha\s+de\s+nacimiento\b\s*[:#-]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/i,
];

export function containsPotentialPatientIdentifiers(value: unknown): boolean {
  const text = collectText(value).join('\n');
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(text));
}

export const PATIENT_DATA_BLOCK_MESSAGE = 'Por privacidad, no se ha enviado el texto: parece contener un identificador, teléfono, correo o dato sanitario identificable. Elimina cualquier dato personal y utiliza solo material docente o casos totalmente ficticios.';
