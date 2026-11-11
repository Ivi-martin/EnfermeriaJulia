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
  welcomeMessage: string;
  suggestedPrompts: string[];
}

const TUTOR_PERSONAS: TutorPersona[] = [
  {
    id: 'anatomia', name: 'Dr. Martín Moreno', title: 'Dr. Martín Moreno · Anatomía Humana',
    specialty: 'Estructuras, planos, órganos y relaciones anatómicas',
    description: 'Apoyo conceptual para comprender la organización del cuerpo humano y su vocabulario.',
    icon: Brain, color: 'text-indigo-700', bgLight: 'bg-indigo-50 border-indigo-200',
    welcomeMessage: '¡Hola, Julia! Soy Dr. Martín Moreno, un personaje ficticio de tutoría virtual para apoyo académico en Anatomía Humana. No soy una persona real, profesor ni representante de la UCLM. Puedo ayudarte a comprender conceptos, organizar apuntes y preparar preguntas de repaso. Contrasta siempre el contenido con tus materiales docentes.',
    suggestedPrompts: ['Compara los planos anatómicos y pon ejemplos teóricos.', 'Explícame la diferencia entre sistema nervioso simpático y parasimpático.', 'Ayúdame a crear una tabla de términos anatómicos para estudiar.']
  },
  {
    id: 'fisiologia', name: 'Dra. Isabel Carrerillas', title: 'Dra. Isabel Carrerillas · Fisiología Humana',
    specialty: 'Homeostasis, hemodinámica y neurofisiología',
    description: 'Explicaciones conceptuales de los mecanismos fisiológicos con ejemplos académicos.',
    icon: Sparkles, color: 'text-sky-700', bgLight: 'bg-sky-50 border-sky-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Isabel Carrerillas, un personaje ficticio de tutoría virtual para apoyo académico en Fisiología Humana. No soy una persona real, docente ni representante de la UCLM. Puedo explicar mecanismos como la homeostasis, el potencial de acción o el transporte de gases desde un enfoque teórico y ayudarte a autoevaluarte.',
    suggestedPrompts: ['Explícame el concepto de homeostasis con un ejemplo sencillo.', 'Resume las fases del potencial de acción celular.', 'Crea cinco preguntas de repaso sobre transporte de gases.']
  },
  {
    id: 'farmacologia', name: 'Dr. Ivancito Moreno', title: 'Dr. Ivancito Moreno · Farmacología Clínica',
    specialty: 'Conceptos, familias farmacológicas y vocabulario',
    description: 'Apoyo teórico para estudiar mecanismos generales y terminología farmacológica.',
    icon: Pill, color: 'text-emerald-700', bgLight: 'bg-emerald-50 border-emerald-200',
    welcomeMessage: '¡Hola, Julia! Soy el Dr. Ivancito Moreno, un personaje ficticio de tutoría virtual para apoyo académico en Farmacología Clínica. No soy una persona real, profesional sanitario ni docente de la UCLM. Puedo ayudarte con conceptos generales, clasificación y vocabulario. No proporciono dosis, diluciones, pautas, cálculos para administrar medicamentos ni instrucciones de uso; esas materias requieren materiales docentes oficiales y supervisión cualificada.',
    suggestedPrompts: ['Diferencia farmacocinética y farmacodinámica.', 'Crea un glosario de conceptos básicos de farmacología.', 'Explica de forma general qué significa agonista y antagonista.']
  },
  {
    id: 'laboratorio', name: 'Dra. Laura Ratilla', title: 'Dra. Laura Ratilla · Diagnóstico & Analíticas',
    specialty: 'Terminología de laboratorio y conceptos de fisiopatología',
    description: 'Ayuda a comprender para qué sirven las pruebas y qué conceptos estudian, sin interpretar resultados reales.',
    icon: TestTube2, color: 'text-teal-700', bgLight: 'bg-teal-50 border-teal-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Laura Ratilla, un personaje ficticio de tutoría virtual para apoyo académico en Diagnóstico & Analíticas. No soy una persona real, docente ni representante de la UCLM. Puedo explicar qué estudia una prueba y su terminología general. No interpreto resultados de personas reales ni sustituyo la valoración de profesionales o las indicaciones docentes.',
    suggestedPrompts: ['¿Qué información general aporta un hemograma?', 'Explica los conceptos de pH, ácido y base.', 'Crea preguntas teóricas sobre los componentes de la sangre.']
  },
  {
    id: 'ecoe', name: 'Dra. Luci Luci', title: 'Dra. Luci Luci · Coordinadora ECOE / Simulación',
    specialty: 'Comunicación, reflexión y preparación académica',
    description: 'Ayuda a organizar el estudio de estaciones simuladas y a reflexionar sobre objetivos docentes.',
    icon: Stethoscope, color: 'text-rose-700', bgLight: 'bg-rose-50 border-rose-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Luci Luci, un personaje ficticio de tutoría virtual para preparar el estudio de ECOE y la simulación. No soy una persona real ni coordino las evaluaciones de la universidad ni puedo certificar competencias. Puedo ayudarte a estructurar objetivos, comunicación y reflexión. La práctica de cualquier procedimiento debe aprenderse exclusivamente con docentes y supervisión presencial.',
    suggestedPrompts: ['Ayúdame a organizar una reflexión después de una estación simulada.', '¿Qué es la comunicación SBAR a nivel conceptual?', 'Cómo preparar una lista de dudas para comentar con el profesorado.']
  },
  {
    id: 'fundamentos', name: 'Prof. Ivi Moca', title: 'Prof. Ivi Moca · Fundamentos & Metodología PAE',
    specialty: 'Proceso de atención, modelos y razonamiento académico',
    description: 'Apoyo conceptual para estudiar modelos de cuidados y metodología enfermera.',
    icon: BookOpen, color: 'text-purple-700', bgLight: 'bg-purple-50 border-purple-200',
    welcomeMessage: '¡Hola, Julia! Soy el Prof. Ivi Moca, un personaje ficticio de tutoría virtual para apoyo académico en Fundamentos de Enfermería y Metodología PAE. No soy una persona real, docente ni representante de la UCLM. Puedo ayudarte a comprender modelos teóricos, fases del proceso de atención y vocabulario. Comprueba siempre el uso de taxonomías protegidas y sigue las instrucciones de tu asignatura.',
    suggestedPrompts: ['Compara los modelos de Henderson y Gordon a nivel teórico.', 'Explica las fases generales del proceso de atención de enfermería.', 'Diferencia un objetivo general de uno específico.']
  },
  {
    id: 'academico', name: 'Prof. Pedri González', title: 'Prof. Pedri González · Orientador Académico',
    specialty: 'Planificación del estudio, tareas y gestión del tiempo',
    description: 'Ayuda a dividir objetivos académicos en tareas alcanzables y revisar la carga semanal.',
    icon: GraduationCap, color: 'text-amber-700', bgLight: 'bg-amber-50 border-amber-200',
    welcomeMessage: '¡Hola, Julia! Soy el Prof. Pedri González, un personaje ficticio de tutoría virtual y orientación académica. No soy una persona real ni represento a la UCLM ni puedo confirmar requisitos oficiales. Puedo ayudarte a planificar el estudio y organizar entregas; verifica las fechas, guías docentes y prerrequisitos en los canales universitarios.',
    suggestedPrompts: ['Ayúdame a repartir tres asignaturas en una semana de estudio.', 'Divide un tema extenso en sesiones cortas de repaso.', 'Diseña una plantilla semanal para priorizar tareas y descanso.']
  }
];

