/**
 * Generador de consejos personalizados y empáticos de bienestar para Julia.
 * Cruza estado de ánimo, nivel de energía, horas de sueño, historial semanal
 * y contexto clínico (turnos de prácticas y exámenes próximos).
 */

export interface WellbeingEntry {
  mood?: number;    // 1 a 5
  energy?: number;  // 1 a 5
  sleep?: string;   // '< 5h', '5-6h', '7-8h', '> 8h'
  note?: string;
}

export interface ShiftContext {
  hospital?: string;
  service?: string;
  date: string;
  shiftType?: string;
}

export interface ExamContext {
  subject: string;
  date: string;
}

export interface WellbeingAdvice {
  badge: string;
  title: string;
  text: string;
  microTip: string;
  familyNote?: string;
  alertLevel: 'normal' | 'care' | 'cheer';
}

export function generateWellbeingAdvice(params: {
  todayWb: WellbeingEntry;
  recentWeek: { date: string; data: WellbeingEntry }[];
  todayShift?: ShiftContext;
  yesterdayShift?: ShiftContext;
  upcomingExam?: ExamContext;
}): WellbeingAdvice {
  const { todayWb, recentWeek, todayShift, yesterdayShift, upcomingExam } = params;
  const mood = todayWb.mood;
  const energy = todayWb.energy;
  const sleep = todayWb.sleep;

  // Análisis de tendencia de los últimos días
  const validEntries = recentWeek.filter((d) => d.data.mood || d.data.energy);
  const lowEnergyDaysCount = recentWeek.filter((d) => (d.data.energy || 5) <= 2).length;
  const lowMoodDaysCount = recentWeek.filter((d) => (d.data.mood || 5) <= 2).length;
  const sleepDebtCount = recentWeek.filter((d) => d.data.sleep === '< 5h' || d.data.sleep === '5-6h').length;

  // 1. Caso: Acumulación de fatiga severa (varios días agotada o poco sueño)
  if (lowEnergyDaysCount >= 3 || (energy && energy <= 2 && sleep === '< 5h')) {
    return {
      badge: '🛑 Señal de parada y autocuidado',
      title: 'Julia, tu cuerpo te está pidiendo una tregua',
      text: 'Llevas varios días acumulando cansancio físico y pocas horas de sueño. En enfermería enseñamos que no se puede cuidar con el depósito vacío. Hoy tu única prioridad tras tus obligaciones es descansar: nada de culpas por posponer temas de estudio hoy.',
      microTip: 'Ducha de agua caliente, cena fácil y rica, y a la cama 45 minutos antes sin móvil.',
      familyNote: '💬 Recuerda que hablar un ratito con mamá o con Ivi te recarga el corazón. ¡No dudes en llamarles!',
      alertLevel: 'care',
    };
  }

  // 2. Caso: Ayer o hoy hubo turno de prácticas y energía baja
  if (yesterdayShift && energy && energy <= 2) {
    return {
      badge: '🏥 Recuperación post-guardia',
      title: `Recuperándote del turno en ${yesterdayShift.service || 'el hospital'}`,
      text: `Estar tantas horas de pie, atenta a constantes y aprendiendo procedimientos pasa factura física. Es completamente normal sentir las piernas pesadas y la mente embotada al día siguiente.`,
      microTip: 'Pon las piernas en alto 15 minutos con una almohada para favorecer el retorno venoso e hidrátate con agua o infusión.',
      alertLevel: 'care',
    };
  }

  if (todayShift) {
    return {
      badge: '🩺 Día de Prácticas Clínicas',
      title: `¡Fuerza en tu turno de ${todayShift.shiftType || 'prácticas'}!`,
      text: `Hoy estás en ${todayShift.hospital || 'el hospital'} (${todayShift.service || 'Servicio'}). Recuerda que tu labor como alumna es aprender con calma y seguridad: pregunta siempre cualquier duda antes de actuar y apóyate en tu enfermera tutora.`,
      microTip: 'Lleva calzado cómodo, tu libreta de bolsillo lista y un snack saludable (frutos secos o plátano) en el bolsillo.',
      alertLevel: 'normal',
    };
  }

  // 3. Caso: Examen inminente (hoy o en 1-2 días) y ánimo tenso
  if (upcomingExam && (mood || 5) <= 3) {
    return {
      badge: '📝 Recta final para el examen',
      title: `Tranquilidad para ${upcomingExam.subject}`,
      text: `Es lógico sentir nervios o que te falta tiempo. La clave ahora no es meter horas a lo loco, sino afianzar lo que ya sabes. La memoria consolida durante el sueño REM: estudiar sin dormir empeora el rendimiento mañana.`,
      microTip: 'Haz una sesión corta de 25 min de flashcards clave y luego desconecta. ¡Confía en todo lo que has trabajado!',
      familyNote: 'Ivi y tu familia confían plenamente en tu capacidad. ¡Vas a hacerlo genial!',
      alertLevel: 'care',
    };
  }

  // 4. Caso: Ánimo bajo o regular
  if (mood && mood <= 2) {
    return {
      badge: '💚 Abrazo de ánimo',
      title: 'Los días grises también forman parte del camino',
      text: 'Hay días en los que la carrera pesa más, o en los que simplemente las cosas cuestan. No te juzgues por no estar al 100% todos los días. Eres humana antes que estudiante de enfermería, y tu esfuerzo ya es admirable.',
      microTip: 'Date un pequeño capricho hoy: tu música favorita, un paseo suave por Toledo o ver tu serie preferida.',
      familyNote: 'Mamá e Ivi te quieren con locura y están orgullosísimos de cada paso que das.',
      alertLevel: 'care',
    };
  }

  // 5. Caso: Cansada pero animada
  if (energy && energy <= 2 && mood && mood >= 4) {
    return {
      badge: '🔋 Batería baja, corazón contento',
      title: 'Sonrisa grande y cuerpo cansado',
      text: '¡Nos encanta ver tu actitud positiva a pesar del cansancio! Tu espíritu alegre es uno de tus mayores dones para tus futuros pacientes. Ahora compénsalo dándole al cuerpo el reposo que se ha ganado a pulso.',
      microTip: 'Hoy planifica una tarde tranquila de lectura o relax para que mañana tu energía esté a la par que tu ánimo.',
      alertLevel: 'normal',
    };
  }

  // 6. Caso: Plena energía y buen ánimo
  if (energy && energy >= 4 && mood && mood >= 4) {
    return {
      badge: '🚀 ¡A tope de energía y alegría!',
      title: '¡Día de brillo absoluto, Julia!',
      text: 'Hoy tienes el viento a favor. Es un momento magnífico para afrontar aquel tema que se te atragantaba, practicar técnicas de PAE o simplemente disfrutar de tu vocación con una sonrisa radiante.',
      microTip: 'Aprovecha este pico de concentración en bloques de estudio Pomodoro y contagia tu buena vibra a quienes te rodean.',
      alertLevel: 'cheer',
    };
  }

  // 7. Caso por defecto / equilibrio
  return {
    badge: '🌱 Paso a paso, con constancia',
    title: 'Un nuevo día en tu camino hacia la enfermería',
    text: 'Cada día que sumas, cada técnica que repasas y cada momento que dedicas a cuidar de ti te acerca a la gran enfermera que ya estás construyendo. Disfruta del aprendizaje y no olvides respirar profundo.',
    microTip: 'Mantén tu botella de agua cerca y haz 5 respiraciones profundas antes de empezar a estudiar.',
    alertLevel: 'normal',
  };
}
