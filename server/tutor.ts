import { GoogleGenAI } from '@google/genai';
import { containsPotentialPatientIdentifiers, PATIENT_DATA_BLOCK_MESSAGE } from './privacy.js';

// Lógica del Tutor IA compartida: la usan tanto server.ts (npm run dev)
// como la función serverless de Vercel (api/ai/tutor.ts).

// Modelos a probar por orden. Usamos gemini-3.8-flash como principal recomendado.
const getModels = () => {
  const list = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  return [...new Set(list.filter((m): m is string => !!m))];
};

// Traduce un error de Gemini a un mensaje comprensible
function describeError(error: any): { code: string; message: string; detail: string } {
  const status = Number(error?.status ?? error?.code) || 0;
  const raw = String(error?.message || error || '').replace(/\s+/g, ' ');
  const detail = raw.slice(0, 300);
  if (status === 429 || /quota|rate.?limit|RESOURCE_EXHAUSTED/i.test(raw)) {
    return { code: 'QUOTA', message: 'Se ha alcanzado el límite de uso de la IA. Espera un momento y vuelve a intentarlo.', detail };
  }
  if (status === 401 || status === 403 || /api key|permission|unauthenticated|PERMISSION_DENIED/i.test(raw)) {
    return { code: 'API_KEY', message: 'La clave de Gemini no es válida o no tiene permiso. Revisa GEMINI_API_KEY en la configuración.', detail };
  }
  if (status === 503 || status === 500 || status === 504 || /UNAVAILABLE|high demand|overloaded|DEADLINE_EXCEEDED/i.test(raw)) {
    return { code: 'BUSY', message: 'Gemini está saturado en este momento. Vuelve a intentarlo en unos segundos.', detail };
  }
  if (status === 404 || /not found|not supported|no longer available/i.test(raw)) {
    return { code: 'MODEL', message: 'El modelo de IA no está disponible para esta clave.', detail };
  }
  return { code: 'UNKNOWN', message: 'Error al procesar la consulta con el Tutor IA.', detail };
}

const MAX_MESSAGE_LENGTH = 4000;

let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

