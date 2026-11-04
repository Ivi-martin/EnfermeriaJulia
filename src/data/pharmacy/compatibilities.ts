import { IvCompatibilityEntry } from '../../types';

export const IV_COMPATIBILITY_ENTRIES: IvCompatibilityEntry[] = [
  {
    drugA: 'Furosemida',
    drugB: 'Morfina',
    compatibility: 'Incompatible',
    details: 'Precipitación blanquecina inmediata debida a la incompatibilidad de pH (Furosemida es alcalina pH 8-9.3, mientras que Morfina requiere medio marcadamente ácido pH 2.5-6.0). Puede ocluir catéteres y producir embolia cristalina.',
    diluent: 'Suero Fisiológico 0.9%',
    source: 'Trissel\'s Handbook on Injectable Drugs'
  },
  {
    drugA: 'Furosemida',
    drugB: 'Metoclopramida',
    compatibility: 'Incompatible',
    details: 'Incompatibilidad física con turbidez y precipitación visible en Y. Administrar por luces separadas o lavar con 10-20 mL de SF entre ambas.',
    diluent: 'Suero Fisiológico 0.9%',
    source: 'Micromedex IV Compatibility'
  },
  {
    drugA: 'Furosemida',
    drugB: 'Omeoprazol',
    compatibility: 'Compatible en Y',
    details: 'Ambos fármacos tienen pH alcalino. No se observa precipitación física ni pérdida significativa de estabilidad durante la administración en Y a concentraciones habituales.',
    diluent: 'Suero Fisiológico 0.9%',
    source: 'Guía de Compatibilidad de Mezclas Intravenosas SEFH'
  },
  {
    drugA: 'Morfina',
    drugB: 'Midazolam',
    compatibility: 'Compatible en Y',
    details: 'Compatibilidad física y química demostrada en Y tanto en SF 0.9% como en Suero Glucosado al 5% para sedoanalgesia hospitalaria y cuidados paliativos.',
    diluent: 'SF 0.9% o SG 5%',
    source: 'SEFH / Trissel'
  },
  {
    drugA: 'Morfina',
    drugB: 'Paracetamol IV',
    compatibility: 'Compatible en Y',
    details: 'Compatible en Y sin precipitación visible durante infusión a corto plazo.',
    diluent: 'SF 0.9%',
    source: 'Ficha Técnica AEMPS'
  },
  {
    drugA: 'Cloruro Potásico (KCl)',
    drugB: 'Suero Salino Fisiológico 0.9%',
    compatibility: 'Compatible en Y',
    details: 'Plenamente compatible y diluyente de elección habitual. Mezclar exhaustivamente la bolsa antes de conectar al paciente.',
    diluent: 'SF 0.9%',
    source: 'ISMP Farmacología Hospitalaria'
  },
  {
    drugA: 'Cloruro Potásico (KCl)',
    drugB: 'Furosemida',
    compatibility: 'Compatibilidad Condicional',
    details: 'Físicamente compatible en concentraciones estándar en Y, pero requiere monitorización estricta por efectos antagónicos sobre la potasemia.',
    diluent: 'SF 0.9%',
    source: 'Trissel\'s Handbook'
  },
  {
    drugA: 'Diazepam',
    drugB: 'Cualquier otro fármaco IV',
    compatibility: 'Incompatible',
    details: 'El Diazepam es lipofílico y contiene disolventes orgánicos (propilenglicol). Precipita rápidamente en forma lechosa al contacto con soluciones acuosas de casi cualquier otro principio activo. Debe administrarse solo, lento y lavar siempre la vía.',
    diluent: 'No diluir (o en infusión en SG5% con envase de vidrio y filtro especial si está protocolizado)',
    source: 'ISMP & Ficha Técnica AEMPS'
  },
  {
    drugA: 'Pantoprazol / Omeprazol',
    drugB: 'Midazolam',
    compatibility: 'Incompatible',
    details: 'Precipitación por neutralización de pH. El midazolam pierde solubilidad y precipita en medio básico alcalinizado por el inhibidor de bomba de protones.',
    diluent: 'SF 0.9%',
    source: 'Micromedex'
  },
  {
    drugA: 'Vancomicina',
    drugB: 'Piperacilina / Tazobactam',
    compatibility: 'Incompatible',
    details: 'Incompatibilidad física frecuente con formación de precipitado cristalino en la luz del catéter y aumento del riesgo de nefrotoxicidad sinérgica. Se recomienda utilizar luces distintas de catéter venoso central o separar su infusión lavando con 20 mL de SF.',
    diluent: 'SF 0.9%',
    source: 'Infectious Diseases Society of America (IDSA)'
  },
  {
    drugA: 'Insulina Rápida',
    drugB: 'Suero Fisiológico 0.9%',
    compatibility: 'Compatible en Y',
    details: 'Compatible y vehículo de elección en perfusiones continuas de cetoacidosis diabética. Tener en cuenta adsorción inicial al plástico del sistema (~20% en los primeros 50 mL purgados).',
    diluent: 'SF 0.9%',
    source: 'American Diabetes Association Guidelines'
  },
  {
    drugA: 'Ceftriaxona',
    drugB: 'Gluconato Cálcico / Soluciones con Calcio (Ringer Lactato)',
    compatibility: 'Incompatible',
    details: '¡INCOMPATIBILIDAD CRÍTICA / CONTRAINDICACIÓN ABSOLUTA! Formación letal de precipitados insolubles de ceftriaxona-calcio en pulmones y riñones. Especialmente peligroso en neonatos y niños pequeños.',
    diluent: 'SF 0.9% (NUNCA Ringer Lactato ni soluciones con calcio)',
    source: 'Alerta de Seguridad AEMPS & FDA'
  }
];

