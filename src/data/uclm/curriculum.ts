import { Subject } from '../../types';

/**
 * Plan de estudios publicado por la UCLM para el Grado en Enfermería (Toledo).
 * Los datos de asignaturas/códigos/ECTS se han contrastado con la página oficial
 * consultada el 11/11/2026. Las guías docentes y horarios deben consultarse cada curso.
 * Fuente: https://www.uclm.es/toledo/fafeto/estudios/gradoenfermeria
 */
const OFFICIAL_PLAN_URL = 'https://www.uclm.es/toledo/fafeto/estudios/gradoenfermeria';
const subject = (
  code: string, name: string, year: 1 | 2 | 3 | 4, sem: string, ects: number,
  type: Subject['type'], topics: string[] = [],
): Subject => ({
  code, name, year, sem, ects, type, progress: 0,
  status: year === 1 ? 'Matriculada' : 'Pendiente',
  topics, guideUrl: OFFICIAL_PLAN_URL,
});

export const UCLM_NURSING_CURRICULUM: Subject[] = [
  // PRIMER CURSO — 60 ECTS
  subject('15300', 'Anatomía Humana', 1, '1.º Semestre', 6, 'Formación básica'),
  subject('15301', 'Psicología', 1, '1.º Semestre', 6, 'Formación básica'),
  subject('15302', 'Bioquímica', 1, '1.º Semestre', 6, 'Formación básica'),
  subject('15303', 'Fundamentos de Enfermería 1', 1, '1.º Semestre', 6, 'Obligatoria'),
  subject('15306', 'Introducción a la Salud Pública', 1, '1.º Semestre', 6, 'Obligatoria'),
  subject('15304', 'Estadística para Ciencias de la Salud', 1, '2.º Semestre', 6, 'Formación básica'),
  subject('15305', 'Diversidad Cultural y Desigualdades Sociales en Salud', 1, '2.º Semestre', 6, 'Formación básica'),
  subject('15307', 'Fisiología Humana', 1, '2.º Semestre', 6, 'Formación básica'),
  subject('15308', 'Nutrición y Dietética', 1, '2.º Semestre', 6, 'Formación básica'),
  subject('15310', 'Fundamentos de Enfermería 2', 1, '2.º Semestre', 6, 'Obligatoria'),

  // SEGUNDO CURSO — 60 ECTS
  subject('15309', 'Legislación y Ética Profesional', 2, '1.º Semestre', 6, 'Formación básica'),
  subject('15312', 'Farmacología', 2, '1.º Semestre', 6, 'Formación básica'),
  subject('15313', 'Enfermería Comunitaria 1', 2, '1.º Semestre', 6, 'Obligatoria'),
  subject('15317', 'Enfermería Médico-Quirúrgica 1', 2, '1.º Semestre', 6, 'Obligatoria'),
  subject('15318', 'Estancias Clínicas 1', 2, '1.º Semestre', 6, 'Prácticas Tuteladas'),
  subject('15311', 'Psicología de la Salud', 2, '2.º Semestre', 6, 'Formación básica'),
  subject('15314', 'Enfermería Maternal', 2, '2.º Semestre', 6, 'Obligatoria'),
  subject('15319', 'Estancias Clínicas 2', 2, '2.º Semestre', 6, 'Prácticas Tuteladas'),
  subject('15322', 'Enfermería Médico-Quirúrgica 2', 2, '2.º Semestre', 6, 'Obligatoria'),
  subject('15323', 'Enfermería Médico-Quirúrgica 3', 2, '2.º Semestre', 6, 'Obligatoria'),

  // TERCER CURSO — 54 ECTS obligatorios + una optativa de 6 ECTS
  subject('15316', 'Enfermería Geriátrica', 3, '1.º Semestre', 6, 'Obligatoria'),
  subject('15320', 'Enfermería Comunitaria 2', 3, '1.º Semestre', 6, 'Obligatoria'),
  subject('15321', 'Enfermería Infantil', 3, '1.º Semestre', 6, 'Obligatoria'),
  subject('15324', 'Estancias Clínicas 3', 3, '1.º Semestre', 6, 'Prácticas Tuteladas'),
  subject('15327', 'Enfermería Médico-Quirúrgica 4', 3, '1.º Semestre', 6, 'Obligatoria'),
  subject('15315', 'Enfermería Psiquiátrica y de Salud Mental', 3, '2.º Semestre', 6, 'Obligatoria'),
  subject('15325', 'Gestión de Servicios de Salud', 3, '2.º Semestre', 6, 'Obligatoria'),
  subject('15326', 'Estancias Clínicas 4', 3, '2.º Semestre', 6, 'Prácticas Tuteladas'),
  subject('15328', 'Estancias Clínicas 5', 3, '2.º Semestre', 6, 'Prácticas Tuteladas'),
  subject('OPT-3', 'Optativa de 3.º (elegir una opción)', 3, '2.º Semestre', 6, 'Optativa', [
    '15345 · Enfermería ante la Fragilidad y Dependencia',
    '15346 · Enfermería en Emergencias y Catástrofes',
    '15347 · Cuidados Quirúrgicos Avanzados',
  ]),

  // CUARTO CURSO — 60 ECTS
  subject('15331', 'Practicum 1', 4, '1.º Semestre', 25, 'Prácticas Tuteladas'),
  subject('15332', 'Practicum 2', 4, '2.º Semestre', 25, 'Prácticas Tuteladas'),
  subject('15333', 'Trabajo Fin de Grado', 4, '2.º Semestre', 10, 'TFG'),
];