// Specialized system prompts for each tutor persona
const TUTOR_PROMPTS: Record<string, string> = {
  anatomia: `Tu nombre de personaje es Dr. Martín Moreno. Eres un tutor virtual ficticio de apoyo académico en Anatomía Humana. No eres una persona real, profesor, docente ni representante de la UCLM. Explica conceptos, vocabulario y relaciones anatómicas generales con rigor y lenguaje accesible. No describas cómo realizar procedimientos clínicos.`,
  fisiologia: `Tu nombre de personaje es Dra. Isabel Carrerillas. Eres una tutora virtual ficticia de apoyo académico en Fisiología Humana. No eres una persona real, docente ni representante de la UCLM. Explica mecanismos fisiológicos generales y conceptos teóricos con analogías claras. No diagnostiques ni interpretes datos de personas reales.`,
  farmacologia: `Tu nombre de personaje es Dr. Ivancito Moreno. Eres un tutor virtual ficticio de apoyo académico en Farmacología Clínica. No eres una persona real, profesional sanitario ni docente. Limítate a conceptos generales, clasificación y vocabulario. No proporciones dosis, cálculos de dosis, diluciones, pautas, preparación o administración de medicamentos ni consejos para usar sustancias. Remite esas cuestiones a materiales oficiales y supervisión docente.`,
  laboratorio: `Tu nombre de personaje es Dra. Laura Ratilla. Eres una tutora virtual ficticia de apoyo académico en Diagnóstico y Analíticas. No eres una persona real ni docente. Explica la finalidad general de las pruebas y sus conceptos teóricos. No interpretes resultados de personas reales, no diagnostiques ni indiques actuaciones clínicas.`,
  ecoe: `Tu nombre de personaje es Dra. Luci Luci. Eres una tutora virtual ficticia de apoyo académico para preparar ECOE y simulación. No eres una persona real ni coordinas las evaluaciones de la universidad. Puedes ayudar a organizar objetivos de aprendizaje, comunicación, reflexión y estudio conceptual. No proporciones instrucciones paso a paso para realizar técnicas clínicas o invasivas y no certifiques competencias.`,
  fundamentos: `Tu nombre de personaje es Prof. Ivi Moca. Eres un tutor virtual ficticio de apoyo académico en Fundamentos de Enfermería y Metodología PAE. No eres una persona real ni docente. Explica modelos teóricos, vocabulario y metodología general. Respeta los derechos de las taxonomías protegidas y no inventes sus definiciones oficiales.`,
  academico: `Tu nombre de personaje es Prof. Pedri González. Eres un tutor virtual ficticio de orientación académica y organización universitaria. No eres una persona real ni representas a la UCLM. No puedes confirmar plazos, requisitos o prerrequisitos oficiales. Ayuda a organizar el estudio y remite a fuentes universitarias para los datos normativos.`,
  manitas: `Tu nombre de personaje es Manolo el Manitas. Eres un maestro manitas de confianza para reparaciones del hogar, fontanería, electricidad básica, albañilería y bricolaje en el piso de Julia (estudiante en Toledo).
Personalidad: Muy cercano, didáctico, con explicaciones visuales paso a paso y PRIORIDAD ABSOLUTA a la seguridad doméstica.
Áreas maestras:
1) Fontanería: desatascar tuberías, sifones, ducha y fregadero; arreglar cisternas que gotean o no cargan; cambiar juntas y teflón en grifos; purgar radiadores que hacen ruido; sellar con silicona anti-moho juntas de baño.
2) Electricidad básica segura: diagnosticar por qué salta el diferencial o los magnetotérmicos (PIAs); sustituir bombillas atascadas o casquillos; fijar enchufes sueltos; uso seguro de regletas y electrodomésticos. ¡SIEMPRE advierte: antes de manipular cables o enchufes, desconectar el automático general del cuadro de luces!
3) Albañilería & Bricolaje: tapar agujeros en pared con masilla o yeso antes de pintar; elegir el taco y tornillo adecuado según la pared (ladrillo, pladur); reparar cintas de persianas caídas o atascadas; ajustar bisagras de muebles y puertas desalineadas; engrasar cerraduras duras con grafito o 3-en-1.
Estructura tus respuestas de manera visual y práctica:
- 🛠️ Herramientas y materiales recomendados (siempre buscando opciones accesibles/baratas).
- ⚠️ Precaución de seguridad previa (cortar llave de paso, bajar diferencial, guantes).
- 📋 Paso a paso ultra claro y ordenado.
- 💡 El "Truco del Manitas" para que quede perfecto y no vuelva a romperse.`,
  chef_nutri: `Tu nombre de personaje es Chef Nutri (o Chef de Casa & Nutrición). Eres un chef profesional y nutricionista clínico especializado en la alimentación real de una estudiante universitaria de enfermería con turnos de hospital en Toledo.
Personalidad: Entusiasta, cariñoso, práctico y enfocado en que Julia coma riquísimo, gaste poco y tenga energía limpia sin digestiones pesadas.
Áreas maestras:
1) Cocina con lo que hay en la nevera: Si Julia te da una lista de ingredientes (por pocos o raros que parezcan), genera al instante una receta deliciosa, equilibrada y lista en 15-20 minutos.
2) Tuppers de Hospital & Prácticas: Platos completos (proteína + hidrato complejo + fibra/verduras) que no se queden pastosos ni secos, que aguanten 2-3 días en la nevera y se disfruten fríos o tras un golpe corto de microondas.
3) Nutrición para el cansancio y turnos cambiantes: Qué cenar tras un turno de tarde para descansar sin insomnio ni acidez; desayunos saciantes previos a un pase de planta de 7 horas; snacks de uniforme (frutos secos, fruta deshidratada, chocolate negro).
4) Batch Cooking de 1 hora para el fin de semana: Cocinar 3 bases versátiles para combinar en 5 comidas distintas.
Estructura tus respuestas:
- ⏱️ Tiempo estimado y nivel de dificultad.
- 🥦 Ingredientes y sustitutos flexibles.
- 🍳 Paso a paso rápido y fácil de seguir en cocina pequeña de piso compartido.
- 🥗 Clave nutricional para su salud (proteínas, triptófano, hierro, energía sostenida).
- 🧊 Consejo de conservación o tupper.`,
};

type ChatTurn = { role: 'user' | 'model'; parts: { text: string }[] };

const MAX_HISTORY_MESSAGES = 10;

// Construye la conversación para Gemini: valida el historial recibido,
// se queda con los últimos mensajes y fusiona turnos consecutivos del mismo rol.
export function buildContents(history: unknown, message: string): ChatTurn[] {
  const turns: ChatTurn[] = [];

  if (Array.isArray(history)) {
    for (const item of history.slice(-MAX_HISTORY_MESSAGES)) {
      const role = item?.role === 'model' ? 'model' : item?.role === 'user' ? 'user' : null;
      const text = typeof item?.text === 'string' ? item.text.slice(0, MAX_MESSAGE_LENGTH).trim() : '';
      if (!role || !text) continue;
      turns.push({ role, parts: [{ text }] });
    }
  }
  turns.push({ role: 'user', parts: [{ text: message }] });

  const merged: ChatTurn[] = [];
  for (const turn of turns) {
    const last = merged[merged.length - 1];
    if (last && last.role === turn.role) {
      last.parts[0].text += '\n\n' + turn.parts[0].text;
    } else {
      merged.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
    }
  }
  // Gemini espera que la conversación empiece por el usuario
  while (merged.length > 1 && merged[0].role === 'model') merged.shift();
  return merged;
}

export type TutorResult = { status: number; body: Record<string, unknown> };

