import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { Subject } from '../types';
import {
  BookOpen,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Plus,
  CheckCircle2,
  Trash2,
  Layers
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const { state, updateState } = useCampusStore();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [newTopicText, setNewTopicText] = useState('');

  const currentSubject = state.subjects.find((s) => s.code === selectedCode);

  const handleProgressChange = (code: string, newProg: number) => {
    updateState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.code === code ? { ...s, progress: newProg } : s)),
    }));
  };

  const sem1 = state.subjects.filter((s) => s.sem.includes('1.º'));
  const sem2 = state.subjects.filter((s) => s.sem.includes('2.º'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          PLAN DE ESTUDIOS OFICIAL · UCLM TOLEDO
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Asignaturas de 1.º Curso
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          60 créditos ECTS · Facultad de Fisioterapia y Enfermería de Toledo (Campus Fábrica de Armas).
        </p>
      </div>

      {/* Selected Subject Detail Card */}
      {currentSubject ? (
        <div className="p-6 rounded-3xl bg-white border border-emerald-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCode(null)}
              className="text-xs font-bold text-[#365e45] hover:underline flex items-center gap-1"
            >
              ← Volver a todas las asignaturas
            </button>
            <span className="text-xs font-mono font-bold text-stone-400">
              Cód. UCLM {currentSubject.code}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f0e8] text-[#2d523e]">
                  {currentSubject.sem}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  {currentSubject.ects} ECTS
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                {currentSubject.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentSubject.type} · {currentSubject.professor}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fafbfa] border border-stone-200 text-right min-w-[180px]">
              <span className="text-xs text-stone-500 block">Mi Progreso de Estudio</span>
              <div className="text-2xl font-extrabold text-[#365e45] mt-0.5">
                {currentSubject.progress}%
              </div>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>Actualizar porcentaje de avance</span>
              <span>{currentSubject.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentSubject.progress}
              onChange={(e) => handleProgressChange(currentSubject.code, parseInt(e.target.value))}
              className="w-full accent-[#365e45] cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Consulta los contenidos oficiales en la web universitaria:</span>
            <a
              href="https://www.uclm.es/es/toledo/Fafeto/Estudios/GradoEnfermeria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#365e45] font-bold hover:underline flex items-center gap-1"
            >
              <span>Guía docente UCLM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : null}

      {/* Primer Semestre */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <span>Primer Semestre (30 ECTS)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sem1.map((subj) => (
            <div
              key={subj.code}
              onClick={() => setSelectedCode(subj.code)}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-2">
                  <span>{subj.code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {subj.ects} ECTS
                  </span>
                </div>
                <strong className="text-base font-bold text-stone-900 group-hover:text-[#365e45] transition block leading-snug">
                  {subj.name}
                </strong>
                <p className="text-xs text-stone-500 mt-1">{subj.type}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span>Progreso</span>
                  <span>{subj.progress}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#365e45] h-full rounded-full transition-all duration-300"
                    style={{ width: `${subj.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segundo Semestre */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <span>Segundo Semestre (30 ECTS)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sem2.map((subj) => (
            <div
              key={subj.code}
              onClick={() => setSelectedCode(subj.code)}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-2">
                  <span>{subj.code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {subj.ects} ECTS
                  </span>
                </div>
                <strong className="text-base font-bold text-stone-900 group-hover:text-[#365e45] transition block leading-snug">
                  {subj.name}
                </strong>
                <p className="text-xs text-stone-500 mt-1">{subj.type}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span>Progreso</span>
                  <span>{subj.progress}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#365e45] h-full rounded-full transition-all duration-300"
                    style={{ width: `${subj.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
