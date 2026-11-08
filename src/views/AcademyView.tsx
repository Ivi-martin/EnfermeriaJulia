import React, { useState, useEffect } from 'react';
import { useCampusStore, isDemoMode } from '../hooks/useCampusStore';
import { SELF_EVALUATION_QUESTIONS } from '../data/selfEvaluation';
import { QuizQuestion } from '../types';
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
  Play
} from 'lucide-react';

type ExamMode = 'quick10' | 'normal30' | 'timed' | 'mistakes';

export const AcademyView: React.FC = () => {
  const { state, recordQuizResult } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'exams' | 'flashcards' | 'syllabus'>('exams');
  
  // Exam state
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
  
  // Timer for timed exam
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 min default
  const [mistakesHistory, setMistakesHistory] = useState<string[]>(() => {
    if (isDemoMode()) return [];
    try {
      const saved = localStorage.getItem('campus_mistakes_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Flashcards state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (isDemoMode()) return;
    try {
      localStorage.setItem('campus_mistakes_ids', JSON.stringify(mistakesHistory));
    } catch {
      // ignore
    }
  }, [mistakesHistory]);

  // Timer tick during exam
  useEffect(() => {
    if (!isExamActive || examFinished || examMode !== 'timed') return;
    if (timeRemaining <= 0) {
      finishExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamActive, examFinished, examMode, timeRemaining]);

  const subjectsList = ['Todas', ...Array.from(new Set(SELF_EVALUATION_QUESTIONS.map(q => q.subject)))];

  const startExam = (mode: ExamMode) => {
    setExamMode(mode);
    let pool = [...SELF_EVALUATION_QUESTIONS];
    if (selectedSubject !== 'Todas') {
      pool = pool.filter(q => q.subject === selectedSubject);
    }

    if (mode === 'mistakes') {
      if (mistakesHistory.length > 0) {
        pool = pool.filter(q => mistakesHistory.includes(q.id));
      }
    }

    // Shuffle
    pool.sort(() => 0.5 - Math.random());

    let count = 10;
    if (mode === 'quick10') count = 10;
    else if (mode === 'normal30') count = Math.min(30, pool.length);
    else if (mode === 'timed') {
      count = Math.min(20, pool.length);
      setTimeRemaining(900); // 15 min
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
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);
    setAnsweredCount(prev => prev + 1);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      setUserScore(prev => prev + 1);
      // Remove from mistakes if present
      setMistakesHistory(prev => prev.filter(id => id !== currentQ.id));
    } else {
      // Add to mistakes
      if (!mistakesHistory.includes(currentQ.id)) {
        setMistakesHistory(prev => [...prev, currentQ.id]);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#2a4d38] via-[#1e3b2b] to-[#12261b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>PLATAFORMA DE ESTUDIO Y AUTOEVALUACIÓN DE ENFERMERÍA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Academia · Estudio y Exámenes
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              4 modalidades de examen tipo test con retroalimentación razonada, algoritmo de repetición espaciada en "Mis Errores" y tarjetas flashcards interactivas para afianzar conceptos clínicos.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Tasa de Acierto Global
              </span>
              <strong className="text-xl font-black text-white">
                {state.quizStats.totalAnswered > 0
                  ? Math.round((state.quizStats.totalCorrect / state.quizStats.totalAnswered) * 100)
                  : 0}%
              </strong>
              <span className="text-[10px] text-stone-300 block">
                {state.quizStats.totalCorrect} de {state.quizStats.totalAnswered} preguntas
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sub-tabs header */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => { setActiveTab('exams'); setIsExamActive(false); setExamFinished(false); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'exams'
                ? 'bg-white text-[#1e3b2b] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Simulador de Exámenes (4 Modos)</span>
          </button>
          <button
            onClick={() => { setActiveTab('flashcards'); setIsExamActive(false); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'bg-white text-[#1e3b2b] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tarjetas Flashcards</span>
          </button>
          <button
            onClick={() => { setActiveTab('syllabus'); setIsExamActive(false); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'syllabus'
                ? 'bg-white text-[#1e3b2b] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Temarios & Esquemas 1.º</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SIMULADOR DE EXÁMENES */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {/* If exam is not active and not finished -> Show mode launcher */}
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

              {/* 4 Exam Modes Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Quick 10 */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black mb-3">
                      10Q
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Repaso Rápido
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      10 preguntas aleatorias de alta frecuencia. Ideal para pausas entre clases o repasar en el autobús.
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

                {/* 2. Normal 30 */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-black mb-3">
                      30Q
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Examen Normal
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      30 preguntas equilibradas de teoría y práctica clínica con ponderación temática oficial.
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

                {/* 3. Timed Simulation */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black mb-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Simulacro con Tiempo
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      20 preguntas con cuenta atrás de 15 minutos (45s por pregunta). Entrena la velocidad mental ante el examen real.
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

                {/* 4. My Mistakes */}
                <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-black mb-3">
                      <RotateCcw className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-stone-900">
                        Mis Errores
                      </h3>
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

          {/* ACTIVE EXAM INTERACTION */}
          {isExamActive && currentQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
              {/* Question Header */}
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

              {/* Progress bar */}
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>

              {/* The Question Text */}
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                {currentQuestions[currentIndex].question}
              </h2>

              {/* Options */}
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

              {/* Explanation & Clinical Tip */}
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

          {/* EXAM FINISHED SCREEN */}
          {examFinished && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-stone-900">
                  ¡Examen Finalizado con Éxito!
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

      {/* TAB 2: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold">
            <span>Tarjeta {cardIndex + 1} de {SELF_EVALUATION_QUESTIONS.length}</span>
            <span>{SELF_EVALUATION_QUESTIONS[cardIndex].subject}</span>
          </div>

          {/* Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-300 shadow-md cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {!isFlipped ? 'ANVERSO · PREGUNTA' : 'REVERSO · RESPUESTA CORRECTA'}
              </span>
              <p className="text-base sm:text-lg font-extrabold text-stone-900 mt-4 leading-relaxed">
                {!isFlipped
                  ? SELF_EVALUATION_QUESTIONS[cardIndex].question
                  : SELF_EVALUATION_QUESTIONS[cardIndex].options[SELF_EVALUATION_QUESTIONS[cardIndex].correctIndex]}
              </p>
              {isFlipped && (
                <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100 leading-relaxed">
                  {SELF_EVALUATION_QUESTIONS[cardIndex].explanation}
                </p>
              )}
            </div>

            <div className="text-center text-[11px] text-stone-400 font-bold pt-4">
              (Haz clic para girar la tarjeta)
            </div>
          </div>

          {/* Flashcard navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex(prev => (prev > 0 ? prev - 1 : SELF_EVALUATION_QUESTIONS.length - 1));
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
            >
              Anterior
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex(prev => (prev + 1) % SELF_EVALUATION_QUESTIONS.length);
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-800 text-xs font-extrabold hover:bg-rose-100 transition"
              >
                Repasar luego
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex(prev => (prev + 1) % SELF_EVALUATION_QUESTIONS.length);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition"
              >
                ¡Me la sé!
              </button>
            </div>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex(prev => (prev + 1) % SELF_EVALUATION_QUESTIONS.length);
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TEMARIOS Y ESQUEMAS */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Anatomía Humana · Esquemas Clave</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">1. Planos Anatómicos y Ejes</strong>
                Plano sagital (divide en derecha/izquierda), frontal o coronal (anterior/posterior) y transversal u horizontal (superior/inferior).
              </li>
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">2. Sistema Cardiovascular</strong>
                Circulación mayor (VI → Aorta → Tejidos → Venas Cavas → AD) vs Menor (VD → Arteria Pulmonar → Pulmones → Venas Pulmonares → AI).
              </li>
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">3. Pares Craneales</strong>
                I Olfatorio, II Óptico, III Oculomotor, IV Troclear, V Trigémino, VI Abducens, VII Facial, VIII Vestibulococlear, IX Glosofaríngeo, X Vago, XI Accesorio, XII Hipogloso.
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Fundamentos de Enfermería · Metodología PAE</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">1. Fases del Proceso Enfermero (PAE)</strong>
                Valoración → Diagnóstico (NANDA) → Planificación (NOC) → Ejecución (NIC) → Evaluación.
              </li>
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">2. Diagnósticos de Enfermería NANDA</strong>
                Diagnóstico Real (Etiqueta + r/c causa + m/p signos y síntomas) vs Diagnóstico de Riesgo (Etiqueta + r/c factores de riesgo; no lleva m/p).
              </li>
              <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <strong className="text-stone-900 block font-bold">3. 11 Patrones Funcionales de Marjory Gordon</strong>
                Percepción-Manejo de salud, Nutricional-Metabólico, Eliminación, Actividad-Ejercicio, Sueño-Descanso, Cognitivo-Perceptual, Autopercepción, Rol-Relaciones, Sexualidad, Adaptación-Estrés y Valores-Creencias.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
