import { Drug } from '../types';

export const TEN_RIGHTS_OF_MEDICATION = [
  { id: 1, name: 'Paciente correcto', desc: 'Identificar mediante doble chequeo (nombre y apellidos, fecha de nacimiento, número de historia o pulsera identificativa). Nunca por el número de habitación.' },
  { id: 2, name: 'Medicamento correcto', desc: 'Comprobar el nombre genérico y comercial tres veces (al sacarlo del cajetín, al prepararlo y antes de administrarlo). Cuidado con los medicamentos de aspecto o nombre similar (LASA).' },
  { id: 3, name: 'Dosis correcta', desc: 'Confirmar la dosis prescrita con la orden médica. Recalcular mentalmente o con la calculadora si se requiere dilución o ajuste por peso.' },
  { id: 4, name: 'Vía correcta', desc: 'Comprobar que la presentación corresponde a la vía indicada (VO, IV, IM, SC, SL, rectal, inhalada). Nunca administrar por vía IV una solución no autorizada.' },
  { id: 5, name: 'Hora correcta', desc: 'Respetar los intervalos posológicos prescritos para mantener niveles plasmáticos terapéuticos (especialmente antibióticos e insulina).' },
  { id: 6, name: 'Verificación de alergias', desc: 'Preguntar siempre al paciente si tiene alergias conocidas o comprobar la alerta en historia clínica antes de abrir el envase.' },
  { id: 7, name: 'Información al paciente', desc: 'Explicar de forma comprensible qué fármaco va a recibir, para qué sirve y qué efectos secundarios esperables puede experimentar.' },
  { id: 8, name: 'Velocidad de administración correcta', desc: 'Ajustar los ritmos de perfusión en bombas volumétricas o goteros. Muchos fármacos IV causan flebitis o hipotensión severa si se infunden rápidamente.' },
  { id: 9, name: 'Registro de enfermería inmediato', desc: 'Anotar inmediatamente tras la administración: fármaco, dosis, vía, hora y firma. Nunca registrar antes de haberlo administrado.' },
  { id: 10, name: 'Seguimiento y respuesta', desc: 'Evaluar la eficacia del tratamiento (alivio del dolor, descenso térmico, estabilización tensional) y vigilar posibles reacciones adversas inmediatas.' }
];

