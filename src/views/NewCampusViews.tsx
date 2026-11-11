import React, { useMemo, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownToLine, ArrowUpRight, BookOpen, CalendarDays, Check,
  CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, ExternalLink, FileText,
  GraduationCap, Library, MapPin, Plus, Search, ShieldCheck, Sparkles, Trash2, Train,
  Bus, UserRound, X, BookMarked, ClipboardList, CalendarClock, HeartHandshake,
} from 'lucide-react';
import { useCampusStore } from '../hooks/useCampusStore';
import { ECOE_STATIONS } from '../data/ecoe/stations';
import {
  ClinicalCompetency, ClinicalSourceRecord, CriticalAppraisal, DestinationShortcut, EcoeTrainingResult, GibbsReflection,
  PICOQuestion, PracticeLearningEntry, PracticeRotation, ScientificReference,
  StudyBlock, TFGMeeting, TFGMilestone, TFGProject,
} from '../types';

const todayLocal = () => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const inputClass = 'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';
const labelClass = 'mb-1 block text-xs font-bold text-stone-600';
const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#365e45] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#294a36] disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50';

function PageHeading({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: React.ElementType }) {
  return <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="rounded-2xl bg-[#e8f0e8] p-3 text-[#365e45]"><Icon className="h-6 w-6" /></div>
      <div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-emerald-800">{eyebrow}</p><h2 className="text-2xl font-black tracking-tight text-stone-900">{title}</h2><p className="mt-1 max-w-3xl text-sm text-stone-500">{description}</p></div>
    </div>
  </div>;
}
function Panel({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-stone-900">{title}</h3>{description && <p className="mt-1 text-xs text-stone-500">{description}</p>}</div>{action}</div>{children}</section>;
}
function EmptyState({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-center text-sm text-stone-500">{text}</div>; }
function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'blue' }) {
  const styles = { neutral: 'bg-stone-100 text-stone-600', green: 'bg-emerald-100 text-emerald-800', amber: 'bg-amber-100 text-amber-800', blue: 'bg-sky-100 text-sky-800' };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[tone]}`}>{children}</span>;
}

// 1. MI SEMANA INTELIGENTE — usa agenda, exámenes, turnos y tareas existentes.
export function SmartWeekView() {
  const { state, updateState } = useCampusStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('week');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', date: todayLocal(), startTime: '17:00', durationMinutes: 45, kind: 'Estudio' as StudyBlock['kind'], notes: '' });
  const weekDays = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
    monday.setHours(12, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  }, [weekOffset]);
  const dateKey = (d: Date) => { const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return x.toISOString().slice(0, 10); };
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const monthDays = useMemo(() => { const first = new Date(); first.setDate(1); first.setMonth(first.getMonth() + monthOffset); first.setHours(12, 0, 0, 0); const start = new Date(first); start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; }); }, [monthOffset]);
  const addBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const block: StudyBlock = { ...form, id: makeId('study'), done: false };
    updateState(prev => ({ ...prev, studyBlocks: [block, ...prev.studyBlocks] }));
    setShowForm(false); setForm(f => ({ ...f, title: '', notes: '' }));
  };
  const toggleBlock = (id: string) => updateState(prev => ({ ...prev, studyBlocks: prev.studyBlocks.map(b => b.id === id ? { ...b, done: !b.done } : b) }));
  const removeBlock = (id: string) => updateState(prev => ({ ...prev, studyBlocks: prev.studyBlocks.filter(b => b.id !== id) }));
  const today = todayLocal();
  const selectedDay = new Date(); selectedDay.setDate(selectedDay.getDate() + dayOffset); selectedDay.setHours(12, 0, 0, 0);
  const visibleDays = viewMode === 'today' ? [selectedDay] : viewMode === 'month' ? monthDays : weekDays;
  const visibleKeys = visibleDays.map(dateKey);
  const blocks = state.studyBlocks.filter(b => visibleKeys.includes(b.date));
  const events = state.events.filter(e => visibleKeys.includes(e.date));
  const tasks = state.tasks.filter(t => visibleKeys.includes(t.date));
  const exams = state.exams.filter(e => !e.completed && visibleKeys.includes(e.date));
  const shifts = state.shifts.filter(s => !s.completed && visibleKeys.includes(s.date));
  const deadlines = state.courseDeadlines.filter(d => visibleKeys.some(key => key >= d.startDate && key <= d.endDate));
  const tfgMilestones = state.tfgMilestones.filter(m => !m.completed && m.dueDate && visibleKeys.includes(m.dueDate));
  const tfgMeetings = state.tfgMeetings.filter(m => visibleKeys.includes(m.date));
  const totalPending = state.tasks.filter(t => !t.done).length + state.studyBlocks.filter(b => !b.done).length + state.tfgMilestones.filter(m => !m.completed).length;
  const rangeLabel = viewMode === 'today' ? selectedDay.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : viewMode === 'month' ? monthDays[14].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : `${weekDays[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – ${weekDays[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  return <div className="space-y-6">
    <PageHeading eyebrow="Mi día · Organización" title="Mi semana inteligente" description="Una única vista para coordinar eventos, tareas, exámenes, turnos y bloques de estudio sin duplicar la agenda existente." icon={CalendarDays} />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {[['Tareas pendientes', totalPending, ''], ['Exámenes esta semana', exams.length, ''], ['Turnos próximos', shifts.length, ''], ['Bloques de estudio', blocks.filter(b => b.kind === 'Estudio').length, '']].map(([label, value], i) => <div key={String(label)} className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs font-semibold text-stone-500">{label}</p><p className="mt-1 text-2xl font-black text-stone-900">{value}</p></div>)}
    </div>
    <Panel title={viewMode === 'today' ? 'Agenda de hoy' : viewMode === 'month' ? 'Vista mensual' : 'Planificador semanal'} description="Los eventos, exámenes, turnos y tareas se leen de las secciones que ya existen." action={<button className={primaryButton} onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> Añadir bloque</button>}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div className="font-bold capitalize text-stone-700">{rangeLabel}</div><div className="flex flex-wrap items-center gap-2"><div className="flex rounded-xl border border-stone-200 p-1">{(['today','week','month'] as const).map(mode => <button key={mode} onClick={() => { setViewMode(mode); if (mode === 'today') setDayOffset(0); }} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${viewMode === mode ? 'bg-[#365e45] text-white' : 'text-stone-600 hover:bg-stone-100'}`}>{mode === 'today' ? 'Hoy' : mode === 'week' ? 'Semana' : 'Mes'}</button>)}</div><button className={secondaryButton} onClick={() => viewMode === 'month' ? setMonthOffset(v => v - 1) : viewMode === 'today' ? setDayOffset(v => v - 1) : setWeekOffset(v => v - 1)} aria-label="Periodo anterior"><ChevronLeft className="h-4 w-4" /></button><button className={secondaryButton} onClick={() => { setWeekOffset(0); setMonthOffset(0); setDayOffset(0); setViewMode(viewMode === 'today' ? 'today' : 'week'); }}>Actual</button><button className={secondaryButton} onClick={() => viewMode === 'month' ? setMonthOffset(v => v + 1) : viewMode === 'today' ? setDayOffset(v => v + 1) : setWeekOffset(v => v + 1)} aria-label="Periodo siguiente"><ChevronRight className="h-4 w-4" /></button></div></div>
      {showForm && <form onSubmit={addBlock} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label><span className={labelClass}>Título</span><input className={inputClass} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej. Repaso de fisiología" /></label>
        <label><span className={labelClass}>Asignatura</span><select className={inputClass} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}><option value="">Sin asignatura</option>{state.subjects.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}</select></label>
        <label><span className={labelClass}>Fecha</span><input className={inputClass} type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
        <label><span className={labelClass}>Hora de inicio</span><input className={inputClass} type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></label>
        <label><span className={labelClass}>Duración (minutos)</span><input className={inputClass} type="number" min="5" max="480" step="5" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></label>
        <label><span className={labelClass}>Tipo</span><select className={inputClass} value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value as StudyBlock['kind'] })}><option>Estudio</option><option>Descanso</option><option>Personal</option></select></label>
        <label className="sm:col-span-2"><span className={labelClass}>Nota (opcional)</span><input className={inputClass} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Objetivo de la sesión" /></label>
        <div className="flex items-end gap-2"><button className={primaryButton} type="submit">Guardar bloque</button><button className={secondaryButton} type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
      </form>}
      <div className={`grid gap-2 ${viewMode === 'month' ? 'grid-cols-7' : viewMode === 'today' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-7'}`}>
        {visibleDays.map((day, index) => { const key = dateKey(day); const dayBlocks = blocks.filter(b => b.date === key); const dayEvents = events.filter(e => e.date === key); const dayTasks = tasks.filter(t => t.date === key); const dayExams = exams.filter(e => e.date === key); const dayShifts = shifts.filter(s => s.date === key); const dayDeadlines = deadlines.filter(d => key >= d.startDate && key <= d.endDate); const dayMilestones = tfgMilestones.filter(m => m.dueDate === key); const dayMeetings = tfgMeetings.filter(m => m.date === key); const count = dayBlocks.length + dayEvents.length + dayTasks.length + dayExams.length + dayShifts.length + dayDeadlines.length + dayMilestones.length + dayMeetings.length; return <div key={key} className={`min-h-40 rounded-xl border p-2 ${key === today ? 'border-emerald-400 bg-emerald-50/60' : 'border-stone-200 bg-stone-50/70'}`}>
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-extrabold text-stone-700">{viewMode === 'today' ? 'Hoy' : dayNames[index % 7]}</span><span className={`text-sm font-black ${key === today ? 'text-emerald-800' : 'text-stone-500'}`}>{day.getDate()}</span></div>
          {count === 0 ? <p className="py-4 text-center text-[11px] text-stone-400">Sin eventos</p> : <div className="space-y-1.5">
            {dayExams.slice(0, viewMode === 'month' ? 1 : undefined).map(e => <div key={`ex-${e.id}`} className="rounded-lg bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-800">Examen · {e.subject}</div>)}
            {dayDeadlines.slice(0, viewMode === 'month' ? 1 : undefined).map(d => <div key={`deadline-${d.id}`} className="rounded-lg bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-900">Plazo · {d.title}</div>)}
            {dayMilestones.slice(0, viewMode === 'month' ? 1 : undefined).map(m => <div key={`tfg-step-${m.id}`} className="rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">Hito TFG · {m.title}</div>)}
            {dayMeetings.slice(0, viewMode === 'month' ? 1 : undefined).map(m => <div key={`tfg-meeting-${m.id}`} className="rounded-lg bg-fuchsia-100 px-2 py-1 text-[10px] font-bold text-fuchsia-900">Tutoría TFG · {m.topic}</div>)}
            {dayShifts.slice(0, viewMode === 'month' ? 1 : undefined).map(s => <div key={s.id} className="rounded-lg bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-800">Prácticas · {s.service}</div>)}
            {dayEvents.slice(0, viewMode === 'month' ? 1 : undefined).map(e => <div key={`ev-${e.id}`} className="rounded-lg bg-sky-100 px-2 py-1 text-[10px] font-semibold text-sky-800">{e.time} · {e.title}</div>)}
            {dayBlocks.slice(0, viewMode === 'month' ? 1 : undefined).map(b => <div key={b.id} className="group flex items-start gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] text-emerald-900"><button onClick={() => toggleBlock(b.id)} className="mt-0.5" aria-label="Marcar bloque"><Check className={`h-3 w-3 ${b.done ? 'text-emerald-800' : 'text-emerald-300'}`} /></button><span className={`min-w-0 flex-1 ${b.done ? 'line-through opacity-60' : ''}`}>{b.startTime} · {b.title}</span><button onClick={() => removeBlock(b.id)} className="opacity-60 hover:opacity-100" aria-label="Eliminar bloque"><X className="h-3 w-3" /></button></div>)}
            {dayTasks.slice(0, viewMode === 'month' ? 1 : undefined).map(t => <div key={`task-${t.id}`} className={`rounded-lg px-2 py-1 text-[10px] ${t.done ? 'bg-stone-200 text-stone-500 line-through' : 'bg-amber-100 text-amber-900'}`}>Tarea · {t.title}</div>)}
          </div>}
        </div>; })}
      </div>
    </Panel>
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Próximos exámenes" description="Se actualiza desde Recordatorios y Mi UCLM.">{state.exams.filter(e => !e.completed && e.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0,5).length ? <div className="space-y-2">{state.exams.filter(e => !e.completed && e.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0,5).map(e => <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 p-3"><div><p className="text-sm font-bold text-stone-800">{e.subject}</p><p className="text-xs text-stone-500">{e.date} · {e.time || 'Hora pendiente'}</p></div><StatusPill tone="amber">Examen</StatusPill></div>)}</div> : <EmptyState text="No hay exámenes próximos registrados." />}</Panel>
      <Panel title="Objetivos de estudio" description="Tus planes de estudio ya guardados aparecen aquí como resumen.">{state.studyPlans.length ? <div className="space-y-2">{state.studyPlans.slice(0,5).map(p => <div key={p.id} className="rounded-xl bg-stone-50 p-3"><div className="flex justify-between gap-2"><strong className="text-sm text-stone-800">{p.subject}</strong><span className="text-xs text-stone-500">{p.completedTopics.length}/{p.totalTopics} temas</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, p.totalTopics ? p.completedTopics.length / p.totalTopics * 100 : 0)}%` }} /></div></div>)}</div> : <EmptyState text="Aún no hay planes de estudio. Crea uno desde Academia." />}</Panel>
    </div>
  </div>;
}

// 2. EVIDENCIA CIENTÍFICA — PICO, búsquedas enlazadas, referencias y lectura crítica.
const DATABASES = [
  { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=' , access: 'Público' },
  { name: 'Cochrane Library', url: 'https://www.cochranelibrary.com/search?searchBy=term&searchText=', access: 'Consulta según colección/licencia' },
  { name: 'CINAHL / EBSCO', url: 'https://search.ebscohost.com/', access: 'Licencia UCLM' },
  { name: 'Biblioteca UCLM', url: 'https://biblioteca.uclm.es/es/encuentra-informacion/Recursos/Basesdedatos', access: 'Acceso mixto' },
  { name: 'CUIDEN', url: 'https://cuiden.fundacionindex.com/', access: 'Público / funciones variables' },
  { name: 'ENFISPO', url: 'https://enfispo.es/', access: 'Público' },
  { name: 'GuíaSalud', url: 'https://portal.guiasalud.es/gpc/', access: 'Público' },
];
export function ScientificEvidenceView() {
  const { state, updateState } = useCampusStore();
  const [pico, setPico] = useState({ title: '', population: '', intervention: '', comparison: '', outcome: '' });
  const [searchExtras, setSearchExtras] = useState({ meshTerms: '', exactPhrase: '', excludeTerms: '' });
  const [queryOverride, setQueryOverride] = useState('');
  const [reference, setReference] = useState({ title: '', authors: '', year: String(new Date().getFullYear()), journal: '', doi: '', pmid: '', url: '', database: 'PubMed', summary: '', tags: '' });
  const [appraisalTarget, setAppraisalTarget] = useState('');
  const [appraisal, setAppraisal] = useState({ design: '', objective: '', sample: '', results: '', limitations: '', bias: '', applicability: '', confidence: 'No valorada' as CriticalAppraisal['confidence'] });
  const [filter, setFilter] = useState('');
  const splitTerms = (value: string) => value.split(';').map(term => term.trim()).filter(Boolean);
  const quoteTerm = (value: string) => `\"${value.replace(/\"/g, '')}\"`;
  const conceptGroups = [pico.population, pico.intervention, pico.comparison, pico.outcome]
    .map(value => splitTerms(value).map(quoteTerm))
    .filter(group => group.length > 0)
    .map(group => group.length > 1 ? `(${group.join(' OR ')})` : group[0]);
  const meshGroup = splitTerms(searchExtras.meshTerms).map(term => `${quoteTerm(term)}[MeSH Terms]`);
  const exclusionGroup = splitTerms(searchExtras.excludeTerms).map(quoteTerm);
  const generatedQueryParts = [...conceptGroups];
  if (meshGroup.length) generatedQueryParts.push(`(${meshGroup.join(' OR ')})`);
  if (searchExtras.exactPhrase.trim()) generatedQueryParts.push(quoteTerm(searchExtras.exactPhrase.trim()));
  let generatedSearchQuery = generatedQueryParts.join(' AND ');
  if (exclusionGroup.length) generatedSearchQuery += `${generatedSearchQuery ? ' NOT ' : 'NOT '}${exclusionGroup.length > 1 ? `(${exclusionGroup.join(' OR ')})` : exclusionGroup[0]}`;
  const searchQuery = queryOverride.trim() || generatedSearchQuery;
  const databaseSearchUrl = (name: string) => {
    const encoded = encodeURIComponent(searchQuery);
    if (name === 'PubMed') return `https://pubmed.ncbi.nlm.nih.gov/?term=${encoded}`;
    if (name === 'Cochrane Library') return `https://www.cochranelibrary.com/search?searchBy=term&searchText=${encoded}`;
    return DATABASES.find(db => db.name === name)?.url || '';
  };
  const savePico = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PICOQuestion = {
      ...pico,
      id: makeId('pico'),
      question: `${pico.population || '[Población]'}${pico.intervention ? ` · intervención: ${pico.intervention}` : ''}${pico.comparison ? ` · comparación: ${pico.comparison}` : ''}${pico.outcome ? ` · resultado: ${pico.outcome}` : ''}`,
      keywords: searchQuery,
      createdAt: todayLocal(),
    };
    updateState(prev => ({ ...prev, picoQuestions: [item, ...prev.picoQuestions] }));
  };
  const saveReference = (e: React.FormEvent) => { e.preventDefault(); if (!reference.title.trim()) return; const item: ScientificReference = { ...reference, id: makeId('ref'), consultedAt: todayLocal(), tags: reference.tags.split(',').map(t => t.trim()).filter(Boolean) }; updateState(prev => ({ ...prev, scientificReferences: [item, ...prev.scientificReferences] })); setReference({ title: '', authors: '', year: String(new Date().getFullYear()), journal: '', doi: '', pmid: '', url: '', database: 'PubMed', summary: '', tags: '' }); };
  const saveAppraisal = (e: React.FormEvent) => { e.preventDefault(); if (!appraisalTarget) return; const item: CriticalAppraisal = { ...appraisal, id: makeId('critical'), referenceId: appraisalTarget, createdAt: todayLocal() }; updateState(prev => ({ ...prev, criticalAppraisals: [item, ...prev.criticalAppraisals.filter(a => a.referenceId !== appraisalTarget)] })); setAppraisalTarget(''); };
  const exportRIS = () => { const lines = state.scientificReferences.flatMap(r => { const authors = r.authors.split(/\s*;\s*|\s+(?:and|y)\s+/i).map(a => a.trim()).filter(Boolean); return ['TY  - JOUR', `TI  - ${r.title}`, ...authors.map(author => `AU  - ${author}`), `PY  - ${r.year}`, ...(r.journal ? [`JO  - ${r.journal}`] : []), ...(r.doi ? [`DO  - ${r.doi}`] : []), ...(r.pmid ? [`AN  - ${r.pmid}`] : []), ...(r.url ? [`UR  - ${r.url}`] : []), 'ER  - ', '']; }); const blob = new Blob([lines.join('\n')], { type: 'application/x-research-info-systems;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'referencias-enfermeria.ris'; a.click(); URL.revokeObjectURL(url); };
  const filteredReferences = state.scientificReferences.filter(r => `${r.title} ${r.authors} ${r.tags.join(' ')}`.toLowerCase().includes(filter.toLowerCase()));
  return <div className="space-y-6">
    <PageHeading eyebrow="Aprender · Investigación" title="Buscador de evidencia científica" description="Formula preguntas PICO, construye búsquedas reproducibles, guarda referencias y registra la lectura crítica sin inventar resultados bibliográficos." icon={Library} />
    <Panel title="Asistente PICO" description="La herramienta ayuda a estructurar la pregunta; no decide por sí misma qué evidencia es válida.">
      <form onSubmit={savePico} className="grid gap-3 md:grid-cols-2">
        <label className="md:col-span-2"><span className={labelClass}>Título o tema de la pregunta</span><input className={inputClass} value={pico.title} onChange={e => setPico({ ...pico, title: e.target.value })} placeholder="Ej. Prevención de caídas en personas mayores" /></label>
        {[['population','P · Población / problema'],['intervention','I · Intervención'],['comparison','C · Comparación'],['outcome','O · Resultado']].map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><input className={inputClass} value={pico[key as keyof typeof pico]} onChange={e => setPico({ ...pico, [key]: e.target.value })} placeholder="Introduce términos breves" /></label>)}
        <div className="md:col-span-2 grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:grid-cols-2">
          <label><span className={labelClass}>Términos MeSH (separa sinónimos con punto y coma)</span><input className={inputClass} value={searchExtras.meshTerms} onChange={e => { setSearchExtras({ ...searchExtras, meshTerms: e.target.value }); setQueryOverride(''); }} placeholder="Ej. Falls; Accidental Falls" /></label>
          <label><span className={labelClass}>Frase exacta opcional</span><input className={inputClass} value={searchExtras.exactPhrase} onChange={e => { setSearchExtras({ ...searchExtras, exactPhrase: e.target.value }); setQueryOverride(''); }} placeholder="Ej. patient safety" /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Excluir términos (NOT; separa alternativas con punto y coma)</span><input className={inputClass} value={searchExtras.excludeTerms} onChange={e => { setSearchExtras({ ...searchExtras, excludeTerms: e.target.value }); setQueryOverride(''); }} placeholder="Ej. paediatrics; children" /></label>
          <div className="sm:col-span-2"><div className="mb-1 flex flex-wrap items-center justify-between gap-2"><span className={labelClass + ' mb-0'}>Estrategia editable (AND / OR / NOT y comillas)</span><button type="button" className="text-xs font-bold text-emerald-800 hover:underline" onClick={() => setQueryOverride('')}>Regenerar desde PICO</button></div><textarea className={inputClass + ' font-mono text-xs'} rows={3} value={searchQuery} onChange={e => setQueryOverride(e.target.value)} placeholder="La estrategia generada aparecerá aquí" /><p className="mt-1 text-[11px] text-stone-500">Los términos de cada concepto se combinan con OR; los conceptos PICO, con AND. Revisa y adapta la sintaxis a cada base de datos antes de ejecutar la búsqueda.</p></div>
        </div>
        <div className="md:col-span-2 rounded-xl bg-emerald-50 p-3"><p className="text-xs font-extrabold text-emerald-900">Buscar en bases de datos</p><div className="mt-3 flex flex-wrap gap-2">{DATABASES.slice(0,3).map(db => <a key={db.name} href={databaseSearchUrl(db.name)} target="_blank" rel="noreferrer" className={secondaryButton} onClick={e => { if (!searchQuery) e.preventDefault(); }}>{db.name} <ArrowUpRight className="h-3 w-3" /></a>)}<a href="https://meshb.nlm.nih.gov/search" target="_blank" rel="noreferrer" className={secondaryButton}>Buscador MeSH <ArrowUpRight className="h-3 w-3" /></a></div></div>
        <div className="flex flex-wrap gap-2 md:col-span-2"><button className={primaryButton} type="submit" disabled={!searchQuery.trim()}><Plus className="h-4 w-4" /> Guardar pregunta</button><button type="button" className={secondaryButton} onClick={() => setPico({ title: '', population: '', intervention: '', comparison: '', outcome: '' })}>Limpiar</button></div>
      </form>
      {state.picoQuestions.length > 0 && <div className="mt-4 space-y-2">{state.picoQuestions.slice(0,5).map(p => <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-stone-100 p-3"><div><p className="text-sm font-bold text-stone-800">{p.title || p.question}</p><p className="mt-1 text-xs text-stone-500">{p.question}</p></div><button className="text-stone-400 hover:text-rose-600" onClick={() => updateState(prev => ({ ...prev, picoQuestions: prev.picoQuestions.filter(x => x.id !== p.id) }))} aria-label="Eliminar pregunta"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
    </Panel>
    <Panel title="Fuentes de búsqueda" description="Enlaces oficiales. El acceso a recursos licenciados puede requerir autenticación UCLM.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{DATABASES.map(db => <a key={db.name} href={db.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3 transition hover:border-emerald-300 hover:bg-emerald-50/40"><div><p className="text-sm font-bold text-stone-800">{db.name}</p><p className="mt-1 text-[11px] text-stone-500">{db.access}</p></div><ExternalLink className="h-4 w-4 text-emerald-700" /></a>)}</div>
    </Panel>
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Guardar una referencia" description="Registra únicamente datos bibliográficos que hayas comprobado en la fuente original.">
        <form onSubmit={saveReference} className="space-y-3">
          <label><span className={labelClass}>Título</span><input className={inputClass} required value={reference.title} onChange={e => setReference({ ...reference, title: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Autores</span><input className={inputClass} value={reference.authors} onChange={e => setReference({ ...reference, authors: e.target.value })} /></label><label><span className={labelClass}>Año</span><input className={inputClass} value={reference.year} onChange={e => setReference({ ...reference, year: e.target.value })} /></label></div>
          <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Revista</span><input className={inputClass} value={reference.journal} onChange={e => setReference({ ...reference, journal: e.target.value })} /></label><label><span className={labelClass}>Base de datos</span><select className={inputClass} value={reference.database} onChange={e => setReference({ ...reference, database: e.target.value })}>{DATABASES.map(d => <option key={d.name}>{d.name}</option>)}</select></label></div>
          <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>DOI</span><input className={inputClass} value={reference.doi} onChange={e => setReference({ ...reference, doi: e.target.value })} /></label><label><span className={labelClass}>PMID</span><input className={inputClass} value={reference.pmid} onChange={e => setReference({ ...reference, pmid: e.target.value })} /></label></div>
          <label><span className={labelClass}>URL del artículo</span><input className={inputClass} type="url" value={reference.url} onChange={e => setReference({ ...reference, url: e.target.value })} /></label>
          <label><span className={labelClass}>Resumen personal</span><textarea className={inputClass} rows={2} value={reference.summary} onChange={e => setReference({ ...reference, summary: e.target.value })} /></label>
          <label><span className={labelClass}>Etiquetas (separadas por comas)</span><input className={inputClass} value={reference.tags} onChange={e => setReference({ ...reference, tags: e.target.value })} /></label>
          <button className={primaryButton} type="submit"><Plus className="h-4 w-4" /> Guardar referencia</button>
        </form>
      </Panel>
      <Panel title="Lectura crítica" description="La ficha organiza la revisión personal; no sustituye herramientas validadas ni la valoración metodológica de un docente.">
        <form onSubmit={saveAppraisal} className="space-y-3">
          <label><span className={labelClass}>Artículo</span><select className={inputClass} required value={appraisalTarget} onChange={e => setAppraisalTarget(e.target.value)}><option value="">Selecciona una referencia guardada</option>{state.scientificReferences.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
          {([['design','Diseño del estudio'],['objective','Objetivo'],['sample','Muestra y contexto'],['results','Resultados principales'],['limitations','Limitaciones'],['bias','Posibles sesgos'],['applicability','Aplicabilidad a la pregunta']] as const).map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><textarea className={inputClass} rows={2} value={appraisal[key]} onChange={e => setAppraisal({ ...appraisal, [key]: e.target.value })} /></label>)}
          <label><span className={labelClass}>Confianza personal (orientativa)</span><select className={inputClass} value={appraisal.confidence} onChange={e => setAppraisal({ ...appraisal, confidence: e.target.value as CriticalAppraisal['confidence'] })}><option>No valorada</option><option>Baja</option><option>Moderada</option><option>Alta</option></select></label>
          <button className={primaryButton} type="submit" disabled={!appraisalTarget}>Guardar lectura crítica</button>
        </form>
      </Panel>
    </div>
    <Panel title="Mi biblioteca de artículos" description="Las referencias pueden exportarse a Zotero en formato RIS." action={<button className={secondaryButton} onClick={exportRIS} disabled={!state.scientificReferences.length}><ArrowDownToLine className="h-4 w-4" /> Exportar RIS</button>}>
      <div className="mb-3"><input className={inputClass} placeholder="Buscar por título, autor o etiqueta..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
      {filteredReferences.length ? <div className="space-y-2">{filteredReferences.map(r => <div key={r.id} className="rounded-xl border border-stone-200 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><p className="font-bold text-stone-800">{r.title}</p><p className="mt-1 text-xs text-stone-500">{r.authors || 'Autores no registrados'} · {r.year} · {r.database}</p>{r.doi && <p className="mt-1 text-xs text-stone-500">DOI: {r.doi}</p>}</div><button onClick={() => updateState(prev => ({ ...prev, scientificReferences: prev.scientificReferences.filter(x => x.id !== r.id), criticalAppraisals: prev.criticalAppraisals.filter(x => x.referenceId !== r.id) }))} className="text-stone-400 hover:text-rose-600" aria-label="Eliminar referencia"><Trash2 className="h-4 w-4" /></button></div>{r.url && <a href={r.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">Abrir fuente <ExternalLink className="h-3 w-3" /></a>}{r.summary && <p className="mt-2 text-sm text-stone-600">{r.summary}</p>}{(() => { const savedAppraisal = state.criticalAppraisals.find(a => a.referenceId === r.id); return savedAppraisal ? <details className="mt-3 rounded-xl bg-emerald-50 p-3"><summary className="cursor-pointer text-xs font-extrabold text-emerald-900">Ver ficha de lectura crítica · {savedAppraisal.confidence}</summary><div className="mt-2 grid gap-2 sm:grid-cols-2">{([['Diseño', savedAppraisal.design], ['Objetivo', savedAppraisal.objective], ['Muestra', savedAppraisal.sample], ['Resultados', savedAppraisal.results], ['Limitaciones', savedAppraisal.limitations], ['Sesgos', savedAppraisal.bias], ['Aplicabilidad', savedAppraisal.applicability]] as const).filter(([, value]) => value).map(([label, value]) => <div key={label}><p className="text-[10px] font-extrabold uppercase text-emerald-800">{label}</p><p className="text-xs text-stone-700">{value}</p></div>)}</div><p className="mt-2 text-[10px] text-emerald-900">Valoración personal orientativa · {savedAppraisal.createdAt}</p></details> : null; })()}</div>)}</div> : <EmptyState text="Todavía no hay referencias guardadas." />}
    </Panel>
  </div>;
}

// 3. PASAPORTE DE PRÁCTICAS — diario sin datos identificativos y conexión a las competencias existentes.
export function PracticePassportView() {
  const { state, updateState } = useCampusStore();
  const [rotationForm, setRotationForm] = useState({ title: '', area: '', startDate: todayLocal(), endDate: '', objectives: '', hoursCompleted: 0 });
  const [entryForm, setEntryForm] = useState({ date: todayLocal(), rotationId: '', context: '', learned: '', difficulties: '', nextSteps: '', competencyId: '', privacyConfirmed: false });
  const [editingEntryId, setEditingEntryId] = useState('');
  const [gibbsForm, setGibbsForm] = useState({ date: todayLocal(), shiftContext: '', description: '', feelings: '', evaluation: '', analysis: '', conclusion: '', actionPlan: '' });
  const [editingGibbsId, setEditingGibbsId] = useState('');
  const [gibbsPrivacyConfirmed, setGibbsPrivacyConfirmed] = useState(false);
  const [showRotation, setShowRotation] = useState(false);
  const addRotation = (e: React.FormEvent) => { e.preventDefault(); const r: PracticeRotation = { ...rotationForm, id: makeId('rotation'), status: 'Planificada' }; updateState(prev => ({ ...prev, practiceRotations: [r, ...prev.practiceRotations] })); setShowRotation(false); setRotationForm({ title: '', area: '', startDate: todayLocal(), endDate: '', objectives: '', hoursCompleted: 0 }); };
  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.privacyConfirmed || !entryForm.learned.trim()) return;
    const entry: PracticeLearningEntry = { ...entryForm, id: editingEntryId || makeId('learning'), privacyConfirmed: true };
    updateState(prev => ({ ...prev, practiceLearningEntries: editingEntryId ? prev.practiceLearningEntries.map(item => item.id === editingEntryId ? entry : item) : [entry, ...prev.practiceLearningEntries] }));
    setEditingEntryId('');
    setEntryForm({ date: todayLocal(), rotationId: '', context: '', learned: '', difficulties: '', nextSteps: '', competencyId: '', privacyConfirmed: false });
  };
  const startEditEntry = (entry: PracticeLearningEntry) => {
    setEditingEntryId(entry.id);
    setEntryForm({ date: entry.date, rotationId: entry.rotationId, context: entry.context, learned: entry.learned, difficulties: entry.difficulties, nextSteps: entry.nextSteps, competencyId: entry.competencyId || '', privacyConfirmed: false });
  };
  const saveGibbs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gibbsPrivacyConfirmed || !gibbsForm.description.trim()) return;
    const reflection: GibbsReflection = { ...gibbsForm, id: editingGibbsId || makeId('reflection') };
    updateState(prev => ({ ...prev, reflections: editingGibbsId ? prev.reflections.map(item => item.id === editingGibbsId ? reflection : item) : [reflection, ...prev.reflections] }));
    setGibbsForm({ date: todayLocal(), shiftContext: '', description: '', feelings: '', evaluation: '', analysis: '', conclusion: '', actionPlan: '' });
    setEditingGibbsId(''); setGibbsPrivacyConfirmed(false);
  };
  const startEditGibbs = (reflection: GibbsReflection) => {
    setEditingGibbsId(reflection.id);
    setGibbsForm({ date: reflection.date, shiftContext: reflection.shiftContext, description: reflection.description, feelings: reflection.feelings, evaluation: reflection.evaluation, analysis: reflection.analysis, conclusion: reflection.conclusion, actionPlan: reflection.actionPlan });
    setGibbsPrivacyConfirmed(false);
  };
  const updateRotationStatus = (id: string, status: PracticeRotation['status']) => updateState(prev => ({ ...prev, practiceRotations: prev.practiceRotations.map(r => r.id === id ? { ...r, status } : r) }));
  const changeCompetency = (id: string, status: 'Pendiente' | 'Observada' | 'Practicada') => updateState(prev => ({ ...prev, competencies: prev.competencies.map(c => c.id === id && c.status !== 'Evaluada' ? { ...c, status, updatedAt: todayLocal() } : c) }));
  const exportReport = () => window.print();
  const total = state.competencies.length || 1;
  const evaluated = state.competencies.filter(c => c.status === 'Evaluada').length;
  const practiced = state.competencies.filter(c => c.status === 'Practicada').length;
  return <div className="space-y-6">
    <PageHeading eyebrow="Mis prácticas · Portfolio" title="Mi pasaporte de prácticas" description="Un portafolio personal para organizar rotaciones, competencias y reflexiones de aprendizaje. No sustituye la validación oficial del tutor." icon={ClipboardCheck} />
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-amber-800" /><div><p className="text-sm font-extrabold text-amber-950">Privacidad clínica</p><p className="mt-1 text-xs leading-relaxed text-amber-900">No introduzcas nombres, iniciales, fechas de nacimiento, números de historia, ubicaciones concretas, fotografías ni detalles que permitan identificar a pacientes. Registra únicamente tu aprendizaje desidentificado. La aplicación no es un sistema clínico ni un registro asistencial.</p></div></div></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[['Rotaciones', state.practiceRotations.length], ['Competencias', state.competencies.length], ['Practicadas', practiced], ['Evaluadas', evaluated]].map(([k,v]) => <div key={String(k)} className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs text-stone-500">{k}</p><p className="mt-1 text-2xl font-black text-stone-900">{v}</p></div>)}</div>
    <Panel title="Rotaciones" description="Crea un periodo por servicio o área formativa." action={<button className={primaryButton} onClick={() => setShowRotation(v => !v)}><Plus className="h-4 w-4" /> Nueva rotación</button>}>
      {showRotation && <form onSubmit={addRotation} className="mb-4 grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-2"><label><span className={labelClass}>Nombre</span><input required className={inputClass} value={rotationForm.title} onChange={e => setRotationForm({ ...rotationForm, title: e.target.value })} placeholder="Ej. Rotación de prácticas 1" /></label><label><span className={labelClass}>Área</span><input className={inputClass} value={rotationForm.area} onChange={e => setRotationForm({ ...rotationForm, area: e.target.value })} placeholder="Área o servicio (sin pacientes)" /></label><label><span className={labelClass}>Inicio</span><input type="date" required className={inputClass} value={rotationForm.startDate} onChange={e => setRotationForm({ ...rotationForm, startDate: e.target.value })} /></label><label><span className={labelClass}>Fin</span><input type="date" className={inputClass} value={rotationForm.endDate} onChange={e => setRotationForm({ ...rotationForm, endDate: e.target.value })} /></label><label><span className={labelClass}>Horas registradas manualmente (opcional)</span><input type="number" min="0" max="2000" step="0.5" className={inputClass} value={rotationForm.hoursCompleted} onChange={e => setRotationForm({ ...rotationForm, hoursCompleted: Number(e.target.value) })} /></label><label className="sm:col-span-2"><span className={labelClass}>Objetivos personales</span><textarea className={inputClass} rows={2} value={rotationForm.objectives} onChange={e => setRotationForm({ ...rotationForm, objectives: e.target.value })} /></label><div className="flex gap-2"><button className={primaryButton}>Guardar rotación</button><button type="button" className={secondaryButton} onClick={() => setShowRotation(false)}>Cancelar</button></div></form>}
      {state.practiceRotations.length ? <div className="grid gap-3 md:grid-cols-2">{state.practiceRotations.map(r => <div key={r.id} className="rounded-xl border border-stone-200 p-3"><div className="flex items-start justify-between gap-2"><div><p className="font-bold text-stone-800">{r.title}</p><p className="text-xs text-stone-500">{r.area || 'Área no especificada'} · {r.startDate} {r.endDate ? `– ${r.endDate}` : ''} · {r.hoursCompleted ?? 0} h registradas</p></div><button className="text-stone-400 hover:text-rose-600" aria-label="Eliminar rotación" onClick={() => updateState(prev => ({ ...prev, practiceRotations: prev.practiceRotations.filter(x => x.id !== r.id), practiceLearningEntries: prev.practiceLearningEntries.filter(x => x.rotationId !== r.id) }))}><Trash2 className="h-4 w-4" /></button></div>{r.objectives && <p className="my-2 text-xs text-stone-600">{r.objectives}</p>}<select className={inputClass} value={r.status} onChange={e => updateRotationStatus(r.id, e.target.value as PracticeRotation['status'])}><option>Planificada</option><option>En curso</option><option>Finalizada</option></select></div>)}</div> : <EmptyState text="Aún no has registrado rotaciones." />}
    </Panel>
    <Panel title="Competencias de aprendizaje" description="Se reutiliza el catálogo de competencias que ya existía en Prácticas 360. Solo el tutor puede hacer una validación académica oficial.">
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${((practiced + evaluated) / total) * 100}%` }} /></div><p className="mb-3 text-xs text-stone-500">{practiced + evaluated} de {state.competencies.length} competencias marcadas como practicadas o evaluadas por la estudiante.</p>
      <div className="max-h-[560px] space-y-2 overflow-y-auto">{state.competencies.map(c => <div key={c.id} className="rounded-xl border border-stone-100 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-bold text-stone-800">{c.title}</p><p className="text-xs text-stone-500">{c.category}{c.updatedAt ? ` · Actualizada: ${c.updatedAt}` : ''}</p></div><div className="flex items-center gap-2"><select className={`${inputClass} sm:max-w-52`} value={c.status} disabled={c.status === 'Evaluada'} onChange={e => changeCompetency(c.id, e.target.value as 'Pendiente' | 'Observada' | 'Practicada')}><option value="Pendiente">Pendiente</option><option value="Observada">Observada</option><option value="Practicada">Practicada con supervisión</option><option value="Evaluada" disabled>Evaluada · validación registrada</option></select></div></div>
        <details className="mt-2"><summary className="cursor-pointer text-xs font-bold text-emerald-800">Detalles de aprendizaje y seguimiento</summary><div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label><span className={labelClass}>Fecha de seguimiento</span><input type="date" className={inputClass} value={c.updatedAt || ''} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, updatedAt: e.target.value } : item) }))} /></label>
          <label><span className={labelClass}>Autoevaluación</span><select className={inputClass} value={c.selfAssessment || 'Por valorar'} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, selfAssessment: e.target.value as ClinicalCompetency['selfAssessment'] } : item) }))}><option>Por valorar</option><option>Necesito apoyo</option><option>En progreso</option><option>Con confianza</option></select></label>
          <label className="sm:col-span-2"><span className={labelClass}>Comentario personal de aprendizaje (sin datos de pacientes)</span><textarea rows={2} className={inputClass} value={c.observations || ''} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, observations: e.target.value } : item) }))} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Próximo objetivo</span><textarea rows={2} className={inputClass} value={c.nextGoal || ''} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, nextGoal: e.target.value } : item) }))} /></label>
          <label><span className={labelClass}>Tutor/a (si procede)</span><input className={inputClass} value={c.evaluatedBy || ''} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, evaluatedBy: e.target.value } : item) }))} /></label>
          <label><span className={labelClass}>Comentario del tutor/a (si procede)</span><textarea rows={2} className={inputClass} value={c.tutorFeedback || ''} onChange={e => updateState(prev => ({ ...prev, competencies: prev.competencies.map(item => item.id === c.id ? { ...item, tutorFeedback: e.target.value } : item) }))} /></label>
          {c.status === 'Evaluada' && <p className="sm:col-span-2 rounded-lg bg-sky-50 p-2 text-xs text-sky-900">Esta competencia figura como evaluada en los datos. La aplicación no valida ni modifica esa evaluación oficial.</p>}
        </div></details>
      </div>)}</div>
    </Panel>
    <Panel title="Diario de aprendizaje" description="Describe qué has aprendido, qué te ha costado y cuál será el siguiente objetivo. No documentes la atención a una persona concreta.">
      <form onSubmit={addEntry} className="grid gap-3 md:grid-cols-2"><label><span className={labelClass}>Fecha del aprendizaje</span><input type="date" required className={inputClass} value={entryForm.date} onChange={e => setEntryForm({ ...entryForm, date: e.target.value })} /></label><label className="md:col-span-1"><span className={labelClass}>Rotación relacionada (opcional)</span><select className={inputClass} value={entryForm.rotationId} onChange={e => setEntryForm({ ...entryForm, rotationId: e.target.value })}><option value="">Sin asignar</option>{state.practiceRotations.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label><label className="md:col-span-2"><span className={labelClass}>Contexto general de aprendizaje</span><input className={inputClass} value={entryForm.context} onChange={e => setEntryForm({ ...entryForm, context: e.target.value })} placeholder="Ej. observación de trabajo en equipo, sin describir pacientes" /></label><label><span className={labelClass}>Qué he aprendido</span><textarea required rows={3} className={inputClass} value={entryForm.learned} onChange={e => setEntryForm({ ...entryForm, learned: e.target.value })} /></label><label><span className={labelClass}>Qué me ha resultado difícil</span><textarea rows={3} className={inputClass} value={entryForm.difficulties} onChange={e => setEntryForm({ ...entryForm, difficulties: e.target.value })} /></label><label><span className={labelClass}>Qué quiero mejorar o practicar</span><textarea rows={2} className={inputClass} value={entryForm.nextSteps} onChange={e => setEntryForm({ ...entryForm, nextSteps: e.target.value })} /></label><label><span className={labelClass}>Competencia relacionada</span><select className={inputClass} value={entryForm.competencyId} onChange={e => setEntryForm({ ...entryForm, competencyId: e.target.value })}><option value="">Sin asignar</option>{state.competencies.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-950 md:col-span-2"><input type="checkbox" required checked={entryForm.privacyConfirmed} onChange={e => setEntryForm({ ...entryForm, privacyConfirmed: e.target.checked })} className="mt-0.5" /><span>Confirmo que este registro no contiene datos personales ni información identificable de pacientes.</span></label><div className="md:col-span-2 flex flex-wrap gap-2"><button className={primaryButton} type="submit"><Plus className="h-4 w-4" /> {editingEntryId ? 'Guardar cambios' : 'Guardar aprendizaje'}</button>{editingEntryId && <button type="button" className={secondaryButton} onClick={() => { setEditingEntryId(''); setEntryForm({ date: todayLocal(), rotationId: '', context: '', learned: '', difficulties: '', nextSteps: '', competencyId: '', privacyConfirmed: false }); }}>Cancelar edición</button>}</div></form>
      {state.practiceLearningEntries.length ? <div className="mt-4 space-y-2">{state.practiceLearningEntries.map(e => <div key={e.id} className="rounded-xl border border-stone-200 p-3"><div className="flex flex-wrap justify-between gap-2"><strong className="text-sm text-stone-800">{e.date} · {state.practiceRotations.find(r => r.id === e.rotationId)?.title || 'Aprendizaje personal'}</strong><div className="flex gap-2"><button type="button" aria-label="Editar entrada" className="text-xs font-bold text-emerald-800" onClick={() => startEditEntry(e)}>Editar</button><button aria-label="Eliminar entrada" className="text-stone-400 hover:text-rose-600" onClick={() => updateState(prev => ({ ...prev, practiceLearningEntries: prev.practiceLearningEntries.filter(x => x.id !== e.id) }))}><Trash2 className="h-4 w-4" /></button></div></div>{e.context && <p className="mt-1 text-xs text-stone-500">{e.context}</p>}<p className="mt-2 text-sm text-stone-700">{e.learned}</p>{e.difficulties && <p className="mt-1 text-xs text-stone-500">Dificultad: {e.difficulties}</p>}{e.nextSteps && <p className="mt-1 text-xs text-emerald-800">Siguiente objetivo: {e.nextSteps}</p>}</div>)}</div> : <div className="mt-4"><EmptyState text="Todavía no hay entradas en el diario." /></div>}
    </Panel>
    <Panel title="Reflexión de Gibbs" description="Registra y revisa tus seis pasos de reflexión. No incluyas detalles identificables de casos reales." action={<button className={secondaryButton + ' no-print'} onClick={exportReport}><FileText className="h-4 w-4" /> Imprimir informe</button>}>
      <form onSubmit={saveGibbs} className="mb-4 grid gap-3 rounded-xl bg-stone-50 p-3 md:grid-cols-2 no-print">
        <label><span className={labelClass}>Fecha</span><input required type="date" className={inputClass} value={gibbsForm.date} onChange={e => setGibbsForm({ ...gibbsForm, date: e.target.value })} /></label>
        <label><span className={labelClass}>Contexto general de aprendizaje</span><input className={inputClass} value={gibbsForm.shiftContext} onChange={e => setGibbsForm({ ...gibbsForm, shiftContext: e.target.value })} placeholder="Sin identificar pacientes ni unidades concretas" /></label>
        {([['description','1. Descripción · ¿Qué ocurrió?'],['feelings','2. Sentimientos · ¿Qué pensé o sentí?'],['evaluation','3. Evaluación · ¿Qué fue positivo o difícil?'],['analysis','4. Análisis · ¿Qué he aprendido?'],['conclusion','5. Conclusión · ¿Qué podría hacer de otra forma?'],['actionPlan','6. Plan de acción · ¿Qué haré para mejorar?']] as const).map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><textarea required={key === 'description'} rows={2} className={inputClass} value={gibbsForm[key]} onChange={e => setGibbsForm({ ...gibbsForm, [key]: e.target.value })} /></label>)}
        <label className="md:col-span-2 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-950"><input type="checkbox" required checked={gibbsPrivacyConfirmed} onChange={e => setGibbsPrivacyConfirmed(e.target.checked)} className="mt-0.5" /><span>Confirmo que la reflexión no contiene nombres, fechas de nacimiento, números de historia ni detalles que permitan identificar pacientes.</span></label>
        <div className="md:col-span-2 flex flex-wrap gap-2"><button className={primaryButton} type="submit"><Plus className="h-4 w-4" /> {editingGibbsId ? 'Guardar cambios' : 'Guardar reflexión'}</button>{editingGibbsId && <button type="button" className={secondaryButton} onClick={() => { setEditingGibbsId(''); setGibbsPrivacyConfirmed(false); setGibbsForm({ date: todayLocal(), shiftContext: '', description: '', feelings: '', evaluation: '', analysis: '', conclusion: '', actionPlan: '' }); }}>Cancelar edición</button>}</div>
      </form>
      <div className="space-y-2">{state.reflections.map(r => <div key={r.id} className="rounded-xl border border-stone-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-stone-800">Reflexión · {r.date}</p><p className="mt-1 text-xs text-stone-500">{r.shiftContext}</p></div><div className="flex items-center gap-2 no-print"><button type="button" className="text-xs font-bold text-emerald-800" onClick={() => startEditGibbs(r)}>Editar</button><button className="text-stone-400 hover:text-rose-600" onClick={() => updateState(prev => ({ ...prev, reflections: prev.reflections.filter(x => x.id !== r.id) }))} aria-label="Eliminar reflexión"><Trash2 className="h-4 w-4" /></button></div></div><div className="mt-2 grid gap-2 sm:grid-cols-2">{[['Descripción',r.description],['Sentimientos',r.feelings],['Evaluación',r.evaluation],['Análisis',r.analysis],['Conclusión',r.conclusion],['Plan de acción',r.actionPlan]].map(([k,v]) => <div key={k} className="rounded-lg bg-stone-50 p-2"><p className="text-[10px] font-extrabold uppercase text-stone-500">{k}</p><p className="mt-1 text-xs text-stone-700">{v}</p></div>)}</div></div>)}{!state.reflections.length && <EmptyState text="Las reflexiones que ya tienes en Prácticas 360 aparecerán aquí." />}</div>
    </Panel>
  </div>;
}

// 4. ECOE formativo: usa las 10 estaciones existentes, pero registra autoevaluación no oficial.
const ECOE_FALLBACK_OBJECTIVES = ['He revisado los objetivos de aprendizaje', 'He identificado dudas que debo consultar', 'He reflexionado sobre seguridad y comunicación', 'He preparado preguntas para comentar con el profesorado'];
export function ECOETrainerView() {
  const { state, updateState } = useCampusStore();
  const [mode, setMode] = useState<'rápido' | 'personalizado' | 'simulacro'>('rápido');
  const [level, setLevel] = useState('Todos');
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [position, setPosition] = useState(0);
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [active, setActive] = useState(false);
  const available = ECOE_STATIONS.filter(s => level === 'Todos' || s.level === level);
  const current = ECOE_STATIONS.find(s => s.id === sessionIds[position]);
  const objectiveItems = current?.learningObjectives.length ? current.learningObjectives : ECOE_FALLBACK_OBJECTIVES;
  const start = () => { const pool = [...available].sort(() => Math.random() - 0.5); const count = mode === 'rápido' ? 1 : mode === 'personalizado' ? Math.min(3, pool.length) : pool.length; setSessionIds(pool.slice(0, count).map(x => x.id)); setPosition(0); setChecked([]); setNotes(''); setActive(true); };
  const saveAndNext = () => { if (!current) return; const score = checked.length; const result: EcoeTrainingResult = { id: makeId('ecoe-session'), stationId: current.id, date: todayLocal(), score, maxScore: objectiveItems.length, reviewedItems: checked.length, totalItems: objectiveItems.length, criticalIssues: [], improvementNotes: notes }; updateState(prev => ({ ...prev, ecoeTrainingResults: [result, ...prev.ecoeTrainingResults] })); if (position + 1 < sessionIds.length) { setPosition(v => v + 1); setChecked([]); setNotes(''); } else { setActive(false); } };
  const deleteResult = (id: string) => updateState(prev => ({ ...prev, ecoeTrainingResults: prev.ecoeTrainingResults.filter(r => r.id !== id) }));
  return <div className="space-y-6">
    <PageHeading eyebrow="Entrenar · Simulación" title="Entrenador ECOE" description="Entrenamiento de autoevaluación basado en las diez estaciones ya incorporadas. No certifica competencias ni reemplaza la práctica supervisada ni las rúbricas oficiales." icon={ClipboardCheck} />
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><strong>Uso educativo:</strong> esta herramienta registra tu preparación y reflexión. Para aprender y practicar procedimientos clínicos, sigue siempre el material docente, la supervisión y los protocolos de tu centro.</div>
    {!active ? <Panel title="Preparar sesión" description="Selecciona el formato y el nivel del conjunto de estaciones.">
      <div className="grid gap-3 sm:grid-cols-3">{(['rápido','personalizado','simulacro'] as const).map(m => <button key={m} onClick={() => setMode(m)} className={`rounded-xl border p-4 text-left ${mode === m ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 bg-white'}`}><p className="font-extrabold capitalize text-stone-800">{m}</p><p className="mt-1 text-xs text-stone-500">{m === 'rápido' ? 'Una estación para repasar.' : m === 'personalizado' ? 'Hasta tres estaciones.' : 'Todas las estaciones del catálogo.'}</p></button>)}</div>
      <div className="mt-4 flex flex-wrap items-end gap-3"><label className="min-w-48 flex-1"><span className={labelClass}>Nivel</span><select className={inputClass} value={level} onChange={e => setLevel(e.target.value)}><option>Todos</option><option>Básico</option><option>Intermedio</option><option>Avanzado</option></select></label><button className={primaryButton} onClick={start} disabled={!available.length}><Sparkles className="h-4 w-4" /> Iniciar sesión</button></div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">{available.map(s => <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 p-3"><div><p className="text-sm font-bold text-stone-800">{s.number}. {s.title}</p><p className="text-xs text-stone-500">{s.level} · {s.timeLimitMinutes} min de referencia</p></div><StatusPill>{state.ecoeTrainingResults.filter(r => r.stationId === s.id).length} repasos</StatusPill></div>)}</div>
    </Panel> : current ? <Panel title={`Estación ${position + 1} de ${sessionIds.length}`} description={`${current.number}. ${current.title} · ${current.level}`} action={<button className={secondaryButton} onClick={() => setActive(false)}><X className="h-4 w-4" /> Salir</button>}>
      <div className="mb-4 rounded-xl bg-stone-50 p-3"><p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Objetivos de aprendizaje de esta estación</p><p className="mt-1 text-sm text-stone-700">Marca los objetivos que has revisado en el material docente. La lista organiza el estudio; no es una rúbrica oficial ni una autorización para realizar procedimientos.</p></div>
      <p className="mb-3 text-sm font-bold text-stone-800">Objetivos revisados</p><div className="space-y-2">{objectiveItems.map(item => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 p-3 text-sm text-stone-700"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" checked={checked.includes(item)} onChange={e => setChecked(prev => e.target.checked ? [...prev, item] : prev.filter(x => x !== item))} /><span>{item}</span></label>)}</div>
      <label className="mt-4 block"><span className={labelClass}>¿Qué debo revisar o comentar con mi tutor/a?</span><textarea className={inputClass} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anota conceptos o dudas de aprendizaje, sin información de pacientes." /></label>
      <div className="mt-4 flex justify-between gap-2"><span className="text-xs text-stone-500">{checked.length} de {objectiveItems.length} objetivos revisados</span><button className={primaryButton} onClick={saveAndNext}>Guardar y continuar <ChevronRight className="h-4 w-4" /></button></div>
    </Panel> : null}
    <Panel title="Historial de entrenamiento" description="Indicadores personales de revisión, no resultados oficiales de ECOE.">
      {state.ecoeTrainingResults.length ? <div className="space-y-2">{state.ecoeTrainingResults.slice(0,20).map(r => { const station = ECOE_STATIONS.find(s => s.id === r.stationId); return <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-stone-200 p-3"><div><p className="text-sm font-bold text-stone-800">{station?.title || r.stationId}</p><p className="text-xs text-stone-500">{r.date} · Autoevaluación: {r.score}/{r.maxScore}</p>{r.improvementNotes && <p className="mt-1 text-xs text-stone-600">{r.improvementNotes}</p>}</div><button className="text-stone-400 hover:text-rose-600" onClick={() => deleteResult(r.id)} aria-label="Eliminar resultado"><Trash2 className="h-4 w-4" /></button></div>; })}</div> : <EmptyState text="Cuando finalices tu primera sesión, el resultado aparecerá aquí." />}
    </Panel>
  </div>;
}

// 5. CENTRO DE FUENTES — fuentes semilla marcadas como pendientes hasta revisión explícita.
const DEFAULT_SOURCES: ClinicalSourceRecord[] = [
  { id: 'src-uclm-plan', name: 'Plan de estudios y guías docentes de Enfermería (Toledo)', organization: 'Universidad de Castilla-La Mancha', url: 'https://www.uclm.es/toledo/fafeto/estudios/gradoenfermeria', documentType: 'Plan académico oficial', publishedAt: '', version: 'Curso vigente; comprobar guías por curso', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: 'Consultar condiciones UCLM', reviewer: '', topics: 'Plan de estudios, ECTS, guías docentes', notes: 'El plan mostrado debe volver a comprobarse cada curso académico.' },
  { id: 'src-erc-2025', name: 'Guidelines 2025', organization: 'European Resuscitation Council', url: 'https://www.erc.edu/science-research/guidelines/guidelines-2025', documentType: 'Guía de práctica / educación', publishedAt: '2025', version: '2025', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: 'Consultar avisos y condiciones de descarga/reutilización', reviewer: '', topics: 'Resucitación, educación y soporte vital', notes: 'La revisión del registro no autoriza a reproducir materiales protegidos ni sustituye la adaptación docente local.' },
  { id: 'src-guiasalud', name: 'Catálogo de Guías de Práctica Clínica', organization: 'GuíaSalud / Sistema Nacional de Salud', url: 'https://portal.guiasalud.es/gpc/', documentType: 'Repositorio de guías', publishedAt: '', version: 'Consultar versión por cada guía', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: 'Consultar licencia de cada documento', reviewer: '', topics: 'Guías de práctica clínica', notes: 'Registrar fecha y versión en cada guía concreta.' },
  { id: 'src-uclm-library', name: 'Bases de datos de la Biblioteca UCLM', organization: 'Biblioteca UCLM', url: 'https://biblioteca.uclm.es/es/encuentra-informacion/Recursos/Basesdedatos', documentType: 'Catálogo académico', publishedAt: '', version: 'Catálogo web', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: 'Acceso mixto: libre y licencia universitaria', reviewer: '', topics: 'CINAHL, Enferteca, CUIDEN, ENFISPO y otras bases', notes: 'Comprobar la licencia concreta y el acceso remoto antes de usar un recurso.' },
  { id: 'src-pubmed', name: 'PubMed', organization: 'National Library of Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/', documentType: 'Base de datos bibliográfica', publishedAt: '', version: 'Servicio en línea', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: 'Búsqueda pública; el texto completo puede tener restricciones', reviewer: '', topics: 'Literatura biomédica', notes: 'Una referencia indexada no equivale por sí sola a evidencia de alta calidad.' },
];
export function ClinicalSourcesView() {
  const { state, updateState } = useCampusStore();
  const records = state.clinicalSources.length ? state.clinicalSources : DEFAULT_SOURCES;
  const [filter, setFilter] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', organization: '', url: '', documentType: '', publishedAt: '', version: '', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión' as ClinicalSourceRecord['status'], license: '', reviewer: '', topics: '', notes: '' });
  const persistDefaultsIfNeeded = () => { if (!state.clinicalSources.length) updateState(prev => ({ ...prev, clinicalSources: DEFAULT_SOURCES })); };
  const save = (e: React.FormEvent) => { e.preventDefault(); const r: ClinicalSourceRecord = { ...form, id: makeId('source') }; updateState(prev => ({ ...prev, clinicalSources: [...(prev.clinicalSources.length ? prev.clinicalSources : DEFAULT_SOURCES), r] })); setShowForm(false); setForm({ name: '', organization: '', url: '', documentType: '', publishedAt: '', version: '', lastCheckedAt: '', nextReviewAt: '', status: 'Pendiente de revisión', license: '', reviewer: '', topics: '', notes: '' }); };
  const changeStatus = (id: string, status: ClinicalSourceRecord['status']) => {
    const current = records.find(x => x.id === id);
    if (status === 'Verificada' && (!current?.reviewer.trim() || !current?.documentType.trim() || !current?.version.trim() || !current?.license.trim())) {
      window.alert('Para marcarla como verificada, completa la persona responsable, el documento concreto, la versión y las condiciones de uso. Comprueba además el enlace y la fecha de publicación cuando esté disponible.');
      return;
    }
    persistDefaultsIfNeeded();
    updateState(prev => ({ ...prev, clinicalSources: (prev.clinicalSources.length ? prev.clinicalSources : DEFAULT_SOURCES).map(x => x.id === id ? { ...x, status, lastCheckedAt: status === 'Verificada' ? todayLocal() : x.lastCheckedAt } : x) }));
  };
  const updateReview = (id: string, nextReviewAt: string) => { persistDefaultsIfNeeded(); updateState(prev => ({ ...prev, clinicalSources: (prev.clinicalSources.length ? prev.clinicalSources : DEFAULT_SOURCES).map(x => x.id === id ? { ...x, nextReviewAt } : x) })); };
  const updateReviewer = (id: string, reviewer: string) => { persistDefaultsIfNeeded(); updateState(prev => ({ ...prev, clinicalSources: (prev.clinicalSources.length ? prev.clinicalSources : DEFAULT_SOURCES).map(x => x.id === id ? { ...x, reviewer } : x) })); };
  const deleteSource = (id: string) => {
    const source = records.find(item => item.id === id);
    if (!source || !window.confirm(`¿Eliminar el registro de fuente “${source.name}”? No se borrará el documento original.`)) return;
    updateState(prev => ({ ...prev, clinicalSources: (prev.clinicalSources.length ? prev.clinicalSources : DEFAULT_SOURCES).filter(item => item.id !== id) }));
  };
  const visible = records.filter(r => filter === 'Todos' || r.status === filter);
  const dueCount = records.filter(r => r.nextReviewAt && r.nextReviewAt <= todayLocal() && r.status !== 'Retirada' && r.status !== 'Sustituida').length;
  return <div className="space-y-6">
    <PageHeading eyebrow="Entrenar · Fuentes y calidad" title="Centro de recursos clínicos verificados" description="Registro central de procedencia, versión, licencia y revisión de fuentes. Una fuente pendiente no debe presentarse como vigente o validada." icon={ShieldCheck} />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[['Fuentes registradas', records.length], ['Verificadas', records.filter(r => r.status === 'Verificada').length], ['Pendientes', records.filter(r => r.status === 'Pendiente de revisión').length], ['Revisión vencida', dueCount]].map(([k,v]) => <div key={String(k)} className="rounded-2xl border border-stone-200 bg-white p-4"><p className="text-xs text-stone-500">{k}</p><p className="mt-1 text-2xl font-black text-stone-900">{v}</p></div>)}</div>
    <Panel title="Registro de fuentes" description="Los registros iniciales no sustituyen la revisión de cada guía o documento concreto." action={<button className={primaryButton} onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> Nueva fuente</button>}>
      {showForm && <form onSubmit={save} className="mb-4 grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-2"><label><span className={labelClass}>Nombre</span><input required className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label><span className={labelClass}>Organismo</span><input className={inputClass} value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} /></label><label className="sm:col-span-2"><span className={labelClass}>URL oficial</span><input required type="url" className={inputClass} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></label><label><span className={labelClass}>Tipo de documento</span><input className={inputClass} value={form.documentType} onChange={e => setForm({ ...form, documentType: e.target.value })} /></label><label><span className={labelClass}>Versión</span><input className={inputClass} value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} /></label><label><span className={labelClass}>Fecha de publicación</span><input className={inputClass} value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} /></label><label><span className={labelClass}>Próxima revisión</span><input type="date" className={inputClass} value={form.nextReviewAt} onChange={e => setForm({ ...form, nextReviewAt: e.target.value })} /></label><label><span className={labelClass}>Licencia / acceso</span><input className={inputClass} value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} /></label><label><span className={labelClass}>Persona responsable de revisar</span><input className={inputClass} value={form.reviewer} onChange={e => setForm({ ...form, reviewer: e.target.value })} placeholder="Nombre o rol, si procede" /></label><label><span className={labelClass}>Temas</span><input className={inputClass} value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })} /></label><label className="sm:col-span-2"><span className={labelClass}>Notas</span><textarea className={inputClass} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label><div className="flex gap-2"><button className={primaryButton}>Guardar fuente</button><button type="button" className={secondaryButton} onClick={() => setShowForm(false)}>Cancelar</button></div></form>}
      <div className="mb-3 flex flex-wrap gap-2">{['Todos','Pendiente de revisión','Verificada','Necesita revisión','Sustituida','Retirada'].map(s => <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === s ? 'bg-[#365e45] text-white' : 'bg-stone-100 text-stone-600'}`}>{s}</button>)}</div>
      <div className="space-y-3">{visible.map(r => (
        <div key={r.id} className="rounded-xl border border-stone-200 p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-extrabold text-stone-800">{r.name}</p>
              <p className="text-xs text-stone-500">{r.organization} · {r.documentType || 'Tipo de documento pendiente'}</p>
              <a href={r.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">Abrir fuente oficial <ExternalLink className="h-3 w-3" /></a>
            </div>
            <div className="flex items-center gap-2">
              <select className={`${inputClass} sm:max-w-52`} value={r.status} onChange={e => changeStatus(r.id, e.target.value as ClinicalSourceRecord['status'])}>
                <option>Pendiente de revisión</option><option>Verificada</option><option>Necesita revisión</option><option>Sustituida</option><option>Retirada</option>
              </select>
              <button type="button" className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-700" onClick={() => deleteSource(r.id)} aria-label={`Eliminar fuente ${r.name}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div><span className="font-bold text-stone-500">Versión:</span> {r.version || 'No registrada'}</div>
            <div><span className="font-bold text-stone-500">Publicación:</span> {r.publishedAt || 'No registrada'}</div>
            <div><span className="font-bold text-stone-500">Última comprobación:</span> {r.lastCheckedAt || 'Pendiente'}</div>
            <label className="text-xs font-bold text-stone-500">Responsable de revisión <input value={r.reviewer} onChange={e => updateReviewer(r.id, e.target.value)} placeholder="Persona o rol responsable" className="mt-1 w-full rounded-lg border border-stone-200 px-2 py-1 text-xs font-normal text-stone-800" /></label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="text-xs font-bold text-stone-500">Próxima revisión <input type="date" value={r.nextReviewAt} onChange={e => updateReview(r.id, e.target.value)} className="ml-2 rounded-lg border border-stone-200 px-2 py-1 text-xs" /></label>
            {r.license && <StatusPill>{r.license}</StatusPill>}
          </div>
          {r.notes && <p className="mt-2 text-xs text-stone-600">{r.notes}</p>}
          {r.status === 'Pendiente de revisión' && <p className="mt-2 text-[11px] font-semibold text-amber-700">No utilizar como contenido clínico validado hasta comprobar documento, versión, fecha y licencia.</p>}
        </div>
      ))}{!visible.length && <EmptyState text="No hay fuentes en este filtro." />}</div>
    </Panel>
  </div>;
}

