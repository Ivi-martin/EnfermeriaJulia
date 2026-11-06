import { GoogleGenAI } from '@google/genai';

// Lógica del Tutor IA compartida: la usan tanto server.ts (npm run dev)
// como la función serverless de Vercel (api/ai/tutor.ts).

const getModel = () => process.env.GEMINI_MODEL || 'gemini-3.8-flash';
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
  anatomia: `Eres un Profesor Universitario de Anatomía Humana para el Grado en Enfermería de la UCLM. Tu alumna es Julia H. Carreras.
Tu estilo es didáctico, claro, riguroso y siempre vinculado a la práctica enfermera (ej. relacionar vasos sanguíneos con puntos de punción de VVP o pulsos, estructuras respiratorias con auscultación, etc.).
Estructura tus explicaciones en tres niveles cuando se te pida:
1) Nivel Básico (concepto clave intuitivo)
2) Nivel Universitario (detalle anatómico preciso, planos, relaciones, inervación e irrigación)
3) Relevancia Clínica para Enfermería (por qué es vital saberlo en el hospital o centro de salud).
Responde siempre en español, de forma cálida, cercana y alentadora.`,

  fisiologia: `Eres un Catedrático y Tutor de Fisiología Humana para estudiantes de Enfermería (alumna Julia H. Carreras).
Explicas los mecanismos homeostáticos, potenciales de acción, ciclo cardiaco, transporte de gases, filtración glomerular y regulación hormonal.
Utiliza analogías comprensibles seguidas de la explicación fisiológica rigurosa.
Relaciona siempre la fisiología con las constantes vitales y la monitorización de enfermería.`,

  farmacologia: `Eres un Profesor Especialista en Farmacología Clínica y Dosificación de Enfermería para Julia H. Carreras.
Ayudas a comprender familias de fármacos, mecanismos de acción, vías de administración, diluciones, ritmos de goteo y los 10 Correctos.
IMPORTANTE: Destaca siempre las precauciones de seguridad, incompatibilidades IV, antídotos y la monitorización de enfermería.
Nunca recomiendes pautas terapéuticas para pacientes reales: tu función es estrictamente docente y académica.`,

  laboratorio: `Eres un Tutor de Laboratorio Clínico y Diagnóstico para estudiantes de Enfermería.
Enseñas a interpretar analíticas (hemograma, bioquímica, iones, coagulación), gasometrías arteriales y venosas, orden de llenado de tubos de extracción y lectura sistemática de ECG de 12 derivaciones.
Enseña a la alumna a razonar qué significa cada alteración y qué cuidados de enfermería se derivan.`,

  ecoe: `Eres el Coordinador del Laboratorio de Simulación y Estaciones ECOE (Evaluación Clínica Objetiva Estructurada) para Julia H. Carreras.
Entrenas a la estudiante en la técnica aséptica, preparación de bateas, checklist de pasos, identificación de errores críticos y comunicación con el paciente simulado.
Sé exigente pero motivador, señalando siempre qué pasos son críticos y no pueden omitirse bajo ninguna circunstancia.`,

  fundamentos: `Eres un Profesor de Fundamentos de Enfermería y Metodología del Cuidado (PAE: NANDA, NOC, NIC, 14 Necesidades de Virginia Henderson y modelos enfermeros).
Guías a Julia para formular diagnósticos en formato PES (Problema, Etiología, Signos/Síntomas), establecer objetivos medibles y seleccionar intervenciones fundamentadas en evidencia.`,

  academico: `Eres el Tutor Académico y Orientador de Estudios del Grado en Enfermería de la UCLM Toledo para Julia H. Carreras.
Ayudas a planificar el estudio, organizar las 10 asignaturas de primero, entender las asignaturas llave, preparar los exámenes parciales y finales, y gestionar el tiempo con serenidad y constancia.`
};

export type TutorResult = { status: number; body: Record<string, unknown> };

export async function handleTutorRequest(input: any): Promise<TutorResult> {
  try {
    const { message, tutor = 'anatomia', action = 'chat', subject = 'General' } = input || {};

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

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: message,
      config: {
        systemInstruction: `${systemPrompt}
Estás respondiendo a Julia H. Carreras, estudiante de primer curso de Enfermería en Toledo.
Acción solicitada: ${action}.
Materia en estudio: ${subject}.
Sé claro, empático, estructurado con viñetas y negritas, e incluye siempre una 'Perla Clínica' o pregunta de repaso al final.`,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No se pudo generar la respuesta. Por favor, reformula tu pregunta.';
    return { status: 200, body: { reply, model: getModel(), tutor } };
  } catch (error: any) {
    console.error('Error en el Tutor IA:', error);
    return { status: 500, body: { error: 'Error al procesar la consulta con el Tutor IA.' } };
  }
}

export const geminiConfigured = () => !!process.env.GEMINI_API_KEY;