export const INITIAL_DRUGS: Drug[] = [
  // Analgésicos & AINEs
  {
    id: 'paracetamol',
    name: 'Paracetamol (Acetaminofén)',
    commercialNames: ['Perfalgan (IV)', 'Termalgin', 'Gelocatil', 'Efferalgan'],
    group: 'Analgésicos y antipiréticos no opiáceos',
    indications: 'Dolor de intensidad leve a moderada y estados febriles.',
    posology: 'Adultos: 500 mg - 1 g cada 6-8 h (máximo 4 g/día). Ajustar en hepatopatía o desnutrición (máximo 2-3 g/día).',
    administration: 'Oral, rectal e Intravenosa (IV). En perfusión IV infundir en 15 minutos.',
    dilution: 'El vial de 1 g / 100 ml IV viene listo para perfundir directamente sin dilución adicional.',
    adverseEffects: 'Hepatotoxicidad por sobredosis (antídoto: N-acetilcisteína), hipotensión leve durante la infusión IV rápida, erupciones cutáneas raras.',
    nursingCare: [
      'No superar jamás los 4 g diarios en adultos (3 g en ancianos o pacientes de bajo peso).',
      'Comprobar otros preparados antigripales o analgésicos que el paciente tome para evitar duplicidad.',
      'Controlar enzimas hepáticas en tratamientos prolongados.',
      'Si se administra IV, infundir en 15 minutos para evitar hipotensión súbita.'
    ],
    contraindications: 'Insuficiencia hepatocelular grave o hepatitis activa.'
  },
  {
    id: 'metamizol',
    name: 'Metamizol magnésico / sódico',
    commercialNames: ['Nolotil', 'Algi-Mabo'],
    group: 'Analgésicos y antipiréticos (Pirazolonas)',
    indications: 'Dolor agudo moderado a severo (postoperatorio, cólico nefrítico, oncológico) y fiebre refractaria.',
    posology: 'Adultos: 575 mg - 2 g cada 6-8 h según vía. Máximo 6-8 g/día.',
    administration: 'Oral, Intramuscular profunda, Intravenosa lenta (en infusión continua o intermitente).',
    dilution: 'Ampolla de 2 g / 5 ml: diluir OBLIGATORIAMENTE en 100 ml de Suero Fisiológico 0.9% o Glucosado 5% a pasar en 20-30 minutos. NUNCA en bolo rápido.',
    adverseEffects: 'Hipotensión arterial marcada si se infunde rápido, reacciones alérgicas, agranulocitosis (rara pero potencialmente mortal), hipotermia severa.',
    nursingCare: [
      'NUNCA administrar en bolo IV directo: riesgo crítico de shock hipotensivo severo.',
      'Vigilar la Tensión Arterial antes y durante la perfusión.',
      'Instruir al paciente que informe inmediatamente de fiebre repentina, dolor de garganta o úlceras orales (signos de agranulocitosis).',
      'En administración IM: inyectar en cuadrante superior externo lentamente y con aguja profunda.'
    ],
    contraindications: 'Hipersensibilidad a pirazolonas, porfiria hepática aguda, déficit de G6PD, hipotensión preexistente o shock hemodinámico.'
  },
  {
    id: 'dexketoprofeno',
    name: 'Dexketoprofeno trometamol',
    commercialNames: ['Enantyum', 'Ketesse', 'Quiralam'],
    group: 'Antiinflamatorios no esteroideos (AINE)',
    indications: 'Tratamiento sintomático del dolor agudo de intensidad moderada a severa (cólico nefrítico, dolor dental, dolor postquirúrgico).',
    posology: '25 mg VO cada 8 h o 50 mg IV/IM cada 8-12 h. Máximo 150 mg/día. No superar los 2-3 días de tratamiento parenteral continuo.',
    administration: 'Oral, Intramuscular profunda, Intravenosa (en infusión de 10-30 min o en bolo lento de al menos 15 segundos previa dilución).',
    dilution: 'Ampolla de 50 mg / 2 ml: diluir en 100 ml de SF 0.9% o SG 5% para infusión en 15-20 min. Es fotosensible, conservar en ampolla protegida.',
    adverseEffects: 'Molestias digestivas, pirosis, hemorragia digestiva, insuficiencia renal aguda, mareo, dolor en el punto de inyección IM.',
    nursingCare: [
      'Preguntar por antecedentes de úlcera péptica, asma inducida por AAS o hemorragia digestiva.',
      'Vigilar función renal y diuresis, especialmente en ancianos y deshidratados.',
      'Preferir administración con alimentos en vía oral.',
      'No asociar con otros AINEs simultáneos.'
    ],
    contraindications: 'Úlcera péptica activa, insuficiencia renal o hepática grave, insuficiencia cardiaca severa, tercer trimestre del embarazo.'
  },
  {
    id: 'morfina',
    name: 'Clorhidrato de Morfina',
    commercialNames: ['Morfina Braun', 'Oramorph', 'MST Continus', 'Sevendol'],
    group: 'Analgésicos opioides mayores (Estupefaciente)',
    indications: 'Dolor intenso que no responde a analgésicos de menor potencia (postoperatorio mayor, dolor oncológico, dolor isquémico en IAM, disnea en edema agudo de pulmón).',
    posology: 'Individualizada. IV adulto: 2-5 mg cada 3-4 h titulando según escala EVA y frecuencia respiratoria.',
    administration: 'Subcutánea, Intravenosa lenta, Oral, Epidural/Intratecal. Bomba de PCA.',
    dilution: 'Ampolla de 10 mg / 1 ml o 10 mg / 10 ml. Se diluye habitualmente cargando 1 ampolla (10 mg) + 9 ml de SF en jeringa de 10 ml (1 mg/ml).',
    adverseEffects: 'Depresión respiratoria dosis-dependiente, sedación, estreñimiento severo, náuseas y vómitos, hipotensión, miosis pupilar, prurito, retención urinaria.',
    nursingCare: [
      'MEDIR SIEMPRE la Frecuencia Respiratoria antes de administrar: si FR < 10-12 rpm, RETENER y avisar a médico.',
      'Tener siempre preparado el antídoto NALOXONA en el carro de paradas.',
      'Controlar nivel de sedación mediante la escala de Ramsay o Richmond (RASS).',
      'Protocolizar laxantes preventivos si el paciente precisa tratamiento continuo.',
      'Custodia en armario cerrado de estupefacientes con registro en libro oficial.'
    ],
    contraindications: 'Depresión respiratoria grave, traumatismo craneoencefálico con hipertensión intracraneal, íleo paralítico.'
  },
  {
    id: 'enoxaparina',
    name: 'Enoxaparina sódica',
    commercialNames: ['Clexane', 'Inhixa'],
    group: 'Antitrombóticos / Heparinas de bajo peso molecular (HBPM)',
    indications: 'Profilaxis y tratamiento de la trombosis venosa profunda (TVP) y embolismo pulmonar (TEP). Tratamiento del síndrome coronario agudo (SCA).',
    posology: 'Profilaxis quirúrgica: 20-40 mg (2.000-4.000 UI) SC una vez al día. Tratamiento curativo: 1 mg/kg (100 UI/kg) SC cada 12 horas.',
    administration: 'Vía Subcutánea estricta (salvo bolo inicial en angioplastia por indicación médica específica).',
    dilution: 'Jeringas precargadas listas para usar. ¡NO purgar la pequeña burbuja de aire antes de inyectar!',
    adverseEffects: 'Hemorragias, hematoma en zona de inyección, trombocitopenia inducida por heparina (TIH), elevación asintomática de transaminasas.',
    nursingCare: [
      'Inyectar en tejido celular subcutáneo del abdomen (a más de 5 cm del ombligo), alternando flanco izquierdo y derecho.',
      'Pliegue cutáneo entre pulgar e índice: introducir la aguja a 90° completa.',
      'NO masajear ni frotar tras retirar la aguja para evitar la formación de hematomas.',
      'La burbuja de aire debe inyectarse al final para sellar el trayecto de la aguja.',
      'Vigilar recuento de plaquetas y signos de sangrado (hematuria, melenas, gingivorragia). Antídoto: Sulfato de Protamina.'
    ],
    contraindications: 'Hemorragia activa grave, antecedente de TIH mediada por anticuerpos, anestesia neuroaxial reciente (respetar intervalo de seguridad).'
  },
  {
    id: 'furosemida',
    name: 'Furosemida',
    commercialNames: ['Seguril'],
    group: 'Diuréticos del asa de Henle',
    indications: 'Edemas asociados a insuficiencia cardiaca congestiva, cirrosis hepática o nefropatía. Edema agudo de pulmón (EAP). Crisis hipertensiva.',
    posology: 'Oral: 20-80 mg/día. IV: 20-40 mg en bolo lento o perfusión continua.',
    administration: 'Oral, Intravenosa (bolo lento en al menos 2 minutos; si >80 mg pasar en perfusión continua para evitar ototoxicidad).',
    dilution: 'Ampolla de 20 mg / 2 ml. En bolo se administra lentamente. En perfusión diluir con SF 0.9% (incompatible con soluciones ácidas como glucosados a pH bajo prolongado).',
    adverseEffects: 'Hipopotasemia (calambres, arritmias), deshidratación, hipotensión ortostática, hiponatremia, hiperuricemia, ototoxicidad si infusión IV rápida.',
    nursingCare: [
      'Control estricto de balance hídrico y diuresis horaria.',
      'Pesar al paciente diariamente en ayunas si está ingresado por insuficiencia cardiaca.',
      'Monitorizar electrólitos en sangre (especialmente potasio sérico K+ y sodio Na+).',
      'Administrar la dosis oral preferiblemente por la mañana para evitar nicturia y caídas nocturnas.',
      'Vigilar TA antes de la administración.'
    ],
    contraindications: 'Hipovolemia severa, hipopotasemia o hiponatremia graves, anuria que no responde a dosis de prueba.'
  },
  {
    id: 'amoxicilina-clavulanico',
    name: 'Amoxicilina / Ácido Clavulánico',
    commercialNames: ['Augmentine', 'Amoxicilina-Clavulánico genérico'],
    group: 'Antibióticos betalactámicos / Penicilinas asociadas a inhibidores de betalactamasas',
    indications: 'Infecciones respiratorias, urinarias, intraabdominales, dentarias y de piel y partes blandas.',
    posology: 'Adultos: 875/125 mg VO cada 8 h o 1 g/200 mg IV cada 8 h.',
    administration: 'Oral (con las comidas) e Intravenosa en infusión intermitente.',
    dilution: 'Vial de 1000/200 mg: reconstituir con 20 ml de agua para inyección o SF, y diluir en 100 ml de SF 0.9% a pasar en 30-40 min. ¡Consumir antes de 1 hora tras reconstituir!',
    adverseEffects: 'Diarrea (muy frecuente), náuseas, candidiasis mucocutánea, hepatotoxicidad colestásica, reacciones anafilácticas por penicilinas.',
    nursingCare: [
      'VERIFICAR siempre antecedente de alergia a penicilinas o betalactámicos.',
      'Infundir en 30-40 minutos; la infusión rápida produce náuseas y flebitis.',
      'La solución reconstituida adquiere color amarillo rosáceo que es normal; no usar si vira a marrón oscuro.',
      'Instruir al paciente sobre la importancia de cumplir el horario exacto y completar el tratamiento completo.'
    ],
    contraindications: 'Alergia conocida a betalactámicos, antecedente de ictericia/insuficiencia hepática asociada a amoxi/clavulánico.'
  },
  {
    id: 'omeprazol',
    name: 'Omeprazol',
    commercialNames: ['Losec', 'Omeprazol IV'],
    group: 'Inhibidores de la bomba de protones (IBP)',
    indications: 'Profilaxis de úlceras por estrés en pacientes hospitalizados graves, reflujo gastroesofágico, hemorragia digestiva alta.',
    posology: 'Oral: 20-40 mg/día en ayunas. IV: 40 mg cada 12-24 h en bolo lento o perfusión continua en sangrado activo.',
    administration: 'Oral (cápsula entera sin masticar) e Intravenosa.',
    dilution: 'Vial IV de 40 mg: reconstituir con su disolvente específico de 10 ml y administrar en bolo lento (2,5-5 min) o diluir en 100 ml de SF 0.9% o SG 5% a pasar en 20-30 min.',
    adverseEffects: 'Cefalea, diarrea, estreñimiento, dolor abdominal; a largo plazo: hipomagnesemia, déficit de B12, aumento de riesgo de fracturas por malabsorción cálcica.',
    nursingCare: [
      'Si se administra por vía oral, tomar 30-60 minutos antes del desayuno con un vaso de agua.',
      'Si el paciente porta SNG: no triturar microgránulos gastrorresistentes si es posible; suspender en agua ligeramente bicarbonatada.',
      'En administración IV lenta: respetar los 3-5 minutos de inyección lenta.'
    ]
  },
  {
    id: 'salbutamol',
    name: 'Salbutamol (Albuterol)',
    commercialNames: ['Ventolin'],
    group: 'Broncodilatadores agonistas beta-2 adrenérgicos de acción corta (SABA)',
    indications: 'Broncoespasmo agudo en asma, EPOC, bronquitis aguda.',
    posology: 'Inhalado con cámara: 1-2 pulsaciones (100-200 mcg). Nebulizado: 2.5-5 mg diluidos en SF con flujo de oxígeno a 6-8 L/min.',
    administration: 'Inhalada (MDI con cámara espaciadora), Nebulizada, IV lenta en UCI.',
    dilution: 'Solución para nebulización: ampolla monodosis o gotas diluidas con 3-4 ml de SF 0.9% en la cazoleta del nebulizador.',
    adverseEffects: 'Taquicardia, palpitaciones, temblor fino en manos, nerviosismo, hipopotasemia en dosis altas o repetidas.',
    nursingCare: [
      'Valorar frecuencia cardiaca y saturación de oxígeno antes y después de la inhalación.',
      'Asegurar el uso correcto de cámara espaciadora: agitar el inhalador, aplicar una pulsación y que el paciente respire 4-5 veces con calma.',
      'Aclarar la boca con agua tras el tratamiento.',
      'Si se asocia con corticoides inhalados (ej. Budesonida), administrar PRIMERO el broncodilatador (Salbutamol) y tras 5 minutos el corticoide.'
    ]
  },
  {
    id: 'insulina-rapida',
    name: 'Insulina Rápida (Aspart / Lispro / Humana regular)',
    commercialNames: ['Novorapid', 'Humalog', 'Actrapid'],
    group: 'Hormonas pancreáticas / Antidiabéticos parenterales',
    indications: 'Diabetes mellitus tipo 1, descompensaciones hiperglucémicas en DM2, pautas correctoras preprandiales hospitalarias.',
    posology: 'Individualizada según glucemia capilar y pauta médica. Acción rápida en 10-15 minutos; pico a la hora; duración 3-5 horas.',
    administration: 'Subcutánea (habitual) o Intravenosa en perfusión continua (solo Insulina regular/rápida en cetoacidosis).',
    dilution: 'Plumas precargadas para SC. En bomba IV se diluye 100 UI en 100 ml de SF (1 UI/ml).',
    adverseEffects: 'HIPOGLUCEMIA (sudoración fría, temblor, mareo, confusión, taquicardia), lipodistrofia en el sitio de inyección por falta de rotación.',
    nursingCare: [
      'REALIZAR SIEMPRE glucemia capilar antes de inyectar.',
      'Asegurarse de que la comida del paciente esté servida y lista para ingerir en los siguientes 5-10 minutos tras la inyección.',
      'Rotar rigurosamente los puntos de punción (brazos, abdomen, muslos, nalgas) para evitar lipodistrofias.',
      'Si glucemia < 70 mg/dL: aplicar la Regla del 15 (15 g de hidratos rápidos, esperar 15 min y repetir glucemia). Si inconsciente: Glucagón SC/IM o Glucosado al 50% IV.'
    ]
  },
  {
    id: 'naloxona',
    name: 'Naloxona clorhidrato',
    commercialNames: ['Naloxona Abelló'],
    group: 'Antagonistas opioides puros (Antídoto)',
    indications: 'Reversión completa o parcial de la depresión del sistema nervioso central y especialmente de la depresión respiratoria producida por opioides naturales o sintéticos.',
    posology: 'Adultos: 0.1 a 0.4 mg IV cada 2-3 minutos hasta que recupere ventilación espontánea y consciencia.',
    administration: 'Intravenosa lenta (preferente), Intramuscular, Subcutánea.',
    dilution: 'Ampolla de 0.4 mg / 1 ml. Puede titularse diluyendo la ampolla hasta 10 ml con SF (0.04 mg/ml) para administración fraccionada cuidadosa.',
    adverseEffects: 'Síndrome de abstinencia agudo en pacientes dependientes de opioides, hipertensión de rebote, taquicardia ventricular, dolor intenso súbito al revertir la analgesia.',
    nursingCare: [
      'ATENCIÓN: La semivida de la naloxona (30-90 min) suele ser mucho menor que la del opioide (ej. fentanilo, metadona, morfina retardada). El paciente puede volver a caer en depresión respiratoria al agotarse el antídoto.',
      'Vigilancia continua de constantes y Frecuencia Respiratoria durante al menos 2-4 horas.',
      'Titular despacio para evitar el despertar violento con dolor insoportable y agitación psicomotriz extrema.'
    ]
  },
  {
    id: 'flumazenilo',
    name: 'Flumazenilo',
    commercialNames: ['Anexate'],
    group: 'Antagonistas de receptores de benzodiacepinas (Antídoto)',
    indications: 'Reversión del efecto sedante central de benzodiacepinas en anestesia o sobredosis accidental/intencionada.',
    posology: 'Inicial: 0.2 mg IV en 15 segundos. Si no responde en 60 segundos, inyectar 0.1 mg repetible cada minuto hasta un máximo de 1 mg.',
    administration: 'Exclusivamente Intravenosa.',
    dilution: 'Ampollas de 0.5 mg / 5 ml o 1 mg / 10 ml listas para inyección directa.',
    adverseEffects: 'Convulsiones (especialmente en epilépticos o intoxicaciones mixtas con antidepresivos tricíclicos), náuseas, agitación, palpitaciones.',
    nursingCare: [
      'Mantener monitorización respiratoria y cardiaca continua.',
      'Riesgo de resedación: la vida media del flumazenilo es corta (unos 50 minutos).',
      'No utilizar en intoxicaciones con fármacos proconvulsivantes (tricíclicos).'
    ]
  }
];