export const UCLM_PLAN_SOURCE = {
  title: 'Plan de estudios del Grado en Enfermería — Toledo',
  url: OFFICIAL_PLAN_URL,
  checkedAt: '2026-11-11',
  totalEcts: 240,
  breakdown: { basic: 60, compulsory: 84, elective: 6, tfg: 10, clinicalPlacements: 80 },
};

export interface PrerequisiteRule {
  targetCode: string;
  targetName: string;
  requiredCodes: string[];
  description: string;
}

/** Requisito informativo publicado por UCLM. El portal no concreta aquí el código exacto de la asignatura llave. */
export const PREREQUISITE_RULES: PrerequisiteRule[] = [
  { targetCode: '15318', targetName: 'Estancias Clínicas 1', requiredCodes: [], description: 'La página oficial indica que para matricular Estancias Clínicas 1 debe haberse cursado previamente Fundamentos de Enfermería. La web no identifica en este apartado el código exacto; confirma con la guía docente o Secretaría qué asignatura(s) se consideran válidas. Este aviso no verifica automáticamente requisitos de matrícula.' },
  { targetCode: '15319', targetName: 'Estancias Clínicas 2', requiredCodes: [], description: 'La página oficial incluye Estancias Clínicas 1 y 2 dentro del requisito de haber cursado anteriormente Fundamentos de Enfermería. La web no identifica en este apartado el código exacto; confirma con la guía docente o Secretaría qué asignatura(s) se consideran válidas. Este aviso no verifica automáticamente requisitos de matrícula.' },
];

/** Lugares de referencia del campus; confirmar siempre destinos y asignaciones docentes vigentes. */
export const TOLEDO_CAMPUS_LOCATIONS = [
  {
    id: 'fabrica-armas',
    name: 'Campus Tecnológico Fábrica de Armas (UCLM)',
    type: 'Campus universitario',
    address: 'Av. Carlos III, s/n, 45071 Toledo',
    description: 'Campus de referencia de la UCLM en Toledo. Confirmar aula, edificio y servicios en la información universitaria vigente.',
    keyZones: ['Edificios docentes', 'Biblioteca', 'Servicios universitarios'],
  },
  {
    id: 'hut',
    name: 'Hospital Universitario de Toledo',
    type: 'Centro sanitario',
    address: 'Av. del Río Guadiana, 45007 Toledo',
    description: 'Centro sanitario de Toledo. La asignación de prácticas depende de la planificación oficial de la universidad y del SESCAM.',
    keyZones: ['Consultas', 'Hospitalización', 'Servicios clínicos'],
  },
  {
    id: 'hnp',
    name: 'Hospital Nacional de Parapléjicos',
    type: 'Centro sanitario',
    address: 'Finca La Peraleda, s/n, 45071 Toledo',
    description: 'Centro de referencia en lesión medular. La asignación de prácticas debe confirmarse mediante la UCLM.',
    keyZones: ['Rehabilitación', 'Hospitalización', 'Consultas'],
  },
];
