import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { UCLM_NURSING_CURRICULUM, PREREQUISITE_RULES, TOLEDO_CAMPUS_LOCATIONS } from '../data/uclm/curriculum';
import { Subject } from '../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  MapPin,
  Calendar,
  KeyRound,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Building2,
  ExternalLink
} from 'lucide-react';

export const UCLMView: React.FC = () => {
  const { state, updateSubjectStatus } = useCampusStore();
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 4>(1);
  const [activeTab, setActiveTab] = useState<'plan' | 'prerequisites' | 'campus'>('plan');
  const [searchTerm, setSearchTerm] = useState('');

  // Merge curriculum with user's customized subject progress from store if any
  const fullCurriculum = UCLM_NURSING_CURRICULUM.map(subject => {
    const userSubject = state.subjects.find(s => s.code === subject.code || s.name.toLowerCase() === subject.name.toLowerCase());
    if (userSubject) {
      return {
        ...subject,
        status: userSubject.status || subject.status || 'Pendiente',
        grade: userSubject.grade ?? subject.grade,
        progress: userSubject.progress ?? subject.progress
      };
    }
    return subject;
  });

  const yearSubjects = fullCurriculum.filter(s => s.year === selectedYear);
  const filteredSubjects = yearSubjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalEcts = fullCurriculum.reduce((acc, s) => acc + s.ects, 0);
  const approvedEcts = fullCurriculum.filter(s => s.status === 'Aprobada').reduce((acc, s) => acc + s.ects, 0);
  const yearEcts = yearSubjects.reduce((acc, s) => acc + s.ects, 0);
  const yearApprovedEcts = yearSubjects.filter(s => s.status === 'Aprobada').reduce((acc, s) => acc + s.ects, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e3b2b] via-[#2a4d38] to-[#152e20] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>UNIVERSIDAD DE CASTILLA-LA MANCHA · CAMPUS DE TOLEDO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mi UCLM · Vida Académica
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Plan de Estudios oficial del Grado en Enfermería (240 ECTS) en Fábrica de Armas. Asignaturas llave, control de matrícula, prerrequisitos clínicos y centros hospitalarios.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">
                Progreso Grado
              </span>
              <strong className="text-xl font-black text-white">
                {approvedEcts} / {totalEcts} ECTS
              </strong>
              <span className="text-[10px] text-stone-300 block">
                {Math.round((approvedEcts / totalEcts) * 100)}% completado
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-lg">
              {selectedYear}º
            </div>
          </div>
        </div>

        {/* Course Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          {([1, 2, 3, 4] as const).map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                selectedYear === yr
                  ? 'bg-white text-[#1e3b2b] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span>{yr}.º Curso</span>
              <span className="text-[11px] opacity-75">
                ({fullCurriculum.filter(s => s.year === yr && s.status === 'Aprobada').length}/
                {fullCurriculum.filter(s => s.year === yr).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'plan'
                ? 'bg-[#365e45] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Asignaturas {selectedYear}º ({yearSubjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('prerequisites')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'prerequisites'
                ? 'bg-[#365e45] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Asignaturas Llave ({PREREQUISITE_RULES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'campus'
                ? 'bg-[#365e45] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Campus Toledo & Hospitales</span>
          </button>
        </div>

        {activeTab === 'plan' && (
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar asignatura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#365e45]"
            />
          </div>
        )}
      </div>

      {/* TAB 1: ASIGNATURAS DEL CURSO SELECCIONADO */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          {/* Summary mini card */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                {selectedYear}º
              </div>
              <div>
                <strong className="text-sm font-extrabold text-stone-900 block">
                  {selectedYear === 1 ? 'Primer Curso: Fundamentos Básicos y Ciencias de la Salud' :
                   selectedYear === 2 ? 'Segundo Curso: Fisiopatología, Farmacología y Estancias Clínicas I' :
                   selectedYear === 3 ? 'Tercer Curso: Materno-Infantil, Salud Mental y Prácticas II-III' :
                   'Cuarto Curso: Urgencias, Críticos, Prácticas IV-V y TFG'}
                </strong>
                <span className="text-xs text-stone-500">
                  Total del curso: {yearEcts} ECTS · Superados: {yearApprovedEcts} ECTS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada
              </span>
              <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg font-bold">
                <Clock className="w-3.5 h-3.5" /> Matriculada
              </span>
              <span className="flex items-center gap-1 text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg font-bold">
                Pendiente
              </span>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((sub) => {
              const status = sub.status || 'Pendiente';
              return (
                <div
                  key={sub.code}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                            {sub.code}
                          </span>
                          <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {sub.sem}
                          </span>
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {sub.ects} ECTS
                          </span>
                          {sub.isKeySubject && (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded flex items-center gap-1">
                              <KeyRound className="w-3 h-3" /> Llave
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                          {sub.name}
                        </h3>
                        {sub.professor && (
                          <p className="text-xs text-stone-500 mt-0.5">
                            {sub.professor}
                          </p>
                        )}
                      </div>

                      {/* Status Selector */}
                      <select
                        value={status}
                        onChange={(e) => updateSubjectStatus(sub.code, e.target.value as Subject['status'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                          status === 'Aprobada'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : status === 'Matriculada'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-stone-50 text-stone-600 border-stone-300'
                        }`}
                      >
                        <option value="Matriculada">Matriculada</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Pendiente">Pendiente</option>
                      </select>
                    </div>

                    {/* Topics Accordion / Preview */}
                    {sub.topics && sub.topics.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-1.5">
                          Bloques Temáticos Clave:
                        </span>
                        <ul className="space-y-1">
                          {sub.topics.slice(0, 4).map((t, idx) => (
                            <li key={idx} className="text-xs text-stone-600 flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span className="line-clamp-1">{t}</span>
                            </li>
                          ))}
                          {sub.topics.length > 4 && (
                            <li className="text-[11px] text-stone-400 italic">
                              + {sub.topics.length - 4} temas más en la guía docente oficial
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer of Card: Grade & Progress */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Nota:</span>
                      {sub.grade !== undefined ? (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                          {sub.grade.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 italic">Sin calificar</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>Progreso:</span>
                      <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${sub.progress || 0}%` }}
                        />
                      </div>
                      <span className="font-bold text-stone-700">{sub.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ASIGNATURAS LLAVE Y PRERREQUISITOS */}
      {activeTab === 'prerequisites' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <KeyRound className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-extrabold text-amber-900 block">
                ¿Qué son las Asignaturas Llave en el Grado de Enfermería de Toledo?
              </strong>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Son materias troncales cuyos créditos deben estar oficialmente superados antes de poder matricularte en las rotaciones clínicas con pacientes reales o en cursos superiores. Garantizan la seguridad asistencial del paciente en centros sanitarios.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {PREREQUISITE_RULES.map((rule, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <strong className="text-base font-extrabold text-stone-900">
                        {rule.targetName}
                      </strong>
                      <span className="text-xs text-stone-400 block font-mono">
                        Código: {rule.targetCode}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                    Prerrequisito Obligatorio
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
                      Materias Requeridas Previas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.requiredCodes.map(code => {
                        const reqSub = fullCurriculum.find(s => s.code === code);
                        const isPassed = reqSub?.status === 'Aprobada';
                        return (
                          <span
                            key={code}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Clock className="w-3.5 h-3.5" />}
                            <span>{reqSub?.name || code}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 leading-relaxed flex items-center">
                    <p>{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAMPUS TOLEDO & HOSPITALES */}
      {activeTab === 'campus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOLEDO_CAMPUS_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {loc.type}
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {loc.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-stone-500 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>

                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                  {loc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-2">
                    Zonas y Espacios Docentes Clave:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.keyZones.map((zone, zIdx) => (
                      <span
                        key={zIdx}
                        className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>Vinculado al Grado en Enfermería UCLM</span>
                <span className="text-[11px] text-stone-400">Toledo</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
