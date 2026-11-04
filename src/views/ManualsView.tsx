import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { ClinicalManual } from '../types';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  WifiOff
} from 'lucide-react';

export const ManualsView: React.FC = () => {
  const { state, toggleManualOffline } = useCampusStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('man-vvp');

  const categories = [
    { id: 'all', label: 'Todos los procedimientos' },
    { id: 'Vías y Medicación', label: 'Vías y Medicación' },
    { id: 'Eliminación', label: 'Eliminación y Sondajes' },
    { id: 'Diagnóstico y Constantes', label: 'Constantes & ECG' },
    { id: 'Urgencias y Soporte', label: 'Urgencias & SVB' }
  ];

  const filteredManuals = state.manuals.filter((m) => {
    const matchesCat = selectedCat === 'all' || m.category === selectedCat;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.title.toLowerCase().includes(term) ||
      m.summary.toLowerCase().includes(term) ||
      m.materials.some((mat) => mat.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  const handlePrint = (manual: ClinicalManual) => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#8e483b]">
            PRÁCTICA CLÍNICA & PROCEDIMIENTOS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Manuales de Procedimientos Clínicos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Guías paso a paso con preparación de material, técnica aséptica y precauciones. Totalmente accesibles sin conexión.
          </p>
        </div>

        {/* Offline Cache Indicator Badge */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Guardado local activo (Offline)</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar procedimiento (ej. Vía venosa, Sondaje vesical, ECG, SVB, tubos analítica)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#365e45] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCat === c.id
                  ? 'bg-[#8e483b] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manuals Accordion Cards */}
      <div className="space-y-4">
        {filteredManuals.length > 0 ? (
          filteredManuals.map((man) => {
            const isExpanded = expandedId === man.id;
            return (
              <div
                key={man.id}
                className="rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : man.id)}
                  className="p-5 cursor-pointer flex items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#f5ece8] text-[#8e483b] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
                      <BookOpen className="w-5 h-5 text-[#8e483b]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-base font-bold text-stone-900">{man.title}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {man.difficulty}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Offline</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{man.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint(man);
                      }}
                      className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition no-print"
                      title="Imprimir o guardar en PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-stone-400 hover:text-stone-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Guide */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-stone-100 space-y-5 animate-fadeIn">
                    {/* Materials Checklist Card (Preparar la batea) */}
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-stone-200">
                      <div className="flex items-center gap-2 mb-2 font-bold text-xs text-stone-800 uppercase tracking-wider">
                        <span>📦 Material Necesario (Preparación de la Batea)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                        {man.materials.map((mat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span className="leading-relaxed">{mat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Procedure Phases */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Procedimiento Paso a Paso
                      </h4>
                      {man.steps.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2"
                        >
                          <span className="font-extrabold text-[#365e45] text-xs uppercase tracking-wider block">
                            Fase {idx + 1}: {st.phase}
                          </span>
                          <ol className="list-decimal list-inside space-y-1.5 text-stone-700 leading-relaxed pl-1">
                            {st.instructions.map((inst, i) => (
                              <li key={i} className="pl-1">
                                {inst}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>

                    {/* Safety Warnings & Key Tips */}
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Puntos Críticos de Seguridad (¡Lo que NUNCA debes hacer!)</span>
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-stone-800 leading-relaxed pl-1">
                        {man.keySafetyTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Nursing Record Guidelines */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-stone-700">
                      <strong className="text-emerald-950 block text-[11px] uppercase mb-1">
                        📝 Registro Reglamentario en la Historia Clínica
                      </strong>
                      <p className="leading-relaxed">{man.nursingRecordGuideline}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 text-stone-500">
            No se han encontrado manuales clínicos para «{searchTerm}».
          </div>
        )}
      </div>
    </div>
  );
};
