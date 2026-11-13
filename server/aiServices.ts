import { GoogleGenAI, Type } from '@google/genai';
import { containsPotentialPatientIdentifiers, PATIENT_DATA_BLOCK_MESSAGE } from './privacy.js';

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

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-4-hydrogen';

function parseJsonSafe<T = any>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

function buildMultimodalParts(
  promptText: string,
  text?: string,
  fileBase64?: string,
  fileMimeType?: string
) {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (fileBase64 && fileMimeType) {
    parts.push({
      inlineData: {
        mimeType: fileMimeType,
        data: fileBase64,
      },
    });
  }
  const combinedPrompt = text && text.trim().length > 0
    ? `${promptText}\n\nContenido de los apuntes:\n"""\n${text.slice(0, 24000)}\n"""`
    : promptText;
  parts.push({ text: combinedPrompt });
  return { parts };
}

// -------------------------------------------------------------
// 1. Generador de Tests y Flashcards desde texto o archivo
// -------------------------------------------------------------
export async function generateStudyMaterials(input: {
  text?: string;
  fileBase64?: string;
  fileMimeType?: string;
  type: 'quiz' | 'flashcards';
  count: number;
  subject?: string;
  topic?: string;
}) {
  const { text = '', fileBase64, fileMimeType, type, count = 5, subject = 'Enfermería General', topic } = input;
  if (text && containsPotentialPatientIdentifiers(text)) return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  const safeCount = Math.min(20, Math.max(1, Math.floor(Number(count) || 5)));
  const ai = getGenAI();

  const hasFile = Boolean(fileBase64 && fileMimeType);
  if (!hasFile && (!text || text.trim().length < 15)) {
    return {
      success: false,
      error: 'Por favor, aporta un apunte o texto con al menos 15 caracteres (o adjunta un PDF/imagen).',
    };
  }

  if (!ai) {
    if (type === 'quiz') {
      return {
        success: true,
        items: [
          {
            id: 'gen-' + Date.now() + '-1',
            subject,
            category: 'Apuntes',
            question: `Según los apuntes de ${subject}${topic ? ` (${topic})` : ''}: ¿Cuál es el principio prioritario de actuación académica y seguridad?`,
            options: [
              `Priorizar la seguridad del paciente, la higiene y el registro estructurado`,
              `Actuar sin verificar protocolos ni identificación`,
              `Omitir la valoración previa`,
              `Proceder sin contrastar las guías docentes`,
            ],
            correctIndex: 0,
            explanation: `La valoración estructurada y la seguridad clínica son pilares esenciales en el Grado en Enfermería.`,
            clinicalTip: `Repasa siempre los fundamentos teóricos y los signos de alerta descritos en el tema.`,
          },
          {
            id: 'gen-' + Date.now() + '-2',
            subject,
            category: 'Apuntes',
            question: `¿Qué elemento resulta clave al estudiar ${topic || subject}?`,
            options: [
              `Relacionar los conceptos teóricos con los objetivos de aprendizaje de la asignatura`,
              `Ignorar las definiciones básicas y la terminología`,
              `Estudiar sin comprobar la evolución de los conceptos`,
              `Descartar el registro sistemático`,
            ],
            correctIndex: 0,
            explanation: `Comprender la relación entre teoría, terminología y cuidados mejora la retención para el examen.`,
            clinicalTip: `Sintetiza las ideas principales en fichas cortas para repasar con Leitner.`,
          },
        ].slice(0, safeCount),
        isOfflineFallback: true,
      };
    } else {
      return {
        success: true,
        items: [
          {
            id: 'card-' + Date.now() + '-1',
            subject,
            front: `Concepto Clave de ${topic || subject}`,
            back: `Síntesis estructurada extraída del contenido de los apuntes para repaso rápido.`,
          },
          {
            id: 'card-' + Date.now() + '-2',
            subject,
            front: `Puntos de atención en ${subject}`,
            back: `Identificar definiciones clave, clasificaciones y criterios de valoración.`,
          },
        ].slice(0, safeCount),
        isOfflineFallback: true,
      };
    }
  }

  try {
    if (type === 'quiz') {
      const prompt = `Eres un docente universitario experto de la Facultad de Enfermería de la UCLM.
Analiza el contenido de los apuntes proporcionados por la alumna Julia (tanto texto como archivo adjunto si lo hubiera) y genera exactamente ${safeCount} preguntas tipo test rigurosas, enfocadas en conceptos clave y preguntas típicas de examen de Grado en Enfermería.
Materia: ${subject}.${topic ? `\nTema específico: ${topic}.` : ''}
No incluyas dosis, cálculos de medicación, diluciones, pautas, preparación o administración de medicamentos ni instrucciones operativas paso a paso de procedimientos clínicos. Limítate a conceptos académicos generales, fisiopatología, anatomía, fundamentos y vocabulario.

Devuelve exclusivamente un JSON válido con el formato:
[
  {
    "question": "Enunciado claro de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctIndex": 0,
    "explanation": "Explicación razonada de por qué esa opción es la correcta y por qué las otras son incorrectas",
    "clinicalTip": "Consejo docente o regla clave de estudio para el examen"
  }
]`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                clinicalTip: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctIndex', 'explanation'],
            },
          },
        },
      });

      const parsed = parseJsonSafe<any[]>(response.text, []);
      const items = parsed.map((q: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        subject,
        category: 'Apuntes',
        question: q.question,
        options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: q.explanation || '',
        clinicalTip: q.clinicalTip || 'Consejo: repasa este concepto en tus esquemas.',
      }));

      return { success: true, items };
    } else {
      const prompt = `Eres un profesor de Enfermería de la UCLM.
Analiza los apuntes proporcionados por Julia (texto y/o archivo adjunto) de la materia "${subject}"${topic ? ` (Tema: ${topic})` : ''} y genera exactamente ${safeCount} tarjetas flashcards (anverso: pregunta o concepto clave; reverso: respuesta concisa y de alto valor docente).
Devuelve exclusivamente un JSON válido:
[
  {
    "front": "Concepto o pregunta en el anverso",
    "back": "Explicación clara y sintética en el reverso"
  }
]`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING },
              },
              required: ['front', 'back'],
            },
          },
        },
      });

      const parsed = parseJsonSafe<any[]>(response.text, []);
      const items = parsed.map((c: any, idx: number) => ({
        id: `card-${Date.now()}-${idx}`,
        subject,
        front: c.front,
        back: c.back,
      }));

      return { success: true, items };
    }
  } catch (error: any) {
    console.error('Error in generateStudyMaterials:', error);
    return {
      success: false,
      error: error.message || 'Error al generar material de estudio con la IA.',
    };
  }
}

