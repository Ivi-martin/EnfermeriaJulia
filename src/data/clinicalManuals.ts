import { ClinicalManual } from '../types';

export const CLINICAL_MANUALS: ClinicalManual[] = [
  {
    id: 'man-vvp',
    title: 'Canalización y Mantenimiento de Vía Venosa Periférica (VVP)',
    category: 'Vías y Medicación',
    summary: 'Inserción estéril de un catéter intravenoso en una vena periférica para infusión de sueroterapia, administración de fármacos o transfusión sanguínea.',
    durationMin: 15,
    difficulty: 'Intermedio',
    indications: [
      'Administración parenteral de fármacos y fluidoterapia',
      'Transfusión de hemoderivados',
      'Extracción de muestras analíticas urgentes en el momento de la punción',
      'Mantener vía permeable de seguridad ante situaciones de urgencia'
    ],
    contraindications: [
      'Miembro afecto con fístula arteriovenosa para hemodiálisis',
      'Brazo homolateral a mastectomía o linfadenectomía axilar',
      'Zonas con infección local, quemaduras, hematomas extensos o flebitis previa',
      'Miembro con parálisis, paresia o edema severo'
    ],
    materials: [
      'Catéter venoso periférico adecuado: Calibre 20G (rosa) o 18G (verde) para fluidos habituales; 22G (azul) para venas finas o ancianos; 14-16G (naranja/gris) para politrauma y quirófano',
      'Compresor / Torniquete elástico libre de látex',
      'Antiséptico: Clorhexidina alcohólica al 2% (preferente) o povidona yodada',
      'Guantes no estériles de nitrilo y gasas estériles',
      'Apósito transparente estéril semipermeable con almohadilla de clorhexidina',
      'Válvula de seguridad bidireccional / bioconector y alargadera',
      'Jeringa de 10 ml precargada con Suero Fisiológico para lavado y comprobación de reflujo',
      'Contenedor rígido de objetos punzantes en la batea'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'Verificar la identidad del paciente, explicarle el procedimiento y solicitar su colaboración.',
          'Realizar higiene de manos con solución hidroalcohólica y colocarse guantes limpios.',
          'Colocar el compresor a 10-15 cm por encima del punto elegido (evitar flexuras siempre que sea posible, iniciar por venas del dorso de la mano o antebrazo).',
          'Palpar la vena elegida con la yema del dedo (debe ser elástica y resiliente, sin cordón indurado).',
          'Desinfectar la piel con clorhexidina al 2% realizando fricción durante 30 segundos y dejar secar completamente al aire (mínimo 30 segundos) para que ejerza su efecto antiséptico.'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'Traccionar suavemente la piel hacia abajo con la mano no dominante para fijar la vena.',
          'Sujetar el catéter con el bisel hacia arriba en un ángulo de 15° a 30° respecto a la piel.',
          'Puncionar la piel y avanzar suavemente hasta observar el reflujo de sangre en la cámara trasera del catéter.',
          'Disminuir el ángulo casi paralelo a la piel y avanzar 1-2 mm más la aguja para asegurar que la cánula plástica ha entrado en la luz venosa.',
          'Deslizar la cánula plástica hacia el interior de la vena mientras se mantiene fija la guía metálica (NUNCA reintroducir la aguja metálica por riesgo de cizallar el plástico).',
          'Retirar el compresor. Presionar suavemente la punta distal de la cánula para evitar salida de sangre y retirar la aguja metálica depositándola inmediatamente en el contenedor de punzantes.'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'Conectar el bioconector o alargadera purgada con suero fisiológico.',
          'Aspirar suavemente para comprobar reflujo venoso franco y lavar con 5-10 ml de SF usando técnica pulsátil (push-stop-push) y sellar a presión positiva.',
          'Fijar el catéter con el apósito transparente estéril dejando visible el punto de inserción para vigilar signos de flebitis.',
          'Anotar en el apósito: fecha, hora, calibre del catéter y firma de la enfermera.',
          'Recoger el material, quitarse los guantes y realizar higiene de manos.'
        ]
      }
    ],
    keySafetyTips: [
      'NUNCA intentar reintroducir la aguja dentro de la cánula de teflón: puede cortar el catéter y provocar una embolia por cuerpo extraño.',
      'Rotar las zonas: la duración máxima recomendada por CDC/RNAO es de 72-96 horas, o retirar ante el menor signo de dolor, eritema o induración.',
      'Mantener la técnica aséptica estricta durante todas las conexiones.'
    ],
    complications: [
      'Flebitis mecánica o química (dolor, eritema, cordón palpable)',
      'Extravasación o infiltración de suero en tejido celular subcutáneo (tumefacción, frialdad, dolor)',
      'Hematoma por rotura venosa accidental',
      'Obstrucción del catéter por reflujo hemático no lavado'
    ],
    nursingRecordGuideline: 'Registrar en la gráfica: localización anatómica exacta (ej. antebrazo izquierdo), calibre del catéter (ej. 20G), fecha y hora, tolerancia del paciente, permeabilidad con reflujo y ausencia de complicaciones.',
    offlineReady: true
  },
  {
    id: 'man-sv',
    title: 'Sondaje Vesical Femenino y Masculino (Técnica Cerrada)',
    category: 'Eliminación',
    summary: 'Introducción de una sonda estéril a través del meato uretral hasta la vejiga urinaria para vaciamiento o monitorización exacta de la diuresis.',
    durationMin: 20,
    difficulty: 'Avanzado',
    indications: [
      'Retención aguda de orina (RAO) o globo vesical sintomático',
      'Control estricto de diuresis horaria en pacientes críticos o inestables',
      'Cirugías urológicas, pélvicas prolongadas o cesáreas',
      'Manejo de incontinencia en pacientes con úlceras por presión sacras grado III-IV para evitar contaminación'
    ],
    contraindications: [
      'Sospecha de rotura uretral traumática (signo clave: uretorragia / sangre en meato tras traumatismo pélvico)',
      'Prostatitis bacteriana aguda severa (riesgo de sepsis por vía ascendente)',
      'Estenosis uretral infranqueable'
    ],
    materials: [
      'Sonda vesical tipo Foley estéril (habitualmente Ch/Fr 14-16 para mujer, Ch/Fr 16-18 para hombre) de látex siliconado o 100% silicona',
      'Bolsa colectora de orina de circuito cerrado con válvula antirreflujo y grifo de vaciado',
      'Guantes estériles (2 pares) y guantes limpios para aseo previo',
      'Paños estériles (uno fenestrado)',
      'Lubricante anestésico estéril urológico (gel de lidocaína al 2%)',
      'Agua bidestilada estéril (ampolla de 10 ml) para inflar el balón (NUNCA usar Suero Fisiológico porque cristaliza y atasca la válvula del balón)',
      'Solución antiséptica acuosa (clorhexidina acuosa al 0.05% o povidona yodada ginecológica)',
      'Gasas estériles y jeringa estéril de 10 ml'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'Identificar al paciente, preservar su intimidad y explicar el procedimiento.',
          'Realizar lavado higiénico de los genitales con agua y jabón neutro usando guantes limpios.',
          'Colocación del paciente: Mujer en posición ginecológica; Hombre en decúbito supino con piernas ligeramente separadas.',
          'Abrir el campo estéril, colocarse los guantes estériles y disponer el material sobre el paño.',
          'Conectar la sonda Foley al sistema colector cerrado ANTES de introducirla para mantener la esterilidad del circuito.'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'En el varón: sujetar el pene con gasa estéril en ángulo de 90°, retraer el prepucio e introducir 10-15 ml de lubricante anestésico por el meato; esperar 2-3 minutos. Introducir la sonda suavemente; al notar resistencia en el esfínter externo, bajar el pene a 45° y pedir al paciente que respire hondo y no haga fuerza.',
          'En la mujer: separar los labios mayores y menores con una mano (que pasa a ser no estéril), localizar el meato urinario justo por debajo del clítoris y por encima del introito vaginal; limpiar de arriba hacia abajo con gasas empapadas en antiséptico. Lubricar el extremo distal de la sonda e introducirla con suavidad unos 5-7 cm.',
          'Avanzar la sonda hasta obtener orina franca en el tubo colector.',
          'Avanzar 2-3 cm MÁS una vez que salga orina para garantizar que el balón está totalmente dentro de la vejiga y no en la uretra prostática.',
          'Inflar el balón lentamente con el volumen exacto de agua bidestilada marcado en el cono de la sonda (habitualmente 8-10 ml). NUNCA inflar si el paciente refiere dolor.',
          'Traccionar suavemente de la sonda hasta notar ligera resistencia en el cuello vesical.'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'Fijar la sonda con esparadrapo antialérgico: en mujer a la cara interna del muslo; en hombre al muslo o abdomen inferior para evitar úlceras uretrales.',
          'Colocar la bolsa colectora SIEMPRE por debajo del nivel de la vejiga para evitar reflujo, sin que toque el suelo.',
          'En hombres, volver a colocar el prepucio en su posición normal para evitar parafimosis.',
          'Anotar volumen de orina evacuado y características (color, turbidez, hematuria).'
        ]
      }
    ],
    keySafetyTips: [
      'NUNCA inflar el globo con suero fisiológico: el cloruro sódico se cristaliza e impide desinflarlo al retirar la sonda.',
      'Si al inflar el globo el paciente se queja de dolor agudo, DESINFLAR DE INMEDIATO: significa que el globo está dentro de la uretra.',
      'Si se evacua un globo vesical grande (> 800-1000 ml), pinzar la sonda intermitentemente cada 400-500 ml durante 15 minutos para prevenir hematuria ex-vacuo y shock por descompresión brusca.'
    ],
    complications: [
      'Infección del tracto urinario asociada a catéter (ITU-AC)',
      'Traumatismo y falsa vía uretral por inserción forzada',
      'Hematuria por rotura de capilares vesicales o uretrales',
      'Obstrucción por coágulos o sedimento'
    ],
    nursingRecordGuideline: 'Anotar en la historia: calibre de sonda, volumen inflado en el balón (ej. 10 ml agua bidestilada), volumen y aspecto de la orina obtenida, incidencias y firma.',
    offlineReady: true
  },
  {
    id: 'man-sng',
    title: 'Sondaje Nasogástrico (SNG)',
    category: 'Eliminación',
    summary: 'Inserción de una sonda a través de una fosa nasal hasta la cavidad gástrica para nutrición enteral, descompresión o lavado gástrico.',
    durationMin: 15,
    difficulty: 'Intermedio',
    indications: [
      'Nutrición enteral en pacientes con imposibilidad para deglutir pero con tracto digestivo funcionante',
      'Descompresión gástrica y drenaje en íleo paralítico, vómitos incoercibles u oclusión intestinal',
      'Lavado gástrico en intoxicaciones agudas antes de 1-2 horas de la ingesta',
      'Administración de medicación en pacientes sedados o inconscientes'
    ],
    contraindications: [
      'Sospecha de fractura de base de cráneo o traumatismo facial severo (riesgo de penetración intracraneal; usar vía orogástrica)',
      'Varices esofágicas sangrantes o estenosis esofágica conocida',
      'Ingesta de cáusticos o sustancias corrosivas ácidas/alcalinas'
    ],
    materials: [
      'Sonda nasogástrica (tipo Levin para descompresión Ch 14-18; o de poliuretano fina con fiador Ch 8-12 para nutrición)',
      'Lubricante hidrosoluble estéril',
      'Vaso con agua y pajita (si el paciente puede tragar)',
      'Jeringa de 50 ml con cono tipo Guyon (alimentación)',
      'Fonendoscopio',
      'Tiras reactivas de pH gástrico (gold standard a pie de cama)',
      'Apósito específico de fijación nasal o esparadrapo hipoalergénico cortado en pantalón',
      'Batea y toalla protectora para el pecho'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'Informar al paciente de que el procedimiento puede provocar náuseas transitorias y pedir su cooperación.',
          'Colocar al paciente en posición de Fowler alta (sentado a 90°) si no está contraindicado.',
          'Explorar la permeabilidad de ambas fosas nasales tapando una y pidiendo al paciente que expire.',
          'MEDICIÓN OBLIGATORIA (Regla NEX): Medir la distancia desde la punta de la Nariz hasta el lóbulo de la Oreja (Ear), y desde allí hasta el apéndice Xifoides. Marcar esa longitud en la sonda con un rotulador o cinta indeleble.'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'Lubricar generosamente los primeros 10-15 cm de la sonda con lubricante hidrosoluble.',
          'Introducir la sonda por la fosa nasal seleccionada dirigiéndola hacia atrás y abajo (siguiendo el suelo de la cavidad nasal, NO hacia arriba).',
          'Al llegar a la faringe (el paciente sentirá ganas de toser o náusea), pedirle que flexione la cabeza hacia el pecho.',
          'Decirle al paciente que trague saliva o tome pequeños sorbos de agua con la pajita, mientras avanzamos la sonda en cada deglución hasta la marca realizada.',
          'Si el paciente comienza a toser intensamente, se pone cianótico o se muestra incapaz de hablar, RETIRAR DE INMEDIATO: la sonda ha entrado en la vía aérea.'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'COMPROBACIÓN DE UBICACIÓN (IMPRESCINDIBLE):',
          '1) Aspirar jugo gástrico con la jeringa y medir pH en tira reactiva (pH gástrico ácido < 5,5 confirma estómago).',
          '2) Auscultar el epigastrio con el fonendoscopio mientras se introducen 20-30 ml de aire rápido (ruido de burbujeo / chapoteo).',
          '3) Solicitar radiografía de control de tórax-abdomen si es sonda fina para nutrición.',
          'Fijar la sonda a la nariz con el apósito cuidando de no presionar el ala nasal para evitar úlceras por decúbito.'
        ]
      }
    ],
    keySafetyTips: [
      'NUNCA iniciar la nutrición enteral ni administrar fármacos sin haber verificado con total certeza la ubicación gástrica de la sonda.',
      'Si se nota resistencia al avanzar la sonda en la nariz, NO forzar jamás: retirar y probar por la otra fosa.',
      'Comprobar la marca de fijación antes de cada toma de nutrición para asegurar que no se ha desplazado.'
    ],
    complications: [
      'Intubación traqueobronquial inadvertida con riesgo de neumonía por aspiración química',
      'Epistaxis por traumatismo de los cornetes nasales',
      'Úlceras por presión en el ala nasal',
      'Obstrucción de la sonda por restos de pastillas mal trituradas'
    ],
    nursingRecordGuideline: 'Anotar tipo y calibre de la sonda (ej. Levin Ch 14), fosa nasal utilizada, marca en centímetros a nivel de narina, método de comprobación (pH o RX), contenido aspirado y tolerancia.',
    offlineReady: true
  },
  {
    id: 'man-ecg',
    title: 'Realización de Electrocardiograma (ECG) de 12 Derivaciones',
    category: 'Diagnóstico y Constantes',
    summary: 'Registro gráfico de la actividad eléctrica del corazón mediante 10 electrodos en la superficie corporal para obtener 12 derivaciones estándar.',
    durationMin: 10,
    difficulty: 'Básico',
    indications: [
      'Dolor torácico sugestivo de cardiopatía isquémica o síndrome coronario agudo',
      'Palpitaciones, síncope, mareo o disnea inexplicable',
      'Monitorización prequirúrgica en mayores de 40 años o con patología cardiovascular',
      'Control tras inicio o ajuste de fármacos antiarrítmicos o cardiotóxicos'
    ],
    contraindications: [
      'No tiene contraindicaciones absolutas. Asegurar retirada de objetos metálicos si generan interferencias.'
    ],
    materials: [
      'Electrocardiógrafo calibrado a velocidad estándar de 25 mm/s y voltaje de 10 mm/mV (1 mV)',
      'Cable de paciente con 10 terminales (4 periféricos y 6 precordiales)',
      'Electrodos adhesivos desechables (o de ventosa/pinza con gel conductor)',
      'Gasas y alcohol o agua jabonosa para desengrasar la piel',
      'Maquinilla desechable si el vello torácico abundante impide el contacto'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'Explicar al paciente que la prueba es completamente indolora y que no sentirá ninguna corriente eléctrica.',
          'Colocar al paciente en decúbito supino relajado con el tórax, tobillos y muñecas descubiertos.',
          'Pedirle que permanezca quieto, sin hablar y respirando tranquilamente durante el registro.'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'COLOCACIÓN DE DERIVACIONES DE LAS EXTREMIDADES (Regla nemotécnica del semáforo + neutro):',
          '• ROJO (R / RA): Muñeca derecha (Right Arm)',
          '• AMARILLO (L / LA): Muñeca izquierda (Left Arm)',
          '• VERDE (F / LL): Tobillo izquierdo (Left Leg)',
          '• NEGRO (N / RL): Tobillo derecho (Right Leg - Tierra/Neutro)',
          'COLOCACIÓN EXACTA DE DERIVACIONES PRECORDIALES (V1 a V6):',
          '• V1 (Rojo): 4.º espacio intercostal en el borde esternal derecho.',
          '• V2 (Amarillo): 4.º espacio intercostal en el borde esternal izquierdo.',
          '• V3 (Verde): A mitad de camino entre V2 y V4.',
          '• V4 (Marrón): 5.º espacio intercostal en la línea medioclavicular izquierda.',
          '• V5 (Negro): 5.º espacio intercostal en la línea axilar anterior izquierda (mismo nivel horizontal que V4).',
          '• V6 (Morado): 5.º espacio intercostal en la línea media axilar izquierda.'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'Verificar la línea de base estable y la ausencia de temblores musculares o interferencias de corriente alterna (50 Hz).',
          'Imprimir el trazado asegurando que figure: Nombre completo, número de historia, fecha, hora exacta y si el paciente presentaba dolor torácico durante el registro.',
          'Retirar los electrodos y limpiar restos de adhesivo o gel en la piel del paciente.'
        ]
      }
    ],
    keySafetyTips: [
      'No colocar V1 y V2 demasiado altos (en 2.º o 3.º espacio): altera la morfología de la onda P y simula bloqueos de rama falsos.',
      'Si hay temblores musculares (parkinson o frío), pedir al paciente que meta las manos debajo de las nalgas para estabilizar los cables periféricos.',
      'Ante sospecha de infarto con elevación de ST (SCACEST), entregar el ECG al médico en MENOS DE 10 MINUTOS desde la llegada a urgencias.'
    ],
    complications: [
      'Reacción alérgica al adhesivo del electrodo',
      'Interpretación errónea por inversión accidental de cables periféricos (ej. brazo derecho con izquierdo produce inversión de DI y aVR positiva)'
    ],
    nursingRecordGuideline: 'Anotar en la gráfica: realización de ECG de 12 derivaciones, presencia o ausencia de dolor precordial acompañante, entrega al médico y archivo del trazado en la historia.',
    offlineReady: true
  },
  {
    id: 'man-svb',
    title: 'Soporte Vital Básico (SVB) y Manejo del Desfibrilador (DEA)',
    category: 'Urgencias y Soporte',
    summary: 'Secuencia estandarizada de reanimación cardiopulmonar según recomendaciones de la ERC / AHA ante una parada cardiorrespiratoria en el adulto.',
    durationMin: 20,
    difficulty: 'Avanzado',
    indications: [
      'Víctima que no responde a estímulos y que no respira o solo presenta boqueadas agónicas (gasping)'
    ],
    contraindications: [
      'Signos evidentes de muerte biológica irreversible (rigor mortis, livideces marcadas, decapitación)',
      'Instrucciones previas / documento formal de voluntades anticipadas de No Reanimar (RNT)'
    ],
    materials: [
      'Desfibrilador Externo Automático (DEA / DESA) con parches de adulto',
      'Balón resucitador autoinflable (Ambú) con mascarilla facial y reservorio conectado a fuente de O2 a 15 L/min (en ámbito sanitario)',
      'Cánula orofaríngea (Guedel) adecuada a la medida del paciente',
      'Tabla rígida de reanimación (si la víctima está en cama hospitalaria)',
      'Guantes y material de bioseguridad'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'GARANTIZAR LA SEGURIDAD del entorno para el reanimador y la víctima (eliminar riesgos eléctricos, tráfico, gases).',
          'Comprobar consciencia: sacudir suavemente los hombros y preguntar en voz alta: «¿Está usted bien?».',
          'Si no responde: gritar pidiendo ayuda alrededor sin abandonar a la víctima.',
          'Abrir vía aérea mediante maniobra frente-mentón (o tracción mandibular si hay sospecha de trauma cervical).',
          'Comprobar la respiración durante un MÁXIMO de 10 segundos: Ver movimientos torácicos, Oír ruidos respiratorios y Sentir el aire en la mejilla (V-O-S).',
          'Si no respira o solo jadea/boquea: ¡ES UNA PARADA CARDIORESPIRATORIA!'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'ALERTAR: Llamar al timbre de paro / avisar al 112 / activar el equipo de paradas y solicitar de inmediato un DEA.',
          'Iniciar COMPRESIONES TORÁCICAS DE ALTA CALIDAD:',
          '• Colocar el talón de una mano en el centro del pecho (mitad inferior del esternón) y la otra mano encima entrelazando los dedos.',
          '• Brazos rectos, hombros en la vertical del esternón de la víctima.',
          '• Comprimir con una profundidad de 5 a 6 cm a un ritmo de 100 a 120 compresiones por minuto.',
          '• Permitir la descompresión torácica completa tras cada compresión sin despegar las manos del tórax.',
          'Alternar 30 compresiones con 2 insuflaciones de rescate de 1 segundo cada una.',
          'EN CUANTO LLEGUE EL DEA: Encenderlo inmediatamente y seguir sus instrucciones verbales.',
          'Colocar los parches en el tórax desnudo: uno debajo de la clavícula derecha y otro en el costado izquierdo bajo la axila.',
          'Asegurarse de que NADIE TOQUE al paciente mientras el DEA analiza el ritmo y antes de pulsar el botón de descarga si está indicada.'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'Reanudar inmediatamente las compresiones torácicas tras la descarga (o si el DEA dice que no está indicada) sin perder ni un segundo.',
          'Relevar al reanimador cada 2 minutos para evitar la fatiga y mantener la eficacia de las compresiones.',
          'Continuar hasta la llegada del equipo de Soporte Vital Avanzado o hasta que la víctima muestre signos claros de vida (tos, movimiento, apertura ocular).'
        ]
      }
    ],
    keySafetyTips: [
      'Minimizar al máximo las interrupciones en las compresiones torácicas (nunca pausas superiores a 10 segundos).',
      '¡SEGURIDAD!: Antes de la descarga del DEA, mirar alrededor y decir en voz alta: «¡Apartaos todos, voy a descargar!». Comprobar que nadie toque la cama ni al paciente.',
      'Secar el pecho si está mojado antes de pegar los electrodos para evitar arcos voltaicos.'
    ],
    complications: [
      'Fracturas costales o condroesternales (frecuentes en ancianos, no deben detener la reanimación)',
      'Distensión gástrica por ventilaciones excesivas o forzadas',
      'Regurgitación y broncoaspiración del contenido gástrico'
    ],
    nursingRecordGuideline: 'Anotar hora exacta del colapso, hora de inicio de RCP, número de descargas aplicadas por el DEA, fármacos administrados y resultado final.',
    offlineReady: true
  },
  {
    id: 'man-extraccion',
    title: 'Extracción de Muestras de Sangre Venosa y Orden de Tubos',
    category: 'Diagnóstico y Constantes',
    summary: 'Venopunción para obtención de muestras sanguíneas respetando el riguroso orden de llenado de tubos para evitar contaminación cruzada por aditivos.',
    durationMin: 10,
    difficulty: 'Básico',
    indications: [
      'Determinaciones bioquímicas, hematológicas, coagulación, microbiológicas o inmunológicas'
    ],
    contraindications: [
      'Miembro con vía intravenosa infundiendo suero (extraer siempre del brazo contrario, o por debajo de la vía tras pinzarla 5 min)',
      'Zonas con hematoma extenso o fístula arteriovenosa'
    ],
    materials: [
      'Sistema de vacío (tipo Vacutainer): campana porta-tubos y aguja con dispositivo de seguridad',
      'Tubos de analítica según petitorio médico',
      'Compresor / Torniquete',
      'Gasas estériles y antiséptico (alcohol al 70% o clorhexidina alcohólica)',
      'Apósito adhesivo o tira de tirita hipoalergénica',
      'Etiquetas identificativas del paciente con código de barras'
    ],
    steps: [
      {
        phase: 'Preparación',
        instructions: [
          'Identificar al paciente verbalmente y verificar petitorio analítico.',
          'ORDEN ESTÁNDAR DE LLENADO DE TUBOS (CRUCIAL):',
          '1) HEMOCULTIVOS (primero el frasco aerobio, luego el anaerobio).',
          '2) TUBO AZUL (Citrato de sodio) para pruebas de COAGULACIÓN (tiempo de protrombina, INR, fibrinógeno). Debe llenarse exactamente hasta la marca.',
          '3) TUBO ROJO / AMARILLO (Con activador de coagulación / gel separador) para BIOQUÍMICA e INMUNOLOGÍA.',
          '4) TUBO VERDE (Heparina de litio) para determinaciones de bioquímica urgente.',
          '5) TUBO MORADO / LAVANDA (EDTA) para HEMOGRAMA, frotis y hemoglobina glicosilada.',
          '6) TUBO GRIS (Fluoruro sódico / oxalato) para glucosa y lactato.'
        ]
      },
      {
        phase: 'Ejecución',
        instructions: [
          'Colocar el compresor (no mantener más de 1 minuto para evitar hemoconcentración).',
          'Palpar la vena y desinfectar la piel; dejar secar.',
          'Puncionar la vena con el bisel hacia arriba en un ángulo de 15-30°.',
          'Insertar los tubos en la campana en el orden riguroso indicado.',
          'Invertir suavemente cada tubo de 5 a 8 veces nada más sacarlo de la campana para mezclar la sangre con el anticoagulante (¡NUNCA agitar bruscamente por riesgo de hemólisis!).'
        ]
      },
      {
        phase: 'Finalización y Cuidados',
        instructions: [
          'Retirar el compresor ANTES de sacar la aguja para evitar la formación de hematoma.',
          'Retirar la aguja activando inmediatamente el dispositivo de seguridad con una sola mano y desecharla en el contenedor rígido.',
          'Comprimir el punto de punción con una gasa limpia durante 3-5 minutos con el brazo extendido (NO doblar el codo).',
          'Etiquetar los tubos DELANTE DEL PACIENTE con sus etiquetas correctas.'
        ]
      }
    ],
    keySafetyTips: [
      'NUNCA agitar los tubos con fuerza: la hemólisis invalida los resultados (eleva falsamente el potasio sérico K+ y las transaminasas).',
      'Si se llena primero el tubo morado con EDTA antes del tubo de coagulación o bioquímica, el EDTA contamina la muestra provocando hipocalcemia y alargamiento falso de la coagulación.',
      'Si se extrae hemocultivo, desinfectar el tapón de goma del frasco con antiséptico antes de inocular.'
    ],
    complications: [
      'Hematoma subcutáneo por compresión insuficiente',
      'Hemólisis de la muestra que obliga a repetir la punción',
      'Síncope vasovagal por fobia a las agujas'
    ],
    nursingRecordGuideline: 'Anotar en la petición: hora exacta de la extracción, incidencias (si el paciente estaba en ayunas) y firma de la enfermera.',
    offlineReady: true
  }
];
