import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import {
  Subject,
  Drug,
  MedicalTerm,
  ExamReminder,
  ClinicalPracticeShift,
  PocketCheckItem,
  ClinicalManual,
  Task,
  CalendarEvent,
  GradeEntry,
  CarePlan,
  SbarReport,
  ClinicalCompetency,
  GibbsReflection,
  QuizQuestion,
  SpacedCardReview,
  StudyPlanGoal,
  SavedNoteSummary,
  QuickLink,
  LuggageCheckItem,
  ExpenseSplitItem,
  DocumentVaultItem,
  PersonalMedication,
  PersonalAppointment,
  CourseDeadline,
} from '../types';
import { UCLM_NURSING_CURRICULUM } from '../data/uclm/curriculum';
import { INITIAL_DRUGS } from '../data/pharmacology';
import { MEDICAL_TERMINOLOGY } from '../data/terminology';
import { INITIAL_EXAMS, INITIAL_PRACTICE_SHIFTS, DEFAULT_POCKET_CHECKLIST } from '../data/reminders';
import { CLINICAL_MANUALS } from '../data/clinicalManuals';
import { INITIAL_COMPETENCIES } from '../data/clinical/competencies';
import { SELF_EVALUATION_QUESTIONS } from '../data/selfEvaluation';
import { INITIAL_QUICK_LINKS } from '../data/quickLinks';
import { DEFAULT_LUGGAGE_CHECKLIST } from '../data/luggageChecklist';
import { OFFICIAL_COURSE_DEADLINES } from '../data/courseDeadlines';

const STORAGE_KEY = 'campusEnfermeriaToledo_v2';
// Versión de los datos guardados. Los guardados con una versión anterior se "limpian" de ejemplos al cargarse.
const DATA_VERSION = 3;

export interface CampusState {
  dataVersion?: number;
  subjects: Subject[];
  drugs: Drug[];
  terms: MedicalTerm[];
  exams: ExamReminder[];
  shifts: ClinicalPracticeShift[];
  pocketChecklist: PocketCheckItem[];
  manuals: ClinicalManual[];
  tasks: Task[];
  events: CalendarEvent[];
  grades: GradeEntry[];
  carePlans: CarePlan[];
  sbarReports: SbarReport[];
  practiceHoursTarget: number;
  clinicalProcedures: Record<string, number>;
  wellbeing: Record<string, { mood?: number; energy?: number; sleep?: string; note?: string }>;
  habits: { id: number; name: string }[];
  habitLogs: Record<string, number[]>; // date -> habit IDs
  parentMessage: string;
  studentName: string;
  budget: number;
  expenses: { id: number; concept: string; amount: number; category: string; date: string }[];
  competencies: ClinicalCompetency[];
  reflections: GibbsReflection[];
  ecoeScores: Record<string, { lastScore: number; bestScore: number; completedAt: string; passed: boolean }>;
  quizStats: {
    totalQuizzes: number;
    totalCorrect: number;
    totalAnswered: number;
    bestScorePercent: number;
    history: { date: string; subject: string; score: number; total: number }[];
  };
  quizQuestions: QuizQuestion[];
  spacedReviews: Record<string, SpacedCardReview>;
  studyStreak: {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
    totalStudyMinutes: number;
  };
  studyPlans: StudyPlanGoal[];
  savedSummaries: SavedNoteSummary[];
  quickLinks: QuickLink[];
  luggageChecklist: LuggageCheckItem[];
  roommates: string[];
  roommateExpenses: ExpenseSplitItem[];
  documentVault: DocumentVaultItem[];
  personalMeds: PersonalMedication[];
  personalAppointments: PersonalAppointment[];
  courseDeadlines: CourseDeadline[];
}

function getInitialDatePlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Datos de EJEMPLO: es lo que se ve en el modo Demo (solo lectura)
const DEMO_STATE: CampusState = {
  subjects: UCLM_NURSING_CURRICULUM,
  drugs: INITIAL_DRUGS,
  terms: MEDICAL_TERMINOLOGY,
  exams: INITIAL_EXAMS,
  shifts: INITIAL_PRACTICE_SHIFTS,
  pocketChecklist: DEFAULT_POCKET_CHECKLIST,
  manuals: CLINICAL_MANUALS,
  tasks: [
    { id: 1, title: 'Repasar la técnica estéril del sondaje vesical', subject: 'Fundamentos de Enfermería I', date: getInitialDatePlus(1), done: false, priority: 'Alta' },
    { id: 2, title: 'Memorizar los 10 correctos de la medicación', subject: 'Farmacología', date: getInitialDatePlus(2), done: false, priority: 'Alta' },
    { id: 3, title: 'Practicar cálculos de goteo en macrogotero', subject: 'Farmacología', date: getInitialDatePlus(3), done: true, priority: 'Media' },
    { id: 4, title: 'Revisar planos anatómicos y ejes corporales', subject: 'Anatomía Humana', date: getInitialDatePlus(4), done: false, priority: 'Media' }
  ],
  events: [
    { id: 1, title: 'Clase de Anatomía Humana', date: getInitialDatePlus(0), time: '09:00', kind: 'Clase', location: 'Aula Magna 1.2' },
    { id: 2, title: 'Taller de Vía Venosa en Laboratorio de Habilidades', date: getInitialDatePlus(1), time: '11:00', kind: 'Prácticas', location: 'Laboratorio Simulación' },
    { id: 3, title: 'Sesión de Autoevaluación en Campus', date: getInitialDatePlus(2), time: '17:00', kind: 'Estudio' }
  ],
  grades: [
    { id: 1, subject: 'Anatomía Humana', name: 'Primer Parcial Teórico', grade: 8.5, weight: 30 },
    { id: 2, subject: 'Fundamentos de Enfermería I', name: 'Examen de Habilidades Clínicas', grade: 9.0, weight: 40 }
  ],
  carePlans: [],
  sbarReports: [],
  practiceHoursTarget: 150,
  clinicalProcedures: {
    'Toma de constantes vitales': 24,
    'Glucemia capilar': 16,
    'Higiene y aseo del paciente': 10,
    'Movilización y cambios posturales': 12,
    'Curas de heridas y UPP': 8,
    'Administración de medicación oral': 20,
    'Inyección SC / IM': 6,
    'Canalización de vía venosa periférica (VVP)': 3,
    'Extracción de sangre venosa': 5,
    'Sondaje vesical': 2,
    'Electrocardiograma (ECG)': 7,
    'Soporte Vital Básico en simulación': 4
  },
  wellbeing: {},
  habits: [
    { id: 1, name: 'Beber 2 L de agua durante el turno' },
    { id: 2, name: 'Repasar 15 min de farmacología o fichas' },
    { id: 3, name: 'Paseo al aire libre o deporte suave' },
    { id: 4, name: 'Descanso y desconexión antes de dormir' }
  ],
  habitLogs: {},
  parentMessage: 'Estoy inmensamente orgulloso de ti y de tu vocación por la enfermería. Con constancia, empatía y calma vas a ser una profesional maravillosa. Un día a la vez. ¡Te quiero muchísimo! 💚',
  studentName: 'Julia H. Carreras',
  budget: 300,
  expenses: [
    { id: 1, concept: 'Fonendoscopio Littmann y tijeras de mayo', amount: 85.0, category: 'Material', date: getInitialDatePlus(-5) },
    { id: 2, concept: 'Uniforme blanco y calzado sanitario', amount: 55.0, category: 'Uniforme', date: getInitialDatePlus(-3) },
    { id: 3, concept: 'Abono transporte Toledo', amount: 20.0, category: 'Transporte', date: getInitialDatePlus(-1) }
  ],
  competencies: INITIAL_COMPETENCIES,
  reflections: [
    {
      id: 'refl-1',
      date: getInitialDatePlus(-2),
      shiftContext: 'Prácticas simuladas en laboratorio de habilidades Fábrica de Armas',
      description: 'Canalización de vía venosa periférica con catéter 20G en maniquí de simulación avanzada.',
      feelings: 'Al principio sentí inquietud al estabilizar la vena, pero al observar el reflujo hemático en la cámara sentí gran satisfacción.',
      evaluation: 'Lo positivo fue respetar toda la asepsia y no contaminar la alargadera. Lo difícil fue calcular el ángulo de entrada con la piel algo tensa.',
      analysis: 'Es esencial fijar la vena con el pulgar de la mano no dominante para que no ruede, según el protocolo de Flebitis Zero.',
      conclusion: 'Podría haber palpado con más calma el trayecto venoso antes de desinfectar para estar aún más segura del calibre.',
      actionPlan: 'En la próxima sesión de simulación, palparé despacio y descenderé el ángulo inmediatamente al ver retorno antes de empujar la cánula.'
    }
  ],
  ecoeScores: {
    'ecoe-01': { lastScore: 90, bestScore: 90, completedAt: getInitialDatePlus(-4), passed: true },
    'ecoe-02': { lastScore: 85, bestScore: 85, completedAt: getInitialDatePlus(-2), passed: true }
  },
  quizStats: {
    totalQuizzes: 4,
    totalCorrect: 26,
    totalAnswered: 30,
    bestScorePercent: 92,
    history: []
  },
  quizQuestions: SELF_EVALUATION_QUESTIONS,
  spacedReviews: {},
  studyStreak: {
    currentStreak: 5,
    longestStreak: 12,
    lastStudyDate: new Date().toISOString().slice(0, 10),
    totalStudyMinutes: 340,
  },
  studyPlans: [],
  savedSummaries: [],
  quickLinks: INITIAL_QUICK_LINKS,
  luggageChecklist: DEFAULT_LUGGAGE_CHECKLIST,
  roommates: ['Julia', 'Marta', 'Lucía'],
  roommateExpenses: [
    {
      id: 'exp-1',
      concept: 'WiFi Fibra 600Mb Piso Toledo',
      amount: 30,
      paidBy: 'Julia',
      splitWith: ['Julia', 'Marta', 'Lucía'],
      category: 'Internet/WiFi',
      date: getInitialDatePlus(-4),
      settled: false,
    },
    {
      id: 'exp-2',
      concept: 'Productos de limpieza y papel cocina',
      amount: 18,
      paidBy: 'Marta',
      splitWith: ['Julia', 'Marta', 'Lucía'],
      category: 'Compra Común',
      date: getInitialDatePlus(-2),
      settled: true,
    },
  ],
  documentVault: [
    {
      id: 'doc-1',
      type: 'dni',
      title: 'DNI Español',
      identifierNumber: '00000000X',
      holderName: 'Julia H. Carreras',
      expiryDate: '2030-05-15',
      issuingAuthority: 'Policía Nacional',
    },
    {
      id: 'doc-2',
      type: 'tarjeta_sanitaria',
      title: 'Tarjeta Sanitaria (SESCAM)',
      identifierNumber: 'CLM000000000',
      holderName: 'Julia H. Carreras',
    },
    {
      id: 'doc-3',
      type: 'carnet_uclm',
      title: 'Carnet de Estudiante UCLM',
      identifierNumber: 'EXP-ENF-TO-2026',
      holderName: 'Julia H. Carreras',
      notes: 'Campus de Toledo Fábrica de Armas',
    },
  ],
  personalMeds: [
    {
      id: 'med-1',
      name: 'Complejo Vitamínico B + C',
      dose: '1 comprimido',
      schedule: 'Desayuno',
      active: true,
      lastTakenDate: new Date().toISOString().slice(0, 10),
    },
  ],
  personalAppointments: [
    {
      id: 'app-1',
      title: 'Revisión Odontología',
      doctorOrCenter: 'Clínica Dental Toledo',
      date: getInitialDatePlus(10),
      time: '16:30',
      location: 'Av. Reconquista 12',
      specialty: 'Dentista',
      completed: false,
    },
  ],
  courseDeadlines: OFFICIAL_COURSE_DEADLINES,
};

