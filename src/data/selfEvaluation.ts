import { QuizQuestion } from '../types';

export const SELF_EVALUATION_QUESTIONS: QuizQuestion[] = [
  // Anatomía Humana
  {
    id: 'anat-1',
    subject: 'Anatomía Humana',
    category: 'Anatomía',
    question: '¿Qué vaso sanguíneo transporta sangre oxigenada desde los pulmones hasta la aurícula izquierda del corazón?',
    options: [
      'Las arterias pulmonares',
      'Las cuatro venas pulmonares',
      'La vena cava superior',
      'La arteria aorta ascendente'
    ],
    correctIndex: 1,
    explanation: 'A diferencia de la circulación sistémica, en la circulación menor o pulmonar son las cuatro VENAS PULMONARES las que transportan la sangre recién oxigenada en los alvéolos hacia la aurícula izquierda, mientras que la arteria pulmonar lleva sangre desoxigenada desde el ventrículo derecho a los pulmones.',
    clinicalTip: 'Regla básica: Las arterias SALEN del corazón y las venas LLEGAN al corazón, independientemente de si su sangre es oxigenada o carbooxigenada.'
  },
  {
    id: 'anat-2',
    subject: 'Anatomía Humana',
    category: 'Anatomía',
    question: 'En posición anatómica estándar de bipedestación, ¿dónde se localiza el hueso radio respecto al cúbito en el antebrazo?',
    options: [
      'En posición medial (hacia el eje corporal)',
      'En posición lateral (hacia el pulgar)',
      'En posición posterior o dorsal',
      'En posición proximal exclusiva'
    ],
    correctIndex: 1,
    explanation: 'En la posición anatómica de referencia, las palmas de las manos miran hacia adelante (supinación). En esta posición, el radio se encuentra en la parte LATERAL del antebrazo (lado del dedo pulgar, "la antena del radio"), mientras que el cúbito (ulna) está en posición medial (lado del meñique).',
    clinicalTip: 'Útil para la palpación del pulso radial: se localiza en la cara anterior y lateral de la muñeca.'
  },
  {
    id: 'anat-3',
    subject: 'Anatomía Humana',
    category: 'Anatomía',
    question: '¿Cuál es la primera porción del intestino delgado que se comunica con el estómago a través del esfínter pilórico?',
    options: [
      'El yeyuno',
      'El íleon terminal',
      'El duodeno',
      'El ciego'
    ],
    correctIndex: 2,
    explanation: 'El intestino delgado comienza en el duodeno (que tiene forma de "C" abrazando la cabeza del páncreas y recibe las secreciones biliar y pancreática en la ampolla de Vater), continúa con el yeyuno y finaliza en el íleon, desembocando en el ciego a través de la válvula ileocecal.',
    clinicalTip: 'Las sondas nasoyeyunales o nasoduodenales sobrepasan el píloro para evitar la broncoaspiración en pacientes con gastroparesia.'
  },
  {
    id: 'anat-4',
    subject: 'Anatomía Humana',
    category: 'Anatomía',
    question: '¿En qué cuadrante del abdomen se localiza habitualmente el apéndice cecal y el ciego?',
    options: [
      'Hipocondrio derecho',
      'Fosa ilíaca derecha (FID)',
      'Flanco izquierdo',
      'Mesogastrio o región umbilical'
    ],
    correctIndex: 1,
    explanation: 'El ciego y el apéndice vermiforme se sitúan en la fosa ilíaca derecha. El punto de McBurney (a dos tercios de la distancia entre el ombligo y la espina ilíaca anterosuperior derecha) es el punto doloroso clásico de la apendicitis aguda.',
    clinicalTip: 'La palpación dolorosa con descompresión brusca en esta zona se denomina signo de Blumberg (rebote peritoneal).'
  },

  // Fundamentos de Enfermería
  {
    id: 'fund-1',
    subject: 'Fundamentos de Enfermería I',
    category: 'Fundamentos',
    question: '¿Cuál es el orden secuencial correcto de las cinco etapas del Proceso de Atención de Enfermería (PAE)?',
    options: [
      'Diagnóstico -> Valoración -> Planificación -> Ejecución -> Evaluación',
      'Valoración -> Diagnóstico -> Planificación -> Ejecución -> Evaluación',
      'Valoración -> Planificación -> Diagnóstico -> Ejecución -> Evaluación',
      'Diagnóstico -> Ejecución -> Valoración -> Planificación -> Evaluación'
    ],
    correctIndex: 1,
    explanation: 'El PAE sigue un método científico riguroso de 5 fases consecutivas y continuas: 1) Valoración (recogida sistemática de datos objetivos y subjetivos), 2) Diagnóstico de enfermería (NANDA), 3) Planificación de objetivos y resultados (NOC) e intervenciones (NIC), 4) Ejecución (puesta en práctica de los cuidados), y 5) Evaluación (comprobación del logro de objetivos).',
    clinicalTip: 'Nemotecnia clásica: V-D-P-E-E.'
  },
  {
    id: 'fund-2',
    subject: 'Fundamentos de Enfermería I',
    category: 'Fundamentos',
    question: '¿Qué componente NO forma parte de la formulación diagnóstica NANDA de un problema real (formato PES)?',
    options: [
      'Problema (etiqueta diagnóstica)',
      'Etiología (factores relacionados / "relacionado con")',
      'Signos y síntomas (características definitorias / "manifestado por")',
      'Prescripción facultativa del principio activo'
    ],
    correctIndex: 3,
    explanation: 'El formato PES comprende: Problema (P), Etiología o factores relacionados (E) y Signos/Síntomas o características definitorias (S). La prescripción de fármacos es una orden médica independiente, no un elemento del diagnóstico enfermero.',
    clinicalTip: 'Ejemplo: Deterioro de la integridad cutánea (P) r/c inmovilidad prolongada (E) m/p eritema no blanqueable en talón derecho (S).'
  },
  {
    id: 'fund-3',
    subject: 'Fundamentos de Enfermería I',
    category: 'Fundamentos',
    question: 'Según los 5 Momentos del Lavado de Manos de la OMS, ¿cuál de los siguientes momentos se debe realizar ANTES de manipular una vía venosa?',
    options: [
      'Momento 1: Antes del contacto con el paciente',
      'Momento 2: Antes de realizar una tarea limpia o aséptica',
      'Momento 3: Después del riesgo de exposición a líquidos corporales',
      'Momento 5: Después del contacto con el entorno del paciente'
    ],
    correctIndex: 1,
    explanation: 'El Momento 2 es "Antes de realizar una tarea limpia o aséptica". Su objetivo fundamental es proteger al paciente contra los gérmenes nocivos que podrían penetrar en su organismo, incluidos los propios gérmenes del paciente.',
    clinicalTip: 'Incluso con guantes limpios o estériles, la fricción previa con solución hidroalcohólica es obligatoria.'
  },
  {
    id: 'fund-4',
    subject: 'Fundamentos de Enfermería II',
    category: 'Fundamentos',
    question: 'En la escala de Braden para la valoración del riesgo de úlceras por presión (UPP), una puntuación total de 11 puntos indica:',
    options: [
      'Ausencia total de riesgo',
      'Riesgo bajo (puntuación 15-18)',
      'Riesgo moderado (puntuación 13-14)',
      'Riesgo alto de desarrollar UPP (puntuación ≤ 12)'
    ],
    correctIndex: 3,
    explanation: 'En la escala de Braden (que evalúa 6 subescalas con puntuación total de 6 a 23), a MENOR puntuación, MAYOR es el riesgo del paciente: ≤ 12 = Riesgo alto; 13-14 = Riesgo moderado; 15-18 = Riesgo bajo; 19-23 = Sin riesgo.',
    clinicalTip: 'En pacientes con Braden ≤ 12 se deben activar de inmediato cambios posturales cada 2-3 horas, superficie especial de manejo de presión (SEMP) y ácidos grasos hiperoxigenados.'
  },

  // Fisiología Humana
  {
    id: 'fisio-1',
    subject: 'Fisiología Humana',
    category: 'Fisiología',
    question: '¿Qué ion entra masivamente en la célula muscular cardiaca durante la fase 0 de despolarización rápida del potencial de acción?',
    options: [
      'Potasio (K+)',
      'Sodio (Na+)',
      'Cloro (Cl-)',
      'Magnesio (Mg2+)'
    ],
    correctIndex: 1,
    explanation: 'La apertura súbita de los canales de sodio rápidos dependientes de voltaje permite la entrada masiva de iones Na+ al citoplasma a favor de gradiente electroquímico, invirtiendo la polaridad de la membrana desde unos -90 mV hasta +20 mV.',
    clinicalTip: 'Los anestésicos locales (como la lidocaína) bloquean estos canales de sodio, impidiendo la propagación del impulso nervioso doloroso.'
  },
  {
    id: 'fisio-2',
    subject: 'Fisiología Humana',
    category: 'Fisiología',
    question: '¿Cuál es el valor fisiológico normal de la saturación de oxígeno medida por pulsioximetría (SatO2) en un adulto sano a nivel del mar?',
    options: [
      'Entre 85% y 90%',
      'Entre 90% y 92%',
      'Entre 95% y 100%',
      'Exactamente 75%'
    ],
    correctIndex: 2,
    explanation: 'En un adulto sano, la SatO2 normal se sitúa entre el 95% y el 100%. Cifras entre 91-94% indican hipoxemia leve, 86-90% hipoxemia moderada y < 85% hipoxemia severa que requiere oxigenoterapia inmediata.',
    clinicalTip: 'En pacientes con EPOC retenedores crónicos de CO2, el objetivo terapéutico de saturación suele ser más bajo (88-92%) para no anular el estímulo hipóxico respiratorio.'
  },

  // Farmacología y Cálculos
  {
    id: 'farm-1',
    subject: 'Farmacología',
    category: 'Farmacología',
    question: 'Tenemos una orden médica de administrar 500 ml de Suero Glucosado al 5% en 8 horas por gravedad con macrogotero estándar (factor 20 gotas/ml). ¿A cuántas gotas por minuto debe calibrarse el gotero?',
    options: [
      '10 gotas/minuto',
      '21 gotas/minuto',
      '42 gotas/minuto',
      '63 gotas/minuto'
    ],
    correctIndex: 1,
    explanation: 'Aplicando la fórmula de macrogotero: Gotas/min = Volumen en ml ÷ (Horas × 3). Gotas/min = 500 ÷ (8 × 3) = 500 ÷ 24 = 20,83 ≈ 21 gotas por minuto.',
    clinicalTip: 'Fórmula rápida nemotécnica para macrogotero: siempre divide los ml entre las horas multiplicadas por 3.'
  },
  {
    id: 'farm-2',
    subject: 'Farmacología',
    category: 'Farmacología',
    question: 'Un médico prescribe 250 mg de Paracetamol IV a un paciente pediátrico. Disponemos de un frasco de Paracetamol IV de 1 g (1.000 mg) en 100 ml. ¿Qué volumen en mililitros debemos cargar y administrar?',
    options: [
      '10 ml',
      '25 ml',
      '50 ml',
      '2,5 ml'
    ],
    correctIndex: 1,
    explanation: 'Concentración: 1.000 mg en 100 ml = 10 mg/ml. Para administrar 250 mg: Volumen = 250 mg ÷ 10 mg/ml = 25 ml. O por regla de tres: (250 × 100) ÷ 1.000 = 25 ml.',
    clinicalTip: 'Realiza siempre un doble chequeo con otra compañera de enfermería ante dosificaciones pediátricas o fármacos de alto riesgo.'
  },
  {
    id: 'farm-3',
    subject: 'Farmacología',
    category: 'Farmacología',
    question: '¿Cuál es el antídoto específico de elección ante una intoxicación o sobredosis por benzodiacepinas (ej. Diacepam, Lorazepam)?',
    options: [
      'Naloxona',
      'Sulfato de Protamina',
      'Flumazenilo',
      'Fitomenadiona (Vitamina K)'
    ],
    correctIndex: 2,
    explanation: 'El FLUMAZENILO es un antagonista competitivo selectivo de los receptores benzodiacepínicos en el SNC. La Naloxona es el antídoto de los opioides, la Protamina de la heparina y la Vitamina K del Sintrom/acenocumarol.',
    clinicalTip: 'Vigilar la posible re-sedación, ya que la semivida de eliminación del flumazenilo es muy breve (menos de 1 hora).'
  },

  // Casos Clínicos Interactivos
  {
    id: 'caso-1',
    subject: 'Fundamentos de Enfermería II',
    category: 'Casos Clínicos',
    question: 'CASO CLÍNICO: D. Antonio, de 72 años, intervenido hace 6 horas de próstata, refiere dolor suprapúbico intenso y sensación de urgencia miccional. No ha orinado desde quirófano. A la palpación abdominal notas una masa redondeada y tensa sobre la sínfisis del pubis, mate a la percusión. Sus constantes son: TA 155/90 mmHg, FC 98 lpm, EVA 7/10. ¿Cuál es la sospecha clínica prioritaria y la actuación de enfermería inmediata?',
    options: [
      'Se trata de dolor postquirúrgico habitual; administrar analgésico según pauta y esperar 4 horas.',
      'Sospecha de retención aguda de orina (globo vesical); avisar al médico y preparar sondaje vesical evacuador según protocolo.',
      'Sospecha de peritonitis aguda; colocar al paciente en Trendelenburg y avisar a cirugía.',
      'Aumentar el ritmo del suero para forzar la diuresis fisiológica espontánea.'
    ],
    correctIndex: 1,
    explanation: 'Los signos (masa supra-púbica palpable y mate a la percusión, agitación, hipertensión reactiva al dolor y ausencia de diuresis postoperatoria) son patognomónicos de un GLOBO VESICAL por retención aguda de orina. La actuación prioritaria es el alivio de la retención mediante sondaje vesical estéril, pinzando de forma intermitente si el volumen evacuado supera los 500-800 ml.',
    clinicalTip: 'El globo vesical es una causa muy frecuente de agitación e hipertensión súbita en pacientes postoperados.'
  },
  {
    id: 'caso-2',
    subject: 'Farmacología',
    category: 'Casos Clínicos',
    question: 'CASO CLÍNICO: Estás administrando un vial de Metamizol 2 g diluido en 100 ml de Suero Fisiológico a Dña. Carmen, de 64 años. A los 5 minutos, la paciente refiere mareo súbito, visión borrosa y náuseas. Observas palidez cutánea y diaforesis. Tomas las constantes de inmediato: TA 80/45 mmHg (previa 125/75 mmHg), FC 105 lpm. ¿Cuál es tu primera acción INMEDIATA de enfermería?',
    options: [
      'Aumentar la velocidad del gotero para que el fármaco termine antes.',
      'DETENER INMEDIATAMENTE la perfusión del fármaco, colocar a la paciente en posición de Trendelenburg y avisar urgentemente al médico.',
      'Administrar un vaso de agua con azúcar por sospecha de hipoglucemia.',
      'Retirar la vía venosa periférica inmediatamente.'
    ],
    correctIndex: 1,
    explanation: 'El metamizol tiene un efecto vasodilatador directo conocido que puede provocar hipotensión arterial severa si la infusión es rápida, o bien el inicio de una reacción anafiláctica. La primera medida de seguridad en enfermería ante cualquier sospecha de reacción adversa a una perfusión es DETENERLA INMEDIATAMENTE, mejorar el retorno venoso cerebral (Trendelenburg), mantener la vía venosa permeable con suero fisiológico limpio y avisar al facultativo.',
    clinicalTip: 'NUNCA retires la vía venosa periférica en una urgencia hemodinámica: es el único acceso para infundir volumen de rescate o medicación urgente.'
  }
];
