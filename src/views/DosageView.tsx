import React, { useState } from 'react';
import { STANDARD_PERFUSIONS, DOSAGE_FORMULAS } from '../data/dosage';
import {
  Calculator,
  Droplets,
  Activity,
  Weight,
  Layers,
  ArrowRightLeft,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const DosageView: React.FC = () => {
  // Calculator 1: Dose to Volume
  const [dosePrescribed, setDosePrescribed] = useState<number>(500);
  const [vialTotalMg, setVialTotalMg] = useState<number>(1000);
  const [vialVolumeMl, setVialVolumeMl] = useState<number>(10);

  // Calculator 2: Perfusion flow & drops
  const [infusionVolume, setInfusionVolume] = useState<number>(500);
  const [infusionHours, setInfusionHours] = useState<number>(8);
  const [dropFactor, setDropFactor] = useState<number>(20); // 20 macro, 60 micro

  // Calculator 3: Dose by Weight
  const [patientWeight, setPatientWeight] = useState<number>(70);
  const [dosePerKg, setDosePerKg] = useState<number>(1);
  const [frequencyHours, setFrequencyHours] = useState<number>(12);

  // Calculator 4: Unit Converter
  const [convertVal, setConvertVal] = useState<number>(1);
  const [convertFrom, setConvertFrom] = useState<'g' | 'mg' | 'mcg'>('mg');

  // Math results
  // 1) Dose to Volume:
  // Concentration = vialTotalMg / vialVolumeMl (mg/ml)
  // Volume to administer = dosePrescribed / concentration
  const concentrationMgMl = vialTotalMg > 0 && vialVolumeMl > 0 ? vialTotalMg / vialVolumeMl : 0;
  const volumeResultMl = concentrationMgMl > 0 ? dosePrescribed / concentrationMgMl : 0;

  // 2) Perfusion:
  // ml/h = volume / hours
  // drops/min = (volume * dropFactor) / (hours * 60)
  const flowMlPerHour = infusionHours > 0 ? infusionVolume / infusionHours : 0;
  const dropsPerMin = infusionHours > 0 ? (infusionVolume * dropFactor) / (infusionHours * 60) : 0;

  // 3) Dose by Weight:
  const singleDoseMg = patientWeight * dosePerKg;
  const dosesPerDay = frequencyHours > 0 ? 24 / frequencyHours : 1;
  const totalDailyDoseMg = singleDoseMg * dosesPerDay;

  // 4) Unit conversions based on convertVal and convertFrom
  const inMg =
    convertFrom === 'g'
      ? convertVal * 1000
      : convertFrom === 'mcg'
      ? convertVal / 1000
      : convertVal;
  const inG = inMg / 1000;
  const inMcg = inMg * 1000;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2c5364]">
          CÁLCULOS CLÍNICOS & DOSIFICACIÓN
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Tablas y Calculadora de Dosificación
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Fórmulas exactas para preparar medicación parenteral, ritmo de goteo en macrogotero y bombas volumétricas.
        </p>
      </div>

      {/* Main 2-Column Calculators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Dosis a Volumen */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Dosis a Volumen (Regla de Tres)</h3>
              <p className="text-xs text-stone-500">¿Cuántos ml extraer de la ampolla o vial?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Dosis Prescrita (mg)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={dosePrescribed}
                onChange={(e) => setDosePrescribed(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Vial contiene (mg)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={vialTotalMg}
                onChange={(e) => setVialTotalMg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">En volumen de (ml)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={vialVolumeMl}
                onChange={(e) => setVialVolumeMl(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Result Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                Volumen exacto a administrar
              </span>
              <div className="text-2xl font-extrabold mt-0.5">
                {volumeResultMl > 0 ? (Math.round(volumeResultMl * 100) / 100).toLocaleString('es-ES') : 0} ml
              </div>
              <span className="text-xs text-blue-700">
                Concentración del vial: {concentrationMgMl.toFixed(1)} mg/ml
              </span>
            </div>
            <div className="text-right text-[11px] text-blue-700 font-mono bg-white/70 px-2.5 py-1.5 rounded-xl border border-blue-100">
              V = (Dosis × ml) ÷ mg
            </div>
          </div>
        </div>

        {/* Card 2: Perfusion Flow & Drops Calculator */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Perfusión: Gotas/min y ml/h</h3>
              <p className="text-xs text-stone-500">Para goteros por gravedad o bombas volumétricas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Volumen Total (ml)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={infusionVolume}
                onChange={(e) => setInfusionVolume(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Tiempo de infusión (h)</label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={infusionHours}
                onChange={(e) => setInfusionHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Tipo de Gotero</label>
              <select
                value={dropFactor}
                onChange={(e) => setDropFactor(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value={20}>Macrogotero (20 gtt/ml)</option>
                <option value={60}>Microgotero (60 gtt/ml)</option>
              </select>
            </div>
          </div>

          {/* Result Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                En Bomba Volumétrica
              </span>
              <div className="text-2xl font-extrabold mt-0.5">
                {flowMlPerHour > 0 ? (Math.round(flowMlPerHour * 10) / 10).toLocaleString('es-ES') : 0} ml/h
              </div>
            </div>
            <div className="border-l border-emerald-200 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                En Gotero por Gravedad
              </span>
              <div className="text-2xl font-extrabold mt-0.5">
                {dropsPerMin > 0 ? Math.round(dropsPerMin) : 0} gotas/min
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Dose by Weight */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Weight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Dosificación Ponderal por Peso</h3>
              <p className="text-xs text-stone-500">Cálculo de dosis por kg (ej. Enoxaparina 1 mg/kg)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Peso del paciente (kg)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={patientWeight}
                onChange={(e) => setPatientWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Dosis por kg (mg/kg)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={dosePerKg}
                onChange={(e) => setDosePerKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Frecuencia de pauta</label>
              <select
                value={frequencyHours}
                onChange={(e) => setFrequencyHours(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-600 focus:outline-none bg-white"
              >
                <option value={24}>Cada 24 horas (1 vez/día)</option>
                <option value={12}>Cada 12 horas (2 veces/día)</option>
                <option value={8}>Cada 8 horas (3 veces/día)</option>
                <option value={6}>Cada 6 horas (4 veces/día)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Dosis por toma
              </span>
              <div className="text-2xl font-extrabold mt-0.5">
                {singleDoseMg.toLocaleString('es-ES')} mg
              </div>
            </div>
            <div className="border-l border-amber-200 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Dosis total diaria
              </span>
              <div className="text-2xl font-extrabold mt-0.5">
                {totalDailyDoseMg.toLocaleString('es-ES')} mg/día
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Unit Converter */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Conversor Rápido de Unidades</h3>
              <p className="text-xs text-stone-500">Equivalencias directas entre Gramos, mg y microgramos (mcg)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Cantidad a convertir</label>
              <input
                type="number"
                min="0"
                step="any"
                value={convertVal}
                onChange={(e) => setConvertVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Unidad de origen</label>
              <select
                value={convertFrom}
                onChange={(e) => setConvertFrom(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
              >
                <option value="g">Gramos (g)</option>
                <option value="mg">Miligramos (mg)</option>
                <option value="mcg">Microgramos (mcg / µg)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Gramos</span>
              <strong className="text-sm text-stone-800">{inG.toLocaleString('es-ES', { maximumFractionDigits: 5 })} g</strong>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Miligramos</span>
              <strong className="text-sm text-purple-950 font-extrabold">{inMg.toLocaleString('es-ES', { maximumFractionDigits: 3 })} mg</strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Microgramos</span>
              <strong className="text-sm text-stone-800">{inMcg.toLocaleString('es-ES')} mcg</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Perfusion Quick Reference Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#e8f0e8] text-[#365e45] rounded-xl font-bold">📋</span>
            <div>
              <h3 className="text-base font-bold text-stone-900">Tabla Rápida de Sueroterapia Estándar</h3>
              <p className="text-xs text-stone-500">
                Pautas habituales de planta hospitalaria (macrogotero factor 20 gtt/ml)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-stone-400 hidden sm:inline-block">
            Factor macrogotero = 20 gotas/ml
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Volumen</th>
                <th className="py-2.5 px-3">Tiempo</th>
                <th className="py-2.5 px-3">Bomba (ml/h)</th>
                <th className="py-2.5 px-3">Macrogotero (gotas/min)</th>
                <th className="py-2.5 px-3">Microgotero (µgtt/min)</th>
                <th className="py-2.5 px-3">Indicación habitual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {STANDARD_PERFUSIONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-3 font-bold">{row.volumeMl} ml</td>
                  <td className="py-3 px-3">{row.timeHours} h</td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-800">{row.flowMlPerHour} ml/h</td>
                  <td className="py-3 px-3 font-mono font-extrabold text-blue-900 bg-blue-50/40 rounded">
                    {row.dropsPerMinMacro} gtt/min
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600">{row.microDropsPerMin} µgtt/min</td>
                  <td className="py-3 px-3 text-stone-500">{row.useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulas & Theoretical Reference */}
      <div className="p-6 rounded-3xl bg-[#f8faf7] border border-stone-200/80 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#365e45]" />
          <span>Fórmulas de Examen y Nemotécnias de Bolsillo</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {DOSAGE_FORMULAS.map((f, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
              <strong className="text-stone-900 block">{f.title}</strong>
              <code className="text-[11px] font-mono text-[#284835] bg-[#eef4ef] px-2 py-1 rounded block">
                {f.formula}
              </code>
              <p className="text-[11px] text-stone-500 italic pt-1">{f.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