// ---------- Estado VACÍO: lo que ve una usuaria nueva ----------
const blankSubject = (subject: Subject): Subject => {
  const { grade: _grade, ...rest } = subject;
  return { ...rest, status: subject.year === 1 ? 'Matriculada' : 'Pendiente', progress: 0 };
};
const blankCompetencies = (list: ClinicalCompetency[]): ClinicalCompetency[] =>
  list.map((c) => ({ ...c, status: 'Pendiente', observations: undefined, evaluatedBy: undefined, updatedAt: undefined }));
const blankPocket = (list: PocketCheckItem[]): PocketCheckItem[] => list.map((i) => ({ ...i, checked: false }));
const zeroProcedures = (p: Record<string, number>) => Object.fromEntries(Object.keys(p).map((k) => [k, 0]));

export const EMPTY_STATE: CampusState = {
  ...DEMO_STATE,
  dataVersion: DATA_VERSION,
  subjects: UCLM_NURSING_CURRICULUM.map(blankSubject),
  exams: [],
  shifts: [],
  pocketChecklist: blankPocket(DEFAULT_POCKET_CHECKLIST),
  tasks: [],
  events: [],
  grades: [],
  expenses: [],
  clinicalProcedures: zeroProcedures(DEMO_STATE.clinicalProcedures),
  competencies: blankCompetencies(INITIAL_COMPETENCIES),
  reflections: [],
  ecoeScores: {},
  quizStats: { totalQuizzes: 0, totalCorrect: 0, totalAnswered: 0, bestScorePercent: 0, history: [] },
};
export { DEMO_STATE };

