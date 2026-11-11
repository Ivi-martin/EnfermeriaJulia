import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { QuizQuestion, StudyPlanGoal, SavedNoteSummary } from '../types';
import {
  Sparkles,
  BookOpen,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Layers,
  ChevronRight,
  Filter,
  Play,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Calendar,
  Flame,
  FileText,
  Search,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';

type ExamMode = 'quick10' | 'normal30' | 'timed' | 'mistakes';

export const AcademyView: React.FC = () => {
  const {
    state,
    recordQuizResult,
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
    deleteNoteSummary
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<
    'exams' | 'questionBank' | 'flashcards' | 'aiGenerator' | 'studyPlanner' | 'summaries' | 'stats'
  >('exams');

  // -------------------------------------------------------------
  // 1. Exam Simulator State
  // -------------------------------------------------------------
  const [examMode, setExamMode] = useState<ExamMode>('quick10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 min default

  const [mistakesHistory, setMistakesHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campus_mistakes_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campus_mistakes_ids', JSON.stringify(mistakesHistory));
    } catch {
      // ignore
    }
  }, [mistakesHistory]);

  useEffect(() => {
    if (!isExamActive || examFinished || examMode !== 'timed') return;
    if (timeRemaining <= 0) {
      finishExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamActive, examFinished, examMode, timeRemaining]);

  const questionsPool = state.quizQuestions && state.quizQuestions.length > 0
    ? state.quizQuestions
    : [];

  const subjectsList = ['Todas', ...Array.from(new Set(questionsPool.map((q) => q.subject)))];

  const startExam = (mode: ExamMode) => {
    setExamMode(mode);
    let pool = [...questionsPool];
    if (selectedSubject !== 'Todas') {
      pool = pool.filter((q) => q.subject === selectedSubject);
    }

    if (mode === 'mistakes') {
      if (mistakesHistory.length > 0) {
        pool = pool.filter((q) => mistakesHistory.includes(q.id));
      }
    }

    pool.sort(() => 0.5 - Math.random());

    let count = 10;
    if (mode === 'quick10') count = Math.min(10, pool.length);
    else if (mode === 'normal30') count = Math.min(30, pool.length);
    else if (mode === 'timed') {
      count = Math.min(20, pool.length);
      setTimeRemaining(900);
    } else if (mode === 'mistakes') {
      count = pool.length > 0 ? pool.length : 5;
    }

    const selected = pool.slice(0, count);
    if (selected.length === 0) {
      alert('No hay suficientes preguntas disponibles para este filtro.');
      return;
    }

    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setUserScore(0);
    setAnsweredCount(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExamFinished(false);
    setIsExamActive(true);
    recordStudyActivity(10);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);
    setAnsweredCount((prev) => prev + 1);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      setMistakesHistory((prev) => prev.filter((id) => id !== currentQ.id));
    } else {
      if (!mistakesHistory.includes(currentQ.id)) {
        setMistakesHistory((prev) => [...prev, currentQ.id]);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setExamFinished(true);
    setIsExamActive(false);
    recordQuizResult(selectedSubject, userScore, currentQuestions.length);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // -------------------------------------------------------------
  // 2. Question Bank Modal & Filter State
  // -------------------------------------------------------------
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubjectFilter, setBankSubjectFilter] = useState('Todas');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState({
    subject: 'Farmacología',
    category: 'Farmacología' as QuizQuestion['category'],
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    clinicalTip: '',
  });

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionFormData({
      subject: 'Farmacología',
      category: 'Farmacología',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      clinicalTip: '',
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: QuizQuestion) => {
    setEditingQuestionId(q.id);
    setQuestionFormData({
      subject: q.subject,
      category: q.category,
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      clinicalTip: q.clinicalTip || '',
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.question.trim()) return;
    if (questionFormData.options.some((o) => !o.trim())) {
      alert('Por favor completa las 4 opciones de respuesta.');
      return;
    }

    if (editingQuestionId) {
      updateQuizQuestion(editingQuestionId, questionFormData);
    } else {
      addQuizQuestion(questionFormData);
    }
    setIsQuestionModalOpen(false);
  };

  const filteredBankQuestions = questionsPool.filter((q) => {
    const matchesSubj = bankSubjectFilter === 'Todas' || q.subject === bankSubjectFilter;
    const term = bankSearch.toLowerCase();
    const matchesSearch =
      q.question.toLowerCase().includes(term) ||
      q.explanation.toLowerCase().includes(term) ||
      q.options.some((o) => o.toLowerCase().includes(term));
    return matchesSubj && matchesSearch;
  });

  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questionsPool, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'banco_preguntas_enfermeria_julia.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          parsed.forEach((q) => {
            if (q.question && Array.isArray(q.options)) {
              addQuizQuestion(q);
            }
          });
          alert(`¡Se han importado ${parsed.length} preguntas correctamente!`);
        }
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  // -------------------------------------------------------------
  // 3. Spaced Repetition (Flashcards) State
  // -------------------------------------------------------------
  const [flashcardFilter, setFlashcardFilter] = useState<'today' | 'all' | 'mastered'>('today');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  const flashcardsList = questionsPool.filter((q) => {
    const review = state.spacedReviews[q.id];
    if (flashcardFilter === 'mastered') {
      return review && review.box === 4;
    }
    if (flashcardFilter === 'today') {
      if (!review) return true; // nueva, pendiente de repaso
      return review.nextReviewDate <= todayStr;
    }
    return true; // 'all'
  });

  const activeCard = flashcardsList[currentCardIdx] || flashcardsList[0];
  const activeCardReview = activeCard ? state.spacedReviews[activeCard.id] : null;

  const handleReviewRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;
    reviewSpacedCard(activeCard.id, rating);
    setIsFlipped(false);
    recordStudyActivity(5);
    if (currentCardIdx + 1 < flashcardsList.length) {
      setCurrentCardIdx((prev) => prev + 1);
    } else {
      setCurrentCardIdx(0);
    }
  };

  // -------------------------------------------------------------
  // 4. AI Generator from Notes State
  // -------------------------------------------------------------
  const [aiNoteText, setAiNoteText] = useState('');
  const [aiGenType, setAiGenType] = useState<'quiz' | 'flashcards'>('quiz');
  const [aiCount, setAiCount] = useState<number>(5);
  const [aiSubject, setAiSubject] = useState('Farmacología');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const handleRunAiGeneration = async () => {
    if (!aiNoteText || aiNoteText.trim().length < 15) {
      alert('Pega al menos 15 caracteres de tus apuntes.');
      return;
    }
    setIsGeneratingAi(true);
    setAiSuccessMessage(null);
    try {
      const res = await fetch('/api/ai/generate-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiNoteText,
          type: aiGenType,
          count: aiCount,
          subject: aiSubject,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setGeneratedItems(data.items);
      } else {
        alert(data.error || 'Error al generar material con IA.');
      }
    } catch (err: any) {
      alert('Error de conexión con el servidor de IA.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveGeneratedToBank = () => {
    if (aiGenType === 'quiz') {
      generatedItems.forEach((item) => {
        addQuizQuestion({
          subject: item.subject || aiSubject,
          category: 'Farmacología',
          question: item.question,
          options: item.options,
          correctIndex: item.correctIndex,
          explanation: item.explanation,
          clinicalTip: item.clinicalTip,
        });
      });
      setAiSuccessMessage(`¡${generatedItems.length} preguntas guardadas en tu Banco de Preguntas!`);
    } else {
      generatedItems.forEach((item) => {
        addQuizQuestion({
          subject: item.subject || aiSubject,
          category: 'Fundamentos',
          question: item.front,
          options: [item.back, 'Opción B (Distractor)', 'Opción C', 'Opción D'],
          correctIndex: 0,
          explanation: item.back,
        });
      });
      setAiSuccessMessage(`¡${generatedItems.length} flashcards guardadas!`);
    }
    setGeneratedItems([]);
  };

  // -------------------------------------------------------------
  // 5. Study Planner from Exam Dates State
  // -------------------------------------------------------------
  const [planSubject, setPlanSubject] = useState(state.exams[0]?.subject || 'Anatomía Humana');
  const [planExamDate, setPlanExamDate] = useState(state.exams[0]?.date || '2027-01-15');
  const [planTotalTopics, setPlanTotalTopics] = useState(12);
  const [planHoursPerDay, setPlanHoursPerDay] = useState(3);

  const handleCreateStudyPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const examDate = new Date(planExamDate + 'T12:00:00');
    const diffDays = Math.max(1, Math.round((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Create schedule
    const schedule = [];
    const topicsPerDay = planTotalTopics / Math.max(1, diffDays - 3); // 3 days for final review
    let currentTopic = 1;

    for (let i = 0; i < diffDays; i++) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + i);
      const isReviewDay = i >= diffDays - 3;
      let action = '';

      if (isReviewDay) {
        action = `Vuelta de repaso final y simulacro 30Q`;
      } else {
        const targetTopic = Math.min(planTotalTopics, Math.round(currentTopic));
        action = `Estudiar Tema ${targetTopic} (${planHoursPerDay}h) y 10 preguntas test`;
        currentTopic += topicsPerDay;
      }

      schedule.push({
        dayIndex: i,
        date: dayDate.toISOString().slice(0, 10),
        action,
        isReview: isReviewDay,
        done: false,
      });
    }

    addStudyPlan({
      subject: planSubject,
      examDate: planExamDate,
      totalTopics: planTotalTopics,
      hoursPerDay: planHoursPerDay,
      completedTopics: [],
      schedule,
    });
  };

  // -------------------------------------------------------------
  // 6. Summaries with IA State
  // -------------------------------------------------------------
  const [summaryInputText, setSummaryInputText] = useState('');
  const [summarySubject, setSummarySubject] = useState('Anatomía Humana');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<any | null>(null);

  const handleGenerateSummary = async () => {
    if (!summaryInputText || summaryInputText.trim().length < 20) {
      alert('Pega al menos 20 caracteres de apuntes.');
      return;
    }
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summaryInputText, subject: summarySubject }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedSummary(data);
      } else {
        alert(data.error || 'Error al generar el resumen.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveSummaryToStore = () => {
    if (!generatedSummary) return;
    saveNoteSummary({
      title: generatedSummary.title || `Resumen de ${summarySubject}`,
      subject: summarySubject,
      rawText: summaryInputText,
      executiveSummary: generatedSummary.executiveSummary || generatedSummary.summary || '',
      keyConcepts: generatedSummary.keyConcepts || [],
      normalValuesAndTables: generatedSummary.normalValuesAndTables,
      clinicalMnemonics: generatedSummary.clinicalMnemonics || generatedSummary.mnemonics || [],
      typicalExamQuestions: generatedSummary.typicalExamQuestions || [],
      pocketTip: generatedSummary.pocketTip,
    });
    setGeneratedSummary(null);
    setSummaryInputText('');
    alert('¡Resumen guardado con éxito en tu biblioteca!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e3d2c] via-[#2d553e] to-[#12261b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>PLATAFORMA INTEGRAL DE ESTUDIO · CAMPUS ENFERMERÍA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Academia · Exámenes & Herramientas de Estudio
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Banco de preguntas 100% editable, simulador tipo test con 4 modos, repetición espaciada en flashcards (método Leitner), generador con IA desde texto de apuntes, planificador desde fecha de examen y esquemas clínicos.
            </p>
          </div>

          {/* Quick Streak & Success Rate Badge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="flex items-center gap-2 pr-3 border-r border-white/20">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-200 block">Racha</span>
                <strong className="text-lg font-black text-white">
                  {state.studyStreak?.currentStreak || 0} días
                </strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Acierto Global
              </span>
              <strong className="text-lg font-black text-white">
                {state.quizStats.totalAnswered > 0
                  ? Math.round((state.quizStats.totalCorrect / state.quizStats.totalAnswered) * 100)
                  : 0}%
              </strong>
              <span className="text-[10px] text-stone-300 block">
                {questionsPool.length} preguntas en tu banco
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => { setActiveTab('exams'); setIsExamActive(false); setExamFinished(false); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'exams' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Simulador Tests</span>
          </button>
          <button
            onClick={() => setActiveTab('questionBank')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'questionBank' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Banco Editable ({questionsPool.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'flashcards' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards Leitner</span>
          </button>
          <button
            onClick={() => setActiveTab('aiGenerator')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'aiGenerator' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Generador IA Apuntes</span>
          </button>
          <button
            onClick={() => setActiveTab('studyPlanner')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'studyPlanner' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planificador de Examen</span>
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'summaries' ? 'bg-white text-[#1e3b2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Resúmenes Clínicos ({state.savedSummaries?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: SIMULADOR DE TESTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {!isExamActive && !examFinished && (
            <div className="space-y-6">
              {/* Subject Filter */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-700">Filtrar por Materia:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subjectsList.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedSubject === subj
                          ? 'bg-[#365e45] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Exam Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black mb-3">
                      10Q
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">Repaso Rápido</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      10 preguntas aleatorias de tu banco. Ideal para pausas entre clases o en el autobús.
                    </p>
                  </div>
                  <button
                    onClick={() => startExam('quick10')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#2b4c37] transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar 10Q</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-black mb-3">
                      30Q
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">Examen Completo</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      30 preguntas equilibradas de teoría y práctica clínica con ponderación temática.
                    </p>
                  </div>
                  <button
                    onClick={() => startExam('normal30')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-800 text-white text-xs font-extrabold hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar 30Q</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black mb-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">Simulacro con Tiempo</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      20 preguntas con cuenta atrás de 15 minutos (45s por pregunta). Entrena la agilidad mental.
                    </p>
                  </div>
                  <button
                    onClick={() => startExam('timed')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar Cronómetro</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-black mb-3">
                      <RotateCcw className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-stone-900">Mis Errores</h3>
                      <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        {mistakesHistory.length} falladas
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Repetición espaciada: repasa exclusivamente las preguntas que has fallado hasta dominarlas al 100%.
                    </p>
                  </div>
                  <button
                    onClick={() => startExam('mistakes')}
                    disabled={mistakesHistory.length === 0}
                    className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-xs ${
                      mistakesHistory.length > 0
                        ? 'bg-rose-700 text-white hover:bg-rose-800'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Repasar Fallos ({mistakesHistory.length})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE EXAM */}
          {isExamActive && currentQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-stone-900 bg-stone-100 px-3 py-1 rounded-xl">
                    Pregunta {currentIndex + 1} de {currentQuestions.length}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    {currentQuestions[currentIndex].subject}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  {examMode === 'timed' && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono ${
                      timeRemaining < 120 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-stone-100 text-stone-700'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>{formatSeconds(timeRemaining)}</span>
                    </div>
                  )}
                  <span className="text-stone-500">
                    Aciertos: <strong className="text-emerald-700 font-black">{userScore}</strong> / {answeredCount}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                {currentQuestions[currentIndex].question}
              </h2>

              <div className="space-y-3">
                {currentQuestions[currentIndex].options.map((opt, oIdx) => {
                  const isChosen = selectedAnswer === oIdx;
                  const isCorrect = oIdx === currentQuestions[currentIndex].correctIndex;
                  let btnStyle = 'border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-stone-800';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20';
                    } else if (isChosen && !isCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-500/20';
                    } else {
                      btnStyle = 'border-stone-200 opacity-50 text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectAnswer(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt}</span>
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {selectedAnswer !== null && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="space-y-4 pt-4 border-t border-stone-100 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-600 mb-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-700" />
                      <span>Razonamiento Clínico & Justificación:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {currentQuestions[currentIndex].explanation}
                    </p>
                    {currentQuestions[currentIndex].clinicalTip && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-900 font-medium">
                        <strong className="font-extrabold">Tip docente: </strong>
                        {currentQuestions[currentIndex].clinicalTip}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs sm:text-sm font-extrabold hover:bg-[#2a4d38] transition flex items-center gap-2 shadow-xs"
                    >
                      <span>{currentIndex + 1 < currentQuestions.length ? 'Siguiente Pregunta' : 'Finalizar Examen'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXAM FINISHED */}
          {examFinished && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-stone-900">
                  ¡Examen Finalizado!
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Resultados registrados en tu perfil de Julia H. Carreras
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Puntuación</span>
                  <strong className="text-xl font-black text-stone-900">
                    {Math.round((userScore / currentQuestions.length) * 100)}%
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Aciertos</span>
                  <strong className="text-xl font-black text-emerald-700">
                    {userScore} / {currentQuestions.length}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Fallos</span>
                  <strong className="text-xl font-black text-rose-600">
                    {currentQuestions.length - userScore}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => startExam(examMode)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#2b4c37] transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir este modo</span>
                </button>
                <button
                  onClick={() => { setExamFinished(false); setIsExamActive(false); }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-extrabold hover:bg-stone-200 transition"
                >
                  Volver al menú de exámenes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: BANCO DE PREGUNTAS EDITABLE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'questionBank' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900">Banco de Preguntas Oficial y Propio</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                  {questionsPool.length} preguntas activas
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Puedes añadir tus propias preguntas de clase, editar cualquier enunciado o importar/exportar tu banco en JSON.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddQuestion}
                className="px-4 py-2.5 rounded-xl bg-[#365e45] text-white hover:bg-[#284935] text-xs font-extrabold transition flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Pregunta</span>
              </button>
              <button
                onClick={handleExportQuestions}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition flex items-center gap-1.5"
                title="Descargar banco de preguntas en archivo JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>
              <label className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Importar</span>
                <input type="file" accept=".json" onChange={handleImportQuestions} className="hidden" />
              </label>
              <button
                onClick={() => {
                  if (confirm('¿Restaurar las 15 preguntas oficiales iniciales?')) {
                    resetQuizQuestions();
                  }
                }}
                className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                title="Volver a las 15 preguntas iniciales de la app"
              >
                Restaurar 15 oficiales
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex-1 min-w-[240px] flex items-center gap-2">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Buscar por pregunta, respuesta o justificación clínica..."
                className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Materia:</span>
              <select
                value={bankSubjectFilter}
                onChange={(e) => setBankSubjectFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredBankQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {q.subject}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">
                      {q.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-1.5 text-stone-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
                      title="Editar pregunta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la pregunta "${q.question.slice(0, 40)}..."?`)) {
                          removeQuizQuestion(q.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-extrabold text-stone-900 leading-snug">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctIndex;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-stone-50/60 border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="truncate">{opt}</span>
                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-700 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                    <strong>Justificación:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Modal Añadir / Editar Pregunta */}
          {isQuestionModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-extrabold text-stone-900">
                    {editingQuestionId ? 'Editar Pregunta' : 'Añadir Nueva Pregunta al Banco'}
                  </h3>
                  <button
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="text-stone-400 hover:text-stone-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Asignatura</label>
                      <input
                        type="text"
                        required
                        value={questionFormData.subject}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Categoría</label>
                      <select
                        value={questionFormData.category}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="Anatomía">Anatomía</option>
                        <option value="Fisiología">Fisiología</option>
                        <option value="Farmacología">Farmacología</option>
                        <option value="Fundamentos">Fundamentos</option>
                        <option value="Laboratorio">Laboratorio</option>
                        <option value="ECOE">ECOE</option>
                        <option value="Casos Clínicos">Casos Clínicos</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Enunciado de la Pregunta</label>
                    <textarea
                      required
                      rows={3}
                      value={questionFormData.question}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, question: e.target.value })}
                      placeholder="Escribe aquí el enunciado claro de la pregunta..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700 block">4 Opciones de Respuesta (marca la correcta)</label>
                    {questionFormData.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={questionFormData.correctIndex === oIdx}
                          onChange={() => setQuestionFormData({ ...questionFormData, correctIndex: oIdx })}
                          className="accent-emerald-600 w-4 h-4"
                          title="Marcar como respuesta correcta"
                        />
                        <span className="w-5 text-xs font-bold text-stone-500">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...questionFormData.options];
                            newOpts[oIdx] = e.target.value;
                            setQuestionFormData({ ...questionFormData, options: newOpts });
                          }}
                          placeholder={`Opción ${String.fromCharCode(65 + oIdx)}`}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Justificación / Explicación Razonada</label>
                    <textarea
                      rows={2}
                      value={questionFormData.explanation}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                      placeholder="Por qué esta opción es la correcta según la evidencia..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Perla Clínica / Tip Docente (Opcional)</label>
                    <input
                      type="text"
                      value={questionFormData.clinicalTip}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, clinicalTip: e.target.value })}
                      placeholder="Consejo práctico de hospital o regla nemotécnica..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsQuestionModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs"
                    >
                      Guardar Pregunta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: FLASHCARDS CON REPETICIÓN ESPACIADA (LEITNER) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Spaced Leitner Summary Header */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-stone-700">Modo de Repaso Leitner:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              <button
                onClick={() => { setFlashcardFilter('today'); setCurrentCardIdx(0); setIsFlipped(false); }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  flashcardFilter === 'today'
                    ? 'bg-[#365e45] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Para Hoy ({questionsPool.filter((q) => !state.spacedReviews[q.id] || state.spacedReviews[q.id].nextReviewDate <= todayStr).length})
              </button>
              <button
                onClick={() => { setFlashcardFilter('all'); setCurrentCardIdx(0); setIsFlipped(false); }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  flashcardFilter === 'all'
                    ? 'bg-[#365e45] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todas ({questionsPool.length})
              </button>
              <button
                onClick={() => { setFlashcardFilter('mastered'); setCurrentCardIdx(0); setIsFlipped(false); }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  flashcardFilter === 'mastered'
                    ? 'bg-[#365e45] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Dominadas (Caja 4)
              </button>
            </div>
          </div>

          {activeCard ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 font-bold px-1">
                <span>Tarjeta {currentCardIdx + 1} de {flashcardsList.length}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  {activeCard.subject}
                </span>
                <span className="text-[11px] text-stone-400">
                  {activeCardReview ? `Caja ${activeCardReview.box} · Repetida ${activeCardReview.repetitions} veces` : 'Nueva (Caja 1)'}
                </span>
              </div>

              {/* Card Canvas */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[300px] rounded-3xl p-8 border-2 shadow-md cursor-pointer transition-all flex flex-col justify-between select-none ${
                  !isFlipped
                    ? 'bg-white border-emerald-200 hover:border-emerald-400'
                    : 'bg-[#fafcf9] border-emerald-500 ring-2 ring-emerald-500/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                      {!isFlipped ? 'ANVERSO · CONCEPTO O PREGUNTA' : 'REVERSO · RESPUESTA Y JUSTIFICACIÓN'}
                    </span>
                    <span className="text-xs text-stone-400 font-bold">
                      {isFlipped ? 'Respuesta verificada' : 'Haz clic para revelar'}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-black text-stone-900 mt-6 leading-relaxed">
                    {!isFlipped
                      ? activeCard.question
                      : activeCard.options[activeCard.correctIndex]}
                  </p>

                  {isFlipped && (
                    <div className="mt-4 pt-4 border-t border-stone-200/70 text-xs text-stone-700 space-y-2 leading-relaxed">
                      <p>{activeCard.explanation}</p>
                      {activeCard.clinicalTip && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-emerald-950 font-medium">
                          <strong>Perla docente:</strong> {activeCard.clinicalTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-center text-[11px] text-stone-400 font-bold pt-4">
                  {!isFlipped ? '💡 Toca para voltear y calificar tu memoria' : '👇 Califica cómo te lo has sabido'}
                </div>
              </div>

              {/* Leitner Spaced Review Rating Buttons (Shown after flip) */}
              {isFlipped ? (
                <div className="grid grid-cols-4 gap-2 pt-2 animate-fadeIn">
                  <button
                    onClick={() => handleReviewRating('again')}
                    className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <span>❌ Otra vez</span>
                    <span className="text-[10px] text-rose-600 font-normal">Hoy (Caja 1)</span>
                  </button>
                  <button
                    onClick={() => handleReviewRating('hard')}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <span>⚠️ Difícil</span>
                    <span className="text-[10px] text-amber-700 font-normal">En 1 día</span>
                  </button>
                  <button
                    onClick={() => handleReviewRating('good')}
                    className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <span>👍 Bien</span>
                    <span className="text-[10px] text-blue-700 font-normal">En 3 días</span>
                  </button>
                  <button
                    onClick={() => handleReviewRating('easy')}
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <span>🌟 Fácil</span>
                    <span className="text-[10px] text-emerald-700 font-normal">En 7 días (Caja 4)</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIdx((prev) => (prev > 0 ? prev - 1 : flashcardsList.length - 1));
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs"
                  >
                    Mostrar Respuesta
                  </button>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIdx((prev) => (prev + 1) % flashcardsList.length);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
                  >
                    Saltar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-extrabold text-stone-900">
                ¡Has completado todos los repasos de hoy!
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Tu memoria de largo plazo te lo agradecerá. Puedes revisar "Todas las tarjetas" o generar nuevas preguntas desde tus apuntes.
              </p>
              <button
                onClick={() => setFlashcardFilter('all')}
                className="mt-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition"
              >
                Ver todas las tarjetas
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: GENERADOR DE TESTS Y FLASHCARDS CON IA */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'aiGenerator' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black text-stone-900">Generar Tests y Flashcards con IA</h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Pega cualquier fragmento de tus apuntes, diapositivas o guías clínicas. La IA extraerá los puntos críticos y creará preguntas tipo test con retroalimentación o tarjetas listas para memorizar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Materia</label>
                <input
                  type="text"
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  placeholder="ej. Farmacología, Anatomía..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">¿Qué quieres generar?</label>
                <select
                  value={aiGenType}
                  onChange={(e) => setAiGenType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="quiz">Preguntas Tipo Test (con 4 opciones y explicación)</option>
                  <option value="flashcards">Tarjetas Flashcards (Anverso y Reverso)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Cantidad</label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value={3}>3 preguntas clave</option>
                  <option value={5}>5 preguntas estándar</option>
                  <option value={10}>10 preguntas intensivas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Texto de los Apuntes (pega aquí)</label>
              <textarea
                rows={6}
                value={aiNoteText}
                onChange={(e) => setAiNoteText(e.target.value)}
                placeholder="Pega aquí el texto del tema (ej. El ciclo cardiaco consta de sístole y diástole... las venas pulmonares desembocan en la aurícula izquierda...)"
                className="w-full p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-stone-400">
                {aiNoteText.length} caracteres introducidos
              </span>
              <button
                onClick={handleRunAiGeneration}
                disabled={isGeneratingAi || aiNoteText.trim().length < 15}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-xs ${
                  isGeneratingAi || aiNoteText.trim().length < 15
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#365e45] text-white hover:bg-[#284935]'
                }`}
              >
                {isGeneratingAi ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Analizando apuntes con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar con IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {aiSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}

          {/* Generated Preview List */}
          {generatedItems.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-stone-900">
                  Previsualización ({generatedItems.length} generadas)
                </h3>
                <button
                  onClick={handleSaveGeneratedToBank}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar todo en mi Banco</span>
                </button>
              </div>

              <div className="space-y-3">
                {generatedItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                    {aiGenType === 'quiz' ? (
                      <>
                        <p className="text-sm font-extrabold text-stone-900">{idx + 1}. {item.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {item.options?.map((opt: string, oIdx: number) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border flex items-center gap-2 ${
                                oIdx === item.correctIndex
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-stone-50 border-stone-200 text-stone-600'
                              }`}
                            >
                              <span className="font-bold">{String.fromCharCode(65 + oIdx)})</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          <strong>Explicación:</strong> {item.explanation}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-stone-50 rounded-xl">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Anverso</span>
                          <p className="text-sm font-extrabold text-stone-900 mt-0.5">{item.front}</p>
                        </div>
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/50">
                          <span className="text-[10px] font-bold uppercase text-emerald-800">Reverso</span>
                          <p className="text-xs text-emerald-950 mt-0.5">{item.back}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: PLANIFICADOR DE ESTUDIO */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'studyPlanner' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black text-stone-900">Planificador de Estudio Inteligente</h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Calcula automáticamente el ritmo de estudio diario para llegar al examen con margen de repaso y simulacros.
              </p>
            </div>

            <form onSubmit={handleCreateStudyPlan} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Asignatura</label>
                <input
                  type="text"
                  required
                  value={planSubject}
                  onChange={(e) => setPlanSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Fecha de Examen</label>
                <input
                  type="date"
                  required
                  value={planExamDate}
                  onChange={(e) => setPlanExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Número de Temas</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={planTotalTopics}
                  onChange={(e) => setPlanTotalTopics(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Horas / Día</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={planHoursPerDay}
                  onChange={(e) => setPlanHoursPerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Calcular y Guardar Plan de Estudio</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Plans */}
          <div className="space-y-4">
            {state.studyPlans && state.studyPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-stone-900">{plan.subject}</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Examen: {plan.examDate}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {plan.totalTopics} temas en total · {plan.hoursPerDay}h al día recomendadas
                    </p>
                  </div>
                  <button
                    onClick={() => deleteStudyPlan(plan.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Eliminar plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Checklist of days */}
                <div className="space-y-2 pt-2 border-t border-stone-100 max-h-72 overflow-y-auto pr-2">
                  {plan.schedule.map((step) => (
                    <div
                      key={step.dayIndex}
                      onClick={() => toggleStudyPlanStep(plan.id, step.dayIndex)}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        step.done
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 line-through'
                          : step.isReview
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={step.done}
                          onChange={() => {}}
                          className="accent-emerald-600 w-4 h-4 rounded"
                        />
                        <span>{step.date}: <strong>{step.action}</strong></span>
                      </div>
                      {step.isReview && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          Repaso
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: RESÚMENES CLÍNICOS CON IA */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'summaries' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black text-stone-900">Generar Resumen Clínico & Esquema con IA</h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Pega tus apuntes extensos para sintetizarlos en conceptos clave, nemotécnias, valores normales y preguntas típicas de examen de la UCLM.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-stone-700 block mb-1">Materia</label>
                <input
                  type="text"
                  value={summarySubject}
                  onChange={(e) => setSummarySubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">Apuntes del Tema</label>
                <textarea
                  rows={4}
                  value={summaryInputText}
                  onChange={(e) => setSummaryInputText(e.target.value)}
                  placeholder="Pega aquí los apuntes que quieres resumir..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateSummary}
                disabled={isSummarizing || summaryInputText.trim().length < 20}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-xs ${
                  isSummarizing || summaryInputText.trim().length < 20
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#365e45] text-white hover:bg-[#284935]'
                }`}
              >
                {isSummarizing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Sintetizando apuntes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Resumen Clínico</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated summary preview */}
          {generatedSummary && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-extrabold text-stone-900">
                  {generatedSummary.title || 'Resumen Generado'}
                </h3>
                <button
                  onClick={handleSaveSummaryToStore}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar en Mi Biblioteca</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
                <p>{generatedSummary.executiveSummary || generatedSummary.summary}</p>

                {generatedSummary.keyConcepts && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                    <strong className="text-xs font-extrabold text-stone-900 uppercase tracking-wide block">
                      Conceptos Clave:
                    </strong>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-stone-600">
                      {generatedSummary.keyConcepts.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedSummary.clinicalMnemonics && generatedSummary.clinicalMnemonics.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs">
                    <strong className="font-bold">Reglas Nemotécnicas: </strong>
                    <span>{generatedSummary.clinicalMnemonics.join(' · ')}</span>
                  </div>
                )}

                {generatedSummary.typicalExamQuestions && generatedSummary.typicalExamQuestions.length > 0 && (
                  <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200/60 text-xs text-rose-950 space-y-1">
                    <strong className="font-extrabold uppercase tracking-wide block text-rose-900">
                      Preguntas Típicas de Examen:
                    </strong>
                    <ul className="list-decimal pl-4 space-y-1">
                      {generatedSummary.typicalExamQuestions.map((q: string, idx: number) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Saved Summaries Library */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">
              Biblioteca de Apuntes Guardados ({state.savedSummaries?.length || 0})
            </h3>
            {state.savedSummaries && state.savedSummaries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.savedSummaries.map((s) => (
                  <div key={s.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                          {s.subject}
                        </span>
                        <h4 className="text-sm font-extrabold text-stone-900 mt-1">{s.title}</h4>
                      </div>
                      <button
                        onClick={() => deleteNoteSummary(s.id)}
                        className="text-stone-300 hover:text-rose-600 p-1"
                        title="Eliminar resumen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {s.executiveSummary}
                    </p>
                    <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span>Guardado el {s.createdAt}</span>
                      <span className="text-emerald-700 font-bold">{s.keyConcepts?.length || 0} conceptos clave</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-stone-200 text-center text-xs text-stone-500">
                Aún no has guardado resúmenes. Pega tus apuntes arriba para generar el primero.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
