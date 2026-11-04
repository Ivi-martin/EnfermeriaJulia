import { useState, useEffect } from 'react';
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
} from '../types';
import { OFFICIAL_SUBJECTS } from '../data/subjects';
import { INITIAL_DRUGS } from '../data/pharmacology';
import { MEDICAL_TERMINOLOGY } from '../data/terminology';
import { INITIAL_EXAMS, INITIAL_PRACTICE_SHIFTS, DEFAULT_POCKET_CHECKLIST } from '../data/reminders';
import { CLINICAL_MANUALS } from '../data/clinicalManuals';
import { INITIAL_COMPETENCIES } from '../data/clinical/competencies';

const STORAGE_KEY = 'campusEnfermeriaToledo_v2';

export interface CampusState {
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
}

function getInitialDatePlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_STATE: CampusState = {
  subjects: OFFICIAL_SUBJECTS,
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
  }
};

export function useCampusStore() {
  const [state, setState] = useState<CampusState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          studentName: 'Julia H. Carreras',
          // Ensure arrays contain the defaults if missing
          subjects: parsed.subjects?.length ? parsed.subjects : DEFAULT_STATE.subjects,
          drugs: parsed.drugs?.length ? parsed.drugs : DEFAULT_STATE.drugs,
          terms: parsed.terms?.length ? parsed.terms : DEFAULT_STATE.terms,
          manuals: parsed.manuals?.length ? parsed.manuals : DEFAULT_STATE.manuals,
          competencies: parsed.competencies?.length ? parsed.competencies : DEFAULT_STATE.competencies,
          reflections: parsed.reflections?.length ? parsed.reflections : DEFAULT_STATE.reflections,
          ecoeScores: parsed.ecoeScores || DEFAULT_STATE.ecoeScores,
        };
      }
    } catch (e) {
      console.warn('Error loading campus store from localStorage', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving campus store to localStorage', e);
    }
  }, [state]);

  const updateState = (updater: (prev: CampusState) => CampusState) => {
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
  const updateSubjectStatus = (code: string, status: Subject['status'], grade?: number) => {
    updateState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.code === code ? { ...s, status, grade: grade !== undefined ? grade : s.grade } : s
      )
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
    updateSubjectStatus
  };
}
