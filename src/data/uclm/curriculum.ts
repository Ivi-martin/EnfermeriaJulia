import { Subject } from '../../types';

export interface PrerequisiteRule {
  targetCode: string;
  targetName: string;
  requiredCodes: string[];
  description: string;
}

export const UCLM_NURSING_CURRICULUM: Subject[] = [
  // PRIMER CURSO (60 ECTS)
  {
    code: 'ENF-101',
    name: 'Anatomía Humana',
    year: 1,
    sem: '1º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 75,
    isKeySubject: true,
    unlocks: ['ENF-202', 'ENF-203'],
    status: 'Matriculada',
    grade: 8.5,
    professor: 'Dr. M. Sánchez (Fábrica de Armas)',
    topics: ['Organización celular y tisular', 'Sistema locomotor: osteología y miología', 'Aparato circulatorio y cardiovascular', 'Aparato respiratorio', 'Aparato digestivo', 'Aparato genitourinario', 'Sistema nervioso central y periférico']
  },
  {
    code: 'ENF-102',
    name: 'Fisiología Humana',
    year: 1,
    sem: '1º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 60,
    isKeySubject: true,
    unlocks: ['ENF-201', 'ENF-202'],
    status: 'Matriculada',
    grade: 8.0,
    professor: 'Dra. E. Gómez',
    topics: ['Homeostasis y fisiología celular', 'Neurofisiología y transmisión sináptica', 'Fisiología muscular', 'Fisiología cardiovascular y hemodinámica', 'Fisiología respiratoria e intercambio de gases', 'Función renal y equilibrio hidroelectrolítico']
  },
  {
    code: 'ENF-103',
    name: 'Bioquímica y Biología Molecular',
    year: 1,
    sem: '1º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 70,
    isKeySubject: false,
    status: 'Matriculada',
    grade: 7.5,
    professor: 'Dr. C. Morales',
    topics: ['Biomoléculas y bioenergética', 'Metabolismo glucídico y lipídico', 'Metabolismo nitrogenado', 'Genética molecular y expresión génica', 'Equilibrio ácido-base a nivel molecular']
  },
  {
    code: 'ENF-104',
    name: 'Fundamentos de Enfermería I',
    year: 1,
    sem: '1º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 90,
    isKeySubject: true,
    unlocks: ['ENF-108', 'ENF-204'],
    status: 'Matriculada',
    grade: 9.0,
    professor: 'Prof. A. López & Coordinación de Grado',
    topics: ['Historia y modelos teóricos de enfermería (Nightingale, Henderson, Orem)', 'El método enfermero: Proceso de Atención de Enfermería (PAE)', 'Valoración por patrones funcionales de Marjory Gordon', 'Diagnósticos enfermeros NANDA-I', 'Criterios de resultados NOC e intervenciones NIC', 'Seguridad del paciente y prevención de infecciones']
  },
  {
    code: 'ENF-105',
    name: 'Psicología General y de la Salud',
    year: 1,
    sem: '1º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 80,
    isKeySubject: false,
    status: 'Matriculada',
    grade: 8.2,
    professor: 'Dra. R. Vega',
    topics: ['Bases psicosociales del comportamiento humano', 'Comunicación terapéutica y empatía clínica', 'Afrontamiento de la enfermedad y el dolor', 'Duelo, pérdidas y etapas de Kübler-Ross', 'Manejo del estrés y autocuidado del profesional sanitario']
  },
  {
    code: 'ENF-106',
    name: 'Salud Pública y Comunitaria',
    year: 1,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 30,
    isKeySubject: false,
    status: 'Matriculada',
    professor: 'Dr. P. Navarro',
    topics: ['Determinantes sociales de la salud', 'Demografía sanitaria y epidemiología descriptiva', 'Promoción de la salud y prevención primaria, secundaria y terciaria', 'Vacunaciones sistemáticas en Castilla-La Mancha', 'Vigilancia epidemiológica y salud ambiental']
  },
  {
    code: 'ENF-107',
    name: 'Bioestadística y Metodología',
    year: 1,
    sem: '2º Semestre',
    ects: 6,
    type: 'Formación básica',
    progress: 25,
    isKeySubject: false,
    status: 'Matriculada',
    professor: 'Prof. J. Toledo',
    topics: ['Estadística descriptiva univariante y bivariante', 'Probabilidad y distribuciones de variables clínicas', 'Inferencia estadística: contrastes de hipótesis y p-valor', 'Medidas de frecuencia y asociación (RR, OR, NNT)', 'Lectura crítica de artículos científicos biomédicos']
  },
  {
    code: 'ENF-108',
    name: 'Fundamentos de Enfermería II (Habilidades Clínicas)',
    year: 1,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 40,
    isKeySubject: true,
    prerequisites: ['ENF-104'],
    unlocks: ['ENF-204'],
    status: 'Matriculada',
    professor: 'Prof. L. Domínguez (Lab. Simulación Fábrica de Armas)',
    topics: ['Asepsia y esterilidad en el entorno sanitario', 'Constantes vitales: técnica e interpretación', 'Higiene del paciente encamado y prevención de UPP', 'Nutrición enteral y sondaje nasogástrico (SNG)', 'Eliminación: sondaje vesical masculino y femenino', 'Administración básica de medicación y vías parenterales']
  },
  {
    code: 'ENF-109',
    name: 'Nutrición y Dietética',
    year: 1,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 20,
    isKeySubject: false,
    status: 'Matriculada',
    professor: 'Dra. S. Ramos',
    topics: ['Nutrientes y requerimientos energéticos', 'Valoración del estado nutricional (MNA, IMC, pliegues)', 'Dietoterapia en patologías prevalentes (diabetes, HTA, IRC)', 'Nutrición enteral y parenteral básica', 'Seguridad alimentaria y desnutrición hospitalaria']
  },
  {
    code: 'ENF-110',
    name: 'Diversidad Cultural y Cuidados de Salud',
    year: 1,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 15,
    isKeySubject: false,
    status: 'Matriculada',
    professor: 'Prof. I. Benítez',
    topics: ['Enfermería transcultural (Madeleine Leininger)', 'Creencias, género y salud', 'Comunicación con pacientes de diversas procedencias', 'Bioética en contextos multiculturales']
  },

  // SEGUNDO CURSO (60 ECTS)
  {
    code: 'ENF-201',
    name: 'Farmacología Clínica',
    year: 2,
    sem: '1º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-102', 'ENF-103'],
    unlocks: ['ENF-204', 'ENF-304'],
    status: 'Pendiente',
    topics: ['Farmacocinética y farmacodinámica', 'Los 10 correctos y seguridad de medicamentos', 'Antibioterapia y analgesia', 'Fármacos cardiovasculares y respiratorios', 'Medicamentos de alto riesgo (ISMP) y alertas LASA']
  },
  {
    code: 'ENF-202',
    name: 'Enfermería del Adulto I (Médico-Quirúrgica)',
    year: 2,
    sem: '1º Semestre',
    ects: 9,
    type: 'Obligatoria',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-101', 'ENF-102', 'ENF-108'],
    status: 'Pendiente',
    topics: ['Cuidados perioperatorios (pre, intra y postoperatorio)', 'Alteraciones respiratorias y oxigenoterapia', 'Alteraciones cardiovasculares y ECG', 'Curas de heridas quirúrgicas y drenajes']
  },
  {
    code: 'ENF-203',
    name: 'Enfermería del Adulto II',
    year: 2,
    sem: '2º Semestre',
    ects: 9,
    type: 'Obligatoria',
    progress: 0,
    isKeySubject: true,
    status: 'Pendiente',
    topics: ['Cuidados en patología digestiva y ostomías', 'Nefrourología y diálisis', 'Neurología y paciente con ACV', 'Endocrinología y diabetes avanzada']
  },
  {
    code: 'ENF-204',
    name: 'Prácticas Tuteladas I (Estancias Clínicas)',
    year: 2,
    sem: '2º Semestre',
    ects: 18,
    type: 'Prácticas Tuteladas',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-104', 'ENF-108'],
    status: 'Pendiente',
    topics: ['Rotación en plantas de hospitalización médica/quirúrgica del Hospital Universitario de Toledo (HUT)', 'Integración en el equipo interdisciplinar', 'Aplicación del PAE y registro en Mambrino XXI / Selene']
  },
  {
    code: 'ENF-205',
    name: 'Ética y Legislación Sanitaria',
    year: 2,
    sem: '1º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Principios de la bioética', 'Consentimiento informado y secreto profesional', 'Ley de Autonomía del Paciente (Ley 41/2002)', 'Instrucciones previas y voluntades anticipadas']
  },
  {
    code: 'ENF-206',
    name: 'Fisiopatología General',
    year: 2,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Fisiopatología del dolor y la inflamación', 'Shock y fallo multiorgánico', 'Alteraciones hemodinámicas y renales', 'Fisiopatología tumoral']
  },

  // TERCER CURSO (60 ECTS)
  {
    code: 'ENF-301',
    name: 'Enfermería Materno-Infantil y Salud Sexual',
    year: 3,
    sem: '1º Semestre',
    ects: 9,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Gestación normal y patológica', 'Parto, puerperio y lactancia materna', 'Recién nacido sano y de riesgo', 'Pediatría y calendario vacunal infantil']
  },
  {
    code: 'ENF-302',
    name: 'Enfermería de Salud Mental',
    year: 3,
    sem: '1º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Trastornos del estado de ánimo y ansiedad', 'Trastornos psicóticos y conducta suicida', 'Adicciones y patología dual', 'Relación de ayuda y desescalada verbal']
  },
  {
    code: 'ENF-303',
    name: 'Enfermería Comunitaria y Geriátrica',
    year: 3,
    sem: '2º Semestre',
    ects: 9,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Atención Primaria y visita domiciliaria en Toledo', 'Valoración geriátrica integral (Barthel, Lawton, Pfeiffer)', 'Síndromes geriátricos: caídas, fragilidad, demencia', 'Atención al cuidador principal']
  },
  {
    code: 'ENF-304',
    name: 'Prácticas Tuteladas II',
    year: 3,
    sem: '1º Semestre',
    ects: 18,
    type: 'Prácticas Tuteladas',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-204'],
    status: 'Pendiente',
    topics: ['Rotación en Centros de Salud de Atención Primaria y Salud Mental']
  },
  {
    code: 'ENF-305',
    name: 'Prácticas Tuteladas III',
    year: 3,
    sem: '2º Semestre',
    ects: 12,
    type: 'Prácticas Tuteladas',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-304'],
    status: 'Pendiente',
    topics: ['Rotación en Pediatría, Maternidad o Especialidades Quirúrgicas']
  },
  {
    code: 'ENF-306',
    name: 'Gestión y Liderazgo de Cuidados',
    year: 3,
    sem: '2º Semestre',
    ects: 6,
    type: 'Obligatoria',
    progress: 0,
    status: 'Pendiente',
    topics: ['Sistemas de salud y SESCAM', 'Gestión de recursos materiales y humanos', 'Calidad asistencial y seguridad clínica']
  },

  // CUARTO CURSO (60 ECTS)
  {
    code: 'ENF-401',
    name: 'Prácticas Tuteladas IV (Críticos y Urgencias)',
    year: 4,
    sem: '1º Semestre',
    ects: 18,
    type: 'Prácticas Tuteladas',
    progress: 0,
    isKeySubject: true,
    prerequisites: ['ENF-305'],
    status: 'Pendiente',
    topics: ['Rotación en UCI, Urgencias Hospitalarias o Reanimación (HUT)']
  },
  {
    code: 'ENF-402',
    name: 'Prácticas Tuteladas V (Rotación Avanzada)',
    year: 4,
    sem: '2º Semestre',
    ects: 18,
    type: 'Prácticas Tuteladas',
    progress: 0,
    isKeySubject: true,
    status: 'Pendiente',
    topics: ['Hospital Nacional de Parapléjicos (HNP) o Unidades Especiales']
  },
  {
    code: 'ENF-403',
    name: 'Trabajo Fin de Grado (TFG)',
    year: 4,
    sem: 'Anual',
    ects: 12,
    type: 'TFG',
    progress: 0,
    isKeySubject: true,
    status: 'Pendiente',
    topics: ['Diseño de proyecto de investigación o revisión sistemática', 'Defensa ante tribunal universitario']
  },
  {
    code: 'ENF-404',
    name: 'Cuidados Paliativos y Dolor (Optativa)',
    year: 4,
    sem: '1º Semestre',
    ects: 6,
    type: 'Optativa',
    progress: 0,
    status: 'Pendiente',
    topics: ['Control de síntomas refractarios', 'Vía subcutánea y bombas elastoméricas', 'Acompañamiento en el final de vida']
  },
  {
    code: 'ENF-405',
    name: 'Enfermería en Urgencias y Catástrofes (Optativa)',
    year: 4,
    sem: '2º Semestre',
    ects: 6,
    type: 'Optativa',
    progress: 0,
    status: 'Pendiente',
    topics: ['Triaje Manchester y START', 'Soporte Vital Avanzado (SVA)', 'Atención al politraumatizado grave']
  }
];