// Quita de unos datos guardados antiguos los ejemplos que no se hayan tocado, y conserva lo que la usuaria haya escrito.
export function stripDemoData(saved: any): any {
  const out: any = { ...saved };
  const notDemo = (list: any, demo: { id: string | number }[]) =>
    Array.isArray(list) ? list.filter((item) => !demo.some((d) => d.id === item.id)) : list;

  out.exams = notDemo(saved.exams, INITIAL_EXAMS);
  out.shifts = notDemo(saved.shifts, INITIAL_PRACTICE_SHIFTS);
  out.tasks = notDemo(saved.tasks, DEMO_STATE.tasks);
  out.events = notDemo(saved.events, DEMO_STATE.events);
  out.expenses = notDemo(saved.expenses, DEMO_STATE.expenses);
  out.grades = Array.isArray(saved.grades)
    ? saved.grades.filter((g: any) => !DEMO_STATE.grades.some((d) => d.id === g.id && d.name === g.name))
    : saved.grades;
  out.reflections = Array.isArray(saved.reflections)
    ? saved.reflections.filter((r: any) => r.id !== 'refl-1')
    : saved.reflections;

  if (saved.ecoeScores) {
    const scores = { ...saved.ecoeScores };
    for (const [id, demo] of Object.entries(DEMO_STATE.ecoeScores)) {
      const cur = scores[id];
      if (cur && cur.lastScore === demo.lastScore && cur.bestScore === demo.bestScore && cur.passed === demo.passed) {
        delete scores[id];
      }
    }
    out.ecoeScores = scores;
  }

  const q = saved.quizStats;
  const dq = DEMO_STATE.quizStats;
  if (q && q.totalQuizzes >= dq.totalQuizzes && q.totalCorrect >= dq.totalCorrect && q.totalAnswered >= dq.totalAnswered) {
    const history = Array.isArray(q.history) ? q.history : [];
    out.quizStats = {
      totalQuizzes: q.totalQuizzes - dq.totalQuizzes,
      totalCorrect: q.totalCorrect - dq.totalCorrect,
      totalAnswered: q.totalAnswered - dq.totalAnswered,
      bestScorePercent: history.reduce((m: number, h: any) => Math.max(m, h.total ? Math.round((h.score / h.total) * 100) : 0), 0),
      history,
    };
  }

  if (Array.isArray(saved.pocketChecklist)) {
    const untouched =
      DEFAULT_POCKET_CHECKLIST.length === saved.pocketChecklist.length &&
      DEFAULT_POCKET_CHECKLIST.every((d) => saved.pocketChecklist.find((i: any) => i.id === d.id)?.checked === d.checked);
    if (untouched) out.pocketChecklist = blankPocket(DEFAULT_POCKET_CHECKLIST);
  }

  if (Array.isArray(saved.competencies)) {
    const untouched =
      INITIAL_COMPETENCIES.length === saved.competencies.length &&
      INITIAL_COMPETENCIES.every((d) => saved.competencies.find((c: any) => c.id === d.id)?.status === d.status);
    if (untouched) out.competencies = blankCompetencies(INITIAL_COMPETENCIES);
  }

  if (saved.clinicalProcedures) {
    const untouched = Object.entries(DEMO_STATE.clinicalProcedures).every(([k, v]) => saved.clinicalProcedures[k] === v);
    if (untouched) out.clinicalProcedures = zeroProcedures(DEMO_STATE.clinicalProcedures);
  }

  // La lista antigua de 10 asignaturas se sustituye por el plan completo (editable)
  delete out.subjects;
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

// Convierte unos datos guardados en un estado completo (función pura, fácil de probar)
export function loadSavedState(raw: string | null): CampusState {
  if (!raw) return EMPTY_STATE;
  const parsed = JSON.parse(raw);
  const data = parsed.dataVersion === DATA_VERSION ? parsed : stripDemoData(parsed);
  return {
    ...EMPTY_STATE,
    ...data,
    dataVersion: DATA_VERSION,
    studentName: 'Julia H. Carreras',
    // Una lista vacía de asignaturas o reflexiones es válida (la usuaria las borró)
    subjects: Array.isArray(data.subjects) ? data.subjects : EMPTY_STATE.subjects,
    reflections: Array.isArray(data.reflections) ? data.reflections : [],
    drugs: data.drugs?.length ? data.drugs : EMPTY_STATE.drugs,
    terms: data.terms?.length ? data.terms : EMPTY_STATE.terms,
    manuals: data.manuals?.length ? data.manuals : EMPTY_STATE.manuals,
    competencies: data.competencies?.length ? data.competencies : EMPTY_STATE.competencies,
    ecoeScores: data.ecoeScores || {},
    quizQuestions: Array.isArray(data.quizQuestions) && data.quizQuestions.length ? data.quizQuestions : SELF_EVALUATION_QUESTIONS,
    spacedReviews: data.spacedReviews || {},
    studyStreak: data.studyStreak || { currentStreak: 0, longestStreak: 0, lastStudyDate: '', totalStudyMinutes: 0 },
    studyPlans: Array.isArray(data.studyPlans) ? data.studyPlans : [],
    savedSummaries: Array.isArray(data.savedSummaries) ? data.savedSummaries : [],
    quickLinks: Array.isArray(data.quickLinks) && data.quickLinks.length ? data.quickLinks : INITIAL_QUICK_LINKS,
    luggageChecklist: Array.isArray(data.luggageChecklist) && data.luggageChecklist.length ? data.luggageChecklist : DEFAULT_LUGGAGE_CHECKLIST,
    roommates: Array.isArray(data.roommates) && data.roommates.length ? data.roommates : ['Julia', 'Marta', 'Lucía'],
    roommateExpenses: Array.isArray(data.roommateExpenses) ? data.roommateExpenses : [],
    documentVault: Array.isArray(data.documentVault) ? data.documentVault : [],
    personalMeds: Array.isArray(data.personalMeds) ? data.personalMeds : [],
    personalAppointments: Array.isArray(data.personalAppointments) ? data.personalAppointments : [],
    courseDeadlines: Array.isArray(data.courseDeadlines) && data.courseDeadlines.length ? data.courseDeadlines : OFFICIAL_COURSE_DEADLINES,
  };
}

// ---------- Modo Demo (solo lectura) ----------
let demoActive = false;
const demoListeners = new Set<() => void>();
export const DEMO_BLOCKED_EVENT = 'campus-demo-blocked';
export const isDemoMode = () => demoActive;
export function setDemoMode(active: boolean) {
  if (demoActive === active) return;
  demoActive = active;
  demoListeners.forEach((listener) => listener());
}
const subscribeDemo = (listener: () => void) => {
  demoListeners.add(listener);
  return () => {
    demoListeners.delete(listener);
  };
};
export const useDemoMode = () => useSyncExternalStore(subscribeDemo, isDemoMode);

export function useCampusStore() {
  // En modo Demo se muestran los datos de ejemplo, no se guarda nada y los cambios se bloquean
  const demoInstance = useRef(demoActive).current;
  const [state, setState] = useState<CampusState>(() => {
    if (demoInstance) return DEMO_STATE;
    try {
      return loadSavedState(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      console.warn('Error loading campus store from localStorage', e);
    }
    return EMPTY_STATE;
  });

  useEffect(() => {
    if (demoInstance) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving campus store to localStorage', e);
    }
  }, [state]);

  const updateState = (updater: (prev: CampusState) => CampusState) => {
    if (demoInstance) {
      window.dispatchEvent(new Event(DEMO_BLOCKED_EVENT));
      return;
    }
    setState((prev) => updater(prev));
  };

  // Drugs operations
  const addDrug = (newDrug: Omit<Drug, 'id'>) => {
    const drug: Drug = {
      ...newDrug,
      id: 'custom-' + Date.now(),
      isCustom: true
    };
    updateState(prev => ({
      ...prev,
      drugs: [drug, ...prev.drugs]
    }));
  };

  const removeDrug = (id: string) => {
    updateState(prev => ({
      ...prev,
      drugs: prev.drugs.filter(d => d.id !== id)
    }));
  };

  // Exam operations
  const addExam = (exam: Omit<ExamReminder, 'id' | 'completed'>) => {
    const newExam: ExamReminder = {
      ...exam,
      id: 'exam-' + Date.now(),
      completed: false
    };
    updateState(prev => ({
      ...prev,
      exams: [...prev.exams, newExam]
    }));
  };

  const toggleExamCompleted = (id: string) => {
    updateState(prev => ({
      ...prev,
      exams: prev.exams.map(e => e.id === id ? { ...e, completed: !e.completed } : e)
    }));
  };

  const removeExam = (id: string) => {
    updateState(prev => ({
      ...prev,
      exams: prev.exams.filter(e => e.id !== id)
    }));
  };

  // Shifts operations
  const addShift = (shift: Omit<ClinicalPracticeShift, 'id' | 'completed'>) => {
    const newShift: ClinicalPracticeShift = {
      ...shift,
      id: 'shift-' + Date.now(),
      completed: false
    };
    updateState(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift]
    }));
  };

  const toggleShiftCompleted = (id: string) => {
    updateState(prev => ({
      ...prev,
      shifts: prev.shifts.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    }));
  };

  const removeShift = (id: string) => {
    updateState(prev => ({
      ...prev,
      shifts: prev.shifts.filter(s => s.id !== id)
    }));
  };

  // Checklist operations
  const togglePocketItem = (id: string) => {
    updateState(prev => ({
      ...prev,
      pocketChecklist: prev.pocketChecklist.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const resetPocketChecklist = () => {
    updateState(prev => ({
      ...prev,
      pocketChecklist: prev.pocketChecklist.map(item => ({ ...item, checked: false }))
    }));
  };

  // Clinical procedures counters
  const incrementProcedure = (name: string, delta: number) => {
    updateState(prev => ({
      ...prev,
      clinicalProcedures: {
        ...prev.clinicalProcedures,
        [name]: Math.max(0, (prev.clinicalProcedures[name] || 0) + delta)
      }
    }));
  };

  // Self Evaluation stats
  const recordQuizResult = (subject: string, correct: number, total: number) => {
    const percent = Math.round((correct / total) * 100);
    updateState(prev => {
      const newTotalAnswered = prev.quizStats.totalAnswered + total;
      const newTotalCorrect = prev.quizStats.totalCorrect + correct;
      const newBestScore = Math.max(prev.quizStats.bestScorePercent, percent);
      const newHistory = [
        { date: new Date().toISOString().slice(0, 10), subject, score: correct, total },
        ...prev.quizStats.history
      ].slice(0, 15);

      return {
        ...prev,
        quizStats: {
          totalQuizzes: prev.quizStats.totalQuizzes + 1,
          totalCorrect: newTotalCorrect,
          totalAnswered: newTotalAnswered,
          bestScorePercent: newBestScore,
          history: newHistory
        }
      };
    });
  };

  // Parent supportive message
  const updateParentMessage = (message: string) => {
    updateState(prev => ({ ...prev, parentMessage: message }));
  };

  // Manual offline toggle
  const toggleManualOffline = (id: string) => {
    updateState(prev => ({
      ...prev,
      manuals: prev.manuals.map(m => m.id === id ? { ...m, offlineReady: !m.offlineReady } : m)
    }));
  };

  // Competencies operations
  const updateCompetencyStatus = (id: string, status: ClinicalCompetency['status'], observations?: string) => {
    updateState(prev => ({
      ...prev,
      competencies: prev.competencies.map(c =>
        c.id === id
          ? {
              ...c,
              status,
              observations: observations !== undefined ? observations : c.observations,
              updatedAt: new Date().toISOString().slice(0, 10)
            }
          : c
      )
    }));
  };

  // Gibbs Reflection operations
  const addGibbsReflection = (reflection: Omit<GibbsReflection, 'id'>) => {
    const newRefl: GibbsReflection = {
      ...reflection,
      id: 'refl-' + Date.now()
    };
    updateState(prev => ({
      ...prev,
      reflections: [newRefl, ...prev.reflections]
    }));
  };

  const removeGibbsReflection = (id: string) => {
    updateState(prev => ({
      ...prev,
      reflections: prev.reflections.filter(r => r.id !== id)
    }));
  };

  // ECOE scoring
  const recordEcoeScore = (stationId: string, score: number, passed: boolean) => {
    updateState(prev => {
      const existing = prev.ecoeScores[stationId];
      return {
        ...prev,
        ecoeScores: {
          ...prev.ecoeScores,
          [stationId]: {
            lastScore: score,
            bestScore: existing ? Math.max(existing.bestScore, score) : score,
            completedAt: new Date().toISOString().slice(0, 10),
            passed
          }
        }
      };
    });
  };

  // Academic subject status update
  // Subject operations (el plan de estudios es editable)
  const addSubject = (data: Omit<Subject, 'code'> & { code?: string }) => {
    updateState(prev => {
      let code = (data.code || '').trim() || 'ASIG-' + Date.now();
      while (prev.subjects.some(s => s.code === code)) code += '-2';
      return { ...prev, subjects: [...prev.subjects, { ...data, code }] };
    });
  };

  const updateSubject = (code: string, patch: Partial<Subject>) => {
    updateState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => (s.code === code ? { ...s, ...patch } : s))
    }));
  };

  const removeSubject = (code: string) => {
    updateState(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.code !== code)
    }));
  };

  const updateSubjectStatus = (code: string, status: Subject['status'], grade?: number) => {
    updateSubject(code, { status, ...(grade !== undefined ? { grade } : {}) });
  };

  // --- Quiz Questions Bank ---
  const addQuizQuestion = (q: Omit<QuizQuestion, 'id'>) => {
    const newQ: QuizQuestion = {
      ...q,
      id: 'custom-q-' + Date.now(),
    };
    updateState(prev => ({
      ...prev,
      quizQuestions: [newQ, ...prev.quizQuestions],
    }));
  };

  const updateQuizQuestion = (id: string, patch: Partial<QuizQuestion>) => {
    updateState(prev => ({
      ...prev,
      quizQuestions: prev.quizQuestions.map(q => q.id === id ? { ...q, ...patch } : q),
    }));
  };

  const removeQuizQuestion = (id: string) => {
    updateState(prev => ({
      ...prev,
      quizQuestions: prev.quizQuestions.filter(q => q.id !== id),
    }));
  };

  const resetQuizQuestions = () => {
    updateState(prev => ({
      ...prev,
      quizQuestions: SELF_EVALUATION_QUESTIONS,
    }));
  };

  // --- Spaced Repetition (Flashcards) ---
  const reviewSpacedCard = (questionId: string, rating: 'easy' | 'good' | 'hard' | 'again') => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    updateState(prev => {
      const current = prev.spacedReviews[questionId] || {
        id: 'sr-' + questionId,
        questionId,
        box: 1,
        intervalDays: 1,
        repetitions: 0,
        nextReviewDate: todayStr,
      };

      let nextBox: 1 | 2 | 3 | 4 = current.box;
      let interval = 1;

      if (rating === 'again') {
        nextBox = 1;
        interval = 0; // hoy
      } else if (rating === 'hard') {
        nextBox = Math.max(1, current.box - 1) as 1 | 2 | 3 | 4;
        interval = 1;
      } else if (rating === 'good') {
        nextBox = Math.min(4, current.box + 1) as 1 | 2 | 3 | 4;
        interval = nextBox === 2 ? 1 : nextBox === 3 ? 3 : 7;
      } else if (rating === 'easy') {
        nextBox = Math.min(4, current.box + 2) as 1 | 2 | 3 | 4;
        interval = nextBox === 3 ? 3 : 7;
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);

      return {
        ...prev,
        spacedReviews: {
          ...prev.spacedReviews,
          [questionId]: {
            ...current,
            box: nextBox,
            intervalDays: interval,
            repetitions: current.repetitions + 1,
            lastReviewedDate: todayStr,
            nextReviewDate: nextDate.toISOString().slice(0, 10),
          },
        },
      };
    });
  };

  // --- Study Streak & Time ---
  const recordStudyActivity = (minutes: number = 15) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    updateState(prev => {
      const streak = prev.studyStreak || { currentStreak: 0, longestStreak: 0, lastStudyDate: '', totalStudyMinutes: 0 };
      if (streak.lastStudyDate === todayStr) {
        return {
          ...prev,
          studyStreak: {
            ...streak,
            totalStudyMinutes: (streak.totalStudyMinutes || 0) + minutes,
          },
        };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const isConsecutive = streak.lastStudyDate === yesterdayStr;
      const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
      const newLongest = Math.max(streak.longestStreak || 0, newCurrent);

      return {
        ...prev,
        studyStreak: {
          currentStreak: newCurrent,
          longestStreak: newLongest,
          lastStudyDate: todayStr,
          totalStudyMinutes: (streak.totalStudyMinutes || 0) + minutes,
        },
      };
    });
  };

  // --- Study Plans ---
  const addStudyPlan = (plan: Omit<StudyPlanGoal, 'id' | 'createdAt'>) => {
    const newPlan: StudyPlanGoal = {
      ...plan,
      id: 'plan-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    updateState(prev => ({
      ...prev,
      studyPlans: [newPlan, ...prev.studyPlans],
    }));
  };

  const toggleStudyPlanStep = (planId: string, dayIndex: number) => {
    updateState(prev => ({
      ...prev,
      studyPlans: prev.studyPlans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          schedule: p.schedule.map(s => s.dayIndex === dayIndex ? { ...s, done: !s.done } : s),
        };
      }),
    }));
  };

  const deleteStudyPlan = (planId: string) => {
    updateState(prev => ({
      ...prev,
      studyPlans: prev.studyPlans.filter(p => p.id !== planId),
    }));
  };

  // --- Summaries ---
  const saveNoteSummary = (summary: Omit<SavedNoteSummary, 'id' | 'createdAt'>) => {
    const newSum: SavedNoteSummary = {
      ...summary,
      id: 'sum-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    updateState(prev => ({
      ...prev,
      savedSummaries: [newSum, ...prev.savedSummaries],
    }));
  };

  const deleteNoteSummary = (id: string) => {
    updateState(prev => ({
      ...prev,
      savedSummaries: prev.savedSummaries.filter(s => s.id !== id),
    }));
  };

  // --- Quick Links ---
  const addQuickLink = (link: Omit<QuickLink, 'id'>) => {
    const newLink: QuickLink = {
      ...link,
      id: 'link-' + Date.now(),
      isCustom: true,
    };
    updateState(prev => ({
      ...prev,
      quickLinks: [newLink, ...prev.quickLinks],
    }));
  };

  const deleteQuickLink = (id: string) => {
    updateState(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter(l => l.id !== id),
    }));
  };

  // --- Luggage Checklist ---
  const toggleLuggageItem = (id: string) => {
    updateState(prev => ({
      ...prev,
      luggageChecklist: prev.luggageChecklist.map(i => i.id === id ? { ...i, checked: !i.checked } : i),
    }));
  };

  const resetLuggageChecklist = () => {
    updateState(prev => ({
      ...prev,
      luggageChecklist: prev.luggageChecklist.map(i => ({ ...i, checked: false })),
    }));
  };

  // --- Roommate Expenses (Tricount style) ---
  const addRoommateExpense = (item: Omit<ExpenseSplitItem, 'id'>) => {
    const newExp: ExpenseSplitItem = {
      ...item,
      id: 'rexp-' + Date.now(),
    };
    updateState(prev => ({
      ...prev,
      roommateExpenses: [newExp, ...prev.roommateExpenses],
    }));
  };

  const toggleRoommateExpenseSettled = (id: string) => {
    updateState(prev => ({
      ...prev,
      roommateExpenses: prev.roommateExpenses.map(e => e.id === id ? { ...e, settled: !e.settled } : e),
    }));
  };

  const deleteRoommateExpense = (id: string) => {
    updateState(prev => ({
      ...prev,
      roommateExpenses: prev.roommateExpenses.filter(e => e.id !== id),
    }));
  };

  // --- Document Vault ---
  const addDocumentVaultItem = (doc: Omit<DocumentVaultItem, 'id'>) => {
    const newDoc: DocumentVaultItem = {
      ...doc,
      id: 'doc-' + Date.now(),
    };
    updateState(prev => ({
      ...prev,
      documentVault: [newDoc, ...prev.documentVault],
    }));
  };

  const updateDocumentVaultItem = (id: string, patch: Partial<DocumentVaultItem>) => {
    updateState(prev => ({
      ...prev,
      documentVault: prev.documentVault.map(d => d.id === id ? { ...d, ...patch } : d),
    }));
  };

  const deleteDocumentVaultItem = (id: string) => {
    updateState(prev => ({
      ...prev,
      documentVault: prev.documentVault.filter(d => d.id !== id),
    }));
  };

  // --- Personal Medication & Appointments ---
  const addPersonalMed = (med: Omit<PersonalMedication, 'id'>) => {
    const newMed: PersonalMedication = {
      ...med,
      id: 'med-' + Date.now(),
    };
    updateState(prev => ({
      ...prev,
      personalMeds: [...prev.personalMeds, newMed],
    }));
  };

  const togglePersonalMedTaken = (id: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    updateState(prev => ({
      ...prev,
      personalMeds: prev.personalMeds.map(m => {
        if (m.id !== id) return m;
        const taken = m.lastTakenDate === todayStr;
        return {
          ...m,
          lastTakenDate: taken ? undefined : todayStr,
        };
      }),
    }));
  };

  const deletePersonalMed = (id: string) => {
    updateState(prev => ({
      ...prev,
      personalMeds: prev.personalMeds.filter(m => m.id !== id),
    }));
  };

  const addPersonalAppointment = (app: Omit<PersonalAppointment, 'id' | 'completed'>) => {
    const newApp: PersonalAppointment = {
      ...app,
      id: 'app-' + Date.now(),
      completed: false,
    };
    updateState(prev => ({
      ...prev,
      personalAppointments: [...prev.personalAppointments, newApp],
    }));
  };

  const togglePersonalAppointmentCompleted = (id: string) => {
    updateState(prev => ({
      ...prev,
      personalAppointments: prev.personalAppointments.map(a => a.id === id ? { ...a, completed: !a.completed } : a),
    }));
  };

  const deletePersonalAppointment = (id: string) => {
    updateState(prev => ({
      ...prev,
      personalAppointments: prev.personalAppointments.filter(a => a.id !== id),
    }));
  };

  return {
    state,
    updateState,
    addDrug,
    removeDrug,
    addExam,
    toggleExamCompleted,
    removeExam,
    addShift,
    toggleShiftCompleted,
    removeShift,
    togglePocketItem,
    resetPocketChecklist,
    incrementProcedure,
    recordQuizResult,
    updateParentMessage,
    toggleManualOffline,
    updateCompetencyStatus,
    addGibbsReflection,
    removeGibbsReflection,
    recordEcoeScore,
    updateSubjectStatus,
    addSubject,
    updateSubject,
    removeSubject,
    addQuizQuestion,
    updateQuizQuestion,
    removeQuizQuestion,
    resetQuizQuestions,
    reviewSpacedCard,
    recordStudyActivity,
    addStudyPlan,
    toggleStudyPlanStep,
    deleteStudyPlan,
    saveNoteSummary,
    deleteNoteSummary,
    addQuickLink,
    deleteQuickLink,
    toggleLuggageItem,
    resetLuggageChecklist,
    addRoommateExpense,
    toggleRoommateExpenseSettled,
    deleteRoommateExpense,
    addDocumentVaultItem,
    updateDocumentVaultItem,
    deleteDocumentVaultItem,
    addPersonalMed,
    togglePersonalMedTaken,
    deletePersonalMed,
    addPersonalAppointment,
    togglePersonalAppointmentCompleted,
    deletePersonalAppointment,
  };
}