// -------------------------------------------------------------
// 2. Simulador de Paciente Virtual / Casos Clínicos con IA
// -------------------------------------------------------------
export async function handleClinicalCaseStep(input: {
  caseTitle: string;
  patientData: any;
  actionTaken: string;
  previousHistory?: { role: string; text: string }[];
}) {
  const { caseTitle, patientData, actionTaken, previousHistory = [] } = input;
  if (containsPotentialPatientIdentifiers({ caseTitle, patientData, actionTaken, previousHistory })) return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  const ai = getGenAI();

  if (!ai) {
    return {
      success: true,
      feedback: `[Simulación Docente Offline]
Acción realizada: "${actionTaken}".
Has actuado con criterio de seguridad clínica. Recuerda siempre mantener la calma, monitorizar constantes vitales y comprobar los 10 correctos si administras medicación.`,
      vitalsDelta: {
        note: 'Constantes estabilizándose tras la intervención adecuada de enfermería.',
      },
      patientResponse: 'El paciente respira algo más aliviado y asiente con la cabeza.',
      nextOptions: [
        'Medir constantes vitales completas (TA, FC, SatO2)',
        'Colocar al paciente en posición de Fowler para favorecer la ventilación',
        'Informar al facultativo mediante técnica SBAR',
      ],
      isOfflineFallback: true,
    };
  }

  try {
    const prompt = `Eres un Médico Adjunto e Instructor de Simulación Clínica Avanzada en el Hospital Universitario de Toledo, evaluando a la alumna de enfermería Julia.
Caso clínico en curso: "${caseTitle}".
Datos basales del paciente:
${JSON.stringify(patientData, null, 2)}

Historial reciente de la intervención:
${previousHistory.map((h) => `${h.role}: ${h.text}`).join('\n')}

Última acción decidida por la enfermera Julia:
"${actionTaken}"

Evalúa la pertinencia de la acción de Julia según los protocolos vigentes de Enfermería (seguridad del paciente, técnica aséptica, farmacología segura, priorización ABCDE).
Devuelve un JSON con:
{
  "isAppropriate": true/false,
  "scoreDelta": número entero de -10 a +15,
  "patientResponse": "Lo que dice o cómo reacciona físicamente el paciente (enfermo virtual)",
  "vitals": {
    "bp": "ej. 120/75",
    "hr": 84,
    "rr": 16,
    "spo2": 97,
    "temp": 36.6,
    "painEva": 3
  },
  "feedback": "Comentario docente cálido pero riguroso indicando qué se hizo bien, qué riesgo se evitó o qué detalle debe tener en cuenta",
  "suggestedActions": ["Acción recomendada 1", "Acción recomendada 2", "Acción recomendada 3"],
  "isCaseResolved": true/false
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonSafe<any>(response.text, {});
    return { success: true, ...parsed };
  } catch (error: any) {
    console.error('Error in handleClinicalCaseStep:', error);
    return {
      success: false,
      error: error.message || 'Error al procesar la acción del caso clínico.',
    };
  }
}

// -------------------------------------------------------------
// 3. Generador de Citas y Bibliografía (Vancouver & APA 7)
// -------------------------------------------------------------
export async function generateCitations(input: {
  sourceText: string;
  sourceType?: string;
}) {
  const { sourceText, sourceType = 'Artículo científico' } = input;
  if (containsPotentialPatientIdentifiers(sourceText)) return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  const ai = getGenAI();

  if (!sourceText || sourceText.trim().length < 5) {
    return { success: false, error: 'Proporciona los datos del artículo, libro o guía.' };
  }

  if (!ai) {
    return {
      success: true,
      vancouver: `1. Autor/es. Título del trabajo. Nombre de la revista abreviado según PubMed. Año; volumen(número): páginas. Disponible en: DOI/URL`,
      apa7: `Autor, A. A., & Autor, B. B. (Año). Título del artículo. Nombre de la Revista en Cursiva, volumen(número), páginas. https://doi.org/...`,
      inTextVancouver: `(1) o [1]`,
      inTextApa: `(Autor et al., Año)`,
      recommendations: `Para trabajos de enfermería en la UCLM, el estilo Vancouver es el oficial en ciencias de la salud, mientras que APA 7 se utiliza comúnmente en trabajos de bioética y gestión.`,
      isOfflineFallback: true,
    };
  }

  try {
    const prompt = `Eres una bibliotecaria médica y experta en metodología de la investigación de Enfermería.
A partir de estos datos bibliográficos (${sourceType}), crea una referencia provisional y no inventes ningún campo ausente. Marca expresamente los datos no proporcionados para que la estudiante los contraste en el registro original:
"""
${sourceText}
"""

Genera la cita exacta en los dos formatos oficiales exigidos en Grado de Enfermería:
1) Formato Vancouver (oficial de ciencias biomédicas y revistas de enfermería, ej. Rol de Enfermería, Metas, Enfermería Clínica).
2) Formato APA 7.ª edición (American Psychological Association).
Incluye también cómo se cita en el texto (cita en el cuerpo del trabajo).

Devuelve un JSON con:
{
  "vancouver": "Cita completa en estilo Vancouver",
  "apa7": "Cita completa en estilo APA 7.ª edición",
  "inTextVancouver": "Ejemplo de llamada en el texto (ej. [1] o (1))",
  "inTextApa": "Ejemplo de cita entre paréntesis en el texto (ej. Pérez et al., 2023)",
  "annotations": "Notas o campos que podrían faltar si los datos están incompletos"
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = parseJsonSafe<any>(response.text, {});
    return { success: true, ...parsed };
  } catch (error: any) {
    console.error('Error in generateCitations:', error);
    return {
      success: false,
      error: error.message || 'Error al generar la cita bibliográfica.',
    };
  }
}

// -------------------------------------------------------------
// 4. Resumen de Apuntes y Esquemas Clínicos (texto o archivo)
// -------------------------------------------------------------
export async function summarizeNursingNotes(input: {
  text?: string;
  fileBase64?: string;
  fileMimeType?: string;
  subject?: string;
  topic?: string;
}) {
  const { text = '', fileBase64, fileMimeType, subject = 'Enfermería', topic } = input;
  if (text && containsPotentialPatientIdentifiers(text)) return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  const ai = getGenAI();

  const hasFile = Boolean(fileBase64 && fileMimeType);
  if (!hasFile && (!text || text.trim().length < 20)) {
    return { success: false, error: 'Aporta un fragmento de apuntes con al menos 20 caracteres o un archivo PDF/imagen.' };
  }

  if (!ai) {
    return {
      success: true,
      title: `Resumen de ${topic || subject}`,
      executiveSummary: `Resumen de Apuntes (${subject}${topic ? ` · ${topic}` : ''}): conceptos clave, valoración inicial, higiene de manos, técnica aséptica y registro sistemático.`,
      keyConcepts: [
        'Principios fundamentales explicados en el tema',
        'Valoración estructurada y signos de alerta',
        'Seguridad clínica y registro en la historia',
      ],
      clinicalMnemonics: ['V-D-P-E-E: Valoración, Diagnóstico, Planificación, Ejecución, Evaluación (PAE)'],
      typicalExamQuestions: [
        '¿Cuáles son los conceptos fundamentales y criterios de valoración descritos en este tema?',
        '¿Qué signos de alarma deben vigilarse de forma prioritaria?',
      ],
      pocketTip: 'Organiza siempre tus apuntes en definición, mecanismo/valoración y puntos clave de examen.',
      isOfflineFallback: true,
    };
  }

  try {
    const prompt = `Eres un Catedrático y Tutor de Apoyo de la Facultad de Enfermería de la UCLM.
Tu alumna es Julia.
Resume los siguientes apuntes de la asignatura "${subject}"${topic ? ` (Tema: ${topic})` : ''} con enfoque académico y visual (analizando tanto el texto como cualquier documento/imagen adjunto). No incluyas dosis, cálculos de medicación, diluciones, pautas, administración de fármacos ni instrucciones operativas de procedimientos clínicos. Si aparecen en el texto, omítelos y señala que deben consultarse únicamente en materiales docentes supervisados.

Estructura tu respuesta exclusivamente en formato JSON válido con:
{
  "title": "Título conciso y claro del tema",
  "executiveSummary": "Resumen ejecutivo claro de 3-4 párrafos estructurados",
  "keyConcepts": ["Concepto clave 1 con explicación breve", "Concepto clave 2...", "Concepto clave 3..."],
  "normalValuesAndTables": "Tabla o esquema conceptual general en texto/Markdown; no incluir dosis, pautas ni instrucciones operativas",
  "clinicalMnemonics": ["Regla nemotécnica 1", "Regla nemotécnica 2"],
  "typicalExamQuestions": [
    "Pregunta típica de examen que suelen poner los profesores de la UCLM sobre este tema",
    "Segunda pregunta típica..."
  ],
  "pocketTip": "Consejo breve de estudio para recordar lo más importante del tema"
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
      config: { responseMimeType: 'application/json' },
    });

    const parsed = parseJsonSafe<any>(response.text, {});
    return { success: true, ...parsed };
  } catch (error: any) {
    console.error('Error in summarizeNursingNotes:', error);
    return {
      success: false,
      error: error.message || 'Error al generar el resumen de apuntes.',
    };
  }
}