export const LASA_ALERTS = [
  {
    pair: 'CEFAZOLINA vs CEFOTAXIMA',
    risk: 'Ambas son cefalosporinas pero con espectros y posologías radicalmente distintas (Cefazolina es de 1ª generación para profilaxis quirúrgica; Cefotaxima es de 3ª generación para infecciones del SNC/sepsis).',
    recommendation: 'Usar técnica de "Tall Man Letters" (cefaZOLIna vs cefoTAXima) y confirmar indicación médica antes de cargar.'
  },
  {
    pair: 'DOBUTAMINA vs DOPAMINA',
    risk: 'Dobutamina es inótropo predominantemente beta-1; Dopamina tiene acciones dopaminérgicas, beta y alfa dependientes de dosis. Una confusión en shock cardiogénico o séptico puede provocar vasoconstricción letal o fallo de bomba.',
    recommendation: 'Almacenar en cajetines separados del carro de paradas y etiquetar con fondo de color contrastado.'
  },
  {
    pair: 'HIDROXICINA vs HIDRALAZINA',
    risk: 'Hidroxicina es un antihistamínico sedante (Atarax); Hidralazina es un potente vasodilatador arterial antihipertensivo. Confundirlos puede desencadenar crisis hipertensiva o hipotensión refractaria.',
    recommendation: 'Doble chequeo verbal en el pase de guardia y revisión de prescripción electrónica.'
  },
  {
    pair: 'TRAMADOL vs TORASEMIDA',
    risk: 'Tramadol es un analgésico opioide; Torasemida es un diurético de asa de alta potencia. Administrar torasemida por tramadol deja al paciente con dolor agudo e hipotensión por deshidratación masiva.',
    recommendation: 'Comprobar siempre principio activo y grupo terapéutico, no solo la primera letra del nombre comercial.'
  },
  {
    pair: 'INSULINA RÁPIDA vs INSULINA LENTA / BASAL',
    risk: 'Administrar insulina rápida a dosis de basal desencadena hipoglucemia severa potencialmente mortal o coma;',
    recommendation: 'Verificar tipo de pluma (colores universales: Lantus gris/violeta, Novorapid naranja, etc.) y lectura del nombre completo.'
  }
];

export const HIGH_RISK_MEDS_ISMP = [
  {
    group: 'Cloruro Potásico IV (KCl)',
    danger: 'La inyección rápida o en bolo directo produce paro cardíaco inmediato en asistolia.',
    mandatoryPrecautions: 'Prohibido almacenar ampollas concentradas de KCl en plantas sin diluir. Usar bolsas premezcladas preparadas por Farmacia, infusión siempre por bomba volumétrica a ritmo controlado.'
  },
  {
    group: 'Insulinas (todas las vías)',
    danger: 'Errores en la unidad de medida (confusión entre mililitros y Unidades Internacionales UI).',
    mandatoryPrecautions: 'Usar exclusivamente jeringas específicas graduadas en UI de insulina. Doble chequeo independiente por dos enfermeras antes de inyectar.'
  },
  {
    group: 'Opioides Parenterales (Morfina, Fentanilo)',
    danger: 'Depresión respiratoria grave, apnea y parada cardiorrespiratoria.',
    mandatoryPrecautions: 'Tener siempre disponible Naloxona en el control de enfermería. Monitorizar frecuencia respiratoria y escala de sedación de Ramsay.'
  },
  {
    group: 'Anticoagulantes (Heparina no fraccionada IV)',
    danger: 'Riesgo catastrófico de sangrado intracraneal o hemorragia retroperitoneal por sobredosis.',
    mandatoryPrecautions: 'Comprobar valor de TTPa antes de cambiar ritmo de bomba. Diluciones estandarizadas (ej. 25.000 UI en 250 mL SF = 100 UI/mL).'
  },
  {
    group: 'Bloqueantes Neuromusculares (Succinilcolina, Rocuronio)',
    danger: 'Parálisis muscular respiratoria completa en pacientes no intubados ni ventilados mecánicamente.',
    mandatoryPrecautions: 'Custodia bajo llave en quirófano o UCI. Etiquetas rojas fluorescentes con la advertencia: "Agente Paralizante - Causa Apnea".'
  }
];

