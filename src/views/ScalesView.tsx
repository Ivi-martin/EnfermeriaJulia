import React, { useState } from 'react';
import {
  Activity,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle2,
  Smile,
  ShieldAlert,
  HeartPulse,
  Heart,
  ChevronRight
} from 'lucide-react';

export const ScalesView: React.FC = () => {
  const [activeScaleTab, setActiveScaleTab] = useState<
    'norton' | 'eva' | 'morse' | 'news2' | 'braden' | 'glasgow' | 'barthel'
  >('norton');

  // 1. Norton Scale state (5 subscales, 1-4 each -> 5-20 total)
  const [norton, setNorton] = useState({
    estadoFisico: 3, // 4 bueno, 3 mediano, 2 regular, 1 muy malo
    estadoMental: 3, // 4 alerta, 3 apático, 2 confuso, 1 estuporoso/comatoso
    actividad: 3, // 4 camina, 3 camina con ayuda, 2 sentado, 1 encamado
    movilidad: 3, // 4 total, 3 disminuida, 2 muy limitada, 1 inmóvil
    incontinencia: 3, // 4 ninguna, 3 ocasional, 2 urinaria o fecal, 1 doble incontinencia
  });

  const nortonTotal =
    norton.estadoFisico +
    norton.estadoMental +
    norton.actividad +
    norton.movilidad +
    norton.incontinencia;

  const getNortonRisk = (score: number) => {
    if (score <= 11) return { text: 'Riesgo Muy Alto de UPP (≤ 11)', color: 'text-rose-800 bg-rose-50 border-rose-300' };
    if (score <= 14) return { text: 'Riesgo Alto de UPP (12-14)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (score <= 16) return { text: 'Riesgo Medio de UPP (15-16)', color: 'text-blue-800 bg-blue-50 border-blue-200' };
    return { text: 'Riesgo Mínimo o Sin Riesgo (> 16)', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
  };

  // 2. EVA & Wong-Baker Pain Scale state (0-10)
  const [painEva, setPainEva] = useState<number>(4);

  const getEvaStep = (score: number) => {
    if (score === 0) return { label: 'Sin dolor', step: 'Sin necesidad de analgesia', color: 'text-emerald-700 bg-emerald-50' };
    if (score <= 3) return { label: 'Dolor Leve', step: 'Escalón 1 OMS: Analgésicos no opioides (Paracetamol, Metamizol, AINEs) ± coadyuvantes', color: 'text-blue-800 bg-blue-50' };
    if (score <= 6) return { label: 'Dolor Moderado', step: 'Escalón 2 OMS: Opioides débiles (Tramadol, Codeína) + no opioides ± coadyuvantes', color: 'text-amber-800 bg-amber-50' };
    return { label: 'Dolor Severo', step: 'Escalón 3 OMS: Opioides potentes (Morfina, Fentanilo, Oxicodona, Buprenorfina) ± no opioides', color: 'text-rose-800 bg-rose-50' };
  };

  // 3. Morse Fall Scale state (0 to 125)
  const [morse, setMorse] = useState({
    caidasPrevias: 0, // 0 no, 25 sí
    diagnosticoSecundario: 15, // 0 no, 15 sí
    ayudaDeambulacion: 0, // 0 ninguna/reposo, 15 muletas/bastón/andador, 30 se apoya en muebles
    viaVenosa: 20, // 0 no, 20 sí
    marcha: 10, // 0 normal, 10 débil, 20 alterada
    estadoMental: 0, // 0 consciente de sus capacidades, 15 sobrestima o olvida limitaciones
  });

  const morseTotal =
    morse.caidasPrevias +
    morse.diagnosticoSecundario +
    morse.ayudaDeambulacion +
    morse.viaVenosa +
    morse.marcha +
    morse.estadoMental;

  const getMorseRisk = (score: number) => {
    if (score >= 45) return { text: 'Riesgo Alto de Caídas (≥ 45)', color: 'text-rose-800 bg-rose-50 border-rose-300' };
    if (score >= 25) return { text: 'Riesgo Medio de Caídas (25-44)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    return { text: 'Riesgo Bajo de Caídas (0-24)', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
  };

  // 4. qSOFA & NEWS2 Sepsis Early Warning state
  const [qsofa, setQsofa] = useState({
    rrHigh: false, // FR >= 22 rpm (1 pto)
    alteredMental: false, // Glasgow < 15 (1 pto)
    systolicLow: false, // TAS <= 100 mmHg (1 pto)
  });

  const qsofaScore = (qsofa.rrHigh ? 1 : 0) + (qsofa.alteredMental ? 1 : 0) + (qsofa.systolicLow ? 1 : 0);

  // 5. Braden state
  const [braden, setBraden] = useState({
    sensorial: 3,
    humedad: 3,
    actividad: 3,
    movilidad: 3,
    nutricion: 3,
    friccion: 2,
  });

  const bradenTotal =
    braden.sensorial +
    braden.humedad +
    braden.actividad +
    braden.movilidad +
    braden.nutricion +
    braden.friccion;

  const getBradenRisk = (score: number) => {
    if (score <= 12) return { text: 'Riesgo Alto de UPP (≤ 12)', color: 'text-rose-800 bg-rose-50 border-rose-300' };
    if (score <= 14) return { text: 'Riesgo Moderado de UPP (13-14)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (score <= 18) return { text: 'Riesgo Bajo de UPP (15-18)', color: 'text-blue-800 bg-blue-50 border-blue-200' };
    return { text: 'Sin Riesgo (19-23)', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' };
  };

  // 6. Glasgow state
  const [glasgow, setGlasgow] = useState({
    ocular: 4,
    verbal: 5,
    motora: 6,
  });

  const glasgowTotal = glasgow.ocular + glasgow.verbal + glasgow.motora;

  // 7. Barthel state
  const [barthel, setBarthel] = useState({
    comer: 10,
    lavarse: 5,
    vestirse: 10,
    arreglarse: 5,
    deposicion: 10,
    miccion: 10,
    retrete: 10,
    traslados: 15,
    deambular: 15,
    escaleras: 10,
  });

  const barthelTotal = Object.values(barthel).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1b3829] via-[#2c553d] to-[#122319] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>VALORACIÓN CLÍNICA INTERACTIVA & ESCALAS OFICIALES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Escalas Clínicas de Enfermería
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Calculadoras instantáneas con interpretación de riesgo y recomendaciones de cuidados: Escala de Norton, EVA / Wong-Baker del dolor, Morse de caídas, qSOFA de sepsis, Braden, Glasgow y Barthel.
            </p>
          </div>
        </div>

        {/* Scale Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveScaleTab('norton')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'norton' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Norton (UPP)
          </button>
          <button
            onClick={() => setActiveScaleTab('eva')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'eva' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            EVA & Wong-Baker (Dolor)
          </button>
          <button
            onClick={() => setActiveScaleTab('morse')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'morse' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Morse (Caídas)
          </button>
          <button
            onClick={() => setActiveScaleTab('news2')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'news2' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            qSOFA (Sepsis)
          </button>
          <button
            onClick={() => setActiveScaleTab('braden')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'braden' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Braden
          </button>
          <button
            onClick={() => setActiveScaleTab('glasgow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'glasgow' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Glasgow
          </button>
          <button
            onClick={() => setActiveScaleTab('barthel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeScaleTab === 'barthel' ? 'bg-white text-[#1b3829] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Barthel (ABVD)
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. NORTON SCALE (UPP) */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'norton' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">Escala de Norton (Riesgo de Úlceras por Presión)</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                5 parámetros puntuados de 1 a 4. Puntuación total: 5 a 20 puntos. A menor puntuación, mayor riesgo.
              </p>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${getNortonRisk(nortonTotal).color}`}>
              <span className="text-[10px] uppercase font-bold block">Puntuación Norton</span>
              <strong className="text-2xl font-black">{nortonTotal} / 20</strong>
              <span className="text-xs font-extrabold block mt-0.5">{getNortonRisk(nortonTotal).text}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Estado Físico */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">1. Estado Físico General</strong>
              {[
                { val: 4, label: 'Bueno' },
                { val: 3, label: 'Mediano' },
                { val: 2, label: 'Regular' },
                { val: 1, label: 'Muy Malo' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNorton({ ...norton, estadoFisico: opt.val })}
                  className={`w-full text-left p-2 rounded-xl transition ${
                    norton.estadoFisico === opt.val
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.val} - {opt.label}
                </button>
              ))}
            </div>

            {/* Estado Mental */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">2. Estado Mental</strong>
              {[
                { val: 4, label: 'Alerta' },
                { val: 3, label: 'Apático' },
                { val: 2, label: 'Confuso' },
                { val: 1, label: 'Estuporoso / Comatoso' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNorton({ ...norton, estadoMental: opt.val })}
                  className={`w-full text-left p-2 rounded-xl transition ${
                    norton.estadoMental === opt.val
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.val} - {opt.label}
                </button>
              ))}
            </div>

            {/* Actividad */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">3. Actividad</strong>
              {[
                { val: 4, label: 'Camina' },
                { val: 3, label: 'Camina con ayuda' },
                { val: 2, label: 'Sentado (sillón)' },
                { val: 1, label: 'Encamado' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNorton({ ...norton, actividad: opt.val })}
                  className={`w-full text-left p-2 rounded-xl transition ${
                    norton.actividad === opt.val
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.val} - {opt.label}
                </button>
              ))}
            </div>

            {/* Movilidad */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">4. Movilidad</strong>
              {[
                { val: 4, label: 'Total' },
                { val: 3, label: 'Disminuida' },
                { val: 2, label: 'Muy limitada' },
                { val: 1, label: 'Inmóvil' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNorton({ ...norton, movilidad: opt.val })}
                  className={`w-full text-left p-2 rounded-xl transition ${
                    norton.movilidad === opt.val
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.val} - {opt.label}
                </button>
              ))}
            </div>

            {/* Incontinencia */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">5. Incontinencia</strong>
              {[
                { val: 4, label: 'Ninguna' },
                { val: 3, label: 'Ocasional' },
                { val: 2, label: 'Urinaria o Fecal habitual' },
                { val: 1, label: 'Doble incontinencia' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNorton({ ...norton, incontinencia: opt.val })}
                  className={`w-full text-left p-2 rounded-xl transition ${
                    norton.incontinencia === opt.val
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.val} - {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EVA & WONG-BAKER PAIN SCALE */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'eva' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-black text-stone-900">
              Escala Visual Analógica (EVA) & Wong-Baker de Caras para Dolor
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Valoración universal de la intensidad del dolor y escalón analgésico de la OMS recomendado.
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center py-4 space-y-2">
              <span className="text-6xl select-none">
                {painEva === 0 ? '😄' : painEva <= 2 ? '🙂' : painEva <= 4 ? '😐' : painEva <= 6 ? '🙁' : painEva <= 8 ? '😣' : '😭'}
              </span>
              <div className="text-4xl font-black text-stone-900 font-mono">
                {painEva} <span className="text-base font-sans text-stone-400">/ 10</span>
              </div>
              <strong className="text-base font-extrabold text-stone-800 block">
                {getEvaStep(painEva).label}
              </strong>
            </div>

            <div className="px-4">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={painEva}
                onChange={(e) => setPainEva(Number(e.target.value))}
                className="w-full accent-rose-600 h-3 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-bold text-stone-400 mt-2">
                <span>0 (Sin dolor)</span>
                <span>2</span>
                <span>4 (Moderado)</span>
                <span>6</span>
                <span>8</span>
                <span>10 (Máximo dolor)</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${getEvaStep(painEva).color}`}>
              <strong className="block font-black text-xs uppercase">
                Recomendación Terapéutica (Escala Analgésica OMS):
              </strong>
              <p>{getEvaStep(painEva).step}</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MORSE FALL SCALE */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'morse' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">Escala de Morse (Riesgo de Caídas en Hospital)</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluación rápida al ingreso y en cada cambio clínico. Puntuación total: 0 a 125 puntos.
              </p>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${getMorseRisk(morseTotal).color}`}>
              <span className="text-[10px] uppercase font-bold block">Puntuación Morse</span>
              <strong className="text-2xl font-black">{morseTotal}</strong>
              <span className="text-xs font-extrabold block mt-0.5">{getMorseRisk(morseTotal).text}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">1. Antecedente de caídas en los últimos 3 meses</strong>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMorse({ ...morse, caidasPrevias: 0 })}
                  className={`p-2 rounded-xl border ${morse.caidasPrevias === 0 ? 'bg-emerald-700 text-white font-bold' : 'bg-white'}`}
                >
                  No (0 ptos)
                </button>
                <button
                  onClick={() => setMorse({ ...morse, caidasPrevias: 25 })}
                  className={`p-2 rounded-xl border ${morse.caidasPrevias === 25 ? 'bg-rose-700 text-white font-bold' : 'bg-white'}`}
                >
                  Sí (25 ptos)
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">2. Diagnóstico médico secundario (≥ 2 diagnósticos)</strong>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMorse({ ...morse, diagnosticoSecundario: 0 })}
                  className={`p-2 rounded-xl border ${morse.diagnosticoSecundario === 0 ? 'bg-emerald-700 text-white font-bold' : 'bg-white'}`}
                >
                  No (0 ptos)
                </button>
                <button
                  onClick={() => setMorse({ ...morse, diagnosticoSecundario: 15 })}
                  className={`p-2 rounded-xl border ${morse.diagnosticoSecundario === 15 ? 'bg-amber-700 text-white font-bold' : 'bg-white'}`}
                >
                  Sí (15 ptos)
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">3. Ayuda para la deambulación</strong>
              <div className="space-y-1.5">
                {[
                  { val: 0, label: 'Ninguna / Reposo en cama / Silla de ruedas (0)' },
                  { val: 15, label: 'Muletas / Bastón / Andador (15)' },
                  { val: 30, label: 'Se apoya en muebles / paredes (30)' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setMorse({ ...morse, ayudaDeambulacion: opt.val })}
                    className={`w-full text-left p-2 rounded-xl border ${morse.ayudaDeambulacion === opt.val ? 'bg-emerald-700 text-white font-bold' : 'bg-white'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <strong className="font-bold text-stone-900 block">4. Vía venosa periférica o catéter IV</strong>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMorse({ ...morse, viaVenosa: 0 })}
                  className={`p-2 rounded-xl border ${morse.viaVenosa === 0 ? 'bg-emerald-700 text-white font-bold' : 'bg-white'}`}
                >
                  No (0 ptos)
                </button>
                <button
                  onClick={() => setMorse({ ...morse, viaVenosa: 20 })}
                  className={`p-2 rounded-xl border ${morse.viaVenosa === 20 ? 'bg-amber-700 text-white font-bold' : 'bg-white'}`}
                >
                  Sí (20 ptos)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. qSOFA (SEPSIS) */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'news2' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">qSOFA (Quick Sepsis-related Organ Failure Assessment)</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Criterios de cabecera para sospecha precoz de sepsis en pacientes fuera de UCI. Puntuación: 0 a 3.
              </p>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${qsofaScore >= 2 ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
              <span className="text-[10px] uppercase font-bold block">Puntuación qSOFA</span>
              <strong className="text-2xl font-black">{qsofaScore} / 3</strong>
              <span className="text-xs font-extrabold block mt-0.5">
                {qsofaScore >= 2 ? '⚠️ ALTO RIESGO DE SEPSIS (≥ 2)' : 'Bajo Riesgo (< 2)'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'rrHigh',
                title: 'Frecuencia Respiratoria ≥ 22 respiraciones por minuto (Taquipnea)',
                active: qsofa.rrHigh,
              },
              {
                id: 'alteredMental',
                title: 'Alteración del estado mental (Escala de Glasgow < 15 o confusión aguda)',
                active: qsofa.alteredMental,
              },
              {
                id: 'systolicLow',
                title: 'Presión Arterial Sistólica ≤ 100 mmHg (Hipotensión arterial)',
                active: qsofa.systolicLow,
              },
            ].map((crit) => (
              <div
                key={crit.id}
                onClick={() => setQsofa({ ...qsofa, [crit.id]: !crit.active })}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  crit.active ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-bold' : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={crit.active}
                    onChange={() => {}}
                    className="accent-rose-600 w-5 h-5 rounded"
                  />
                  <span>{crit.title}</span>
                </div>
                <span className="text-xs font-black shrink-0 ml-2">
                  {crit.active ? '+1 Punto' : '0 Puntos'}
                </span>
              </div>
            ))}
          </div>

          {qsofaScore >= 2 && (
            <div className="p-4 rounded-2xl bg-rose-100/70 border border-rose-300 text-rose-950 text-xs space-y-1">
              <strong className="font-extrabold uppercase tracking-wide block">
                🚨 ACTUACIÓN INMEDIATA DE ENFERMERÍA (CÓDIGO SEPSIS):
              </strong>
              <p>
                1. Avisar inmediatamente al médico responsable · 2. Extraer 2 tomas de hemocultivos antes de iniciar antibióticos · 3. Medir lactato en sangre · 4. Iniciar fluidoterapia intravenosa con cristaloides a 30 ml/kg si hipotensión o lactato ≥ 4 mmol/L · 5. Medir diuresis horaria con sonda vesical.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. BRADEN SCALE */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'braden' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-lg font-black text-stone-900">Escala de Braden (Puntuación actual: {bradenTotal})</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBradenRisk(bradenTotal).color}`}>
              {getBradenRisk(bradenTotal).text}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            6 subescalas: Percepción sensorial, Humedad, Actividad, Movilidad, Nutrición y Fricción/Cizallamiento. A menor puntuación, mayor riesgo de úlcera.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. GLASGOW COMA SCALE */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'glasgow' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-lg font-black text-stone-900">Escala de Coma de Glasgow (Total: {glasgowTotal} / 15)</h2>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {glasgowTotal === 15 ? 'Consciencia Normal (15)' : glasgowTotal >= 13 ? 'TCE Leve' : glasgowTotal >= 9 ? 'TCE Moderado' : 'TCE Grave (Intubación)'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Apertura ocular (1-4), Respuesta verbal (1-5), Respuesta motora (1-6).
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. BARTHEL INDEX */}
      {/* ------------------------------------------------------------- */}
      {activeScaleTab === 'barthel' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-lg font-black text-stone-900">Índice de Barthel (Total: {barthelTotal} / 100)</h2>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {barthelTotal === 100 ? 'Totalmente Independiente' : barthelTotal >= 60 ? 'Dependencia Leve' : 'Dependencia Severa'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Valora 10 Actividades Básicas de la Vida Diaria (ABVD): comer, lavarse, vestirse, arreglarse, deposición, micción, uso del retrete, traslados, deambulación y escaleras.
          </p>
        </div>
      )}
    </div>
  );
};
