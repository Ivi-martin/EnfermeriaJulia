import React, { useState, useRef, useEffect } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { TutorChatMessage, TutorMemoryNote } from '../types';
import { getDaysDifference, getLocalDateString } from '../utils/dateUtils';
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
  AlertTriangle,
  Wrench,
  UtensilsCrossed,
  ChefHat,
  Home,
  Flame,
  Zap,
  ShoppingBag,
  Clock,
  Carrot,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Volume2,
  VolumeX,
  BookHeart,
  NotebookPen,
  Pause,
  Play,
  Trash2,
  Heart,
  CalendarDays,
  BatteryMedium,
  MessageCircleHeart,
} from 'lucide-react';

interface TutorPersona {
  id: string;
  name: string;
  title: string;
  category: 'academico' | 'hogar' | 'bienestar';
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
    id: 'tu_amore',
    name: 'Tu Amore',
    title: 'Tu Amore · Bienestar Emocional & Acompañamiento',
    category: 'bienestar',
    specialty: 'Regulación emocional, estrés académico y pequeños pasos',
    description: 'Acompañamiento amable para organizarte con calma, escuchar cómo te encuentras y afrontar el estudio sin sobrecargarte.',
    icon: HeartHandshake,
    color: 'text-rose-700',
    bgLight: 'bg-rose-50 border-rose-200',
    welcomeMessage: 'Hola, Julia. Soy Tu Amore, tu acompañante virtual de bienestar y estudio. Podemos hablar con calma de cómo te encuentras, ordenar las preocupaciones y dividir lo importante en pasos pequeños. No soy psicóloga ni sustituyo a una persona profesional o adulta de confianza; sí puedo ayudarte a parar un momento, poner palabras a lo que necesitas y encontrar un siguiente paso amable. ¿Qué te vendría mejor hoy: calma, ordenar ideas o empezar por algo pequeñito?',
    suggestedPrompts: [
      'Hoy me cuesta arrancar. Ayúdame a elegir un primer paso pequeño.',
      'Tengo un examen cerca y me siento saturada. ¿Qué es lo esencial?',
      'Necesito ordenar lo que me preocupa sin agobiarme.',
      'Ayúdame a preparar una tarde de estudio con descansos.',
    ],
  },
  // --- 1. TUTORES ESPECIALIZADOS DE VIDA, HOGAR Y COCINA ---
  {
    id: 'manitas',
    name: 'Manolo el Manitas',
    title: 'Manolo el Manitas · Arreglos del Hogar & Bricolaje',
    category: 'hogar',
    specialty: 'Fontanería, desatascos, electricidad básica, albañilería y persianas',
    description: 'Experto en solucionar cualquier avería o reparación del piso: desatascar fregaderos, arreglar cisternas, cambiar enchufes y tapar agujeros.',
    icon: Wrench,
    color: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    welcomeMessage: '¡Hola, Julia! Soy Manolo, tu tutor y manitas de confianza para cualquier arreglo en casa o en tu piso de Toledo. Si tienes un grifo que gotea, un atasco en la ducha, una cisterna que no para de sonar, una persiana encallada o una duda con el cuadro de luces, ¡pregúntame! Te lo explicaré paso a paso, con herramientas sencillas y siempre con máxima seguridad doméstica.',
    suggestedPrompts: [
      '¿Cómo desatascar el fregadero o la ducha con cosas de casa?',
      'La cisterna del baño no para de soltar agua, ¿cómo la arreglo?',
      '¿Cómo purgar un radiador que hace ruido y no calienta bien?',
      'Se ha ido la luz en el piso al encender un electrodoméstico, ¿qué hago?',
      'Quiero tapar agujeros de la pared y colgar un cuadro, ¿qué necesito?'
    ]
  },
  {
    id: 'chef_nutri',
    name: 'Chef Nutri',
    title: 'Chef Nutri · Cocina de Piso, Tuppers & Nutrición',
    category: 'hogar',
    specialty: 'Recetas con lo que tienes en la nevera, tuppers de guardia y nutrición',
    description: 'Platos deliciosos y equilibrados en 15 minutos, ideas de tupper que aguantan en el hospital y nutrición para combatir el cansancio.',
    icon: UtensilsCrossed,
    color: 'text-orange-700',
    bgLight: 'bg-orange-50 border-orange-200',
    welcomeMessage: '¡Hola, Julia! Soy el Chef Nutri, tu chef personal y nutricionista. Sé que entre clases, turnos en el hospital y estudio no te sobra el tiempo. Dime qué ingredientes tienes ahora mismo en la nevera o despensa y te diseño una receta riquísima, o pídeme ideas de tuppers saludables para llevarte de prácticas y comidas ligeras para descansar como un lirón.',
    suggestedPrompts: [
      'Tengo huevos, calabacín, tomate y queso: ¿qué me preparo en 15 min?',
      'Dime 3 tuppers saludables que aguanten bien en la nevera del hospital',
      '¿Qué cenar ligero tras un turno de tarde para descansar sin pesadez?',
      'Guía rápida de Batch Cooking de 1 hora para tener la semana lista',
      'Snacks saludables y energéticos para llevar en el bolsillo del uniforme'
    ]
  },

  // --- 2. PROFESORADO ACADÉMICO DE ENFERMERÍA (UCLM) ---
  {
    id: 'anatomia', name: 'Dr. Martín Moreno', title: 'Dr. Martín Moreno · Anatomía Humana',
    category: 'academico',
    specialty: 'Estructuras, planos, órganos y relaciones anatómicas',
    description: 'Apoyo conceptual para comprender la organización del cuerpo humano y su vocabulario.',
    icon: Brain, color: 'text-indigo-700', bgLight: 'bg-indigo-50 border-indigo-200',
    welcomeMessage: '¡Hola, Julia! Soy Dr. Martín Moreno, un personaje ficticio de tutoría virtual para apoyo académico en Anatomía Humana. No soy una persona real, profesor ni representante de la UCLM. Puedo ayudarte a comprender conceptos, organizar apuntes y preparar preguntas de repaso. Contrasta siempre el contenido con tus materiales docentes.',
    suggestedPrompts: ['Compara los planos anatómicos y pon ejemplos teóricos.', 'Explícame la diferencia entre sistema nervioso simpático y parasimpático.', 'Ayúdame a crear una tabla de términos anatómicos para estudiar.']
  },
  {
    id: 'fisiologia', name: 'Dra. Isabel Carrerillas', title: 'Dra. Isabel Carrerillas · Fisiología Humana',
    category: 'academico',
    specialty: 'Homeostasis, hemodinámica y neurofisiología',
    description: 'Explicaciones conceptuales de los mecanismos fisiológicos con ejemplos académicos.',
    icon: Sparkles, color: 'text-sky-700', bgLight: 'bg-sky-50 border-sky-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Isabel Carrerillas, un personaje ficticio de tutoría virtual para apoyo académico en Fisiología Humana. No soy una persona real, docente ni representante de la UCLM. Puedo explicar mecanismos como la homeostasis, el potencial de acción o el transporte de gases desde un enfoque teórico y ayudarte a autoevaluarte.',
    suggestedPrompts: ['Explícame el concepto de homeostasis con un ejemplo sencillo.', 'Resume las fases del potencial de acción celular.', 'Crea cinco preguntas de repaso sobre transporte de gases.']
  },
  {
    id: 'farmacologia', name: 'Dr. Ivancito Moreno', title: 'Dr. Ivancito Moreno · Farmacología Clínica',
    category: 'academico',
    specialty: 'Conceptos, familias farmacológicas y vocabulario',
    description: 'Apoyo teórico para estudiar mecanismos generales y terminología farmacológica.',
    icon: Pill, color: 'text-emerald-700', bgLight: 'bg-emerald-50 border-emerald-200',
    welcomeMessage: '¡Hola, Julia! Soy el Dr. Ivancito Moreno, un personaje ficticio de tutoría virtual para apoyo académico en Farmacología Clínica. No soy una persona real, profesional sanitario ni docente de la UCLM. Puedo ayudarte con conceptos generales, clasificación y vocabulario. No proporciono dosis, diluciones, pautas, cálculos para administrar medicamentos ni instrucciones de uso; esas materias requieren materiales docentes oficiales y supervisión cualificada.',
    suggestedPrompts: ['Diferencia farmacocinética y farmacodinámica.', 'Crea un glosario de conceptos básicos de farmacología.', 'Explica de forma general qué significa agonista y antagonista.']
  },
  {
    id: 'laboratorio', name: 'Dra. Laura Ratilla', title: 'Dra. Laura Ratilla · Diagnóstico & Analíticas',
    category: 'academico',
    specialty: 'Terminología de laboratorio y conceptos de fisiopatología',
    description: 'Ayuda a comprender para qué sirven las pruebas y qué conceptos estudian, sin interpretar resultados reales.',
    icon: TestTube2, color: 'text-teal-700', bgLight: 'bg-teal-50 border-teal-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Laura Ratilla, un personaje ficticio de tutoría virtual para apoyo académico en Diagnóstico & Analíticas. No soy una persona real, docente ni representante de la UCLM. Puedo explicar qué estudia una prueba y su terminología general. No interpreto resultados de personas reales ni sustituyo la valoración de profesionales o las indicaciones docentes.',
    suggestedPrompts: ['¿Qué información general aporta un hemograma?', 'Explica los conceptos de pH, ácido y base.', 'Crea preguntas teóricas sobre los componentes de la sangre.']
  },
  {
    id: 'ecoe', name: 'Dra. Luci Luci', title: 'Dra. Luci Luci · Coordinadora ECOE / Simulación',
    category: 'academico',
    specialty: 'Comunicación, reflexión y preparación académica',
    description: 'Ayuda a organizar el estudio de estaciones simuladas y a reflexionar sobre objetivos docentes.',
    icon: Stethoscope, color: 'text-rose-700', bgLight: 'bg-rose-50 border-rose-200',
    welcomeMessage: '¡Hola, Julia! Soy la Dra. Luci Luci, un personaje ficticio de tutoría virtual para preparar el estudio de ECOE y la simulación. No soy una persona real ni coordino las evaluaciones de la universidad ni puedo certificar competencias. Puedo ayudarte a estructurar objetivos, comunicación y reflexión. La práctica de cualquier procedimiento debe aprenderse exclusivamente con docentes y supervisión presencial.',
    suggestedPrompts: ['Ayúdame a organizar una reflexión después de una estación simulada.', '¿Qué es la comunicación SBAR a nivel conceptual?', 'Cómo preparar una lista de dudas para comentar con el profesorado.']
  },
  {
    id: 'fundamentos', name: 'Prof. Ivi Moca', title: 'Prof. Ivi Moca · Fundamentos & Metodología PAE',
    category: 'academico',
    specialty: 'Proceso de atención, modelos y razonamiento académico',
    description: 'Apoyo conceptual para estudiar modelos de cuidados y metodología enfermera.',
    icon: BookOpen, color: 'text-purple-700', bgLight: 'bg-purple-50 border-purple-200',
    welcomeMessage: '¡Hola, Julia! Soy el Prof. Ivi Moca, un personaje ficticio de tutoría virtual para apoyo académico en Fundamentos de Enfermería y Metodología PAE. No soy una persona real, docente ni representante de la UCLM. Puedo ayudarte a comprender modelos teóricos, fases del proceso de atención y vocabulario. Comprueba siempre el uso de taxonomías protegidas y sigue las instrucciones de tu asignatura.',
    suggestedPrompts: ['Compara los modelos de Henderson y Gordon a nivel teórico.', 'Explica las fases generales del proceso de atención de enfermería.', 'Diferencia un objetivo general de uno específico.']
  },
  {
    id: 'academico', name: 'Prof. Pedri González', title: 'Prof. Pedri González · Orientador Académico',
    category: 'academico',
    specialty: 'Planificación del estudio, tareas y gestión del tiempo',
    description: 'Ayuda a dividir objetivos académicos en tareas alcanzables y revisar la carga semanal.',
    icon: GraduationCap, color: 'text-amber-700', bgLight: 'bg-amber-50 border-amber-200',
    welcomeMessage: '¡Hola, Julia! Soy el Prof. Pedri González, un personaje ficticio de tutoría virtual y orientación académica. No soy una persona real ni represento a la UCLM ni puedo confirmar requisitos oficiales. Puedo ayudarte a planificar el estudio y organizar entregas; verifica las fechas, guías docentes y prerrequisitos en los canales universitarios.',
    suggestedPrompts: ['Ayúdame a repartir tres asignaturas en una semana de estudio.', 'Divide un tema extenso en sesiones cortas de repaso.', 'Diseña una plantilla semanal para priorizar tareas y descanso.']
  }
];

