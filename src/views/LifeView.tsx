import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { GradeEntry } from '../types';
import {
  Heart,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  Wallet,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Smile
} from 'lucide-react';

export const LifeView: React.FC = () => {
  const { state, updateState } = useCampusStore();

  // Focus mode / Pomodoro state
  const [pomodoroMode, setPomodoroMode] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Personal');

  // Grade form
  const [newGrade, setNewGrade] = useState({
    subject: 'Anatomía Humana',
    name: '',
    grade: 8.0,
    weight: 40
  });

  // Expense form
  const [newExpense, setNewExpense] = useState({
    concept: '',
    amount: 15.0,
    category: 'Material de estudio'
  });

  // Habits form
  const [newHabitName, setNewHabitName] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayHabitLog = state.habitLogs[todayStr] || [];

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      alert('¡Tiempo cumplido! Excelente sesión de estudio enfermero. Descansa 5 minutos.');
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleSetMode = (minutes: number) => {
    setIsRunning(false);
    setPomodoroMode(minutes);
    setSecondsLeft(minutes * 60);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(pomodoroMode * 60);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Grades calculation
  const totalWeight = state.grades.reduce((a, g) => a + g.weight, 0);
  const weightedGpa =
    totalWeight > 0
      ? (state.grades.reduce((a, g) => a + g.grade * g.weight, 0) / totalWeight).toFixed(2)
      : '–';

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.name.trim()) return;
    const entry: GradeEntry = {
      id: Date.now(),
      ...newGrade
    };
    updateState((prev) => ({ ...prev, grades: [entry, ...prev.grades] }));
    setNewGrade({ subject: 'Anatomía Humana', name: '', grade: 8.0, weight: 40 });
  };

  const handleRemoveGrade = (id: number) => {
    updateState((prev) => ({ ...prev, grades: prev.grades.filter((g) => g.id !== id) }));
  };

  // Expenses calculation
  const totalSpent = state.expenses.reduce((a, e) => a + e.amount, 0);
  const remainingBudget = state.budget - totalSpent;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.concept.trim()) return;
    const item = {
      id: Date.now(),
      concept: newExpense.concept,
      amount: newExpense.amount,
      category: newExpense.category,
      date: todayStr
    };
    updateState((prev) => ({ ...prev, expenses: [item, ...prev.expenses] }));
    setNewExpense({ concept: '', amount: 15.0, category: 'Material de estudio' });
  };

  // Habit toggling
  const handleToggleHabit = (id: number) => {
    const currentList = state.habitLogs[todayStr] || [];
    const updated = currentList.includes(id)
      ? currentList.filter((x) => x !== id)
      : [...currentList, id];

    updateState((prev) => ({
      ...prev,
      habitLogs: {
        ...prev.habitLogs,
        [todayStr]: updated
      }
    }));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit = { id: Date.now(), name: newHabitName.trim() };
    updateState((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
    setNewHabitName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          BIENESTAR Y VIDA UNIVERSITARIA EN TOLEDO
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Mi Vida y Organización Personal
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Modo Foco / Pomodoro, control de notas ponderadas, hábitos de autocuidado y presupuesto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODULO 1: MODO FOCO / POMODORO */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-[#365e45]" />
              <h3 className="text-base font-bold text-stone-900">Modo Foco de Estudio</h3>
            </div>
            <span className="text-xs text-stone-400 font-semibold">Técnica Pomodoro</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {[
              { m: 25, label: 'Foco 25 m' },
              { m: 45, label: 'Foco 45 m' },
              { m: 5, label: 'Descanso 5 m' },
              { m: 15, label: 'Pausa 15 m' }
            ].map((btn) => (
              <button
                key={btn.m}
                onClick={() => handleSetMode(btn.m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  pomodoroMode === btn.m
                    ? 'bg-[#365e45] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Clock Display */}
          <div className="text-center py-4">
            <div className="text-6xl font-extrabold tracking-tight font-mono text-[#203a2b]">
              {formatTimer(secondsLeft)}
            </div>
            <p className="text-xs text-stone-400 mt-2">
              {isRunning ? 'Sesión de concentración activa' : 'Pulsa empezar para iniciar tu sesión'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleTimer}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold text-white transition flex items-center gap-2 shadow-xs ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#365e45] hover:bg-[#284835]'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pausar' : 'Empezar'}</span>
            </button>
            <button
              onClick={handleResetTimer}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODULO 2: HÁBITOS DE AUTOCUIDADO */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="text-base font-bold text-stone-900">Hábitos de Autocuidado Diario</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {todayHabitLog.length} de {state.habits.length} hoy
            </span>
          </div>

          <div className="space-y-2.5">
            {state.habits.map((h) => {
              const isDone = todayHabitLog.includes(h.id);
              return (
                <label
                  key={h.id}
                  onClick={() => handleToggleHabit(h.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 text-xs transition ${
                    isDone
                      ? 'border-emerald-300 bg-emerald-50/50 text-stone-900'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#365e45] rounded"
                  />
                  <span className={`font-semibold ${isDone ? 'line-through text-stone-400' : ''}`}>
                    {h.name}
                  </span>
                </label>
              );
            })}
          </div>

          <form onSubmit={handleAddHabit} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Añadir hábito saludable..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#365e45] focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#365e45] text-white font-bold text-xs rounded-xl hover:bg-[#284835] transition"
            >
              Añadir
            </button>
          </form>
        </div>
      </div>

      {/* MODULO 3: CALCULADORA DE NOTAS PONDERADAS */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900">Control y Media Ponderada de Notas</h3>
            <p className="text-xs text-stone-500">
              Calcula tu nota final según el peso porcentual de cada prueba
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-right self-start sm:self-auto min-w-[140px]">
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
              Media Global
            </span>
            <div className="text-2xl font-extrabold text-[#365e45]">{weightedGpa}</div>
          </div>
        </div>

        {/* Add Grade Form */}
        <form onSubmit={handleAddGrade} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Asignatura</label>
            <select
              value={newGrade.subject}
              onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              {state.subjects.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Tipo de Prueba</label>
            <input
              type="text"
              required
              value={newGrade.name}
              onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
              placeholder="Ej. Parcial Teórico / Taller"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Nota (0-10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={newGrade.grade}
                onChange={(e) => setNewGrade({ ...newGrade, grade: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Peso %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newGrade.weight}
                onChange={(e) => setNewGrade({ ...newGrade, weight: parseInt(e.target.value) || 100 })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition shadow-xs"
            >
              Guardar Nota
            </button>
          </div>
        </form>

        {/* Grades Table */}
        <div className="divide-y divide-stone-100 text-xs">
          {state.grades.map((g) => (
            <div key={g.id} className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-stone-900">{g.subject}</strong>
                <span className="text-stone-500 ml-2">
                  {g.name} ({g.weight}% peso)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-base text-[#365e45]">{g.grade.toFixed(2)}</span>
                <button
                  onClick={() => handleRemoveGrade(g.id)}
                  className="text-stone-400 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official UCLM Links */}
      <div className="p-6 rounded-3xl bg-[#f8faf7] border border-stone-200/80 space-y-3">
        <h3 className="text-sm font-bold text-stone-900">Accesos Universitarios Oficiales (UCLM Toledo)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://campusvirtual.uclm.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 flex items-center justify-between group transition"
          >
            <div>
              <strong className="text-stone-900 block group-hover:text-[#365e45]">Campus Virtual UCLM</strong>
              <span className="text-[11px] text-stone-500">Moodle & Aulas docentes</span>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#365e45]" />
          </a>

          <a
            href="https://biblioteca.uclm.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 flex items-center justify-between group transition"
          >
            <div>
              <strong className="text-stone-900 block group-hover:text-[#365e45]">Biblioteca UCLM</strong>
              <span className="text-[11px] text-stone-500">Bases de datos médicas & PubMed</span>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#365e45]" />
          </a>

          <a
            href="https://www.uclm.es/es/toledo/Fafeto/Estudios/GradoEnfermeria"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 flex items-center justify-between group transition"
          >
            <div>
              <strong className="text-stone-900 block group-hover:text-[#365e45]">Grado en Enfermería</strong>
              <span className="text-[11px] text-stone-500">Facultad de Toledo</span>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#365e45]" />
          </a>
        </div>
      </div>
    </div>
  );
};
