import { VirtualPatientCase } from '../types';

export const SIMULATION_CASES: VirtualPatientCase[] = [
  {
    id: 'case-anaphylaxis',
    courseYear: 2,
    title: 'Ana Gómez · Sospecha de Anafilaxia / Reacción Adversa a Antibiótico',
    difficulty: 'Intermedio',
    category: 'Urgencias & Seguridad Farmacológica',
    summary: 'Paciente de 45 años en observación de urgencias que comienza con prurito intenso, disnea súbita y sensación de calor en el cuello tras inicio de perfusión de amoxicilina-clavulánico.',
    patient: {
      name: 'Ana Gómez',
      age: 45,
      gender: 'Mujer',
      bed: 'Cama 4 - Observación',
      service: 'Urgencias Hospital Universitario de Toledo',
      allergies: ['Sin alergias conocidas declaradas previamente'],
      history: ['Faringoamigdalitis aguda bacteriana', 'No intervenciones previas'],
      chiefComplaint: '«Siento que se me cierra la garganta y me pica todo el cuerpo»',
      initialVitals: {
        bp: '90/55',
        hr: 118,
        rr: 26,
        spo2: 91,
        temp: 36.8,
        painEva: 2
      }
    },
    stages: [
      {
        stageIndex: 1,
        scenarioText: 'La perfusión de amoxicilina-clavulánico lleva 8 minutos infundiéndose. Ana está visiblemente agitada, con eritema cutáneo generalizado en cuello y tórax, estridor inspiratorio leve y taquicardia.',
        vitals: { bp: '90/55', hr: 118, rr: 26, spo2: 91, temp: 36.8, painEva: 2 },
        recommendedActions: [
          'DETENER INMEDIATAMENTE la perfusión del antibiótico',
          'Pedir ayuda urgente y avisar al médico',
          'Colocar oxigenoterapia en mascarilla con reservorio a 10-15 L/min',
          'Colocar a la paciente en decúbito supino con piernas elevadas (salvo compromiso respiratorio severo)',
          'Mantener la vía venosa permeable con Suero Fisiológico limpio',
          'Tener preparada Adrenalina 1 mg/ml para administración Intramuscular en tercio medio de la cara anterolateral del muslo (0,5 mg)'
        ],
        criticalPitfalls: [
          'Retirar la vía venosa periférica (¡error crítico: se pierde el acceso para medicación de rescate!)',
          'Dejar sola a la paciente para ir a buscar al médico',
          'Continuar la perfusión a menor ritmo creyendo que es un efecto secundario leve'
        ],
        teacherDebrief: 'En cualquier sospecha de reacción anafiláctica a un fármaco IV, la regla de oro es DETENER LA PERFUSIÓN DE INMEDIATO, mantener la vía con suero fisiológico limpio y administrar Adrenalina IM precozmente si hay compromiso de vía aérea o hipotensión.'
      }
    ]
  },
  {
    id: 'case-globo-vesical',
    courseYear: 1,
    title: 'Carlos Mendoza · Dolor y Retención Aguda de Orina Postquirúrgica',
    difficulty: 'Básico',
    category: 'Cirugía & Sondaje Vesical',
    summary: 'Paciente de 68 años intervenido de hernia inguinal hace 7 horas. No ha orinado desde antes de quirófano. Refiere dolor hipogástrico creciente (EVA 8/10), diaforesis e hipertensión reactiva.',
    patient: {
      name: 'Carlos Mendoza',
      age: 68,
      gender: 'Hombre',
      bed: 'Cama 214-B',
      service: 'Cirugía General Hospital Universitario de Toledo',
      allergies: ['No conocidas'],
      history: ['Hipertensión arterial controlada', 'Hiperplasia benigna de próstata (HBP) en tratamiento con tamsulosina'],
      chiefComplaint: '«Tengo muchas ganas de orinar pero no puedo, me va a reventar la tripa»',
      initialVitals: {
        bp: '165/95',
        hr: 96,
        rr: 20,
        spo2: 98,
        temp: 36.5,
        painEva: 8
      }
    },
    stages: [
      {
        stageIndex: 1,
        scenarioText: 'A la palpación supra-púbica notas una masa redondeada, tensa y francamente dolorosa que se extiende hacia el ombligo, mate a la percusión. Don Carlos está sudoroso y angustiado.',
        vitals: { bp: '165/95', hr: 96, rr: 20, spo2: 98, temp: 36.5, painEva: 8 },
        recommendedActions: [
          'Identificar el globo vesical por retención aguda de orina postoperatoria',
          'Informar al médico responsable y al paciente del procedimiento',
          'Preparar batea estéril para sondaje vesical evacuador (catéter Foley o Nelaton ch 14-16)',
          'Realizar higiene genital previa con jabón y clorhexidina acuosa',
          'Lubricar generosamente la uretra masculina con gel anestésico estéril',
          'Pinzar la sonda cada 500-800 ml de evacuación para prevenir la descompresión brusca (hematuria ex vacuo o síncope vagal)'
        ],
        criticalPitfalls: [
          'Administrar analgésicos potentes sin descomprimir la vejiga',
          'Forzar la introducción de la sonda si existe resistencia en uretra prostática',
          'Vaciar más de 1.000 ml de golpe sin pinzamientos intermitentes'
        ],
        teacherDebrief: 'El globo vesical es una causa muy típica de agitación, taquicardia e hipertensión en postoperados. La evacuación pausada previene el sangrado vesicular por descompresión súbita.'
      }
    ]
  },
  {
    id: 'case-hypoglycemia',
    courseYear: 2,
    title: 'Elena Martín · Hipoglucemia Severa en Diabetes Mellitus Tipo 1',
    difficulty: 'Intermedio',
    category: 'Endocrino & Farmacología',
    summary: 'Estudiante de 21 años ingresada por celulitis en pierna. Pautada con insulina glargina y lispro rápida. A las 12:30 refiere mareo súbito, temblor fino, sudoración fría y visión borrosa.',
    patient: {
      name: 'Elena Martín',
      age: 21,
      gender: 'Mujer',
      bed: 'Cama 108',
      service: 'Medicina Interna',
      allergies: ['Penicilina'],
      history: ['Diabetes Mellitus tipo 1 desde los 12 años'],
      chiefComplaint: '«Me tiemblan las manos y veo doble... creo que me está dando una bajada»',
      initialVitals: {
        bp: '100/60',
        hr: 112,
        rr: 18,
        spo2: 99,
        temp: 36.2,
        painEva: 0,
        glycemia: 42
      }
    },
    stages: [
      {
        stageIndex: 1,
        scenarioText: 'Glucemia capilar inmediata: 42 mg/dL. Elena está pálida, sudorosa, responde a órdenes verbales pero se muestra confusa y torpe.',
        vitals: { bp: '100/60', hr: 112, rr: 18, spo2: 99, temp: 36.2, painEva: 0 },
        recommendedActions: [
          'Aplicar la Regla de los 15 (si la paciente conserva la consciencia y puede deglutir): 15 g de hidratos de carbono de absorción rápida (ej. 1 vaso de zumo o agua con 2 sobres de azúcar)',
          'Esperar 15 minutos en reposo absoluto',
          'Repetir la glucemia capilar a los 15 minutos exactos',
          'Si la glucemia es < 70 mg/dL, repetir la toma de 15 g de glucosa rápida',
          'Si la paciente pierde el nivel de consciencia: NUNCA dar nada por boca (riesgo de broncoaspiración); administrar Glucagón 1 mg SC/IM o Glucosado al 50%/33% IV según protocolo de urgencias'
        ],
        criticalPitfalls: [
          'Dar chocolate o bollería grasa (las grasas retrasan la absorción de la glucosa)',
          'Intentar dar líquidos orales a un paciente obnubilado o inconsciente',
          'No comprobar la glucemia a los 15 minutos y dar por resuelto el episodio'
        ],
        teacherDebrief: 'La Regla del 15 es el pilar de enfermería para la hipoglucemia leve-moderada: 15 gramos de hidratos rápidos, esperar 15 minutos, reevaluar. En hipoglucemia grave inconsciente, vía IV con glucosado hipertónico o Glucagón IM.'
      }
    ]
  }
];

// Nuevos casos didácticos. Las actuaciones se orientan a valoración, seguridad,
// comunicación y escalada según protocolos locales; no sustituyen guías clínicas.
type ClinicalCaseSeed = {
  id: string; year: 1 | 2 | 3 | 4; title: string; name: string; age: number;
  gender: 'Mujer' | 'Hombre'; bed: string; service: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado'; category: string; summary: string;
  complaint: string; allergies?: string[]; history?: string[];
  vitals: { bp: string; hr: number; rr: number; spo2: number; temp: number; painEva: number; glycemia?: number };
  scenario: string; actions: string[]; pitfalls: string[]; debrief: string;
};

