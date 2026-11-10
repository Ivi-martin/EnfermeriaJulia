export interface PulsePoint {
  id: string;
  name: string;
  location: string;
  technique: string;
  clinicalRelevance: string;
  normalFrequency: string;
}

export interface AuscultationPoint {
  id: string;
  name: string;
  location: string;
  valve: string;
  soundDescription: string;
  clinicalSignificance: string;
}

export interface InjectionSite {
  id: string;
  name: string;
  anatomicalLandmarks: string;
  maxVolumeMl: number;
  needleRecommended: string;
  advantages: string;
  precautions: string;
}

export const PULSE_POINTS: PulsePoint[] = [
  {
    id: 'radial',
    name: 'Pulso Radial',
    location: 'Cara anterior y lateral de la muñeca, en el canal del pulso (entre el tendón del supinador largo y el flexor radial del carpo).',
    technique: 'Palpar suavemente con los pulpejos de los dedos índice y corazón. NUNCA usar el pulgar (tiene pulso propio). Contar durante 60 segundos si hay arritmia o 30s x 2 si es regular.',
    clinicalRelevance: 'El pulso de referencia más accesible en adultos conscientes. Si es palpable, la TA sistólica suele ser de al menos 80 mmHg.',
    normalFrequency: '60 - 100 lpm en reposo'
  },
  {
    id: 'carotid',
    name: 'Pulso Carotídeo',
    location: 'En el cuello, entre el borde anterior del músculo esternocleidomastoideo y la laringe/tráquea.',
    technique: 'Palpar con suavidad unilateralmente. NUNCA palpar ambos lados simultáneamente (puede desencadenar bradicardia severa, síncope o compromiso del flujo cerebral).',
    clinicalRelevance: 'Pulso central de elección en emergencias y soporte vital avanzado (RCP). Si es palpable, la TA sistólica suele ser ≥ 60 mmHg.',
    normalFrequency: '60 - 100 lpm'
  },
  {
    id: 'brachial',
    name: 'Pulso Braquial o Humeral',
    location: 'Cara interna del pliegue del codo (fosa antecubital), medial al tendón del bíceps.',
    technique: 'Palpar con los dedos índice y corazón extendiendo suavemente el brazo del paciente.',
    clinicalRelevance: 'Pulso de referencia en lactantes y niños para RCP. Punto clave para la colocación de la campana del fonendoscopio en la toma manual de la Tensión Arterial (ruidos de Korotkoff).',
    normalFrequency: '60 - 100 lpm (adulto) / 100 - 160 lpm (lactante)'
  },
  {
    id: 'femoral',
    name: 'Pulso Femoral',
    location: 'En el pliegue inguinal, en el punto medio entre la sínfisis del pubis y la espina ilíaca anterosuperior (trígono femoral o de Scarpa).',
    technique: 'Presión firme profunda con dos o tres dedos en dirección a la cabeza femoral.',
    clinicalRelevance: 'Pulso central de evaluación hemodinámica rápida en pacientes en shock o traumatismos graves. Si es palpable, TA sistólica ≥ 70 mmHg.',
    normalFrequency: '60 - 100 lpm'
  },
  {
    id: 'pedal',
    name: 'Pulso Pedio (Dorsal del Pie)',
    location: 'En el dorso del pie, lateral al tendón extensor largo del dedo gordo.',
    technique: 'Palpación suave con dedos índice y corazón.',
    clinicalRelevance: 'Valoración de la perfusión arterial periférica en miembros inferiores, pacientes diabéticos y tras cateterismos femorales.',
    normalFrequency: 'Presente y simétrico bilateralmente'
  },
  {
    id: 'posterior-tibial',
    name: 'Pulso Tibial Posterior',
    location: 'Detrás y ligeramente por debajo del maléolo interno del tobillo.',
    technique: 'Curvar los dedos suavemente alrededor del maléolo interno.',
    clinicalRelevance: 'Diagnóstico precoz de enfermedad arterial periférica (EAP) y cálculo del índice tobillo-brazo (ITB).',
    normalFrequency: 'Presente y simétrico bilateralmente'
  }
];

