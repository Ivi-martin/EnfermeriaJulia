export interface PerfusionStandardRow {
  volumeMl: number;
  timeHours: number;
  flowMlPerHour: number;
  dropsPerMinMacro: number; // Factor 20 gtt/ml: (ml / (h * 3))
  microDropsPerMin: number; // Factor 60 gtt/ml: (ml / h)
  useCase: string;
}

export const STANDARD_PERFUSIONS: PerfusionStandardRow[] = [
  { volumeMl: 500, timeHours: 24, flowMlPerHour: 21, dropsPerMinMacro: 7, microDropsPerMin: 21, useCase: 'Mantenimiento mínimo / vía permeable' },
  { volumeMl: 500, timeHours: 12, flowMlPerHour: 42, dropsPerMinMacro: 14, microDropsPerMin: 42, useCase: 'Hidratación basal lenta (1 L/24h en 2 sueros)' },
  { volumeMl: 500, timeHours: 8, flowMlPerHour: 63, dropsPerMinMacro: 21, microDropsPerMin: 63, useCase: 'Pauta habitual de planta: 1.500 ml/24h (3 sueros/día)' },
  { volumeMl: 500, timeHours: 6, flowMlPerHour: 83, dropsPerMinMacro: 28, microDropsPerMin: 83, useCase: 'Pauta estándar de 2.000 ml/24h (4 sueros de 500 ml)' },
  { volumeMl: 500, timeHours: 4, flowMlPerHour: 125, dropsPerMinMacro: 42, microDropsPerMin: 125, useCase: 'Hidratación intensiva o reposición postquirúrgica' },
  { volumeMl: 1000, timeHours: 24, flowMlPerHour: 42, dropsPerMinMacro: 14, microDropsPerMin: 42, useCase: 'Bolsa grande 1.000 ml en 24 horas' },
  { volumeMl: 1000, timeHours: 12, flowMlPerHour: 83, dropsPerMinMacro: 28, microDropsPerMin: 83, useCase: 'Bolsa de 1.000 ml cada 12 horas (2 L/día)' },
  { volumeMl: 1000, timeHours: 8, flowMlPerHour: 125, dropsPerMinMacro: 42, microDropsPerMin: 125, useCase: 'Reposición rápida de 1.000 ml en 8 horas' },
  { volumeMl: 100, timeHours: 0.5, flowMlPerHour: 200, dropsPerMinMacro: 67, microDropsPerMin: 200, useCase: 'Antibiótico o analgésico IV intermitente en 30 min' },
  { volumeMl: 100, timeHours: 1, flowMlPerHour: 100, dropsPerMinMacro: 33, microDropsPerMin: 100, useCase: 'Fármaco IV a pasar en 60 minutos' },
  { volumeMl: 250, timeHours: 1, flowMlPerHour: 250, dropsPerMinMacro: 83, microDropsPerMin: 250, useCase: 'Expansión moderada en 1 hora' },
  { volumeMl: 500, timeHours: 1, flowMlPerHour: 500, dropsPerMinMacro: 167, microDropsPerMin: 500, useCase: 'Carga rápida de volumen en hipotensión/deshidratación' }
];

export const DOSAGE_FORMULAS = [
  {
    title: 'Fórmula de Dosis a Volumen (Regla de tres)',
    formula: 'Volumen (ml) = [ Dosis prescrita (mg) ÷ Concentración del vial (mg/ml) ]',
    example: 'Prescrito: 500 mg de Amoxicilina. Vial disponible: 1 g (1.000 mg) en 10 ml. -> Volumen = 500 ÷ (1000/10) = 5 ml.'
  },
  {
    title: 'Fórmula de Ritmo en Bomba Volumétrica',
    formula: 'Velocidad (ml/h) = Volumen total (ml) ÷ Tiempo total (horas)',
    example: '500 ml a pasar en 8 horas = 500 ÷ 8 = 62,5 ml/h.'
  },
  {
    title: 'Fórmula de Goteo con Macrogotero (20 gotas/ml)',
    formula: 'Gotas/min = (Volumen en ml × 20) ÷ (Horas × 60) = Volumen en ml ÷ (Horas × 3)',
    example: '500 ml en 8 horas = 500 ÷ (8 × 3) = 500 ÷ 24 ≈ 21 gotas/minuto.'
  },
  {
    title: 'Fórmula de Microgoteo (60 microgotas/ml)',
    formula: 'Microgotas/min = Velocidad en ml/h (la cifra numérica es idéntica)',
    example: '83 ml/h equivalen exactamente a 83 microgotas/minuto.'
  },
  {
    title: 'Dosis Ponderal por Peso Corporal',
    formula: 'Dosis total = Peso del paciente (kg) × Dosis indicada (mg/kg)',
    example: 'Paciente de 60 kg con indicación de 1 mg/kg de Enoxaparina = 60 × 1 = 60 mg (0,6 ml).'
  }
];