const createClinicalCase = (seed: ClinicalCaseSeed): VirtualPatientCase => ({
  id: seed.id,
  courseYear: seed.year,
  title: seed.title,
  difficulty: seed.difficulty,
  category: seed.category,
  summary: seed.summary,
  patient: {
    name: seed.name,
    age: seed.age,
    gender: seed.gender,
    bed: seed.bed,
    service: seed.service,
    allergies: seed.allergies || ['No conocidas'],
    history: seed.history || ['Sin antecedentes relevantes conocidos'],
    chiefComplaint: seed.complaint,
    initialVitals: seed.vitals,
  },
  stages: [{
    stageIndex: 1,
    scenarioText: seed.scenario,
    vitals: {
      bp: seed.vitals.bp, hr: seed.vitals.hr, rr: seed.vitals.rr,
      spo2: seed.vitals.spo2, temp: seed.vitals.temp, painEva: seed.vitals.painEva,
    },
    recommendedActions: seed.actions,
    criticalPitfalls: seed.pitfalls,
    teacherDebrief: seed.debrief,
  }],
});

const ADDITIONAL_CASES: VirtualPatientCase[] = [
  // PRIMER CURSO: valoración, higiene, movilización, prevención y cuidados básicos (9 nuevos).
  createClinicalCase({
    id: 'c1-fiebre-valoracion', year: 1, title: 'María Ruiz · Fiebre y valoración inicial', name: 'María Ruiz', age: 72, gender: 'Mujer', bed: 'Medicina 112', service: 'Medicina Interna', difficulty: 'Básico', category: 'Valoración y constantes',
    summary: 'Paciente mayor con fiebre y malestar general. Practicar valoración sistemática, registro y detección de signos de alarma.', complaint: '«Tengo escalofríos y me encuentro muy débil»', history: ['Hipertensión arterial', 'Vive sola'], vitals: { bp: '108/66', hr: 106, rr: 22, spo2: 95, temp: 38.7, painEva: 2 },
    scenario: 'La paciente presenta escalofríos, piel caliente y sensación de debilidad. No hay foco infeccioso claro. Necesitas completar la valoración y reconocer si aparecen datos de deterioro.',
    actions: ['Repetir constantes y valorar tendencia, nivel de consciencia y perfusión', 'Preguntar por síntomas urinarios, respiratorios, digestivos y medicación reciente', 'Comunicar la fiebre y taquicardia al profesional responsable según protocolo', 'Registrar hora, constantes, síntomas y respuesta a las medidas indicadas'],
    pitfalls: ['Atribuir la fiebre a la edad sin explorar posibles focos', 'No repetir constantes tras un cambio clínico', 'Administrar medicación no prescrita o sin comprobar alergias'],
    debrief: 'La valoración inicial requiere constantes completas, estado neurológico, perfusión, búsqueda de foco y registro. La evolución de los parámetros y el contexto determinan la escalada.'
  }),
  createClinicalCase({
    id: 'c1-ortostatismo', year: 1, title: 'Luis Ortega · Mareo al incorporarse', name: 'Luis Ortega', age: 79, gender: 'Hombre', bed: 'Geriatría 204', service: 'Unidad de Geriatría', difficulty: 'Básico', category: 'Movilización segura',
    summary: 'Paciente con mareo y visión borrosa al levantarse tras varios días de ingesta escasa.', complaint: '«Al ponerme de pie se me va la cabeza»', history: ['Diurético habitual', 'Gastroenteritis reciente'], vitals: { bp: '112/70', hr: 88, rr: 18, spo2: 97, temp: 36.4, painEva: 0 },
    scenario: 'Al sentarse en el borde de la cama refiere mareo. Está consciente, pero intenta levantarse sin ayuda. La ingesta ha sido escasa durante las últimas 24 horas.',
    actions: ['Detener la movilización y ayudarle a volver a una posición segura', 'Valorar presión arterial y frecuencia cardiaca en reposo y cambios posturales si está indicado', 'Explorar ingesta, diuresis y medicación; comunicar los hallazgos', 'Acordar movilización acompañada y medidas de prevención de caídas'],
    pitfalls: ['Permitir que camine solo pese al mareo', 'Realizar cambios posturales bruscos', 'Indicar aumento de líquidos sin valorar posibles restricciones'],
    debrief: 'El mareo postural exige seguridad inmediata, valoración hemodinámica y revisión de factores contribuyentes. La movilización debe adaptarse a la tolerancia y al riesgo individual.'
  }),
  createClinicalCase({
    id: 'c1-caida-riesgo', year: 1, title: 'Carmen León · Riesgo de caída en hospitalización', name: 'Carmen León', age: 84, gender: 'Mujer', bed: 'Traumatología 18', service: 'Traumatología', difficulty: 'Básico', category: 'Seguridad del paciente',
    summary: 'Paciente con marcha inestable, urgencia miccional y temor a pedir ayuda.', complaint: '«No quiero molestar; puedo ir sola al baño»', history: ['Artrosis de rodilla', 'Usa bastón en domicilio', 'Tratamiento hipotensor'], vitals: { bp: '128/72', hr: 78, rr: 16, spo2: 98, temp: 36.5, painEva: 3 },
    scenario: 'Encuentras a Carmen intentando levantarse con el gotero conectado. Tiene calzado inadecuado y el timbre está fuera de su alcance.',
    actions: ['Ayudarla a sentarse y valorar equilibrio, dolor y estado general', 'Dejar timbre y objetos personales al alcance', 'Asegurar calzado antideslizante, iluminación y entorno despejado', 'Establecer acompañamiento al baño y comunicar el riesgo al equipo'],
    pitfalls: ['Utilizar sujeciones como primera medida', 'Dejar obstáculos o cables en el recorrido', 'Culpar a la paciente por intentar levantarse'],
    debrief: 'La prevención eficaz combina valoración individual, entorno seguro, educación respetuosa y ayuda para las necesidades previsibles. Las restricciones no son una solución rutinaria.'
  }),
  createClinicalCase({
    id: 'c1-lesion-presion', year: 1, title: 'Antonio Gil · Eritema sacro persistente', name: 'Antonio Gil', age: 81, gender: 'Hombre', bed: 'Medicina 119', service: 'Medicina Interna', difficulty: 'Básico', category: 'Integridad cutánea',
    summary: 'Paciente encamado con eritema sacro que no palidece a la presión.', complaint: '«Me duele la zona baja de la espalda cuando estoy tumbado»', history: ['Movilidad muy limitada', 'Incontinencia urinaria'], vitals: { bp: '132/76', hr: 82, rr: 17, spo2: 97, temp: 36.7, painEva: 4 },
    scenario: 'Durante el aseo observas eritema localizado en sacro, con piel íntegra. El paciente pasa gran parte del día en decúbito supino.',
    actions: ['Inspeccionar y describir localización, aspecto y estado de la piel', 'Descargar la presión de la zona y establecer cambios posturales individualizados', 'Valorar humedad, nutrición, movilidad y riesgo con escala validada del centro', 'Registrar hallazgos y comunicar la lesión para plan preventivo'],
    pitfalls: ['Masajear vigorosamente el eritema', 'Aplicar productos sin indicación ni valoración', 'Mantener la misma postura por comodidad del equipo'],
    debrief: 'La lesión por presión se previene con valoración integral, descarga, control de humedad y nutrición. El eritema no blanqueable requiere registro y plan de cuidados temprano.'
  }),
  createClinicalCase({
    id: 'c1-dolor-postoperatorio', year: 1, title: 'Raúl Pérez · Dolor tras cirugía menor', name: 'Raúl Pérez', age: 56, gender: 'Hombre', bed: 'Cirugía 306', service: 'Cirugía General', difficulty: 'Básico', category: 'Valoración del dolor',
    summary: 'Paciente en el postoperatorio inmediato con dolor abdominal al movilizarse.', complaint: '«Me duele bastante cuando intento girarme»', history: ['Apendicectomía laparoscópica hace 6 horas'], vitals: { bp: '138/84', hr: 98, rr: 20, spo2: 98, temp: 37.1, painEva: 7 },
    scenario: 'Raúl refiere dolor 7/10 al girarse. El apósito está seco y no hay signos evidentes de sangrado. Se muestra temeroso de moverse.',
    actions: ['Valorar dolor con escala, localización, características e impacto funcional', 'Comprobar pauta prescrita, alergias y última dosis antes de administrar analgesia', 'Favorecer postura de confort y explicar movilización progresiva', 'Reevaluar dolor y efectos tras la intervención y registrar'],
    pitfalls: ['Administrar analgesia sin verificar la prescripción', 'Ignorar dolor nuevo, intenso o acompañado de inestabilidad', 'No reevaluar la respuesta'],
    debrief: 'El dolor debe medirse y reevaluarse; su aparición inesperada o asociada a signos de alarma requiere valoración urgente. La movilización segura forma parte de la recuperación.'
  }),
  createClinicalCase({
    id: 'c1-herida-cuidado', year: 1, title: 'Sofía Martín · Cura de herida quirúrgica', name: 'Sofía Martín', age: 63, gender: 'Mujer', bed: 'Cirugía 221', service: 'Cirugía General', difficulty: 'Básico', category: 'Higiene y cura',
    summary: 'Paciente con herida quirúrgica y apósito parcialmente despegado tras la ducha.', complaint: '«He notado el apósito húmedo y me escuece un poco»', history: ['Colecistectomía hace 48 horas', 'Diabetes tipo 2'], vitals: { bp: '124/74', hr: 86, rr: 17, spo2: 98, temp: 37.2, painEva: 3 },
    scenario: 'El apósito está húmedo en un borde. La piel perilesional presenta discreto enrojecimiento, sin secreción purulenta evidente.',
    actions: ['Realizar higiene de manos y preparar material según técnica aséptica', 'Valorar herida, bordes, exudado, olor, dolor y piel circundante', 'Cambiar apósito según protocolo y prescripción del centro', 'Documentar aspecto y comunicar signos sugestivos de infección o dehiscencia'],
    pitfalls: ['Manipular la herida sin higiene de manos', 'Aplicar antisépticos o pomadas no prescritos', 'Ocultar o no registrar cambios en la herida'],
    debrief: 'La cura debe seguir técnica y protocolo local. La valoración sistemática y el registro comparativo permiten detectar infección o dehiscencia precozmente.'
  }),
  createClinicalCase({
    id: 'c1-medicacion-segura', year: 1, title: 'Elena Sanz · Duda antes de administrar medicación', name: 'Elena Sanz', age: 70, gender: 'Mujer', bed: 'Medicina 231', service: 'Medicina Interna', difficulty: 'Básico', category: 'Administración segura',
    summary: 'La paciente detecta que el comprimido preparado no coincide con el color habitual de su medicación.', complaint: '«Esta pastilla no es como la que tomo en casa»', history: ['Polimedicación', 'Hipertensión y dislipemia'], vitals: { bp: '136/78', hr: 76, rr: 16, spo2: 98, temp: 36.6, painEva: 0 },
    scenario: 'En la bandeja hay un comprimido sin identificación individual. La paciente comunica que no reconoce el medicamento.',
    actions: ['Detener la administración hasta identificar el medicamento', 'Verificar identidad, prescripción, dosis, vía, hora y alergias', 'Consultar con enfermería responsable o Farmacia ante cualquier discrepancia', 'Registrar y comunicar la incidencia o casi error según procedimiento'],
    pitfalls: ['Administrar el comprimido porque está en la bandeja', 'Asegurar que el color confirma la identidad', 'No comunicar un casi error'],
    debrief: 'Ante cualquier duda se pausa la administración y se comprueba la prescripción y el producto. La notificación no punitiva de incidentes mejora la seguridad.'
  }),
  createClinicalCase({
    id: 'c1-disfagia-aspiracion', year: 1, title: 'Pablo Núñez · Tos durante la ingesta', name: 'Pablo Núñez', age: 77, gender: 'Hombre', bed: 'Neurología 105', service: 'Neurología', difficulty: 'Básico', category: 'Alimentación y aspiración',
    summary: 'Paciente con tos y voz húmeda al ingerir agua tras un episodio neurológico reciente.', complaint: '«El agua se me va por otro lado»', history: ['Ictus reciente', 'Disartria leve'], vitals: { bp: '142/80', hr: 88, rr: 21, spo2: 94, temp: 36.8, painEva: 0 },
    scenario: 'Durante el desayuno presenta tos repetida y voz húmeda después de beber. Hay restos de líquido en la comisura labial.',
    actions: ['Interrumpir la ingesta oral y mantener al paciente incorporado', 'Valorar respiración, tos, voz y saturación; avisar al equipo responsable', 'Solicitar valoración de deglución antes de reiniciar dieta oral', 'Aplicar medidas de higiene oral y registrar el episodio'],
    pitfalls: ['Continuar ofreciendo agua para comprobar si mejora', 'Tumbar al paciente inmediatamente tras toser', 'Modificar consistencia de dieta sin valoración o indicación'],
    debrief: 'La tos y voz húmeda pueden indicar disfagia con riesgo de aspiración. Se detiene la ingesta y se solicita valoración antes de reanudarla.'
  }),
  createClinicalCase({
    id: 'c1-estrenimiento', year: 1, title: 'Teresa Vidal · Estreñimiento en paciente inmovilizada', name: 'Teresa Vidal', age: 75, gender: 'Mujer', bed: 'Traumatología 16', service: 'Traumatología', difficulty: 'Básico', category: 'Eliminación y confort',
    summary: 'Paciente con estreñimiento de cuatro días tras cirugía ortopédica y reducción de movilidad.', complaint: '«No puedo evacuar y tengo la tripa hinchada»', history: ['Prótesis de cadera reciente', 'Analgesia opioide pautada'], vitals: { bp: '130/76', hr: 84, rr: 17, spo2: 98, temp: 36.7, painEva: 3 },
    scenario: 'Refiere distensión abdominal leve y ausencia de deposición desde la intervención. No presenta vómitos ni dolor intenso en este momento.',
    actions: ['Valorar patrón intestinal, dieta, hidratación permitida y medicación', 'Explorar dolor, distensión, náuseas, vómitos y eliminación de gases', 'Favorecer movilidad e intimidad según tolerancia y plan de cuidados', 'Comunicar persistencia o signos de alarma antes de administrar medidas adicionales'],
    pitfalls: ['Administrar laxantes sin valorar posible obstrucción', 'Ignorar dolor creciente, vómitos o ausencia de gases', 'No preguntar por el patrón intestinal habitual'],
    debrief: 'El estreñimiento hospitalario tiene causas multifactoriales. La valoración debe descartar signos de alarma antes de aplicar intervenciones y fomentar movilidad e hidratación cuando estén permitidas.'
  }),

  // SEGUNDO CURSO: patología médico-quirúrgica, urgencias, farmacología y salud materna (8 nuevos).
  createClinicalCase({
    id: 'c2-asma-aguda', year: 2, title: 'Nuria Campos · Crisis asmática', name: 'Nuria Campos', age: 29, gender: 'Mujer', bed: 'Urgencias Box 3', service: 'Urgencias', difficulty: 'Intermedio', category: 'Respiratorio y urgencias',
    summary: 'Paciente con disnea, sibilancias y dificultad para completar frases tras exposición a un alérgeno conocido.', complaint: '«No consigo coger aire»', history: ['Asma persistente', 'Uso de inhalador de rescate'], vitals: { bp: '146/88', hr: 124, rr: 30, spo2: 90, temp: 36.8, painEva: 0 },
    scenario: 'La paciente está sentada inclinada hacia delante, habla en frases cortas y presenta sibilancias espiratorias. La saturación es baja.',
    actions: ['Solicitar ayuda y valorar ABC, nivel de consciencia y capacidad para hablar', 'Colocar en posición incorporada y monitorizar saturación y constantes', 'Preparar y administrar tratamiento inhalado únicamente según prescripción/protocolo', 'Reevaluar respuesta y escalar de inmediato si empeora o aparece silencio auscultatorio'],
    pitfalls: ['Forzar el decúbito supino', 'Retrasar la ayuda ante dificultad respiratoria marcada', 'Suponer que la disminución de sibilancias siempre implica mejoría'],
    debrief: 'La gravedad se valora por trabajo respiratorio, habla, consciencia, saturación y respuesta al tratamiento. El agotamiento o deterioro requieren escalada urgente.'
  }),
  createClinicalCase({
    id: 'c2-sindrome-coronario', year: 2, title: 'Javier Mora · Dolor torácico opresivo', name: 'Javier Mora', age: 61, gender: 'Hombre', bed: 'Urgencias Box 1', service: 'Urgencias', difficulty: 'Intermedio', category: 'Cardiovascular y urgencias',
    summary: 'Dolor torácico opresivo con irradiación a brazo izquierdo, sudor frío y náuseas.', complaint: '«Tengo un peso en el pecho que no se me pasa»', history: ['Hipertensión', 'Tabaquismo', 'Dislipemia'], vitals: { bp: '158/94', hr: 108, rr: 24, spo2: 94, temp: 36.4, painEva: 8 },
    scenario: 'El paciente está pálido y diaforético, refiere dolor opresivo de 20 minutos de evolución y náuseas. No existe traumatismo.',
    actions: ['Activar circuito de dolor torácico y avisar de inmediato', 'Realizar ECG de 12 derivaciones cuanto antes según circuito asistencial', 'Monitorizar constantes, dolor y ritmo; mantener reposo y acceso venoso según protocolo', 'Preparar analítica y tratamiento prescrito sin retrasar valoración médica'],
    pitfalls: ['Atribuir el dolor a ansiedad o indigestión sin descartar causa cardiaca', 'Permitir deambulación durante el episodio', 'Retrasar ECG y aviso urgente'],
    debrief: 'El dolor torácico sugestivo de síndrome coronario es tiempo-dependiente. La activación del circuito, ECG precoz y vigilancia continua son prioritarios.'
  }),
  createClinicalCase({
    id: 'c2-ictus', year: 2, title: 'Rosa Delgado · Déficit neurológico de inicio súbito', name: 'Rosa Delgado', age: 69, gender: 'Mujer', bed: 'Urgencias Box 5', service: 'Urgencias', difficulty: 'Intermedio', category: 'Neurología y urgencias',
    summary: 'Aparición súbita de desviación facial, debilidad en brazo derecho y alteración del habla.', complaint: '«No puedo mover bien el brazo y no me salen las palabras»', history: ['Fibrilación auricular', 'Hipertensión'], vitals: { bp: '178/98', hr: 112, rr: 20, spo2: 96, temp: 36.6, painEva: 0 },
    scenario: 'La familia indica que estaba bien hace 35 minutos. Presenta asimetría facial y lenguaje alterado. Se desconoce la última dosis de anticoagulante.',
    actions: ['Activar código ictus y registrar hora de inicio/última vez vista bien', 'Valorar ABC, glucemia capilar y escala neurológica según protocolo', 'Mantener ayuno hasta cribado de deglución y preparar traslado a imagen', 'Recoger medicación habitual, anticoagulantes y antecedentes sin retrasar el circuito'],
    pitfalls: ['Ofrecer agua o medicación oral', 'Bajar la presión arterial por iniciativa propia', 'Demorar la activación mientras se completa la historia'],
    debrief: 'El tiempo determina opciones de reperfusión. Hora de inicio, glucemia, evaluación neurológica y activación inmediata son datos clave.'
  }),
  createClinicalCase({
    id: 'c2-pielonefritis-sepsis', year: 2, title: 'Marta Pardo · Infección urinaria con deterioro', name: 'Marta Pardo', age: 67, gender: 'Mujer', bed: 'Medicina 208', service: 'Medicina Interna', difficulty: 'Intermedio', category: 'Infección y sepsis',
    summary: 'Fiebre, dolor lumbar, disuria y deterioro general con hipotensión relativa y taquicardia.', complaint: '«Me duele la espalda y tengo escalofríos al orinar»', history: ['Diabetes tipo 2', 'Infecciones urinarias recurrentes'], vitals: { bp: '96/58', hr: 122, rr: 25, spo2: 95, temp: 39.1, painEva: 6 },
    scenario: 'La paciente está somnolienta, febril y con dolor en flanco derecho. La diuresis de las últimas horas es escasa.',
    actions: ['Reconocer posible sepsis y activar valoración urgente según protocolo', 'Monitorizar constantes, consciencia, perfusión y diuresis', 'Obtener muestras y lactato/cultivos según indicación sin demorar tratamiento', 'Preparar fluidoterapia y antimicrobianos prescritos, reevaluando respuesta'],
    pitfalls: ['Tratarlo como cistitis simple pese a signos de hipoperfusión', 'Retrasar el aviso por esperar resultados', 'No vigilar diuresis ni estado mental'],
    debrief: 'La combinación de infección probable y disfunción orgánica exige detección y escalada temprana. La toma de muestras no debe retrasar las medidas urgentes prescritas.'
  }),
  createClinicalCase({
    id: 'c2-trombosis', year: 2, title: 'Óscar Blanco · Sospecha de trombosis venosa profunda', name: 'Óscar Blanco', age: 58, gender: 'Hombre', bed: 'Traumatología 31', service: 'Traumatología', difficulty: 'Intermedio', category: 'Riesgo tromboembólico',
    summary: 'Dolor y aumento de volumen unilateral en pantorrilla tras cirugía ortopédica reciente.', complaint: '«Tengo una pantorrilla más hinchada y me duele al apoyar»', history: ['Artroplastia de rodilla hace 5 días', 'Movilidad reducida'], vitals: { bp: '132/78', hr: 102, rr: 20, spo2: 95, temp: 37.4, painEva: 5 },
    scenario: 'La pantorrilla izquierda está aumentada de tamaño, caliente y dolorosa. El paciente refiere nueva sensación de falta de aire al caminar al baño.',
    actions: ['Valorar extremidad y síntomas respiratorios; avisar con prioridad', 'Monitorizar constantes y saturación; limitar esfuerzos hasta valoración', 'Preparar pruebas y tratamiento conforme a indicación médica', 'Documentar inicio, lateralidad, perímetro si procede y factores de riesgo'],
    pitfalls: ['Masajear la pantorrilla', 'Aplicar compresión o movilización intensa sin valoración', 'Ignorar disnea o dolor torácico de nueva aparición'],
    debrief: 'La sospecha de trombosis requiere evaluación clínica y pruebas. La disnea puede indicar embolia pulmonar y exige escalada inmediata.'
  }),
  createClinicalCase({
    id: 'c2-hemorragia-posparto', year: 2, title: 'Lucía Ferrer · Sangrado abundante en puerperio', name: 'Lucía Ferrer', age: 32, gender: 'Mujer', bed: 'Paritorio 2', service: 'Obstetricia', difficulty: 'Avanzado', category: 'Salud materna y urgencias',
    summary: 'Aumento súbito del sangrado vaginal tras parto vaginal, con palidez y taquicardia.', complaint: '«Estoy empapando la compresa y me siento mareada»', history: ['Parto vaginal hace 40 minutos', 'Anemia ferropénica en embarazo'], vitals: { bp: '92/56', hr: 128, rr: 24, spo2: 96, temp: 36.5, painEva: 4 },
    scenario: 'Se observa sangrado abundante con coágulos. El útero parece aumentado de tamaño y la paciente está pálida y ansiosa.',
    actions: ['Activar protocolo de hemorragia posparto y pedir ayuda obstétrica inmediata', 'Valorar tono uterino, cuantificar sangrado y monitorizar constantes', 'Mantener accesos y preparar analítica/hemoderivados según protocolo', 'Acompañar a la paciente y registrar tiempos, pérdidas e intervenciones'],
    pitfalls: ['Esperar a que se complete una compresa para avisar', 'Dejar sola a la paciente', 'Retrasar activación del protocolo mientras se intenta cuantificar con exactitud'],
    debrief: 'La hemorragia posparto es una emergencia tiempo-dependiente. Activación precoz, cuantificación orientativa, monitorización y trabajo coordinado reducen retrasos.'
  }),
  createClinicalCase({
    id: 'c2-preeclampsia', year: 2, title: 'Eva Ríos · Cefalea e hipertensión en gestante', name: 'Eva Ríos', age: 30, gender: 'Mujer', bed: 'Obstetricia 6', service: 'Urgencias Obstétricas', difficulty: 'Avanzado', category: 'Salud materna y urgencias',
    summary: 'Gestante de 35 semanas con cefalea intensa, fosfenos y cifras tensionales elevadas.', complaint: '«Veo luces y me duele muchísimo la cabeza»', history: ['Gestación de 35 semanas', 'Hipertensión gestacional en seguimiento'], vitals: { bp: '168/112', hr: 104, rr: 22, spo2: 97, temp: 36.7, painEva: 8 },
    scenario: 'La gestante refiere cefalea persistente y alteraciones visuales. Presenta edema en manos y cifras de presión arterial muy elevadas.',
    actions: ['Avisar de inmediato al equipo obstétrico y activar circuito de emergencia hipertensiva', 'Repetir presión arterial con técnica correcta y valorar síntomas neurológicos', 'Iniciar monitorización materna y fetal según protocolo', 'Preparar medicación y analítica indicadas y mantener entorno seguro'],
    pitfalls: ['Restar importancia a la cefalea o los fosfenos', 'Dejar a la gestante sin vigilancia', 'Administrar tratamiento fuera de prescripción o protocolo'],
    debrief: 'La hipertensión grave con síntomas neurológicos en gestante sugiere preeclampsia con criterios de gravedad. Requiere valoración obstétrica urgente y vigilancia materno-fetal.'
  }),
  createClinicalCase({
    id: 'c2-epoc-exacerbacion', year: 2, title: 'Manuel Prieto · Exacerbación de EPOC', name: 'Manuel Prieto', age: 73, gender: 'Hombre', bed: 'Urgencias Box 7', service: 'Urgencias', difficulty: 'Intermedio', category: 'Respiratorio y farmacología',
    summary: 'Paciente con EPOC que presenta aumento de disnea, tos y expectoración purulenta.', complaint: '«Me ahogo mucho más que ayer y el esputo está más oscuro»', history: ['EPOC grave', 'Oxigenoterapia domiciliaria nocturna', 'Exfumador'], vitals: { bp: '150/86', hr: 116, rr: 28, spo2: 86, temp: 37.8, painEva: 1 },
    scenario: 'El paciente utiliza musculatura accesoria y presenta espiración prolongada. Está inquieto y habla en frases cortas.',
    actions: ['Valorar ABC y avisar al equipo por dificultad respiratoria', 'Administrar oxígeno de forma controlada según objetivo y protocolo individual', 'Monitorizar saturación, consciencia y respuesta; preparar gasometría si se indica', 'Preparar broncodilatadores y otros tratamientos prescritos, vigilando efectos'],
    pitfalls: ['Aplicar oxígeno a alto flujo sin objetivo ni reevaluación', 'Retrasar escalada ante somnolencia o agotamiento', 'No revisar el objetivo de saturación documentado'],
    debrief: 'En EPOC la oxigenoterapia se individualiza y se reevalúa. La somnolencia, fatiga y empeoramiento del trabajo respiratorio son señales de alarma.'
  }),

  // TERCER CURSO: complejidad, cronicidad, pediatría, salud mental y cuidados especializados (10).
  createClinicalCase({
    id: 'c3-insuficiencia-cardiaca', year: 3, title: 'Pilar Gómez · Descompensación de insuficiencia cardiaca', name: 'Pilar Gómez', age: 80, gender: 'Mujer', bed: 'Cardiología 412', service: 'Cardiología', difficulty: 'Avanzado', category: 'Cardiovascular y cronicidad',
    summary: 'Disnea en reposo, ortopnea, edemas y aumento rápido de peso en paciente con insuficiencia cardiaca.', complaint: '«No puedo dormir tumbada porque me falta el aire»', history: ['Insuficiencia cardiaca con fracción de eyección reducida', 'Fibrilación auricular', 'Enfermedad renal crónica'], vitals: { bp: '164/92', hr: 118, rr: 30, spo2: 88, temp: 36.9, painEva: 0 },
    scenario: 'La paciente está sentada, presenta crepitantes bibasales, edemas maleolares y dificultad para hablar en frases completas.',
    actions: ['Solicitar valoración urgente y colocar en posición incorporada', 'Monitorizar ECG, saturación, constantes, diuresis y balance hídrico', 'Preparar oxigenoterapia y tratamiento prescrito según respuesta clínica', 'Registrar peso reciente, ingesta, diuresis y evolución respiratoria'],
    pitfalls: ['Colocar en decúbito supino', 'Administrar líquidos sin comprobar el plan', 'No valorar función renal, diuresis ni balance'],
    debrief: 'La descompensación puede evolucionar a edema agudo de pulmón. Posición incorporada, monitorización y tratamiento protocolizado son prioritarios.'
  }),
  createClinicalCase({
    id: 'c3-delirium', year: 3, title: 'Ángel Romero · Confusión aguda en persona mayor', name: 'Ángel Romero', age: 86, gender: 'Hombre', bed: 'Geriatría 205', service: 'Geriatría', difficulty: 'Avanzado', category: 'Geriatría y valoración integral',
    summary: 'Cambio brusco de atención y conducta durante la noche en paciente previamente orientado.', complaint: '«¿Por qué me habéis encerrado aquí? Tengo que ir a casa»', history: ['Deterioro auditivo', 'Infección respiratoria en tratamiento', 'Cambio reciente de medicación'], vitals: { bp: '104/62', hr: 110, rr: 22, spo2: 93, temp: 38.2, painEva: 0 },
    scenario: 'Ángel alterna somnolencia y agitación, no mantiene la atención y no reconoce la habitación. La familia describe un cambio agudo respecto a su estado basal.',
    actions: ['Valorar inicio, fluctuación, atención y nivel de consciencia; avisar al equipo', 'Buscar causas precipitantes: infección, hipoxia, dolor, retención, estreñimiento o fármacos', 'Asegurar entorno tranquilo, reloj, gafas/audífonos y presencia familiar si es posible', 'Prevenir caídas y evitar sujeciones o sedación salvo indicación excepcional'],
    pitfalls: ['Etiquetar la confusión como demencia sin estudiar el cambio agudo', 'Discutir o confrontar al paciente', 'Administrar sedantes de forma automática'],
    debrief: 'El delirium es un síndrome agudo y fluctuante que suele tener causa médica. La identificación de precipitantes, medidas no farmacológicas y seguridad son esenciales.'
  }),
  createClinicalCase({
    id: 'c3-bronquiolitis', year: 3, title: 'Hugo Serrano · Lactante con bronquiolitis', name: 'Hugo Serrano', age: 7, gender: 'Hombre', bed: 'Pediatría 8', service: 'Pediatría', difficulty: 'Intermedio', category: 'Enfermería infantil',
    summary: 'Lactante con rinorrea, tos, dificultad para alimentarse y aumento del trabajo respiratorio.', complaint: 'La madre refiere: «Respira muy deprisa y deja el biberón a medias»', history: ['Prematuro tardío de 35 semanas', 'Primer episodio de sibilancias'], vitals: { bp: '82/48', hr: 164, rr: 58, spo2: 91, temp: 37.7, painEva: 0 },
    scenario: 'El lactante presenta tiraje subcostal, aleteo nasal leve y mucosidad abundante. Ha mojado menos pañales en las últimas horas.',
    actions: ['Valorar trabajo respiratorio, pausas, coloración y saturación', 'Realizar higiene nasal y facilitar tomas pequeñas solo si la respiración lo permite', 'Monitorizar hidratación, diuresis y tolerancia oral', 'Avisar por apnea, agotamiento, cianosis, mala perfusión o empeoramiento'],
    pitfalls: ['Forzar tomas cuando existe dificultad respiratoria importante', 'No vigilar signos de deshidratación', 'Aspirar secreciones de forma traumática o rutinaria sin indicación'],
    debrief: 'La bronquiolitis se maneja principalmente con soporte y vigilancia. La dificultad respiratoria, apnea y deshidratación determinan necesidad de escalada.'
  }),
  createClinicalCase({
    id: 'c3-gastroenteritis-pediatrica', year: 3, title: 'Irene Vidal · Deshidratación por gastroenteritis', name: 'Irene Vidal', age: 3, gender: 'Mujer', bed: 'Pediatría 3', service: 'Pediatría', difficulty: 'Intermedio', category: 'Enfermería infantil',
    summary: 'Niña con vómitos y diarrea de 24 horas, mucosas secas y reducción de diuresis.', complaint: 'La familia refiere: «No quiere beber y apenas ha hecho pis»', history: ['Sin enfermedades crónicas', 'Vacunación al día según familia'], vitals: { bp: '88/54', hr: 138, rr: 28, spo2: 98, temp: 37.8, painEva: 2 },
    scenario: 'La niña está irritable, tiene mucosas secas, ojos algo hundidos y relleno capilar enlentecido. Ha presentado seis deposiciones líquidas.',
    actions: ['Valorar estado general, perfusión, mucosas, peso y diuresis', 'Cuantificar pérdidas y tolerancia a pequeños volúmenes de solución de rehidratación prescrita', 'Mantener precauciones de higiene y aislamiento según agente sospechado', 'Avisar ante letargo, mala perfusión, vómitos persistentes o incapacidad para beber'],
    pitfalls: ['Sustituir solución de rehidratación por bebidas azucaradas', 'No registrar pérdidas y diuresis', 'Demorar valoración si aparecen signos de shock'],
    debrief: 'La rehidratación oral fraccionada es útil cuando se tolera; la evaluación clínica continua identifica deshidratación grave y necesidad de tratamiento supervisado.'
  }),
  createClinicalCase({
    id: 'c3-pie-diabetico', year: 3, title: 'Francisco Lara · Úlcera en pie diabético', name: 'Francisco Lara', age: 64, gender: 'Hombre', bed: 'Endocrino 302', service: 'Endocrinología', difficulty: 'Avanzado', category: 'Heridas y diabetes',
    summary: 'Lesión plantar en paciente con diabetes, neuropatía y signos locales de infección.', complaint: '«No me duele mucho, pero el calcetín sale manchado»', history: ['Diabetes tipo 2 de larga evolución', 'Neuropatía periférica', 'Enfermedad arterial periférica'], vitals: { bp: '142/82', hr: 102, rr: 20, spo2: 97, temp: 38.0, painEva: 2, glycemia: 238 },
    scenario: 'Se observa úlcera plantar con exudado y eritema perilesional. El paciente camina apoyando sobre la lesión y refiere poca sensibilidad.',
    actions: ['Valorar tamaño, profundidad visible, exudado, piel y perfusión del pie', 'Evitar apoyo sobre la lesión y coordinar descarga según indicación', 'Comprobar glucemia y signos sistémicos de infección', 'Comunicar con prioridad y seguir plan de cura y valoración vascular'],
    pitfalls: ['Desbridar o manipular tejido sin competencia/indicación', 'Ignorar la lesión por ausencia de dolor', 'Permitir que continúe la presión sobre la úlcera'],
    debrief: 'La neuropatía puede ocultar gravedad. La evaluación de infección, perfusión, descarga y control metabólico requiere abordaje multidisciplinar.'
  }),
  createClinicalCase({
    id: 'c3-ostomia', year: 3, title: 'Beatriz Cano · Problemas con ileostomía', name: 'Beatriz Cano', age: 55, gender: 'Mujer', bed: 'Digestivo 214', service: 'Cirugía Digestiva', difficulty: 'Intermedio', category: 'Cuidados especializados',
    summary: 'Paciente con ileostomía reciente, débito elevado y piel periestomal irritada.', complaint: '«La bolsa se llena muy rápido y me escuece la piel»', history: ['Ileostomía hace 6 días', 'Enfermedad de Crohn'], vitals: { bp: '98/62', hr: 112, rr: 19, spo2: 98, temp: 37.3, painEva: 3 },
    scenario: 'La bolsa contiene gran cantidad de efluente líquido. La mucosa está rosada, pero hay irritación de piel y la paciente refiere sed y mareo.',
    actions: ['Cuantificar débito y valorar signos de deshidratación y balance', 'Inspeccionar estoma y piel periestomal; revisar ajuste del dispositivo', 'Comunicar débito elevado y preparar analítica/rehidratación según indicación', 'Educar sobre vaciado, protección cutánea y signos de alarma antes del alta'],
    pitfalls: ['Ignorar pérdidas elevadas por estoma', 'Ajustar la bolsa sobre piel húmeda o lesionada', 'Dar recomendaciones dietéticas universales sin individualizar'],
    debrief: 'El alto débito de ileostomía puede causar deshidratación y alteraciones electrolíticas. Medición, cuidado cutáneo y educación son pilares del seguimiento.'
  }),
  createClinicalCase({
    id: 'c3-hiperpotasemia', year: 3, title: 'Ramón Sáez · Hiperpotasemia en enfermedad renal', name: 'Ramón Sáez', age: 71, gender: 'Hombre', bed: 'Nefrología 109', service: 'Nefrología', difficulty: 'Avanzado', category: 'Renal y monitorización',
    summary: 'Paciente renal con debilidad, potasio elevado informado y cambios electrocardiográficos.', complaint: '«Me noto flojo y tengo palpitaciones»', history: ['Enfermedad renal crónica estadio avanzado', 'Diabetes tipo 2', 'Tratamiento con fármacos que elevan potasio'], vitals: { bp: '108/66', hr: 54, rr: 18, spo2: 97, temp: 36.5, painEva: 0 },
    scenario: 'El laboratorio comunica potasio muy elevado y el monitor muestra ondas T picudas y bradicardia. El paciente está consciente, pero débil.',
    actions: ['Avisar de inmediato y mantener monitorización ECG continua', 'Comprobar muestra/resultado según protocolo sin retrasar la respuesta urgente', 'Revisar medicación y función renal con el equipo', 'Preparar tratamiento prescrito y vigilar ritmo, glucemia y respuesta'],
    pitfalls: ['Esperar a que aparezcan síntomas más graves', 'Administrar potasio o soluciones con potasio', 'No monitorizar ECG durante la corrección'],
    debrief: 'La hiperpotasemia con alteraciones ECG es una emergencia arrítmica. La vigilancia continua y la preparación de tratamiento urgente son prioritarias.'
  }),
  createClinicalCase({
    id: 'c3-crisis-salud-mental', year: 3, title: 'Daniela Cruz · Crisis emocional y riesgo autolítico', name: 'Daniela Cruz', age: 24, gender: 'Mujer', bed: 'Urgencias Salud Mental 2', service: 'Urgencias de Salud Mental', difficulty: 'Avanzado', category: 'Salud mental y seguridad',
    summary: 'Paciente que verbaliza desesperanza y pensamientos de hacerse daño tras una crisis personal.', complaint: '«No veo salida y he pensado que sería mejor no estar»', history: ['Episodio depresivo previo', 'Interrupción reciente del seguimiento'], vitals: { bp: '124/78', hr: 96, rr: 18, spo2: 99, temp: 36.7, painEva: 0 },
    scenario: 'La paciente llora, evita el contacto visual y reconoce pensamientos autolíticos. No se conoce si existe plan, medios disponibles o intención actual.',
    actions: ['Escuchar sin juzgar y preguntar de forma directa y calmada por riesgo inmediato', 'No dejarla sola y activar valoración urgente de salud mental', 'Retirar riesgos ambientales de forma segura y mantener observación según protocolo', 'Documentar expresiones y factores protectores, implicando apoyos según valoración'],
    pitfalls: ['Minimizar o prometer secreto absoluto', 'Dejarla sola mientras se busca ayuda', 'Juzgar, culpabilizar o usar frases tranquilizadoras vacías'],
    debrief: 'La pregunta directa no induce conducta suicida. La prioridad es seguridad, acompañamiento, evaluación profesional y comunicación clara.'
  }),
  createClinicalCase({
    id: 'c3-ulcera-presion-avanzada', year: 3, title: 'Josefa Marín · Lesión por presión con exudado', name: 'Josefa Marín', age: 88, gender: 'Mujer', bed: 'Geriatría 121', service: 'Geriatría', difficulty: 'Avanzado', category: 'Heridas y dependencia',
    summary: 'Paciente dependiente con lesión sacra profunda, exudado y dolor durante los cambios posturales.', complaint: '«Me escuece mucho cuando me cambiáis de postura»', history: ['Dependencia severa', 'Malnutrición', 'Incontinencia doble'], vitals: { bp: '110/64', hr: 100, rr: 20, spo2: 96, temp: 37.6, painEva: 6 },
    scenario: 'La lesión sacra presenta pérdida de espesor cutáneo y exudado. La paciente tiene dolor y alto riesgo nutricional.',
    actions: ['Valorar y documentar lesión según clasificación validada y protocolo', 'Realizar descarga de presión y plan individualizado de cambios posturales', 'Valorar dolor, humedad, nutrición y signos locales/sistémicos de infección', 'Coordinar cura avanzada, soporte nutricional y objetivos con equipo y familia'],
    pitfalls: ['Clasificar profundidad sin formación o sin visualizar el lecho', 'Usar dispositivos en anillo que concentran presión', 'No tratar el dolor antes de movilizaciones/curas'],
    debrief: 'Las lesiones complejas precisan valoración experta, alivio de presión, control de humedad, soporte nutricional y analgesia planificada.'
  }),
  createClinicalCase({
    id: 'c3-extravasacion', year: 3, title: 'Mónica Rey · Sospecha de extravasación de citostático', name: 'Mónica Rey', age: 49, gender: 'Mujer', bed: 'Hospital de Día Oncológico 5', service: 'Oncología', difficulty: 'Avanzado', category: 'Oncología y seguridad farmacológica',
    summary: 'Durante una perfusión antineoplásica aparece dolor, edema y eritema alrededor del acceso periférico.', complaint: '«Me quema justo donde está la vía»', history: ['Cáncer de mama en tratamiento', 'Acceso venoso periférico'], vitals: { bp: '126/74', hr: 92, rr: 18, spo2: 98, temp: 36.6, painEva: 6 },
    scenario: 'La paciente señala dolor creciente en el punto de punción y se observa edema local. La perfusión continúa conectada.',
    actions: ['Detener inmediatamente la perfusión y activar protocolo de extravasación', 'No retirar el catéter hasta seguir las instrucciones del protocolo para aspiración/antídoto', 'Identificar fármaco, hora, volumen estimado y extensión del área', 'Avisar al equipo oncológico y documentar/evaluar la zona según protocolo'],
    pitfalls: ['Lavar la vía o presionar la zona sin indicación', 'Retirar el catéter antes de valorar aspiración del fármaco', 'Reiniciar la perfusión por el mismo acceso'],
    debrief: 'La actuación ante extravasación depende del citostático. Detener la infusión, conservar el acceso inicialmente y seguir el protocolo específico evita agravar el daño.'
  }),

  // CUARTO CURSO: coordinación, paciente crítico, situaciones complejas y continuidad (10).
  createClinicalCase({
    id: 'c4-shock-septico', year: 4, title: 'Andrés Vega · Shock séptico probable', name: 'Andrés Vega', age: 66, gender: 'Hombre', bed: 'UCI Box 4', service: 'UCI', difficulty: 'Avanzado', category: 'Paciente crítico y sepsis',
    summary: 'Paciente con infección respiratoria, hipotensión persistente, hipoperfusión y alteración del estado mental.', complaint: '«Me cuesta respirar y no sé dónde estoy»', history: ['Diabetes tipo 2', 'EPOC', 'Fiebre de dos días'], vitals: { bp: '78/42', hr: 138, rr: 32, spo2: 88, temp: 39.3, painEva: 1 },
    scenario: 'Presenta piel fría y moteada, oliguria y confusión. La presión arterial permanece baja tras medidas iniciales.',
    actions: ['Activar equipo de respuesta rápida/código sepsis y asignar roles claros', 'Monitorizar ECG, presión, saturación, temperatura, consciencia y diuresis', 'Obtener muestras, lactato y cultivos según protocolo sin retrasar antimicrobianos', 'Preparar fluidos, vasopresores y soporte respiratorio bajo indicación y reevaluación frecuente'],
    pitfalls: ['Retrasar escalada o antimicrobianos por trámites', 'Administrar fluidos sin reevaluación en paciente con comorbilidad cardiaca/renal', 'No medir respuesta clínica ni diuresis'],
    debrief: 'El shock séptico requiere respuesta coordinada, tratamiento tiempo-dependiente y reevaluación dinámica de perfusión, respiración y balance.'
  }),
  createClinicalCase({
    id: 'c4-politrauma', year: 4, title: 'Sergio Molina · Politraumatismo tras accidente', name: 'Sergio Molina', age: 34, gender: 'Hombre', bed: 'Box Trauma 1', service: 'Urgencias / Trauma', difficulty: 'Avanzado', category: 'Trauma y coordinación',
    summary: 'Paciente politraumatizado con dolor torácico, deformidad en miembro inferior y signos de hipoperfusión.', complaint: '«No puedo respirar bien y me duele la pierna»', history: ['Accidente de tráfico de alta energía', 'Sin datos iniciales de alergias'], vitals: { bp: '86/50', hr: 132, rr: 30, spo2: 90, temp: 35.8, painEva: 9 },
    scenario: 'El paciente llega inmovilizado, pálido y agitado. Hay deformidad de muslo y ventilación asimétrica. Se activa equipo de trauma.',
    actions: ['Participar en valoración XABCDE con líder de equipo y control de hemorragia externa', 'Mantener protección cervical y evaluar ventilación/perfusión sin movilizaciones innecesarias', 'Preparar accesos, analítica, calentamiento y hemoderivados según protocolo', 'Realizar reevaluación tras cada intervención y comunicar cambios en circuito cerrado'],
    pitfalls: ['Priorizar la fractura visible frente a amenazas vitales', 'Retirar inmovilización sin indicación', 'No prevenir hipotermia ni documentar tiempos'],
    debrief: 'El manejo del trauma sigue prioridades sistemáticas. La hemorragia, vía aérea, ventilación y shock se abordan antes que lesiones no vitales.'
  }),
  createClinicalCase({
    id: 'c4-uci-ventilacion', year: 4, title: 'Clara Nieto · Deterioro súbito en paciente ventilado', name: 'Clara Nieto', age: 59, gender: 'Mujer', bed: 'UCI Box 7', service: 'UCI', difficulty: 'Avanzado', category: 'Cuidados intensivos',
    summary: 'Paciente intubada con alarma de presión elevada, caída de saturación y aumento de presión arterial.', complaint: 'Paciente sedada; monitor con alarma de alta presión y desaturación', history: ['Neumonía grave', 'Ventilación mecánica invasiva'], vitals: { bp: '158/88', hr: 126, rr: 28, spo2: 84, temp: 38.1, painEva: 0 },
    scenario: 'La alarma de presión alta persiste, la curva de ventilación cambia y la saturación cae. Se observa secreción en el tubo.',
    actions: ['Pedir ayuda inmediata y evaluar paciente/ventilador con enfoque sistemático', 'Comprobar conexiones, acodamientos, mordida, secreciones y expansión torácica', 'Asegurar oxigenación y ventilación siguiendo protocolo de UCI y liderazgo clínico', 'Preparar aspiración y material de vía aérea; reevaluar tras cada maniobra'],
    pitfalls: ['Silenciar alarmas sin evaluar al paciente', 'Desconectar el ventilador sin plan ni apoyo', 'Aspirar de forma repetida sin indicación ni técnica adecuada'],
    debrief: 'Las alarmas deben interpretarse junto al estado del paciente. La valoración sistemática y el trabajo coordinado permiten detectar obstrucción, broncoespasmo o fallo del circuito.'
  }),
  createClinicalCase({
    id: 'c4-hemorragia-postop', year: 4, title: 'Miguel Torres · Hemorragia postoperatoria', name: 'Miguel Torres', age: 68, gender: 'Hombre', bed: 'Reanimación 2', service: 'Reanimación Postquirúrgica', difficulty: 'Avanzado', category: 'Postoperatorio crítico',
    summary: 'Aumento brusco del drenaje hemático, hipotensión y taquicardia tras cirugía abdominal mayor.', complaint: '«Me siento muy mareado y tengo frío»', history: ['Colectomía hace 3 horas', 'Anticoagulación suspendida perioperatoriamente'], vitals: { bp: '84/48', hr: 132, rr: 26, spo2: 93, temp: 35.9, painEva: 5 },
    scenario: 'El drenaje ha aumentado rápidamente, el apósito está saturado y el paciente presenta palidez y sudoración fría.',
    actions: ['Activar respuesta urgente y avisar al cirujano/anestesia', 'Valorar ABC, cuantificar pérdidas, revisar drenajes y constantes seriadas', 'Comprobar accesos y preparar analítica/hemoderivados según protocolo', 'Mantener abrigo, monitorización continua y registro de tiempos y pérdidas'],
    pitfalls: ['Retirar o pinzar drenajes sin indicación', 'Esperar a que la presión arterial descienda más', 'No comunicar la tendencia del sangrado'],
    debrief: 'La hemorragia postoperatoria se detecta por tendencias, no solo por una cifra aislada. La comunicación temprana y preparación de soporte hemostático son fundamentales.'
  }),
  createClinicalCase({
    id: 'c4-edema-pulmonar', year: 4, title: 'Amparo Gil · Edema agudo de pulmón', name: 'Amparo Gil', age: 76, gender: 'Mujer', bed: 'UCI Intermedia 3', service: 'Unidad Coronaria', difficulty: 'Avanzado', category: 'Emergencias cardiovasculares',
    summary: 'Disnea extrema de inicio brusco, ortopnea, crepitantes difusos y expectoración espumosa.', complaint: '«Me ahogo, no puedo respirar tumbada»', history: ['Insuficiencia cardiaca', 'Hipertensión', 'Enfermedad renal crónica'], vitals: { bp: '196/110', hr: 128, rr: 36, spo2: 78, temp: 36.8, painEva: 0 },
    scenario: 'La paciente está sentada, muy angustiada, con sudoración y crepitantes difusos. La saturación es críticamente baja.',
    actions: ['Activar equipo de emergencia y mantener posición incorporada', 'Administrar soporte de oxígeno/ventilación no invasiva según indicación y protocolo', 'Monitorizar ECG, presión, saturación y respuesta minuto a minuto', 'Preparar tratamiento prescrito y valorar diuresis y función renal'],
    pitfalls: ['Tumbar a la paciente para facilitar exploración', 'Demorar soporte respiratorio ante hipoxemia grave', 'Administrar fluidos sin indicación'],
    debrief: 'El edema agudo de pulmón es una emergencia respiratoria y cardiovascular. La posición, soporte ventilatorio, monitorización y tratamiento precoz son determinantes.'
  }),
  createClinicalCase({
    id: 'c4-cetoacidosis', year: 4, title: 'David Salas · Cetoacidosis diabética', name: 'David Salas', age: 22, gender: 'Hombre', bed: 'UCI Box 2', service: 'UCI', difficulty: 'Avanzado', category: 'Endocrino y paciente crítico',
    summary: 'Paciente con diabetes tipo 1, vómitos, respiración profunda, deshidratación y glucemia elevada.', complaint: '«Tengo mucha sed, me duele la tripa y respiro raro»', history: ['Diabetes tipo 1', 'Omisión de insulina por enfermedad intercurrente'], vitals: { bp: '92/58', hr: 132, rr: 30, spo2: 98, temp: 37.2, painEva: 4, glycemia: 486 },
    scenario: 'Presenta respiración de Kussmaul, aliento cetónico, mucosas secas y vómitos. La analítica urgente está pendiente.',
    actions: ['Avisar y activar protocolo de cetoacidosis; monitorizar y valorar estado neurológico', 'Comprobar glucemia, cetonas, gasometría y electrolitos según protocolo', 'Preparar fluidoterapia e insulinoterapia IV prescritas con doble verificación', 'Vigilar potasio, ECG, glucemia horaria y signos de edema cerebral'],
    pitfalls: ['Administrar insulina sin conocer potasio ni seguir protocolo', 'Corregir glucemia sin vigilar electrolitos', 'No realizar doble verificación de bomba/insulina'],
    debrief: 'La cetoacidosis requiere reposición de volumen, insulina y vigilancia estrecha de electrolitos. El potasio condiciona la seguridad de la insulinoterapia.'
  }),
  createClinicalCase({
    id: 'c4-hipertermia-maligna', year: 4, title: 'Adrián Campos · Sospecha de hipertermia maligna', name: 'Adrián Campos', age: 42, gender: 'Hombre', bed: 'Quirófano 3', service: 'Anestesia y Reanimación', difficulty: 'Avanzado', category: 'Emergencia perioperatoria',
    summary: 'Durante anestesia general aparecen aumento rápido del CO₂ espirado, rigidez muscular y taquicardia.', complaint: 'Paciente anestesiado; monitor con aumento brusco de EtCO₂', history: ['Intervención programada', 'Antecedentes familiares anestésicos no aclarados'], vitals: { bp: '168/96', hr: 148, rr: 24, spo2: 94, temp: 38.2, painEva: 0 },
    scenario: 'El EtCO₂ aumenta pese a ventilación, aparece rigidez muscular y la temperatura comienza a elevarse. Anestesia sospecha hipertermia maligna.',
    actions: ['Activar protocolo de hipertermia maligna y pedir carro específico', 'Ayudar a suspender agentes desencadenantes según dirección de anestesia', 'Preparar dantroleno, enfriamiento y monitorización conforme a protocolo', 'Controlar temperatura, gases, potasio, CK y diuresis según indicación'],
    pitfalls: ['Esperar a fiebre muy alta para activar protocolo', 'Retrasar preparación del dantroleno', 'Enfriar de forma excesiva sin monitorizar temperatura'],
    debrief: 'La hipertermia maligna se reconoce por hipercapnia rápida, taquicardia y rigidez; la fiebre puede ser tardía. La respuesta debe ser inmediata y coordinada.'
  }),
  createClinicalCase({
    id: 'c4-infeccion-cateter', year: 4, title: 'Beatriz López · Bacteriemia asociada a catéter', name: 'Beatriz López', age: 63, gender: 'Mujer', bed: 'UCI Box 5', service: 'UCI', difficulty: 'Avanzado', category: 'Control de infecciones',
    summary: 'Paciente con catéter venoso central que desarrolla escalofríos durante la conexión de una perfusión y fiebre.', complaint: '«Me ha entrado un escalofrío muy fuerte de golpe»', history: ['Nutrición parenteral', 'Catéter venoso central hace 12 días', 'Neoplasia hematológica'], vitals: { bp: '92/54', hr: 124, rr: 26, spo2: 94, temp: 39.0, painEva: 1 },
    scenario: 'La paciente desarrolla escalofríos intensos durante la manipulación del catéter. El punto de inserción está discretamente eritematoso.',
    actions: ['Valorar estabilidad, avisar por posible bacteriemia y activar protocolo sepsis si procede', 'Inspeccionar punto de inserción y conexiones sin manipulación innecesaria', 'Obtener hemocultivos periféricos y de catéter según protocolo', 'Mantener técnica aséptica, documentar y preparar tratamiento prescrito'],
    pitfalls: ['Retirar el catéter automáticamente sin indicación', 'Tomar cultivos con técnica no estéril', 'Continuar manipulando conexiones sin higiene de manos'],
    debrief: 'La sospecha de infección relacionada con catéter exige cultivos correctamente obtenidos, valoración sistémica y medidas de asepsia. La decisión de retirar el dispositivo es clínica.'
  }),
  createClinicalCase({
    id: 'c4-paliativos-disnea', year: 4, title: 'Rafael Ortega · Disnea en cuidados paliativos', name: 'Rafael Ortega', age: 74, gender: 'Hombre', bed: 'Unidad de Cuidados Paliativos 4', service: 'Cuidados Paliativos', difficulty: 'Avanzado', category: 'Atención al final de vida',
    summary: 'Paciente con enfermedad avanzada y disnea persistente; expresa miedo y solicita alivio.', complaint: '«Me falta el aire y tengo miedo de ahogarme»', history: ['Cáncer pulmonar avanzado', 'Plan de cuidados paliativos compartido'], vitals: { bp: '106/64', hr: 112, rr: 28, spo2: 89, temp: 36.9, painEva: 2 },
    scenario: 'Rafael está angustiado, con respiración rápida y uso leve de musculatura accesoria. La familia solicita que se haga todo lo posible para aliviarlo.',
    actions: ['Valorar disnea, ansiedad, causas reversibles y objetivos de cuidado acordados', 'Colocar en postura de confort, favorecer ventilación ambiental y acompañamiento', 'Revisar medicación de rescate prescrita y administrarla según plan individual', 'Explicar medidas a familia, reevaluar confort y registrar respuesta'],
    pitfalls: ['Forzar procedimientos desproporcionados sin revisar objetivos', 'Minimizar el síntoma porque el paciente está en paliativos', 'Administrar medicación sin comprobar plan individual y respuesta'],
    debrief: 'Los cuidados paliativos priorizan confort y preferencias. La disnea se aborda con valoración, medidas no farmacológicas y tratamiento de rescate individualizado.'
  }),
  createClinicalCase({
    id: 'c4-gestion-incidente', year: 4, title: 'Equipo de guardia · Error de medicación interceptado', name: 'Isabel Fuentes', age: 57, gender: 'Mujer', bed: 'Medicina 308', service: 'Medicina Interna', difficulty: 'Avanzado', category: 'Liderazgo y seguridad clínica',
    summary: 'Durante el relevo se detecta que una perfusión preparada no coincide con la prescripción; aún no se ha administrado.', complaint: '«La bomba está preparada, pero la etiqueta no coincide con mi tratamiento»', history: ['Ingreso por infección', 'Polimedicación', 'Alergia documentada a un antibiótico'], vitals: { bp: '126/72', hr: 88, rr: 18, spo2: 97, temp: 37.5, painEva: 1 },
    scenario: 'Una enfermera identifica discrepancia entre etiqueta, concentración y hoja de tratamiento. La perfusión está conectada al sistema pero todavía cerrada.',
    actions: ['No iniciar la perfusión y asegurar que el preparado queda fuera de uso', 'Contrastar orden, paciente, medicamento, concentración, vía y alergias con segunda profesional', 'Avisar a Farmacia/prescriptor y preparar de nuevo según procedimiento', 'Registrar y notificar el casi error para análisis del sistema y comunicación al paciente según política'],
    pitfalls: ['Administrar una dosis parcial mientras se aclara', 'Culpar a una persona sin analizar el proceso', 'No reportar porque el error fue interceptado'],
    debrief: 'La interceptación evita daño, pero debe registrarse. El liderazgo clínico favorece comunicación en circuito cerrado y aprendizaje no punitivo.'
  }),
];

SIMULATION_CASES.push(...ADDITIONAL_CASES);

