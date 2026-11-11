import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { GIBBS_CYCLE_GUIDE } from '../data/clinical/competencies';
import { ClinicalCompetency, GibbsReflection } from '../types';
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Download,
  Filter,
  Eye,
  CheckCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Practice360View: React.FC = () => {
  const {
    state,
    addShift,
    toggleShiftCompleted,
    removeShift,
    updateCompetencyStatus,
    addGibbsReflection,
    removeGibbsReflection
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<'hours' | 'passport' | 'gibbs' | 'export'>('hours');
  const [competencyCategory, setCompetencyCategory] = useState<string>('Todas');

  // New Shift Modal/Form State
  const [showAddShift, setShowAddShift] = useState(false);
  const [newShiftHospital, setNewShiftHospital] = useState('Hospital Universitario de Toledo (HUT)');
  const [newShiftService, setNewShiftService] = useState('Medicina Interna 3ª Planta');
  const [newShiftDate, setNewShiftDate] = useState(new Date().toISOString().slice(0, 10));
  const [newShiftType, setNewShiftType] = useState<any>('Mañana (08:00-15:00)');
  const [newShiftHours, setNewShiftHours] = useState('7');
  const [newShiftTutor, setNewShiftTutor] = useState('Enf. Supervisora');

  // New Gibbs reflection form state
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [reflContext, setReflContext] = useState('');
  const [reflDescription, setReflDescription] = useState('');
  const [reflFeelings, setReflFeelings] = useState('');
  const [reflEvaluation, setReflEvaluation] = useState('');
  const [reflAnalysis, setReflAnalysis] = useState('');
  const [reflConclusion, setReflConclusion] = useState('');
  const [reflActionPlan, setReflActionPlan] = useState('');

  // Hours calculation
  const totalCompletedHours = state.shifts
    .filter(s => s.completed)
    .reduce((acc, s) => acc + s.hours, 0);
  const targetHours = state.practiceHoursTarget || 150;
  const progressPercent = Math.min(100, Math.round((totalCompletedHours / targetHours) * 100));

  // Competency counts
  const totalCompetencies = state.competencies.length;
  const evaluatedCount = state.competencies.filter(c => c.status === 'Evaluada').length;
  const practicedCount = state.competencies.filter(c => c.status === 'Practicada').length;
  const observedCount = state.competencies.filter(c => c.status === 'Observada').length;

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    addShift({
      hospital: newShiftHospital,
      service: newShiftService,
      date: newShiftDate,
      shiftType: newShiftType,
      hours: parseFloat(newShiftHours) || 7,
      tutorName: newShiftTutor,
      status: 'Validado'
    });
    setShowAddShift(false);
  };

  const handleCreateReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflDescription.trim()) return;

    addGibbsReflection({
      date: new Date().toISOString().slice(0, 10),
      shiftContext: reflContext || 'Prácticas Clínicas en Toledo',
      description: reflDescription,
      feelings: reflFeelings,
      evaluation: reflEvaluation,
      analysis: reflAnalysis,
      conclusion: reflConclusion,
      actionPlan: reflActionPlan
    });

    setReflContext('');
    setReflDescription('');
    setReflFeelings('');
    setReflEvaluation('');
    setReflAnalysis('');
    setReflConclusion('');
    setReflActionPlan('');
    setShowNewReflection(false);
  };

  // Filtered competencies
  const filteredCompetencies = state.competencies.filter(c =>
    competencyCategory === 'Todas' ? true : c.category === competencyCategory
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1d3d30] via-[#285040] to-[#142920] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>PORTFOLIO CLÍNICO Y ESTANCIAS HOSPITALARIAS TOLEDO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Prácticas 360 · Turnos, Competencias & Diario
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Gestión completa de estancias clínicas para Julia en el Hospital Universitario de Toledo (HUT) y Hospital de Parapléjicos. Registro de horas, pasaporte de 4 niveles de competencia y diario reflexivo de Gibbs.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Horas Cumplidas
              </span>
              <strong className="text-xl font-black text-white">
                {totalCompletedHours} / {targetHours} h
              </strong>
              <span className="text-[10px] text-stone-300 block">
                {progressPercent}% del objetivo del curso
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Sub-tabs header */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'hours'
                ? 'bg-white text-[#1d3d30] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>1. Calendario de Turnos ({state.shifts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'bg-white text-[#1d3d30] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Pasaporte de Competencias</span>
          </button>
          <button
            onClick={() => setActiveTab('gibbs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'gibbs'
                ? 'bg-white text-[#1d3d30] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Diario Reflexivo de Gibbs ({state.reflections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'export'
                ? 'bg-white text-[#1d3d30] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. Memoria & Exportar Portfolio</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HORAS Y TURNOS */}
      {activeTab === 'hours' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-stone-700">Progreso Total de Prácticas:</span>
                <strong className="text-emerald-800 font-black">{totalCompletedHours} h / {targetHours} h</strong>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowAddShift(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1d3d30] text-white text-xs font-extrabold hover:bg-[#142920] transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Turno</span>
            </button>
          </div>

          {/* Add Shift Modal */}
          {showAddShift && (
            <form onSubmit={handleCreateShift} className="bg-white p-6 rounded-3xl border-2 border-emerald-500 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-extrabold text-stone-900">
                  Nuevo Registro de Turno Clínico
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddShift(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Centro Sanitario / Hospital</label>
                  <input
                    type="text"
                    value={newShiftHospital}
                    onChange={(e) => setNewShiftHospital(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Servicio / Unidad</label>
                  <input
                    type="text"
                    value={newShiftService}
                    onChange={(e) => setNewShiftService(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newShiftDate}
                    onChange={(e) => setNewShiftDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tipo de Turno</label>
                  <select
                    value={newShiftType}
                    onChange={(e) => setNewShiftType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="Mañana (08:00-15:00)">Mañana (08:00-15:00)</option>
                    <option value="Tarde (15:00-22:00)">Tarde (15:00-22:00)</option>
                    <option value="Noche (22:00-08:00)">Noche (22:00-08:00)</option>
                    <option value="Rotatorio">Rotatorio</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Horas Efectivas</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShiftHours}
                    onChange={(e) => setNewShiftHours(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tutor Clínico de Referencia</label>
                  <input
                    type="text"
                    value={newShiftTutor}
                    onChange={(e) => setNewShiftTutor(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition"
                >
                  Guardar Turno en Mi Historial
                </button>
              </div>
            </form>
          )}

          {/* Shifts list */}
          <div className="space-y-3">
            {state.shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleShiftCompleted(shift.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                      shift.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 hover:border-emerald-600 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {shift.date}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {shift.shiftType}
                      </span>
                      <span className="text-[10px] font-black text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                        {shift.hours} h
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-stone-900">
                      {shift.hospital} · {shift.service}
                    </h4>

                    {shift.tutorName && (
                      <span className="text-xs text-stone-400 block mt-0.5">
                        Tutor: {shift.tutorName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    shift.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {shift.completed ? 'Completado & Validado' : 'Pendiente'}
                  </span>

                  <button
                    onClick={() => removeShift(shift.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg transition"
                    title="Eliminar turno"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PASAPORTE DE COMPETENCIAS (4 NIVELES) */}
      {activeTab === 'passport' && (
        <div className="space-y-4">
          {/* Status summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Evaluadas</span>
              <strong className="text-2xl font-black text-emerald-700 block mt-0.5">
                {evaluatedCount}
              </strong>
              <span className="text-[10px] text-stone-400">Nivel Acreditado</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Practicadas</span>
              <strong className="text-2xl font-black text-blue-700 block mt-0.5">
                {practicedCount}
              </strong>
              <span className="text-[10px] text-stone-400">Bajo supervisión</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Observadas</span>
              <strong className="text-2xl font-black text-amber-600 block mt-0.5">
                {observedCount}
              </strong>
              <span className="text-[10px] text-stone-400">En planta / simulación</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Pendientes</span>
              <strong className="text-2xl font-black text-stone-400 block mt-0.5">
                {totalCompetencies - (evaluatedCount + practicedCount + observedCount)}
              </strong>
              <span className="text-[10px] text-stone-400">Por iniciar</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {['Todas', 'Seguridad y Asepsia', 'Vías y Medicación', 'Eliminación', 'Diagnóstico y Constantes', 'Urgencias y Soporte'].map(cat => (
              <button
                key={cat}
                onClick={() => setCompetencyCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  competencyCategory === cat
                    ? 'bg-[#1d3d30] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Competencies list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompetencies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {comp.category}
                      </span>
                      <h4 className="text-base font-extrabold text-stone-900 mt-1">
                        {comp.title}
                      </h4>
                    </div>

                    {/* Status Pill / Switcher */}
                    <select
                      value={comp.status}
                      onChange={(e) => updateCompetencyStatus(comp.id, e.target.value as ClinicalCompetency['status'])}
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                        comp.status === 'Evaluada'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : comp.status === 'Practicada'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : comp.status === 'Observada'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Observada">Observada</option>
                      <option value="Practicada">Practicada</option>
                      <option value="Evaluada">Evaluada</option>
                    </select>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {comp.description}
                  </p>

                  {comp.observations && (
                    <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600">
                      <strong className="text-stone-800 block text-[10px] uppercase font-bold">Observaciones:</strong>
                      {comp.observations}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Actualizado: {comp.updatedAt || 'Reciente'}</span>
                  {comp.evaluatedBy && (
                    <span className="text-emerald-800 font-bold">Por: {comp.evaluatedBy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DIARIO REFLEXIVO DE GIBBS */}
      {activeTab === 'gibbs' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Modelo de Reflexión Clínica de Graham Gibbs (1988)</span>
              </h3>
              <p className="text-xs text-emerald-900 mt-1 max-w-2xl leading-relaxed">
                El diario reflexivo es el método formativo universitario para madurar el juicio clínico. Estructura el aprendizaje en 6 fases: qué ocurrió, sentimientos, balance, análisis teórico, conclusión y plan de acción.
              </p>
            </div>

            <button
              onClick={() => setShowNewReflection(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-extrabold hover:bg-emerald-900 transition flex items-center gap-2 shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Reflexión de Guardia</span>
            </button>
          </div>

          {/* New Reflection Form */}
          {showNewReflection && (
            <form onSubmit={handleCreateReflection} className="bg-white p-6 rounded-3xl border-2 border-emerald-500 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-extrabold text-stone-900">
                  Redactar Reflexión Clínica Estructurada
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewReflection(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Contexto del Turno / Unidad (Ej. Urgencias Hospital Universitario de Toledo):
                </label>
                <input
                  type="text"
                  value={reflContext}
                  onChange={(e) => setReflContext(e.target.value)}
                  placeholder="Urgencias HUT, Planta 4ª Cirugía..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">1. Descripción (¿Qué ocurrió exactamente?):</label>
                  <textarea
                    rows={2}
                    value={reflDescription}
                    onChange={(e) => setReflDescription(e.target.value)}
                    placeholder="Describe la situación clínica o procedimiento..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">2. Sentimientos (¿Qué sentiste durante y después?):</label>
                  <textarea
                    rows={2}
                    value={reflFeelings}
                    onChange={(e) => setReflFeelings(e.target.value)}
                    placeholder="Inseguridad inicial, satisfacción al finalizar..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">3. Evaluación (¿Qué fue positivo y qué fue difícil?):</label>
                  <textarea
                    rows={2}
                    value={reflEvaluation}
                    onChange={(e) => setReflEvaluation(e.target.value)}
                    placeholder="Lo positivo fue la técnica estéril; lo difícil el trato con paciente inquieto..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">4. Análisis (¿Qué sentido tiene a la luz de los apuntes y protocolos?):</label>
                  <textarea
                    rows={2}
                    value={reflAnalysis}
                    onChange={(e) => setReflAnalysis(e.target.value)}
                    placeholder="Concordancia con el protocolo de Flebitis Zero o NANDA..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">5. Conclusión (¿Qué más pudiste haber hecho?):</label>
                  <textarea
                    rows={2}
                    value={reflConclusion}
                    onChange={(e) => setReflConclusion(e.target.value)}
                    placeholder="Podría haber pedido ayuda con antelación..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">6. Plan de Acción (Si vuelve a ocurrir, ¿cómo actuarás paso a paso?):</label>
                  <textarea
                    rows={2}
                    value={reflActionPlan}
                    onChange={(e) => setReflActionPlan(e.target.value)}
                    placeholder="En la siguiente ocasión palparé con calma antes de puncionar..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition shadow-xs"
                >
                  Guardar en mi Memoria de Prácticas
                </button>
              </div>
            </form>
          )}

          {/* Reflections List */}
          <div className="space-y-4">
            {state.reflections.map((refl) => (
              <div key={refl.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      {refl.date}
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-1">
                      {refl.shiftContext}
                    </h4>
                  </div>
                  <button
                    onClick={() => removeGibbsReflection(refl.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg transition"
                    title="Eliminar reflexión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <strong className="text-stone-900 block font-bold">1. Descripción de los hechos:</strong>
                    <p className="text-stone-700 leading-relaxed">{refl.description}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <strong className="text-stone-900 block font-bold">2. Sentimientos vividos:</strong>
                    <p className="text-stone-700 leading-relaxed">{refl.feelings}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <strong className="text-stone-900 block font-bold">3. Evaluación:</strong>
                    <p className="text-stone-700 leading-relaxed">{refl.evaluation}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <strong className="text-stone-900 block font-bold">4. Análisis teórico:</strong>
                    <p className="text-stone-700 leading-relaxed">{refl.analysis}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <strong className="text-stone-900 block font-bold">5. Conclusión:</strong>
                    <p className="text-stone-700 leading-relaxed">{refl.conclusion}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1 text-emerald-950">
                    <strong className="text-emerald-900 block font-bold">6. Plan de Acción Futuro:</strong>
                    <p className="leading-relaxed font-medium">{refl.actionPlan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: EXPORTAR PORTFOLIO Y MEMORIA */}
      {activeTab === 'export' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              Memoria Oficial de Estancias Clínicas
            </h3>
            <p className="text-xs text-stone-500">
              Documento formateado preparado para imprimir o presentar ante la comisión docente de la UCLM Toledo.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-3 font-mono">
            <div className="border-b border-stone-200 pb-2">
              <strong>ESTUDIANTE: </strong>{state.studentName} (1.º Grado en Enfermería - Campus de Toledo)<br />
              <strong>HORAS TOTALES CUMPLIDAS: </strong>{totalCompletedHours} horas de {targetHours} h ({progressPercent}%)<br />
              <strong>COMPETENCIAS ACREDITADAS: </strong>{evaluatedCount} evaluadas, {practicedCount} practicadas<br />
              <strong>REFLEXIONES GIBBS REGISTRADAS: </strong>{state.reflections.length} entradas reflexivas
            </div>
            <div>
              <strong>RESUMEN DE TURNOS REALIZADOS:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {state.shifts.map(s => (
                  <li key={s.id}>{s.date} - {s.hospital} ({s.service}): {s.hours}h [{s.shiftType}]</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-2xl bg-[#1d3d30] text-white text-xs sm:text-sm font-extrabold hover:bg-[#142920] transition flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Imprimir / Guardar Memoria en PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