export const PREREQUISITE_RULES: PrerequisiteRule[] = [
  {
    targetCode: 'ENF-204',
    targetName: 'Prácticas Tuteladas I (2º Curso)',
    requiredCodes: ['ENF-104', 'ENF-108'],
    description: 'Es imprescindible haber superado Fundamentos de Enfermería I y II para tener acceso a las primeras prácticas con pacientes reales en centros sanitarios.'
  },
  {
    targetCode: 'ENF-202',
    targetName: 'Enfermería del Adulto I (2º Curso)',
    requiredCodes: ['ENF-101', 'ENF-102'],
    description: 'Requiere conocimientos básicos afianzados en Anatomía Humana y Fisiología Humana.'
  },
  {
    targetCode: 'ENF-304',
    targetName: 'Prácticas Tuteladas II (3º Curso)',
    requiredCodes: ['ENF-204', 'ENF-201'],
    description: 'Requiere la acreditación de Prácticas Tuteladas I y Farmacología Clínica superada.'
  },
  {
    targetCode: 'ENF-403',
    targetName: 'Trabajo Fin de Grado (TFG)',
    requiredCodes: ['ENF-107'],
    description: 'Requiere haber superado Bioestadística y Metodología y al menos el 80% de los créditos del grado.'
  }
];

export const TOLEDO_CAMPUS_LOCATIONS = [
  {
    id: 'fabrica-armas',
    name: 'Campus Tecnológico Fábrica de Armas (UCLM)',
    type: 'Sede Académica Principal',
    address: 'Av. Carlos III, s/n, 45071 Toledo',
    description: 'Edificio Sabatini, Laboratorios de Habilidades Clínicas y Simulación de Enfermería, Aulas de Docencia y Biblioteca.',
    keyZones: ['Laboratorio de Simulación ECOE', 'Aulas 1.1 a 1.6', 'Edificio Sabatini', 'Cafetería de la Fábrica', 'Pista Deportiva']
  },
  {
    id: 'hut',
    name: 'Hospital Universitario de Toledo (HUT)',
    type: 'Hospital Docente Universitario Principal (SESCAM)',
    address: 'Calle Santa Ildefonsa, s/n (Polígono Residencial Santa María de Benquerencia), 45007 Toledo',
    description: 'Centro hospitalario de alta complejidad para Prácticas Tuteladas en Medicina Interna, Cirugía, Urgencias, UCI, Pediatría y Maternidad.',
    keyZones: ['Bloque Quirúrgico', 'Urgencias Generales y Pediátricas', 'Unidad de Cuidados Intensivos (UCI)', 'Plantas de Hospitalización', 'Salas de Sesiones Clínicas']
  },
  {
    id: 'hnp',
    name: 'Hospital Nacional de Parapléjicos (HNP)',
    type: 'Centro Monográfico de Referencia Nacional',
    address: 'Finca La Peraleda, s/n, 45071 Toledo',
    description: 'Referencia en lesión medular, rehabilitación avanzada, prevención y cuidados de úlceras por presión complejas y urología.',
    keyZones: ['Unidad de Agudos', 'Rehabilitación y Terapia Ocupacional', 'Unidad de Lesionados Medulares', 'Consultas de Urodinamia']
  },
  {
    id: 'san-pedro-martir',
    name: 'Campus Toledo - Casco Histórico (San Pedro Mártir)',
    type: 'Edificio Universitario e Institucional',
    address: 'Calle Real, s/n, 45002 Toledo',
    description: 'Claustros históricos universitarios, paraninfo y actos de graduación institucional.',
    keyZones: ['Claustro Mudéjar', 'Paraninfo Universitario', 'Secretaría General']
  }
];
