import React, { useEffect, useState } from 'react';
import { useCampusStore, isDemoMode, setDemoMode } from '../hooks/useCampusStore';
import { getMessageForDate } from '../utils/dailyMessage';
import {
  Heart,
  Calendar,
  AlertCircle,
  Pill,
  Calculator,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Smile,
  Zap,
  Moon,
  MessageSquareHeart,
  Stethoscope,
  ChevronRight,
  GraduationCap,
  TestTube2,
  Bot,
  Brain,
  Compass,
  Car,
  ShieldAlert,
  HeartPulse,
  FolderLock,
  ExternalLink
} from 'lucide-react';

interface TodayViewProps {
  onNavigate: (page: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onNavigate }) => {
  const { state, updateState } = useCampusStore();

  // Mensaje de casa del día: cambia solo cada día (a medianoche) y no se puede editar
  const [today, setToday] = useState<Date>(() => new Date());
  useEffect(() => {
    const refresh = () => setToday(new Date());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const dailyMessage = getMessageForDate(today);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWb = state.wellbeing[todayStr] || {};

  // Next upcoming exams (not completed, sorted by date)
  const upcomingExams = state.exams
    .filter((e) => !e.completed && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Next upcoming practice shifts
  const upcomingShifts = state.shifts
    .filter((s) => !s.completed && s.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Today's tasks
  const pendingTasks = state.tasks.filter((t) => !t.done);

  const getDaysDiff = (targetDate: string) => {
    const diff = Math.round(
      (new Date(targetDate + 'T12:00:00').getTime() - new Date(todayStr + 'T12:00:00').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return '¡Hoy!';
    if (diff === 1) return 'Mañana';
    return `En ${diff} días`;
  };

  const handleMoodSelect = (moodVal: number) => {
    updateState((prev) => ({
      ...prev,
      wellbeing: {
        ...prev.wellbeing,
        [todayStr]: {
          ...todayWb,
          mood: moodVal,
        },
      },
    }));
  };

  const handleEnergySelect = (energyVal: number) => {
    updateState((prev) => ({
      ...prev,
      wellbeing: {
        ...prev.wellbeing,
        [todayStr]: {
          ...todayWb,
          energy: energyVal,
        },
      },
    }));
  };

  const completedPocket = state.pocketChecklist.filter((i) => i.checked).length;

  return (
    <div className="space-y-6">
      {/* Bienvenida: solo mientras la app está vacía */}
      {!isDemoMode() &&
        state.exams.length === 0 &&
        state.shifts.length === 0 &&
        state.grades.length === 0 &&
        state.reflections.length === 0 && (
          <section className="rounded-3xl bg-white border border-[#d9e6dc] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">👋 ¡Bienvenida, Julia! Tu app está lista para empezar de cero</h2>
              <p className="text-sm text-stone-600 mt-1">
                Aún no hay nada guardado, así que empieza por lo básico. Cuando añadas tus datos, esta portada se llenará
                sola con tus próximos exámenes y turnos.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="px-4 py-3 rounded-2xl bg-[#f0f5f1] hover:bg-[#e3ede6] text-[#1f4430] text-left transition"
              >
                1. Añade tus exámenes y turnos de prácticas
              </button>
              <button
                type="button"
                onClick={() => onNavigate('uclm')}
                className="px-4 py-3 rounded-2xl bg-[#f0f5f1] hover:bg-[#e3ede6] text-[#1f4430] text-left transition"
              >
                2. Revisa y ajusta tus asignaturas
              </button>
              <button
                type="button"
                onClick={() => onNavigate('life')}
                className="px-4 py-3 rounded-2xl bg-[#f0f5f1] hover:bg-[#e3ede6] text-[#1f4430] text-left transition"
              >
                3. Apunta tus notas y tus hábitos
              </button>
            </div>
            <p className="text-xs text-stone-500">
              ¿Quieres ver cómo se ve la app cuando está llena?{' '}
              <button
                type="button"
                onClick={() => setDemoMode(true)}
                className="font-bold text-[#365e45] underline underline-offset-2"
              >
                Pulsa aquí para abrir la Demo
              </button>{' '}
              (es solo para mirar; no toca tus datos).
            </p>
          </section>
        )}

      {/* Grand Hero: Julia H. Carreras & Family Support */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a3325] via-[#2d553e] to-[#152a1e] p-6 sm:p-8 md:p-10 text-white shadow-xl border border-emerald-500/20">
        <div className="absolute right-0 top-0 translate-x-16 -translate-y-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-12 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Large Caricature Photo of Julia */}
          <div className="relative shrink-0 group">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-white/95 shadow-2xl ring-4 ring-emerald-400/50 bg-white/10 transition-transform duration-300 group-hover:scale-[1.02]">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/Ilustraci_n_alegre_de_estudiante_de_enfermer_a_aa60d2b2.png`}
                alt="Julia H. Carreras - Estudiante de Enfermería"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Cute nursing badge */}
            <div className="absolute -bottom-2 -right-2 bg-white text-[#203a2b] px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 border border-emerald-200">
              <span className="text-rose-500 text-sm">♥</span>
              <span>Futura Enfermera</span>
            </div>
          </div>

          {/* Name & Academic Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>Grado en Enfermería · UCLM Toledo</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-sm">
                Julia H. Carreras
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base font-semibold">
                1.º Curso · Facultad de Fisioterapia y Enfermería (Campus Fábrica de Armas)
              </p>
            </div>

            {/* Quick status chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-white font-medium border border-white/15">
                📚 10 Asignaturas (60 ECTS)
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-white font-medium border border-white/15">
                🏥 Prácticas Clínicas en Toledo
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-white font-medium border border-white/15">
                💊 Farmacología & Goteros
              </span>
            </div>

            {/* Mensaje de casa del día (no editable) */}
            <div className="mt-4 pt-4 border-t border-white/15 text-left">
              <div className="flex items-center justify-between gap-2 text-xs text-emerald-200 mb-1.5 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Un mensaje especial para ti</span>
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold normal-case tracking-normal shrink-0">
                  {dailyMessage.icon ? `${dailyMessage.icon} ` : ''}
                  {dailyMessage.category}
                </span>
              </div>
              <div className="bg-black/10 p-3.5 rounded-2xl border border-white/10 space-y-2">
                <p className="text-base sm:text-lg font-medium leading-relaxed italic text-emerald-50">
                  «{dailyMessage.text}»
                </p>
                <p className="text-sm text-emerald-200 text-right">{dailyMessage.signature}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Clinical Grid · Los 7 Módulos de Campus 2.0 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500">
            Los 7 Módulos de Campus 2.0
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
            UCLM Toledo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Mi UCLM */}
          <button
            onClick={() => onNavigate('uclm')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 1</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-emerald-800 transition line-clamp-1">Mi UCLM</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">Plan 4 Cursos</span>
          </button>

          {/* 2. Academia */}
          <button
            onClick={() => onNavigate('academy')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <Brain className="w-4 h-4 text-purple-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 2</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-purple-800 transition line-clamp-1">Academia</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">4 Modos Test</span>
          </button>

          {/* 3. Laboratorio */}
          <button
            onClick={() => onNavigate('laboratory')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <TestTube2 className="w-4 h-4 text-teal-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 3</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-teal-800 transition line-clamp-1">Laboratorio</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">Analíticas & ECG</span>
          </button>

          {/* 4. Simulación ECOE */}
          <button
            onClick={() => onNavigate('ecoe')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <Stethoscope className="w-4 h-4 text-rose-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 4</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-rose-800 transition line-clamp-1">Simulación ECOE</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">10 Estaciones</span>
          </button>

          {/* 5. Farmacología PRO */}
          <button
            onClick={() => onNavigate('pharmacologyPro')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <Pill className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 5</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-emerald-800 transition line-clamp-1">Fármacos PRO</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">Y-Site & Dosis</span>
          </button>

          {/* 6. Prácticas 360 */}
          <button
            onClick={() => onNavigate('practice360')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 6</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-blue-800 transition line-clamp-1">Prácticas 360</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">Turnos & Gibbs</span>
          </button>

          {/* 7. Tutor IA */}
          <button
            onClick={() => onNavigate('tutorAI')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition">
              <Bot className="w-4 h-4 text-amber-700" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Módulo 7</span>
            <strong className="text-xs font-black text-stone-900 group-hover:text-amber-800 transition line-clamp-1">Tutor IA</strong>
            <span className="text-[10px] text-stone-500 mt-0.5">7 Profesores</span>
          </button>
        </div>
      </div>

      {/* Herramientas de Vida y Práctica Diaria */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => onNavigate('shortcuts')}
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-2xs hover:shadow-sm transition text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#365e45] flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-black text-stone-900 block group-hover:text-emerald-800">
              Panel Atajos
            </strong>
            <span className="text-[10px] text-stone-500">appUCLM, Alsa, IA...</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('travel')}
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-blue-500 shadow-2xs hover:shadow-sm transition text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-black text-stone-900 block group-hover:text-blue-800">
              Viajes Granada
            </strong>
            <span className="text-[10px] text-stone-500">Horarios y maleta</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('emergency')}
          className="p-3.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-500 shadow-2xs hover:shadow-sm transition text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-black text-rose-900 block">
              Emergencias 112
            </strong>
            <span className="text-[10px] text-rose-600 font-semibold">Ubicación WhatsApp</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('cpr')}
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 shadow-2xs hover:shadow-sm transition text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-black text-stone-900 block group-hover:text-amber-800">
              Protocolo RCP
            </strong>
            <span className="text-[10px] text-stone-500">Metrónomo 105 bpm</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-purple-500 shadow-2xs hover:shadow-sm transition text-left flex flex-col justify-between group col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition">
            <FolderLock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-black text-stone-900 block group-hover:text-purple-800">
              Bóveda & Salud
            </strong>
            <span className="text-[10px] text-stone-500">DNI, citas y medicación</span>
          </div>
        </button>
      </div>

      {/* Main 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Reminders (Exams + Practice Shifts) */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Próximos Exámenes</h3>
                  <p className="text-xs text-stone-500">Fechas oficiales del curso</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#365e45] hover:text-[#203a2b] flex items-center gap-1"
              >
                <span>Ver todos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-2xl bg-[#fafbfa] border border-stone-200/80 hover:border-emerald-300 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-stone-900">{exam.subject}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {exam.weightPercent ? `${exam.weightPercent}% de la nota` : 'Examen'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{exam.date} · {exam.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{exam.classroom}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#e8f0e8] text-[#2d523e]">
                        {getDaysDiff(exam.date)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-2xl">
                  No hay exámenes pendientes próximos. ¡Buen momento para repasar a tu ritmo!
                </div>
              )}
            </div>
          </div>

          {/* Clinical Practice Shifts Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-xl text-[#365e45]">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Prácticas Clínicas</h3>
                  <p className="text-xs text-stone-500">Hospital Universitario de Toledo & Centros de Salud</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('practicas')}
                className="text-xs font-bold text-[#365e45] hover:text-[#203a2b] flex items-center gap-1"
              >
                <span>Mis horas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingShifts.length > 0 ? (
                upcomingShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-3.5 rounded-2xl bg-[#fafbfa] border border-stone-200/80 hover:border-emerald-300 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <strong className="text-sm font-bold text-stone-900">{shift.hospital}</strong>
                      <p className="text-xs text-stone-600 mt-0.5">{shift.service}</p>
                      <div className="text-[11px] text-stone-500 flex items-center gap-3 mt-1">
                        <span>{shift.date}</span>
                        <span className="font-semibold text-emerald-800">{shift.shiftType}</span>
                        <span>{shift.hours} horas</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#e8f0e8] text-[#2d523e]">
                      {getDaysDiff(shift.date)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-2xl">
                  Aún no has registrado próximos turnos. Puedes añadirlos en la sección de Recordatorios.
                </div>
              )}
            </div>

            {/* Pocket Checklist Status */}
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#365e45]" />
                <span className="text-stone-600">Bolsillo de uniforme: <strong>{completedPocket}/{state.pocketChecklist.length}</strong> listos</span>
              </div>
              <button
                onClick={() => onNavigate('reminders')}
                className="font-bold text-[#365e45] hover:underline"
              >
                Revisar checklist →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Wellbeing Check-in & Fast Tools */}
        <div className="space-y-6">
          {/* Daily Wellbeing Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-pink-50 rounded-xl text-pink-600">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">¿Cómo estás hoy?</h3>
                <p className="text-xs text-stone-500">Cuidar de ti es el primer paso para cuidar a los demás</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-600 block mb-2">Estado de ánimo</span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { val: 1, emoji: '😔', label: 'Bajo' },
                    { val: 2, emoji: '😕', label: 'Regular' },
                    { val: 3, emoji: '😐', label: 'Bien' },
                    { val: 4, emoji: '🙂', label: 'Animada' },
                    { val: 5, emoji: '😄', label: 'Genial' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => handleMoodSelect(item.val)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        todayWb.mood === item.val
                          ? 'border-[#365e45] bg-[#e8f0e8] scale-105 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-[10px] font-semibold text-stone-600">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-600 block mb-2">Nivel de energía</span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { val: 1, emoji: '🪫', label: 'Agotada' },
                    { val: 2, emoji: '😴', label: 'Cansada' },
                    { val: 3, emoji: '⚡', label: 'Normal' },
                    { val: 4, emoji: '🔋', label: 'Buena' },
                    { val: 5, emoji: '🚀', label: 'A tope' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => handleEnergySelect(item.val)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        todayWb.energy === item.val
                          ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-[10px] font-semibold text-stone-600">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-stone-600 block mb-1">Una línea de hoy</label>
                <input
                  type="text"
                  value={todayWb.note || ''}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      wellbeing: {
                        ...prev.wellbeing,
                        [todayStr]: {
                          ...todayWb,
                          note: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Hoy he aprendido, o qué me ha hecho sonreír..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>
            </div>
          </div>

          {/* Quick Academic Progress & Study Tips */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-2">Regla de Oro en Prácticas</h3>
            <div className="p-4 rounded-2xl bg-[#f6f8f5] border border-stone-200 text-xs text-stone-700 space-y-2">
              <p className="font-semibold text-[#284835] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#365e45]" />
                <span>«Ante cualquier duda con un paciente o medicación: PREGUNTA SIEMPRE»</span>
              </p>
              <p className="text-stone-600 leading-relaxed">
                Ninguna enfermera experimentada te juzgará por verificar una orden o confirmar la vía de administración. Preguntar salva vidas y demuestra máxima responsabilidad profesional.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">¿Quieres repasar terminología médica?</span>
              <button
                onClick={() => onNavigate('terminology')}
                className="font-bold text-[#365e45] hover:underline"
              >
                Abrir flashcards →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
