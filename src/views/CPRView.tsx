import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Zap,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CPRView: React.FC = () => {
  // Rhythm mode: shockable vs non-shockable
  const [rhythmType, setRhythmType] = useState<'shockable' | 'nonShockable'>('shockable');

  // Metronome state (105 bpm standard ERC)
  const [bpm, setBpm] = useState<number>(105);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [beatPulse, setBeatPulse] = useState(false);
  const [compressionsCount, setCompressionsCount] = useState(0);

  // 2-minute cycle timer
  const [cycleSeconds, setCycleSeconds] = useState(120);
  const [isCycleRunning, setIsCycleRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Adrenaline 3-5 min timer
  const [adrenSeconds, setAdrenSeconds] = useState(180); // 3 minutes
  const [isAdrenRunning, setIsAdrenRunning] = useState(false);
  const [adrenDosesGiven, setAdrenDosesGiven] = useState(0);

  // Shocks count (for shockable rhythm)
  const [shocksGiven, setShocksGiven] = useState(0);

  // Audio context ref for web audio beeps
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Metronome interval tick
  useEffect(() => {
    if (!isMetronomeActive) return;
    const intervalMs = (60 / bpm) * 1000;
    const interval = setInterval(() => {
      setBeatPulse((prev) => !prev);
      setCompressionsCount((prev) => prev + 1);

      if (soundEnabled) {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime); // 880 Hz beep
          gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          osc.start();
          osc.stop(audioCtxRef.current.currentTime + 0.08);
        } catch {
          // ignore web audio restrictions
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isMetronomeActive, bpm, soundEnabled]);

  // 2-minute Cycle Countdown
  useEffect(() => {
    if (!isCycleRunning) return;
    if (cycleSeconds <= 0) {
      // 2 minutes completed! Ring alert
      setCyclesCompleted((prev) => prev + 1);
      setCycleSeconds(120);
      alert('¡Fin del ciclo de 2 minutos! Reevaluar ritmo/pulso y CAMBIAR DE REANIMADOR.');
      return;
    }
    const timer = setInterval(() => {
      setCycleSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCycleRunning, cycleSeconds]);

  // Adrenaline Timer Countdown
  useEffect(() => {
    if (!isAdrenRunning) return;
    if (adrenSeconds <= 0) {
      alert('⚠️ ALERTA DE MEDICACIÓN: Han pasado 3-5 minutos. Administrar Adrenalina 1 mg IV/IO.');
      setAdrenSeconds(180);
      return;
    }
    const timer = setInterval(() => {
      setAdrenSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAdrenRunning, adrenSeconds]);

  const toggleAll = () => {
    const nextState = !isMetronomeActive;
    setIsMetronomeActive(nextState);
    setIsCycleRunning(nextState);
    setIsAdrenRunning(nextState);
  };

  const resetAllTimers = () => {
    setIsMetronomeActive(false);
    setIsCycleRunning(false);
    setIsAdrenRunning(false);
    setCycleSeconds(120);
    setAdrenSeconds(180);
    setCompressionsCount(0);
    setCyclesCompleted(0);
    setShocksGiven(0);
    setAdrenDosesGiven(0);
  };

  const handleDeliverShock = () => {
    setShocksGiven((prev) => prev + 1);
    setCycleSeconds(120); // start new 2 min cycle immediately after shock
    setIsCycleRunning(true);
    setIsMetronomeActive(true);
  };

  const handleGiveAdrenaline = () => {
    setAdrenDosesGiven((prev) => prev + 1);
    setAdrenSeconds(180); // reset 3 min timer
    setIsAdrenRunning(true);
  };

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#7a1c1c] via-[#5c1515] to-[#3d0b0b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-3">
              <HeartPulse className="w-4 h-4 text-rose-300" />
              <span>SOPORTE VITAL AVANZADO (SVA) · ALGORITMO ERC 2021-2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Protocolos de Parada Cardiorrespiratoria (RCP & SVA)
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Metrónomo a 100-120 bpm para compresiones torácicas de alta calidad, temporizadores automáticos de ciclos de 2 minutos, cronómetro de Adrenalina cada 3-5 min y guía de las 4H y 4T.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition flex items-center gap-2 shrink-0 ${
                isMetronomeActive
                  ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                  : 'bg-white text-rose-950 hover:bg-rose-50'
              }`}
            >
              {isMetronomeActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-rose-900 text-rose-900" />}
              <span>{isMetronomeActive ? 'PAUSAR RCP' : 'INICIAR RCP Y TIMERS'}</span>
            </button>
            <button
              onClick={resetAllTimers}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Reiniciar todos los temporizadores"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Algorithm Selection: Shockable vs Non-Shockable */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setRhythmType('shockable')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
              rhythmType === 'shockable'
                ? 'bg-white text-rose-950 shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Ritmo Desfibrilable (FV / TVSP)</span>
          </button>
          <button
            onClick={() => setRhythmType('nonShockable')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
              rhythmType === 'nonShockable'
                ? 'bg-white text-rose-950 shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-300" />
            <span>Ritmo No Desfibrilable (Asistolia / AESP)</span>
          </button>
        </div>
      </div>

      {/* METRONOME & CYCLE TIMERS HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Metrónomo 100-120 bpm */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">
              Metrónomo Compresiones
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              title={soundEnabled ? 'Silenciar beeps' : 'Activar beeps sonoros'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
            </button>
          </div>

          <div className="text-center py-2 space-y-2">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-transform duration-100 ${
                beatPulse && isMetronomeActive
                  ? 'scale-115 bg-rose-600 text-white shadow-xl shadow-rose-300'
                  : 'scale-100 bg-rose-50 text-rose-700'
              }`}
            >
              <HeartPulse className="w-10 h-10" />
            </div>
            <strong className="text-3xl font-black text-stone-900 block font-mono">
              {bpm} <span className="text-sm font-sans text-stone-400">bpm</span>
            </strong>
            <span className="text-xs text-stone-500 font-semibold block">
              {compressionsCount} compresiones acumuladas
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-100">
            <button
              onClick={() => setBpm((prev) => Math.max(100, prev - 5))}
              className="px-2.5 py-1 rounded-lg bg-stone-100 text-xs font-bold text-stone-700"
            >
              -5
            </button>
            <span className="text-[11px] text-stone-400 font-bold">Rango: 100-120</span>
            <button
              onClick={() => setBpm((prev) => Math.min(120, prev + 5))}
              className="px-2.5 py-1 rounded-lg bg-stone-100 text-xs font-bold text-stone-700"
            >
              +5
            </button>
          </div>
        </div>

        {/* Card 2: Ciclo de 2 Minutos */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">
              Ciclo de 2 Minutos (Cambio)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              Ciclo #{cyclesCompleted + 1}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <strong
              className={`text-4xl font-black font-mono block ${
                cycleSeconds <= 15 ? 'text-rose-600 animate-pulse' : 'text-stone-900'
              }`}
            >
              {formatMinSec(cycleSeconds)}
            </strong>
            <p className="text-xs text-stone-500">
              {cycleSeconds <= 15
                ? '¡Preparar relevo de compresor!'
                : 'Compresiones continuas 30:2 o 100/min'}
            </p>
          </div>

          <button
            onClick={() => setCycleSeconds(120)}
            className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar 2 Minutos</span>
          </button>
        </div>

        {/* Card 3: Adrenalina 1 mg (cada 3-5 min) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">
              Adrenalina 1 mg (cada 3-5 min)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {adrenDosesGiven} dosis pautadas
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <strong
              className={`text-4xl font-black font-mono block ${
                adrenSeconds <= 20 ? 'text-rose-600 animate-pulse' : 'text-stone-900'
              }`}
            >
              {formatMinSec(adrenSeconds)}
            </strong>
            <p className="text-xs text-stone-500">
              {adrenSeconds <= 20
                ? '¡Preparar bolo de 1 mg IV + 20 ml SF!'
                : 'Próxima dosis en cuenta atrás'}
            </p>
          </div>

          <button
            onClick={handleGiveAdrenaline}
            className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Registrar Dosis 1 mg Adrenalina</span>
          </button>
        </div>
      </div>

      {/* SPECIFIC ALGORITHM WORKFLOW */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-stone-900">
              {rhythmType === 'shockable'
                ? 'RITMO DESFIBRILABLE: Fibrilación Ventricular (FV) / Taquicardia Ventricular Sin Pulso (TVSP)'
                : 'RITMO NO DESFIBRILABLE: Asistolia / Actividad Eléctrica Sin Pulso (AESP)'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pasos exactos y dosis oficiales según las recomendaciones ERC 2021-2025.
            </p>
          </div>

          {rhythmType === 'shockable' && (
            <button
              onClick={handleDeliverShock}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition flex items-center gap-2 shadow-md animate-bounce"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>REGISTRAR CHOQUE #{shocksGiven + 1} (150-200 J)</span>
            </button>
          )}
        </div>

        {/* Shockable Sequence */}
        {rhythmType === 'shockable' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-950 uppercase">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
                <span>1.er Choque (150-200 J)</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Desfibrilación inmediata bifásica (150-200 J). <strong>REANUDAR RCP 2 MINUTOS INMEDIATAMENTE</strong> sin comprobar pulso ni ritmo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-stone-900 uppercase">
                <span className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs">2</span>
                <span>2.º Choque + Preparar Vía</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Si persiste FV/TV tras 2 min RCP: 2.º Choque. Continuar RCP 2 min. Asegurar vía venosa periférica (VVP) o intraósea (IO). Preparar Adrenalina y Amiodarona.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-rose-950 uppercase">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">3</span>
                <span>3.er Choque + Fármacos</span>
              </div>
              <p className="text-rose-950 leading-relaxed font-semibold">
                Tras 3.er choque administrar de inmediato:
                <br />• <strong>Adrenalina 1 mg IV/IO</strong> (repetir cada 3-5 min)
                <br />• <strong>Amiodarona 300 mg IV/IO</strong> (tras 5.º choque: 150 mg)
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-rose-950 uppercase">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>NO DESFIBRILAR · Adrenalina Inmediata</span>
              </div>
              <p className="text-stone-800 leading-relaxed">
                En Asistolia o AESP la desfibrilación está <strong>CONTRAINDICADA</strong>. Iniciar RCP de alta calidad de inmediato y administrar <strong>Adrenalina 1 mg IV/IO LO ANTES POSIBLE</strong> (repetir cada 3-5 min / en ciclos alternos).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-stone-900 uppercase">
                <Clock className="w-5 h-5 text-stone-600" />
                <span>Ciclos de 2 min & Buscar Causas</span>
              </div>
              <p className="text-stone-800 leading-relaxed">
                Continuar RCP en ciclos de 2 minutos. Comprobar ritmo brevemente tras cada ciclo. La clave fundamental en ritmos no desfibrilables es <strong>IDENTIFICAR Y TRATAR LAS CAUSAS REVERSIBLES (4H y 4T)</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LAS 4H Y 4T CAUSAS REVERSIBLES */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-700" />
          <h3 className="text-base font-extrabold text-stone-900">
            Regla de las 4H y 4T: Causas Reversibles de Parada
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 4 H */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2.5">
            <span className="font-black text-blue-950 uppercase tracking-wide block">
              LAS 4 «H»
            </span>
            <ul className="space-y-1.5 text-stone-700">
              <li><strong>1. Hipoxia:</strong> Ventilar con FiO2 100% y comprobar permeabilidad de tubo/vía aérea.</li>
              <li><strong>2. Hipovolemia:</strong> Infundir fluidoterapia rápida de cristaloides (suero fisiológico / Ringer lactato).</li>
              <li><strong>3. Hipo/Hiperpotasemia y metabólica:</strong> Cloruro cálcico al 10% si hiperpotasemia, bicarbonato sódico si acidosis severa.</li>
              <li><strong>4. Hipotermia:</strong> Medir temperatura central y recalentamiento activo.</li>
            </ul>
          </div>

          {/* 4 T */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5">
            <span className="font-black text-amber-950 uppercase tracking-wide block">
              LAS 4 «T»
            </span>
            <ul className="space-y-1.5 text-stone-700">
              <li><strong>1. Trombosis (Coronaria / IAM o Pulmonar / TEP):</strong> Considerar fibrinolisis de rescate si sospecha de TEP masivo.</li>
              <li><strong>2. Taponamiento cardiaco:</strong> Pericardiocentesis urgente con aguja larga.</li>
              <li><strong>3. Neumotórax a Tensión:</strong> Descompresión inmediata con aguja/catéter 14G en 2.º espacio intercostal línea medioclavicular o 5.º EIC línea axilar anterior.</li>
              <li><strong>4. Tóxicos:</strong> Antídotos específicos (Naloxona en sobredosis de opioides, Flumazenilo en benzodiacepinas).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
