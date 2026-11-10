import { GoogleGenAI, Type } from '@google/genai';

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

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// -------------------------------------------------------------
// 1. Generador de Tests y Flashcards desde texto pegado
// -------------------------------------------------------------
export async function generateStudyMaterials(input: {
  text: string;
  type: 'quiz' | 'flashcards';
  count: number;
  subject?: string;
}) {
  const { text, type, count = 5, subject = 'Enfermería General' } = input;
  const ai = getGenAI();

  if (!text || text.trim().length < 15) {
    return {
      success: false,
      error: 'Por favor, pega un fragmento de apuntes o texto con al menos 15 caracteres.',
    };
  }

  if (!ai) {
    // Modo offline / fallback de calidad
    if (type === 'quiz') {
      return {
        success: true,
        items: [
          {
            id: 'gen-' + Date.now() + '-1',
            subject,
            category: 'Apuntes',
            question: `Según el texto facilitado: ¿Cuál es el concepto o indicación prioritaria descrita en el tema?`,
            options: [
              `Aplicar la técnica aséptica y monitorización según el protocolo docente`,
              `Suspender la pauta habitual sin verificar constantes`,
              `Omitir el lavado de manos higiénico`,
              `Proceder sin informar al paciente ni verificar su identidad`,
            ],
            correctIndex: 0,
            explanation: `En la práctica enfermera basada en la evidencia extraída de los apuntes, la técnica aséptica y la seguridad del paciente son siempre prioritarias.`,
            clinicalTip: `Recuerda los 5 momentos del lavado de manos de la OMS y los 10 correctos.`,
          },
          {
            id: 'gen-' + Date.now() + '-2',
            subject,
            category: 'Apuntes',
            question: `¿Qué complicación o signo de alerta debe vigilar la enfermera ante este procedimiento/fármaco?`,
            options: [
              `Alteración brusca de constantes vitales o signos de reacción adversa`,
              `Evolución estrictamente asintomática sin necesidad de registro`,
              `Aumento inmediato de la diuresis fisiológica sin relevancia`,
              `Fiebre fisiológica esperable en todos los pacientes`,
            ],
            correctIndex: 0,
            explanation: `La vigilancia activa de enfermería permite la detección precoz de cualquier deterioro hemodinámico o complicación.`,
            clinicalTip: `Cualquier anomalía debe registrarse en la gráfica del paciente y comunicarse según técnica SBAR.`,
          },
        ].slice(0, count),
        isOfflineFallback: true,
      };
    } else {
      return {
        success: true,
        items: [
          {
            id: 'card-' + Date.now() + '-1',
            subject,
            front: `Concepto Clave del Texto (${subject})`,
            back: `El texto enfatiza la necesidad de un cuidado estructurado, priorización de la seguridad del paciente y seguimiento de protocolos clínicos oficiales.`,
          },
          {
            id: 'card-' + Date.now() + '-2',
            subject,
            front: `Actuación Prioritaria de Enfermería`,
            back: `Verificar constantes vitales, asegurar la asepsia y registrar cualquier incidencia en la historia clínica.`,
          },
        ].slice(0, count),
        isOfflineFallback: true,
      };
    }
  }

  try {
    if (type === 'quiz') {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Eres un docente universitario experto de la Facultad de Enfermería de la UCLM.
Analiza el siguiente texto de apuntes pegado por la alumna Julia H. Carreras y genera exactamente ${count} preguntas tipo test rigurosas, enfocadas en conceptos clave y preguntas típicas de examen de Grado en Enfermería.
Materia: ${subject}.

Texto de los apuntes:
"""
${text.slice(0, 5000)}
"""

Devuelve un JSON con el siguiente formato:
[
  {
    "question": "Enunciado claro de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctIndex": 0,
    "explanation": "Explicación razonada de por qué esa opción es la correcta y por qué las otras son incorrectas",
    "clinicalTip": "Perla clínica o consejo docente para la práctica en el hospital"
  }
]`,
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

      const parsed = JSON.parse(response.text || '[]');
      const items = parsed.map((q: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        subject,
        category: 'Apuntes',
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        clinicalTip: q.clinicalTip || 'Consejo: repasa este concepto en tus esquemas.',
      }));

      return { success: true, items };
    } else {
      // Flashcards
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Eres un profesor de Enfermería de la UCLM.
Genera exactamente ${count} tarjetas flashcards (anverso: pregunta o concepto clave; reverso: respuesta concisa y de alto valor docente) a partir de este texto para Julia H. Carreras:

"""
${text.slice(0, 5000)}
"""

Formato JSON esperado:
[
  {
    "front": "Concepto o pregunta en el anverso",
    "back": "Explicación clara y sintética en el reverso"
  }
]`,
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

      const parsed = JSON.parse(response.text || '[]');
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
    const prompt = `Eres un Médico Adjunto e Instructor de Simulación Clínica Avanzada en el Hospital Universitario de Toledo, evaluando a la alumna de enfermería Julia H. Carreras.
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

    const parsed = JSON.parse(response.text || '{}');
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
A partir de estos datos o texto de una fuente bibliográfica (${sourceType}):
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

    const parsed = JSON.parse(response.text || '{}');
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
// 4. Resumen de Apuntes y Esquemas Clínicos
// -------------------------------------------------------------
export async function summarizeNursingNotes(input: {
  text: string;
  subject?: string;
}) {
  const { text, subject = 'Enfermería' } = input;
  const ai = getGenAI();

  if (!text || text.trim().length < 20) {
    return { success: false, error: 'Pega un fragmento de apuntes con al menos 20 caracteres.' };
  }

  if (!ai) {
    return {
      success: true,
      summary: `### Resumen de Apuntes (${subject})
- **Concepto clave**: Principios fundamentales explicados en el tema.
- **Cuidados de enfermería**: Valoración inicial, higiene de manos, técnica aséptica y registro.
- **Seguridad clínica**: Prevención de caídas, errores de medicación y úlceras por presión.`,
      mnemonics: ['V-D-P-E-E: Valoración, Diagnóstico, Planificación, Ejecución, Evaluación (PAE)'],
      typicalExamQuestions: [
        '¿Cuál es la primera acción de enfermería ante una complicación?',
        '¿Cuáles son las constantes vitales basales y los signos de alarma?',
      ],
      isOfflineFallback: true,
    };
  }

  try {
    const prompt = `Eres un Catedrático y Tutor de Apoyo de la Facultad de Enfermería de la UCLM.
Tu alumna es Julia H. Carreras.
Resume los siguientes apuntes de la asignatura "${subject}" de forma visual, pedagógica y de alto impacto para aprobar sus exámenes y rotatorios:

"""
${text.slice(0, 7000)}
"""

Estructura tu respuesta en formato JSON con:
{
  "title": "Título conciso y claro del tema",
  "executiveSummary": "Resumen ejecutivo de 3-4 párrafos estructurados con negritas y viñetas",
  "keyConcepts": ["Concepto clave 1 con explicación breve", "Concepto clave 2...", "Concepto clave 3..."],
  "normalValuesAndTables": "Tabla o lista de constantes, calibres, dosis o valores de referencia relevantes para enfermería",
  "clinicalMnemonics": ["Regla nemotécnica 1", "Regla nemotécnica 2"],
  "typicalExamQuestions": [
    "Pregunta típica de examen que suelen poner los profesores de la UCLM sobre este tema",
    "Segunda pregunta típica..."
  ],
  "pocketTip": "La regla de oro para recordar en el bolsillo del uniforme en el hospital"
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
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
    const prompt = `Eres un asistente de estudio para Julia H. Carreras, estudiante de 1.º de Enfermería en la UCLM Toledo.
A continuación tienes la transcripción en bruto (o notas de voz dictadas) de una clase de "${subject}" impartida por ${professor}:

"""
${rawTranscript.slice(0, 6000)}
"""

Tu tarea es:
1. Eliminar muletillas, repeticiones y frases incompletas.
2. Estructurar el contenido en títulos, subtítulos, listas con viñetas y términos en negrita.
3. Extraer una sección especial: "⚠️ Posibles Preguntas de Examen (Avisos del profesor)".
4. Extraer "💊 Perlas y Cuidados de Enfermería".

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

    const parsed = JSON.parse(response.text || '{}');
    return { success: true, ...parsed };
  } catch (error: any) {
    console.error('Error in cleanClassTranscript:', error);
    return {
      success: false,
      error: error.message || 'Error al estructurar la clase.',
    };
  }
}
