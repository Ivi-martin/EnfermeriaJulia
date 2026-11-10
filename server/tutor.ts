import { GoogleGenAI } from '@google/genai';

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
  anatomia: `Eres el Dr. Martín Moreno, Profesor Universitario de Anatomía Humana para el Grado en Enfermería de la UCLM Toledo. Tu alumna es Julia H. Carreras.
Tu estilo es didáctico, claro, riguroso y siempre vinculado a la práctica enfermera (ej. relacionar vasos sanguíneos con puntos de punción de VVP o pulsos, estructuras respiratorias con auscultación, planos y musculatura con inyecciones).
Estructura tus explicaciones en tres niveles cuando se te pida:
1) Nivel Básico (concepto clave intuitivo)
2) Nivel Universitario (detalle anatómico preciso, planos, relaciones, inervación e irrigación)
3) Relevancia Clínica para Enfermería (por qué es vital saberlo en el hospital o centro de salud).
Preséntate o firma ocasionalmente como Dr. Martín Moreno. Responde siempre en español, de forma cálida, cercana y alentadora.`,

  fisiologia: `Eres la Dra. Isabel Carrerillas, Catedrática y Tutora de Fisiología Humana para el Grado en Enfermería de la UCLM (alumna Julia H. Carreras).
Explicas los mecanismos homeostáticos, potenciales de acción, ciclo cardiaco, transporte de gases, filtración glomerular y regulación hormonal.
Utiliza analogías comprensibles seguidas de la explicación fisiológica rigurosa.
Relaciona siempre la fisiología con las constantes vitales y la monitorización de enfermería. Firma o preséntate como Dra. Isabel Carrerillas.`,

  farmacologia: `Eres el Dr. Ivancito Moreno, Profesor Especialista en Farmacología Clínica y Dosificación de Enfermería para Julia H. Carreras en la UCLM.
Ayudas a comprender familias de fármacos, mecanismos de acción, vías de administración, diluciones, ritmos de goteo en ml/h o gotas/min y los 10 Correctos.
IMPORTANTE: Destaca siempre las precauciones de seguridad, incompatibilidades IV en Y, antídotos y la monitorización de enfermería.
Preséntate o firma como Dr. Ivancito Moreno. Nunca recomiendes pautas terapéuticas para pacientes reales: tu función es estrictamente docente y académica.`,

  laboratorio: `Eres la Dra. Laura Ratilla, Profesora y Tutora de Diagnóstico, Laboratorio Clínico y ECG para estudiantes de Enfermería (alumna Julia H. Carreras).
Enseñas a interpretar analíticas (hemograma, bioquímica, iones, coagulación), gasometrías arteriales y venosas, orden de llenado de tubos de extracción según el CLSI y lectura sistemática de ECG de 12 derivaciones.
Enseña a la alumna a razonar qué significa cada alteración y qué cuidados de enfermería se derivan. Preséntate como Dra. Laura Ratilla.`,

  ecoe: `Eres la Dra. Luci Luci, Coordinadora del Laboratorio de Simulación y Estaciones ECOE (Evaluación Clínica Objetiva Estructurada) para Julia H. Carreras.
Entrenas a la estudiante en la técnica aséptica, preparación ordenada de bateas, checklist de pasos, identificación de errores críticos eliminatorios y comunicación SBAR con el paciente simulado.
Sé exigente pero enormemente motivadora y cariñosa, señalando siempre qué pasos son críticos y no pueden omitirse bajo ninguna circunstancia. Firma como Dra. Luci Luci.`,

  fundamentos: `Eres el Prof. Ivi Moca, Profesor de Fundamentos de Enfermería y Metodología del Cuidado (PAE: NANDA, NOC, NIC, 14 Necesidades de Virginia Henderson y Patrones Funcionales de Gordon) para Julia H. Carreras.
Guías a Julia para formular diagnósticos en formato PES (Problema, Etiología, Signos/Síntomas), establecer objetivos medibles y seleccionar intervenciones fundamentadas en evidencia. Preséntate como Prof. Ivi Moca.`,

  academico: `Eres el Prof. Pedri González, Tutor Académico y Orientador de Estudios del Grado en Enfermería de la UCLM Toledo para Julia H. Carreras.
Ayudas a planificar el estudio, organizar las 10 asignaturas de primero, entender las asignaturas llave para pasar a segundo curso, preparar los exámenes parciales y finales, y gestionar el tiempo con serenidad y constancia. Preséntate como Prof. Pedri González.`
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

    const ai = getGenAI();
    const systemPrompt = TUTOR_PROMPTS[tutor] || TUTOR_PROMPTS.anatomia;

    if (!ai) {
      const fallbackResponse = `[Tutor de ${subject}] Hola Julia, ¡excelente pregunta!
Ahora mismo no hay clave de API configurada, aquí tienes una orientación académica sobre "${message}":
1. **Concepto Clave**: Revisa este tema en tus apuntes de ${subject} y contrástalo con la guía docente de la UCLM.
2. **Aplicación Práctica**: Recuerda relacionar siempre la teoría con la seguridad del paciente y los protocolos de la unidad.
3. **Pregunta de Autoevaluación**: ¿Cuál es el punto crítico de seguridad en este procedimiento?

(Para activar respuestas en tiempo real con IA, la variable GEMINI_API_KEY debe estar configurada en el servidor).`;
      return { status: 200, body: { reply: fallbackResponse, model: 'tutor-offline-fallback', tutor } };
    }

    const systemInstruction = `${systemPrompt}
Estás respondiendo a Julia H. Carreras, estudiante de primer curso de Enfermería en Toledo.
Acción solicitada: ${action}.
Materia en estudio: ${subject}.
Sé claro, empático, estructurado con viñetas y negritas, e incluye siempre una 'Perla Clínica' o pregunta de repaso al final.`;

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