export async function handleTutorRequest(input: any): Promise<TutorResult> {
  try {
    const rawTutor = input?.tutor || input?.persona || 'anatomia';
    const tutor = rawTutor;
    const { message, history, action = 'chat', subject = 'General' } = input || {};

    if (!message || typeof message !== 'string') {
      return { status: 400, body: { error: 'El mensaje es obligatorio.' } };
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { status: 400, body: { error: 'El mensaje es demasiado largo.' } };
    }
    if (containsPotentialPatientIdentifiers({ message, history })) {
      return { status: 400, body: { error: PATIENT_DATA_BLOCK_MESSAGE } };
    }

    const ai = getGenAI();
    const systemPrompt = TUTOR_PROMPTS[tutor] || TUTOR_PROMPTS.anatomia;

    if (!ai) {
      let fallbackResponse = '';
      if (tutor === 'manitas') {
        fallbackResponse = `🛠️ **[Manolo el Manitas · Guía Rápida]**
¡Hola Julia! Te doy una solución rápida para tu consulta en casa:

1. **⚠️ Seguridad ante todo**: Si es de agua, localiza la llave de paso (suele estar bajo el fregadero o en el baño) y ciérrala. Si es de luz, baja el automático correspondiente en el cuadro general.
2. **🛠️ Diagnóstico**: La mayoría de atascos se resuelven desmontando el bote sifónico o sifón curvo con un cubo debajo, o usando agua muy caliente con vinagre y bicarbonato. Para cisternas, el 90% es la boya desregulada o la junta de goma de la campana con cal.
3. **💡 Consejo del Manitas**: Ten siempre en casa una llave inglesa pequeña, cinta de teflón y un desatascador de ventosa. Te salvan de cualquier apuro en el piso.

*(Para respuestas interactivas completas paso a paso, la clave GEMINI_API_KEY se activa en el servidor)*.`;
      } else if (tutor === 'chef_nutri') {
        fallbackResponse = `🍳 **[Chef Nutri · Consejo de Cocina Saludable]**
¡Hola Julia! Aquí tienes una idea fantástica y rápida adaptada a tu ritmo:

1. **Plato equilibrado en 15 min**: Saltea las verduras que tengas con un chorrito de aceite de oliva, añade una proteína rápida (huevos revueltos, atún al natural o tofu en dados) y acompáñalo con arroz integral o patata cocida/microondas.
2. **💡 Regla de oro para tupper de hospital**: Evita salsas que se corten (como mayonesa). Añade el aliño o vinagreta en un botecito aparte justo antes de comer.
3. **🔋 Para el cansancio**: Incluye frutos secos, semillas o legumbres para mantener los niveles de glucosa estables durante todo tu turno.

*(Para generar recetas completas con los ingredientes exactos que tengas en la nevera, activa GEMINI_API_KEY en el servidor)*.`;
      } else {
        fallbackResponse = `[Tutor de ${subject}] Hola Julia, ¡excelente pregunta!
Ahora mismo no hay clave de API configurada. Puedo orientarte sobre conceptos generales de estudio, sin instrucciones clínicas ni datos de personas reales.
1. **Concepto clave**: consulta tus apuntes y la guía docente oficial.
2. **Repaso**: resume el concepto con tus propias palabras.
3. **Autoevaluación**: formula una pregunta teórica para comprobar lo aprendido.

(Para activar respuestas en tiempo real con IA, la variable GEMINI_API_KEY debe estar configurada en el servidor).`;
      }
      return { status: 200, body: { reply: fallbackResponse, model: 'tutor-offline-fallback', tutor } };
    }

    const systemInstruction = `${systemPrompt}
Responde en español, con claridad y tono respetuoso. Eres una herramienta educativa, no un profesional sanitario ni un docente real. No solicites datos personales o clínicos. No proporciones consejos para pacientes reales, diagnósticos, decisiones terapéuticas, dosis, cálculos de medicación, diluciones, preparación o administración de medicamentos ni instrucciones paso a paso de procedimientos clínicos. Si te piden algo de ese tipo, explica que no puedes proporcionarlo y ofrece una explicación conceptual no operativa o indica que se consulte al profesorado y los protocolos oficiales. No inventes fuentes, citas ni requisitos universitarios.
Acción solicitada: ${action}.
Materia en estudio: ${subject}.
`;

    const contents = buildContents(history, message);
    let lastError: any = null;

    for (const model of getModels()) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: { systemInstruction, temperature: 0.7 },
        });
        const reply = response.text || 'No se pudo generar la respuesta. Por favor, reformula tu pregunta.';
        return { status: 200, body: { reply, model, tutor } };
      } catch (error: any) {
        lastError = error;
        console.error(`Error con el modelo ${model}:`, error);
        // Se prueba otro modelo si este no existe o está saturado; otros errores (clave, cuota) no mejoran cambiando de modelo
        const { code } = describeError(error);
        if (code !== 'MODEL' && code !== 'BUSY') break;
      }
    }

    const { code, message: errorMessage, detail } = describeError(lastError);
    return { status: 502, body: { error: errorMessage, code, detail } };
  } catch (error: any) {
    console.error('Error en el Tutor IA:', error);
    const { code, message: errorMessage, detail } = describeError(error);
    return { status: 500, body: { error: errorMessage, code, detail } };
  }
}

export const geminiConfigured = () => !!process.env.GEMINI_API_KEY;
