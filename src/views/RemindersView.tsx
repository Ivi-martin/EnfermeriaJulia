import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { OFFICIAL_COURSE_DEADLINES } from '../data/courseDeadlines';
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  Plus,
  CheckCircle2,
  Trash2,
  Briefcase,
  Stethoscope,
  X,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Download,
  ExternalLink,
  BookOpenCheck
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const {
    state,
    addExam,
    toggleExamCompleted,
    removeExam,
    addShift,
    toggleShiftCompleted,
    removeShift,
    togglePocketItem,
    resetPocketChecklist
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<'exams' | 'shifts' | 'deadlines' | 'pocket'>('exams');
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');

  const todayStr = new Date().toISOString().slice(0, 10);

  // New exam form
  const [newExam, setNewExam] = useState({
    subject: 'Anatomía Humana',
    date: todayStr,
    time: '09:00',
    classroom: 'Aula Magna',
    campusLocation: 'Campus Fábrica de Armas',
    topics: '',
    weightPercent: 40,
    alertDaysBefore: 3,
    notes: ''
  });

  // New shift form
  const [newShift, setNewShift] = useState({
    hospital: 'Hospital Universitario de Toledo (HUT)',
    service: 'Medicina Interna',
    date: todayStr,
    shiftType: 'Mañana (08:00-15:00)' as any,
    hours: 7,
    tutorName: '',
    objectives: '',
    learnings: '',
    status: 'Validado' as const
  });

  const getDaysDiff = (targetDate: string) => {
    const diff = Math.round(
      (new Date(targetDate + 'T12:00:00').getTime() - new Date(todayStr + 'T12:00:00').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return 'Finalizado';
    if (diff === 0) return '¡HOY!';
    if (diff === 1) return '¡Mañana!';
    return `En ${diff} días`;
  };

  const handleRequestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Las notificaciones no están soportadas en este navegador.');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationStatus(perm);
    if (perm === 'granted') {
      new Notification('Campus Enfermería Toledo', {
        body: '¡Avisos activados con éxito! Te recordaremos tus exámenes y turnos clínicos.',
        icon: '/pwa-192x192.png'
      });
    }
  };

  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.subject.trim()) return;
    addExam(newExam);
    setShowAddExamModal(false);
  };

  const handleAddShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShift.hospital.trim()) return;
    addShift(newShift);
    setShowAddShiftModal(false);
  };

  const generateIcsFile = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Campus Enfermeria UCLM//Julia//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Enfermería Julia (UCLM Toledo)'
    ];

    state.exams.forEach((exam) => {
      const dt = exam.date.replace(/-/g, '');
      const time = (exam.time || '09:00').replace(':', '') + '00';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:exam-${exam.id}-${dt}@enfermeriajulia.uclm`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART:${dt}T${time}`);
      lines.push(`DTEND:${dt}T${time}`);
      lines.push(`SUMMARY:Examen: ${exam.subject}`);
      lines.push(`LOCATION:${exam.classroom || 'Campus Fábrica de Armas'}`);
      lines.push(`DESCRIPTION:${exam.topics || 'Examen oficial'} · ${exam.weightPercent || 40}% peso nota`);
      lines.push('END:VEVENT');
    });

    state.shifts.forEach((shift) => {
      const dt = shift.date.replace(/-/g, '');
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:shift-${shift.id}-${dt}@enfermeriajulia.uclm`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART:${dt}T080000`);
      lines.push(`DTEND:${dt}T150000`);
      lines.push(`SUMMARY:Turno Clínico: ${shift.service} (${shift.hospital})`);
      lines.push(`LOCATION:${shift.hospital}`);
      lines.push(`DESCRIPTION:${shift.shiftType} · Tutora: ${shift.tutorName || 'Supervisora'}`);
      lines.push('END:VEVENT');
    });

    OFFICIAL_COURSE_DEADLINES.forEach((dl) => {
      const dt = dl.startDate.replace(/-/g, '');
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:dead-${dl.id}@enfermeriajulia.uclm`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART;VALUE=DATE:${dt}`);
      lines.push(`SUMMARY:[Plazo Oficial] ${dl.title}`);
      lines.push(`DESCRIPTION:${dl.description}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendario-enfermeria-julia.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedPocket = state.pocketChecklist.filter((i) => i.checked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
            AGENDA Y AVISOS DE PRÁCTICAS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Recordatorios de Exámenes y Prácticas
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Organiza tus fechas clave, cuentas atrás, turnos hospitalarios, plazos de beca y material de bolsillo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generateIcsFile}
            className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 transition flex items-center gap-1.5 shadow-2xs"
            title="Descargar archivo .ics para Google Calendar, iPhone o Outlook"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exportar Calendario (.ics)</span>
          </button>

          <button
            onClick={handleRequestNotificationPermission}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition flex items-center gap-1.5 shadow-2xs"
            title="Activar alertas nativas"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Avisos web</span>
          </button>

          {activeTab === 'exams' && (
            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#365e45] hover:bg-[#284835] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Examen</span>
            </button>
          )}

          {activeTab === 'shifts' && (
            <button
              onClick={() => setShowAddShiftModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#365e45] hover:bg-[#284835] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Turno</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'exams'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Exámenes ({state.exams.filter((e) => !e.completed).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shifts')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'shifts'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Turnos de Prácticas ({state.shifts.filter((s) => !s.completed).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deadlines')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'deadlines'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>Plazos del Curso (Becas, Matrícula)</span>
        </button>

        <button
          onClick={() => setActiveTab('pocket')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pocket'
              ? 'bg-[#365e45] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Bolsillo de Prácticas ({completedPocket}/{state.pocketChecklist.length})</span>
        </button>
      </div>

      {/* TAB 1: EXAMS LIST */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.exams.length > 0 ? (
              state.exams.map((exam) => {
                const diffText = getDaysDiff(exam.date);
                const isUrgent = diffText === '¡HOY!' || diffText === '¡Mañana!';
                return (
                  <div
                    key={exam.id}
                    className={`p-5 rounded-3xl bg-white border transition shadow-xs flex flex-col justify-between ${
                      exam.completed
                        ? 'border-stone-200 opacity-60 bg-stone-50/60'
                        : isUrgent
                        ? 'border-amber-400 ring-2 ring-amber-100'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={exam.completed}
                            onChange={() => toggleExamCompleted(exam.id)}
                            className="w-4 h-4 mt-1 accent-[#365e45] rounded cursor-pointer"
                            title="Marcar como realizado"
                          />
                          <div>
                            <strong
                              className={`text-base font-bold text-stone-900 ${
                                exam.completed ? 'line-through text-stone-400' : ''
                              }`}
                            >
                              {exam.subject}
                            </strong>
                            {exam.weightPercent && (
                              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                {exam.weightPercent}% de la nota final
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-xl shrink-0 ${
                            exam.completed
                              ? 'bg-stone-100 text-stone-500'
                              : isUrgent
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-[#e8f0e8] text-[#2d523e]'
                          }`}
                        >
                          {diffText}
                        </span>
                      </div>

                      {/* Location & Time info */}
                      <div className="mt-3 text-xs text-stone-600 space-y-1.5 pl-6.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            <strong>Fecha y hora:</strong> {exam.date} a las {exam.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {exam.classroom} · {exam.campusLocation}
                          </span>
                        </div>
                        {exam.topics && (
                          <div className="pt-1 text-[11px] text-stone-500">
                            <strong>Temario:</strong> {exam.topics}
                          </div>
                        )}
                        {exam.notes && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 mt-2">
                            💡 {exam.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 pl-6.5">
                      <span>Aviso previo: {exam.alertDaysBefore || 3} días antes</span>
                      <button
                        onClick={() => removeExam(exam.id)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                        title="Eliminar recordatorio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 p-12 text-center rounded-3xl bg-white border border-stone-200 text-stone-500">
                No tienes exámenes registrados. Pulsa en «Nuevo Examen» para programar tus convocatorias.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL PRACTICE SHIFTS */}
      {activeTab === 'shifts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.shifts.length > 0 ? (
              state.shifts.map((shift) => {
                const diffText = getDaysDiff(shift.date);
                return (
                  <div
                    key={shift.id}
                    className={`p-5 rounded-3xl bg-white border transition shadow-xs flex flex-col justify-between ${
                      shift.completed
                        ? 'border-stone-200 opacity-60 bg-stone-50/60'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={shift.completed}
                            onChange={() => toggleShiftCompleted(shift.id)}
                            className="w-4 h-4 mt-1 accent-[#365e45] rounded cursor-pointer"
                            title="Marcar como turno realizado"
                          />
                          <div>
                            <strong className="text-base font-bold text-stone-900">
                              {shift.hospital}
                            </strong>
                            <div className="text-xs font-semibold text-emerald-800 mt-0.5">
                              {shift.service}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#e8f0e8] text-[#2d523e]">
                          {diffText}
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-stone-600 space-y-1.5 pl-6.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {shift.date} · <strong>{shift.shiftType}</strong> ({shift.hours} h)
                          </span>
                        </div>
                        {shift.tutorName && (
                          <div className="text-[11px] text-stone-500">
                            <strong>Tutora de prácticas:</strong> {shift.tutorName}
                          </div>
                        )}
                        {shift.objectives && (
                          <div className="text-[11px] text-stone-600 pt-1">
                            <strong>Objetivos:</strong> {shift.objectives}
                          </div>
                        )}
                        {shift.learnings && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-950 mt-2">
                            ✨ {shift.learnings}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 pl-6.5">
                      <span>{shift.completed ? 'Turno completado' : 'Pendiente de realizar'}</span>
                      <button
                        onClick={() => removeShift(shift.id)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                        title="Eliminar turno"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 p-12 text-center rounded-3xl bg-white border border-stone-200 text-stone-500">
                No tienes turnos clínicos registrados. Añade tu calendario de estancias hospitalarias.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COURSE DEADLINES (Becas MEC, Matrícula, Convocatorias) */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">Plazos Oficiales del Curso Universitario</h3>
              <p className="text-xs text-stone-500">
                Fechas clave de la Universidad de Castilla-La Mancha (UCLM) y convocatorias del Ministerio de Educación.
              </p>
            </div>
            <button
              onClick={generateIcsFile}
              className="px-3.5 py-2 rounded-xl bg-[#365e45] text-white text-xs font-bold hover:bg-[#284835] transition flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sincronizar con mi Calendario (.ics)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL_COURSE_DEADLINES.map((dl) => {
              const diffText = getDaysDiff(dl.startDate);
              const isUrgent = dl.urgent || diffText === '¡HOY!' || diffText === '¡Mañana!';
              return (
                <div
                  key={dl.id}
                  className={`p-5 rounded-3xl bg-white border transition shadow-xs flex flex-col justify-between ${
                    isUrgent
                      ? 'border-amber-300 ring-2 ring-amber-50 bg-amber-50/20'
                      : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          dl.category === 'Becas'
                            ? 'bg-purple-100 text-purple-800'
                            : dl.category === 'Matrícula'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {dl.category}
                        </span>
                        {dl.urgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Prioritario
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#365e45] bg-[#e8f0e8] px-2.5 py-1 rounded-xl">
                        {diffText}
                      </span>
                    </div>

                    <strong className="text-base font-bold text-stone-900 block">
                      {dl.title}
                    </strong>

                    <div className="text-xs text-stone-600 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        Desde <strong>{dl.startDate}</strong> hasta <strong>{dl.endDate}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed">
                      {dl.description}
                    </p>
                  </div>

                  {dl.officialUrl && (
                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                      <a
                        href={dl.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#365e45] hover:underline flex items-center gap-1"
                      >
                        <span>Ir a la sede oficial</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <span className="text-[10px] text-stone-400">Verificado UCLM / MEC</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#f8faf7] border border-stone-200 text-xs text-stone-600 space-y-1">
            <strong>💡 Cómo suscribirte desde tu móvil:</strong>
            <p className="leading-relaxed">
              Pulsa en <strong>«Exportar Calendario (.ics)»</strong> para descargar el archivo. Ábrelo en tu teléfono móvil (iPhone o Android) y selecciona <em>«Añadir a Calendario»</em>. Todos tus exámenes, turnos del HUT y plazos de beca quedarán registrados en tu aplicación de agenda nativa con sus alarmas automáticas.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: POCKET CHECKLIST */}
      {activeTab === 'pocket' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Checklist del Bolsillo de la Bata</h3>
              <p className="text-xs text-stone-500">
                Material imprescindible antes de cruzar la puerta de la unidad hospitalaria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl">
                {completedPocket} de {state.pocketChecklist.length} preparados
              </span>
              <button
                onClick={resetPocketChecklist}
                className="px-2.5 py-1 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1 transition"
                title="Desmarcar todos"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {state.pocketChecklist.map((item) => (
              <label
                key={item.id}
                onClick={() => togglePocketItem(item.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  item.checked
                    ? 'border-emerald-300 bg-emerald-50/40 text-stone-900'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}} // handled by parent label click
                  className="w-4 h-4 mt-0.5 accent-[#365e45] rounded cursor-pointer"
                />
                <div className="min-w-0">
                  <strong className="text-xs font-bold block">{item.name}</strong>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#f8faf7] border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#365e45] shrink-0 mt-0.5" />
            <span>
              <strong>Consejo de enfermería:</strong> El reloj debe ser de solapa con segundero, prendido en el uniforme. Por normativa de higiene y control de infecciones nosocomiales, no se permite llevar relojes de pulsera ni anillos en las manos durante la atención directa al paciente.
            </span>
          </div>
        </div>
      )}

      {/* Modal: Add Exam */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Programar Recordatorio de Examen</h3>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExamSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Asignatura</label>
                <select
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none bg-white"
                >
                  {state.subjects.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                  <option value="Farmacología Básica">Farmacología Básica</option>
                  <option value="Prueba ECOE de Habilidades">Prueba ECOE de Habilidades</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={newExam.time}
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Aula / Edificio</label>
                  <input
                    type="text"
                    value={newExam.classroom}
                    onChange={(e) => setNewExam({ ...newExam, classroom: e.target.value })}
                    placeholder="Aula Magna 1.2"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">% Peso en nota</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newExam.weightPercent}
                    onChange={(e) => setNewExam({ ...newExam, weightPercent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Temas que entran</label>
                <input
                  type="text"
                  value={newExam.topics}
                  onChange={(e) => setNewExam({ ...newExam, topics: e.target.value })}
                  placeholder="Temas 1 al 6: aparato locomotor y cardiovascular"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Notas / Consejos personales</label>
                <input
                  type="text"
                  value={newExam.notes}
                  onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                  placeholder="Llevar calculadora y DNI. Repasar planos."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
                >
                  Guardar Examen
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shift */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Programar Turno de Prácticas</h3>
              <button
                onClick={() => setShowAddShiftModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShiftSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Hospital / Centro</label>
                <select
                  value={newShift.hospital}
                  onChange={(e) => setNewShift({ ...newShift, hospital: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none bg-white"
                >
                  <option value="Hospital Universitario de Toledo (HUT)">Hospital Universitario de Toledo (HUT)</option>
                  <option value="Hospital Provincial de Toledo">Hospital Provincial de Toledo</option>
                  <option value="Hospital Nacional de Parapléjicos (Toledo)">Hospital Nacional de Parapléjicos (Toledo)</option>
                  <option value="Centro de Salud Palomarejos (Toledo)">Centro de Salud Palomarejos</option>
                  <option value="Centro de Salud Santa Bárbara">Centro de Salud Santa Bárbara</option>
                  <option value="Residencia Social Asistida San José">Residencia Social Asistida San José</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Servicio / Unidad</label>
                <input
                  type="text"
                  required
                  value={newShift.service}
                  onChange={(e) => setNewShift({ ...newShift, service: e.target.value })}
                  placeholder="Medicina Interna, Cirugía, Urgencias, etc."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newShift.date}
                    onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Turno</label>
                  <select
                    value={newShift.shiftType}
                    onChange={(e) => setNewShift({ ...newShift, shiftType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none bg-white"
                  >
                    <option value="Mañana (08:00-15:00)">Mañana (08:00-15:00)</option>
                    <option value="Tarde (15:00-22:00)">Tarde (15:00-22:00)</option>
                    <option value="Noche (22:00-08:00)">Noche (22:00-08:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nombre de la Tutora/Enfermera</label>
                <input
                  type="text"
                  value={newShift.tutorName}
                  onChange={(e) => setNewShift({ ...newShift, tutorName: e.target.value })}
                  placeholder="Dña. Carmen / Supervisora"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Objetivos del turno</label>
                <input
                  type="text"
                  value={newShift.objectives}
                  onChange={(e) => setNewShift({ ...newShift, objectives: e.target.value })}
                  placeholder="Administración de medicación oral y curas de heridas."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#365e45] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition"
                >
                  Guardar Turno
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
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
