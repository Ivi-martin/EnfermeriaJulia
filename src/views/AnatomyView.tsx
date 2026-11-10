import React, { useState } from 'react';
import { PULSE_POINTS, AUSCULTATION_POINTS, INJECTION_SITES } from '../data/nursingAnatomy';
import {
  Activity,
  Heart,
  Stethoscope,
  Syringe,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const AnatomyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pulses' | 'auscultation' | 'injections' | 'systems'>('pulses');
  const [selectedPulse, setSelectedPulse] = useState(PULSE_POINTS[0]);
  const [selectedAusc, setSelectedAusc] = useState(AUSCULTATION_POINTS[0]);
  const [selectedInjection, setSelectedInjection] = useState(INJECTION_SITES[0]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1e3c2b] via-[#2c573e] to-[#13271b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>ATLAS DE ANATOMÍA CLÍNICA PARA ENFERMERÍA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anatomía Aplicada & Puntos de Intervención
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Puntos de palpación de pulsos arteriales, focos de auscultación cardiaca, referencias óseas para inyección intramuscular (área ventroglútea de Hochstetter) y cuadrantes anatómicos.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <span className="text-xs text-stone-300">Asignatura clave:</span>
            <strong className="text-sm font-black text-white">Anatomía Humana (1.º Grado)</strong>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('pulses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'pulses' ? 'bg-white text-[#1e3c2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Pulsos Arteriales ({PULSE_POINTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('auscultation')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'auscultation' ? 'bg-white text-[#1e3c2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Focos de Auscultación ({AUSCULTATION_POINTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('injections')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'injections' ? 'bg-white text-[#1e3c2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Syringe className="w-4 h-4" />
            <span>Zonas de Inyección IM ({INJECTION_SITES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('systems')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'systems' ? 'bg-white text-[#1e3c2b] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sistemas & Esquemas</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. PULSES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pulses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 px-1 block">
              Puntos de Palpación Arterial
            </span>
            {PULSE_POINTS.map((pulse) => {
              const isSelected = selectedPulse.id === pulse.id;
              return (
                <div
                  key={pulse.id}
                  onClick={() => setSelectedPulse(pulse)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <strong className="text-sm font-bold text-stone-900 block">
                    {pulse.name}
                  </strong>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {pulse.location}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Punto Anatómico Oficial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {selectedPulse.name}
                </h2>
                <span className="text-xs font-bold text-stone-500 block mt-0.5">
                  Frecuencia de referencia: {selectedPulse.normalFrequency}
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Localización Anatómica Exacta:
                  </strong>
                  <p className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    {selectedPulse.location}
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Técnica de Palpación Enfermera:
                  </strong>
                  <p className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-emerald-950 font-medium">
                    {selectedPulse.technique}
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Relevancia Clínica en la Práctica Hospitalaria:
                  </strong>
                  <p className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    {selectedPulse.clinicalRelevance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. AUSCULTATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'auscultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 px-1 block">
              Focos Cardiacos Principales
            </span>
            {AUSCULTATION_POINTS.map((ausc) => {
              const isSelected = selectedAusc.id === ausc.id;
              return (
                <div
                  key={ausc.id}
                  onClick={() => setSelectedAusc(ausc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <strong className="text-sm font-bold text-stone-900 block">
                    {ausc.name}
                  </strong>
                  <span className="text-xs text-stone-500 block truncate">
                    {ausc.valve} · {ausc.location}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {selectedAusc.valve}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {selectedAusc.name}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5 font-bold">
                  {selectedAusc.location}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Descripción del Ruido Cardiaco (R1 / R2):
                  </strong>
                  <p className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    {selectedAusc.soundDescription}
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Significado Clínico & Alteraciones (Soplos, Galope):
                  </strong>
                  <p className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-emerald-950 font-medium">
                    {selectedAusc.clinicalSignificance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. INJECTIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'injections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 px-1 block">
              Zonas de Punción Intramuscular
            </span>
            {INJECTION_SITES.map((inj) => {
              const isSelected = selectedInjection.id === inj.id;
              return (
                <div
                  key={inj.id}
                  onClick={() => setSelectedInjection(inj)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <strong className="text-sm font-bold text-stone-900 block">
                    {inj.name}
                  </strong>
                  <span className="text-[11px] text-stone-500 block">
                    Volumen máx: {inj.maxVolumeMl} ml
                  </span>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Volumen Máximo Recomendado: {selectedInjection.maxVolumeMl} mL
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {selectedInjection.name}
                </h2>
                <span className="text-xs font-mono font-bold text-stone-500 block mt-0.5">
                  Aguja: {selectedInjection.needleRecommended}
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <strong className="text-stone-900 uppercase text-xs font-extrabold block mb-1">
                    Referencias Anatómicas para la Punción:
                  </strong>
                  <p className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    {selectedInjection.anatomicalLandmarks}
                  </p>
                </div>

                <div>
                  <strong className="text-emerald-900 uppercase text-xs font-extrabold block mb-1">
                    Ventajas Clínicas según la Evidencia:
                  </strong>
                  <p className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-emerald-950 font-medium">
                    {selectedInjection.advantages}
                  </p>
                </div>

                <div>
                  <strong className="text-rose-900 uppercase text-xs font-extrabold block mb-1">
                    Precauciones & Riesgos Anatómicos:
                  </strong>
                  <p className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/70 text-rose-950 font-medium">
                    {selectedInjection.precautions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SYSTEMS OVERVIEW TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'systems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>Sistema Cardiovascular · Circulación Mayor vs Menor</span>
            </h3>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>Circulación Menor o Pulmonar:</strong> Ventrículo Derecho → Válvula Pulmonar → Arteria Pulmonar (sangre carboxigenada) → Alvéolos (hematosis) → 4 Venas Pulmonares (oxigenada) → Aurícula Izquierda.
              </p>
              <p>
                <strong>Circulación Mayor o Sistémica:</strong> Ventrículo Izquierdo → Válvula Aórtica → Arteria Aorta → Red capilar de órganos y tejidos → Venas Cavas Superior e Inferior → Aurícula Derecha.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-700" />
              <span>Cuadrantes Abdominales & Puntos Dolorosos</span>
            </h3>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>Fosa Ilíaca Derecha (FID):</strong> Apéndice cecal y ciego. <em>Punto de McBurney</em> (a 2/3 del ombligo a espina ilíaca anterosuperior). Dolor a la descompresión brusca = <em>Signo de Blumberg</em> (peritonismo).
              </p>
              <p>
                <strong>Hipocondrio Derecho (HD):</strong> Hígado y vesícula biliar. Interrupción dolorosa de la inspiración profunda a la palpación = <em>Signo de Murphy</em> (colecistitis).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
