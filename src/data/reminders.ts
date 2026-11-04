import { PocketCheckItem, ExamReminder, ClinicalPracticeShift } from '../types';

export const DEFAULT_POCKET_CHECKLIST: PocketCheckItem[] = [
  { id: 'poc-1', name: 'Tijeras de punta roma / Mayo', category: 'Instrumental', checked: true },
  { id: 'poc-2', name: 'Pinzas de Kocher (para clamps y apósitos)', category: 'Instrumental', checked: true },
  { id: 'poc-3', name: 'Torniquete / Compresor elástico', category: 'Instrumental', checked: true },
  { id: 'poc-4', name: 'Linterna pupilar de diagnóstico', category: 'Instrumental', checked: false },
  { id: 'poc-5', name: 'Pulsioxímetro de dedo de bolsillo', category: 'Instrumental', checked: false },
  { id: 'poc-6', name: 'Fonendoscopio (estetoscopio)', category: 'Instrumental', checked: true },
  { id: 'poc-7', name: 'Tarjeta identificativa de estudiante UCLM', category: 'Documentación', checked: true },
  { id: 'poc-8', name: 'Cuaderno / Libreta de bolsillo de prácticas', category: 'Documentación', checked: true },
  { id: 'poc-9', name: 'Bolígrafo de 4 colores (Azul, Rojo, Negro, Verde)', category: 'Papelería', checked: true },
  { id: 'poc-10', name: 'Rotulador indeleble fino (para marcar sueros y sondas)', category: 'Papelería', checked: true },
  { id: 'poc-11', name: 'Reloj de solapa con segundero (sin correa de muñeca)', category: 'Instrumental', checked: true },
  { id: 'poc-12', name: 'Esparadrapo de papel hipoalergénico', category: 'Protección', checked: true },
  { id: 'poc-13', name: 'Solución hidroalcohólica de bolsillo', category: 'Protección', checked: true },
  { id: 'poc-14', name: 'Móvil con Campus Enfermería en modo offline', category: 'Protección', checked: true }
];

export const INITIAL_EXAMS: ExamReminder[] = [
  {
    id: 'ex-1',
    subject: 'Anatomía Humana',
    date: '2026-11-20',
    time: '09:00',
    classroom: 'Aula Magna 1.2',
    campusLocation: 'Fábrica de Armas (Toledo)',
    topics: 'Aparato locomotor, sistema cardiovascular, digestivo y respiratorio',
    weightPercent: 40,
    completed: false,
    alertDaysBefore: 3,
    notes: 'Llevar calculadora sencilla y bolígrafo azul. Repasar bien planos anatómicos y circulación pulmonar.'
  },
  {
    id: 'ex-2',
    subject: 'Fundamentos de Enfermería I',
    date: '2026-12-05',
    time: '11:30',
    classroom: 'Aula 3.1 - Edificio Sabatini',
    campusLocation: 'Campus Fábrica de Armas',
    topics: 'Etapas del PAE, NANDA-NOC-NIC, 14 necesidades de Virginia Henderson y modelos enfermeros',
    weightPercent: 50,
    completed: false,
    alertDaysBefore: 5,
    notes: 'Entra un caso práctico de formulación de diagnósticos con formato PES.'
  },
  {
    id: 'ex-3',
    subject: 'Bioquímica',
    date: '2026-12-18',
    time: '16:00',
    classroom: 'Aula de Seminarios 2',
    campusLocation: 'Campus San Pedro Mártir',
    topics: 'Metabolismo glucídico, ciclo de Krebs, equilibrio ácido-base y gasometría arterial',
    weightPercent: 40,
    completed: false,
    alertDaysBefore: 2,
    notes: 'Repasar valores normales de pH (7.35-7.45), pCO2 y HCO3.'
  }
];

export const INITIAL_PRACTICE_SHIFTS: ClinicalPracticeShift[] = [
  {
    id: 'shift-1',
    hospital: 'Hospital Universitario de Toledo (HUT)',
    service: 'Medicina Interna (Planta 4.ª Sur)',
    date: '2026-11-10',
    shiftType: 'Mañana (08:00-15:00)',
    hours: 7,
    tutorName: 'Dña. Elena Gómez (Enfermera Supervisora)',
    objectives: 'Toma y registro de constantes matutinas, administración de medicación oral y curas de UPP.',
    learnings: 'Primera canalización de VVP supervisada con catéter 20G en antebrazo. Excelente técnica aséptica.',
    status: 'Validado',
    completed: false
  },
  {
    id: 'shift-2',
    hospital: 'Hospital Universitario de Toledo (HUT)',
    service: 'Medicina Interna (Planta 4.ª Sur)',
    date: '2026-11-11',
    shiftType: 'Mañana (08:00-15:00)',
    hours: 7,
    tutorName: 'Dña. Elena Gómez',
    objectives: 'Acompañamiento en pases de visita, extracción de analíticas venosas y control de glucemias.',
    learnings: '',
    status: 'Pendiente de tutor',
    completed: false
  },
  {
    id: 'shift-3',
    hospital: 'Centro de Salud Palomarejos (Toledo)',
    service: 'Atención Primaria - Consulta de Enfermería',
    date: '2026-11-17',
    shiftType: 'Mañana (08:00-15:00)',
    hours: 7,
    tutorName: 'D. Carlos Ruiz',
    objectives: 'Vacunación antigripal y Covid-19 en adultos mayores, seguimiento de pacientes con HTA y DM2.',
    learnings: '',
    status: 'Sin presentar',
    completed: false
  }
];
