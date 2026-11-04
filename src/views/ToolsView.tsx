import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { CarePlan, SbarReport } from '../types';
import {
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  HeartPulse
} from 'lucide-react';

export const ToolsView: React.FC = () => {
  const { state, updateState } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'pae' | 'sbar' | 'constants'>('constants');

  // New PAE plan form
  const [newPlan, setNewPlan] = useState({
    caseTitle: '',
    assessment: '',
    nandaDx: '',
    relatedTo: '',
    nocResults: '',
    nicInterventions: '',
    evaluation: ''
  });

  // New SBAR form
  const [newSbar, setNewSbar] = useState({
    title: '',
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.caseTitle.trim()) return;
    const plan: CarePlan = {
      id: Date.now(),
      ...newPlan
    };
    updateState((prev) => ({
      ...prev,
      carePlans: [plan, ...prev.carePlans]
    }));
    setNewPlan({
      caseTitle: '',
      assessment: '',
      nandaDx: '',
      relatedTo: '',
      nocResults: '',
      nicInterventions: '',
      evaluation: ''
    });
  };

  const handleSaveSbar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSbar.title.trim()) return;
    const sbar: SbarReport = {
      id: Date.now(),
      ...newSbar
    };
    updateState((prev) => ({
      ...prev,
      sbarReports: [sbar, ...prev.sbarReports]
    }));
    setNewSbar({
      title: '',
      situation: '',
      background: '',
      assessment: '',
      recommendation: ''
    });
  };

  const VITAL_SIGNS_REFERENCE = [
    { name: 'Tensión Arterial (TA)', normal: '100-120 / 60-80 mmHg', alter: 'HTA ≥ 140/90 · Hipotensión < 90/60 mmHg' },
    { name: 'Frecuencia Cardiaca (FC)', normal: '60 - 100 lpm', alter: 'Taquicardia > 100 lpm · Bradicardia < 60 lpm' },
    { name: 'Frecuencia Respiratoria (FR)', normal: '12 - 20 rpm', alter: 'Taquipnea > 20 rpm · Bradipnea < 12 rpm' },
    { name: 'Temperatura Timpánica / Axilar', normal: '36.0 - 37.2 °C', alter: 'Febrícula 37.3-37.9 °C · Fiebre ≥ 38.0 °C · Hipotermia < 35.0 °C' },
    { name: 'Saturación de Oxígeno (SatO2)', normal: '≥ 95% (aire ambiente)', alter: 'Hipoxemia leve 91-94% · Moderada 86-90% · Severa < 85%' },
    { name: 'Glucemia Capilar en Ayunas', normal: '70 - 100 mg/dL', alter: 'Hipoglucemia < 70 mg/dL · Hiperglucemia > 126 mg/dL' },
    { name: 'Diuresis Fisiológica en Adulto', normal: '0.5 - 1 ml/kg/hora (~1.200 - 1.800 ml/24h)', alter: 'Oliguria < 400 ml/24h · Anuria < 100 ml/24h · Poliuria > 3.000 ml/24h' },
    { name: 'Escala del Dolor (EVA)', normal: '0 / 10 (sin dolor)', alter: 'Leve 1-3 · Moderado 4-6 · Severo / Inaguantable 7-10' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          HERRAMIENTAS ASISTENCIALES Y METODOLOGÍA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          PAE, SBAR y Constantes Vitales
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Guías para el Proceso de Atención de Enfermería (NANDA/NOC/NIC), informes de relevo SBAR y valores de referencia.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('constants')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'constants'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Valores de Referencia</span>
        </button>

        <button
          onClick={() => setActiveTab('pae')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pae'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Planes de Cuidados (PAE)</span>
        </button>

        <button
          onClick={() => setActiveTab('sbar')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'sbar'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Entrega de Turno (SBAR)</span>
        </button>
      </div>

      {/* TAB 1: VITAL SIGNS */}
      {activeTab === 'constants' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Constantes Vitales en Adulto Sano</h3>
            <span className="text-xs text-stone-400 font-semibold">Parámetros estándar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Parámetro Vital</th>
                  <th className="py-2.5 px-3">Rango de Normalidad</th>
                  <th className="py-2.5 px-3">Signos de Alerta / Alteraciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {VITAL_SIGNS_REFERENCE.map((v, i) => (
                  <tr key={i} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-3 font-bold text-stone-900">{v.name}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-800 bg-emerald-50/40 rounded">
                      {v.normal}
                    </td>
                    <td className="py-3 px-3 text-stone-600">{v.alter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAE BUILDER */}
      {activeTab === 'pae' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">Formular Plan de Cuidados (Caso Simulado)</h3>
            <p className="text-xs text-stone-500">
              Practica la taxonomía NANDA-NOC-NIC con casos de clase. No escribas datos reales identificativos de pacientes.
            </p>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título del Caso Ficticio *</label>
                <input
                  type="text"
                  required
                  value={newPlan.caseTitle}
                  onChange={(e) => setNewPlan({ ...newPlan, caseTitle: e.target.value })}
                  placeholder="Ej. Paciente con dolor agudo postquirúrgico y riesgo de UPP"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">1. Valoración (Datos Objetivos y Subjetivos)</label>
                <textarea
                  rows={2}
                  value={newPlan.assessment}
                  onChange={(e) => setNewPlan({ ...newPlan, assessment: e.target.value })}
                  placeholder="Constantes, dolor EVA 7/10, apósito limpio, diuresis 40 ml/h..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">2. Diagnóstico NANDA (Formato PES)</label>
                <input
                  type="text"
                  value={newPlan.nandaDx}
                  onChange={(e) => setNewPlan({ ...newPlan, nandaDx: e.target.value })}
                  placeholder="[00132] Dolor agudo r/c agentes lesivos físicos m/p EVA 7/10 y quejidos"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">3. Resultados Esperados (NOC)</label>
                <input
                  type="text"
                  value={newPlan.nocResults}
                  onChange={(e) => setNewPlan({ ...newPlan, nocResults: e.target.value })}
                  placeholder="[1605] Control del dolor: alcanzar EVA ≤ 3 en los primeros 30 minutos"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">4. Intervenciones de Enfermería (NIC)</label>
                <textarea
                  rows={2}
                  value={newPlan.nicInterventions}
                  onChange={(e) => setNewPlan({ ...newPlan, nicInterventions: e.target.value })}
                  placeholder="[2210] Administración de analgésicos según pauta. [1400] Manejo del dolor y postura cómoda."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
              >
                Guardar Plan de Cuidados
              </button>
            </form>
          </div>

          {/* Saved Plans List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Mis Planes Guardados</h3>
            {state.carePlans.length > 0 ? (
              state.carePlans.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 text-xs">
                  <strong className="text-sm font-bold text-stone-900 block">{p.caseTitle}</strong>
                  <p className="text-emerald-900 font-semibold bg-emerald-50 p-2 rounded-xl">
                    <strong>NANDA:</strong> {p.nandaDx}
                  </p>
                  <p className="text-stone-600"><strong>NOC:</strong> {p.nocResults}</p>
                  <p className="text-stone-600"><strong>NIC:</strong> {p.nicInterventions}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-500 rounded-2xl border border-dashed border-stone-200 bg-white">
                Aún no has guardado ningún plan de cuidados.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SBAR REPORT */}
      {activeTab === 'sbar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">Entrega de Turno SBAR (Caso Simulado)</h3>
            <p className="text-xs text-stone-500">
              Estructura estándar de comunicación eficaz: Situation, Background, Assessment, Recommendation.
            </p>

            <form onSubmit={handleSaveSbar} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título del Pase de Relevo *</label>
                <input
                  type="text"
                  required
                  value={newSbar.title}
                  onChange={(e) => setNewSbar({ ...newSbar, title: e.target.value })}
                  placeholder="Ej. Habitación 412 · Paciente con disnea nocturna"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">S (Situación actual del paciente)</label>
                <textarea
                  rows={2}
                  value={newSbar.situation}
                  onChange={(e) => setNewSbar({ ...newSbar, situation: e.target.value })}
                  placeholder="Paciente de 68 años ingresado por insuficiencia cardiaca que ha iniciado disnea brusca."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">B (Antecedentes / Background)</label>
                <textarea
                  rows={2}
                  value={newSbar.background}
                  onChange={(e) => setNewSbar({ ...newSbar, background: e.target.value })}
                  placeholder="Cardiopatía isquémica previa, HTA. En tratamiento con diuréticos orales."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">A (Valoración actual / Assessment)</label>
                <textarea
                  rows={2}
                  value={newSbar.assessment}
                  onChange={(e) => setNewSbar({ ...newSbar, assessment: e.target.value })}
                  placeholder="SatO2 88% con aire ambiente, TA 160/95 mmHg, crepitantes bibasales."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">R (Recomendación / Solicitud)</label>
                <textarea
                  rows={2}
                  value={newSbar.recommendation}
                  onChange={(e) => setNewSbar({ ...newSbar, recommendation: e.target.value })}
                  placeholder="Colocar gafas nasales a 3 L/min, elevar cabecero a Fowler y valorar Furosemida 20 mg IV."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
              >
                Guardar Informe SBAR
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Mis Informes SBAR Guardados</h3>
            {state.sbarReports.length > 0 ? (
              state.sbarReports.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 text-xs">
                  <strong className="text-sm font-bold text-stone-900 block">{s.title}</strong>
                  <div className="space-y-1 text-stone-700">
                    <p><strong>S:</strong> {s.situation}</p>
                    <p><strong>B:</strong> {s.background}</p>
                    <p><strong>A:</strong> {s.assessment}</p>
                    <p className="text-emerald-900 font-semibold"><strong>R:</strong> {s.recommendation}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-500 rounded-2xl border border-dashed border-stone-200 bg-white">
                Aún no has redactado ningún informe SBAR.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
