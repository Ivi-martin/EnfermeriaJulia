import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { ECOE_STATIONS } from '../data/ecoe/stations';
import { EcoeStation } from '../types';
import {
  Stethoscope,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const ECOEView: React.FC = () => {
  const { state, recordEcoeScore } = useCampusStore();
  const [selectedStation, setSelectedStation] = useState<EcoeStation>(ECOE_STATIONS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [checkedStepIds, setCheckedStepIds] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(ECOE_STATIONS[0].timeLimitMinutes * 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [simulationMode, setSimulationMode] = useState<'practice' | 'exam'>('practice');

  // Handle station selection
  const handleSelectStation = (station: EcoeStation) => {
    setSelectedStation(station);
    setIsSimulating(false);
    setIsFinished(false);
    setCheckedStepIds([]);
    setSecondsRemaining(station.timeLimitMinutes * 60);
  };

  // Timer countdown
  useEffect(() => {
    if (!isSimulating || isFinished) return;
    if (secondsRemaining <= 0) {
      handleFinishSimulation();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSimulating, isFinished, secondsRemaining]);

  const handleStartSimulation = (mode: 'practice' | 'exam') => {
    setSimulationMode(mode);
    setCheckedStepIds([]);
    setIsFinished(false);
    setSecondsRemaining(selectedStation.timeLimitMinutes * 60);
    setIsSimulating(true);
  };

  const handleToggleStep = (stepId: string) => {
    if (isFinished) return;
    setCheckedStepIds(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const handleFinishSimulation = () => {
    setIsFinished(true);
    setIsSimulating(false);

    // Calculate score
    const totalPointsPossible = selectedStation.checklistSteps.reduce((acc, s) => acc + s.points, 0);
    const earnedPoints = selectedStation.checklistSteps
      .filter(s => checkedStepIds.includes(s.id))
      .reduce((acc, s) => acc + s.points, 0);

    const calculatedScore = Math.round((earnedPoints / totalPointsPossible) * 100);

    // Check critical errors: if any critical step was NOT completed
    const criticalSteps = selectedStation.checklistSteps.filter(s => s.isCriticalError);
    const missedCritical = criticalSteps.some(s => !checkedStepIds.includes(s.id));
    const passed = calculatedScore >= 70 && !missedCritical;

    recordEcoeScore(selectedStation.id, calculatedScore, passed);
  };

  // Format time
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Evaluation calculations
  const totalPoints = selectedStation.checklistSteps.reduce((acc, s) => acc + s.points, 0);
  const earnedPoints = selectedStation.checklistSteps
    .filter(s => checkedStepIds.includes(s.id))
    .reduce((acc, s) => acc + s.points, 0);
  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  
  const criticalSteps = selectedStation.checklistSteps.filter(s => s.isCriticalError);
  const missedCriticalSteps = criticalSteps.filter(s => !checkedStepIds.includes(s.id));
  const hasCriticalFailure = missedCriticalSteps.length > 0;
  const isPassed = scorePercent >= 70 && !hasCriticalFailure;

  const previousRecord = state.ecoeScores[selectedStation.id];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#193b2d] via-[#244e3d] to-[#12281e] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>SIMULACIÓN CLÍNICA Y EVALUACIÓN DE COMPETENCIAS ECOE / OSCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simulación ECOE · Laboratorio de Habilidades
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              10 estaciones clínicas regladas según el modelo ECOE universitario. Checklists por fases, detección de fallos críticos no compensables y cronómetro oficial para preparar tus talleres en Fábrica de Armas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Estaciones Acreditadas
              </span>
              <strong className="text-lg font-black text-white">
                {Object.values(state.ecoeScores).filter(r => r.passed).length} / {ECOE_STATIONS.length}
              </strong>
              <span className="text-[10px] text-stone-300 block">
                {Math.round((Object.values(state.ecoeScores).filter(r => r.passed).length / ECOE_STATIONS.length) * 100)}% de la rueda superada
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Stations Horizontal Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-6 pt-6 border-t border-white/15 scrollbar-thin">
          {ECOE_STATIONS.map((station) => {
            const isSelected = selectedStation.id === station.id;
            const record = state.ecoeScores[station.id];
            return (
              <button
                key={station.id}
                onClick={() => handleSelectStation(station)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-white text-[#193b2d] shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px] font-black">
                  #{station.number}
                </span>
                <span>{station.title.split(' ')[0]} {station.title.split(' ')[1]}...</span>
                {record?.passed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Station View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Station Details & Scenario (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Estación #{selectedStation.number}
                  </span>
                  <span className="text-[10px] font-extrabold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    Nivel {selectedStation.level}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedStation.timeLimitMinutes} min
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-stone-900 leading-snug">
                  {selectedStation.title}
                </h2>
              </div>
            </div>

            {/* Scenario box */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
                Escenario Clínico Simulado:
              </span>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {selectedStation.scenario}
              </p>
            </div>

            {/* Materials Needed */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-2">
                Material Requerido en la Mesa de Trabajo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStation.materialsNeeded.map((mat, mIdx) => (
                  <span
                    key={mIdx}
                    className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Errors Warning */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 text-xs text-rose-950">
              <div className="flex items-center gap-1.5 font-extrabold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Errores Críticos No Compensables en esta Estación:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
                {selectedStation.criticalErrorsDescription.map((err, eIdx) => (
                  <li key={eIdx}>{err}</li>
                ))}
              </ul>
            </div>

            {/* Docent Source */}
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
              <span>{selectedStation.docentSource}</span>
              {previousRecord && (
                <span className="font-bold text-emerald-800">
                  Mejor: {previousRecord.bestScore}% {previousRecord.passed ? '✓' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Checklist & Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {!isSimulating && !isFinished ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleStartSimulation('practice')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-extrabold hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Modo Aprendizaje</span>
                </button>
                <button
                  onClick={() => handleStartSimulation('exam')}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#193b2d] text-white text-xs font-extrabold hover:bg-[#12281e] transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Simulacro Examen ({selectedStation.timeLimitMinutes} min)</span>
                </button>
              </div>
            ) : isSimulating ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-black ${
                    secondsRemaining < 60 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-stone-100 text-stone-800'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(secondsRemaining)}</span>
                  </div>
                  <span className="text-xs text-stone-500 font-bold">
                    {checkedStepIds.length} / {selectedStation.checklistSteps.length} pasos
                  </span>
                </div>

                <button
                  onClick={handleFinishSimulation}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition shadow-xs"
                >
                  Completar Estación
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-extrabold text-stone-600">
                  Evaluación finalizada
                </span>
                <button
                  onClick={() => handleStartSimulation(simulationMode)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir estación</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Summary Card if Finished */}
          {isFinished && (
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              isPassed ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPassed ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      {isPassed ? '¡Estación ECOE Superada!' : 'Estación No Superada'}
                    </h3>
                    <span className="text-xs font-bold text-stone-600">
                      Puntuación obtenida: {scorePercent}% (Mínimo requerido: 70%)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-stone-900">{scorePercent}%</span>
                </div>
              </div>

              {hasCriticalFailure && (
                <div className="p-3.5 rounded-2xl bg-rose-100/90 border border-rose-300 text-xs text-rose-950 font-bold flex items-start gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-900">¡Fallo Crítico No Compensable Detectado!</strong>
                    <span>Has omitido pasos de seguridad biológica obligatorios. En el examen ECOE real de la UCLM, omitir un paso crítico invalida la estación aunque sumes más del 70%.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checklist by Phase */}
          {(['Preparación', 'Ejecución', 'Finalización y Comunicación'] as const).map(phase => {
            const phaseSteps = selectedStation.checklistSteps.filter(s => s.phase === phase);
            if (phaseSteps.length === 0) return null;

            return (
              <div key={phase} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>{phase}</span>
                  <span>{phaseSteps.filter(s => checkedStepIds.includes(s.id)).length} / {phaseSteps.length}</span>
                </h3>

                <div className="space-y-2">
                  {phaseSteps.map((step) => {
                    const isChecked = checkedStepIds.includes(step.id);
                    return (
                      <div
                        key={step.id}
                        onClick={() => handleToggleStep(step.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                            : 'bg-stone-50/50 border-stone-200/80 hover:bg-stone-100 text-stone-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                          <p className={isChecked ? 'font-medium' : ''}>{step.instruction}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-stone-400">
                              {step.points} puntos
                            </span>
                            {step.isCriticalError && (
                              <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Paso Crítico
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
