import { EcoeStation } from '../../types';

export const ECOE_STATIONS: EcoeStation[] = [
  {
    id: 'ecoe-01',
    number: 1,
    title: 'Higiene de Manos y Colocación / Retirada de EPI',
    scenario: 'Acudes a atender a un paciente ingresado en aislamiento por contacto y gotas debido a sospecha de infección respiratoria transmisible. Debes realizar la higiene correcta de manos y el procedimiento estandarizado de colocación y retirada segura del Equipo de Protección Individual (EPI).',
    level: 'Básico',
    timeLimitMinutes: 8,
    materialsNeeded: ['Solución hidroalcohólica', 'Guantes de nitrilo', 'Bata impermeable desechable', 'Mascarilla quirúrgica o FFP2', 'Protección ocular / gafas', 'Contenedor de residuos Grupo III (biopeligrosos)'],
    checklistSteps: [
      { id: 'e1-s1', phase: 'Preparación', instruction: 'Retirar reloj, anillos, pulseras y verificar uñas cortas sin esmalte ni postizos.', points: 10, isCriticalError: false },
      { id: 'e1-s2', phase: 'Preparación', instruction: 'Realizar fricción hidroalcohólica siguiendo la técnica de los 8 pasos de la OMS durante 20-30 segundos asegurando cobertura total.', points: 15, isCriticalError: true },
      { id: 'e1-s3', phase: 'Ejecución', instruction: 'Colocar primero la bata cubriendo torso de cuello a rodillas y atar lazos en cuello y cintura.', points: 10, isCriticalError: false },
      { id: 'e1-s4', phase: 'Ejecución', instruction: 'Colocar la mascarilla asegurando buen ajuste en puente nasal y sellado periférico en mentón.', points: 10, isCriticalError: false },
      { id: 'e1-s5', phase: 'Ejecución', instruction: 'Colocar la protección ocular (pantalla o gafas protectoras integrales).', points: 10, isCriticalError: false },
      { id: 'e1-s6', phase: 'Ejecución', instruction: 'Colocar los guantes extendiendo los puños para que cubran completamente el puño de la bata.', points: 10, isCriticalError: false },
      { id: 'e1-s7', phase: 'Finalización y Comunicación', instruction: 'Retirada segura: retirar guantes con técnica pico de pato / guante en guante sin tocar el exterior contaminado.', points: 15, isCriticalError: true },
      { id: 'e1-s8', phase: 'Finalización y Comunicación', instruction: 'Higiene inmediata de manos antes de tocar la cara para retirar protección ocular y mascarilla.', points: 10, isCriticalError: true },
      { id: 'e1-s9', phase: 'Finalización y Comunicación', instruction: 'Retirar la mascarilla tirando de las gomas posteriores sin tocar nunca la parte frontal de filtrado.', points: 10, isCriticalError: true }
    ],
    criticalErrorsDescription: [
      'Tocar la superficie exterior de la mascarilla o bata durante la retirada.',
      'Omitir la higiene de manos intermedia tras la retirada de guantes contaminados.',
      'Llevar joyas o reloj durante la técnica aséptica.'
    ],
    learningObjectives: [
      'Dominar los 5 momentos del lavado de manos de la OMS.',
      'Secuencia correcta de colocación y retirada del EPI para prevenir infecciones nosocomiales.'
    ],
    docentSource: 'Protocolo de Seguridad del Paciente UCLM y Guía de Higiene de Manos OMS.'
  },
  {
    id: 'ecoe-02',
    number: 2,
    title: 'Toma y Registro Sistemático de Constantes Vitales',
    scenario: 'Paciente de 68 años recién ingresado en planta por cuadro de fiebre y malestar general. Debes realizar la medición completa de constantes vitales, evaluar la escala visual analógica del dolor (EVA) y comunicar los hallazgos al paciente y al registro.',
    level: 'Básico',
    timeLimitMinutes: 10,
    materialsNeeded: ['Esfigmomanómetro aneroide o digital validado', 'Manguito de tamaño adecuado al brazo', 'Fonendoscopio', 'Pulsioxímetro de dedo', 'Termómetro timpánico o axilar', 'Reloj con segundero', 'Escala EVA'],
    checklistSteps: [
      { id: 'e2-s1', phase: 'Preparación', instruction: 'Identificar al paciente con dos identificadores verbales (Nombre, Apellidos, Fecha de nacimiento) y pulsera.', points: 10, isCriticalError: true },
      { id: 'e2-s2', phase: 'Preparación', instruction: 'Explicar el procedimiento al paciente, asegurar reposo de al menos 5 minutos sentado o en decúbito y realizar higiene de manos.', points: 10, isCriticalError: false },
      { id: 'e2-s3', phase: 'Ejecución', instruction: 'Colocar el manguito de TA 2-3 cm por encima de la fosa antecubital a la altura del corazón.', points: 10, isCriticalError: false },
      { id: 'e2-s4', phase: 'Ejecución', instruction: 'Medir la Tensión Arterial reconociendo ruidos de Korotkoff (fase I sistólica, fase V diastólica).', points: 15, isCriticalError: false },
      { id: 'e2-s5', phase: 'Ejecución', instruction: 'Palpar pulso radial contando frecuencia cardíaca y ritmo durante 60 segundos si es irregular.', points: 15, isCriticalError: false },
      { id: 'e2-s6', phase: 'Ejecución', instruction: 'Contabilizar la frecuencia respiratoria de forma discreta sin avisar al paciente para evitar alteración voluntaria del patrón.', points: 15, isCriticalError: false },
      { id: 'e2-s7', phase: 'Ejecución', instruction: 'Colocar pulsioxímetro en dedo limpio y templado comprobando curva pletismográfica de buena perfusión.', points: 10, isCriticalError: false },
      { id: 'e2-s8', phase: 'Finalización y Comunicación', instruction: 'Preguntar por el dolor mediante escala EVA (0 al 10) y registrar todas las constantes con fecha, hora y firma.', points: 15, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'No verificar la identidad inequívoca del paciente.',
      'Utilizar un manguito de tensión arterial inadecuado al perímetro braquial (provoca falsas lecturas de HTA o hipotensión).',
      'No desinfectar las olivas y campana del fonendoscopio entre pacientes.'
    ],
    learningObjectives: [
      'Técnica fidedigna de auscultación arterial.',
      'Detección precoz de signos de alarma en constantes vitales (NEWS 2).'
    ],
    docentSource: 'Guías de Práctica Clínica UCLM - Fundamentos de Enfermería.'
  },
  {
    id: 'ecoe-03',
    number: 3,
    title: 'Determinación de Glucemia Capilar y Manejo de Hipoglucemia',
    scenario: 'Paciente diabético tipo 2 ingresado que refiere sudoración fría profusa, temblor y palpitaciones antes de la merienda. Debes realizar la glucemia capilar inmediata y aplicar el protocolo terapéutico si se confirma hipoglucemia.',
    level: 'Básico',
    timeLimitMinutes: 7,
    materialsNeeded: ['Glucómetro calibrado', 'Tiras reactivas compatibles', 'Lanceta retráctil de seguridad', 'Gasas secas', 'Guantes no estériles', 'Zumo de frutas o sobres de azúcar', 'Contenedor amarillo de punzantes'],
    checklistSteps: [
      { id: 'e3-s1', phase: 'Preparación', instruction: 'Identificar al paciente, explicar el procedimiento y realizar higiene de manos con colocación de guantes.', points: 10, isCriticalError: false },
      { id: 'e3-s2', phase: 'Preparación', instruction: 'Comprobar fecha de caducidad del bote de tiras reactivas y código del glucómetro.', points: 10, isCriticalError: false },
      { id: 'e3-s3', phase: 'Ejecución', instruction: 'Limpiar el pulpejo del dedo con agua y jabón (o secar completamente si se usó antiséptico para no falsear el resultado).', points: 10, isCriticalError: false },
      { id: 'e3-s4', phase: 'Ejecución', instruction: 'Puncionar en la cara lateral del pulpejo (menor densidad de terminaciones nerviosas y mejor capilaridad).', points: 15, isCriticalError: false },
      { id: 'e3-s5', phase: 'Ejecución', instruction: 'Desechar la primera gota con gasa seca y aproximar la segunda gota al canal capilar de la tira reactiva.', points: 15, isCriticalError: false },
      { id: 'e3-s6', phase: 'Ejecución', instruction: 'Desechar inmediatamente la lanceta en el contenedor de objetos punzantes rígido.', points: 15, isCriticalError: true },
      { id: 'e3-s7', phase: 'Finalización y Comunicación', instruction: 'Si glucemia < 70 mg/dL: aplicar la "Regla de los 15" (administrar 15g de hidratos rápidos, esperar 15 min y repetir test).', points: 15, isCriticalError: true },
      { id: 'e3-s8', phase: 'Finalización y Comunicación', instruction: 'Registrar valor exacto, síntomas clínicos acompañantes y medidas correctoras en la gráfica.', points: 10, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'Encapsular manualmente una aguja o lanceta (riesgo severo de pinchazo accidental).',
      'No desechar la primera gota o exprimir bruscamente el dedo (produce hemólisis y dilución por líquido intersticial falseando el resultado).',
      'No reevaluar al paciente tras 15 minutos en caso de hipoglucemia.'
    ],
    learningObjectives: [
      'Manejo protocolizado de la hipoglucemia aguda hospitalaria.',
      'Seguridad biológica y uso exclusivo de contenedores de punzantes.'
    ],
    docentSource: 'Protocolo de Diabetes SESCAM y Guía ECOE UCLM.'
  },
  {
    id: 'ecoe-04',
    number: 4,
    title: 'Administración Segura de Medicación Oral (Los 10 Correctos)',
    scenario: 'Debes administrar la medicación oral de las 12:00 a la paciente Dña. Carmen R. S., consistente en Enalapril 10 mg comprimidos y Paracetamol 1 g. Debes demostrar la aplicación metódica de los 10 correctos de la enfermería y el doble chequeo farmacológico.',
    level: 'Intermedio',
    timeLimitMinutes: 8,
    materialsNeeded: ['Hoja de administración electrónica / prescripción médica', 'Vaso de medicación monodosis', 'Comprimidos en blíster identificado', 'Vaso con agua', 'Boli o lector de código de barras'],
    checklistSteps: [
      { id: 'e4-s1', phase: 'Preparación', instruction: 'Verificar los primeros 5 correctos en la preparación: Medicamento correcto, Dosis correcta, Vía correcta, Hora correcta y Paciente correcto.', points: 15, isCriticalError: true },
      { id: 'e4-s2', phase: 'Preparación', instruction: 'Comprobar fecha de caducidad del envase e integridad del blíster antes de abrirlo.', points: 10, isCriticalError: true },
      { id: 'e4-s3', phase: 'Preparación', instruction: 'Comprobar alergias medicamentosas conocidas en la historia clínica y preguntarle activamente al paciente.', points: 15, isCriticalError: true },
      { id: 'e4-s4', phase: 'Ejecución', instruction: 'Informar a la paciente sobre el nombre y propósito del fármaco que va a ingerir.', points: 10, isCriticalError: false },
      { id: 'e4-s5', phase: 'Ejecución', instruction: 'Colocar a la paciente en posición Fowler o semi-Fowler para prevenir broncoaspiración.', points: 10, isCriticalError: false },
      { id: 'e4-s6', phase: 'Ejecución', instruction: 'Supervisar directamente la ingesta completa del comprimido con agua (nunca dejar medicación en la mesilla).', points: 15, isCriticalError: true },
      { id: 'e4-s7', phase: 'Finalización y Comunicación', instruction: 'Registrar la administración inmediatamente tras haberla presenciado (nunca antes).', points: 15, isCriticalError: true },
      { id: 'e4-s8', phase: 'Finalización y Comunicación', instruction: 'Educar sobre posibles efectos adversos precoces (ej. mareo por hipotensión con enalapril).', points: 10, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'Dejar la medicación sobre la mesilla de noche del paciente sin presenciar la toma.',
      'No comprobar las alergias medicamentosas antes de la administración.',
      'Firmar el registro de administración antes de que el fármaco haya sido efectivamente deglutido.'
    ],
    learningObjectives: [
      'Cero errores de medicación según recomendaciones ISMP.',
      'Técnica de administración oral con prevención de aspiración.'
    ],
    docentSource: 'Guía de Práctica Segura en Administración de Medicamentos ISMP-España.'
  },
  {
    id: 'ecoe-05',
    number: 5,
    title: 'Inyección Subcutánea de Heparina de Bajo Peso Molecular',
    scenario: 'Paciente inmovilizado en postoperatorio con indicación de Enoxaparina 40 mg (0.4 mL) SC cada 24 horas como profilaxis de trombosis venosa profunda. Debes preparar y administrar la dosis subcutánea demostrando la técnica adecuada.',
    level: 'Intermedio',
    timeLimitMinutes: 7,
    materialsNeeded: ['Jeringa precargada de Enoxaparina con sistema de seguridad pasiva', 'Gasas estériles', 'Clorhexidina alcohólica al 2% o suero fisiológico', 'Guantes no estériles', 'Contenedor de punzantes'],
    checklistSteps: [
      { id: 'e5-s1', phase: 'Preparación', instruction: 'Verificar los 10 correctos, alergias e historial de trombocitopenia inducida por heparina.', points: 10, isCriticalError: true },
      { id: 'e5-s2', phase: 'Preparación', instruction: 'NO purgar la pequeña burbuja de aire de la jeringa precargada (está diseñada para empujar el fármaco y sellar el trayecto).', points: 15, isCriticalError: false },
      { id: 'e5-s3', phase: 'Ejecución', instruction: 'Seleccionar zona adecuada: abdomen anterolateral o posterolateral, alternando lados y a más de 5 cm del ombligo.', points: 10, isCriticalError: false },
      { id: 'e5-s4', phase: 'Ejecución', instruction: 'Desinfectar la zona con movimiento centrífugo y dejar secar completamente.', points: 10, isCriticalError: false },
      { id: 'e5-s5', phase: 'Ejecución', instruction: 'Realizar un pellizco de piel suave entre pulgar e índice introduciendo la aguja en ángulo de 90º.', points: 15, isCriticalError: false },
      { id: 'e5-s6', phase: 'Ejecución', instruction: 'Inyectar lentamente la solución manteniendo el pellizco durante toda la inyección.', points: 10, isCriticalError: false },
      { id: 'e5-s7', phase: 'Ejecución', instruction: 'NUNCA aspirar antes de inyectar ni masajear la zona al retirar la aguja (previene hematomas subcutáneos extensos).', points: 15, isCriticalError: true },
      { id: 'e5-s8', phase: 'Finalización y Comunicación', instruction: 'Activar el dispositivo de seguridad de la aguja y desechar de inmediato en contenedor rígido de punzantes.', points: 15, isCriticalError: true }
    ],
    criticalErrorsDescription: [
      'Masajear la zona tras la punción con heparina (provoca sangrado capilar y hematoma doloroso).',
      'Purgar la burbuja de aire perdiendo parte de la dosis calibrada.',
      'Aspirar antes de la inyección subcutánea de heparina.'
    ],
    learningObjectives: [
      'Conocer la fisiología del tejido celular subcutáneo.',
      'Prevención de complicaciones hemorrágicas locales en HBPM.'
    ],
    docentSource: 'Protocolo de Tromboprofilaxis Hospital Universitario de Toledo.'
  },
  {
    id: 'ecoe-06',
    number: 6,
    title: 'Extracción de Sangre Venosa Periférica con Sistema de Vacío',
    scenario: 'Paciente que requiere analítica urgente de control (hemograma, bioquímica general y pruebas de coagulación). Debes realizar la punción venosa en fosa antecubital utilizando sistema Vacutainer y respetando escrupulosamente el orden de los tubos.',
    level: 'Intermedio',
    timeLimitMinutes: 10,
    materialsNeeded: ['Compresor de goma o látex', 'Portatubos (campana)', 'Aguja Vacutainer o palomilla con sistema de seguridad', 'Tubos de extracción: citrato azul, bioquímica amarillo/oro, hemograma lila', 'Clorhexidina al 2%', 'Gasas estériles', 'Apósito', 'Contenedor de punzantes', 'Etiquetas identificativas de paciente'],
    checklistSteps: [
      { id: 'e6-s1', phase: 'Preparación', instruction: 'Verificar la petición médica y la doble identificación del paciente y de las etiquetas de los tubos.', points: 10, isCriticalError: true },
      { id: 'e6-s2', phase: 'Preparación', instruction: 'Preguntar si está en ayunas, alergias a antisépticos o látex y si ha tenido mareos previos.', points: 5, isCriticalError: false },
      { id: 'e6-s3', phase: 'Ejecución', instruction: 'Colocar compresor 7-10 cm por encima del punto de punción sin mantenerlo más de 1 minuto.', points: 10, isCriticalError: false },
      { id: 'e6-s4', phase: 'Ejecución', instruction: 'Palpar vena mediana cubital o basílica y desinfectar la piel dejando evaporar el antiséptico.', points: 10, isCriticalError: false },
      { id: 'e6-s5', phase: 'Ejecución', instruction: 'Puncionar con el bisel hacia arriba en ángulo de 15 a 30 grados fijando la vena firmemente.', points: 15, isCriticalError: false },
      { id: 'e6-s6', phase: 'Ejecución', instruction: 'Insertar los tubos en el orden protocolizado: 1º Citrato azul (llenar al 100%), 2º Bioquímica amarillo, 3º EDTA lila.', points: 20, isCriticalError: true },
      { id: 'e6-s7', phase: 'Ejecución', instruction: 'Retirar el compresor ANTES de retirar la aguja de la vena para evitar hematoma.', points: 10, isCriticalError: false },
      { id: 'e6-s8', phase: 'Finalización y Comunicación', instruction: 'Invertir suavemente cada tubo según su aditivo (citrato x4, amarillo x5, lila x8-10) sin agitar bruscamente.', points: 10, isCriticalError: false },
      { id: 'e6-s9', phase: 'Finalización y Comunicación', instruction: 'Desechar la aguja con el protector de bioseguridad accionado en el contenedor amarillo rígido.', points: 10, isCriticalError: true }
    ],
    criticalErrorsDescription: [
      'Invertir el orden de los tubos contaminando la muestra con EDTA en el tubo de citrato o bioquímica.',
      'Mantener el compresor puesto durante más de 2 minutos (provoca hemoconcentración y hemólisis).',
      'Agitar enérgicamente los tubos produciendo hemólisis de los hematíes.'
    ],
    learningObjectives: [
      'Orden estandarizado de tubos del Clinical and Laboratory Standards Institute (CLSI).',
      'Prevención de flebitis y hematomas en punciones venosas.'
    ],
    docentSource: 'Manual de Procedimientos de Extracción Sanguínea SESCAM.'
  },
  {
    id: 'ecoe-07',
    number: 7,
    title: 'Canalización de Vía Venosa Periférica (VVP) en Maniquí',
    scenario: 'Paciente que ingresa deshidratado y requiere fluidoterapia intravenosa con suero glucosalino al 5%. Debes seleccionar el calibre adecuado del catéter corto (Abocath 20G rosa o 18G verde), canalizar la vena con técnica estéril y fijar el apósito transparente.',
    level: 'Avanzado',
    timeLimitMinutes: 12,
    materialsNeeded: ['Catéter intravenoso periférico (20G y 18G)', 'Compresor elástico', 'Guantes estériles o limpios según protocolo', 'Clorhexidina alcohólica al 2%', 'Bioconector o alargadera con llave de 3 pasos purgada con suero', 'Jeringa de 10 mL con SF al 0.9%', 'Apósito transparente estéril de poliuretano', 'Contenedor de punzantes'],
    checklistSteps: [
      { id: 'e7-s1', phase: 'Preparación', instruction: 'Verificar prescripción, identificar al paciente y purgar la alargadera/bioconector con suero salino estéril.', points: 10, isCriticalError: false },
      { id: 'e7-s2', phase: 'Preparación', instruction: 'Colocar compresor y explorar el trayecto venoso buscando venas distales del antebrazo antes de zonas de flexión.', points: 10, isCriticalError: false },
      { id: 'e7-s3', phase: 'Ejecución', instruction: 'Desinfectar ampliamente con clorhexidina 2% alcohólica mediante técnica de fricción y dejar secar 30 s.', points: 10, isCriticalError: true },
      { id: 'e7-s4', phase: 'Ejecución', instruction: 'Traccionar la piel para estabilizar la vena e introducir el catéter con bisel hacia arriba en ángulo de 20-30º.', points: 15, isCriticalError: false },
      { id: 'e7-s5', phase: 'Ejecución', instruction: 'Al observar retorno venoso en la cámara, descender el ángulo casi paralelo a la piel y avanzar la cánula sobre el fiador.', points: 15, isCriticalError: false },
      { id: 'e7-s6', phase: 'Ejecución', instruction: 'Soltar el compresor antes de retirar completamente la aguja metálica comprimiendo la punta distal del catéter.', points: 10, isCriticalError: false },
      { id: 'e7-s7', phase: 'Ejecución', instruction: 'Desechar inmediatamente la aguja metálica con sistema de bioseguridad en el contenedor rígido.', points: 10, isCriticalError: true },
      { id: 'e7-s8', phase: 'Finalización y Comunicación', instruction: 'Conectar la alargadera purgada, comprobar reflujo de sangre y lavar con técnica pulsátil (push-pause).', points: 10, isCriticalError: false },
      { id: 'e7-s9', phase: 'Finalización y Comunicación', instruction: 'Fijar con apósito transparente estéril dejando visible el punto de inserción y rotular fecha, calibre y firma.', points: 10, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'Reintroducir la aguja metálica (fiador) dentro del catéter de teflón mientras está en la vena (riesgo de sección del catéter y embolia de plástico).',
      'Tapar el punto de inserción con esparadrapo opaco impidiendo vigilar signos de flebitis.',
      'No purgar el bioconector con suero antes de conectarlo (riesgo de embolia gaseosa).'
    ],
    learningObjectives: [
      'Estrategia Proyecto Flebitis Zero para prevención de bacteriemias asociadas a catéter.',
      'Técnica pulsátil push-pause para permeabilización.'
    ],
    docentSource: 'Proyecto Bacteriemia Zero & Flebitis Zero - Ministerio de Sanidad.'
  },
  {
    id: 'ecoe-08',
    number: 8,
    title: 'Cura Aséptica de Herida Quirúrgica y Prevención de UPP',
    scenario: 'Paciente intervenido de laparotomía hace 48 horas que tiene apósito manchado de exudado serohemático. Debes realizar la cura en condiciones de estricta asepsia, valorar signos de infección y registrar la evolución de la incisión y los puntos de apoyo de UPP.',
    level: 'Intermedio',
    timeLimitMinutes: 10,
    materialsNeeded: ['Campo estéril', 'Guantes estériles y no estériles', 'Pinza de disección y Kocher estériles', 'Gasas estériles', 'Suero fisiológico al 0.9%', 'Clorhexidina acuosa al 2%', 'Apósito estéril transpirable', 'Bolsa de residuos'],
    checklistSteps: [
      { id: 'e8-s1', phase: 'Preparación', instruction: 'Identificar al paciente, explicar el procedimiento, garantizar intimidad y realizar higiene de manos.', points: 10, isCriticalError: false },
      { id: 'e8-s2', phase: 'Preparación', instruction: 'Colocar guantes limpios no estériles para retirar con delicadeza el apósito sucio observando exudado.', points: 10, isCriticalError: false },
      { id: 'e8-s3', phase: 'Ejecución', instruction: 'Retirar guantes sucios, higiene de manos con solución alcohólica y abrir el paño de campo estéril.', points: 15, isCriticalError: true },
      { id: 'e8-s4', phase: 'Ejecución', instruction: 'Colocar guantes estériles sin tocar la superficie externa estéril con la piel desnuda.', points: 10, isCriticalError: true },
      { id: 'e8-s5', phase: 'Ejecución', instruction: 'Limpiar la herida con gasas empapadas en SF al 0.9% en un solo sentido (de arriba hacia abajo o del centro a la periferia).', points: 15, isCriticalError: false },
      { id: 'e8-s6', phase: 'Ejecución', instruction: 'Utilizar una gasa nueva para cada pasada sin volver a repasar la zona limpia con gasa usada.', points: 10, isCriticalError: true },
      { id: 'e8-s7', phase: 'Ejecución', instruction: 'Secar suavemente por toques con gasa estéril y aplicar antiséptico si está protocolizado.', points: 10, isCriticalError: false },
      { id: 'e8-s8', phase: 'Finalización y Comunicación', instruction: 'Cubrir con apósito estéril sellando bordes, valorar talones/sacro para prevención de UPP y registrar cura.', points: 20, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'Contaminar el campo estéril o los guantes estériles al tocarlos con superficies no asépticas.',
      'Pasar la misma gasa sucia de un extremo a otro de la herida quirúrgica extendiendo patógenos.',
      'Omitir la valoración de signos precoces de dehiscencia o infección local (calor, rubor, edema, dolor).'
    ],
    learningObjectives: [
      'Mantenimiento de la cadena aséptica en cuidados quirúrgicos.',
      'Criterios de valoración y cura de heridas de primera intención.'
    ],
    docentSource: 'Guía de Práctica Clínica de Heridas y UPP del SESCAM.'
  },
  {
    id: 'ecoe-09',
    number: 9,
    title: 'Sondaje Vesical Permanente con Técnica Estéril en Maniquí',
    scenario: 'Paciente varón ingresado en urgencias con globo vesical doloroso y retención aguda de orina de 12 horas de evolución. Se prescribe sondaje vesical evacuador y permanente con sonda Foley de 2 vías CH 16 y bolsa colectora de circuito cerrado.',
    level: 'Avanzado',
    timeLimitMinutes: 12,
    materialsNeeded: ['Sonda Foley de látex/silicona CH 16 de 2 vías', 'Bolsa colectora de orina de circuito cerrado con válvula antirreflujo', 'Paño estéril fenestrado y paño liso', 'Guantes estériles (2 pares)', 'Gasas estériles', 'Solución de clorhexidina jabonosa acuosa', 'Agua bidestilada estéril (ampolla de 10 mL)', 'Jeringa de 10 mL estéril', 'Lubricante urológico estéril con anestésico local', 'Cuña / batea'],
    checklistSteps: [
      { id: 'e9-s1', phase: 'Preparación', instruction: 'Informar al paciente de la técnica pidiendo su colaboración y preservar la máxima intimidad.', points: 10, isCriticalError: false },
      { id: 'e9-s2', phase: 'Preparación', instruction: 'Aseo genital previo con agua y jabón, retirando el prepucio para limpieza rigurosa del glande y meato.', points: 10, isCriticalError: false },
      { id: 'e9-s3', phase: 'Ejecución', instruction: 'Colocación de guantes estériles y delimitación del campo con el paño estéril fenestrado.', points: 10, isCriticalError: true },
      { id: 'e9-s4', phase: 'Ejecución', instruction: 'Instilar lubricante anestésico estéril en la uretra sosteniendo el pene en ángulo de 90º y esperar 2-3 min.', points: 10, isCriticalError: false },
      { id: 'e9-s5', phase: 'Ejecución', instruction: 'Conectar la sonda al circuito cerrado ANTES de introducirla para mantener circuito estéril cerrado.', points: 10, isCriticalError: false },
      { id: 'e9-s6', phase: 'Ejecución', instruction: 'Introducir suavemente la sonda hasta la bifurcación comprobando la salida efectiva de orina antes de inflar el balón.', points: 20, isCriticalError: true },
      { id: 'e9-s7', phase: 'Ejecución', instruction: 'Insuflar el balón de autorretención con 8-10 mL de agua bidestilada estéril (NUNCA suero fisiológico).', points: 10, isCriticalError: true },
      { id: 'e9-s8', phase: 'Ejecución', instruction: 'Traccionar suavemente de la sonda hasta notar resistencia y recolocar el prepucio hacia adelante (prevenir parafimosis).', points: 10, isCriticalError: true },
      { id: 'e9-s9', phase: 'Finalización y Comunicación', instruction: 'Fijar la sonda al muslo sin tracción, colocar la bolsa por debajo del nivel de la vejiga sin tocar el suelo y registrar.', points: 10, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'Insuflar el balón de la sonda antes de observar salida de orina (puede inflarse dentro de la uretra prostática produciendo desgarro severo y hemorragia).',
      'Llenar el balón con suero fisiológico (el cloruro sódico puede cristalizar en el canal impidiendo su posterior desinflado).',
      'No reponer el prepucio tras la técnica produciendo edema y parafimosis isquémica.',
      'Colocar la bolsa colectora por encima del nivel de la pelvis favoreciendo el reflujo urinario e infección.'
    ],
    learningObjectives: [
      'Proyecto ITU Zero para prevención de infección urinaria asociada a catéter vesical.',
      'Manejo aséptico y circuito cerrado estricto.'
    ],
    docentSource: 'Protocolo de Sondaje Vesical y Proyecto ITU Zero - SESCAM.'
  },
  {
    id: 'ecoe-10',
    number: 10,
    title: 'Valoración y Soporte Inicial Sistemático ABCDE',
    scenario: 'Encuentras a una paciente ingresada inconsciente en su cama con respiración ruidosa. Debes realizar la aproximación sistemática ABCDE para identificar problemas con compromiso vital inmediato, activar ayuda y tomar las medidas iniciales de soporte.',
    level: 'Avanzado',
    timeLimitMinutes: 10,
    materialsNeeded: ['Cánula de Guedel (tamaños 2, 3 y 4)', 'Mascarilla facial con bolsa reservorio de O2 y caudalímetro', 'Aspirador de secreciones y sondas Yankauer', 'Monitor desfibrilador / carro de paradas', 'Pulsioxímetro y fonendoscopio'],
    checklistSteps: [
      { id: 'e10-s1', phase: 'Preparación', instruction: 'Garantizar seguridad del entorno, comprobar inconsciencia mediante estímulo verbal y doloroso suave en trapecios.', points: 10, isCriticalError: false },
      { id: 'e10-s2', phase: 'Preparación', instruction: 'Gritar pidiendo ayuda urgente y solicitar carro de paradas / activación del equipo de emergencias del hospital.', points: 10, isCriticalError: true },
      { id: 'e10-s3', phase: 'Ejecución', instruction: 'A (Airway): Abrir vía aérea con maniobra frente-mentón, inspeccionar boca y aspirar si hay secreciones.', points: 15, isCriticalError: true },
      { id: 'e10-s4', phase: 'Ejecución', instruction: 'Seleccionar cánula de Guedel adecuada (medir desde comisura labial hasta lóbulo auricular) e insertarla rotando 180º.', points: 10, isCriticalError: false },
      { id: 'e10-s5', phase: 'Ejecución', instruction: 'B (Breathing): Valorar ventilación (ver, oír, sentir durante 10 s), auscultar murmullo vesicular y poner O2 a alto flujo.', points: 15, isCriticalError: false },
      { id: 'e10-s6', phase: 'Ejecución', instruction: 'C (Circulation): Palpar pulso carotídeo, tiempo de relleno capilar (< 2 s), TA y verificar monitorización cardíaca continua.', points: 15, isCriticalError: false },
      { id: 'e10-s7', phase: 'Ejecución', instruction: 'D (Disability): Evaluar escala Glasgow, simetría y reactividad pupilar (PIRRL) y realizar glucemia capilar inmediata.', points: 15, isCriticalError: false },
      { id: 'e10-s8', phase: 'Finalización y Comunicación', instruction: 'E (Exposure): Explorar cuerpo buscando hemorragias, exantemas o hipotermia previniendo pérdidas de calor y dar informe SBAR.', points: 10, isCriticalError: false }
    ],
    criticalErrorsDescription: [
      'No pedir ayuda de inmediato ante un paciente en parada o deterioro clínico inminente.',
      'No comprobar la permeabilidad de la vía aérea antes de iniciar otras maniobras.',
      'Olvidar la glucemia capilar en la evaluación neurológica (el coma hipoglucémico es reversible si se trata rápidamente).'
    ],
    learningObjectives: [
      'Metodología ABCDE de la ERC (European Resuscitation Council).',
      'Transferencia estructurada de información clínica mediante técnica SBAR.'
    ],
    docentSource: 'Recomendaciones ERC 2021 y Manual de Soporte Vital Avanzado UCLM.'
  }
];