// -------------------------------------------------------------
// 5. Limpieza y Estructuración de Transcripción de Clase
// -------------------------------------------------------------
export async function cleanClassTranscript(input: {
  rawTranscript: string;
  subject?: string;
  professor?: string;
}) {
  const { rawTranscript, subject = 'Clase de Enfermería', professor = 'Profesor/a' } = input;
  if (containsPotentialPatientIdentifiers({ rawTranscript, professor })) return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  const ai = getGenAI();

  if (!rawTranscript || rawTranscript.trim().length < 15) {
    return { success: false, error: 'Pega o dicta el contenido de la clase para procesarlo.' };
  }

  if (!ai) {
    return {
      success: true,
      cleanedNotes: `### Apuntes estructurados: ${subject}
**Docente**: ${professor}
**Fecha**: ${new Date().toLocaleDateString('es-ES')}

#### Puntos tratados en la sesión:
${rawTranscript
  .split('\n')
  .filter((l) => l.trim().length > 0)
  .map((l) => `- ${l}`)
  .join('\n')}

#### Avisos de Examen:
- Prestar atención a las clasificaciones y protocolos oficiales de la UCLM.`,
      isOfflineFallback: true,
    };
  }

  try {
    const prompt = `Eres un asistente de estudio para Julia, estudiante de Enfermería en la UCLM Toledo.
A continuación tienes la transcripción en bruto (o notas de voz dictadas) de una clase de "${subject}" impartida por ${professor}:

"""
${rawTranscript.slice(0, 6000)}
"""

Tu tarea es:
1. Eliminar muletillas, repeticiones y frases incompletas.
2. Estructurar el contenido en títulos, subtítulos, listas con viñetas y términos en negrita, sin reproducir dosis ni instrucciones operativas de procedimientos clínicos.
3. Extraer una sección especial: "Posibles Preguntas de Examen (Avisos del profesor)".
4. Extraer "Perlas y Cuidados de Enfermería".

Devuelve un JSON con:
{
  "title": "Tema principal de la clase",
  "structuredNotesMarkdown": "Apuntes completos y ordenados en Markdown con encabezados h3, viñetas y negritas",
  "examAlerts": ["Aviso 1 sobre examen o puntos en los que el docente insistió", "Aviso 2..."],
  "clinicalPearls": ["Perla clínica práctica 1", "Perla 2..."]
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = parseJsonSafe<any>(response.text, {});
    return { success: true, ...parsed };
  } catch (error: any) {
    console.error('Error in cleanClassTranscript:', error);
    return {
      success: false,
      error: error.message || 'Error al estructurar la clase.',
    };
  }
}

// -------------------------------------------------------------
// 6. Análisis Completo e Inteligente de Apuntes Subidos
//    (Soporta Texto, PDF e Imágenes de apuntes manuscritos)
// -------------------------------------------------------------
export async function analyzeNoteWithAI(input: {
  mode: 'full' | 'notes' | 'summary' | 'quiz' | 'flashcards' | 'extractText';
  text?: string;
  fileBase64?: string;
  fileMimeType?: string;
  fileName?: string;
  subject?: string;
  topic?: string;
  title?: string;
  questionCount?: number;
}) {
  const {
    mode = 'full',
    text = '',
    fileBase64,
    fileMimeType,
    fileName,
    subject = 'Enfermería',
    topic = 'General',
    title = '',
    questionCount = 6,
  } = input;

  if (text && containsPotentialPatientIdentifiers(text)) {
    return { success: false, error: PATIENT_DATA_BLOCK_MESSAGE };
  }

  const hasFile = Boolean(fileBase64 && fileMimeType);
  if (!hasFile && (!text || text.trim().length < 15)) {
    return {
      success: false,
      error: 'Selecciona un apunte con contenido de texto (mín. 15 caracteres) o con un archivo PDF/imagen adjunto.',
    };
  }

  if (mode === 'summary') {
    return summarizeNursingNotes({ text, fileBase64, fileMimeType, subject, topic });
  }
  if (mode === 'quiz' || mode === 'flashcards') {
    return generateStudyMaterials({
      text,
      fileBase64,
      fileMimeType,
      type: mode,
      count: questionCount,
      subject,
      topic,
    });
  }

  const ai = getGenAI();
  const safeCount = Math.min(15, Math.max(3, Math.floor(Number(questionCount) || 6)));

  if (!ai) {
    if (mode === 'extractText') {
      return {
        success: true,
        extractedText: text || `# ${title || fileName || 'Apuntes'}\n\nContenido preparado para edición en ${subject} (${topic}). Configura GEMINI_API_KEY en el servidor para transcribir automáticamente PDFs e imágenes.`,
        isOfflineFallback: true,
      };
    }
    if (mode === 'notes') {
      return {
        success: true,
        title: title || `Apuntes desarrollados: ${topic}`,
        structuredNotesMarkdown: `## ${title || topic} (${subject})\n\n### 1. Ideas principales\n- Síntesis estructurada del material aportado.\n\n### 2. Conceptos clave\n- Definiciones fundamentales y relaciones teóricas.\n\n### 3. Puntos de repaso para examen\n- Revisa los criterios de valoración y la terminología del tema.`,
        keyPoints: ['Concepto base del tema', 'Clasificaciones principales', 'Puntos frecuentes de examen'],
        examTips: ['Repasa las definiciones clave con flashcards'],
        isOfflineFallback: true,
      };
    }
    return {
      success: true,
      title: title || `Estudio integral: ${topic}`,
      summary: {
        title: title || `Resumen de ${topic}`,
        executiveSummary: `Resumen automático de ${subject} · ${topic} (modo local sin conexión a Gemini).`,
        keyConcepts: ['Concepto central del apunte', 'Relaciones anatómicas/fisiológicas o teóricas'],
        clinicalMnemonics: ['Regla nemotécnica de apoyo al estudio'],
        typicalExamQuestions: ['¿Cuál es la idea principal de este tema?'],
        pocketTip: 'Repasa este tema con el sistema Leitner en intervalos de 1, 3 y 7 días.',
      },
      developedNotes: {
        title: `Apuntes desarrollados · ${topic}`,
        structuredNotesMarkdown: `## ${title || topic}\n\n### Resumen estructurado\n${text ? text.slice(0, 600) : 'Contenido extraído del archivo adjunto.'}\n\n### Puntos clave de examen\n- Revisa definiciones, clasificaciones y conceptos troncales.`,
        keyPoints: ['Definiciones esenciales', 'Conceptos troncales'],
        examTips: ['Completa las preguntas tipo test generadas para afianzar el tema'],
      },
      quizQuestions: [
        {
          id: `gen-${Date.now()}-1`,
          subject,
          category: 'Apuntes',
          question: `En relación con ${topic} (${subject}), ¿cuál es el enfoque prioritario de estudio?`,
          options: [
            'Comprender los conceptos troncales, clasificaciones y criterios de valoración',
            'Memorizar sin contexto ni relación teórica',
            'Ignorar la terminología específica de la asignatura',
            'Omitir los criterios de seguridad del paciente',
          ],
          correctIndex: 0,
          explanation: 'El estudio estructurado permite responder tanto preguntas teóricas como casos conceptuales.',
          clinicalTip: 'Conecta cada definición con un ejemplo académico.',
        },
      ],
      flashcards: [
        {
          id: `card-${Date.now()}-1`,
          subject,
          front: `¿Cuál es la idea central de "${title || topic}"?`,
          back: 'Síntesis del tema para repaso espaciado.',
        },
      ],
      isOfflineFallback: true,
    };
  }

  try {
    if (mode === 'extractText') {
      const prompt = `Transcribe y extrae de forma limpia, fiel y bien estructurada en Markdown todo el contenido legible de estos apuntes de Julia (asignatura: ${subject}, tema: ${topic}${fileName ? `, archivo: ${fileName}` : ''}).
Respeta títulos, subtítulos, listas y tablas en Markdown. No inventes contenido que no aparezca en el documento o imagen.
Devuelve exclusivamente JSON válido:
{
  "title": "Título sugerido para los apuntes",
  "extractedText": "Texto completo extraído y organizado en Markdown"
}`;
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              extractedText: { type: Type.STRING },
            },
            required: ['extractedText'],
          },
        },
      });
      const parsed = parseJsonSafe<any>(response.text, {});
      return {
        success: true,
        title: parsed.title || title || fileName || 'Apuntes transcritos',
        extractedText: parsed.extractedText || '',
      };
    }

    if (mode === 'notes') {
      const prompt = `Eres un profesor universitario de Enfermería en la UCLM ayudando a Julia a preparar unos apuntes impecables para estudiar.
Analiza el contenido subido (texto y/o PDF/imagen adjunto) sobre la asignatura "${subject}" y el tema "${topic}".
Desarrolla unos apuntes completos, claros, muy bien estructurados en Markdown (encabezados ## y ###, listas, términos clave en **negrita**, esquemas comparativos si ayudan), explicando los conceptos con rigor académico pero de forma muy didáctica para estudiar.
Por seguridad académica, no incluyas dosis, cálculos de medicación, diluciones, pautas ni instrucciones operativas paso a paso de procedimientos invasivos.

Devuelve exclusivamente un JSON válido:
{
  "title": "Título académico claro de los apuntes desarrollados",
  "structuredNotesMarkdown": "Apuntes desarrollados completos en Markdown",
  "keyPoints": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
  "examTips": ["Consejo de examen 1", "Consejo de examen 2"]
}`;
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              structuredNotesMarkdown: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              examTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'structuredNotesMarkdown', 'keyPoints', 'examTips'],
          },
        },
      });
      const parsed = parseJsonSafe<any>(response.text, {});
      return { success: true, ...parsed };
    }

    // mode === 'full': Analiza automáticamente todo el contenido subido y desarrolla
    // resumen + apuntes desarrollados + preguntas test + flashcards
    const prompt = `Eres un profesor universitario experto de la Facultad de Enfermería de la UCLM (Campus Toledo) ayudando a tu alumna Julia.
Analiza automáticamente el contenido de los apuntes subidos (texto y/o PDF/imagen adjunto).
Contexto:
- Asignatura: ${subject}
- Tema / Categoría: ${topic}
${title ? `- Título del apunte: ${title}` : ''}

A partir de ese contenido, genera un paquete completo de estudio en formato JSON estricto que incluya:
1) "summary": un resumen clínico/académico completo (resumen ejecutivo, conceptos clave, esquema/tabla conceptual en texto, reglas nemotécnicas, preguntas típicas de examen y un consejo breve).
2) "developedNotes": unos apuntes desarrollados y ampliados con claridad docente en formato Markdown (títulos, subtítulos, negritas, listas) para estudiar el tema a fondo.
3) "quizQuestions": exactamente ${safeCount} preguntas tipo test de 4 opciones (con índice correcto 0..3, explicación razonada de la respuesta y un tip de estudio).
4) "flashcards": exactamente ${safeCount} tarjetas flashcard (anverso: pregunta/concepto; reverso: respuesta sintética).

Regla importante: céntrate en conceptos teóricos, fisiología, anatomía, fundamentos, vocabulario y razonamiento académico; no incluyas dosis, cálculos de medicación, diluciones ni instrucciones operativas paso a paso de técnicas invasivas.

Devuelve exclusivamente JSON válido cumpliendo el esquema.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: buildMultimodalParts(prompt, text, fileBase64, fileMimeType),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                normalValuesAndTables: { type: Type.STRING },
                clinicalMnemonics: { type: Type.ARRAY, items: { type: Type.STRING } },
                typicalExamQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                pocketTip: { type: Type.STRING },
              },
              required: ['title', 'executiveSummary', 'keyConcepts', 'clinicalMnemonics', 'typicalExamQuestions'],
            },
            developedNotes: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                structuredNotesMarkdown: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                examTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['title', 'structuredNotesMarkdown', 'keyPoints', 'examTips'],
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  clinicalTip: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
                required: ['front', 'back'],
              },
            },
          },
          required: ['title', 'summary', 'developedNotes', 'quizQuestions', 'flashcards'],
        },
      },
    });

    const parsed = parseJsonSafe<any>(response.text, {});
    const quizQuestions = Array.isArray(parsed.quizQuestions)
      ? parsed.quizQuestions.map((q: any, idx: number) => ({
          id: `gen-${Date.now()}-${idx}`,
          subject,
          category: 'Apuntes',
          question: q.question,
          options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || '',
          clinicalTip: q.clinicalTip || 'Repasa este punto en tus apuntes.',
        }))
      : [];

    const flashcards = Array.isArray(parsed.flashcards)
      ? parsed.flashcards.map((c: any, idx: number) => ({
          id: `card-${Date.now()}-${idx}`,
          subject,
          front: c.front,
          back: c.back,
        }))
      : [];

    return {
      success: true,
      title: parsed.title || title || `Estudio de ${topic}`,
      summary: parsed.summary || null,
      developedNotes: parsed.developedNotes || null,
      quizQuestions,
      flashcards,
    };
  } catch (error: any) {
    console.error('Error in analyzeNoteWithAI:', error);
    return {
      success: false,
      error: error.message || 'Error al analizar automáticamente los apuntes con la IA.',
    };
  }
}

