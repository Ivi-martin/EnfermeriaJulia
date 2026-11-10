import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { GradeEntry, ExpenseSplitItem } from '../types';
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
  Smile,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  ArrowRightLeft,
  CalendarCheck
} from 'lucide-react';

export const LifeView: React.FC = () => {
  const {
    state,
    updateState,
    addRoommateExpense,
    toggleRoommateExpenseSettled,
    deleteRoommateExpense
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<'focus' | 'grades' | 'budget' | 'roommates' | 'menus'>('focus');

  // Focus mode / Pomodoro state
  const [pomodoroMode, setPomodoroMode] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Grade form
  const [newGrade, setNewGrade] = useState({
    subject: 'Anatomía Humana',
    name: '',
    grade: 8.0,
    weight: 40
  });

  // Personal Expense form
  const [newExpense, setNewExpense] = useState({
    concept: '',
    amount: 15.0,
    category: 'Material de estudio'
  });

  const defaultRoommates: string[] = ['Julia', 'Marta', 'Lucía'];

  // Roommate Expense form
  const [newRoommateExp, setNewRoommateExp] = useState({
    title: '',
    amount: 18.5,
    paidBy: 'Julia',
    splitAmong: defaultRoommates
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

  // Roommate Expense Submit
  const handleAddRoommateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoommateExp.title.trim()) return;
    addRoommateExpense({
      concept: newRoommateExp.title.trim(),
      title: newRoommateExp.title.trim(),
      amount: newRoommateExp.amount,
      paidBy: newRoommateExp.paidBy,
      date: todayStr,
      splitWith: newRoommateExp.splitAmong,
      splitAmong: newRoommateExp.splitAmong,
      category: 'Compra Común',
      settled: false
    });
    setNewRoommateExp({
      title: '',
      amount: 15.0,
      paidBy: 'Julia',
      splitAmong: defaultRoommates
    });
  };

  // Calculate Roommate Balances
  const roommatesList: string[] = (state.roommates && state.roommates.length > 0) ? state.roommates : defaultRoommates;
  const balances: Record<string, number> = {};
  roommatesList.forEach((r: string) => { balances[r] = 0; });

  (state.roommateExpenses || []).forEach((exp: ExpenseSplitItem) => {
    if (exp.settled) return;
    const splitArr: string[] = exp.splitWith || exp.splitAmong || defaultRoommates;
    const splitCount = splitArr.length || 1;
    const perPerson = exp.amount / splitCount;

    if (balances[exp.paidBy] !== undefined) {
      balances[exp.paidBy] += exp.amount;
    }
    splitArr.forEach((person: string) => {
      if (balances[person] !== undefined) {
        balances[person] -= perPerson;
      }
    });
  });

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

  // Student Weekly Menu Data
  const WEEKLY_MENUS = [
    {
      day: 'Lunes',
      lunch: 'Arroz integral con salteado de verduras, pechuga de pollo y huevo cocido (ideal para tupper en el HUT)',
      dinner: 'Crema casera de calabacín y puerro + tortilla francesa con orégano',
      tip: 'Cocina doble de arroz y pechuga para tener comida lista el martes.'
    },
    {
      day: 'Martes',
      lunch: 'Lentejas pardinas con zanahoria, patata y laurel (económicas, nutritivas y ricas en hierro)',
      dinner: 'Ensalada completa con garbanzos cocidos de bote, tomate, maíz y atún al natural',
      tip: 'Los botes de legumbres cocidas ahorran tiempo en época de parciales.'
    },
    {
      day: 'Miércoles',
      lunch: 'Pasta integral con sofrito casero de tomate natural, carne picada y parmesano rallado',
      dinner: 'Revuelto de champiñones laminados, ajetes y gambitas congeladas con tosta de pan',
      tip: 'Los champiñones y verduras congeladas conservan todas sus vitaminas.'
    },
    {
      day: 'Jueves',
      lunch: 'Guiso marinero rápido: patatas con dados de merluza congelada y guisantes',
      dinner: 'Sándwich vegetal completo: pan integral, lechuga, tomate, pavo, huevo a la plancha y yogur',
      tip: 'Cena rápida tras volver de las prácticas de tarde.'
    },
    {
      day: 'Viernes',
      lunch: 'Pollo al horno con patatas panaderas, cebolla, ajo y limón',
      dinner: 'Pizza casera de base de tortilla de trigo con tomate, mozzarella, atún y champiñones',
      tip: 'Celebración de fin de semana barata y reconfortante antes del viaje.'
    }
  ];

  const BUDGET_GROCERY_ITEMS = [
    { cat: 'Frutería y Verduras', items: ['Plátanos de Canarias (1 kg) ~1,80€', 'Bolsa de espinacas frescas ~1,20€', 'Calabacines y tomates ~2,50€', 'Malla de cebollas y ajos ~1,60€'] },
    { cat: 'Carnicería y Pescado', items: ['Bandeja pechuga de pollo fileteada ~4,50€', 'Huevos Camperos L (docena) ~2,40€', 'Merluza congelada en lomos ~3,80€'] },
    { cat: 'Despensa y Legumbres', items: ['Lentejas pardinas (1 kg) ~1,40€', 'Botes de garbanzos cocidos (2 uds) ~1,50€', 'Arroz redondo / integral ~1,30€', 'Pasta integral (macarrones) ~1,10€', 'Tomate triturado natural ~0,90€', 'Latas de atún al natural (pack 3) ~2,40€'] },
    { cat: 'Lácteos y Desayuno', items: ['Leche semidesnatada (pack 6) ~5,40€', 'Copos de avena integral (500g) ~1,00€', 'Yogures naturales sin azúcar ~1,20€'] }
  ];

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
          Foco Pomodoro, control de notas, gastos personales, reparto del piso con compañeras y menús económicos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('focus')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'focus'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Foco & Autocuidado</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'grades'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Notas Ponderadas</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'budget'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Mi Presupuesto</span>
        </button>

        <button
          onClick={() => setActiveTab('roommates')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'roommates'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Cuentas del Piso (Tricount)</span>
        </button>

        <button
          onClick={() => setActiveTab('menus')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'menus'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menús & Compra Barata</span>
        </button>
      </div>

      {/* TAB 1: FOCUS & HABITS */}
      {activeTab === 'focus' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* POMODORO */}
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

          {/* HÁBITOS DE AUTOCUIDADO */}
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
      )}

      {/* TAB 2: GRADES */}
      {activeTab === 'grades' && (
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
      )}

      {/* TAB 3: PERSONAL BUDGET */}
      {activeTab === 'budget' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Control de Gastos Mensuales</h3>
              <p className="text-xs text-stone-500">Gestión de tu dinero de estudiante para alquiler, transporte y comidas.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-50 text-right">
                <span className="text-[10px] text-stone-400 font-bold block">Gastado</span>
                <span className="text-sm font-bold text-stone-800">{totalSpent.toFixed(2)} €</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-right">
                <span className="text-[10px] text-emerald-700 font-bold block">Restante</span>
                <span className="text-base font-extrabold text-emerald-800">{remainingBudget.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">Concepto del gasto</label>
              <input
                type="text"
                required
                value={newExpense.concept}
                onChange={(e) => setNewExpense({ ...newExpense, concept: e.target.value })}
                placeholder="Ej. Fonendoscopio Littmann, billete Alsa..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Importe (€)</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition shadow-xs"
              >
                Añadir Gasto
              </button>
            </div>
          </form>

          <div className="divide-y divide-stone-100 text-xs pt-2">
            {state.expenses.map((e) => (
              <div key={e.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <strong className="text-stone-900 block">{e.concept}</strong>
                  <span className="text-[10px] text-stone-400">{e.date} · {e.category}</span>
                </div>
                <span className="font-bold text-stone-900">-{e.amount.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ROOMMATE EXPENSE SPLITTER (TRICOUNT) */}
      {activeTab === 'roommates' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#365e45]" />
                <h3 className="text-base font-bold text-stone-900">Cuentas Claras del Piso de Estudiantes</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Reparto de gastos comunes (bombona, productos de limpieza, papel, aceite, sal) estilo Tricount.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <span>Compañeras:</span>
              {roommatesList.map((r) => (
                <span key={r} className="px-2 py-0.5 rounded-full bg-stone-100 font-bold text-stone-800 text-[11px]">
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roommatesList.map((person) => {
              const bal = balances[person] || 0;
              const isPositive = bal >= 0;
              return (
                <div
                  key={person}
                  className={`p-4 rounded-2xl border text-center space-y-1 transition ${
                    isPositive
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <strong className="text-xs font-black text-stone-800 block">{person}</strong>
                  <div className={`text-xl font-black ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isPositive ? `+${bal.toFixed(2)} €` : `${bal.toFixed(2)} €`}
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    {bal > 0 ? 'Le deben recibir' : bal < 0 ? 'Debe aportar al bote' : 'Cuentas saldadas'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Add Roommate Expense Form */}
          <form onSubmit={handleAddRoommateExpenseSubmit} className="p-4 rounded-2xl bg-[#fafafa] border border-stone-200 space-y-3 text-xs">
            <strong className="text-stone-900 font-bold block text-xs">Registrar Gasto del Piso</strong>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Concepto *</label>
                <input
                  type="text"
                  required
                  value={newRoommateExp.title}
                  onChange={(e) => setNewRoommateExp({ ...newRoommateExp, title: e.target.value })}
                  placeholder="Ej. Detergente lavadora, aceite y papel de cocina"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Importe Total (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={newRoommateExp.amount}
                  onChange={(e) => setNewRoommateExp({ ...newRoommateExp, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Pagado por</label>
                <select
                  value={newRoommateExp.paidBy}
                  onChange={(e) => setNewRoommateExp({ ...newRoommateExp, paidBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                >
                  {roommatesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">
                Se divide a partes iguales entre: <strong>{roommatesList.join(', ')}</strong> ({ (newRoommateExp.amount / roommatesList.length).toFixed(2) } € / persona)
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#365e45] text-white font-bold hover:bg-[#284835] transition shadow-xs"
              >
                Añadir Gasto Común
              </button>
            </div>
          </form>

          {/* List of Roommate Expenses */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Historial de Gastos del Piso</h4>
            {state.roommateExpenses.length > 0 ? (
              state.roommateExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 transition ${
                    exp.settled ? 'bg-stone-50 opacity-60 border-stone-200' : 'bg-white border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className={`font-bold ${exp.settled ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {exp.title || exp.concept}
                      </strong>
                      {exp.settled && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Saldado
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Pagado por <strong>{exp.paidBy}</strong> el {exp.date} · Repartido entre {(exp.splitWith || exp.splitAmong || []).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-stone-900">
                      {exp.amount.toFixed(2)} €
                    </span>
                    <button
                      onClick={() => toggleRoommateExpenseSettled(exp.id)}
                      className="px-2.5 py-1 rounded-xl border border-stone-200 hover:bg-stone-100 text-[11px] font-semibold text-stone-600 transition"
                      title={exp.settled ? 'Marcar como pendiente' : 'Marcar como saldado'}
                    >
                      {exp.settled ? 'Desmarcar' : 'Saldar'}
                    </button>
                    <button
                      onClick={() => deleteRoommateExpense(exp.id)}
                      className="text-stone-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-2xl">
                Aún no hay gastos registrados con tus compañeras.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: WEEKLY MENUS & CHEAP GROCERY */}
      {activeTab === 'menus' && (
        <div className="space-y-6">
          {/* Menús de la Semana para Estudiante de Enfermería */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-[#365e45]" />
                  <h3 className="text-base font-bold text-stone-900">Menús Semanales Económicos y Prácticos</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Plan semanal equilibrado, nutritivo y rápido, pensado para llevar en tupper al hospital y preparar sin complicarse.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                ~25-30 € / semana
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEEKLY_MENUS.map((menu, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#fafbfa] border border-stone-200 space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-extrabold text-[#365e45]">{menu.day}</strong>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Día lectivo</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-100">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">🥗 Comida (Tupper)</span>
                        <p className="text-stone-800 font-medium leading-relaxed">{menu.lunch}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-stone-100">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">🍲 Cena</span>
                        <p className="text-stone-800 font-medium leading-relaxed">{menu.dinner}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2 rounded-xl bg-emerald-50/60 text-[11px] text-emerald-950 italic">
                    💡 {menu.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Compra Económica Optimizada */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <ShoppingBag className="w-5 h-5 text-[#365e45]" />
              <div>
                <h3 className="text-base font-bold text-stone-900">Cesta de la Compra Básica y Barata</h3>
                <p className="text-xs text-stone-500">Alimentos versátiles con alto valor nutricional y precio asequible en Toledo.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {BUDGET_GROCERY_ITEMS.map((g, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#fafafa] border border-stone-200 space-y-2">
                  <strong className="text-xs font-bold text-[#365e45] uppercase tracking-wider block">
                    {g.cat}
                  </strong>
                  <ul className="space-y-1.5 text-stone-700">
                    {g.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
