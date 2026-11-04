export interface Subject {
  code: string;
  name: string;
  year: 1 | 2 | 3 | 4;
  sem: string;
  ects: number;
  type: 'Formación básica' | 'Obligatoria' | 'Prácticas Tuteladas' | 'Optativa' | 'TFG';
  progress: number;
  isKeySubject?: boolean;
  prerequisites?: string[];
  unlocks?: string[];
  status?: 'Matriculada' | 'Aprobada' | 'Pendiente';
  grade?: number;
  professor?: string;
  guideUrl?: string;
  topics?: string[];
}

export interface Drug {
  id: string;
  name: string;
  commercialNames: string[];
  group: string;
  atcCode?: string;
  indications: string;
  posology: string;
  administration: string;
  dilution: string;
  adverseEffects: string;
  nursingCare: string[];
  contraindications?: string;
  warning?: string;
  isHighRisk?: boolean;
  isLasa?: boolean;
  lasaPair?: string;
  isCustom?: boolean;
}

export interface IvCompatibilityEntry {
  drugA: string;
  drugB: string;
  compatibility: 'Compatible en Y' | 'Incompatible' | 'Compatibilidad Condicional' | 'No Establecida';
  details: string;
  diluent: string;
  source: string;
}

export interface MedicalTerm {
  id: string;
  term: string;
  meaning: string;
  category: 'Prefijo' | 'Sufijo' | 'Raíz' | 'Abreviatura' | 'Posición Anatómica';
  example?: string;
  notes?: string;
}

export interface ExamReminder {
  id: string;
  subject: string;
  date: string;
  time: string;
  classroom: string;
  campusLocation: string;
  topics: string;
  weightPercent?: number;
  completed: boolean;
  notes?: string;
  alertDaysBefore?: number;
}

export interface ClinicalPracticeShift {
  id: string;
  hospital: string;
  service: string;
  date: string;
  shiftType: 'Mañana (08:00-15:00)' | 'Tarde (15:00-22:00)' | 'Noche (22:00-08:00)' | 'Rotatorio';
  hours: number;
  tutorName?: string;
  objectives?: string;
  learnings?: string;
  status: 'Validado' | 'Pendiente de tutor' | 'Sin presentar';
  completed: boolean;
}

export interface ClinicalCompetency {
  id: string;
  title: string;
  category: 'Seguridad y Asepsia' | 'Vías y Medicación' | 'Eliminación' | 'Diagnóstico y Constantes' | 'Urgencias y Soporte';
  description: string;
  status: 'Pendiente' | 'Observada' | 'Practicada' | 'Evaluada';
  observations?: string;
  evaluatedBy?: string;
  updatedAt?: string;
}

export interface GibbsReflection {
  id: string;
  date: string;
  shiftContext: string;
  description: string; // ¿Qué ocurrió?
  feelings: string; // ¿Qué sentí?
  evaluation: string; // ¿Qué fue positivo y qué fue negativo?
  analysis: string; // ¿Qué sentido tiene la situación a la luz de la teoría?
  conclusion: string; // ¿Qué más pude haber hecho?
  actionPlan: string; // Si vuelve a ocurrir, ¿qué haré?
}

export interface PocketCheckItem {
  id: string;
  name: string;
  category: 'Instrumental' | 'Documentación' | 'Protección' | 'Papelería';
  checked: boolean;
}

export interface EcoeStation {
  id: string;
  number: number;
  title: string;
  scenario: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  timeLimitMinutes: number;
  materialsNeeded: string[];
  checklistSteps: {
    id: string;
    phase: 'Preparación' | 'Ejecución' | 'Finalización y Comunicación';
    instruction: string;
    isCriticalError?: boolean;
    points: number;
  }[];
  criticalErrorsDescription: string[];
  learningObjectives: string[];
  docentSource: string;
}

export interface LabAnalyte {
  name: string;
  category: 'Hemograma' | 'Bioquímica' | 'Coagulación' | 'Iones' | 'Marcadores Cardíacos' | 'Gasometría';
  normalRange: string;
  units: string;
  highMeaning: string;
  lowMeaning: string;
  nursingSignificance: string;
}

export interface BloodTube {
  color: string;
  hexColor: string;
  additive: string;
  orderNumber: number;
  sampleType: string;
  commonTests: string[];
  fillInstructions: string;
  inversions: string;
  clinicalTips: string;
}

export interface ClinicalManual {
  id: string;
  title: string;
  category: 'Vías y Medicación' | 'Eliminación' | 'Diagnóstico y Constantes' | 'Cuidados y Heridas' | 'Urgencias y Soporte';
  summary: string;
  durationMin: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  indications: string[];
  contraindications: string[];
  materials: string[];
  steps: {
    phase: 'Preparación' | 'Ejecución' | 'Finalización y Cuidados';
    instructions: string[];
  }[];
  keySafetyTips: string[];
  complications: string[];
  nursingRecordGuideline: string;
  offlineReady: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  year?: 1 | 2 | 3 | 4;
  category: 'Anatomía' | 'Fundamentos' | 'Fisiología' | 'Farmacología' | 'Laboratorio' | 'ECOE' | 'Casos Clínicos';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalTip?: string;
  difficulty?: 'Básica' | 'Media' | 'Avanzada';
}

export interface Task {
  id: number;
  title: string;
  subject: string;
  date: string;
  done: boolean;
  priority: 'Alta' | 'Media' | 'Baja';
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  kind: 'Examen' | 'Prácticas' | 'Clase' | 'Entrega' | 'Estudio' | 'Personal';
  location?: string;
}

export interface GradeEntry {
  id: number;
  subject: string;
  name: string;
  grade: number;
  weight: number;
}

export interface CarePlan {
  id: number;
  caseTitle: string;
  assessment: string;
  nandaDx: string;
  relatedTo: string;
  nocResults: string;
  nicInterventions: string;
  evaluation: string;
}

export interface SbarReport {
  id: number;
  title: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export interface TutorChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  tutorPersona: string;
}
