import React, { useState, useRef, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { TutorChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  Brain,
  Stethoscope,
  Pill,
  TestTube2,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Copy,
  Check,
  FileText,
  Mic,
  Bookmark,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TutorPersona {
  id: string;
  name: string;
  title: string;
  specialty: string;
  description: string;
  icon: any;
  color: string;
  bgLight: string;
  suggestedPrompts: string[];
}

const TUTOR_PERSONAS: TutorPersona[] = [
  {
    id: 'anatomia',
    name: 'Prof. Anatomía',
    title: 'Dr. M. Sánchez (Anatomía Humana)',
    specialty: 'Estructuras, planos, inervación y vascularización',
    description: 'Especialista en conectar la anatomía descriptiva con la punción venosa, auscultación y exploración.',
    icon: Brain,
    color: 'text-indigo-700',
    bgLight: 'bg-indigo-50 border-indigo-200',
    suggestedPrompts: [
      'Explícame la diferencia entre el sistema nervioso simpático y parasimpático con ejemplos clínicos.',
      '¿Cuáles son las referencias anatómicas para localizar el pulso carotídeo y femoral?',
      '¿En qué espacios intercostales se colocan las derivaciones precordiales V1 a V6 del ECG?'
    ]
  },
  {
    id: 'fisiologia',
    name: 'Dra. Fisiología',
    title: 'Dra. E. Gómez (Fisiología Humana)',
    specialty: 'Homeostasis, hemodinámica y neurofisiología',
    description: 'Te ayuda a comprender cómo responde el cuerpo humano ante la hipoxia, el dolor y la deshidratación.',
    icon: Sparkles,
    color: 'text-sky-700',
    bgLight: 'bg-sky-50 border-sky-200',
    suggestedPrompts: [
      'Explícame paso a paso el sistema Renina-Angiotensina-Aldosterona (SRAA).',
      '¿Qué ocurre en el potencial de acción del miocardio durante la fase de meseta?',
      '¿Por qué en un paciente retenedor crónico de CO2 no debemos subir bruscamente la FiO2?'
    ]
  },
  {
    id: 'farmacologia',
    name: 'Prof. Farmacología',
    title: 'Dr. R. Alarcón (Farmacología Clínica)',
    specialty: 'Mecanismos, 10 Correctos, diluciones y antídotos',
    description: 'Enfoque de máxima seguridad: cálculos de goteo, incompatibilidades y precauciones.',
    icon: Pill,
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    suggestedPrompts: [
      '¿Por qué la Furosemida y la Morfina son incompatibles en Y?',
      '¿Cómo calculo la dosis pediátrica de paracetamol para un niño de 18 kg?',
      'Explícame los antídotos de la heparina, las benzodiacepinas y los opioides.'
    ]
  },
  {
    id: 'laboratorio',
    name: 'Prof. Laboratorio',
    title: 'Dra. C. Vega (Diagnóstico & Analíticas)',
    specialty: 'Interpretación analítica, iones y gasometrías',
    description: 'Lectura sistemática de ECG de 12 derivaciones, orden de llenado de tubos y equilibrio ácido-base.',
    icon: TestTube2,
    color: 'text-teal-700',
    bgLight: 'bg-teal-50 border-teal-200',
    suggestedPrompts: [
      '¿Cómo interpreto una gasometría arterial con pH 7.28, pCO2 55 y HCO3 25?',
      '¿Cuál es el orden oficial de llenado de tubos según el CLSI y por qué?',
      '¿Qué significa una elevación de troponinas junto a un descenso del segmento ST?'
    ]
  },
  {
    id: 'ecoe',
    name: 'Coord. ECOE',
    title: 'Dra. P. Morales (Simulación Clínica)',
    specialty: 'Técnica aséptica, bateas y errores críticos',
    description: 'Entrenamiento riguroso para las estaciones de evaluación práctica de la facultad.',
    icon: Stethoscope,
    color: 'text-rose-700',
    bgLight: 'bg-rose-50 border-rose-200',
    suggestedPrompts: [
      'Simula conmigo la estación de canalización de vía venosa periférica paso a paso.',
      '¿Cuáles son los 3 errores críticos que suspenden automáticamente una estación ECOE?',
      '¿Cómo presento un informe clínico según la metodología SBAR?'
    ]
  },
  {
    id: 'fundamentos',
    name: 'Prof. Metodología PAE',
    title: 'Prof. L. Navas (Fundamentos del Cuidado)',
    specialty: 'NANDA, NOC, NIC y patrones de Gordon',
    description: 'Formulación diagnóstica en formato PES, planificación y pensamiento enfermero.',
    icon: BookOpen,
    color: 'text-purple-700',
    bgLight: 'bg-purple-50 border-purple-200',
    suggestedPrompts: [
      'Ayúdame a formular un diagnóstico NANDA para un paciente con dolor agudo postquirúrgico.',
      '¿Cómo se relacionan los 11 Patrones Funcionales de Gordon con el PAE?',
      'Diferencia entre un diagnóstico enfermero real y uno de riesgo.'
    ]
  },
  {
    id: 'academico',
    name: 'Tutor Grado UCLM',
    title: 'Prof. J. M. Toledo (Orientador Académico)',
    specialty: 'Plan de estudios, asignaturas llave y tiempo',
    description: 'Orientación para planificar tu curso, compatibilizar estudio y superar primero con serenidad.',
    icon: GraduationCap,
    color: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    suggestedPrompts: [
      '¿Qué asignaturas de 1.º son llave para poder ir a las prácticas de 2.º curso?',
      'Dame un plan de estudio semanal de 2 horas al día para compaginar Anatomía y Fundamentos.',
      '¿Cómo se estructuran los exámenes parciales y finales en la UCLM?'
    ]
  }
];

export const TutorAIView: React.FC = () => {
  const { state } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'citations' | 'transcription'>('chat');

  // --- Tutor Chat State ---
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('anatomia');
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: `¡Hola, Julia! 🩺 Soy tu Tutor Académico de Enfermería de la UCLM. Estoy aquí para acompañarte en tus asignaturas de primero.
Puedes consultarme dudas sobre cualquiera de tus materias, simular casos o pedirme que te resuma conceptos complejos.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tutorPersona: 'anatomia'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = TUTOR_PERSONAS.find(p => p.id === selectedPersonaId) || TUTOR_PERSONAS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: TutorChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tutorPersona: selectedPersonaId
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const history = messages.slice(-8).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          tutor: selectedPersonaId,
          subject: activePersona.name
        })
      });

      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.status}`);
      }

      const data = await response.json();
      const tutorReplyText = data.reply || 'No se pudo generar respuesta.';

      const tutorMsg: TutorChatMessage = {
        id: 'tutor-' + Date.now(),
        sender: 'tutor',
        text: tutorReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: selectedPersonaId
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      const fallbackMsg: TutorChatMessage = {
        id: 'fallback-' + Date.now(),
        sender: 'tutor',
        text: `[${activePersona.title}]\n\nHola Julia, sobre tu consulta de "${text}":\n\n1. **Concepto Clínico**: Recuerda que en ${activePersona.specialty} la clave es relacionar la teoría fisiológica con la seguridad directa del paciente.\n2. **Punto Crítico**: En las evaluaciones de la UCLM, se valora tanto la precisión teórica como la justificación de cada cuidado de enfermería.\n3. **Revisión**: Consulta este bloque temático en las guías docentes de Fábrica de Armas y practica con nuestras estaciones de simulación ECOE y el banco de preguntas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: selectedPersonaId
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Citations & Bibliography State ---
  const [citationSourceText, setCitationSourceText] = useState('');
  const [isGeneratingCitation, setIsGeneratingCitation] = useState(false);
  const [citationResult, setCitationResult] = useState<any | null>(null);

  const handleGenerateCitation = async () => {
    if (!citationSourceText.trim()) return;
    setIsGeneratingCitation(true);
    try {
      const res = await fetch('/api/ai/citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText: citationSourceText }),
      });
      const data = await res.json();
      if (data.success) {
        setCitationResult(data);
      } else {
        alert(data.error || 'Error al generar la cita.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setIsGeneratingCitation(false);
    }
  };

  // --- Class Transcription State ---
  const [transcriptRaw, setTranscriptRaw] = useState('');
  const [transcriptSubject, setTranscriptSubject] = useState('Anatomía Humana');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [cleanedTranscriptResult, setCleanedTranscriptResult] = useState<any | null>(null);

  const handleCleanTranscript = async () => {
    if (!transcriptRaw.trim() || transcriptRaw.length < 15) {
      alert('Pega al menos 15 caracteres de transcripción o notas de clase.');
      return;
    }
    setIsTranscribing(true);
    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawTranscript: transcriptRaw, subject: transcriptSubject }),
      });
      const data = await res.json();
      if (data.success) {
        setCleanedTranscriptResult(data);
      } else {
        alert(data.error || 'Error al procesar la clase.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#244234] via-[#1a382a] to-[#10241b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>ASISTENTE INTELIGENTE PARA CIENCIAS DE LA SALUD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tutor IA · Docentes, Citas & Transcripción de Clases
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Resuelve dudas con 7 profesores especialistas, genera referencias bibliográficas automáticas en formato Vancouver y APA 7, y convierte grabaciones o notas de voz en apuntes limpios.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'chat' ? 'bg-white text-[#244234] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>7 Tutores Universitarios (Chat)</span>
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'citations' ? 'bg-white text-[#244234] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Bookmark className="w-4 h-4 text-emerald-300" />
            <span>Citas & Bibliografía (Vancouver / APA 7)</span>
          </button>
          <button
            onClick={() => setActiveTab('transcription')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'transcription' ? 'bg-white text-[#244234] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-300" />
            <span>Transcripción & Notas de Clase</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. TUTOR CHAT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Persona selector sidebar (1 col) */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 px-1 block">
              Elige tu Tutor Docente:
            </span>
            <div className="space-y-2">
              {TUTOR_PERSONAS.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="text-xs font-bold text-stone-900 block truncate leading-tight">
                        {persona.name}
                      </strong>
                      <span className="text-[10px] text-stone-500 block truncate">
                        {persona.specialty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat canvas (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200 shadow-2xs flex flex-col h-[650px] overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#fafbfa]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 leading-tight">
                    {activePersona.title}
                  </h3>
                  <p className="text-[11px] text-stone-500">{activePersona.specialty}</p>
                </div>
              </div>
            </div>

            {/* Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#365e45] text-white shadow-xs'
                          : 'bg-stone-50 border border-stone-200/80 text-stone-800 shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div className={`mt-2 flex items-center justify-between text-[10px] ${
                        isUser ? 'text-white/70' : 'text-stone-400'
                      }`}>
                        <span>{m.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(m.text, m.id)}
                            className="hover:underline flex items-center gap-1"
                          >
                            {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === m.id ? 'Copiado' : 'Copiar'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>El profesor está formulando su respuesta pedagógica...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggested prompt chips */}
            <div className="px-4 py-2 border-t border-stone-100 bg-[#fafbfa] flex gap-2 overflow-x-auto">
              {activePersona.suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-[11px] text-stone-700 whitespace-nowrap transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-stone-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Pregunta a ${activePersona.name}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-[#365e45] text-white text-xs font-bold hover:bg-[#284935] transition shadow-xs disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CITATIONS & BIBLIOGRAPHY TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'citations' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black text-stone-900">
                  Generador de Citas Oficiales de Enfermería (Vancouver & APA 7)
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Pega el título del artículo, DOI, autores o fragmento de un libro o guía clínica. La IA generará la referencia bibliográfica exacta para tus trabajos de la UCLM.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Datos del Artículo, Libro o DOI
              </label>
              <textarea
                rows={3}
                value={citationSourceText}
                onChange={(e) => setCitationSourceText(e.target.value)}
                placeholder="ej. Kozier & Erb Fundamentos de Enfermería 9ª edición / o pega: Title: Flebitis Zero, Author: Ministerio de Sanidad..."
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateCitation}
                disabled={isGeneratingCitation || !citationSourceText.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingCitation ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generar Citas Oficiales</span>
              </button>
            </div>
          </div>

          {citationResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-md space-y-5 animate-fadeIn">
              <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
                Citas Bibliográficas Generadas
              </h3>

              {/* Vancouver */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-emerald-800">
                    Estilo Vancouver (Oficial en Ciencias de la Salud / Revistas de Enfermería)
                  </span>
                  <button
                    onClick={() => handleCopy(citationResult.vancouver, 'vanc')}
                    className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {copiedId === 'vanc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'vanc' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-stone-900 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                  {citationResult.vancouver}
                </p>
                {citationResult.inTextVancouver && (
                  <span className="text-[11px] text-stone-500 block">
                    Llamada en el texto: <code>{citationResult.inTextVancouver}</code>
                  </span>
                )}
              </div>

              {/* APA 7 */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-purple-800">
                    Estilo APA 7.ª Edición (Trabajos de Ética / Gestión / TFG)
                  </span>
                  <button
                    onClick={() => handleCopy(citationResult.apa7, 'apa')}
                    className="text-xs font-bold text-stone-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    {copiedId === 'apa' ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'apa' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-stone-900 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                  {citationResult.apa7}
                </p>
                {citationResult.inTextApa && (
                  <span className="text-[11px] text-stone-500 block">
                    Cita en el texto: <code>{citationResult.inTextApa}</code>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TRANSCRIPTION & CLASS NOTES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'transcription' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-black text-stone-900">
                  Limpieza y Estructuración de Transcripción de Clase
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Pega la transcripción en bruto del dictado de clase o tus notas de voz. La IA eliminará muletillas, ordenará el tema por epígrafes y destacará los avisos del profesor sobre preguntas de examen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-stone-700 block mb-1">Asignatura</label>
                <input
                  type="text"
                  value={transcriptSubject}
                  onChange={(e) => setTranscriptSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">Transcripción en Bruto</label>
                <textarea
                  rows={5}
                  value={transcriptRaw}
                  onChange={(e) => setTranscriptRaw(e.target.value)}
                  placeholder="Pega aquí el texto del dictado o grabación de la clase..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCleanTranscript}
                disabled={isTranscribing || transcriptRaw.trim().length < 15}
                className="px-6 py-2.5 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isTranscribing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Estructurar y Limpiar Clase con IA</span>
              </button>
            </div>
          </div>

          {cleanedTranscriptResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-extrabold text-stone-900">
                  {cleanedTranscriptResult.title || 'Apuntes Estructurados de la Clase'}
                </h3>
                <button
                  onClick={() => handleCopy(cleanedTranscriptResult.structuredNotesMarkdown, 'tr-copy')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition flex items-center gap-1.5"
                >
                  {copiedId === 'tr-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'tr-copy' ? '¡Copiado!' : 'Copiar Apuntes'}</span>
                </button>
              </div>

              {cleanedTranscriptResult.examAlerts && cleanedTranscriptResult.examAlerts.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <strong className="font-extrabold uppercase tracking-wide block text-amber-900">
                    ⚠️ Avisos de Examen Extraídos de la Clase:
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {cleanedTranscriptResult.examAlerts.map((a: string, idx: number) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800 leading-relaxed font-mono whitespace-pre-wrap">
                {cleanedTranscriptResult.structuredNotesMarkdown}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
