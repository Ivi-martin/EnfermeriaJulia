import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { Drug } from '../types';
import { TEN_RIGHTS_OF_MEDICATION } from '../data/pharmacology';
import {
  Pill,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Syringe,
  Bookmark,
  Trash2,
  X,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const PharmacologyView: React.FC = () => {
  const { state, addDrug, removeDrug } = useCampusStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('paracetamol');
  const [showTenRights, setShowTenRights] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New drug form state
  const [newDrug, setNewDrug] = useState({
    name: '',
    commercialNames: '',
    group: 'Analgésicos y antipiréticos',
    indications: '',
    posology: '',
    administration: '',
    dilution: '',
    adverseEffects: '',
    nursingCare: '',
    contraindications: '',
    warning: ''
  });

  const groups = [
    { id: 'all', label: 'Todos los fármacos' },
    { id: 'analgesia', label: 'Analgésicos & AINEs' },
    { id: 'antibioticos', label: 'Antibióticos' },
    { id: 'cardio', label: 'Cardiovascular' },
    { id: 'respi', label: 'Respiratorio' },
    { id: 'digest', label: 'Digestivo' },
    { id: 'endocrino', label: 'Endocrino & Insulinas' },
    { id: 'antidotos', label: 'Antídotos de urgencia' }
  ];

  const matchesGroup = (drug: Drug, group: string) => {
    if (group === 'all') return true;
    const g = drug.group.toLowerCase();
    const n = drug.name.toLowerCase();
    if (group === 'analgesia') return g.includes('analgés') || g.includes('aine') || g.includes('opiáceo') || g.includes('piraz');
    if (group === 'antibioticos') return g.includes('antibió') || g.includes('antiinfecc');
    if (group === 'cardio') return g.includes('cardio') || g.includes('diurét') || g.includes('antitromb') || g.includes('heparin');
    if (group === 'respi') return g.includes('bronco') || g.includes('respirat');
    if (group === 'digest') return g.includes('protón') || g.includes('gástric') || g.includes('digest');
    if (group === 'endocrino') return g.includes('pancreát') || g.includes('insulina') || g.includes('antidiab');
    if (group === 'antidotos') return g.includes('antídoto') || g.includes('antagonista');
    return true;
  };

  const filteredDrugs = state.drugs.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(term) ||
      d.commercialNames.some((c) => c.toLowerCase().includes(term)) ||
      d.group.toLowerCase().includes(term) ||
      d.indications.toLowerCase().includes(term);
    return matchesSearch && matchesGroup(d, selectedGroup);
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.name.trim()) return;

    addDrug({
      name: newDrug.name,
      commercialNames: newDrug.commercialNames.split(',').map((s) => s.trim()).filter(Boolean),
      group: newDrug.group,
      indications: newDrug.indications,
      posology: newDrug.posology,
      administration: newDrug.administration,
      dilution: newDrug.dilution,
      adverseEffects: newDrug.adverseEffects,
      nursingCare: newDrug.nursingCare.split('\n').map((s) => s.trim()).filter(Boolean),
      contraindications: newDrug.contraindications || undefined,
      warning: newDrug.warning || undefined
    });

    setNewDrug({
      name: '',
      commercialNames: '',
      group: 'Analgésicos y antipiréticos',
      indications: '',
      posology: '',
      administration: '',
      dilution: '',
      adverseEffects: '',
      nursingCare: '',
      contraindications: '',
      warning: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
            FARMACOLOGÍA CLÍNICA · 1.º Y 2.º CURSO
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Guía de Fármacos y Administración
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Fichas esenciales con ritmo de infusión, diluciones y cuidados de enfermería prioritarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTenRights(!showTenRights)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>10 Correctos</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#365e45] hover:bg-[#284835] text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Ficha</span>
          </button>
        </div>
      </div>

      {/* Ten Rights Collapsible / Alert Drawer */}
      {showTenRights && (
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-stone-800 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-200 text-amber-900 rounded-xl font-bold">🛡️</span>
              <div>
                <h3 className="text-base font-bold text-amber-950">Los 10 Correctos de la Medicación (Regla de Seguridad)</h3>
                <p className="text-xs text-amber-800">
                  Protocolo institucional que todo estudiante de enfermería debe aplicar antes de administrar cualquier fármaco.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTenRights(false)}
              className="p-1 text-amber-700 hover:text-amber-950 rounded-lg hover:bg-amber-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {TEN_RIGHTS_OF_MEDICATION.map((item) => (
              <div key={item.id} className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">
                    {item.id}
                  </span>
                  <span>{item.name}</span>
                </div>
                <p className="text-stone-600 pl-7 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por principio activo (ej. Nolotil, Paracetamol, Enoxaparina, Salbutamol) o indicación..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#365e45] shadow-xs"
          />
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedGroup === g.id
                  ? 'bg-[#365e45] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drugs List / Accordion Cards */}
      <div className="space-y-4">
        {filteredDrugs.length > 0 ? (
          filteredDrugs.map((drug) => {
            const isExpanded = expandedId === drug.id;
            return (
              <div
                key={drug.id}
                className="rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-emerald-300 transition overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : drug.id)}
                  className="p-5 cursor-pointer flex items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#e8f0e8] text-[#2d523e] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
                      <Pill className="w-5 h-5 text-[#365e45]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-base font-bold text-stone-900">{drug.name}</strong>
                        {drug.isCustom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Ficha creada por ti
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-500">
                        <span>
                          <strong>Nombres comerciales:</strong> {drug.commercialNames.join(', ') || 'Genérico'}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-emerald-800 font-semibold">{drug.group}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {drug.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar la ficha de ${drug.name}?`)) {
                            removeDrug(drug.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                        title="Eliminar ficha personalizada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-stone-400 hover:text-stone-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Clinical Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-stone-100 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Block: Indications & Posology */}
                      <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] block">
                            Indicaciones clínicas
                          </span>
                          <p className="text-stone-800 mt-0.5 leading-relaxed">{drug.indications}</p>
                        </div>
                        <div className="pt-2 border-t border-stone-200/60">
                          <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] block">
                            Posología y Vías
                          </span>
                          <p className="text-stone-800 mt-0.5 leading-relaxed">{drug.posology}</p>
                        </div>
                      </div>

                      {/* Right Block: Administration & Dilution (Key for Nursing) */}
                      <div className="p-4 rounded-2xl bg-[#eef4ef] border border-[#cfdfd3] space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#203a2b] uppercase tracking-wider text-[10px]">
                          <Syringe className="w-3.5 h-3.5 text-[#365e45]" />
                          <span>Preparación y Dilución (Enfermería)</span>
                        </div>
                        <p className="text-stone-800 leading-relaxed">
                          <strong>Vía:</strong> {drug.administration}
                        </p>
                        <p className="text-stone-800 leading-relaxed">
                          <strong>Dilución recomendada:</strong> {drug.dilution}
                        </p>
                      </div>
                    </div>

                    {/* Priority Nursing Care Checks */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
                      <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-2">
                        <HeartPulse className="w-4 h-4 text-emerald-700" />
                        <span>Cuidados y Vigilancia Prioritaria de Enfermería</span>
                      </span>
                      <ul className="space-y-1.5 text-stone-700">
                        {drug.nursingCare.map((care, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#365e45] font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{care}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Adverse Effects & Contraindications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                        <span className="font-bold text-amber-900 block text-[10px] uppercase">
                          Efectos Adversos Comunes
                        </span>
                        <p className="text-stone-700 mt-1">{drug.adverseEffects}</p>
                      </div>

                      {drug.contraindications && (
                        <div className="p-3 rounded-xl bg-red-50/60 border border-red-200/60">
                          <span className="font-bold text-red-900 block text-[10px] uppercase">
                            Contraindicaciones
                          </span>
                          <p className="text-stone-700 mt-1">{drug.contraindications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 text-stone-500">
            <p className="text-sm">No se han encontrado fármacos que coincidan con «{searchTerm}».</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-stone-100 text-xs font-bold text-stone-700 hover:bg-stone-200"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Drug Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#e8f0e8] text-[#365e45] rounded-xl font-bold">💊</span>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Añadir Ficha de Fármaco</h3>
                  <p className="text-xs text-stone-500">Crea tus propias fichas mientras estudias en clase o prácticas</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Principio Activo *</label>
                  <input
                    type="text"
                    required
                    value={newDrug.name}
                    onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                    placeholder="Ej. Ceftriaxona sódica"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nombres Comerciales</label>
                  <input
                    type="text"
                    value={newDrug.commercialNames}
                    onChange={(e) => setNewDrug({ ...newDrug, commercialNames: e.target.value })}
                    placeholder="Separados por comas: Rocephin, etc."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Grupo Terapéutico</label>
                <input
                  type="text"
                  value={newDrug.group}
                  onChange={(e) => setNewDrug({ ...newDrug, group: e.target.value })}
                  placeholder="Ej. Cefalosporinas de 3.ª generación"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Indicaciones</label>
                <input
                  type="text"
                  value={newDrug.indications}
                  onChange={(e) => setNewDrug({ ...newDrug, indications: e.target.value })}
                  placeholder="Infecciones bacterianas graves respiratorias, sepsis, etc."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Posología Habitual</label>
                  <input
                    type="text"
                    value={newDrug.posology}
                    onChange={(e) => setNewDrug({ ...newDrug, posology: e.target.value })}
                    placeholder="1-2 g cada 24 horas"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Vías de Administración</label>
                  <input
                    type="text"
                    value={newDrug.administration}
                    onChange={(e) => setNewDrug({ ...newDrug, administration: e.target.value })}
                    placeholder="IV en perfusión, IM profunda con lidocaína"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Dilución e Infusión (Enfermería)</label>
                <input
                  type="text"
                  value={newDrug.dilution}
                  onChange={(e) => setNewDrug({ ...newDrug, dilution: e.target.value })}
                  placeholder="Diluir en 100 ml de SF 0.9% a pasar en 30 minutos. Incompatible con soluciones cálcicas."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Cuidados y Vigilancia de Enfermería (un punto por línea)
                </label>
                <textarea
                  rows={3}
                  value={newDrug.nursingCare}
                  onChange={(e) => setNewDrug({ ...newDrug, nursingCare: e.target.value })}
                  placeholder="Comprobar alergias a betalactámicos.&#10;Infundir en 30 min para evitar flebitis.&#10;Vigilar diuresis y función renal."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Efectos Adversos</label>
                  <input
                    type="text"
                    value={newDrug.adverseEffects}
                    onChange={(e) => setNewDrug({ ...newDrug, adverseEffects: e.target.value })}
                    placeholder="Diarrea, náuseas, flebitis local"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Contraindicaciones</label>
                  <input
                    type="text"
                    value={newDrug.contraindications}
                    onChange={(e) => setNewDrug({ ...newDrug, contraindications: e.target.value })}
                    placeholder="Alergia a cefalosporinas o penicilinas"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
                >
                  Guardar Ficha
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
