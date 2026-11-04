import React, { useState } from 'react';
import {
  Activity,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export const ScalesView: React.FC = () => {
  // Braden scale state (6 subscales)
  const [braden, setBraden] = useState({
    sensorial: 3,
    humedad: 3,
    actividad: 3,
    movilidad: 3,
    nutricion: 3,
    friccion: 2
  });

  // Glasgow state
  const [glasgow, setGlasgow] = useState({
    ocular: 4,
    verbal: 5,
    motora: 6
  });

  // Barthel state (10 items)
  const [barthel, setBarthel] = useState({
    comer: 10,
    lavarse: 5,
    vestirse: 10,
    arreglarse: 5,
    deposicion: 10,
    miccion: 10,
    retrete: 10,
    traslados: 15,
    deambular: 15,
    escaleras: 10
  });

  // Braden calculation
  const bradenTotal =
    braden.sensorial +
    braden.humedad +
    braden.actividad +
    braden.movilidad +
    braden.nutricion +
    braden.friccion;

  const getBradenRisk = (score: number) => {
    if (score <= 12) return { text: 'Riesgo Alto de UPP', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (score <= 14) return { text: 'Riesgo Moderado de UPP', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (score <= 18) return { text: 'Riesgo Bajo de UPP', color: 'text-blue-800 bg-blue-50 border-blue-200' };
    return { text: 'Sin Riesgo Aparente', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  // Glasgow calculation
  const glasgowTotal = glasgow.ocular + glasgow.verbal + glasgow.motora;
  const getGlasgowSeverity = (score: number) => {
    if (score >= 13) return { text: 'Traumatismo / Afectación Leve', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
    if (score >= 9) return { text: 'Afectación Moderada', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { text: 'Afectación Grave (GCS ≤ 8: Vía Aérea Comprometida)', color: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  // Barthel calculation
  const barthelTotal = Object.values(barthel).reduce((a, b) => a + b, 0);
  const getBarthelDep = (score: number) => {
    if (score === 100) return 'Independencia total para las ABVD';
    if (score >= 60) return 'Dependencia leve';
    if (score >= 40) return 'Dependencia moderada';
    if (score >= 20) return 'Dependencia grave';
    return 'Dependencia total';
  };

  const bradenRisk = getBradenRisk(bradenTotal);
  const glasgowRisk = getGlasgowSeverity(glasgowTotal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
          VALORACIÓN CLÍNICA ESTANDARIZADA
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Escalas de Valoración de Enfermería
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Cálculo interactivo instantáneo de Braden (úlceras por presión), Glasgow (neurológica) y Barthel (dependencia).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ESCALA DE BRADEN */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Escala de Braden (UPP)</h3>
              <p className="text-xs text-stone-500">Riesgo de desarrollo de úlceras por presión</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-700">
              {bradenTotal} / 23 pts
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 transition" style={{ borderColor: 'inherit' }}>
            <span className="text-stone-800">Diagnóstico de Riesgo:</span>
            <span className={`px-2.5 py-1 rounded-xl border ${bradenRisk.color}`}>
              {bradenRisk.text}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Percepción Sensorial</label>
              <select
                value={braden.sensorial}
                onChange={(e) => setBraden({ ...braden, sensorial: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Completamente limitada (no reacciona al dolor)</option>
                <option value={2}>2. Muy limitada (solo responde al dolor intenso)</option>
                <option value={3}>3. Ligeramente limitada (obedece órdenes verbales)</option>
                <option value={4}>4. Sin limitaciones (responde totalmente)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Exposición a la Humedad</label>
              <select
                value={braden.humedad}
                onChange={(e) => setBraden({ ...braden, humedad: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Constantemente húmeda (cambios de sábanas continuos)</option>
                <option value={2}>2. A menudo húmeda (cambios al menos 1 vez por turno)</option>
                <option value={3}>3. Ocasionalmente húmeda (1 cambio diario)</option>
                <option value={4}>4. Raramente húmeda (piel habitualmente seca)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Actividad Física</label>
              <select
                value={braden.actividad}
                onChange={(e) => setBraden({ ...braden, actividad: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Encamado/a (completamente en cama)</option>
                <option value={2}>2. En silla (no deambula, confinado a sillón)</option>
                <option value={3}>3. Deambula ocasionalmente (con ayuda)</option>
                <option value={4}>4. Deambula frecuentemente (independiente)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Movilidad Postural</label>
              <select
                value={braden.movilidad}
                onChange={(e) => setBraden({ ...braden, movilidad: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Completamente inmóvil</option>
                <option value={2}>2. Muy limitada (cambios infrecuentes del tronco)</option>
                <option value={3}>3. Ligeramente limitada (cambia frecuentemente)</option>
                <option value={4}>4. Sin limitaciones</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Nutrición</label>
              <select
                value={braden.nutricion}
                onChange={(e) => setBraden({ ...braden, nutricion: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Muy pobre (ingesta &lt; 1/3 de la comida)</option>
                <option value={2}>2. Probablemente inadecuada (ingesta ~ 1/2)</option>
                <option value={3}>3. Adecuada (toma más de la mitad de la dieta)</option>
                <option value={4}>4. Excelente (toma la dieta completa)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Fricción y Cizallamiento</label>
              <select
                value={braden.friccion}
                onChange={(e) => setBraden({ ...braden, friccion: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={1}>1. Problema (requiere levantamiento frecuente)</option>
                <option value={2}>2. Problema potencial (se desliza ocasionalmente)</option>
                <option value={3}>3. No existe problema aparente</option>
              </select>
            </div>
          </div>
        </div>

        {/* ESCALA DE GLASGOW */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Escala de Coma de Glasgow (GCS)</h3>
              <p className="text-xs text-stone-500">Nivel de consciencia y respuesta neurológica</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-700">
              {glasgowTotal} / 15 pts
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2" style={{ borderColor: 'inherit' }}>
            <span className="text-stone-800">Interpretación Clínica:</span>
            <span className={`px-2.5 py-1 rounded-xl border ${glasgowRisk.color}`}>
              {glasgowRisk.text}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Apertura Ocular (1-4)</label>
              <select
                value={glasgow.ocular}
                onChange={(e) => setGlasgow({ ...glasgow, ocular: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={4}>4. Espontánea (ojos abiertos de forma natural)</option>
                <option value={3}>3. A la orden verbal (al hablarle)</option>
                <option value={2}>2. Al estímulo doloroso (presión ungueal)</option>
                <option value={1}>1. Ninguna respuesta</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Respuesta Verbal (1-5)</label>
              <select
                value={glasgow.verbal}
                onChange={(e) => setGlasgow({ ...glasgow, verbal: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={5}>5. Orientado en tiempo, espacio y persona</option>
                <option value={4}>4. Confuso (conversación desorientada)</option>
                <option value={3}>3. Palabras inapropiadas o inconexas</option>
                <option value={2}>2. Sonidos incomprensibles o quejidos</option>
                <option value={1}>1. Ninguna respuesta</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Respuesta Motora (1-6)</label>
              <select
                value={glasgow.motora}
                onChange={(e) => setGlasgow({ ...glasgow, motora: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
              >
                <option value={6}>6. Obedece órdenes sencillas ("aprieta mi mano")</option>
                <option value={5}>5. Localiza el estímulo doloroso con la mano</option>
                <option value={4}>4. Retira la extremidad ante el dolor</option>
                <option value={3}>3. Flexión anormal (Postura de decorticación)</option>
                <option value={2}>2. Extensión anormal (Postura de descerebración)</option>
                <option value={1}>1. Ninguna respuesta motora (flacidez)</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 mt-4 leading-relaxed">
              💡 <strong>Regla de Oro en Urgencias:</strong> Una puntuación GCS ≤ 8 indica coma profundo con pérdida de reflejos protectores de la vía aérea e indicación prioritaria de intubación endotraqueal.
            </div>
          </div>
        </div>
      </div>

      {/* ÍNDICE DE BARTHEL */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900">Índice de Barthel (ABVD)</h3>
            <p className="text-xs text-stone-500">Valoración funcional de actividades básicas de la vida diaria</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-[#365e45]">{barthelTotal} / 100 pts</span>
            <span className="block text-[11px] text-stone-500 font-semibold">{getBarthelDep(barthelTotal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Comer</label>
            <select
              value={barthel.comer}
              onChange={(e) => setBarthel({ ...barthel, comer: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={10}>10. Independiente</option>
              <option value={5}>5. Necesita ayuda (cortar)</option>
              <option value={0}>0. Dependiente</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Lavarse / Bañarse</label>
            <select
              value={barthel.lavarse}
              onChange={(e) => setBarthel({ ...barthel, lavarse: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={5}>5. Independiente</option>
              <option value={0}>0. Dependiente</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Vestirse</label>
            <select
              value={barthel.vestirse}
              onChange={(e) => setBarthel({ ...barthel, vestirse: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={10}>10. Independiente</option>
              <option value={5}>5. Necesita ayuda</option>
              <option value={0}>0. Dependiente</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Traslado Cama-Sillón</label>
            <select
              value={barthel.traslados}
              onChange={(e) => setBarthel({ ...barthel, traslados: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={15}>15. Independiente</option>
              <option value={10}>10. Mínima ayuda</option>
              <option value={5}>5. Gran ayuda</option>
              <option value={0}>0. Incapaz</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Deambulación</label>
            <select
              value={barthel.deambular}
              onChange={(e) => setBarthel({ ...barthel, deambular: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={15}>15. Independiente 50 m</option>
              <option value={10}>10. Con ayuda física</option>
              <option value={5}>5. En silla de ruedas</option>
              <option value={0}>0. Inmóvil</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Control de Esfínteres</label>
            <select
              value={barthel.miccion}
              onChange={(e) => setBarthel({ ...barthel, miccion: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              <option value={10}>10. Continente</option>
              <option value={5}>5. Accidente ocasional</option>
              <option value={0}>0. Incontinente o sonda</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
