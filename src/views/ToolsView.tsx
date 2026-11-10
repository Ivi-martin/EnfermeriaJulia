import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { CarePlan, SbarReport } from '../types';
import { NANDA_CATALOG } from '../data/nanda';
import {
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  BookOpen,
  Search,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ToolsView: React.FC = () => {
  const { state, updateState } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'constants' | 'pae' | 'hospitalChecklist' | 'sbar'>('constants');

  // NANDA Catalog state
  const [nandaSearch, setNandaSearch] = useState('');
  const [selectedNandaCode, setSelectedNandaCode] = useState<string>('00132');

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

  // Hospital entrance checklist local checked state (stored in localStorage or state)
  const [hospitalChecklist, setHospitalChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nursing_hospital_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleHospitalItem = (id: string) => {
    setHospitalChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('nursing_hospital_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const HOSPITAL_SECTIONS = [
    {
      category: '1. Acreditación y Documentación Oficial',
      items: [
        { id: 'h1', label: 'Tarjeta identificativa de estudiante UCLM con foto visible en la solapa' },
        { id: 'h2', label: 'DNI / NIE en vigor para control en conserjería del hospital' },
        { id: 'h3', label: 'Certificado negativo del Registro Central de Delitos Sexuales entregado/en regla' },
        { id: 'h4', label: 'Convenio de confidencialidad y protección de datos firmado' },
        { id: 'h5', label: 'Cartilla de vacunaciones al día (Hepatitis B comprobada con serología, Triple vírica)' }
      ]
    },
    {
      category: '2. Uniformidad y Presencia Profesional',
      items: [
        { id: 'h6', label: 'Pijama sanitario UCLM limpio y planchado (chaquetilla y pantalón blancos)' },
        { id: 'h7', label: 'Calzado sanitario cerrado, ergonómico y con suela antideslizante blanca/azul' },
        { id: 'h8', label: 'Pelo completamente recogido en coleta, moño o trenza; sin mechones a la cara' },
        { id: 'h9', label: 'Uñas cortas, limpias y rigurosamente sin esmaltes ni postizos' },
        { id: 'h10', label: 'Ausencia total de reloj de muñeca, anillos, pulseras o piercings colgantes (norma de asepsia)' }
      ]
    },
    {
      category: '3. Instrumental y Material de Bolsillo',
      items: [
        { id: 'h11', label: 'Fonendoscopio con membrana limpia y desinfectada con clorhexidina' },
        { id: 'h12', label: 'Reloj de solapa prendido en la bata con segundero funcional' },
        { id: 'h13', label: 'Linterna médica para reflejo fotomotor pupilar (luz cálida)' },
        { id: 'h14', label: 'Tijeras de pico de pato / Mayo para vendajes y apósitos' },
        { id: 'h15', label: 'Pulsioxímetro de dedo con pilas cargadas' },
        { id: 'h16', label: 'Bolígrafos de 4 colores (o azul, rojo y negro) + rotulador fino indeleble' },
        { id: 'h17', label: 'Libreta de bolsillo sin espiral cortante para anotaciones clínicas' }
      ]
    },
    {
      category: '4. Actitud y Protocolo al Llegar a la Unidad',
      items: [
        { id: 'h18', label: 'Llegar 15 minutos antes del relevo para cambio de ropa en vestuarios' },
        { id: 'h19', label: 'Presentarse a la enfermera supervisora de la planta y a la enfermera tutora' },
        { id: 'h20', label: 'Lavado higiénico de manos con agua y jabón antes de entrar en zona asistencial' },
        { id: 'h21', label: 'Recordar máxima: Jamás realizar una técnica invasiva sin supervisión directa' }
      ]
    }
  ];

  // New SBAR form
  const [newSbar, setNewSbar] = useState({
    title: '',
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });

  const selectedNanda = NANDA_CATALOG.find((n) => n.code === selectedNandaCode) || NANDA_CATALOG[0];

  const filteredNanda = NANDA_CATALOG.filter((n) => {
    const q = nandaSearch.toLowerCase();
    return (
      n.label.toLowerCase().includes(q) ||
      n.code.includes(q) ||
      n.domain.toLowerCase().includes(q) ||
      n.definition.toLowerCase().includes(q)
    );
  });

  const handleApplyNandaToForm = (item: typeof selectedNanda) => {
    const firstFactor = item.relatedFactors[0] || '';
    const firstChar = item.definingCharacteristics[0] || '';
    const firstNoc = item.nocSuggestions[0] ? `[${item.nocSuggestions[0].code}] ${item.nocSuggestions[0].label} (${item.nocSuggestions[0].indicators[0]})` : '';
    const firstNic = item.nicSuggestions.map(n => `[${n.code}] ${n.label}: ${n.activities[0] || ''}`).join(' // ');

    setNewPlan({
      caseTitle: `Caso clínico: ${item.label}`,
      assessment: `Valoración inicial: se identifican signos de ${firstChar.toLowerCase() || item.label.toLowerCase()}.`,
      nandaDx: `[${item.code}] ${item.label} r/c ${firstFactor} m/p ${firstChar}`,
      relatedTo: firstFactor,
      nocResults: firstNoc,
      nicInterventions: firstNic,
      evaluation: 'Reevaluación a las 24 horas: comprobación de objetivos terapéuticos.'
    });
    setActiveTab('pae');
  };

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

  const totalHospitalItems = HOSPITAL_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const checkedHospitalItems = Object.values(hospitalChecklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          HERRAMIENTAS ASISTENCIALES Y METODOLOGÍA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          PAE, NANDA-NOC-NIC y Protocolos Clínicos
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Constructor de Planes de Cuidados, catálogo taxonómico oficial, checklist de entrada al hospital y relevo SBAR.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('constants')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
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
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pae'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PAE & NANDA-NOC-NIC</span>
        </button>

        <button
          onClick={() => setActiveTab('hospitalChecklist')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hospitalChecklist'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Entrada al Hospital ({checkedHospitalItems}/{totalHospitalItems})</span>
        </button>

        <button
          onClick={() => setActiveTab('sbar')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
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

      {/* TAB 2: PAE BUILDER & NANDA CATALOG */}
      {activeTab === 'pae' && (
        <div className="space-y-6">
          {/* NANDA Catalog Explorer */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#365e45]" />
                  <h3 className="text-base font-bold text-stone-900">Catálogo Taxonómico NANDA-I con NOC y NIC</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Selecciona un diagnóstico para ver factores relacionados, características definitorias y propuestas NOC/NIC.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={nandaSearch}
                  onChange={(e) => setNandaSearch(e.target.value)}
                  placeholder="Buscar dolor, infección, riesgo..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>
            </div>

            {/* List of NANDA badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredNanda.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setSelectedNandaCode(item.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedNandaCode === item.code
                      ? 'bg-[#365e45] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">[{item.code}]</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Active NANDA Card details */}
            {selectedNanda && (
              <div className="p-4 rounded-2xl bg-[#f8faf8] border border-emerald-200/80 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Dominio {selectedNanda.domainNumber}: {selectedNanda.domain} · Clase: {selectedNanda.class}
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-900 mt-1">
                      [{selectedNanda.code}] {selectedNanda.label}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleApplyNandaToForm(selectedNanda)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#365e45] text-white text-xs font-bold hover:bg-[#284835] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rellenar Formulario PAE con este diagnóstico</span>
                  </button>
                </div>

                <p className="text-stone-700 leading-relaxed italic">
                  «{selectedNanda.definition}»
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Related Factors */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                    <strong className="text-stone-900 font-bold block text-[11px] uppercase tracking-wider text-emerald-900">
                      Factores Relacionados (r/c)
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                      {selectedNanda.relatedFactors.map((rf, idx) => (
                        <li key={idx} className="leading-snug">{rf}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Defining Characteristics */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                    <strong className="text-stone-900 font-bold block text-[11px] uppercase tracking-wider text-emerald-900">
                      Características Definitorias (m/p)
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                      {selectedNanda.definingCharacteristics.map((dc, idx) => (
                        <li key={idx} className="leading-snug">{dc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* NOC and NIC Proposals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 space-y-2">
                    <strong className="block text-[11px] uppercase tracking-wider font-extrabold text-purple-900">
                      🎯 Resultados NOC Sugeridos
                    </strong>
                    {selectedNanda.nocSuggestions.map((noc) => (
                      <div key={noc.code} className="text-[11px]">
                        <strong className="font-semibold text-purple-950">[{noc.code}] {noc.label}</strong>
                        <div className="text-stone-600 pl-2">Indicadores: {noc.indicators.join(', ')}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-950 space-y-2">
                    <strong className="block text-[11px] uppercase tracking-wider font-extrabold text-blue-900">
                      🩺 Intervenciones NIC Sugeridas
                    </strong>
                    {selectedNanda.nicSuggestions.map((nic) => (
                      <div key={nic.code} className="text-[11px]">
                        <strong className="font-semibold text-blue-950">[{nic.code}] {nic.label}</strong>
                        <div className="text-stone-600 pl-2">{nic.activities[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PAE Form & Saved Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-stone-900">Constructor de Plan de Cuidados (PES)</h3>
              <p className="text-xs text-stone-500">
                Formula tu plan según la estructura Problema + Etiología + Signos/Síntomas.
              </p>

              <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Título del Caso Simulado *</label>
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
                  <label className="font-bold text-stone-700 block mb-1">1. Valoración Inicial</label>
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
                  className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition shadow-xs"
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
                    <p className="text-emerald-900 font-semibold bg-emerald-50 p-2.5 rounded-xl">
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
        </div>
      )}

      {/* TAB 3: CHECKLIST DE ENTRADA AL HOSPITAL */}
      {activeTab === 'hospitalChecklist' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#365e45]" />
                <h3 className="text-base font-bold text-stone-900">Checklist de Entrada al Hospital / Rotatorio</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Verifica cada elemento antes de tu primer día de estancia clínica o rotatorio en el HUT o centros de salud.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                {checkedHospitalItems} de {totalHospitalItems} completados
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOSPITAL_SECTIONS.map((sec, secIdx) => (
              <div key={secIdx} className="p-4 rounded-2xl bg-[#fafbfa] border border-stone-200 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                  {sec.category}
                </h4>
                <div className="space-y-2">
                  {sec.items.map((item) => {
                    const isChecked = !!hospitalChecklist[item.id];
                    return (
                      <label
                        key={item.id}
                        onClick={() => toggleHospitalItem(item.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-300 text-stone-900'
                            : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 mt-0.5 accent-[#365e45] rounded"
                        />
                        <span className={`leading-relaxed ${isChecked ? 'line-through text-stone-400 font-normal' : 'font-medium'}`}>
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong>Recordatorio Ético y Deontológico:</strong>
              <p className="leading-relaxed">
                Está terminantemente prohibido tomar fotografías o vídeos dentro del recinto hospitalario ni publicar comentarios en redes sociales sobre pacientes, diagnósticos o situaciones vividas durante las prácticas, según la Ley Orgánica de Protección de Datos y el Código Deontológico de la Enfermería Española.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SBAR REPORT */}
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
                className="w-full py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition shadow-xs"
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