export interface TutorAIViewProps {
  initialPersonaId?: string;
  initialTab?: 'chat' | 'fridgeRecipe' | 'citations' | 'transcription' | 'council';
}

export const TutorAIView: React.FC<TutorAIViewProps> = ({ initialPersonaId, initialTab }) => {
  const { state, updateWellbeing, saveTutorConversation, saveTutorSessionSummary, addTutorCouncilMemo, addTutorMemoryNote, removeTutorMemoryNote, toggleTutorEssentialMode } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'fridgeRecipe' | 'citations' | 'transcription' | 'council'>(
    initialTab || 'chat'
  );
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'academico' | 'hogar' | 'bienestar'>('todos');

  // --- Tutor Chat State: hilos independientes para perfiles virtuales ficticios ---
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(initialPersonaId || 'tu_amore');

  useEffect(() => {
    if (initialPersonaId) {
      setSelectedPersonaId(initialPersonaId);
      const persona = TUTOR_PERSONAS.find((p) => p.id === initialPersonaId);
      if (persona?.category) {
        setCategoryFilter(persona.category);
      }
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialPersonaId, initialTab]);

  const [threads, setThreads] = useState<Record<string, TutorChatMessage[]>>(() => {
    const initial: Record<string, TutorChatMessage[]> = { ...(state.tutorConversations || {}) };
    TUTOR_PERSONAS.forEach((p) => {
      if (!Array.isArray(initial[p.id]) || initial[p.id].length === 0) initial[p.id] = [
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
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [newMemoryNote, setNewMemoryNote] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<TutorMemoryNote['category']>('aprendizaje');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingElapsed, setBreathingElapsed] = useState(0);

  const todayKey = getLocalDateString();
  const todayWellbeing = state.wellbeing[todayKey] || {};
  const feelingTags = ['Cansada y saturada', 'Necesito calma', 'Me siento bloqueada', 'Me preocupa un examen', 'Necesito compañía', 'Me siento tranquila'];

  const buildLiveTutorContext = () => {
    const upcomingExams = state.exams
      .filter(exam => !exam.completed && exam.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
      .map(exam => ({ subject: exam.subject, date: exam.date, daysLeft: getDaysDifference(exam.date, todayKey), topics: exam.topics }));
    const upcomingShifts = state.shifts
      .filter(shift => !shift.completed && shift.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4)
      .map(shift => ({ date: shift.date, service: shift.service, shiftType: shift.shiftType, daysLeft: getDaysDifference(shift.date, todayKey) }));
    const openTasks = state.tasks
      .filter(task => !task.done)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
      .map(task => ({ title: task.title, subject: task.subject, date: task.date }));
    const studyBlocks = (state.studyBlocks || [])
      .filter(block => !block.done && block.date >= todayKey)
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
      .slice(0, 6)
      .map(block => ({ title: block.title, subject: block.subject, date: block.date, startTime: block.startTime, durationMinutes: block.durationMinutes, kind: block.kind }));
    return {
      date: todayKey,
      upcomingExams,
      upcomingShifts,
      wellbeing: {
        mood: todayWellbeing.mood,
        energy: todayWellbeing.energy,
        tags: todayWellbeing.tags || [],
        note: todayWellbeing.note || '',
      },
      recentGrades: (state.grades || []).slice(-5).map(grade => ({ subject: grade.subject, name: grade.name, grade: grade.grade })),
      openTasks,
      studyBlocks,
      memoryNotes: (state.tutorMemoryNotes || []).slice(0, 20).map(note => ({ category: note.category, text: note.text })),
      sessionSummaries: (state.tutorSessionSummaries || []).slice(0, 8).map(summary => ({
        date: summary.date, tutorPersona: summary.tutorPersona, learning: summary.learning,
        emotional: summary.emotional, agreements: summary.agreements,
      })),
      councilMemos: (state.tutorCouncilMemos || []).slice(0, 12).map(memo => ({ from: memo.from, text: memo.text })),
      essentialMode: state.tutorEssentialMode,
    };
  };

  const commitThread = (personaId: string, messages: TutorChatMessage[]) => {
    setThreads(prev => ({ ...prev, [personaId]: messages }));
    saveTutorConversation(personaId, messages);
  };

  const toggleFeelingTag = (tag: string) => {
    const current = todayWellbeing.tags || [];
    const next = current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag];
    updateWellbeing(todayKey, { tags: next });
  };

  const speakMessage = (message: TutorChatMessage) => {
    if (!('speechSynthesis' in window)) {
      alert('La lectura por voz no está disponible en este navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    if (speakingId === message.id) {
      setSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message.text.replace(/[*#`]/g, ' '));
    utterance.lang = 'es-ES';
    utterance.rate = 0.94;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(message.id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!breathingActive) return;
    const interval = window.setInterval(() => {
      setBreathingElapsed(current => {
        if (current >= 59) {
          setBreathingActive(false);
          return 60;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [breathingActive]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  // --- Estado para Generador con tu Nevera (Chef Nutri) ---
  const [fridgeIngredients, setFridgeIngredients] = useState<string[]>([
    'Huevos', 'Tomate', 'Arroz'
  ]);
  const [customIngredient, setCustomIngredient] = useState<string>('');
  const [recipeGoal, setRecipeGoal] = useState<'express' | 'tupper' | 'relax' | 'study'>('express');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<boolean>(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null);
  const [recipeContextConfirmed, setRecipeContextConfirmed] = useState(false);

  const toggleFridgeIngredient = (item: string) => {
    setFridgeIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerateFridgeRecipe = async () => {
    const list = [...fridgeIngredients];
    if (customIngredient.trim()) {
      list.push(customIngredient.trim());
    }
    if (list.length === 0) {
      alert('Selecciona al menos un ingrediente o escribe qué tienes en la nevera.');
      return;
    }
    if (!recipeContextConfirmed) {
      alert('Confirma que entiendes que Chef Nutri recibirá el contexto académico y de bienestar de Julia para adaptar la receta.');
      return;
    }
    setIsGeneratingRecipe(true);
    const goalMap = {
      express: 'Plato rápido y delicioso listo en menos de 15 minutos',
      tupper: 'Tupper saludable y equilibrado para llevar a las prácticas del hospital de Toledo',
      relax: 'Cena ligera, saciante y reparadora post-guardia para dormir profundo sin pesadez',
      study: 'Comida energética y nutritiva para una tarde intensa de estudio de enfermería',
    };
    const prompt = `Hola Chef Nutri! En mi nevera y despensa tengo ahora mismo estos ingredientes: ${list.join(', ')}.
Mi objetivo de hoy: ${goalMap[recipeGoal]}.
Diseña una receta fantástica con lo que tengo (puedes añadir básicos como sal, aceite de oliva, especias o agua).
Por favor, estructura tu respuesta de forma muy clara y motivadora:
1. 🍳 Nombre del plato
2. ⏱️ Tiempo y dificultad
3. 🛒 Ingredientes exactos usados
4. 📋 Preparación paso a paso sencilla y rápida
5. 🥗 Valor nutricional clave (por qué le viene genial a Julia para su energía, concentración o descanso)
6. 🧊 Consejo de conservación o truco de tupper`;

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          tutor: 'chef_nutri',
          subject: 'Chef Nutri · Cocina de Piso, Tuppers & Nutrición',
          history: [],
          context: buildLiveTutorContext(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar la receta.');
      setGeneratedRecipe(data.reply || 'No se pudo generar la receta.');
    } catch (err: any) {
      setGeneratedRecipe(`🍳 **Revuelto Rápido Mediterráneo con tus Ingredientes**\n\n⏱️ **Tiempo:** 12 minutos · Dificultad: Muy fácil\n\n🛒 **Ingredientes:** ${list.join(', ')}, 1 cucharada de aceite de oliva, sal y orégano.\n\n📋 **Paso a paso:**\n1. En una sartén con un chorrito de aceite de oliva caliente, saltea los ingredientes cortados en dados finos durante 4-5 minutos hasta que tomen color.\n2. Bate los huevos con una pizca de sal y viértelos en la sartén a fuego medio-bajo.\n3. Remueve suavemente con una espátula durante 2 minutos hasta conseguir una textura cremosa y jugosa. Retira antes de que se seque.\n4. Si tienes arroz o pan integral, acompáñalo como base de carbohidrato complejo.\n\n🥗 **Clave Nutricional:** Proteína de alto valor biológico para la regeneración muscular tras horas de pie, grasas cardiosaludables y micronutrientes para mantenerte despierta sin pesadez digestiva.\n\n🧊 **Consejo:** Si lo guardas en tupper, deja que se enfríe completamente antes de tapar para que no genere condensación.`);
    } finally {
      setIsGeneratingRecipe(false);
      setRecipeContextConfirmed(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = TUTOR_PERSONAS.find(p => p.id === selectedPersonaId) || TUTOR_PERSONAS[0];
  const currentMessages = threads[selectedPersonaId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  const handleResetCurrentTutor = () => {
    commitThread(selectedPersonaId, [
        {
          id: `welcome-${selectedPersonaId}-${Date.now()}`,
          sender: 'tutor',
          text: activePersona.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tutorPersona: selectedPersonaId
        }
      ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;
    if (!privacyConfirmed) { alert('Antes de enviar, confirma que el texto no contiene datos personales ni información identificable de pacientes.'); return; }

    const personaId = selectedPersonaId;
    const persona = activePersona;
    const userMsg: TutorChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tutorPersona: personaId,
      createdAt: new Date().toISOString(),
    };

    const threadWithUser = [...currentMessages, userMsg];
    commitThread(personaId, threadWithUser);
    setInputText('');
    setPrivacyConfirmed(false);
    setIsLoading(true);

    const history = currentMessages.slice(-24).map(m => ({
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
          tutor: personaId,
          subject: `${persona.name} · ${persona.title}`,
          context: buildLiveTutorContext(),
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
        tutorPersona: personaId,
        createdAt: new Date().toISOString(),
      };

      const completedThread = [...threadWithUser, tutorMsg];
      commitThread(personaId, completedThread);

      const userTurns = completedThread.filter(item => item.sender === 'user' && (item.createdAt || '').slice(0, 10) === todayKey);
      const tutorTurns = completedThread.filter(item => item.sender === 'tutor' && (item.createdAt || '').slice(0, 10) === todayKey);
      const latestLearning = tutorTurns.slice(-2).map(item => item.text.replace(/\s+/g, ' ').slice(0, 260)).join(' · ') || 'Sesión de apoyo iniciada.';
      const latestAgreements = tutorTurns.slice(-1).map(item => item.text.replace(/\s+/g, ' ').slice(0, 240)).join('') || 'Pendiente de concretar.';
      const wellbeingLine = [
        todayWellbeing.mood ? `ánimo ${todayWellbeing.mood}/5` : '',
        todayWellbeing.energy ? `energía ${todayWellbeing.energy}/5` : '',
        ...(todayWellbeing.tags || []),
      ].filter(Boolean).join(', ');
      saveTutorSessionSummary({
        date: todayKey,
        tutorPersona: personaId,
        learning: `${userTurns.length} intervención(es) hoy. ${latestLearning}`.slice(0, 700),
        emotional: wellbeingLine ? `Julia registró: ${wellbeingLine}.` : 'Julia no ha registrado un check-in emocional hoy.',
        agreements: latestAgreements,
      });
      addTutorCouncilMemo({
        from: persona.name,
        text: `Julia preguntó: “${text.slice(0, 120)}”. Resumen útil para el equipo: ${tutorReplyText.replace(/\s+/g, ' ').slice(0, 180)}`,
      });
    } catch (err) {
      const fallbackMsg: TutorChatMessage = {
        id: 'fallback-' + Date.now(),
        sender: 'tutor',
        text: err instanceof Error ? err.message : 'No se pudo conectar con el tutor virtual. Revisa tus materiales docentes y vuelve a intentarlo más tarde.',

        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tutorPersona: personaId,
        createdAt: new Date().toISOString(),
      };
      commitThread(personaId, [...threadWithUser, fallbackMsg]);
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

  const nextCouncilExam = state.exams
    .filter(exam => !exam.completed && exam.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextCouncilExamDays = nextCouncilExam ? getDaysDifference(nextCouncilExam.date, todayKey) : null;
  const localHour = new Date().getHours();
  const timeGreeting = localHour < 12 ? 'Buenos días' : localHour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const councilGreeting = (todayWellbeing.energy && todayWellbeing.energy <= 2) || (todayWellbeing.mood && todayWellbeing.mood <= 2)
    ? `${timeGreeting}, Julia. Hoy vamos a cuidarte el ritmo. ${nextCouncilExam ? `Tenemos presente ${nextCouncilExam.subject}${nextCouncilExamDays === 0 ? ' hoy' : ` en ${nextCouncilExamDays} día(s)`}, pero no hace falta abarcarlo todo de golpe.` : 'No hay que resolverlo todo de una vez.'} Elegiremos una prioridad pequeña y dejaremos espacio para descansar.`
    : nextCouncilExam
      ? `${timeGreeting}, Julia. El Consejo tiene presente tu examen de ${nextCouncilExam.subject} ${nextCouncilExamDays === 0 ? 'de hoy' : `en ${nextCouncilExamDays} día(s)`}. Vamos a ordenar lo importante y avanzar paso a paso, respetando tus pausas.`
      : `${timeGreeting}, Julia. El Consejo está coordinado y listo para ayudarte. Cuéntanos qué necesitas hoy y lo convertiremos en un siguiente paso claro y alcanzable.`;
  const breathingPhase = breathingElapsed >= 60 ? 'Sesión completada' : ['Inhala suavemente', 'Mantén solo si te resulta cómodo', 'Exhala despacio'][Math.floor(breathingElapsed / 4) % 3];
  const breathingRound = Math.min(5, Math.floor(breathingElapsed / 12) + 1);

  const handleSavePermanentNote = () => {
    const text = newMemoryNote.trim();
    if (!text) return;
    addTutorMemoryNote({ category: newMemoryCategory, text });
    setNewMemoryNote('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#244234] via-[#1a382a] to-[#10241b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>ASISTENTES INTELIGENTES · CIENCIAS DE LA SALUD & VIDA EN TOLEDO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tutor IA · El Consejo de Julia
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Diez asistentes virtuales coordinados comparten el contexto académico y de bienestar de Julia: estudio, exámenes, turnos, vida diaria y acompañamiento emocional.
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
            <span>10 Tutores Virtuales (Chat)</span>
          </button>
          <button
            onClick={() => setActiveTab('council')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'council' ? 'bg-white text-[#244234] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <BookHeart className="w-4 h-4 text-rose-200" />
            <span>El Consejo & Memoria</span>
          </button>
          <button
            onClick={() => setActiveTab('fridgeRecipe')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'fridgeRecipe' ? 'bg-white text-[#244234] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-300" />
            <span>🍳 Generador con tu Nevera & Nutrición</span>
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

      {activeTab === 'chat' && (
        <section className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-stone-900 flex items-center gap-2"><Heart className="w-4 h-4 text-rose-600" /> Check-in de hoy · ¿Cómo estás, Julia?</h2>
              <p className="text-[11px] text-stone-500 mt-1">Este estado se comparte con los tutores para adaptar el ritmo. Puedes cambiarlo cuando quieras.</p>
            </div>
            <button
              type="button"
              onClick={toggleTutorEssentialMode}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition flex items-center justify-center gap-2 ${state.tutorEssentialMode ? 'bg-amber-100 border-amber-300 text-amber-950' : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-500'}`}
            >
              <Zap className="w-4 h-4" />
              {state.tutorEssentialMode ? 'Modo esencial activo' : 'Modo esencial / respiro'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-stone-700 mb-2">Ánimo · 1 a 5</p>
              <div className="grid grid-cols-5 gap-2">
                {[['😔', 'Bajo'], ['😕', 'Regular'], ['😐', 'Neutro'], ['🙂', 'Bien'], ['😄', 'Muy bien']].map(([emoji, label], index) => (
                  <button key={label} type="button" onClick={() => updateWellbeing(todayKey, { mood: index + 1 })}
                    className={`rounded-xl border py-2 text-center transition ${todayWellbeing.mood === index + 1 ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <span className="block text-xl">{emoji}</span><span className="text-[9px] font-semibold text-stone-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-700 mb-2">Energía · 1 a 5</p>
              <div className="grid grid-cols-5 gap-2">
                {[['🪫', 'Muy baja'], ['😴', 'Baja'], ['⚡', 'Media'], ['🔋', 'Buena'], ['🚀', 'Alta']].map(([emoji, label], index) => (
                  <button key={label} type="button" onClick={() => updateWellbeing(todayKey, { energy: index + 1 })}
                    className={`rounded-xl border py-2 text-center transition ${todayWellbeing.energy === index + 1 ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <span className="block text-xl">{emoji}</span><span className="text-[9px] font-semibold text-stone-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-stone-700 mb-2">Etiquetas (puedes elegir varias)</p>
            <div className="flex flex-wrap gap-2">
              {feelingTags.map(tag => (
                <button key={tag} type="button" onClick={() => toggleFeelingTag(tag)}
                  className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold transition ${(todayWellbeing.tags || []).includes(tag) ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-400'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="julia-wellbeing-note">Una nota para que los tutores te entiendan mejor (opcional)</label>
            <textarea id="julia-wellbeing-note" value={todayWellbeing.note || ''} onChange={event => updateWellbeing(todayKey, { note: event.target.value })}
              rows={2} maxLength={500} placeholder="Por ejemplo: hoy necesito que vayamos despacio..."
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-y" />
          </div>
          <p className="text-[10px] leading-relaxed text-stone-400">Privacidad: al enviar una pregunta, se comparte con el proveedor externo de IA el contexto seleccionado aquí, junto con exámenes, turnos, notas académicas, recuerdos permanentes y resúmenes del Consejo. No introduzcas datos de pacientes ni información especialmente sensible. El historial y la memoria se guardan en el almacenamiento local de este navegador, que no está cifrado ni se sincroniza entre dispositivos.</p>
        </section>
      )}

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

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-[11px] font-bold">
              <button
                onClick={() => setCategoryFilter('todos')}
                className={`flex-1 py-1.5 rounded-xl transition text-center ${
                  categoryFilter === 'todos' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Todos (10)
              </button>
              <button
                onClick={() => setCategoryFilter('hogar')}
                className={`flex-1 py-1.5 rounded-xl transition text-center ${
                  categoryFilter === 'hogar' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🛠️ Hogar (2)
              </button>
              <button
                onClick={() => setCategoryFilter('academico')}
                className={`flex-1 py-1.5 rounded-xl transition text-center ${
                  categoryFilter === 'academico' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                📚 UCLM (7)
              </button>
              <button
                onClick={() => setCategoryFilter('bienestar')}
                className={`flex-1 py-1.5 rounded-xl transition text-center ${
                  categoryFilter === 'bienestar' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                💗 Bienestar (1)
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {TUTOR_PERSONAS.filter(
                (p) => categoryFilter === 'todos' || p.category === categoryFilter
              ).map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                const Icon = persona.icon;
                const isHogar = persona.category === 'hogar';
                const isWellbeing = persona.category === 'bienestar';
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3 ${
                      isSelected
                        ? isHogar
                          ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                          : isWellbeing
                            ? 'bg-rose-50 border-rose-400 shadow-xs ring-2 ring-rose-400/20'
                            : 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? isHogar ? 'bg-amber-600 text-white' : isWellbeing ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                        : isHogar ? 'bg-amber-100 text-amber-800' : isWellbeing ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-stone-900 block truncate leading-tight">
                          {persona.name}
                        </strong>
                        {(isHogar || isWellbeing) && (
                          <span className={`text-[9px] font-black uppercase px-1 rounded ${isHogar ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                            {isHogar ? 'Hogar' : 'Bienestar'}
                          </span>
                        )}
                      </div>
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
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  activePersona.category === 'hogar' ? 'bg-amber-100 text-amber-800' : activePersona.category === 'bienestar' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <activePersona.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-stone-900 leading-tight truncate">
                      {activePersona.title}
                    </h3>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                      activePersona.category === 'hogar'
                        ? 'bg-amber-100 text-amber-900'
                        : activePersona.category === 'bienestar' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {activePersona.category === 'hogar' ? '🛠️ Vida & Hogar' : activePersona.category === 'bienestar' ? '💗 Bienestar' : '📚 UCLM Toledo'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{activePersona.specialty}</p>
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
                          <div className="flex items-center gap-3">
                            <button onClick={() => speakMessage(m)} className="hover:underline flex items-center gap-1" title="Leer respuesta en voz alta">
                              {speakingId === m.id ? <VolumeX className="w-3 h-3 text-rose-600" /> : <Volume2 className="w-3 h-3" />}
                              <span>{speakingId === m.id ? 'Detener' : 'Leer'}</span>
                            </button>
                            <button onClick={() => handleCopy(m.text, m.id)} className="hover:underline flex items-center gap-1">
                              {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === m.id ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
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
                    <span>El tutor virtual está preparando una respuesta adaptada a tu contexto...</span>
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
              <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-950"><input type="checkbox" className="mt-0.5 accent-emerald-700" checked={privacyConfirmed} onChange={e => setPrivacyConfirmed(e.target.checked)} /><span>Confirmo que no incluyo datos identificables de pacientes. Entiendo que mi pregunta y el contexto de Julia (ánimo, energía, exámenes, turnos, notas académicas y memoria del Consejo) se enviarán al proveedor externo de IA para generar la respuesta.</span></label>
              <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setPrivacyConfirmed(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Escribe una pregunta para ${activePersona.name}...`}
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

      {activeTab === 'council' && (
        <div className="space-y-6">
          <section className="rounded-3xl bg-gradient-to-br from-[#244234] via-[#1a382a] to-[#10241b] p-6 sm:p-7 text-white shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center"><BookHeart className="w-6 h-6 text-rose-200" /></div>
              <div>
                <p className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-200">El Consejo de Julia</p>
                <h2 className="text-xl font-black">Un equipo, un contexto compartido</h2>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/90">{councilGreeting}</p>
            <p className="text-[11px] mt-4 text-emerald-100 font-semibold">— Tu Amore, Mateo, Dr. Martín Moreno y todo el equipo</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
              <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-white/65">Ánimo</p><p className="font-bold text-sm">{todayWellbeing.mood ? `${todayWellbeing.mood}/5` : 'Sin registrar'}</p></div>
              <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-white/65">Energía</p><p className="font-bold text-sm">{todayWellbeing.energy ? `${todayWellbeing.energy}/5` : 'Sin registrar'}</p></div>
              <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-white/65">Próximos exámenes</p><p className="font-bold text-sm">{state.exams.filter(exam => !exam.completed && exam.date >= todayKey).length}</p></div>
              <div className="rounded-xl bg-white/10 p-3"><p className="text-[10px] text-white/65">Memorias guardadas</p><p className="font-bold text-sm">{(state.tutorMemoryNotes || []).length}</p></div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center"><Heart className="w-5 h-5" /></div>
                <div><h3 className="font-black text-stone-900 text-sm">Respiro 1 min con Tu Amore</h3><p className="text-[11px] text-stone-500">Un minuto suave para hacer una pausa.</p></div>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <div className={`mx-auto w-24 h-24 rounded-full border-4 border-emerald-200 bg-emerald-50 flex items-center justify-center transition-transform ${breathingActive ? 'scale-110' : ''}`}>
                  <span className="text-3xl">🌿</span>
                </div>
                <p className="text-base font-black text-stone-800 mt-3">{breathingActive ? breathingPhase : breathingElapsed >= 60 ? 'Muy bien, pausa terminada' : 'Respira a tu ritmo'}</p>
                <p className="text-xs text-stone-500 mt-1">{breathingActive ? `Ciclo ${breathingRound} de 5 · ${60 - breathingElapsed} segundos` : 'Inhala 4 · pausa 4 · exhala 4'}</p>
                <div className="w-full h-2 rounded-full bg-stone-200 mt-4 overflow-hidden"><div className="h-full bg-emerald-600 transition-all" style={{ width: `${Math.min(100, (breathingElapsed / 60) * 100)}%` }} /></div>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed">No fuerces el aire ni la pausa. Si mantenerlo te incomoda, respira normalmente o detén el ejercicio. Puedes hacerlo sentada y con los ojos abiertos.</p>
              <div className="flex gap-2">
                <button onClick={() => { setBreathingElapsed(0); setBreathingActive(true); }} className="flex-1 bg-[#365e45] hover:bg-[#284935] text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2"><Play className="w-4 h-4" /> {breathingElapsed >= 60 ? 'Repetir ejercicio' : 'Empezar'}</button>
                <button onClick={() => setBreathingActive(false)} disabled={!breathingActive} className="px-4 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold disabled:opacity-40"><Pause className="w-4 h-4" /></button>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center"><NotebookPen className="w-5 h-5" /></div>
                <div><h3 className="font-black text-stone-900 text-sm">Memoria a largo plazo</h3><p className="text-[11px] text-stone-500">Añade cosas que quieras que el equipo recuerde.</p></div>
              </div>
              <div className="space-y-2">
                <select value={newMemoryCategory} onChange={event => setNewMemoryCategory(event.target.value as TutorMemoryNote['category'])} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs bg-white text-stone-700">
                  <option value="aprendizaje">Aprendizajes · cómo aprendo mejor</option>
                  <option value="emocional">Bienestar · qué me ayuda o me bloquea</option>
                  <option value="acuerdo">Acuerdos · cómo quiero organizarme</option>
                </select>
                <textarea value={newMemoryNote} onChange={event => setNewMemoryNote(event.target.value)} rows={3} maxLength={500} placeholder="Ej.: Me ayudan los esquemas visuales y prefiero una pregunta cada vez." className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-800 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-600" />
                <button onClick={handleSavePermanentNote} disabled={!newMemoryNote.trim()} className="w-full rounded-xl bg-[#365e45] text-white py-2.5 text-xs font-bold disabled:opacity-40">Guardar recuerdo permanente</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(state.tutorMemoryNotes || []).length === 0 && <p className="text-xs text-stone-400 italic">Todavía no hay recuerdos permanentes. Julia decide qué guardar y puede borrarlo cuando quiera.</p>}
                {(state.tutorMemoryNotes || []).map(note => (
                  <div key={note.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3 flex items-start gap-2">
                    <div className="min-w-0 flex-1"><p className="text-[9px] uppercase tracking-wide font-extrabold text-emerald-800">{note.category}</p><p className="text-xs text-stone-700 whitespace-pre-wrap mt-1">{note.text}</p></div>
                    <button onClick={() => removeTutorMemoryNote(note.id)} title="Eliminar recuerdo" className="p-1.5 text-stone-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5">
              <div className="flex items-center justify-between gap-2 mb-4"><h3 className="font-black text-stone-900 text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4 text-emerald-700" /> Síntesis de sesiones</h3><span className="text-[10px] text-stone-400">Guardado automático</span></div>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {(state.tutorSessionSummaries || []).length === 0 && <p className="text-xs text-stone-400 italic">Cuando se complete una conversación, aquí aparecerán los aprendizajes, el estado registrado y los acuerdos del día.</p>}
                {(state.tutorSessionSummaries || []).slice(0, 20).map(summary => (
                  <article key={summary.id} className="rounded-xl border border-stone-100 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2"><strong className="text-xs text-stone-800">{summary.date} · {TUTOR_PERSONAS.find(persona => persona.id === summary.tutorPersona)?.name || summary.tutorPersona}</strong><span className="text-[9px] text-stone-400">Sesión</span></div>
                    <p className="text-[11px] text-stone-600"><strong>Aprendizajes:</strong> {summary.learning}</p>
                    <p className="text-[11px] text-stone-600"><strong>Bienestar:</strong> {summary.emotional}</p>
                    <p className="text-[11px] text-stone-600"><strong>Acuerdos:</strong> {summary.agreements}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5">
              <div className="flex items-center justify-between gap-2 mb-4"><h3 className="font-black text-stone-900 text-sm flex items-center gap-2"><MessageCircleHeart className="w-4 h-4 text-rose-600" /> Cuaderno del Consejo</h3><span className="text-[10px] text-stone-400">Bitácora inter-tutor</span></div>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {(state.tutorCouncilMemos || []).length === 0 && <p className="text-xs text-stone-400 italic">La bitácora se irá completando al hablar con cualquiera de los tutores.</p>}
                {(state.tutorCouncilMemos || []).slice(0, 30).map(memo => (
                  <div key={memo.id} className="rounded-xl bg-stone-50 border border-stone-100 p-3">
                    <div className="flex items-center justify-between gap-2"><strong className="text-[11px] text-emerald-900">{memo.from}</strong><span className="text-[9px] text-stone-400">{new Date(memo.date).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                    <p className="text-[11px] text-stone-600 mt-1">{memo.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <p className="text-[10px] leading-relaxed text-stone-400 px-1">La memoria se conserva en este navegador mediante almacenamiento local. No está cifrada, no se comparte automáticamente entre dispositivos y puede borrarse al limpiar los datos del navegador. Los tutores son herramientas virtuales: Tu Amore no sustituye a una psicóloga, terapeuta ni a una persona adulta de confianza.</p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. GENERADOR DE PLATOS CON TU NEVERA (CHEF NUTRI) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'fridgeRecipe' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-stone-900">
                      Chef Nutri · ¿Qué cocino hoy con mi nevera?
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      Nutrición & Tuppers
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Selecciona lo que tienes en el piso o despensa. Chef Nutri te creará un plato equilibrado en 15 minutos adaptado a tu ritmo de enfermería.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPersonaId('chef_nutri');
                  setActiveTab('chat');
                }}
                className="text-xs font-bold text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Chatear con Chef Nutri</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Ingredientes Rápidos */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>1. Marca lo que tienes a mano (pulsa para añadir o quitar):</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  'Huevos',
                  'Arroz',
                  'Pasta',
                  'Pechuga de pollo',
                  'Atún en lata',
                  'Patatas',
                  'Calabacín',
                  'Zanahoria',
                  'Tomate',
                  'Cebolla',
                  'Espinacas',
                  'Lentejas cocidas',
                  'Garbanzos',
                  'Queso',
                  'Yogur natural',
                  'Avena',
                  'Champiñones',
                  'Aceite de oliva'
                ].map((item) => {
                  const isChecked = fridgeIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleFridgeIngredient(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-orange-600 text-white shadow-xs scale-105'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>

              {/* Ingrediente personalizado */}
              <div className="pt-2">
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  ¿Tienes algún otro ingrediente o sobrante? (Opcional):
                </label>
                <input
                  type="text"
                  value={customIngredient}
                  onChange={(e) => setCustomIngredient(e.target.value)}
                  placeholder="ej. medio pimiento verde, medio aguacate, leche de avena, salsa de soja..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Selector de Objetivo Nutricional */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>2. ¿Qué necesitas hoy? (Objetivo):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'express', label: '⚡ Exprés (15 min)', desc: 'Rápido y sin manchar cacharros' },
                  { id: 'tupper', label: '🍱 Tupper de Hospital', desc: 'Aguanta perfecto 2-3 días' },
                  { id: 'relax', label: '🌙 Cena Reparadora', desc: 'Ligera para dormir profundo' },
                  { id: 'study', label: '🔋 Energía de Estudio', desc: 'Glucosa estable sin bajón' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setRecipeGoal(g.id as any)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      recipeGoal === g.id
                        ? 'border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <strong className="font-extrabold text-stone-900">{g.label}</strong>
                    <span className="text-[10px] text-stone-500 mt-1">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-950">
                <input type="checkbox" className="mt-0.5 accent-emerald-700" checked={recipeContextConfirmed} onChange={event => setRecipeContextConfirmed(event.target.checked)} />
                <span>Entiendo que, además de los ingredientes, se enviará a la IA el contexto de Julia (próximos exámenes, turnos, check-in, notas y memoria del Consejo) para personalizar la ayuda. No incluiré datos personales ni de pacientes.</span>
              </label>
              <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerateFridgeRecipe}
                disabled={isGeneratingRecipe || !recipeContextConfirmed}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-black hover:from-orange-700 hover:to-amber-700 transition shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingRecipe ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <UtensilsCrossed className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingRecipe
                    ? 'Chef Nutri está ideando tu plato...'
                    : '🍳 ¡Chef Nutri, prepárame un plato!'}
                </span>
              </button>
              </div>
            </div>
          </div>

          {/* Resultado de la Receta */}
          {generatedRecipe && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-orange-400 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    👨‍🍳
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Propuesta Gastronómica & Nutricional de Chef Nutri
                    </h3>
                    <span className="text-[11px] text-stone-500">Diseñada a medida para Julia</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatedRecipe, 'rec-copy')}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-700 transition flex items-center gap-1.5"
                  >
                    {copiedId === 'rec-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'rec-copy' ? '¡Copiada!' : 'Copiar receta'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPersonaId('chef_nutri');
                      setActiveTab('chat');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-900 transition flex items-center gap-1"
                  >
                    <span>Preguntar dudas en chat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#fafbfa] border border-stone-200/90 text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap">
                {generatedRecipe}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CITATIONS & BIBLIOGRAPHY TAB */}
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
