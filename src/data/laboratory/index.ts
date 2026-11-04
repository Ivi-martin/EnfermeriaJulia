import { LabAnalyte, BloodTube } from '../../types';

export const LAB_ANALYTES: LabAnalyte[] = [
  // HEMOGRAMA
  {
    name: 'Hemoglobina (Hb)',
    category: 'Hemograma',
    normalRange: 'Mujeres: 12.0 - 15.5 | Varones: 13.5 - 17.5',
    units: 'g/dL',
    highMeaning: 'Poliglobulia, deshidratación intensa (hemoconcentración), hipoxemia crónica (EPOC, tabaquismo).',
    lowMeaning: 'Anemia (ferropénica, megaloblástica, hemolítica), hemorragia aguda o crónica, hemodilución por sobrehidratación IV.',
    nursingSignificance: 'Vigilar astenia, mareo postural, palidez mucocutánea, taquicardia compensatoria y saturación de O2. Si Hb < 7 g/dL en paciente hospitalizado, preparar canalización de VVP de grueso calibre (18G) y pruebas cruzadas para eventual transfusión.'
  },
  {
    name: 'Hematocrito (Hto)',
    category: 'Hemograma',
    normalRange: 'Mujeres: 37 - 48 | Varones: 40 - 52',
    units: '%',
    highMeaning: 'Hemoconcentración grave por shock hipovolémico, quemaduras extensas o policitemia vera.',
    lowMeaning: 'Pérdida hemática, anemia o sobrecarga hídrica.',
    nursingSignificance: 'Evaluar balance hídrico acumulado y turgencia cutánea.'
  },
  {
    name: 'Leucocitos (Glóbulos Blancos)',
    category: 'Hemograma',
    normalRange: '4.500 - 11.000',
    units: '/mm³ (o x10^9/L)',
    highMeaning: 'Leucocitosis: infección bacteriana aguda, procesos inflamatorios graves, necrosis tisular, estrés físico agudo o corticoides.',
    lowMeaning: 'Leucopenia / Neutropenia (<1.500): inmunosupresión, quimioterapia, infecciones víricas graves (VIH, hepatitis) o sepsis fulminante.',
    nursingSignificance: 'En caso de neutropenia (<1.000 o grave <500), aplicar protocolo de aislamiento protector / neutropénico: extremar higiene de manos, mascarilla, evitar flores/vegetales crudos y vigilar temperatura cada 4 horas (la fiebre es una emergencia médica).'
  },
  {
    name: 'Plaquetas (Trombocitos)',
    category: 'Hemograma',
    normalRange: '150.000 - 450.000',
    units: '/mm³',
    highMeaning: 'Trombocitosis: reactiva a inflamación/infección, esplenectomía, ferropenia o trastorno mieloproliferativo (riesgo trombótico).',
    lowMeaning: 'Trombocitopenia (<100.000 leve, <50.000 moderada, <20.000 severa con riesgo de sangrado espontáneo): inducida por heparina (TIH), PTI, toxicidad medular.',
    nursingSignificance: 'Si plaquetas < 50.000, evitar inyecciones intramusculares (riesgo de hematoma profundo), utilizar cepillo dental suave, comprimir puntos de punción mínimo 5-10 minutos y vigilar petequias o melenas.'
  },

  // BIOQUÍMICA & FUNCIÓN ORGÁNICA
  {
    name: 'Glucosa en suero',
    category: 'Bioquímica',
    normalRange: 'Ayuno: 70 - 100 | Postprandial: < 140',
    units: 'mg/dL',
    highMeaning: 'Hiperglucemia: diabetes mellitus descompensada, cetoacidosis diabética, estrés quirúrgico/séptico, corticoterapia.',
    lowMeaning: 'Hipoglucemia (< 70 mg/dL): sobredosis de insulina o sulfonilureas, ayuno prolongado, sepsis grave, hepatopatía terminal.',
    nursingSignificance: 'Ante hipoglucemia sintomática (sudoración fría, temblor, taquicardia, desorientación), aplicar la "Regla de los 15": administrar 15 g de hidratos de carbono de absorción rápida (1 vaso de zumo o agua con 2 sobres de azúcar), esperar 15 min y reevaluar glucemia capilar.'
  },
  {
    name: 'Creatinina sérica',
    category: 'Bioquímica',
    normalRange: '0.6 - 1.2',
    units: 'mg/dL',
    highMeaning: 'Fracaso renal agudo (prerrenal por deshidratación, intrínseco o posrenal obstructivo), enfermedad renal crónica.',
    lowMeaning: 'Baja masa muscular (caquexia, ancianos encamados), malnutrición severa.',
    nursingSignificance: 'Monitorear diuresis horaria (<0.5 ml/kg/h alerta de oliguria). Comprobar ajuste posológico de fármacos nefrotóxicos (AINEs, aminoglucósidos, vancomicina).'
  },
  {
    name: 'Urea / BUN',
    category: 'Bioquímica',
    normalRange: 'Urea: 10 - 50 mg/dL (BUN: 7 - 20)',
    units: 'mg/dL',
    highMeaning: 'Hipovolemia, hemorragia digestiva alta (por digestión de proteínas hemáticas), hipercatabolismo o fallo renal.',
    lowMeaning: 'Dieta hipoproteica severa, sobrehidratación, insuficiencia hepática.',
    nursingSignificance: 'Comparar con el valor de creatinina para diferenciar etiología prerrenal (cociente BUN/Cr > 20) de daño parenquimatoso.'
  },
  {
    name: 'PCR (Proteína C Reactiva)',
    category: 'Bioquímica',
    normalRange: '< 5.0 (o < 0.5 mg/dL)',
    units: 'mg/L',
    highMeaning: 'Inflamación tisular aguda, infección bacteriana sistemática, postoperatorio inmediato, vasculitis.',
    lowMeaning: 'Normalidad / resolución del cuadro inflamatorio.',
    nursingSignificance: 'Útil para monitorizar la respuesta al tratamiento antibiótico. En sepsis, un descenso progresivo de PCR refleja éxito terapéutico.'
  },

  // IONES / ELECTRÓLITOS
  {
    name: 'Sodio sérico (Na+)',
    category: 'Iones',
    normalRange: '135 - 145',
    units: 'mEq/L (o mmol/L)',
    highMeaning: 'Hipernatremia (>145): deshidratación pura, diabetes insípida, exceso de suero salino al 0.9% o bicarbonato.',
    lowMeaning: 'Hiponatremia (<135; grave <120): SIADH, diuréticos tiazídicos, polidipsia psicógena, insuficiencia cardíaca congestiva.',
    nursingSignificance: '¡Alerta neurológica! Cambios bruscos causan edema cerebral (hiponatremia) o mielinolisis pontina central (si se corrige la hiponatremia demasiado rápido > 8-10 mEq/24h). Vigilar nivel de conciencia y signos de confusión.'
  },
  {
    name: 'Potasio sérico (K+)',
    category: 'Iones',
    normalRange: '3.5 - 5.0',
    units: 'mEq/L (o mmol/L)',
    highMeaning: 'Hiperpotasemia (>5.0; crítica >6.0): fracaso renal, acidosis metabólica, lisis celular masiva, fármacos ahorradores de potasio (espironolactona, IECA). Causa ondas T picudas en ECG, ensanchamiento QRS y paro cardíaco en asistolia.',
    lowMeaning: 'Hipopotasemia (<3.5; grave <2.8): pérdidas digestivas (vómitos, diarrea, aspiración gástrica), diuréticos de asa (furosemida), alcalosis. Causa aplanamiento de onda T, onda U prominente, calambres y debilidad muscular respiratoria.',
    nursingSignificance: '¡FÁRMACO DE ALTO RIESGO! NUNCA administrar Cloruro Potásico (ClK) en bolo intravenoso directo (es letal). Siempre diluido, por bomba de infusión y a velocidad máxima de 10-20 mEq/h con monitorización cardíaca continua.'
  },
  {
    name: 'Calcio sérico total (Ca++)',
    category: 'Iones',
    normalRange: '8.5 - 10.5',
    units: 'mg/dL',
    highMeaning: 'Hipercalcemia: hiperparatiroidismo primario, metástasis óseas osteolíticas, inmovilización prolongada.',
    lowMeaning: 'Hipocalcemia (<8.5): tiroidectomía accidental, déficit de vitamina D, hipoalbuminemia, pancreatitis aguda.',
    nursingSignificance: 'Explorar signos de tetania: Signo de Chvostek (espasmo facial al percutir nervio facial) y Signo de Trousseau (espasmo carpopedal al insuflar el manguito de TA por encima de la sistólica durante 3 min).'
  },

  // COAGULACIÓN
  {
    name: 'INR (International Normalized Ratio)',
    category: 'Coagulación',
    normalRange: '0.8 - 1.2 (En anticoagulación con Sintrom/Warfarina: 2.0 - 3.0; en válvulas mecánicas: 2.5 - 3.5)',
    units: 'Ratio',
    highMeaning: 'Sobredosificación de antagonistas de vitamina K (Acenocumarol / Warfarina), coagulopatía de consumo, insuficiencia hepatocelular severa (riesgo de hemorragia).',
    lowMeaning: 'Infraanticoagulación (riesgo de trombosis venosa o embolismo cerebral).',
    nursingSignificance: 'Si INR > 4.5 sin sangrado, suspender la dosis y avisar para ajuste. Si hay sangrado activo o INR > 8, tener preparado el antídoto: Vitamina K1 (Fitomenadiona) y/o Complejo Protrombínico.'
  },
  {
    name: 'TTPa / TTPA (Tiempo de Tromboplastina Parcial Activada)',
    category: 'Coagulación',
    normalRange: '25 - 35 (Ratio de control: 0.8 - 1.2)',
    units: 'segundos',
    highMeaning: 'Tratamiento con Heparina Sódica no fraccionada en perfusión continua (rango terapéutico buscado: 1.5 - 2.5 veces el valor control), hemofilia A/B, anticoagulante lúpico.',
    lowMeaning: 'Hipercoagulabilidad o fase precoz de CID.',
    nursingSignificance: 'Control horario de la bomba de perfusión de Heparina Sódica según protocolo de nomograma de TTPa. Tener a mano el antídoto: Sulfato de Protamina (1 mg neutraliza ~100 UI de heparina).'
  },
  {
    name: 'Dímero D',
    category: 'Coagulación',
    normalRange: '< 500 (ajustado por edad en mayores de 50 años: Edad x 10)',
    units: 'ng/mL',
    highMeaning: 'Tromboembolismo Pulmonar (TEP), Trombosis Venosa Profunda (TVP), sepsis, CID, cirugía mayor reciente, embarazo.',
    lowMeaning: 'Alto valor predictivo negativo: un Dímero D normal en un paciente con baja probabilidad clínica prácticamente descarta TEP/TVP.',
    nursingSignificance: 'Si el Dímero D es positivo y el paciente presenta disnea súbita, dolor torácico pleurítico o asimetría con edema y dolor en pantorrilla (signo de Homans), avisar inmediatamente al médico para Angio-TC o ecografía Doppler.'
  },

  // MARCADORES CARDÍACOS
  {
    name: 'Troponina T / I Ultrasensible',
    category: 'Marcadores Cardíacos',
    normalRange: '< 14 ng/L (según laboratorio)',
    units: 'ng/L (o pg/mL)',
    highMeaning: 'Infarto Agudo de Miocardio (IAM con elevación de ST o sin elevación de ST), miocarditis, pericarditis, embolismo pulmonar masivo, sepsis grave.',
    lowMeaning: 'Descarta daño miocárdico agudo si la curva seriada (a las 0h, 1h-3h) permanece plana y dentro de rango.',
    nursingSignificance: 'En dolor torácico opresivo, realizar ECG de 12 derivaciones en menos de 10 minutos, monitorización continua, reposo absoluto, vía venosa periférica permeable y toma seriada exacta de troponinas en el tiempo indicado por el protocolo docente.'
  },
  {
    name: 'Pro-BNP / NT-proBNP',
    category: 'Marcadores Cardíacos',
    normalRange: '< 125 pg/mL (< 75 años: < 300; > 75 años: < 450)',
    units: 'pg/mL',
    highMeaning: 'Insuficiencia Cardíaca Congestiva descompensada (tensión parietal de los ventrículos cardíacos aumentada).',
    lowMeaning: 'Descarta con gran fiabilidad que la disnea aguda sea de origen cardiogénico.',
    nursingSignificance: 'Evaluar disnea, ortopnea, ingurgitación yugular y edemas en miembros inferiores (con fóvea). Controlar diuresis y balance de líquidos tras la administración de diuréticos de asa.'
  }
];

