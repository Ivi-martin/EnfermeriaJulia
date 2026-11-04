import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import {
  Stethoscope,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

const CLINICAL_PROCEDURES_LIST = [
  'Toma de constantes vitales',
  'Glucemia capilar',
  'Higiene y aseo del paciente',
  'Movilización y cambios posturales',
  'Curas de heridas y UPP',
  'Administración de medicación oral',
  'Inyección SC / IM',
  'Canalización de vía venosa periférica (VVP)',
  'Extracción de sangre venosa',
  'Sondaje vesical',
  'Electrocardiograma (ECG)',
  'Soporte Vital Básico en simulación',
  'Sondaje nasogástrico',
  'Oxigenoterapia y aerosolterapia'
];

export const PracticasView: React.FC = () => {
  const { state, updateState, incrementProcedure, removeShift } = useCampusStore();
  const [targetHours, setTargetHours] = useState(state.practiceHoursTarget);

  const totalHours = state.shifts.reduce((acc, s) => acc + (s.completed ? s.hours : 0), 0);
  const percentCompleted =
    state.practiceHoursTarget > 0
      ? Math.min(100, Math.round((totalHours / state.practiceHoursTarget) * 100))
      : 0;

  const handleUpdateTarget = (val: number) => {
    setTargetHours(val);
    updateState((prev) => ({ ...prev, practiceHoursTarget: val }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          FORMACIÓN PRÁCTICA TUTORIZADA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Mis Prácticas Clínicas y Portfolio
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Registro acumulado de horas, guardias asistenciales y competencias procedimentales adquiridas.
        </p>
      </div>

      {/* Progress & Target Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Horas Validadas</span>
            <div className="text-3xl font-extrabold text-stone-900 mt-0.5">{totalHours} h</div>
            <span className="text-[11px] text-emerald-800 font-semibold">{percentCompleted}% del objetivo oficial</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e8f0e8] text-[#2d523e] flex items-center justify-center font-bold">
            <Clock className="w-6 h-6 text-[#365e45]" />
          </div>
        </div>

        <div className="sm:col-span-2 p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Objetivo de Horas del Curso</h3>
              <p className="text-xs text-stone-500">Ajusta según tu guía docente de Prácticum UCLM</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={targetHours}
                onChange={(e) => handleUpdateTarget(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-center focus:ring-2 focus:ring-[#365e45] focus:outline-none"
              />
              <span className="text-xs text-stone-500 font-semibold">horas</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#365e45] h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clinical Competencies Counter */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Registro de Procedimientos Realizados</h3>
            <p className="text-xs text-stone-500">
              Anota cada vez que realices una técnica bajo supervisión de tu tutora
            </p>
          </div>
          <span className="text-xs text-stone-400 font-semibold hidden sm:inline-block">
            Suma para tu cuaderno de prácticas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CLINICAL_PROCEDURES_LIST.map((proc) => {
            const count = state.clinicalProcedures[proc] || 0;
            return (
              <div
                key={proc}
                className="p-3.5 rounded-2xl border border-stone-200 bg-[#fafafa] flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-stone-800 leading-snug">{proc}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => incrementProcedure(proc, -1)}
                    className="w-7 h-7 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center font-bold text-stone-600 transition"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-extrabold text-[#365e45]">{count}</span>
                  <button
                    onClick={() => incrementProcedure(proc, 1)}
                    className="w-7 h-7 rounded-lg bg-[#365e45] hover:bg-[#284835] text-white flex items-center justify-center font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shifts History */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900">Historial de Turnos y Guardias</h3>
        <div className="space-y-3">
          {state.shifts.length > 0 ? (
            state.shifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 rounded-2xl border border-stone-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-stone-900">{shift.hospital}</strong>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      {shift.service}
                    </span>
                  </div>
                  <div className="text-stone-500 mt-1 flex items-center gap-3">
                    <span>{shift.date}</span>
                    <span>{shift.shiftType}</span>
                    <span>{shift.hours} horas</span>
                  </div>
                  {shift.learnings && (
                    <p className="mt-1.5 text-stone-600 italic">«{shift.learnings}»</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                      shift.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {shift.completed ? 'Completado' : 'Pendiente'}
                  </span>
                  <button
                    onClick={() => removeShift(shift.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">No hay turnos registrados.</div>
          )}
        </div>
      </div>
    </div>
  );
};