export const AUSCULTATION_POINTS: AuscultationPoint[] = [
  {
    id: 'aortic',
    name: 'Foco Aórtico',
    location: '2.º espacio intercostal derecho, en el borde esternal derecho.',
    valve: 'Válvula Aórtica',
    soundDescription: 'Se escucha nítidamente el segundo ruido cardiaco (R2), correspondiente al cierre de las válvulas sigmoideas (aórtica y pulmonar).',
    clinicalSignificance: 'Estenosis o insuficiencia aórtica (soplos sistólicos eyectivos irradiados a carótidas).'
  },
  {
    id: 'pulmonic',
    name: 'Foco Pulmonar',
    location: '2.º espacio intercostal izquierdo, en el borde esternal izquierdo.',
    valve: 'Válvula Pulmonar',
    soundDescription: 'Cierre de la válvula pulmonar (componente P2 de R2). Desdoblamiento fisiológico con la inspiración.',
    clinicalSignificance: 'Hipertensión pulmonar o estenosis pulmonar.'
  },
  {
    id: 'tricuspid',
    name: 'Foco Tricuspídeo',
    location: '4.º o 5.º espacio intercostal izquierdo, en la parte baja del borde esternal izquierdo.',
    valve: 'Válvula Tricúspide',
    soundDescription: 'Cierre de la válvula tricúspide (componente del primer ruido cardiaco R1).',
    clinicalSignificance: 'Insuficiencia tricuspídea con reflujo venoso sistémico.'
  },
  {
    id: 'mitral',
    name: 'Foco Mitral o Apexiano',
    location: '5.º espacio intercostal izquierdo, en la línea medioclavicular izquierda (punto de máximo impulso cardiaco / ápex).',
    valve: 'Válvula Mitral',
    soundDescription: 'Máxima intensidad del primer ruido cardiaco (R1, cierre de válvulas auriculoventriculares: mitral y tricúspide).',
    clinicalSignificance: 'Estenosis o insuficiencia mitral, ritmo de galope (R3 y R4 por insuficiencia cardiaca).'
  }
];

export const INJECTION_SITES: InjectionSite[] = [
  {
    id: 'ventrogluteal',
    name: 'Zona Ventroglútea (Área de Hochstetter)',
    anatomicalLandmarks: 'Colocar la palma de la mano sobre el trocánter mayor del fémur del paciente (mano derecha para cadera izquierda). El dedo índice apunta a la espina ilíaca anterosuperior y el dedo medio se abre formando una «V». La inyección se realiza en el centro de ese triángulo.',
    maxVolumeMl: 4.0,
    needleRecommended: 'Aguja verde 21G (0,8 x 40 mm) o azul 23G pediátrica / delgada.',
    advantages: 'ES LA ZONA MÁS SEGURA SEGÚN LA EVIDENCIA CIENTÍFICA: libre de grandes vasos sanguíneos y alejada del trayecto del nervio ciático. Mayor grosor muscular y menor tejido adiposo.',
    precautions: 'Requiere familiarizarse con la técnica de la V de Hochstetter.'
  },
  {
    id: 'deltoid',
    name: 'Músculo Deltoides',
    anatomicalLandmarks: 'Palpar el acromion (hueso del hombro). Medir de 2 a 3 traveses de dedo (unos 3-5 cm) por debajo del acromion. La zona de punción es el centro del triángulo imaginario con base superior.',
    maxVolumeMl: 1.5,
    needleRecommended: 'Aguja verde 21G o negra 22G (0,7 x 30 mm).',
    advantages: 'Acceso muy rápido y cómodo sin necesidad de desvestir al paciente. Absorción rápida por alta vascularización. Indicada para vacunas (ej. gripe, tétanos, hepatitis B) y volúmenes pequeños.',
    precautions: 'No administrar volúmenes superiores a 1,5 ml para evitar miositis o dolor excesivo. Cuidado con el nervio radial y la arteria braquial si se pincha demasiado abajo.'
  },
  {
    id: 'vastus-lateralis',
    name: 'Vasto Lateral del Muslo',
    anatomicalLandmarks: 'Dividir la cara anterolateral del muslo en tres tercios longitudinales. El tercio medio es el área de inyección recomendada.',
    maxVolumeMl: 5.0,
    needleRecommended: 'Aguja verde 21G o amarilla 20G.',
    advantages: 'Excelente absorción, músculo potente y bien desarrollado. Es la zona de elección número 1 en lactantes y niños pequeños, y para autoinyección de adrenalina en anafilaxia (EpiPen).',
    precautions: 'Puede ser dolorosa a la deambulación inmediata en adultos si el volumen inyectado es muy grande.'
  },
  {
    id: 'dorsogluteal',
    name: 'Zona Dorsoglútea (Cuadrante Superoexterno)',
    anatomicalLandmarks: 'Dividir el glúteo en cuatro cuadrantes mediante una línea vertical y otra horizontal. La inyección se hace exclusivamente en el CUADRANTE SUPEROEXTERNO.',
    maxVolumeMl: 3.0,
    needleRecommended: 'Aguja verde 21G (40 mm).',
    advantages: 'Músculo amplio para volúmenes moderados.',
    precautions: 'ALTO RIESGO de lesión del nervio ciático si se pincha por error en cuadrantes mediales o inferiores. Si se aspira sangre, retirar inmediatamente y desechar.'
  }
];