export const BLOOD_TUBES: BloodTube[] = [
  {
    color: 'Frasco de Hemocultivos (Aerobio y Anaerobio)',
    hexColor: '#1e3a8a',
    additive: 'Caldo de cultivo enriquecido + resina neutralizadora de antibióticos',
    orderNumber: 1,
    sampleType: 'Sangre total para microbiología',
    commonTests: ['Bacteriemia, sepsis, endocarditis infecciosa, fiebre de origen desconocido.'],
    fillInstructions: 'Extraer SIEMPRE EN PRIMER LUGAR para evitar contaminación bacteriana externa. Inocular 8-10 mL por frasco (primero el aerobio -frasco azul o verde-, luego el anaerobio -frasco morado o naranja-). Desinfectar el tapón con clorhexidina al 2% antes de inocular.',
    inversions: 'Invertir suavemente 4 a 5 veces para mezclar la sangre con el medio.',
    clinicalTips: 'Desinfección rigurosa de la piel con clorhexidina alcohólica al 2% dejándola secar 30 segundos. Tomar 2 pares de hemocultivos de 2 punciones venosas distintas antes de iniciar el tratamiento antibiótico empírico.'
  },
  {
    color: 'Azul Celeste (Citrato Sódico al 3.2%)',
    hexColor: '#0284c7',
    additive: 'Citrato sódico líquido (proporción exacta 1 parte de anticoagulante por 9 partes de sangre)',
    orderNumber: 2,
    sampleType: 'Plasma citratado',
    commonTests: ['Coagulación: Tiempo de Protrombina (TP), INR, TTPa, Fibrinógeno, Dímero D, Factores de coagulación.'],
    fillInstructions: 'Llenar OBLIGATORIAMENTE HASTA LA LÍNEA DE ENRASE indicada en la etiqueta. Un llenado inferior al 90% altera la proporción 9:1 y falsea los tiempos de coagulación alargándolos artificialmente.',
    inversions: 'Invertir suavemente 3 a 4 veces inmediatamente tras la extracción.',
    clinicalTips: 'Si se utiliza aguja con palomilla (mariposa), se debe usar un tubo de desecho previo para purgar el aire del catéter y evitar que quede vacío dentro del tubo azul.'
  },
  {
    color: 'Amarillo / Oro (con Gel Separador) o Rojo',
    hexColor: '#eab308',
    additive: 'Activador de la coagulación (sílice) + Gel de densidad intermedia de separación de fases',
    orderNumber: 3,
    sampleType: 'Suero sanguíneo',
    commonTests: ['Bioquímica general (glucosa, urea, creatinina, iones, perfil hepático y lipídico), serologías víricas, marcadores tumorales y niveles de fármacos.'],
    fillInstructions: 'Llenar hasta que se detenga el vacío del tubo.',
    inversions: 'Invertir suavemente 5 a 6 veces para activar el proceso de coagulación antes de centrifugar.',
    clinicalTips: 'Dejar reposar en posición vertical durante 30 minutos antes de centrifugar para que se forme el coágulo completo y evitar fibrina residual en el suero.'
  },
  {
    color: 'Verde (Heparina de Litio o Sodio)',
    hexColor: '#16a34a',
    additive: 'Heparina de litio con o sin gel separador',
    orderNumber: 4,
    sampleType: 'Plasma heparinizado',
    commonTests: ['Bioquímica urgente de emergencias, amonio, cariotipo, gasometría en jeringa heparinizada, troponinas urgentes.'],
    fillInstructions: 'Llenar completamente por vacío.',
    inversions: 'Invertir cuidadosamente 8 a 10 veces para evitar microrrecuentos o microcoágulos.',
    clinicalTips: 'No utilizar heparina de litio si se van a determinar niveles de litio sérico.'
  },
  {
    color: 'Lila / Lavanda (EDTA K2 o K3)',
    hexColor: '#9333ea',
    additive: 'Ácido etilendiaminotetraacético (EDTA dipotásico o tripotásico), quelante del calcio',
    orderNumber: 5,
    sampleType: 'Sangre total anticoagulada',
    commonTests: ['Hemograma completo, fórmula leucocitaria, recuento de plaquetas, velocidad de sedimentación globular (VSG), hemoglobina glicosilada (HbA1c), frotis sanguíneo, banco de sangre (grupo y Rh).'],
    fillInstructions: 'Llenar hasta la marca de llenado recomendada.',
    inversions: 'Invertir suavemente de 8 a 10 veces de forma inmediata para impedir la agregación plaquetaria.',
    clinicalTips: 'Nunca trasvasar sangre de un tubo lila a un tubo de bioquímica (el EDTA contiene potasio y quelará el calcio, dando falsamente hiperpotasemia e hipocalcemia extrema).'
  },
  {
    color: 'Gris (Fluoruro Sódico / Oxalato Potásico)',
    hexColor: '#64748b',
    additive: 'Fluoruro sódico (inhibidor de la glucólisis) y oxalato potásico',
    orderNumber: 6,
    sampleType: 'Plasma fluorurado',
    commonTests: ['Curvas de sobrecarga oral de glucosa (test de O\'Sullivan en gestantes), lactato sérico basal.'],
    fillInstructions: 'Llenar hasta la marca y mezclar inmediatamente.',
    inversions: 'Invertir de 8 a 10 veces.',
    clinicalTips: 'El fluoruro inhibe la enolasa, impidiendo que los eritrocitos sigan consumiendo glucosa in vitro mientras la muestra llega al laboratorio central.'
  }
];

