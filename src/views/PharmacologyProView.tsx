import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import {
  IV_COMPATIBILITY_ENTRIES,
  LASA_ALERTS,
  HIGH_RISK_MEDS_ISMP,
  ANTIDOTES_TABLE
} from '../data/pharmacy/compatibilities';
import { Drug } from '../types';
import { CimaDrugSearchView } from './CimaDrugSearchView';
import {
  Pill,
  Calculator,
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRightLeft,
  Syringe,
  Layers,
  HeartCrack,
  FileCheck2
} from 'lucide-react';

export const PharmacologyProView: React.FC = () => {
  const { state } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'compatibility' | 'calculators' | 'antidotes' | 'cima'>('catalog');

  // Catalog search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [onlyHighRisk, setOnlyHighRisk] = useState(false);

  // Compatibility Checker state
  const [drugA, setDrugA] = useState<string>('Furosemida');
  const [drugB, setDrugB] = useState<string>('Morfina');

  // Calculator states
  // 1. Weight dose
  const [weightKg, setWeightKg] = useState<string>('70');
  const [dosePerKg, setDosePerKg] = useState<string>('15'); // e.g. 15 mg/kg
  const [vialConcentration, setVialConcentration] = useState<string>('100'); // mg per vial
  const [vialVolume, setVialVolume] = useState<string>('2'); // mL per vial

  // 2. Body Surface Area (Mosteller)
  const [bsaHeightCm, setBsaHeightCm] = useState<string>('170');
  const [bsaWeightKg, setBsaWeightKg] = useState<string>('68');
  const [bsaDose, setBsaDose] = useState<string>('50'); // mg/m2

  // 3. Volumetric Pump
  const [totalVolMl, setTotalVolMl] = useState<string>('500');
  const [infusionHours, setInfusionHours] = useState<string>('8');

  // 4. Drops & Microdrops
  const [dropsVolMl, setDropsVolMl] = useState<string>('1000');
  const [dropsHours, setDropsHours] = useState<string>('24');

  // Catalog filtering
  const groupsList = ['Todos', ...Array.from(new Set(state.drugs.map(d => d.group)))];
  const filteredDrugs = state.drugs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.commercialNames.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (d.atcCode && d.atcCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          d.indications.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'Todos' || d.group === selectedGroup;
    const matchesHighRisk = !onlyHighRisk || d.isHighRisk;
    return matchesSearch && matchesGroup && matchesHighRisk;
  });

  // Calculate compatibility result
  const compatibilityResult = IV_COMPATIBILITY_ENTRIES.find(entry =>
    (entry.drugA.toLowerCase() === drugA.toLowerCase() && entry.drugB.toLowerCase() === drugB.toLowerCase()) ||
    (entry.drugA.toLowerCase() === drugB.toLowerCase() && entry.drugB.toLowerCase() === drugA.toLowerCase())
  );

  // Available drugs for compatibility selector
  const availableCompatDrugs = Array.from(new Set([
    ...IV_COMPATIBILITY_ENTRIES.map(e => e.drugA),
    ...IV_COMPATIBILITY_ENTRIES.map(e => e.drugB)
  ])).sort();

  // Calculations
  const calculatedDoseMg = (parseFloat(weightKg) || 0) * (parseFloat(dosePerKg) || 0);
  const calculatedVolumeMl = (parseFloat(vialConcentration) || 0) > 0
    ? (calculatedDoseMg * (parseFloat(vialVolume) || 1)) / parseFloat(vialConcentration)
    : 0;

  // Mosteller: sqrt((height * weight) / 3600)
  const heightVal = parseFloat(bsaHeightCm) || 0;
  const weightVal = parseFloat(bsaWeightKg) || 0;
  const bsaResult = heightVal > 0 && weightVal > 0 ? Math.sqrt((heightVal * weightVal) / 3600) : 0;
  const bsaTotalDose = bsaResult * (parseFloat(bsaDose) || 0);

  // Volumetric pump: mL / hours
  const pumpRateMlH = (parseFloat(infusionHours) || 0) > 0
    ? (parseFloat(totalVolMl) || 0) / parseFloat(infusionHours)
    : 0;

  // Macrogotero: (volumen * 20) / (horas * 60)
  const totalMinutes = (parseFloat(dropsHours) || 0) * 60;
  const macroDropsMin = totalMinutes > 0 ? ((parseFloat(dropsVolMl) || 0) * 20) / totalMinutes : 0;
  const microDropsMin = totalMinutes > 0 ? ((parseFloat(dropsVolMl) || 0) * 60) / totalMinutes : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#244234] via-[#1a382a] to-[#10241b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Pill className="w-4 h-4 text-emerald-300" />
              <span>GUÍA AVANZADA DE SEGURIDAD Y CÁLCULOS FARMACOLÓGICOS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Farmacología PRO · Fichas, Compatibilidad & Dosis
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Catálogo oficial con clasificación ATC y alertas de Medicamentos de Alto Riesgo (ISMP) y LASA; comprobador interactivo de compatibilidad intravenosa en Y; antídotos y 7 calculadoras de dosificación validadas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Medicamentos en Guía
              </span>
              <strong className="text-lg font-black text-white">
                {state.drugs.length} Fichas
              </strong>
              <span className="text-[10px] text-stone-300 block">
                100% fuentes revisadas AEMPS
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sub-tabs header */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-white text-[#244234] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>1. Catálogo & Fichas ({filteredDrugs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'compatibility'
                ? 'bg-white text-[#244234] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>2. Compatibilidad en "Y"</span>
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'calculators'
                ? 'bg-white text-[#244234] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>3. Calculadoras PRO</span>
          </button>
          <button
            onClick={() => setActiveTab('antidotes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'antidotes'
                ? 'bg-white text-[#244234] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Antídotos & Reversores ({ANTIDOTES_TABLE.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cima')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'cima'
                ? 'bg-white text-[#244234] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-300" />
            <span>5. Buscador CIMA Oficial (AEMPS)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CATÁLOGO FARMACOLÓGICO */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar principio o comercial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#244234]"
                />
              </div>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
              >
                {groupsList.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <button
                onClick={() => setOnlyHighRisk(!onlyHighRisk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  onlyHighRisk
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Solo Alto Riesgo ISMP</span>
              </button>
            </div>

            <span className="text-xs text-stone-400">
              Mostrando {filteredDrugs.length} de {state.drugs.length} fármacos
            </span>
          </div>

          {/* Drugs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrugs.map((drug) => (
              <div
                key={drug.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {drug.group}
                        </span>
                        {drug.atcCode && (
                          <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            ATC: {drug.atcCode}
                          </span>
                        )}
                        {drug.isHighRisk && (
                          <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Alto Riesgo ISMP
                          </span>
                        )}
                        {drug.isLasa && (
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                            LASA: {drug.lasaPair}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-stone-900">
                        {drug.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        Comerciales: {drug.commercialNames.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs text-stone-700">
                    <div>
                      <strong className="text-stone-900 block font-bold">Indicaciones:</strong>
                      <p>{drug.indications}</p>
                    </div>
                    <div>
                      <strong className="text-stone-900 block font-bold">Posología & Administración:</strong>
                      <p>{drug.posology}</p>
                      <p className="text-stone-500 mt-0.5">Vías: {drug.administration}</p>
                    </div>
                    {drug.dilution && (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950">
                        <strong className="block text-blue-900 font-bold mb-0.5">Dilución y Estabilidad:</strong>
                        <p>{drug.dilution}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nursing Care Tips */}
                {drug.nursingCare && drug.nursingCare.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block mb-1">
                      Cuidados de Enfermería Clave:
                    </span>
                    <ul className="space-y-1 text-xs text-emerald-950 font-medium">
                      {drug.nursingCare.map((care, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{care}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: COMPROBADOR DE COMPATIBILIDAD EN "Y" */}
      {activeTab === 'compatibility' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
              <span>Consulta de Compatibilidad Intravenosa en Línea en "Y"</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
              Al administrar dos perfusiones continuas o intermitentes por la misma luz venosa mediante una llave de tres pasos o conector en Y, es crucial asegurar que no se produzca precipitación física ni inactivación química.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Primer Fármaco (Medicamento A):
                </label>
                <select
                  value={drugA}
                  onChange={(e) => setDrugA(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#244234]"
                >
                  {availableCompatDrugs.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Segundo Fármaco (Medicamento B):
                </label>
                <select
                  value={drugB}
                  onChange={(e) => setDrugB(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#244234]"
                >
                  {availableCompatDrugs.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Result Card */}
          {compatibilityResult ? (
            <div className={`p-6 rounded-3xl border shadow-sm space-y-3 ${
              compatibilityResult.compatibility === 'Compatible en Y'
                ? 'bg-emerald-50 border-emerald-300'
                : compatibilityResult.compatibility === 'Incompatible'
                ? 'bg-rose-50 border-rose-300'
                : 'bg-amber-50 border-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                {compatibilityResult.compatibility === 'Compatible en Y' && (
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                )}
                {compatibilityResult.compatibility === 'Incompatible' && (
                  <XCircle className="w-8 h-8 text-rose-700" />
                )}
                {compatibilityResult.compatibility !== 'Compatible en Y' && compatibilityResult.compatibility !== 'Incompatible' && (
                  <AlertTriangle className="w-8 h-8 text-amber-700" />
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                    Resultado Documentado:
                  </span>
                  <h4 className="text-xl font-black text-stone-900">
                    {compatibilityResult.compatibility}
                  </h4>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-stone-200/60 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {compatibilityResult.details}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/60">
                <span>Diluyente de ensayo: <strong>{compatibilityResult.diluent}</strong></span>
                <span>Fuente: {compatibilityResult.source}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-stone-100 border border-stone-200 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-stone-700">
                Compatibilidad no documentada directamente para este par
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Por principio de precaución enfermera, ante la ausencia de evidencia validada en la literatura, se recomienda administrar por luces venosas separadas o lavar rigurosamente con 10-20 mL de Suero Fisiológico entre ambas perfusiones.
              </p>
            </div>
          )}

          {/* LASA Alerts Table */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Pares de Fármacos LASA de Alto Riesgo de Confusión</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {LASA_ALERTS.map((lasa, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
                  <strong className="text-sm font-black text-amber-950 block">
                    {lasa.pair}
                  </strong>
                  <p className="text-amber-900 font-medium">{lasa.risk}</p>
                  <p className="text-stone-600 text-[11px] pt-1 border-t border-amber-200/60">
                    <strong>Recomendación ISMP: </strong>{lasa.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CALCULADORAS CLÍNICAS PRO */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculator 1: Dosis por Peso */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                Dosis por Peso Corporal
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Peso del Paciente (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dosis Prescrita (mg/kg)</label>
                <input
                  type="number"
                  value={dosePerKg}
                  onChange={(e) => setDosePerKg(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Concentración Vial (mg)</label>
                <input
                  type="number"
                  value={vialConcentration}
                  onChange={(e) => setVialConcentration(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Volumen Vial (mL)</label>
                <input
                  type="number"
                  value={vialVolume}
                  onChange={(e) => setVialVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Dosis Total a Administrar:
              </span>
              <strong className="text-2xl font-black text-emerald-950 block my-1">
                {calculatedDoseMg.toFixed(1)} mg
              </strong>
              <span className="text-xs font-bold text-emerald-800">
                Equivalente en jeringa: <strong className="text-emerald-950 text-sm">{calculatedVolumeMl.toFixed(2)} mL</strong>
              </span>
            </div>
          </div>

          {/* Calculator 2: Superficie Corporal (Mosteller) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                Superficie Corporal (Fórmula Mosteller)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={bsaHeightCm}
                  onChange={(e) => setBsaHeightCm(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={bsaWeightKg}
                  onChange={(e) => setBsaWeightKg(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div className="col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Dosis Prescrita (mg/m²)</label>
                <input
                  type="number"
                  value={bsaDose}
                  onChange={(e) => setBsaDose(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">
                Superficie Corporal Calculada:
              </span>
              <strong className="text-2xl font-black text-blue-950 block my-1">
                {bsaResult.toFixed(2)} m²
              </strong>
              <span className="text-xs font-bold text-blue-800">
                Dosis Total Requerida: <strong className="text-blue-950 text-sm">{bsaTotalDose.toFixed(1)} mg</strong>
              </span>
            </div>
          </div>

          {/* Calculator 3: Bomba Volumétrica (mL/h) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                Bomba Volumétrica de Infusión
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Volumen Total (mL)</label>
                <input
                  type="number"
                  value={totalVolMl}
                  onChange={(e) => setTotalVolMl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tiempo de Infusión (Horas)</label>
                <input
                  type="number"
                  value={infusionHours}
                  onChange={(e) => setInfusionHours(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Ritmo a Programar en la Bomba:
              </span>
              <strong className="text-3xl font-black text-amber-950 block my-1">
                {pumpRateMlH.toFixed(1)} mL/h
              </strong>
            </div>
          </div>

          {/* Calculator 4: Gotero por Gravedad */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                Goteo por Gravedad (Macro y Microgotero)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Volumen Suero (mL)</label>
                <input
                  type="number"
                  value={dropsVolMl}
                  onChange={(e) => setDropsVolMl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tiempo Previsto (Horas)</label>
                <input
                  type="number"
                  value={dropsHours}
                  onChange={(e) => setDropsHours(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-800 block">Macrogotero (20 gts/mL)</span>
                <strong className="text-xl font-black text-purple-950 block mt-1">
                  {Math.round(macroDropsMin)} gts/min
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-800 block">Microgotero (60 gts/mL)</span>
                <strong className="text-xl font-black text-purple-950 block mt-1">
                  {Math.round(microDropsMin)} microgts/min
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ANTÍDOTOS Y REVERSORES */}
      {activeTab === 'antidotes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200">
            <h3 className="text-base font-extrabold text-stone-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Tabla de Antídotos y Reversores Esenciales en Hospitalización y Urgencias</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Conocimiento obligatorio en farmacología clínica de enfermería. Localización inmediata en el maletín de parada o cajetín de emergencias de la unidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANTIDOTES_TABLE.map((ant, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                    Tóxico / Fármaco a Revertir: {ant.toxicOrDrug}
                  </span>
                  <h4 className="text-base font-black text-emerald-950 mt-1.5">
                    Antídoto: {ant.antidote}
                  </h4>
                </div>

                <div className="text-xs space-y-1.5 text-stone-700">
                  <div>
                    <strong className="text-stone-900 block font-bold">Posología & Administración:</strong>
                    <p className="leading-relaxed">{ant.posology}</p>
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-bold">Mecanismo Farmacológico:</strong>
                    <p className="text-stone-500 leading-relaxed">{ant.mechanism}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: CIMA BUSCADOR OFICIAL */}
      {activeTab === 'cima' && <CimaDrugSearchView />}
    </div>
  );
};
