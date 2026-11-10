import { VirtualPatientCase } from '../types';

export const SIMULATION_CASES: VirtualPatientCase[] = [
  {
    id: 'case-anaphylaxis',
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