export const GASOMETRY_REFERENCE = {
  arterial: {
    pH: { min: 7.35, max: 7.45, label: '7.35 - 7.45' },
    PaCO2: { min: 35, max: 45, unit: 'mmHg', label: '35 - 45 mmHg' },
    HCO3: { min: 22, max: 26, unit: 'mEq/L', label: '22 - 26 mEq/L' },
    PaO2: { min: 80, max: 100, unit: 'mmHg', label: '80 - 100 mmHg' },
    EB: { min: -2, max: +2, unit: 'mEq/L', label: '-2 a +2 mEq/L' },
    SatO2: { min: 95, max: 100, unit: '%', label: '95 - 100%' },
    Lactato: { min: 0.5, max: 2.0, unit: 'mmol/L', label: '< 2.0 mmol/L' }
  },
  venous: {
    pH: { min: 7.31, max: 7.41, label: '7.31 - 7.41' },
    PvCO2: { min: 40, max: 50, unit: 'mmHg', label: '40 - 50 mmHg' },
    HCO3: { min: 22, max: 28, unit: 'mEq/L', label: '22 - 28 mEq/L' },
    PvO2: { min: 35, max: 45, unit: 'mmHg', label: '35 - 45 mmHg (¡No evalúa oxigenación arterial!)' },
    Lactato: { min: 0.5, max: 2.2, unit: 'mmol/L', label: '< 2.2 mmol/L' }
  }
};