// 6. TOLEDO EN MI BOLSILLO — enlaces verificados y destinos configurables, sin GPS persistente.
const TOLEDO_LINKS = [
  { name: 'Yurni · transporte urbano', description: 'Consulta rutas y servicios municipales desde la fuente del operador.', url: 'https://www.yurni.es/', icon: Bus },
  { name: 'UCLM · Campus Toledo', description: 'Información académica y servicios universitarios.', url: 'https://www.uclm.es/toledo/fafeto/estudios/gradoenfermeria', icon: GraduationCap },
  { name: 'SOAPP · orientación UCLM', description: 'Servicio gratuito de orientación psicológica y psicopedagógica para la comunidad universitaria.', url: 'https://www.uclm.es/misiones/lauclm/campus/vidacampus/soapp/cita', icon: HeartHandshake },
  { name: 'SOAPP Toledo · contacto', description: 'Correo de contacto publicado por la UCLM para el campus de Toledo.', url: 'mailto:soapp.to@uclm.es', icon: UserRound },
  { name: 'Mi Salud Digital · SESCAM', description: 'Acceso oficial. El módulo de cita de Atención Primaria requiere tarjeta sanitaria del SESCAM vigente y CIP; estudiar en Toledo no garantiza este acceso.', url: 'https://sescam.jccm.es/misaluddigital/#/app/inicio', icon: HeartHandshake },
  { name: 'Renfe', description: 'Consulta horarios, tarifas y avisos ferroviarios.', url: 'https://www.renfe.com/es/es', icon: Train },
  { name: 'ALSA', description: 'Consulta trayectos y horarios interurbanos.', url: 'https://www.alsa.es/', icon: Bus },
  { name: 'AlertCops', description: 'Servicio oficial de seguridad ciudadana. En emergencias sanitarias, llama al 112.', url: 'https://alertcops.ses.mir.es/publico/alertcops/', icon: ShieldCheck },
  { name: 'Emergencias 112', description: 'Número europeo de emergencias.', url: 'tel:112', icon: AlertCircle },
];
export function ToledoPocketView() {
  const { state, updateState } = useCampusStore();
  const [form, setForm] = useState({ name: '', category: 'Universidad' as DestinationShortcut['category'], address: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [departurePlan, setDeparturePlan] = useState({ destination: '', date: todayLocal(), arrivalTime: '08:45', travelMinutes: 25, marginMinutes: 15 });
  const departureTime = (() => {
    if (!departurePlan.date || !departurePlan.arrivalTime) return '';
    const arrival = new Date(`${departurePlan.date}T${departurePlan.arrivalTime}:00`);
    if (Number.isNaN(arrival.getTime())) return '';
    arrival.setMinutes(arrival.getMinutes() - Math.max(0, departurePlan.travelMinutes) - Math.max(0, departurePlan.marginMinutes));
    return `${String(arrival.getHours()).padStart(2, '0')}:${String(arrival.getMinutes()).padStart(2, '0')}`;
  })();
  const saveDepartureBlock = () => {
    if (!departurePlan.destination.trim() || !departureTime) return;
    const block: StudyBlock = {
      id: makeId('departure'), title: `Salida hacia ${departurePlan.destination.trim()}`, subject: '',
      date: departurePlan.date, startTime: departureTime, durationMinutes: 5, kind: 'Personal', done: false,
      notes: `Llegada prevista: ${departurePlan.arrivalTime}. Trayecto estimado introducido manualmente: ${departurePlan.travelMinutes} min; margen: ${departurePlan.marginMinutes} min. Confirma el transporte con el operador oficial.`,
    };
    updateState(prev => ({ ...prev, studyBlocks: [block, ...prev.studyBlocks] }));
    window.alert('Se ha añadido un bloque de salida a Mi Semana Inteligente. No es una notificación push ni una estimación de tráfico en tiempo real.');
  };
  const addDestination = (e: React.FormEvent) => { e.preventDefault(); const item: DestinationShortcut = { ...form, id: makeId('destination') }; updateState(prev => ({ ...prev, destinationShortcuts: [item, ...prev.destinationShortcuts] })); setForm({ name: '', category: 'Universidad', address: '', notes: '' }); setShowForm(false); };
  const checklistPresets = [
    { title: 'Antes de ir a clase', items: ['Tarjeta universitaria', 'Material de la asignatura', 'Cargador o batería', 'Agua y algo para comer'] },
    { title: 'Antes de prácticas', items: ['Uniforme según las indicaciones del centro', 'Identificación requerida por el centro', 'Material autorizado por el tutor', 'Revisar horario y destino'] },
    { title: 'Antes de un viaje', items: ['Billete o reserva', 'Documentación necesaria', 'Teléfono y cargador', 'Comprobar avisos del operador'] },
  ];
  const checked = Object.entries(state.toledoChecklist).filter(([, value]) => value).map(([key]) => key);
  const toggleChecklistItem = (key: string, active: boolean) => updateState(prev => ({ ...prev, toledoChecklist: { ...prev.toledoChecklist, [key]: active } }));
  return <div className="space-y-6">
    <PageHeading eyebrow="Mi vida en Toledo · Movilidad" title="Toledo en mi bolsillo" description="Accesos a transporte, universidad y servicios de apoyo, más destinos favoritos que tú configuras. No rastrea ni guarda tu ubicación." icon={MapPin} />
    <Panel title="Servicios útiles" description="Abre cada servicio en su página oficial para consultar la información más reciente.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{TOLEDO_LINKS.map(link => { const Icon = link.icon; return <a key={link.name} href={link.url} target={link.url.startsWith('tel:') || link.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className="flex min-h-32 flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"><div className="flex items-center justify-between"><span className="rounded-xl bg-[#e8f0e8] p-2 text-[#365e45]"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-stone-400" /></div><div><p className="mt-3 text-sm font-extrabold text-stone-800">{link.name}</p><p className="mt-1 text-xs leading-relaxed text-stone-500">{link.description}</p></div></a>; })}</div>
    </Panel>
    <Panel title="Mis destinos favoritos" description="Añade los lugares que utilizas. La dirección solo se guarda cuando tú la introduces.">
      <button className={primaryButton + ' mb-3'} onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> Añadir destino</button>
      {showForm && <form onSubmit={addDestination} className="mb-4 grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-2"><label><span className={labelClass}>Nombre</span><input required className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej. Campus Fábrica de Armas" /></label><label><span className={labelClass}>Categoría</span><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as DestinationShortcut['category'] })}><option>Universidad</option><option>Transporte</option><option>Prácticas</option><option>Personal</option></select></label><label className="sm:col-span-2"><span className={labelClass}>Dirección o nombre del lugar</span><input className={inputClass} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Introduce una dirección o lugar público" /></label><label className="sm:col-span-2"><span className={labelClass}>Notas</span><input className={inputClass} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label><div className="flex gap-2"><button className={primaryButton}>Guardar destino</button><button type="button" className={secondaryButton} onClick={() => setShowForm(false)}>Cancelar</button></div></form>}
      {state.destinationShortcuts.length ? <div className="grid gap-2 md:grid-cols-2">{state.destinationShortcuts.map(d => <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3"><div className="min-w-0"><p className="text-sm font-bold text-stone-800">{d.name}</p><p className="text-xs text-stone-500">{d.category} · {d.address || 'Sin dirección'}</p>{d.notes && <p className="text-xs text-stone-500">{d.notes}</p>}</div><div className="flex shrink-0 gap-2"><a className={secondaryButton} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address || d.name + ', Toledo')}`} target="_blank" rel="noreferrer" title="Abrir mapa"><MapPin className="h-4 w-4" /></a><button className="text-stone-400 hover:text-rose-600" onClick={() => updateState(prev => ({ ...prev, destinationShortcuts: prev.destinationShortcuts.filter(x => x.id !== d.id) }))} aria-label="Eliminar destino"><Trash2 className="h-4 w-4" /></button></div></div>)}</div> : <EmptyState text="Todavía no has guardado destinos." />}
    </Panel>
    <Panel title="Calculador de hora de salida" description="Introduce manualmente el tiempo estimado del trayecto. No consulta tráfico ni horarios en directo; al guardar, crea un bloque personal en Mi Semana Inteligente.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="sm:col-span-2 lg:col-span-1"><span className={labelClass}>Destino</span><input list="toledo-destinations" className={inputClass} value={departurePlan.destination} onChange={e => setDeparturePlan({ ...departurePlan, destination: e.target.value })} placeholder="Campus UCLM" /><datalist id="toledo-destinations">{state.destinationShortcuts.map(d => <option key={d.id} value={d.name} />)}</datalist></label>
        <label><span className={labelClass}>Fecha</span><input type="date" className={inputClass} value={departurePlan.date} onChange={e => setDeparturePlan({ ...departurePlan, date: e.target.value })} /></label>
        <label><span className={labelClass}>Hora de llegada</span><input type="time" className={inputClass} value={departurePlan.arrivalTime} onChange={e => setDeparturePlan({ ...departurePlan, arrivalTime: e.target.value })} /></label>
        <label><span className={labelClass}>Trayecto estimado (min)</span><input type="number" min="0" max="600" className={inputClass} value={departurePlan.travelMinutes} onChange={e => setDeparturePlan({ ...departurePlan, travelMinutes: Number(e.target.value) })} /></label>
        <label><span className={labelClass}>Margen (min)</span><input type="number" min="0" max="180" className={inputClass} value={departurePlan.marginMinutes} onChange={e => setDeparturePlan({ ...departurePlan, marginMinutes: Number(e.target.value) })} /></label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3"><div><p className="text-xs font-bold text-emerald-900">Hora de salida calculada</p><p className="text-2xl font-black text-emerald-950">{departureTime || '—'}</p><p className="text-[11px] text-emerald-900">Hora de llegada menos trayecto y margen introducidos.</p></div><button type="button" className={primaryButton} disabled={!departurePlan.destination.trim() || !departureTime} onClick={saveDepartureBlock}><CalendarClock className="h-4 w-4" /> Añadir a Mi Semana</button></div>
    </Panel>
    <Panel title="Listas rápidas" description="Marca los elementos antes de salir. La lista se reinicia al desmarcar los elementos manualmente.">
      <div className="grid gap-3 md:grid-cols-3">{checklistPresets.map(p => <div key={p.title} className="rounded-xl border border-stone-200 p-3"><p className="mb-2 text-sm font-extrabold text-stone-800">{p.title}</p>{p.items.map(item => <label key={item} className="flex items-start gap-2 py-1.5 text-xs text-stone-600"><input type="checkbox" className="mt-0.5 accent-emerald-700" checked={checked.includes(`${p.title}:${item}`)} onChange={e => toggleChecklistItem(`${p.title}:${item}`, e.target.checked)} />{item}</label>)}</div>)}</div>
    </Panel>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><strong>Seguridad:</strong> los horarios y tiempos de viaje pueden cambiar. Confirma siempre la información con el operador oficial. No utilices esta herramienta para compartir tu localización en tiempo real. En una emergencia, utiliza los servicios oficiales; para asistencia sanitaria urgente, llama al 112.</div>
  </div>;
}

// 7. GESTOR TFG — gestor de proyecto y entregas, sin generar bibliografía ni contenido académico ficticio.
export function TFGManagerView() {
  const { state, updateState } = useCampusStore();
  const [form, setForm] = useState({ title: '', area: '', tutor: '', startDate: todayLocal(), dueDate: '', description: '', status: 'Idea' as TFGProject['status'], question: '', objectives: '', keywords: '', inclusionCriteria: '', exclusionCriteria: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [milestoneForm, setMilestoneForm] = useState({ title: '', dueDate: '', notes: '' });
  const [meetingForm, setMeetingForm] = useState({ date: todayLocal(), topic: '', actions: '', nextMeeting: '' });
  const createProject = (e: React.FormEvent) => {
    e.preventDefault();
    const p: TFGProject = { ...form, id: makeId('tfg'), referenceIds: [] };
    const suggestedMilestones = ['Definir tema y alcance', 'Formular pregunta de investigación', 'Diseñar estrategia de búsqueda', 'Revisar bibliografía', 'Preparar propuesta', 'Desarrollar metodología', 'Analizar y organizar resultados', 'Redactar discusión y conclusiones', 'Revisar formato y referencias', 'Preparar defensa'];
    const milestones: TFGMilestone[] = suggestedMilestones.map((title, index) => ({ id: makeId(`tfg-step-${index}`), projectId: p.id, title, dueDate: '', completed: false, notes: 'Fase orientativa: adaptar a la guía docente y calendario oficiales de la convocatoria.' }));
    updateState(prev => ({ ...prev, tfgProjects: [p, ...prev.tfgProjects], tfgMilestones: [...milestones, ...prev.tfgMilestones] }));
    setSelectedProject(p.id); setShowForm(false);
  };
  const project = state.tfgProjects.find(p => p.id === selectedProject) || state.tfgProjects[0];
  const addMilestone = (e: React.FormEvent) => { e.preventDefault(); if (!project) return; const m: TFGMilestone = { ...milestoneForm, id: makeId('tfg-step'), projectId: project.id, completed: false }; updateState(prev => ({ ...prev, tfgMilestones: [m, ...prev.tfgMilestones] })); setMilestoneForm({ title: '', dueDate: '', notes: '' }); };
  const addMeeting = (e: React.FormEvent) => { e.preventDefault(); if (!project) return; const m: TFGMeeting = { ...meetingForm, id: makeId('tfg-meeting'), projectId: project.id }; updateState(prev => ({ ...prev, tfgMeetings: [m, ...prev.tfgMeetings] })); setMeetingForm({ date: todayLocal(), topic: '', actions: '', nextMeeting: '' }); };
  const toggleMilestone = (id: string) => updateState(prev => ({ ...prev, tfgMilestones: prev.tfgMilestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m) }));
  const projectMilestones = project ? state.tfgMilestones.filter(m => m.projectId === project.id) : [];
  const projectMeetings = project ? state.tfgMeetings.filter(m => m.projectId === project.id) : [];
  const progress = projectMilestones.length ? Math.round(projectMilestones.filter(m => m.completed).length / projectMilestones.length * 100) : 0;
  return <div className="space-y-6">
    <PageHeading eyebrow="Aprender · Proyecto académico" title="Mi Trabajo Fin de Grado" description="Organiza la idea, investigación, bibliografía, hitos y tutorías. Adáptalo siempre a la normativa y calendario oficiales de la UCLM." icon={GraduationCap} />
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs leading-relaxed text-sky-950"><strong>Preparado para cuando llegue el momento:</strong> la estructura es flexible y no presupone una metodología ni una convocatoria. El TFG de Toledo debe seguir las instrucciones de la asignatura y de la dirección académica.</div>
    <Panel title="Proyectos" description="Puedes guardar una idea ahora y completarla más adelante." action={<button className={primaryButton} onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> Nuevo proyecto</button>}>
      {showForm && <form onSubmit={createProject} className="grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-2"><label className="sm:col-span-2"><span className={labelClass}>Título provisional</span><input required className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label><span className={labelClass}>Área temática</span><input className={inputClass} value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} /></label><label><span className={labelClass}>Tutor/a</span><input className={inputClass} value={form.tutor} onChange={e => setForm({ ...form, tutor: e.target.value })} /></label><label><span className={labelClass}>Inicio</span><input type="date" className={inputClass} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></label><label><span className={labelClass}>Fecha objetivo de entrega</span><input type="date" className={inputClass} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label><label><span className={labelClass}>Estado</span><select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TFGProject['status'] })}><option>Idea</option><option>En preparación</option><option>En desarrollo</option><option>En revisión</option><option>Entregado</option></select></label><label className="sm:col-span-2"><span className={labelClass}>Descripción</span><textarea className={inputClass} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><div className="sm:col-span-2 flex gap-2"><button className={primaryButton}>Guardar proyecto</button><button type="button" className={secondaryButton} onClick={() => setShowForm(false)}>Cancelar</button></div></form>}
      {state.tfgProjects.length ? <div className="mt-3 grid gap-2 md:grid-cols-2">{state.tfgProjects.map(p => <button key={p.id} onClick={() => setSelectedProject(p.id)} className={`rounded-xl border p-3 text-left ${project?.id === p.id ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200'}`}><p className="font-bold text-stone-800">{p.title}</p><p className="mt-1 text-xs text-stone-500">{p.area || 'Sin área'} · {p.status}</p></button>)}</div> : <div className="mt-3"><EmptyState text="Todavía no hay proyectos. Puedes registrar una idea cuando la tengas." /></div>}
    </Panel>
    {project && <>
      <Panel title={project.title} description={`${project.area || 'Área por definir'} · Tutor/a: ${project.tutor || 'Pendiente'}`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><StatusPill tone="blue">{project.status}</StatusPill><button className={secondaryButton} onClick={() => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.filter(p => p.id !== project.id), tfgMilestones: prev.tfgMilestones.filter(m => m.projectId !== project.id), tfgMeetings: prev.tfgMeetings.filter(m => m.projectId !== project.id) }))}><Trash2 className="h-4 w-4" /> Eliminar proyecto</button></div>
        <div className="grid gap-3 md:grid-cols-2"><label><span className={labelClass}>Pregunta de investigación</span><textarea className={inputClass} rows={2} value={project.question} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, question: e.target.value } : p) }))} /></label><label><span className={labelClass}>Objetivos</span><textarea className={inputClass} rows={2} value={project.objectives} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, objectives: e.target.value } : p) }))} /></label><label><span className={labelClass}>Palabras clave</span><input className={inputClass} value={project.keywords} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, keywords: e.target.value } : p) }))} /></label><label><span className={labelClass}>Criterios de inclusión</span><textarea className={inputClass} rows={2} value={project.inclusionCriteria} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, inclusionCriteria: e.target.value } : p) }))} /></label><label><span className={labelClass}>Criterios de exclusión</span><textarea className={inputClass} rows={2} value={project.exclusionCriteria} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, exclusionCriteria: e.target.value } : p) }))} /></label><label><span className={labelClass}>Estado</span><select className={inputClass} value={project.status} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, status: e.target.value as TFGProject['status'] } : p) }))}><option>Idea</option><option>En preparación</option><option>En desarrollo</option><option>En revisión</option><option>Entregado</option></select></label></div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Hitos y entregas" description="Define las fases que correspondan a la guía oficial de tu convocatoria.">
          <form onSubmit={addMilestone} className="mb-3 grid gap-2"><input required className={inputClass} placeholder="Nuevo hito" value={milestoneForm.title} onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })} /><div className="flex gap-2"><input className={inputClass} type="date" value={milestoneForm.dueDate} onChange={e => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })} /><button className={primaryButton}><Plus className="h-4 w-4" /></button></div><input className={inputClass} placeholder="Nota opcional" value={milestoneForm.notes} onChange={e => setMilestoneForm({ ...milestoneForm, notes: e.target.value })} /></form>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} /></div><p className="mb-3 text-xs text-stone-500">{progress}% de hitos completados</p>
          {projectMilestones.map(m => <div key={m.id} className="mb-2 flex items-center gap-2 rounded-xl border border-stone-100 p-2"><input type="checkbox" checked={m.completed} onChange={() => toggleMilestone(m.id)} className="accent-emerald-700" /><div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${m.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>{m.title}</p><p className="text-xs text-stone-500">{m.dueDate || 'Sin fecha'}</p></div><button aria-label="Eliminar hito" onClick={() => updateState(prev => ({ ...prev, tfgMilestones: prev.tfgMilestones.filter(x => x.id !== m.id) }))} className="text-stone-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>)}{!projectMilestones.length && <EmptyState text="Añade el primer hito del proyecto." />}
        </Panel>
        <Panel title="Tutorías y reuniones" description="Registra acuerdos y próximos pasos.">
          <form onSubmit={addMeeting} className="space-y-2"><input className={inputClass} type="date" value={meetingForm.date} onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} /><input required className={inputClass} placeholder="Tema tratado" value={meetingForm.topic} onChange={e => setMeetingForm({ ...meetingForm, topic: e.target.value })} /><textarea className={inputClass} rows={2} placeholder="Indicaciones y tareas acordadas" value={meetingForm.actions} onChange={e => setMeetingForm({ ...meetingForm, actions: e.target.value })} /><label><span className={labelClass}>Próxima reunión (si está acordada)</span><input type="date" className={inputClass} value={meetingForm.nextMeeting} onChange={e => setMeetingForm({ ...meetingForm, nextMeeting: e.target.value })} /></label><button className={primaryButton}>Guardar tutoría</button></form>
          <div className="mt-3 space-y-2">{projectMeetings.map(m => <div key={m.id} className="rounded-xl bg-stone-50 p-3"><div className="flex justify-between gap-2"><strong className="text-sm text-stone-800">{m.date} · {m.topic}</strong><button className="text-stone-400 hover:text-rose-600" onClick={() => updateState(prev => ({ ...prev, tfgMeetings: prev.tfgMeetings.filter(x => x.id !== m.id) }))}><Trash2 className="h-4 w-4" /></button></div><p className="mt-1 text-xs text-stone-600">{m.actions}</p>{m.nextMeeting && <p className="mt-1 text-xs text-emerald-800">Siguiente: {m.nextMeeting}</p>}</div>)}{!projectMeetings.length && <EmptyState text="Todavía no hay reuniones registradas." />}</div>
        </Panel>
      </div>
      <Panel title="Bibliografía del proyecto" description="Selecciona las referencias guardadas que forman parte de este proyecto.">
        {state.scientificReferences.length ? <div className="space-y-2">{state.scientificReferences.map(r => <label key={r.id} className="flex items-start gap-3 rounded-xl border border-stone-200 p-3"><input type="checkbox" className="mt-1 accent-emerald-700" checked={(project.referenceIds || []).includes(r.id)} onChange={e => updateState(prev => ({ ...prev, tfgProjects: prev.tfgProjects.map(p => p.id === project.id ? { ...p, referenceIds: e.target.checked ? [...(p.referenceIds || []), r.id] : (p.referenceIds || []).filter(id => id !== r.id) } : p) }))} /><span><strong className="text-sm text-stone-800">{r.title}</strong><span className="block text-xs text-stone-500">{r.authors} · {r.year}</span></span></label>)}</div> : <EmptyState text="Primero guarda referencias en el Buscador de Evidencia Científica." />}
      </Panel>
    </>}
  </div>;
}
