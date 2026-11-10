import React, { useState } from 'react';
import { SIMULATION_CASES } from '../data/clinicalCases';
import { VirtualPatientCase } from '../types';
import {
  Stethoscope,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  User,
  Send,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ClinicalCasesView: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<VirtualPatientCase>(SIMULATION_CASES[0]);
  const [vitals, setVitals] = useState(SIMULATION_CASES[0].patient.initialVitals);
  const [historyLog, setHistoryLog] = useState<{ role: 'enfermera' | 'paciente' | 'tutor'; text: string; time: string }[]>([
    {
      role: 'paciente',
      text: `${SIMULATION_CASES[0].patient.name}: «${SIMULATION_CASES[0].patient.chiefComplaint}»`,
      time: '00:00',
    },
    {
      role: 'tutor',
      text: 'Docente: Julia, el paciente acaba de avisar al timbre. Revisa las constantes iniciales y decide tu primera intervención de enfermería.',
      time: '00:01',
    },
  ]);
  const [customAction, setCustomAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState(70);
  const [actionsCount, setActionsCount] = useState(0);

  const handleSelectCase = (c: VirtualPatientCase) => {
    setSelectedCase(c);
    setVitals(c.patient.initialVitals);
    setScore(70);
    setActionsCount(0);
    setHistoryLog([
      {
        role: 'paciente',
        text: `${c.patient.name}: «${c.patient.chiefComplaint}»`,
        time: '00:00',
      },
      {
        role: 'tutor',
        text: `Docente: Caso "${c.title}" iniciado. Estás en la habitación con el paciente. ¿Cuál es tu primera decisión clínica?`,
        time: '00:01',
      },
    ]);
  };

  const executeAction = async (actionText: string) => {
    if (!actionText.trim() || isProcessing) return;
    setIsProcessing(true);
    setActionsCount((prev) => prev + 1);

    const timeStamp = `00:${String(actionsCount + 2).padStart(2, '0')}`;

    // Add nurse action to log
    setHistoryLog((prev) => [
      ...prev,
      { role: 'enfermera', text: actionText, time: timeStamp },
    ]);

    try {
      const res = await fetch('/api/ai/clinical-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: selectedCase.title,
          patientData: selectedCase.patient,
          actionTaken: actionText,
          previousHistory: historyLog.map((h) => ({ role: h.role, text: h.text })),
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.patientResponse) {
          setHistoryLog((prev) => [
            ...prev,
            { role: 'paciente', text: `${selectedCase.patient.name}: ${data.patientResponse}`, time: timeStamp },
          ]);
        }
        if (data.feedback) {
          setHistoryLog((prev) => [
            ...prev,
            { role: 'tutor', text: `Docente: ${data.feedback}`, time: timeStamp },
          ]);
        }
        if (data.vitals) {
          setVitals((prev) => ({
            ...prev,
            bp: data.vitals.bp || prev.bp,
            hr: data.vitals.hr || prev.hr,
            rr: data.vitals.rr || prev.rr,
            spo2: data.vitals.spo2 || prev.spo2,
            temp: data.vitals.temp || prev.temp,
            painEva: data.vitals.painEva !== undefined ? data.vitals.painEva : prev.painEva,
          }));
        }
        if (data.scoreDelta) {
          setScore((prev) => Math.min(100, Math.max(0, prev + data.scoreDelta)));
        } else {
          setScore((prev) => Math.min(100, prev + 5));
        }
      }
    } catch {
      // Offline fallback evaluation
      setHistoryLog((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: `Docente: Buena intervención ("${actionText}"). Asegúrate de revaluar las constantes y registrar todo en la hoja de evolución.`,
          time: timeStamp,
        },
      ]);
      setScore((prev) => Math.min(100, prev + 5));
    } finally {
      setIsProcessing(false);
      setCustomAction('');
    }
  };

  const getSpo2Color = (spo2: number) => {
    if (spo2 < 92) return 'text-rose-600 font-black animate-pulse';
    if (spo2 < 95) return 'text-amber-600 font-bold';
    return 'text-emerald-700 font-black';
  };

  const getHrColor = (hr: number) => {
    if (hr > 100 || hr < 55) return 'text-rose-600 font-black';
    return 'text-stone-900 font-black';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1b3627] via-[#2a523c] to-[#12241a] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>SIMULADOR CLÍNICO AVANZADO DE ENFERMERÍA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Casos Clínicos & Paciente Virtual Interactivo
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Enfrenta situaciones reales de urgencias, hospitalización y cirugía. Monitoriza constantes, aplica los 10 correctos, toma decisiones y recibe feedback docente formativo en tiempo real con IA.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Puntuación Clínica</span>
              <strong className="text-2xl font-black text-white">{score} / 100</strong>
              <span className="text-[10px] text-stone-300 block">{actionsCount} decisiones tomadas</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Case Selector Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          {SIMULATION_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedCase.id === c.id
                  ? 'bg-white text-[#1b3627] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span>{c.patient.name}</span>
              <span className="text-[10px] opacity-70">({c.difficulty})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient File & Real-Time Monitor (1 Col) */}
        <div className="space-y-6">
          {/* Patient Profile Card */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900">{selectedCase.patient.name}</h3>
                  <p className="text-[11px] text-stone-500">
                    {selectedCase.patient.age} años · {selectedCase.patient.bed}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                {selectedCase.patient.service}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Motivo de Consulta:</span>
                <p className="font-semibold text-rose-700 bg-rose-50/70 p-2 rounded-xl border border-rose-100 mt-0.5">
                  «{selectedCase.patient.chiefComplaint}»
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Alergias Conocidas:</span>
                <span className="font-bold text-stone-800">
                  {selectedCase.patient.allergies.join(', ')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Antecedentes Médicos:</span>
                <ul className="list-disc pl-4 text-stone-600 space-y-0.5">
                  {selectedCase.patient.history.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Real-time Hospital Vitals Monitor */}
          <div className="bg-stone-900 rounded-3xl p-5 text-white border-2 border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-stone-300 font-mono tracking-wider">
                  MONITOR MULTIPARAMÉTRICO
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* BP */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  Tensión Arterial
                </span>
                <strong className="text-xl font-black text-emerald-400">
                  {vitals.bp} <span className="text-xs font-sans text-stone-400">mmHg</span>
                </strong>
              </div>

              {/* HR */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  Frecuencia Cardiaca
                </span>
                <strong className={`text-xl ${getHrColor(vitals.hr)}`}>
                  {vitals.hr} <span className="text-xs font-sans text-stone-400">lpm</span>
                </strong>
              </div>

              {/* SatO2 */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  SatO2 (Pulsioxímetro)
                </span>
                <strong className={`text-xl ${getSpo2Color(vitals.spo2)}`}>
                  {vitals.spo2}%
                </strong>
              </div>

              {/* RR */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  Frecuencia Resp.
                </span>
                <strong className="text-xl font-black text-cyan-400">
                  {vitals.rr} <span className="text-xs font-sans text-stone-400">rpm</span>
                </strong>
              </div>

              {/* Temp */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  Temperatura Axilar
                </span>
                <strong className="text-xl font-black text-amber-300">
                  {vitals.temp} °C
                </strong>
              </div>

              {/* EVA Dolor */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">
                  Escala Dolor EVA
                </span>
                <strong className="text-xl font-black text-rose-400">
                  {vitals.painEva} / 10
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Consultation & Nurse Action Panel (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Clinical Log (Chat/Event timeline) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-3 min-h-[360px] max-h-[460px] overflow-y-auto">
            <div className="text-[11px] font-bold text-stone-400 text-center pb-2 border-b border-stone-100">
              — REGISTRO DE EVOLUCIÓN ENFERMERA EN TIEMPO REAL —
            </div>

            {historyLog.map((item, idx) => {
              const isNurse = item.role === 'enfermera';
              const isTutor = item.role === 'tutor';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition ${
                    isNurse
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold ml-6'
                      : isTutor
                      ? 'bg-amber-50/80 border border-amber-200 text-amber-950 font-medium'
                      : 'bg-stone-50 border border-stone-200 text-stone-800 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider">
                    <span className={isNurse ? 'text-emerald-800' : isTutor ? 'text-amber-800' : 'text-stone-500'}>
                      {isNurse ? '👩‍⚕️ Julia (Enfermera)' : isTutor ? '🎓 Tutor Docente' : '👤 Paciente'}
                    </span>
                    <span className="text-stone-400 font-mono">{item.time}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Decision Suggestions & Action Bar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 block">
              Acciones Rápidas Recomendadas:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedCase.stages[0]?.recommendedActions.slice(0, 4).map((action, idx) => (
                <button
                  key={idx}
                  disabled={isProcessing}
                  onClick={() => executeAction(action)}
                  className="p-3 text-left rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-stone-800 font-semibold transition flex items-center justify-between gap-2"
                >
                  <span className="truncate">{action}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Free Natural Language Input for Julia's Decision */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
              <input
                type="text"
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeAction(customAction)}
                placeholder="Escribe tu propia decisión clínica (ej. Colocar sonda Foley, administrar 1 mg Adrenalina IM...)"
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                onClick={() => executeAction(customAction)}
                disabled={isProcessing || !customAction.trim()}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs ${
                  isProcessing || !customAction.trim()
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#365e45] text-white hover:bg-[#284935]'
                }`}
              >
                {isProcessing ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Actuar</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