export const ECG_SYSTEMATIC_STEPS = [
  {
    step: 1,
    title: 'Frecuencia Cardíaca (FC)',
    method: 'En ritmo regular: dividir 300 entre el número de cuadrados grandes (de 5 mm) entre dos complejos R consecutivos (300-150-100-75-60-50 lpm). En ritmo irregular (como fibrilación auricular): contar el número de complejos QRS en una tira de 6 segundos (30 cuadrados grandes) y multiplicar por 10.',
    normal: '60 - 100 lpm',
    abnormalities: 'Bradicardia (< 60 lpm), Taquicardia (> 100 lpm).'
  },
  {
    step: 2,
    title: 'Ritmo: ¿Es Sinusal?',
    method: 'Comprobar 3 criterios: 1) Presencia de ondas P positivas en derivaciones II, III y aVF, y negativa en aVR. 2) Cada onda P va seguida obligatoriamente de un complejo QRS. 3) Intervalo R-R regular y constante.',
    normal: 'Ritmo Sinusal regular.',
    abnormalities: 'Fibrilación Auricular (ausencia de ondas P sustituidas por ondas f desorganizadas y R-R absolutamente irregular), Flutter auricular (ondas F en dientes de sierra).'
  },
  {
    step: 3,
    title: 'Eje Eléctrico Cardíaco',
    method: 'Observar la polaridad neta del QRS en derivación I y en aVF. Si I es positivo y aVF es positivo, el eje está en el cuadrante normal (entre 0º y +90º). Si I es positivo y aVF es negativo: desviación a la izquierda (bloqueo anterior hemibloqueo, hipertrofia VI). Si I es negativo y aVF es positivo: desviación a la derecha.',
    normal: '-30º a +90º',
    abnormalities: 'Desviación patológica izquierda o derecha.'
  },
  {
    step: 4,
    title: 'Onda P (Despolarización Auricular)',
    method: 'Medir en DII. Duración máxima < 0.12 segundos (menos de 3 cuadritos pequeños) y voltaje < 2.5 mm.',
    normal: '< 0.12 s de anchura, < 2.5 mm de altura.',
    abnormalities: 'P pulmonale (alta y picuda en cor pulmonale) o P mitrale (bimodal y ancha en hipertrofia auricular izquierda).'
  },
  {
    step: 5,
    title: 'Intervalo PR (Conducción AV)',
    method: 'Desde el inicio de la onda P hasta el inicio del complejo QRS.',
    normal: '0.12 - 0.20 segundos (de 3 a 5 cuadritos pequeños de 1 mm).',
    abnormalities: 'PR alargado (> 0.20 s): Bloqueo Auriculoventricular de 1º grado. PR corto (< 0.12 s): Síndrome de preexcitación (Wolff-Parkinson-White).'
  },
  {
    step: 6,
    title: 'Complejo QRS (Despolarización Ventricular)',
    method: 'Medir desde el inicio de la primera deflexión (Q o R) hasta el final de la onda S (punto J).',
    normal: '< 0.12 segundos (menos de 3 cuadritos pequeños).',
    abnormalities: 'QRS ancho (≥ 0.12 s): Bloqueo Completo de Rama Derecha (BRD: patrón rsR\' en V1) o Bloqueo Completo de Rama Izquierda (BRI: onda R ancha y mellada en V5-V6, rS profundo en V1), o extrasístoles ventriculares.'
  },
  {
    step: 7,
    title: 'Segmento ST y Onda T (Repolarización e Isquemia)',
    method: 'Evaluar la línea isoeléctrica respecto al segmento PR previo.',
    normal: 'Segmento ST isoeléctrico (al nivel de la línea de base). Onda T asimétrica y concordante con el QRS.',
    abnormalities: 'Elevación del segmento ST (SCACEST: lesión transmural aguda que requiere activación urgente del Código Infarto / Angioplastia primaria), Descenso del ST o inversión de onda T (isquemia subendocárdica), Onda T hiperaguda simétrica (fase hiperaguda o hiperpotasemia).'
  }
];

