import React, { useState } from 'react';
import {
  LAB_ANALYTES,
  BLOOD_TUBES,
  GASOMETRY_REFERENCE,
  ECG_SYSTEMATIC_STEPS,
  URINE_TEST_STRIP_ITEMS
} from '../data/laboratory';
import {
  TestTube2,
  Activity,
  Heart,
  Droplets,
  Search,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Layers,
  Sparkles
} from 'lucide-react';

export const LaboratoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytes' | 'gasometry' | 'tubes' | 'urine' | 'ecg'>('analytes');
  
  // Analytes filter
  const [analyteCategory, setAnalyteCategory] = useState<string>('Todos');
  const [analyteSearch, setAnalyteSearch] = useState<string>('');

  // Gasometry Assistant state
  const [gasType, setGasType] = useState<'arterial' | 'venous'>('arterial');
  const [phVal, setPhVal] = useState<string>('7.40');
  const [pco2Val, setPco2Val] = useState<string>('40');
  const [hco3Val, setHco3Val] = useState<string>('24');
  const [pao2Val, setPao2Val] = useState<string>('95');
  const [lactateVal, setLactateVal] = useState<string>('1.1');

  // Interpret Gasometry
  const interpretGasometry = () => {
    const ph = parseFloat(phVal);
    const pco2 = parseFloat(pco2Val);
    const hco3 = parseFloat(hco3Val);
    const pao2 = parseFloat(pao2Val);
    const lac = parseFloat(lactateVal);

    if (isNaN(ph) || isNaN(pco2) || isNaN(hco3)) {
      return {
        status: 'Datos incompletos',
        color: 'text-stone-500',
        bg: 'bg-stone-100',
        explanation: 'Introduce los valores numéricos de pH, PaCO2 y HCO3 para obtener una interpretación didáctica.'
      };
    }

    const isAcidemia = ph < (gasType === 'arterial' ? 7.35 : 7.31);
    const isAlkalemia = ph > (gasType === 'arterial' ? 7.45 : 7.41);
    const normalPco2 = gasType === 'arterial' ? { min: 35, max: 45 } : { min: 40, max: 50 };
    const normalHco3 = { min: 22, max: 26 };

    let primaryDisorder = 'Equilibrio Ácido-Base Normal';
    let compensation = '';
    let details = '';

    if (isAcidemia) {
      if (pco2 > normalPco2.max && hco3 < normalHco3.min) {
        primaryDisorder = 'Acidosis Mixta (Respiratoria y Metabólica Grave)';
        details = 'Compromiso dual ventilatorio y metabólico severo. Causa frecuente en parada cardiorrespiratoria, sepsis descompensada o intoxicaciones graves.';
      } else if (pco2 > normalPco2.max) {
        primaryDisorder = 'Acidosis Respiratoria';
        if (hco3 > normalHco3.max) {
          compensation = 'con Compensación Renal (HCO3 elevado en respuesta a hipercapnia crónica, típico en EPOC retenedor).';
        } else {
          compensation = 'Aguda / No compensada (hipoventilación aguda, depresión por opioides, obstrucción vía aérea).';
        }
        details = 'Retención de dióxido de carbono por hipoventilación alveolar. Vigilar frecuencia y profundidad respiratoria y permeabilidad de la vía aérea.';
      } else if (hco3 < normalHco3.min) {
        primaryDisorder = 'Acidosis Metabólica';
        if (pco2 < normalPco2.min) {
          compensation = 'con Compensación Respiratoria (hiperventilación compensatoria / respiración de Kussmaul para eliminar CO2).';
        } else {
          compensation = 'Aguda / No compensada.';
        }
        details = lac > 2.0
          ? `Lactato elevado (${lac} mmol/L): sugiere hipoperfusión tisular periférica / shock circulatorio / sepsis.`
          : 'Pérdida de bases (diarreas profusas) o aumento de ácidos orgánicos (cetoacidosis diabética, fallo renal).';
      } else {
        primaryDisorder = 'Acidemia leve con parámetros de pCO2 y HCO3 en límites basales.';
      }
    } else if (isAlkalemia) {
      if (pco2 < normalPco2.min && hco3 > normalHco3.max) {
        primaryDisorder = 'Alcalosis Mixta (Respiratoria y Metabólica)';
      } else if (pco2 < normalPco2.min) {
        primaryDisorder = 'Alcalosis Respiratoria';
        if (hco3 < normalHco3.min) {
          compensation = 'con Compensación Metabólica Renal (eliminación de bicarbonato).';
        } else {
          compensation = 'Aguda (hiperventilación por crisis de ansiedad o dolor agudo).';
        }
        details = 'Hiperventilación con lavado excesivo de CO2. Puede producir parestesias peribucales y carpopedales por hipocalcemia iónica transitoria.';
      } else if (hco3 > normalHco3.max) {
        primaryDisorder = 'Alcalosis Metabólica';
        if (pco2 > normalPco2.max) {
          compensation = 'con Compensación Respiratoria (hipoventilación leve de retención).';
        } else {
          compensation = 'No compensada.';
        }
        details = 'Pérdida de ácidos gástricos (vómitos de repetición, aspiración digestiva) o exceso de diuréticos de asa.';
      }
    } else {
      if (pco2 > normalPco2.max && hco3 > normalHco3.max) {
        primaryDisorder = 'Trastorno Compensado (pH normal con pCO2 y HCO3 elevados)';
        details = 'Equilibrio alcanzado habitualmente en pacientes con patología respiratoria crónica compensada.';
      } else if (pco2 < normalPco2.min && hco3 < normalHco3.min) {
        primaryDisorder = 'Trastorno Compensado (pH normal con pCO2 y HCO3 descendidos)';
      }
    }

    let hypoxemia = '';
    if (gasType === 'arterial') {
      if (pao2 < 60) hypoxemia = '¡INSUFICIENCIA RESPIRATORIA AGUDA HIPOXÉMICA! (PaO2 < 60 mmHg). Preparar oxigenoterapia inmediata y avisar al facultativo.';
      else if (pao2 < 80) hypoxemia = 'Hipoxemia arterial leve/moderada (PaO2 entre 60 y 80 mmHg).';
    } else {
      hypoxemia = 'Recuerda: la gasometría VENOSA NO evalúa con fiabilidad la oxigenación arterial (PaO2). No utilizar PvO2 para diagnosticar insuficiencia respiratoria.';
    }

    return {
      status: `${primaryDisorder} ${compensation}`.trim(),
      color: isAcidemia || isAlkalemia ? 'text-amber-900' : 'text-emerald-900',
      bg: isAcidemia || isAlkalemia ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300',
      details,
      hypoxemia
    };
  };

  const gasResult = interpretGasometry();

  // Filtered analytes
  const filteredAnalytes = LAB_ANALYTES.filter(a => {
    const matchesCat = analyteCategory === 'Todos' || a.category === analyteCategory;
    const matchesSearch = a.name.toLowerCase().includes(analyteSearch.toLowerCase()) ||
                          a.highMeaning.toLowerCase().includes(analyteSearch.toLowerCase()) ||
                          a.lowMeaning.toLowerCase().includes(analyteSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1b3d36] via-[#244f46] to-[#122b26] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <TestTube2 className="w-4 h-4 text-emerald-300" />
              <span>LABORATORIO CLÍNICO Y DIAGNÓSTICO ENFERMERO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Laboratorio Clínico · Analíticas & ECG
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Consulta de rangos normales y alteraciones críticas en hemograma, iones y coagulación; asistente didáctico de gasometrías; orden protocolizado de tubos de extracción; análisis de orina y lectura sistemática de electrocardiogramas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Catálogo Analítico
              </span>
              <strong className="text-lg font-black text-white">
                {LAB_ANALYTES.length} Parámetros
              </strong>
              <span className="text-[10px] text-stone-300 block">
                + {BLOOD_TUBES.length} Tubos de extracción
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sub-tabs header */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('analytes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'analytes'
                ? 'bg-white text-[#1b3d36] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <TestTube2 className="w-4 h-4" />
            <span>1. Analíticas & Iones</span>
          </button>
          <button
            onClick={() => setActiveTab('gasometry')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'gasometry'
                ? 'bg-white text-[#1b3d36] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>2. Asistente Gasometría</span>
          </button>
          <button
            onClick={() => setActiveTab('tubes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'tubes'
                ? 'bg-white text-[#1b3d36] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>3. Tubos de Sangre ({BLOOD_TUBES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('urine')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'urine'
                ? 'bg-white text-[#1b3d36] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Tiras de Orina</span>
          </button>
          <button
            onClick={() => setActiveTab('ecg')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'ecg'
                ? 'bg-white text-[#1b3d36] shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>5. ECG Sistemático</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ANALÍTICAS */}
      {activeTab === 'analytes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {['Todos', 'Hemograma', 'Bioquímica', 'Iones', 'Coagulación', 'Marcadores Cardíacos'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setAnalyteCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    analyteCategory === cat
                      ? 'bg-[#1b3d36] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar analito o alteración..."
                value={analyteSearch}
                onChange={(e) => setAnalyteSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
              />
            </div>
          </div>

          {/* Grid of Analytes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnalytes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-extrabold text-stone-900 mt-1">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-400 block uppercase">
                        Rango Normal
                      </span>
                      <strong className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                        {item.normalRange} {item.units}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950">
                      <strong className="font-extrabold block text-rose-900 mb-0.5">
                        ▲ Valores Elevados (Hiper):
                      </strong>
                      <p>{item.highMeaning}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950">
                      <strong className="font-extrabold block text-blue-900 mb-0.5">
                        ▼ Valores Disminuidos (Hipo):
                      </strong>
                      <p>{item.lowMeaning}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block mb-1">
                    Significado Asistencial de Enfermería:
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {item.nursingSignificance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ASISTENTE INTERACTIVO DE GASOMETRÍAS */}
      {activeTab === 'gasometry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Input (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <span>Datos de la Muestra</span>
              </h3>
              <div className="flex items-center bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setGasType('arterial')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    gasType === 'arterial' ? 'bg-[#1b3d36] text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Arterial
                </button>
                <button
                  onClick={() => setGasType('venous')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    gasType === 'venous' ? 'bg-[#1b3d36] text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Venosa
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-extrabold text-stone-800">pH sanguíneo</label>
                  <span className="text-stone-400">Ref: {GASOMETRY_REFERENCE[gasType].pH.label}</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={phVal}
                  onChange={(e) => setPhVal(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-extrabold text-stone-800">
                    {gasType === 'arterial' ? 'PaCO₂ (Presión parcial CO₂)' : 'PvCO₂'}
                  </label>
                  <span className="text-stone-400">Ref: {gasType === 'arterial' ? GASOMETRY_REFERENCE.arterial.PaCO2.label : GASOMETRY_REFERENCE.venous.PvCO2.label}</span>
                </div>
                <input
                  type="number"
                  step="1"
                  value={pco2Val}
                  onChange={(e) => setPco2Val(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-extrabold text-stone-800">HCO₃⁻ (Bicarbonato)</label>
                  <span className="text-stone-400">Ref: {GASOMETRY_REFERENCE.arterial.HCO3.label}</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={hco3Val}
                  onChange={(e) => setHco3Val(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
                />
              </div>

              {gasType === 'arterial' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="font-extrabold text-stone-800">PaO₂ (Presión parcial O₂)</label>
                    <span className="text-stone-400">Ref: {GASOMETRY_REFERENCE.arterial.PaO2.label}</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    value={pao2Val}
                    onChange={(e) => setPao2Val(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-extrabold text-stone-800">Lactato</label>
                  <span className="text-stone-400">Ref: {GASOMETRY_REFERENCE.arterial.Lactato.label}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={lactateVal}
                  onChange={(e) => setLactateVal(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1b3d36]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-2">
                Casos Clínicos Frecuentes para Entrenar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => { setGasType('arterial'); setPhVal('7.28'); setPco2Val('58'); setHco3Val('25'); setPao2Val('55'); setLactateVal('1.2'); }}
                  className="text-[11px] font-bold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                >
                  EPOC Agudizado (Acidosis Resp)
                </button>
                <button
                  onClick={() => { setGasType('arterial'); setPhVal('7.20'); setPco2Val('28'); setHco3Val('12'); setPao2Val('98'); setLactateVal('4.2'); }}
                  className="text-[11px] font-bold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                >
                  Shock Séptico (Acidosis Met + Lactato)
                </button>
                <button
                  onClick={() => { setGasType('arterial'); setPhVal('7.52'); setPco2Val('25'); setHco3Val('23'); setPao2Val('102'); setLactateVal('1.0'); }}
                  className="text-[11px] font-bold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                >
                  Crisis de Ansiedad (Alcalosis Resp)
                </button>
              </div>
            </div>
          </div>

          {/* Interpretation Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`p-6 rounded-3xl border ${gasResult.bg} space-y-4 shadow-sm`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                  Diagnóstico Didáctico Ácido-Base ({gasType.toUpperCase()}):
                </span>
                <h2 className={`text-xl sm:text-2xl font-black mt-1 ${gasResult.color}`}>
                  {gasResult.status}
                </h2>
              </div>

              {gasResult.details && (
                <div className="p-4 rounded-2xl bg-white/80 border border-stone-200/60 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  {gasResult.details}
                </div>
              )}

              {gasResult.hypoxemia && (
                <div className="p-3.5 rounded-2xl bg-rose-100/80 border border-rose-300 text-rose-950 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span>{gasResult.hypoxemia}</span>
                </div>
              )}
            </div>

            {/* Educational breakdown rules card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                Sistemática de Interpretación en 3 Pasos:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <strong className="block text-stone-900 font-bold mb-1">1. Mirar el pH</strong>
                  ¿Es &lt; 7.35 (acidemia) o &gt; 7.45 (alcalemia)? Determina el trastorno primario causante.
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <strong className="block text-stone-900 font-bold mb-1">2. Mirar la PaCO₂</strong>
                  Componente respiratorio. Si se mueve en sentido inverso al pH, el origen es respiratorio.
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <strong className="block text-stone-900 font-bold mb-1">3. Mirar el HCO₃⁻</strong>
                  Componente metabólico renal. Si se mueve en el mismo sentido que el pH, el origen es metabólico.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TUBOS DE EXTRACCIÓN */}
      {activeTab === 'tubes' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <Droplets className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-extrabold text-blue-900 block">
                Orden Oficial de Llenado de Tubos (Recomendación CLSI / SESCAM)
              </strong>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                El orden de extracción evita la contaminación cruzada entre aditivos de los tubos (como el EDTA de potasio en los tubos de suero o coagulación).
                <strong className="block mt-1">Mnemotecnia clínica: "Hemocultivo Primero, Coagulación Azul, Suero Amarillo/Rojo, Heparina Verde, Sangre Lila EDTA, Glucosa Gris".</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOOD_TUBES.map((tube) => (
              <div
                key={tube.orderNumber}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl shadow-xs shrink-0 flex items-center justify-center font-black text-white text-xs"
                        style={{ backgroundColor: tube.hexColor }}
                      >
                        #{tube.orderNumber}
                      </div>
                      <div>
                        <strong className="text-sm font-extrabold text-stone-900 block">
                          {tube.color}
                        </strong>
                        <span className="text-[11px] text-stone-500 block">
                          {tube.sampleType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs text-stone-600">
                    <div>
                      <span className="font-extrabold text-stone-700 block">Aditivo:</span>
                      <p>{tube.additive}</p>
                    </div>

                    <div>
                      <span className="font-extrabold text-stone-700 block">Pruebas Habituales:</span>
                      <p className="text-stone-800 font-medium">{tube.commonTests.join(', ')}</p>
                    </div>

                    <div>
                      <span className="font-extrabold text-stone-700 block">Llenado e Inversiones:</span>
                      <p className="text-stone-700">{tube.fillInstructions}</p>
                      <p className="text-emerald-800 font-bold mt-0.5">↺ {tube.inversions}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block mb-0.5">
                    Consejo Docente:
                  </span>
                  <p className="text-xs text-amber-950 font-medium">
                    {tube.clinicalTips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: TIRAS REACTIVAS DE ORINA */}
      {activeTab === 'urine' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200">
            <h3 className="text-base font-extrabold text-stone-900 mb-2">
              Interpretación Sistemática de la Tira Reactiva de Orina (Combur-Test)
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-3xl">
              Prueba diagnóstica rápida no invasiva de gran utilidad en urgencias y planta de hospitalización. Lectura en 60 segundos tras inmersión breve en orina limpia recién emitida (preferiblemente de mitad de micción).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {URINE_TEST_STRIP_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <strong className="text-sm font-extrabold text-stone-900">
                    {item.parameter}
                  </strong>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Normal: {item.normal}
                  </span>
                </div>
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-800 block mb-0.5">Si resulta positivo:</strong>
                  <p className="leading-relaxed">{item.positiveMeaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: ECG SISTEMÁTICO */}
      {activeTab === 'ecg' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200">
            <h3 className="text-base font-extrabold text-stone-900 mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>Lectura Sistemática del Electrocardiograma en 7 Pasos</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Un abordaje metódico paso a paso previene el error más habitual del estudiante: saltar directamente al ST e ignorar bloqueos de conducción o arritmias de base.
            </p>
          </div>

          <div className="space-y-3">
            {ECG_SYSTEMATIC_STEPS.map((s) => (
              <div key={s.step} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs">
                      #{s.step}
                    </span>
                    <strong className="text-base font-extrabold text-stone-900">
                      {s.title}
                    </strong>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                    Normal: {s.normal}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-extrabold text-stone-500 uppercase tracking-wider text-[10px] block mb-1">
                      Método de Cálculo / Búsqueda:
                    </span>
                    <p className="text-stone-700 leading-relaxed">{s.method}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950">
                    <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[10px] block mb-1">
                      Alteraciones a Identificar:
                    </span>
                    <p className="leading-relaxed">{s.abnormalities}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
