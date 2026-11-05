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
  Check
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
      '¿Cómo influyen la precarga, poscarga y contractilidad en el gasto cardíaco?',
      '¿Por qué se produce la respiración de Kussmaul en la cetoacidosis diabética?'
    ]
  },
  {
    id: 'farmacologia',
    name: 'Prof. Farmacología',
    title: 'Prof. Farmacología Clínica',
    specialty: 'Mecanismos, 10 correctos, diluciones y antídotos',
    description: 'Enfocado en la administración segura, prevención de errores de medicación y cálculos de dosis.',
    icon: Pill,
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    suggestedPrompts: [
      '¿Por qué la Furosemida y la Morfina no deben mezclarse en la misma luz en Y?',
      'Hazme 3 preguntas difíciles tipo test sobre anticoagulantes y sus antídotos.',
      'Explícame la regla de los 10 correctos de enfermería y por qué el doble chequeo salva vidas.'
    ]
  },
  {
    id: 'laboratorio',
    name: 'Tutor Laboratorio',
    title: 'Tutor de Diagnóstico y Analíticas',
    specialty: 'Hemograma, iones, gasometrías y tubos',
    description: 'Te enseña a razonar analíticas clínicas y no solo memorizar cifras numéricas.',
    icon: TestTube2,
    color: 'text-teal-700',
    bgLight: 'bg-teal-50 border-teal-200',
    suggestedPrompts: [
      'Tengo un pH 7.28, PaCO2 56, HCO3 26. ¿Cómo interpreto esta gasometría y qué vigilo?',
      '¿Cuál es el orden estricto de llenado de tubos de sangre y por qué?',
      '¿Qué cuidados enfermeros inmediatos debo aplicar ante un potasio de 6.2 mEq/L?'
    ]
  },
  {
    id: 'fundamentos',
    name: 'Prof. Fundamentos',
    title: 'Coordinador Metodología PAE',
    specialty: 'Modelos de enfermería, NANDA, NOC, NIC',
    description: 'Aprende a formular diagnósticos de enfermería reales y de riesgo con rigor metodológico.',
    icon: BookOpen,
    color: 'text-purple-700',
    bgLight: 'bg-purple-50 border-purple-200',
    suggestedPrompts: [
      '¿Cómo se estructura un diagnóstico NANDA real frente a uno de riesgo?',
      'Propón un PAE completo para un paciente encamado con alto riesgo de UPP (escala Braden 12).',
      'Explícame las 14 Necesidades Básicas de Virginia Henderson.'
    ]
  },
  {
    id: 'ecoe',
    name: 'Instructor ECOE',
    title: 'Instructor Simulación Clínica',
    specialty: 'Técnica aséptica, checklists y errores críticos',
    description: 'Entrena tus habilidades prácticas para superar las estaciones de simulación en Fábrica de Armas.',
    icon: Stethoscope,
    color: 'text-rose-700',
    bgLight: 'bg-rose-50 border-rose-200',
    suggestedPrompts: [
      'Ponte en modo examinador y evalúa mi técnica de canalización de vía venosa periférica.',
      '¿Cuáles son los 3 errores críticos que invalidan de inmediato la estación de sondaje vesical?',
      'Describe la secuencia exacta de colocación y retirada segura del EPI.'
    ]
  },
  {
    id: 'academico',
    name: 'Orientador UCLM',
    title: 'Tutor Académico Campus Toledo',
    specialty: 'Plan de estudios 240 ECTS, asignaturas llave y exámenes',
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('anatomia');
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: `¡Hola, Julia! 🩺 Soy tu Tutor Académico de Enfermería de la UCLM. Estoy aquí para acompañarte en tu primer curso del Grado.

Puedes consultarme dudas sobre cualquiera de tus asignaturas, pedirme que te resuma un concepto complejo en 3 niveles, simular casos clínicos ficticios o ponerte a prueba con preguntas tipo examen.

¿Por dónde te apetece que empecemos hoy?`,
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

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
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
      console.warn('API error, using educational local fallback', err);
      // High quality educational fallback
      const fallbackMsg: TutorChatMessage = {
        id: 'fallback-' + Date.now(),
        sender: 'tutor',
        text: `[${activePersona.title}]\n\nHola Julia, sobre tu consulta de "${text}":\n\n1. **Concepto Clínico**: Recuerda que en ${activePersona.specialty} la clave es relacionar la teoría fisiológica con la seguridad directa del paciente.\n2. **Punto Crítico**: En las evaluaciones de la UCLM, se valora tanto la precisión teórica como la justificación de cada cuidado de enfermería.\n3. **Revisión**: Consulta este bloque temático en las guías docentes de Fábrica de Armas y practica con nuestras estaciones de simulación ECOE y el banco de preguntas.\n\n*(El servidor ha respondido con la orientación clínica local. Para respuestas generativas completas, asegúrate de que el servidor tenga acceso a la API)*.`,
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

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-msg-reset',
        sender: 'tutor',
        text: `Conversación reiniciada con el ${activePersona.title}. ¿Qué deseas repasar ahora, Julia?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: selectedPersonaId
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1a382c] via-[#244c3c] to-[#12261e] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>ASISTENTE VIRTUAL DE APRENDIZAJE · UCLM CAMPUS TOLEDO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tutor IA · 7 Profesores Especializados
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Profesores universitarios especializados para Julia H. Carreras: Anatomía, Fisiología, Farmacología, Laboratorio, Fundamentos PAE, Simulación ECOE y Orientador Académico UCLM.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                Profesor Activo
              </span>
              <strong className="text-base font-black text-white block truncate max-w-[160px]">
                {activePersona.name}
              </strong>
              <span className="text-[10px] text-emerald-300">
                Modelo: Gemini 3.8 Flash
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Bot className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 7 Personas Selector Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-6 pt-6 border-t border-white/15 scrollbar-thin">
          {TUTOR_PERSONAS.map((persona) => {
            const isSelected = selectedPersonaId === persona.id;
            const Icon = persona.icon;
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedPersonaId(persona.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-white text-[#1a382c] shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-emerald-300'}`} />
                <span>{persona.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Persona Profile & Quick Action Prompts (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <activePersona.icon className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Docente Especializado
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-1">
                  {activePersona.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {activePersona.description}
            </p>

            <div className="pt-3 border-t border-stone-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Preguntas Frecuentes Sugeridas:</span>
              </span>
              <div className="space-y-2">
                {activePersona.suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/60 hover:border-emerald-300 text-xs text-stone-700 font-medium transition leading-snug flex items-start gap-2"
                  >
                    <span className="text-emerald-600 font-bold shrink-0">›</span>
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={handleClearHistory}
                className="text-xs font-bold text-stone-400 hover:text-stone-700 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar charla</span>
              </button>
              <span className="text-[11px] text-stone-400">
                Alumna: Julia H. Carreras
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Conversation & Input (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-2xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Scrollable Window */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    isUser
                      ? 'bg-[#365e45] text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#365e45] text-white rounded-tr-sm'
                      : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-tl-sm'
                  }`}>
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                      <span className="font-bold">
                        {isUser ? 'Julia H. Carreras' : activePersona.title}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-end">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="text-[11px] font-bold text-stone-400 hover:text-stone-700 flex items-center gap-1 transition"
                          title="Copiar respuesta"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2 text-xs text-stone-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>El {activePersona.title} está razonando la explicación clínica...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-stone-100 bg-[#fafbfa]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Pregunta a ${activePersona.name} sobre apuntes, dudas o simulación...`}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#365e45] font-medium"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`p-3 rounded-2xl transition shadow-xs flex items-center justify-center shrink-0 ${
                  inputText.trim() && !isLoading
                    ? 'bg-[#365e45] text-white hover:bg-[#284935] cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