export const URINE_TEST_STRIP_ITEMS = [
  { parameter: 'Leucocitos', normal: 'Negativo', positiveMeaning: 'Piuria, infección del tracto urinario (ITU) bacteriana o fúngica, cistitis, pielonefritis.' },
  { parameter: 'Nitritos', normal: 'Negativo', positiveMeaning: 'Presencia de bacterias uropatógenas gramnegativas reductoras de nitratos a nitritos (principalmente E. coli, Klebsiella, Proteus).' },
  { parameter: 'Proteínas / Albúmina', normal: 'Negativo / Trazas', positiveMeaning: 'Proteinuria: daño glomerular, preeclampsia en el embarazo, nefropatía diabética, fiebre alta, ejercicio extenuante.' },
  { parameter: 'pH', normal: '4.5 - 8.0 (habitual ~6.0)', positiveMeaning: 'pH alcalino (>7.5): infección por bacterias productoras de ureasa (Proteus mirabilis), acidosis tubular renal; pH ácido (<5.5): gota, acidosis metabólica.' },
  { parameter: 'Densidad', normal: '1.010 - 1.025', positiveMeaning: '> 1.025: orina muy concentrada por deshidratación; < 1.008: incapacidad de concentración renal o sobrecarga de líquidos.' },
  { parameter: 'Glucosa', normal: 'Negativo', positiveMeaning: 'Glucosuria: glucemia sérica superior al umbral renal de reabsorción tubular (~180 mg/dL), diabetes mellitus mal controlada.' },
  { parameter: 'Cuerpos Cetónicos', normal: 'Negativo', positiveMeaning: 'Cetonuria: cetoacidosis diabética, ayuno prolongado, vómitos repetidos, dieta cetogénica estricta.' },
  { parameter: 'Sangre / Hemoglobina', normal: 'Negativo', positiveMeaning: 'Hematuria / mioglobinuria: litiasis renal, ITU, traumatismo de vías urinarias, neoplasia urotelial o rabdomiólisis.' }
];
