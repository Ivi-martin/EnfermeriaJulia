import { ClinicalCompetency } from '../../types';

export const INITIAL_COMPETENCIES: ClinicalCompetency[] = [
  // SEGURIDAD Y ASEPSIA
  {
    id: 'comp-01',
    title: 'Higiene de Manos según los 5 momentos OMS',
    category: 'Seguridad y Asepsia',
    description: 'Aplicación sistemática de la técnica de fricción con solución hidroalcohólica y lavado con agua y jabón en los 5 momentos asistenciales de la OMS.',
    status: 'Evaluada',
    observations: 'Dominio completo de la técnica de 8 pasos demostrada en simulación de habilidades clínicas.',
    evaluatedBy: 'Prof. Fundamentos UCLM',
    updatedAt: '2026-10-15'
  },
  {
    id: 'comp-02',
    title: 'Mantenimiento del Campo Estéril y Apertura de Material',
    category: 'Seguridad y Asepsia',
    description: 'Apertura aséptica de paquetes estériles sin tocar el interior, vertido de soluciones y manejo de paños estériles sin contaminar los bordes (margen de seguridad de 2.5 cm).',
    status: 'Practicada',
    observations: 'Realizado en taller de suturas y curas en el laboratorio de simulación.',
    updatedAt: '2026-10-22'
  },
  {
    id: 'comp-03',
    title: 'Colocación y Retirada Segura de EPI',
    category: 'Seguridad y Asepsia',
    description: 'Protocolo riguroso de vestimenta de protección (mascarilla FFP2, bata impermeable, protección ocular y guantes) evitando contaminación facial durante la retirada.',
    status: 'Evaluada',
    observations: 'Superada estación ECOE de aislamiento hospitalario.',
    evaluatedBy: 'Comisión Docente Prácticas',
    updatedAt: '2026-11-01'
  },

  // VÍAS Y MEDICACIÓN
  {
    id: 'comp-04',
    title: 'Verificación de los 10 Correctos en Administración de Fármacos',
    category: 'Vías y Medicación',
    description: 'Doble chequeo independiente de paciente, fármaco, dosis, vía, horario, caducidad, alergias, preparación, registro y educación al paciente.',
    status: 'Practicada',
    observations: 'Entrenado repetidamente en simulación clínica.',
    updatedAt: '2026-10-28'
  },
  {
    id: 'comp-05',
    title: 'Canalización de Vía Venosa Periférica (VVP)',
    category: 'Vías y Medicación',
    description: 'Selección de vena distal en antebrazo, punción aséptica con catéter 20G/18G, comprobación de retorno venoso, fijación con apósito transparente y lavado pulsátil.',
    status: 'Practicada',
    observations: 'Canalizado con éxito en brazo de simulación venosa avanzado.',
    updatedAt: '2026-11-02'
  },
  {
    id: 'comp-06',
    title: 'Inyección Subcutánea e Intramuscular',
    category: 'Vías y Medicación',
    description: 'Punción subcutánea de heparina e insulina con técnica del pellizco a 90º; e inyección intramuscular en deltoides y cuadrante superior externo del glúteo o zona ventroglútea.',
    status: 'Practicada',
    observations: 'Manejo correcto de no aspiración en HBPM y rotación de puntos.',
    updatedAt: '2026-10-18'
  },
  {
    id: 'comp-07',
    title: 'Cálculo y Programación de Bombas de Infusión',
    category: 'Vías y Medicación',
    description: 'Cálculo de ritmo de perfusión en ml/h, programación de volúmenes límite y gotas por minuto en goteros estándar.',
    status: 'Observada',
    observations: 'Observado en sesión clínica con bombas volumétricas y de jeringa.',
    updatedAt: '2026-10-12'
  },

  // DIAGNÓSTICO Y CONSTANTES
  {
    id: 'comp-08',
    title: 'Toma e Interpretación de Constantes Vitales',
    category: 'Diagnóstico y Constantes',
    description: 'Medición fidedigna de TA auscultatoria, FC radial/apical, FR discreta, SatO2 y Tª timpánica, reconociendo criterios de alerta rápida.',
    status: 'Evaluada',
    observations: 'Excelente precisión auscultatoria de ruidos de Korotkoff.',
    evaluatedBy: 'Tutor de Habilidades Clínicas',
    updatedAt: '2026-10-08'
  },
  {
    id: 'comp-09',
    title: 'Realización de Electrocardiograma de 12 Derivaciones',
    category: 'Diagnóstico y Constantes',
    description: 'Colocación exacta de electrodos periféricos (rojo brazo dcho, amarillo brazo izq, verde pierna izq, negro pierna dcha) y precordiales V1-V6 en espacios intercostales anatómicos.',
    status: 'Practicada',
    observations: 'Realizado sin artefactos en voluntario simulado.',
    updatedAt: '2026-10-25'
  },
  {
    id: 'comp-10',
    title: 'Glucemia Capilar y Test Rápido de Orina',
    category: 'Diagnóstico y Constantes',
    description: 'Punción capilar lateral con lanceta retráctil, descarte de 1ª gota y lectura de tira reactiva de orina en 60 segundos.',
    status: 'Evaluada',
    observations: 'Conoce a la perfección los criterios de hipoglucemia y regla de los 15.',
    evaluatedBy: 'Prof. Bioquímica Clínica',
    updatedAt: '2026-10-20'
  },

  // ELIMINACIÓN
  {
    id: 'comp-11',
    title: 'Sondaje Vesical Permanente y Circuito Cerrado',
    category: 'Eliminación',
    description: 'Inserción aséptica de sonda Foley CH 14-16 en maniquí urológico, conexión a bolsa con válvula antirreflujo y fijación sin tracción.',
    status: 'Observada',
    observations: 'Observado procedimiento completo en simulador masculino y femenino.',
    updatedAt: '2026-10-29'
  },
  {
    id: 'comp-12',
    title: 'Manejo y Cuidados de Ostomías Digestivas',
    category: 'Eliminación',
    description: 'Valoración del estoma (coloración, protrusión, edema), limpieza periestomal con agua tibia y jabón neutro, recorte a medida de la placa y cambio de bolsa colectora.',
    status: 'Pendiente',
    observations: 'Programado para el módulo de enfermería médico-quirúrgica.',
    updatedAt: '2026-11-04'
  },

  // URGENCIAS Y SOPORTE
  {
    id: 'comp-13',
    title: 'Soporte Vital Básico (SVB) y Desfibrilación Semiautomática (DEA)',
    category: 'Urgencias y Soporte',
    description: 'Reconocimiento de parada cardiorrespiratoria, compresiones torácicas de alta calidad (100-120 cpm, profundidad 5-6 cm, reexpansión total), uso seguro del DEA y ventilaciones 30:2.',
    status: 'Evaluada',
    observations: 'Acreditado por el Plan Nacional de RCP / Consejo Español de Resucitación.',
    evaluatedBy: 'Instructor SVB/DEA SEMICYUC',
    updatedAt: '2026-09-30'
  },
  {
    id: 'comp-14',
    title: 'Manejo de Obstrucción de Vía Aérea por Cuerpo Extraño (OVACE)',
    category: 'Urgencias y Soporte',
    description: 'Diferenciación entre OVACE leve (estimular tos) y grave (5 golpes interescapulares seguidos de 5 compresiones abdominales / maniobra de Heimlich).',
    status: 'Practicada',
    observations: 'Entrenado con chaleco antiasfixia Act+Fast.',
    updatedAt: '2026-10-05'
  }
];

export const GIBBS_CYCLE_GUIDE = {
  description: 'El Modelo de Reflexión de Graham Gibbs (1988) es la herramienta pedagógica de referencia en las universidades de enfermería europeas para transformar vivencias asistenciales en aprendizaje clínico consolidado.',
  stages: [
    { name: '1. Descripción', prompt: '¿Qué ocurrió exactamente de forma objetiva? (Contexto, paciente ficticio, técnica o situación presenciada)' },
    { name: '2. Sentimientos', prompt: '¿Qué pensaste y sentiste durante el episodio y después de él? (Inseguridad, satisfacción, nerviosismo, empatía)' },
    { name: '3. Evaluación', prompt: '¿Qué fue lo positivo de la experiencia y qué aspectos resultaron difíciles o salieron mal?' },
    { name: '4. Análisis', prompt: '¿Qué sentido tiene la situación a la luz de los conocimientos teóricos y protocolos aprendidos en clase?' },
    { name: '5. Conclusión', prompt: '¿Qué más podrías haber hecho o cómo podría haberse abordado la situación de otra manera?' },
    { name: '6. Plan de Acción', prompt: 'Si vuelves a encontrarte en una situación idéntica, ¿cuál será exactamente tu actuación paso a paso?' }
  ]
};