export const TutorAIView: React.FC = () => {
  const { state } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'citations' | 'transcription'>('chat');

  // --- Tutor Chat State: hilos independientes para perfiles virtuales ficticios ---
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('anatomia');
  const [threads, setThreads] = useState<Record<string, TutorChatMessage[]>>(() => {
    const initial: Record<string, TutorChatMessage[]> = {};
    TUTOR_PERSONAS.forEach((p) => {
      initial[p.id] = [
        {
          id: `welcome-${p.id}`,
          sender: 'tutor',
          text: p.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tutorPersona: p.id
        }
      ];
    });
    return initial;
  });

  const [inputText, setInputText] = useState<string>('');
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [citationPrivacyConfirmed, setCitationPrivacyConfirmed] = useState(false);
  const [transcriptPrivacyConfirmed, setTranscriptPrivacyConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = TUTOR_PERSONAS.find(p => p.id === selectedPersonaId) || TUTOR_PERSONAS[0];
  const currentMessages = threads[selectedPersonaId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  const handleResetCurrentTutor = () => {
    setThreads(prev => ({
      ...prev,
      [selectedPersonaId]: [
        {
          id: `welcome-${selectedPersonaId}-${Date.now()}`,
          sender: 'tutor',
          text: activePersona.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tutorPersona: selectedPersonaId
        }
      ]
    }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;
    if (!privacyConfirmed) { alert('Antes de enviar, confirma que el texto no contiene datos personales ni información identificable de pacientes.'); return; }

    const userMsg: TutorChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tutorPersona: selectedPersonaId
    };

    setThreads(prev => ({
      ...prev,
      [selectedPersonaId]: [...(prev[selectedPersonaId] || []), userMsg]
    }));
    setInputText('');
    setPrivacyConfirmed(false);
    setIsLoading(true);

    const history = currentMessages.slice(-8).map(m => ({
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
          subject: `${activePersona.name} · ${activePersona.title}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error en servidor: ${response.status}`);
      }
      const tutorReplyText = data.reply || 'No se pudo generar respuesta.';

      const tutorMsg: TutorChatMessage = {
        id: 'tutor-' + Date.now(),
        sender: 'tutor',
        text: tutorReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: selectedPersonaId
      };

      setThreads(prev => ({
        ...prev,
        [selectedPersonaId]: [...(prev[selectedPersonaId] || []), tutorMsg]
      }));
    } catch (err) {
      const fallbackMsg: TutorChatMessage = {
        id: 'fallback-' + Date.now(),
        sender: 'tutor',
        text: err instanceof Error ? err.message : 'No se pudo conectar con el tutor virtual. Revisa tus materiales docentes y vuelve a intentarlo más tarde.',

        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: selectedPersonaId
      };
      setThreads(prev => ({
        ...prev,
        [selectedPersonaId]: [...(prev[selectedPersonaId] || []), fallbackMsg]
      }));
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
    if (!citationPrivacyConfirmed) { alert('Confirma que solo has incluido datos bibliográficos y que no hay datos personales o de pacientes.'); return; }
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
    if (!transcriptPrivacyConfirmed) { alert('Confirma que el texto no contiene información personal ni datos identificables de pacientes.'); return; }
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
              Tutor IA · Apoyo académico, citas y transcripción
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Siete perfiles virtuales ficticios te ayudan a estudiar. No son docentes ni representantes de la UCLM. Contrasta la información y no introduzcas datos de pacientes ni información personal.
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
            <span>7 tutores virtuales (Chat)</span>
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
              Elige un perfil temático:
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
              <button
                onClick={handleResetCurrentTutor}
                title="Reiniciar conversación con este tutor"
                className="text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 transition text-xs flex items-center gap-1.5 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar chat</span>
              </button>
            </div>

            {/* Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentMessages.map((m) => {
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
                    <span>El tutor virtual está preparando una explicación académica...</span>
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
                  onClick={() => { setInputText(p); setPrivacyConfirmed(false); }}
                  className="px-3 py-1 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-[11px] text-stone-700 whitespace-nowrap transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-stone-100 bg-white space-y-3">
              <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-950"><input type="checkbox" className="mt-0.5 accent-emerald-700" checked={privacyConfirmed} onChange={e => setPrivacyConfirmed(e.target.checked)} /><span>Confirmo que no incluyo nombres, iniciales, fechas de nacimiento, teléfonos, identificadores, números de historia ni ningún dato que permita identificar a pacientes. Este texto puede enviarse a un proveedor externo de IA.</span></label>
              <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setPrivacyConfirmed(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Escribe una pregunta académica para ${activePersona.name}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim() || !privacyConfirmed}
                className="px-5 py-2.5 rounded-2xl bg-[#365e45] text-white text-xs font-bold hover:bg-[#284935] transition shadow-xs disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
              </div>
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
                Introduce solo datos bibliográficos: título, DOI, autores o publicación. La IA puede equivocarse; verifica cada dato en el registro original antes de citarlo. No pegues informes, historias clínicas ni datos personales.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Datos del Artículo, Libro o DOI
              </label>
              <textarea
                rows={3}
                value={citationSourceText}
                onChange={(e) => { setCitationSourceText(e.target.value); setCitationPrivacyConfirmed(false); }}
                placeholder="ej. Kozier & Erb Fundamentos de Enfermería 9ª edición / o pega: Title: Flebitis Zero, Author: Ministerio de Sanidad..."
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>

            <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-950"><input type="checkbox" className="mt-0.5 accent-emerald-700" checked={citationPrivacyConfirmed} onChange={e => setCitationPrivacyConfirmed(e.target.checked)} /><span>Confirmo que solo son datos bibliográficos y que no incluyen información personal ni de pacientes. El contenido se enviará a un servicio externo de IA.</span></label>
            <div className="flex justify-end">
              <button
                onClick={handleGenerateCitation}
                disabled={isGeneratingCitation || !citationSourceText.trim() || !citationPrivacyConfirmed}
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
                Pega únicamente apuntes docentes o una transcripción autorizada. El texto se envía a un proveedor externo de IA. No incluyas nombres, casos reales, historias clínicas ni información que identifique a pacientes o terceras personas.
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
                  onChange={(e) => { setTranscriptRaw(e.target.value); setTranscriptPrivacyConfirmed(false); }}
                  placeholder="Pega aquí el texto del dictado o grabación de la clase..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-950"><input type="checkbox" className="mt-0.5 accent-emerald-700" checked={transcriptPrivacyConfirmed} onChange={e => setTranscriptPrivacyConfirmed(e.target.checked)} /><span>Confirmo que son apuntes o transcripción docente autorizada y no contienen datos personales ni información identificable de pacientes o terceras personas. El texto se enviará a un servicio externo de IA.</span></label>
            <div className="flex justify-end">
              <button
                onClick={handleCleanTranscript}
                disabled={isTranscribing || transcriptRaw.trim().length < 15 || !transcriptPrivacyConfirmed}
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
