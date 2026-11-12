import React, { useState, useMemo } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { getLocalDateString, addDaysToDateStr, parseLocalDate } from '../utils/dateUtils';
import { generateWellbeingAdvice, WellbeingEntry } from '../utils/wellbeingAdvice';
import {
  Smile,
  Zap,
  Moon,
  Sparkles,
  Heart,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Stethoscope,
  GraduationCap,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  MessageCircleHeart
} from 'lucide-react';

interface WellbeingDashboardProps {
  onNavigate?: (page: string) => void;
}

export const WellbeingDashboard: React.FC<WellbeingDashboardProps> = ({ onNavigate }) => {
  const { state, updateWellbeing } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'today' | 'chart' | 'history'>('today');
  const [chartRange, setChartRange] = useState<7 | 14>(7);

  // Fecha de hoy calculada de forma local (hora de España)
  const todayStr = useMemo(() => getLocalDateString(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const selectedWb: WellbeingEntry = state.wellbeing[selectedDate] || {};

  // Fechas de los últimos N días para estadísticas y gráficas
  const pastDays = useMemo(() => {
    const list: string[] = [];
    for (let i = chartRange - 1; i >= 0; i--) {
      list.push(addDaysToDateStr(todayStr, -i));
    }
    return list;
  }, [todayStr, chartRange]);

  // Turno de prácticas de hoy o de la fecha seleccionada
  const todayShift = state.shifts.find((s) => s.date === selectedDate);
  const yesterdayDateStr = addDaysToDateStr(selectedDate, -1);
  const yesterdayShift = state.shifts.find((s) => s.date === yesterdayDateStr);

  // Próximo examen en los próximos 3 días
  const upcomingExam = state.exams.find(
    (e) => !e.completed && e.date >= selectedDate && e.date <= addDaysToDateStr(selectedDate, 3)
  );

  // Recopilar datos de la última semana para el analizador de consejos
  const recentWeekData = useMemo(() => {
    return pastDays.slice(-7).map((d) => ({
      date: d,
      data: state.wellbeing[d] || {},
    }));
  }, [pastDays, state.wellbeing]);

  // Generar consejo empático dinámico
  const currentAdvice = useMemo(() => {
    return generateWellbeingAdvice({
      todayWb: selectedWb,
      recentWeek: recentWeekData,
      todayShift: todayShift
        ? {
            hospital: todayShift.hospital,
            service: todayShift.service,
            date: todayShift.date,
            shiftType: todayShift.shiftType,
          }
        : undefined,
      yesterdayShift: yesterdayShift
        ? {
            hospital: yesterdayShift.hospital,
            service: yesterdayShift.service,
            date: yesterdayShift.date,
            shiftType: yesterdayShift.shiftType,
          }
        : undefined,
      upcomingExam: upcomingExam
        ? {
            subject: upcomingExam.subject,
            date: upcomingExam.date,
          }
        : undefined,
    });
  }, [selectedWb, recentWeekData, todayShift, yesterdayShift, upcomingExam]);

  // Estadísticas y medias de los últimos días
  const stats = useMemo(() => {
    let totalMood = 0;
    let countMood = 0;
    let totalEnergy = 0;
    let countEnergy = 0;
    let restfulSleepDays = 0;

    // Correlación con turnos
    let shiftEnergySum = 0;
    let shiftEnergyCount = 0;
    let nonShiftEnergySum = 0;
    let nonShiftEnergyCount = 0;

    const shiftDateSet = new Set(state.shifts.map((s) => s.date));

    pastDays.forEach((dateKey) => {
      const wb = state.wellbeing[dateKey];
      if (wb?.mood) {
        totalMood += wb.mood;
        countMood++;
      }
      if (wb?.energy) {
        totalEnergy += wb.energy;
        countEnergy++;
        if (shiftDateSet.has(dateKey)) {
          shiftEnergySum += wb.energy;
          shiftEnergyCount++;
        } else {
          nonShiftEnergySum += wb.energy;
          nonShiftEnergyCount++;
        }
      }
      if (wb?.sleep === '7-8h' || wb?.sleep === '> 8h') {
        restfulSleepDays++;
      }
    });

    const avgMood = countMood > 0 ? (totalMood / countMood).toFixed(1) : '-';
    const avgEnergy = countEnergy > 0 ? (totalEnergy / countEnergy).toFixed(1) : '-';
    const avgShiftEnergy = shiftEnergyCount > 0 ? (shiftEnergySum / shiftEnergyCount).toFixed(1) : null;
    const avgNonShiftEnergy = nonShiftEnergyCount > 0 ? (nonShiftEnergySum / nonShiftEnergyCount).toFixed(1) : null;

    return {
      avgMood,
      avgEnergy,
      countEntries: countMood,
      restfulSleepDays,
      avgShiftEnergy,
      avgNonShiftEnergy,
      shiftEnergyCount,
    };
  }, [pastDays, state.wellbeing, state.shifts]);

  const handleMoodSelect = (moodVal: number) => {
    updateWellbeing(selectedDate, { mood: moodVal });
  };

  const handleEnergySelect = (energyVal: number) => {
    updateWellbeing(selectedDate, { energy: energyVal });
  };

  const handleSleepSelect = (sleepVal: string) => {
    updateWellbeing(selectedDate, { sleep: sleepVal });
  };

  const handleNoteChange = (noteVal: string) => {
    updateWellbeing(selectedDate, { note: noteVal });
  };

  const isTodaySelected = selectedDate === todayStr;

  // Formateador amigable de fecha
  const formatFriendlyDate = (dateStr: string) => {
    if (dateStr === todayStr) return 'Hoy';
    if (dateStr === addDaysToDateStr(todayStr, -1)) return 'Ayer';
    if (dateStr === addDaysToDateStr(todayStr, 1)) return 'Mañana';
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600 shadow-2xs">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-stone-900">¿Cómo estás hoy, Julia?</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Tu diario y salud
              </span>
            </div>
            <p className="text-xs text-stone-500">Cuidar de ti es el primer paso para cuidar a los demás</p>
          </div>
        </div>

        {/* Tab switcher: Diario de Hoy | Gráfica Semanal | Historial */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold text-stone-600 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'today' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mi Registro</span>
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'chart' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gráfica</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Historial</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar (allows Julia to inspect or log yesterday, anteayer, etc.) */}
      <div className="flex items-center justify-between bg-[#fafbfa] p-2.5 rounded-2xl border border-stone-200/80 text-xs">
        <button
          onClick={() => setSelectedDate(addDaysToDateStr(selectedDate, -1))}
          className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-600 transition flex items-center gap-1"
          title="Día anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Día anterior</span>
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span className="font-extrabold text-stone-900 capitalize">
            {formatFriendlyDate(selectedDate)} ({selectedDate})
          </span>
          {!isTodaySelected && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition"
            >
              Volver a hoy
            </button>
          )}
        </div>

        <button
          onClick={() => setSelectedDate(addDaysToDateStr(selectedDate, 1))}
          disabled={selectedDate >= todayStr}
          className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-600 transition flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
          title="Día siguiente"
        >
          <span className="hidden sm:inline">Día siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ---------------- TAB 1: MI REGISTRO DIARIO ---------------- */}
      {activeTab === 'today' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Indicators for shifts or exams on this selected date */}
          {(todayShift || upcomingExam) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {todayShift && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
                  <span>
                    Turno de prácticas: <strong>{todayShift.hospital}</strong> ({todayShift.service} · {todayShift.shiftType})
                  </span>
                </div>
              )}
              {upcomingExam && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    Examen próximo: <strong>{upcomingExam.subject}</strong> ({upcomingExam.date})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 1. Estado de Ánimo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-emerald-600" />
                <span>¿Cómo está tu ánimo?</span>
              </span>
              <span className="text-[11px] text-stone-400">1 (Bajo) a 5 (Genial)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: 1, emoji: '😔', label: 'Bajo', desc: 'Desanimada' },
                { val: 2, emoji: '😕', label: 'Regular', desc: 'Cuesta arrancar' },
                { val: 3, emoji: '😐', label: 'Bien', desc: 'Tranquila' },
                { val: 4, emoji: '🙂', label: 'Animada', desc: 'Positiva' },
                { val: 5, emoji: '😄', label: 'Genial', desc: 'Radiante' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleMoodSelect(item.val)}
                  className={`p-2 sm:p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 group ${
                    selectedWb.mood === item.val
                      ? 'border-[#365e45] bg-[#e8f0e8] scale-105 shadow-xs ring-2 ring-emerald-500/30'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-stone-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Nivel de Energía */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>¿Qué nivel de energía sientes en el cuerpo?</span>
              </span>
              <span className="text-[11px] text-stone-400">1 (Agotada) a 5 (A tope)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: 1, emoji: '🪫', label: 'Agotada', desc: 'Batería roja' },
                { val: 2, emoji: '😴', label: 'Cansada', desc: 'Pesadez' },
                { val: 3, emoji: '⚡', label: 'Normal', desc: 'Estable' },
                { val: 4, emoji: '🔋', label: 'Buena', desc: 'Con fuelle' },
                { val: 5, emoji: '🚀', label: 'A tope', desc: 'Imparable' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleEnergySelect(item.val)}
                  className={`p-2 sm:p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 group ${
                    selectedWb.energy === item.val
                      ? 'border-amber-600 bg-amber-50 scale-105 shadow-xs ring-2 ring-amber-500/30'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-stone-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sueño y Descanso (El campo que antes no tenía botones) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>¿Cómo ha sido tu descanso de anoche?</span>
              </span>
              <span className="text-[11px] text-stone-400">Horas de sueño</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: '< 5h', emoji: '🥱', label: '< 5 horas', subtitle: 'Muy poco' },
                { val: '5-6h', emoji: '😴', label: '5-6 horas', subtitle: 'Justito' },
                { val: '7-8h', emoji: '💤', label: '7-8 horas', subtitle: 'Reparador' },
                { val: '> 8h', emoji: '✨', label: '> 8 horas', subtitle: 'Pleno' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleSleepSelect(item.val)}
                  className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 group ${
                    selectedWb.sleep === item.val
                      ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-xs ring-2 ring-indigo-500/30'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xl group-hover:scale-110 transition">{item.emoji}</span>
                  <span className="text-[10px] font-extrabold text-stone-800">{item.label}</span>
                  <span className="text-[9px] text-stone-500">{item.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Una línea de hoy (Nota) */}
          <div className="pt-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1.5">
              <span>✍️ Tu línea de hoy (mini diario de Julia)</span>
            </label>
            <input
              type="text"
              value={selectedWb.note || ''}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="¿Qué has sentido hoy en clase, en planta o qué te ha hecho sonreír?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
            />
          </div>

          {/* 5. TARJETA DINÁMICA DE CONSEJO EMPÁTICO & CARIÑOSO */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
              currentAdvice.alertLevel === 'care'
                ? 'bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-rose-50/40 border-rose-200/90'
                : currentAdvice.alertLevel === 'cheer'
                ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-200'
                : 'bg-gradient-to-br from-[#f8faf8] via-emerald-50/30 to-[#f2f7f3] border-emerald-200/60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  currentAdvice.alertLevel === 'care'
                    ? 'bg-rose-100 text-rose-700'
                    : currentAdvice.alertLevel === 'cheer'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentAdvice.alertLevel === 'care' ? (
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-600 animate-pulse" />
                ) : currentAdvice.alertLevel === 'cheer' ? (
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Smile className="w-5 h-5 text-emerald-700" />
                )}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      currentAdvice.alertLevel === 'care'
                        ? 'bg-rose-200/70 text-rose-900'
                        : currentAdvice.alertLevel === 'cheer'
                        ? 'bg-emerald-200/70 text-emerald-900'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {currentAdvice.badge}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">Consejo adaptado a tu día</span>
                </div>
                <h4 className="text-sm font-extrabold text-stone-900">{currentAdvice.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed">{currentAdvice.text}</p>

                {/* Micro-tip práctico */}
                <div className="mt-2 p-2.5 rounded-xl bg-white/80 border border-stone-200/60 text-xs text-stone-800 flex items-start gap-2 shadow-2xs">
                  <span className="text-sm shrink-0">💡</span>
                  <p className="leading-snug">
                    <strong className="font-bold text-stone-900">Pequeño gesto para hoy: </strong>
                    {currentAdvice.microTip}
                  </p>
                </div>

                {/* Family note if tired */}
                {currentAdvice.familyNote && (
                  <p className="text-[11px] font-semibold text-rose-800 italic pt-1 flex items-center gap-1.5">
                    <MessageCircleHeart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{currentAdvice.familyNote}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: GRÁFICA & MÉTRICAS DE EVOLUCIÓN ---------------- */}
      {activeTab === 'chart' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Range toggle (7 vs 14 days) */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Evolución de Ánimo y Energía</span>
            </span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl">
              <button
                onClick={() => setChartRange(7)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  chartRange === 7 ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                7 días
              </button>
              <button
                onClick={() => setChartRange(14)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  chartRange === 14 ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                14 días
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Media de Ánimo</span>
              <strong className="text-lg font-black text-emerald-950">{stats.avgMood}</strong>
              <span className="text-[9px] text-emerald-700 block">de 5.0</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Media de Energía</span>
              <strong className="text-lg font-black text-amber-950">{stats.avgEnergy}</strong>
              <span className="text-[9px] text-amber-700 block">de 5.0</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-800 uppercase block">Buen Descanso</span>
              <strong className="text-lg font-black text-indigo-950">
                {stats.restfulSleepDays}/{chartRange}
              </strong>
              <span className="text-[9px] text-indigo-700 block">días con ≥7h</span>
            </div>
          </div>

          {/* Interactive Visual SVG Chart */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-stone-200">
            <div className="flex items-center justify-between mb-3 text-[11px] text-stone-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <strong className="text-stone-700">Ánimo (1-5)</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <strong className="text-stone-700">Energía (1-5)</strong>
                </span>
              </div>
              <span className="text-stone-400">Toca un punto para ver detalles</span>
            </div>

            {/* SVG Plot */}
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 500 170" className="w-full h-44 select-none">
                {/* Horizontal Guide Lines for scale 1 to 5 */}
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const y = 140 - (lvl - 1) * 30;
                  return (
                    <g key={lvl}>
                      <line x1="25" y1={y} x2="490" y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />
                      <text x="12" y={y + 3} fontSize="9" fill="#9ca3af" textAnchor="middle">
                        {lvl}
                      </text>
                    </g>
                  );
                })}

                {/* Calculate coordinates */}
                {(() => {
                  const stepX = (490 - 35) / Math.max(1, pastDays.length - 1);
                  const moodPoints = pastDays.map((d, idx) => {
                    const val = state.wellbeing[d]?.mood || 3;
                    return { x: 35 + idx * stepX, y: 140 - (val - 1) * 30, val, date: d };
                  });
                  const energyPoints = pastDays.map((d, idx) => {
                    const val = state.wellbeing[d]?.energy || 3;
                    return { x: 35 + idx * stepX, y: 140 - (val - 1) * 30, val, date: d };
                  });

                  const moodPath = moodPoints.reduce(
                    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                    ''
                  );
                  const energyPath = energyPoints.reduce(
                    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                    ''
                  );

                  return (
                    <>
                      {/* Mood Line */}
                      <path d={moodPath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Energy Line */}
                      <path d={energyPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Day Points and Shift/Exam Badges */}
                      {pastDays.map((dateKey, idx) => {
                        const ptMood = moodPoints[idx];
                        const ptEnergy = energyPoints[idx];
                        const hasShift = state.shifts.some((s) => s.date === dateKey);
                        const hasExam = state.exams.some((e) => e.date === dateKey);
                        const sleepVal = state.wellbeing[dateKey]?.sleep;
                        const isSel = dateKey === selectedDate;

                        return (
                          <g
                            key={dateKey}
                            onClick={() => {
                              setSelectedDate(dateKey);
                              setActiveTab('today');
                            }}
                            className="cursor-pointer group"
                          >
                            {/* Vertical highlight line on selected date */}
                            {isSel && (
                              <line
                                x1={ptMood.x}
                                y1="15"
                                x2={ptMood.x}
                                y2="145"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="2 2"
                              />
                            )}

                            {/* Practice shift badge icon on top */}
                            {hasShift && (
                              <g transform={`translate(${ptMood.x - 7}, 5)`}>
                                <rect width="14" height="14" rx="4" fill="#3b82f6" />
                                <text x="7" y="10.5" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  H
                                </text>
                              </g>
                            )}

                            {/* Exam badge icon on top */}
                            {hasExam && (
                              <g transform={`translate(${ptMood.x - 7}, ${hasShift ? 21 : 5})`}>
                                <rect width="14" height="14" rx="4" fill="#f59e0b" />
                                <text x="7" y="10.5" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                                  E
                                </text>
                              </g>
                            )}

                            {/* Energy point */}
                            <circle
                              cx={ptEnergy.x}
                              cy={ptEnergy.y}
                              r={isSel ? 5.5 : 4}
                              fill="#f59e0b"
                              stroke="white"
                              strokeWidth="1.5"
                            />

                            {/* Mood point */}
                            <circle
                              cx={ptMood.x}
                              cy={ptMood.y}
                              r={isSel ? 5.5 : 4}
                              fill="#059669"
                              stroke="white"
                              strokeWidth="1.5"
                            />

                            {/* Date Label on bottom */}
                            <text
                              x={ptMood.x}
                              y="160"
                              fontSize="8.5"
                              fontWeight={isSel ? 'bold' : 'normal'}
                              fill={isSel ? '#10b981' : '#6b7280'}
                              textAnchor="middle"
                            >
                              {parseLocalDate(dateKey).toLocaleDateString('es-ES', { weekday: 'narrow' })}
                              {parseLocalDate(dateKey).getDate()}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded font-black text-[8px]">H</span>
                <span>Turno de hospital / prácticas</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded font-black text-[8px]">E</span>
                <span>Examen oficial</span>
              </span>
            </div>
          </div>

          {/* 🌟 CRUCE CON TURNOS DE PRÁCTICAS Y EXÁMENES (Correlación real) */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold">
              <Activity className="w-4 h-4 text-blue-700" />
              <span>Análisis de Correlación: Prácticas vs. Cansancio</span>
            </div>
            {stats.avgShiftEnergy && stats.avgNonShiftEnergy ? (
              <p className="text-stone-700 leading-relaxed">
                Los datos muestran que en los días con turno de prácticas hospitalarias tu energía promedio es de{' '}
                <strong className="text-blue-900">{stats.avgShiftEnergy} / 5</strong>, frente a{' '}
                <strong className="text-emerald-900">{stats.avgNonShiftEnergy} / 5</strong> en días de solo clase o descanso.
                <br />
                <span className="text-[11px] text-stone-600 block mt-1">
                  💡 <em>Consejo de enfermería:</em> Es totalmente normal. Cuando tengas turno de tarde o fin de semana, no
                  programes sesiones densas de memorización para esa misma noche. ¡Prioriza cenar pronto y descansar!
                </span>
              </p>
            ) : (
              <p className="text-stone-600 leading-relaxed">
                Registra tu bienestar en los días que tengas turnos en el Hospital de Toledo para descubrir cómo afecta la
                carga asistencial a tu energía y sueño, y recibir consejos adaptados.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: HISTORIAL & MINI-DIARIO ---------------- */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-stone-800">Tus últimos registros (Mini diario emocional)</span>
            <span className="text-stone-400 text-[11px]">Pulsa en cualquier día para editar</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {pastDays
              .slice()
              .reverse()
              .map((dateKey) => {
                const wb = state.wellbeing[dateKey];
                const shift = state.shifts.find((s) => s.date === dateKey);
                const exam = state.exams.find((e) => e.date === dateKey);
                const moodEmoji = wb?.mood
                  ? ['😔', '😕', '😐', '🙂', '😄'][wb.mood - 1]
                  : '—';
                const energyEmoji = wb?.energy
                  ? ['🪫', '😴', '⚡', '🔋', '🚀'][wb.energy - 1]
                  : '—';

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setActiveTab('today');
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      dateKey === selectedDate
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-emerald-300 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-stone-900 capitalize">
                          {formatFriendlyDate(dateKey)}
                        </strong>
                        <span className="text-[10px] text-stone-400">({dateKey})</span>

                        {shift && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-0.5">
                            <Stethoscope className="w-2.5 h-2.5" />
                            <span>Turno</span>
                          </span>
                        )}
                        {exam && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
                            <GraduationCap className="w-2.5 h-2.5" />
                            <span>Examen</span>
                          </span>
                        )}
                      </div>

                      {wb?.note ? (
                        <p className="text-xs text-stone-600 italic mt-1 line-clamp-1">
                          «{wb.note}»
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-400 mt-0.5">Sin nota registrada</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div className="flex items-center gap-1.5 text-xs bg-stone-50 px-2 py-1 rounded-xl border border-stone-200/60">
                        <span title="Ánimo">{moodEmoji}</span>
                        <span title="Energía">{energyEmoji}</span>
                        {wb?.sleep && (
                          <span className="text-[10px] font-bold text-indigo-700 ml-1">
                            {wb.sleep}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
