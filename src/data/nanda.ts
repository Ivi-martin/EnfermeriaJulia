import { NandaItem } from '../types';

export const NANDA_CATALOG: NandaItem[] = [
  {
    code: '00132',
    domain: 'Confort',
    domainNumber: 12,
    class: 'Confort físico',
    label: 'Dolor agudo',
    definition: 'Experiencia sensitiva y emocional desagradable ocasionada por una lesión tisular real o potencial de inicio súbito o lento y de duración inferior a 3 meses.',
    relatedFactors: [
      'Agentes lesivos físicos (ej. incisión quirúrgica, trauma, procedimientos invasivos)',
      'Agentes lesivos biológicos (ej. infección, inflamación)',
      'Espasmo muscular o distensión visceral'
    ],
    definingCharacteristics: [
      'Informe verbal o autoinforme del dolor (EVA > 3)',
      'Conducta expresiva (inquietud, gemidos, llanto, facies de dolor)',
      'Cambios en parámetros autonómicos (taquicardia, taquipnea, hipertensión arterial reactiva)',
      'Postura de defensa o protección de la zona dolorosa'
    ],
    nocSuggestions: [
      {
        code: '1605',
        label: 'Control del dolor',
        indicators: ['Reconoce el comienzo del dolor', 'Utiliza analgésicos según prescripción', 'Refiere dolor controlado (EVA ≤ 3)']
      },
      {
        code: '2102',
        label: 'Nivel del dolor',
        indicators: ['Dolor referido', 'Expresiones faciales de dolor', 'Tensión muscular']
      }
    ],
    nicSuggestions: [
      {
        code: '1400',
        label: 'Manejo del dolor',
        activities: [
          'Realizar una valoración exhaustiva del dolor (localización, características, aparición, duración, frecuencia, intensidad en EVA y factores desencadenantes)',
          'Administrar analgésicos prescritos respetando los 10 correctos y evaluar la eficacia a los 30 minutos',
          'Favorecer medidas no farmacológicas de confort (cambios posturales, ambiente tranquilo, aplicación de frío/calor según indicación)'
        ]
      },
      {
        code: '2210',
        label: 'Administración de analgésicos',
        activities: [
          'Comprobar las órdenes médicas para el medicamento, dosis y frecuencia del analgésico prescrito',
          'Verificar historial de alergias medicamentosas',
          'Vigilar signos vitales antes y después de la administración de analgésicos opioides'
        ]
      }
    ]
  },
  {
    code: '00004',
    domain: 'Seguridad / Protección',
    domainNumber: 11,
    class: 'Infección',
    label: 'Riesgo de infección',
    definition: 'Vulnerable a una invasión y multiplicación de organismos patógenos que pueden comprometer la salud.',
    relatedFactors: [
      'Procedimientos invasivos (catéter venoso periférico, sonda vesical, drenajes)',
      'Alteración de las defensas primarias (rotura de la piel, quemaduras)',
      'Inmunosupresión o desnutrición',
      'Exposición a patógenos hospitalarios'
    ],
    definingCharacteristics: [
      'Los diagnósticos de riesgo NO tienen características definitorias (no hay síntomas aún)'
    ],
    nocSuggestions: [
      {
        code: '0703',
        label: 'Estado infeccioso',
        indicators: ['Ausencia de fiebre', 'Ausencia de eritema o calor en punto de inserción', 'Recuento leucocitario normal']
      },
      {
        code: '1902',
        label: 'Control del riesgo',
        indicators: ['Reconoce factores de riesgo', 'Sigue las estrategias de control de infección']
      }
    ],
    nicSuggestions: [
      {
        code: '6550',
        label: 'Protección contra las infecciones',
        activities: [
          'Mantener la técnica aséptica en todos los accesos vasculares y curas',
          'Inspeccionar diariamente el punto de inserción del catéter periférico (signos de flebitis/infección)',
          'Fomentar la higiene de manos estricta según los 5 momentos de la OMS'
        ]
      },
      {
        code: '2440',
        label: 'Mantenimiento de dispositivos de acceso venoso (Flebitis Zero)',
        activities: [
          'Desinfectar las conexiones con clorhexidina alcohólica al 2% mediante fricción vigorosa durante 15 segundos antes de acceder',
          'Cambiar apósito transparente estéril cada 7 días o si está despegado/manchado'
        ]
      }
    ]
  },
  {
    code: '00047',
    domain: 'Seguridad / Protección',
    domainNumber: 11,
    class: 'Lesión física',
    label: 'Riesgo de deterioro de la integridad cutánea',
    definition: 'Vulnerable a una alteración en la epidermis y/o dermis que puede comprometer la salud (ej. úlcera por presión).',
    relatedFactors: [
      'Presión prolongada sobre prominencias óseas por inmovilidad',
      'Humedad cutánea excesiva (incontinencia urinaria o fecal, diaforesis)',
      'Fricción y fuerzas de cizalla',
      'Estado nutricional deficitario e hipoalbuminemia'
    ],
    definingCharacteristics: [],
    nocSuggestions: [
      {
        code: '1101',
        label: 'Integridad tisular: piel y membranas mucosas',
        indicators: ['Piel intacta', 'Temperatura cutánea adecuada', 'Hidratación y elasticidad']
      }
    ],
    nicSuggestions: [
      {
        code: '3540',
        label: 'Prevención de úlceras por presión',
        activities: [
          'Aplicar la escala de Braden al ingreso y reevaluar periódicamente',
          'Pautar cambios posturales reglados cada 2-3 horas en pacientes encamados',
          'Aplicar ácidos grasos hiperoxigenados (AGHO) en prominencias óseas sin friccionar',
          'Utilizar superficies especiales para el manejo de la presión (SEMP)'
        ]
      }
    ]
  },
  {
    code: '00031',
    domain: 'Actividad / Reposo',
    domainNumber: 4,
    class: 'Respuestas cardiovasculares / pulmonares',
    label: 'Limpieza ineficaz de las vías aéreas',
    definition: 'Incapacidad para eliminar las secreciones u obstrucciones del tracto respiratorio para mantener las vías aéreas permeables.',
    relatedFactors: [
      'Vía aérea artificial (cánula traqueal)',
      'Mucosidad excesiva y secreciones espesas',
      'Reflejo tusígeno deprimido o dolor torácico/abdominal que inhibe la tos'
    ],
    definingCharacteristics: [
      'Ruidos respiratorios adventicios (roncus, estertores)',
      'Tos ineficaz o ausente',
      'Disnea y taquipnea',
      'Descenso de la SatO2'
    ],
    nocSuggestions: [
      {
        code: '0410',
        label: 'Estado respiratorio: permeabilidad de las vías respiratorias',
        indicators: ['Frecuencia respiratoria en rango normal', 'Movilización de secreciones', 'Ausencia de ruidos sobreañadidos']
      }
    ],
    nicSuggestions: [
      {
        code: '3140',
        label: 'Manejo de la vía aérea',
        activities: [
          'Colocar al paciente en posición de semi-Fowler o Fowler para maximizar el potencial de ventilación',
          'Enseñar y estimular la respiración profunda y la tos asistida',
          'Aspirar secreciones si el paciente no puede expectorar espontáneamente, manteniendo técnica estéril'
        ]
      }
    ]
  },
  {
    code: '00028',
    domain: 'Nutrición',
    domainNumber: 2,
    class: 'Hidratación',
    label: 'Riesgo de déficit de volumen de líquidos',
    definition: 'Vulnerable a una disminución del volumen de líquidos intravascular, intersticial y/o intracelular.',
    relatedFactors: [
      'Pérdidas excesivas a través de vías normales (vómitos, diarreas, diaforesis profusa)',
      'Pérdidas a través de vías anormales (drenajes, fístulas, quemaduras)',
      'Ingesta insuficiente de líquidos',
      'Uso de diuréticos potentes'
    ],
    definingCharacteristics: [],
    nocSuggestions: [
      {
        code: '0601',
        label: 'Equilibrio hídrico',
        indicators: ['Presión arterial en límites normales', 'Entradas y salidas equilibradas', 'Turgencia cutánea adecuada']
      }
    ],
    nicSuggestions: [
      {
        code: '4120',
        label: 'Manejo de líquidos',
        activities: [
          'Llevar un balance hídrico estricto (ingestas y pérdidas acumuladas en 24h)',
          'Monitorizar presión arterial, frecuencia cardiaca y diuresis horaria',
          'Administrar fluidoterapia intravenosa según pauta médica y vigilar signos de sobrecarga'
        ]
      }
    ]
  },
  {
    code: '00085',
    domain: 'Actividad / Reposo',
    domainNumber: 4,
    class: 'Actividad / Ejercicio',
    label: 'Deterioro de la movilidad física',
    definition: 'Limitación del movimiento independiente e intencionado del cuerpo o de una o más extremidades.',
    relatedFactors: [
      'Dolor no controlado',
      'Deterioro musculoesquelético o neuromuscular',
      'Prescripción de reposo en cama o inmovilización terapéutica'
    ],
    definingCharacteristics: [
      'Dificultad para girarse en la cama o levantarse',
      'Disminución de la fuerza o control muscular',
      'Movimientos lentos o descoordinados'
    ],
    nocSuggestions: [
      {
        code: '0208',
        label: 'Movilidad',
        indicators: ['Mantenimiento del equilibrio', 'Movimiento muscular', 'Realización de traslados']
      }
    ],
    nicSuggestions: [
      {
        code: '0221',
        label: 'Terapia de ejercicios: deambulación',
        activities: [
          'Fomentar la deambulación precoz progresiva',
          'Instruir en el uso de ayudas técnicas (andador, bastón)',
          'Prevenir hipotensión ortostática sentando al paciente al borde de la cama unos minutos antes de ponerse de pie'
        ]
      }
    ]
  }
];
