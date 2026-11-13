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
  tutorFeedback?: string;
  selfAssessment?: 'Por valorar' | 'Necesito apoyo' | 'En progreso' | 'Con confianza';
  nextGoal?: string;
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
  category: 'Anatomía' | 'Fundamentos' | 'Fisiología' | 'Farmacología' | 'Laboratorio' | 'ECOE' | 'Casos Clínicos' | 'Apuntes';
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
  /** ISO timestamp used to rebuild daily summaries across app restarts. */
  createdAt?: string;
}

export interface TutorMemoryNote {
  id: string;
  category: 'aprendizaje' | 'emocional' | 'acuerdo';
  text: string;
  createdAt: string;
}

export interface TutorSessionSummary {
  id: string;
  date: string;
  tutorPersona: string;
  learning: string;
  emotional: string;
  agreements: string;
  updatedAt: string;
}

export interface TutorCouncilMemo {
  id: string;
  date: string;
  from: string;
  text: string;
}

// -------------------------------------------------------------
// A. Atajos Rápidos
// -------------------------------------------------------------
export interface QuickLink {
  id: string;
  name: string;
  category: 'uclm' | 'viajes' | 'estudio' | 'salud' | 'utilidades';
  url: string;
  description: string;
  badge?: string;
  iconName?: string;
  isCustom?: boolean;
}

// -------------------------------------------------------------
// B. Estudio Avanzado
// -------------------------------------------------------------
export interface SpacedCardReview {
  id: string;
  questionId: string;
  box: 1 | 2 | 3 | 4; // 1: Hoy, 2: +1 día, 3: +3 días, 4: +7 días (dominada)
  intervalDays: number;
  repetitions: number;
  lastReviewedDate?: string;
  nextReviewDate: string;
}

export interface StudyPlanGoal {
  id: string;
  examId?: string;
  subject: string;
  examDate: string;
  totalTopics: number;
  hoursPerDay: number;
  completedTopics: number[];
  schedule: {
    dayIndex: number;
    date: string;
    action: string;
    isReview?: boolean;
    done: boolean;
  }[];
  createdAt: string;
}

export interface SavedNoteSummary {
  id: string;
  title: string;
  subject: string;
  rawText: string;
  executiveSummary: string;
  keyConcepts: string[];
  normalValuesAndTables?: string;
  clinicalMnemonics: string[];
  typicalExamQuestions: string[];
  pocketTip?: string;
  createdAt: string;
}

export interface VirtualPatientCase {
  id: string;
  title: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  category: string;
  summary: string;
  patient: {
    name: string;
    age: number;
    gender: 'Mujer' | 'Hombre';
    bed: string;
    service: string;
    allergies: string[];
    history: string[];
    chiefComplaint: string;
    initialVitals: {
      bp: string;
      hr: number;
      rr: number;
      spo2: number;
      temp: number;
      painEva: number;
      glycemia?: number;
    };
  };
  stages: {
    stageIndex: number;
    scenarioText: string;
    vitals: {
      bp: string;
      hr: number;
      rr: number;
      spo2: number;
      temp: number;
      painEva: number;
    };
    recommendedActions: string[];
    criticalPitfalls: string[];
    teacherDebrief: string;
  }[];
}

// -------------------------------------------------------------
// C. Enfermería (CIMA, Escalas, RCP, Anatomía, NANDA)
// -------------------------------------------------------------
export interface CimaMedicamento {
  nregistro: string;
  nombre: string;
  pactivos: string;
  labtitular: string;
  cpst?: boolean; // Con receta médica
  comerc?: boolean; // Comercializado
  triangulo?: boolean; // Seguimiento adicional
  huerfano?: boolean;
  fotos?: { tipo: string; url: string }[];
  viasAdministracion?: { nombre: string }[];
  formaFarmaceutica?: { nombre: string };
  dosis?: string;
  tieneFichaTecnica?: boolean;
  tieneProspecto?: boolean;
  urlFichaTecnica?: string;
  urlProspecto?: string;
}

export interface NandaItem {
  code: string;
  domain: string;
  domainNumber: number;
  class: string;
  label: string;
  definition: string;
  relatedFactors: string[];
  definingCharacteristics: string[];
  nocSuggestions: { code: string; label: string; indicators: string[] }[];
  nicSuggestions: { code: string; label: string; activities: string[] }[];
}

// -------------------------------------------------------------
// D. Vida Diaria (Viajes, Presupuesto, Maleta, Piso, Documentos)
// -------------------------------------------------------------
export interface LuggageCheckItem {
  id: string;
  name: string;
  category: 'Ropa & Aseo' | 'Estudio & Tecnología' | 'Salud & Documentos' | 'Casa & Tuppers';
  tripType: 'weekend' | 'vacation' | 'all';
  checked: boolean;
}