export const ANTIDOTES_TABLE = [
  {
    toxicOrDrug: 'Opioides (Morfina, Fentanilo, Metadona, Heroína)',
    antidote: 'Naloxona (Naloxone)',
    posology: '0.4 mg IV (o IM/SC), titular cada 2-3 minutos hasta recuperar respiración espontánea (frecuencia respiratoria > 10 rpm). Recordar que la semivida de la naloxona (30-90 min) es menor que la de la mayoría de opioides (riesgo de renarcotización).',
    mechanism: 'Antagonista puro de receptores opioides mu, kappa y delta.'
  },
  {
    toxicOrDrug: 'Benzodiacepinas (Diazepam, Lorazepam, Midazolam)',
    antidote: 'Flumazenilo (Anexate)',
    posology: '0.2 mg IV en 15 segundos; si no hay respuesta en 60 s, administrar 0.1 mg repetibles hasta máximo 1-2 mg.',
    mechanism: 'Antagonista competitivo del receptor GABA-A. ¡Precaución en epilépticos conocidos o intoxicaciones mixtas con antidepresivos tricíclicos por riesgo de desencadenar convulsiones refractarias!'
  },
  {
    toxicOrDrug: 'Heparina Sódica (No Fraccionada)',
    antidote: 'Sulfato de Protamina',
    posology: '1 mg de protamina neutraliza aproximadamente 100 UI de heparina administrada en las últimas 2 horas. Administrar muy lento IV en 10 min (evitar hipotensión y bradicardia).',
    mechanism: 'Forma un complejo salino inactivo con la heparina mediante unión iónica.'
  },
  {
    toxicOrDrug: 'Anticoagulantes Orales antivitamina K (Acenocumarol / Sintrom, Warfarina)',
    antidote: 'Vitamina K1 (Fitomenadiona) + Complejo Protrombínico',
    posology: 'Fitomenadiona 5-10 mg IV lenta (o VO si INR elevado sin sangrado activo). En hemorragia con riesgo vital: asociar Concentrado de Complejo Protrombínico (Octaplex/Beriplex) a 25-50 UI/kg.',
    mechanism: 'Restablece la síntesis hepática de los factores de coagulación dependientes de vitamina K (II, VII, IX, X).'
  },
  {
    toxicOrDrug: 'Paracetamol (Sobredosis tóxica > 150 mg/kg)',
    antidote: 'N-Acetilcisteína (NAC)',
    posology: 'Protocolo IV de 3 infusiones: 150 mg/kg en 1h, luego 50 mg/kg en 4h, y finalmente 100 mg/kg en 16h.',
    mechanism: 'Restaura los depósitos hepáticos de glutatión neutralizando el metabolito tóxico NAPQI y evitando la necrosis hepática masiva fulminante.'
  },
  {
    toxicOrDrug: 'Dabigatrán (Pradaxa - Anticoagulante directo)',
    antidote: 'Idarucizumab (Praxbind)',
    posology: '5 g IV administrados en 2 viales consecutivos de 2.5 g cada uno.',
    mechanism: 'Fragmento de anticuerpo monoclonal humanizado que se une al dabigatrán con afinidad 350 veces superior a la de la trombina.'
  },
  {
    toxicOrDrug: 'Bloqueantes neuromusculares no despolarizantes (Rocuronio, Vecuronio)',
    antidote: 'Sugammadex (Bridion)',
    posology: '2 a 4 mg/kg IV según profundidad del bloqueo neuromuscular medido por monitor TOF.',
    mechanism: 'Ciclodextrina modificada que encapsula la molécula del relajante muscular en plasma revirtiendo la parálisis en 1-3 minutos.'
  }
];
