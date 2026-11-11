import { GoogleGenAI } from '@google/genai';
import { containsPotentialPatientIdentifiers, PATIENT_DATA_BLOCK_MESSAGE } from './privacy.js';

// Lógica del Tutor IA compartida: la usan tanto server.ts (npm run dev)
// como la función serverless de Vercel (api/ai/tutor.ts).

// Modelos a probar por orden. Si el primero no está disponible para la clave, se prueba el siguiente.
const getModels = () => {
  const list = [process.env.GEMINI_MODEL, 'gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash'];
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
    return { code: 'API_KEY', message: 'La clave de Gemini no es válida o no tiene permiso. Revisa GEMINI_API_KEY en Vercel.', detail };
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
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
    const { message, history, tutor = 'anatomia', action = 'chat', subject = 'General' } = input || {};

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
      const fallbackResponse = `[Tutor de ${subject}] Hola Julia, ¡excelente pregunta!
Ahora mismo no hay clave de API configurada. Puedo orientarte sobre conceptos generales de estudio, sin instrucciones clínicas ni datos de personas reales.
1. **Concepto clave**: consulta tus apuntes y la guía docente oficial.
2. **Repaso**: resume el concepto con tus propias palabras.
3. **Autoevaluación**: formula una pregunta teórica para comprobar lo aprendido.

(Para activar respuestas en tiempo real con IA, la variable GEMINI_API_KEY debe estar configurada en el servidor).`;
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