export interface ExpenseSplitItem {
  id: string;
  concept: string;
  title?: string;
  amount: number;
  paidBy: string; // 'Julia', 'Marta', 'Lucía'
  splitWith: string[]; // ['Julia', 'Marta', 'Lucía']
  splitAmong?: string[];
  category: 'Alquiler' | 'Suministros (Luz/Gas/Agua)' | 'Internet/WiFi' | 'Compra Común' | 'Otros';
  date: string;
  settled: boolean;
}

export interface DocumentVaultItem {
  id: string;
  type: 'dni' | 'tarjeta_sanitaria' | 'contrato_piso' | 'carnet_uclm' | 'otro';
  title: string;
  identifierNumber: string;
  holderName: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  notes?: string;
  alertDaysBefore?: number;
}

export interface PersonalMedication {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  notes?: string;
  active: boolean;
  lastTakenDate?: string;
}

export interface PersonalAppointment {
  id: string;
  title: string;
  doctorOrCenter: string;
  date: string;
  time: string;
  location: string;
  specialty: string;
  notes?: string;
  completed: boolean;
}

export interface CourseDeadline {
  id: string;
  title: string;
  category: 'Becas' | 'Matrícula' | 'Prácticas' | 'Exámenes' | 'UCLM';
  startDate: string;
  endDate: string;
  description: string;
  officialUrl?: string;
  urgent?: boolean;
}

// -------------------------------------------------------------
// Nuevas herramientas de aprendizaje y organización (v4)
// -------------------------------------------------------------
export interface StudyBlock {
  id: string;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  kind: 'Estudio' | 'Descanso' | 'Personal';
  done: boolean;
  notes?: string;
}

export interface ScientificReference {
  id: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  pmid: string;
  url: string;
  database: string;
  consultedAt: string;
  summary: string;
  tags: string[];
}

export interface PICOQuestion {
  id: string;
  title: string;
  population: string;
  intervention: string;
  comparison: string;
  outcome: string;
  question: string;
  keywords: string;
  createdAt: string;
}

export interface CriticalAppraisal {
  id: string;
  referenceId: string;
  design: string;
  objective: string;
  sample: string;
  results: string;
  limitations: string;
  bias: string;
  applicability: string;
  confidence: 'Alta' | 'Moderada' | 'Baja' | 'No valorada';
  createdAt: string;
}

export interface PracticeRotation {
  id: string;
  title: string;
  area: string;
  startDate: string;
  endDate: string;
  objectives: string;
  hoursCompleted?: number;
  status: 'Planificada' | 'En curso' | 'Finalizada';
}

export interface PracticeLearningEntry {
  id: string;
  rotationId: string;
  date: string;
  context: string;
  learned: string;
  difficulties: string;
  nextSteps: string;
  competencyId?: string;
  privacyConfirmed: boolean;
}

export interface EcoeTrainingResult {
  id: string;
  stationId: string;
  date: string;
  score: number;
  maxScore: number;
  reviewedItems: number;
  totalItems: number;
  criticalIssues: string[];
  improvementNotes: string;
}

export interface ClinicalSourceRecord {
  id: string;
  name: string;
  organization: string;
  url: string;
  documentType: string;
  publishedAt: string;
  version: string;
  lastCheckedAt: string;
  nextReviewAt: string;
  status: 'Pendiente de revisión' | 'Verificada' | 'Necesita revisión' | 'Sustituida' | 'Retirada';
  license: string;
  reviewer: string;
  topics: string;
  notes: string;
}

export interface TFGProject {
  id: string;
  title: string;
  area: string;
  tutor: string;
  startDate: string;
  dueDate: string;
  description: string;
  status: 'Idea' | 'En preparación' | 'En desarrollo' | 'En revisión' | 'Entregado';
  question: string;
  objectives: string;
  keywords: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  referenceIds?: string[];
}

export interface TFGMilestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  notes: string;
}

export interface TFGMeeting {
  id: string;
  projectId: string;
  date: string;
  topic: string;
  actions: string;
  nextMeeting: string;
}

export interface DestinationShortcut {
  id: string;
  name: string;
  category: 'Universidad' | 'Transporte' | 'Prácticas' | 'Personal';
  address: string;
  notes: string;
}

export type NoteCategory =
  | 'Apuntes de clase'
  | 'Diapositivas / PDF'
  | 'Esquema'
  | 'Guía / Protocolo'
  | 'Prácticas'
  | 'Otro';

export interface StudentNote {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  topic: string;
  category: NoteCategory;
  content: string;
  fileName?: string;
  fileMimeType?: string;
  fileSize?: number;
  hasAttachment?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

