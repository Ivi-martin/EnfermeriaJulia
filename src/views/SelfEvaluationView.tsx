import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { SELF_EVALUATION_QUESTIONS } from '../data/selfEvaluation';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Clock
} from 'lucide-react';

export const SelfEvaluationView: React.FC = () => {
  const { recordQuizResult, state } = useCampusStore();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [inQuiz, setInQuiz] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Todas las materias' },
    { id: 'Anatomía', label: 'Anatomía Humana' },
    { id: 'Fundamentos', label: 'Fundamentos de Enfermería' },
    { id: 'Fisiología', label: 'Fisiología Humana' },
    { id: 'Farmacología', label: 'Farmacología & Goteros' },
    { id: 'Casos Clínicos', label: 'Casos Clínicos Ficticios' }
  ];

  const startQuiz = (limit: number = 10, retryWrongsOnly: boolean = false) => {
    let pool = retryWrongsOnly
      ? [...wrongQuestions]
      : SELF_EVALUATION_QUESTIONS.filter(
          (q) => selectedSubject === 'all' || q.category === selectedSubject
        );

    // Shuffle questions
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, limit);
    setQuizQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    if (!retryWrongsOnly) {
      setWrongQuestions([]);
    }
    setIsQuizCompleted(false);
    setInQuiz(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const currentQ = quizQuestions[currentIdx];
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz finished!
      setIsQuizCompleted(true);
      const finalScore = score + (selectedAnswer === quizQuestions[currentIdx].correctIndex ? 1 : 0);
      const gradeOutOf10 = (finalScore / quizQuestions.length) * 10;

      recordQuizResult(selectedSubject, finalScore, quizQuestions.length);

      if (gradeOutOf10 >= 7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const currentQ = quizQuestions[currentIdx];
  const grade = quizQuestions.length > 0 ? (score / quizQuestions.length) * 10 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#93671f]">
          REPASO INTERACTIVO & AUTOEVALUACIÓN
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Autoevaluación de Temas Complejos
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Preguntas tipo test y casos clínicos con razonamiento enfermero para afianzar conceptos clave.
        </p>
      </div>

      {/* QUIZ NOT STARTED: Setup & Selection Screen */}
      {!inQuiz && (
        <div className="space-y-6 animate-fadeIn">
          {/* Subject Filter Bar */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">Elige la materia a repasar</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedSubject(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedSubject === c.id
                      ? 'bg-[#365e45] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => startQuiz(5)}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 hover:bg-white transition text-left group"
              >
                <div className="text-xs font-bold text-[#365e45] mb-1">Repaso Rápido</div>
                <strong className="text-sm font-bold text-stone-900 block group-hover:text-[#365e45]">
                  5 Preguntas exprés
                </strong>
                <span className="text-[11px] text-stone-500">Ideal para repasar en 5 minutos</span>
              </button>

              <button
                onClick={() => startQuiz(10)}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 transition text-left group"
              >
                <div className="text-xs font-bold text-emerald-800 mb-1">Simulacro Estándar</div>
                <strong className="text-sm font-bold text-stone-900 block group-hover:text-emerald-900">
                  10 Preguntas con cronómetro
                </strong>
                <span className="text-[11px] text-stone-500">Puntuación ponderada sobre 10</span>
              </button>

              <button
                onClick={() => startQuiz(30)}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 hover:border-amber-500 hover:bg-amber-50 transition text-left group"
              >
                <div className="text-xs font-bold text-amber-800 mb-1">Desafío Completo</div>
                <strong className="text-sm font-bold text-stone-900 block group-hover:text-amber-900">
                  Todas las preguntas disponibles
                </strong>
                <span className="text-[11px] text-stone-500">Examen exhaustivo de todo el banco</span>
              </button>
            </div>
          </div>

          {/* Academic Stats & History */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-3">Tus Resultados Históricos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 block">Tests Realizados</span>
                <strong className="text-2xl font-extrabold text-stone-900">
                  {state.quizStats.totalQuizzes}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-700 block">Aciertos Totales</span>
                <strong className="text-2xl font-extrabold text-emerald-900">
                  {state.quizStats.totalCorrect}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-xs text-blue-700 block">% Precisión Global</span>
                <strong className="text-2xl font-extrabold text-blue-900">
                  {state.quizStats.totalAnswered > 0
                    ? Math.round((state.quizStats.totalCorrect / state.quizStats.totalAnswered) * 100)
                    : 0}
                  %
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 block">Mejor Calificación</span>
                <strong className="text-2xl font-extrabold text-amber-900">
                  {state.quizStats.bestScorePercent}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ IN PROGRESS */}
      {inQuiz && !isQuizCompleted && currentQ && (
        <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span className="px-3 py-1 rounded-full bg-[#e8f0e8] text-[#2d523e] font-bold text-[11px]">
              {currentQ.subject}
            </span>
            <span>
              Pregunta {currentIdx + 1} de {quizQuestions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#365e45] h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'border-stone-200 bg-white hover:border-emerald-300 text-stone-800';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200';
                  } else if (idx === selectedAnswer) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                  } else {
                    btnStyle = 'border-stone-200 bg-stone-50/60 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </div>

                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-[#f6f8f5] border border-stone-200 space-y-2 text-xs text-stone-700 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-[#203a2b]">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Justificación Científica y Docente:</span>
                </div>
                <p className="leading-relaxed text-stone-600">{currentQ.explanation}</p>
                {currentQ.clinicalTip && (
                  <div className="pt-2 text-[11px] text-[#2d523e] font-semibold border-t border-stone-200">
                    💡 Perla clínica: {currentQ.clinicalTip}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs sm:text-sm hover:bg-[#284835] transition shadow-xs flex items-center gap-2"
                >
                  <span>{currentIdx < quizQuestions.length - 1 ? 'Siguiente Pregunta' : 'Ver Calificación Final'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUIZ COMPLETED SCREEN */}
      {isQuizCompleted && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-stone-200 shadow-md text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
            {grade >= 9 ? '🏆' : grade >= 7 ? '🌟' : grade >= 5 ? '👍' : '📚'}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {grade >= 9
                ? '¡Sobresaliente!'
                : grade >= 7
                ? '¡Notable, muy bien!'
                : grade >= 5
                ? '¡Aprobado!'
                : 'Buen intento, toca repasar'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Has acertado <strong>{score}</strong> de <strong>{quizQuestions.length}</strong> preguntas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider block">
              Nota equivalente
            </span>
            <div className="text-4xl font-extrabold text-[#365e45] mt-1">
              {grade.toFixed(1)} / 10
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {wrongQuestions.length > 0 && (
              <button
                onClick={() => startQuiz(wrongQuestions.length, true)}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
              >
                Reintentar solo las {wrongQuestions.length} falladas
              </button>
            )}

            <button
              onClick={() => startQuiz(10)}
              className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
            >
              Hacer otro test aleatorio
            </button>

            <button
              onClick={() => setInQuiz(false)}
              className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition"
            >
              Volver a la selección de materias
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
