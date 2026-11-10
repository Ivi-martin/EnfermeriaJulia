import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import {
  Car,
  Bus,
  Train,
  CheckCircle2,
  ExternalLink,
  Luggage,
  RotateCcw,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  Plus
} from 'lucide-react';

export const TravelView: React.FC = () => {
  const { state, toggleLuggageItem, resetLuggageChecklist } = useCampusStore();
  const [tripFilter, setTripFilter] = useState<'all' | 'weekend' | 'vacation'>('weekend');

  const filteredLuggage = state.luggageChecklist.filter((item) => {
    if (tripFilter === 'all') return true;
    return item.tripType === 'all' || item.tripType === tripFilter;
  });

  const checkedCount = filteredLuggage.filter((i) => i.checked).length;
  const progressPercent = filteredLuggage.length > 0 ? Math.round((checkedCount / filteredLuggage.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1d3557] via-[#2a4d77] to-[#15253d] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-3">
              <Car className="w-4 h-4 text-blue-300" />
              <span>LOGÍSTICA DE VIAJES Y ESTUDIANTE FUERA DE CASA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Viajes Toledo ↔ Granada & Maleta Inteligente
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Enlaces directos y horarios de BlaBlaCar, Alsa y Renfe Avant + AVE. Checklist inteligente de maleta para no olvidar nunca las llaves, la tarjeta sanitaria, los apuntes ni los tuppers de vuelta.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Maleta Lista</span>
              <strong className="text-xl font-black text-white">{progressPercent}%</strong>
              <span className="text-[10px] text-stone-300 block">{checkedCount} de {filteredLuggage.length} objetos</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-200">
              <Luggage className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* TRAVEL TRANSPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BlaBlaCar */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black mb-3">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">BlaBlaCar</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                La opción más rápida
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Viajes directos en coche compartido entre Toledo y Granada (habitualmente viernes tarde y domingo tarde). Duración media: ~3h 45 min.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-stone-100">
            <a
              href="https://www.blablacar.es/search?fn=Toledo&tn=Granada"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Buscar Toledo → Granada</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.blablacar.es/search?fn=Granada&tn=Toledo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Buscar Granada → Toledo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Alsa Autobuses */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black mb-3">
              <Bus className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">Alsa Autobuses</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Económico
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Autobuses directos y combinaciones con Madrid (Estación Sur Méndez Álvaro). Toledo a Madrid Plaza Elíptica cada 30 min (Alsa/Samar).
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <a
              href="https://www.alsa.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Abrir Web Oficial de Alsa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Renfe Avant + AVE */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black mb-3">
              <Train className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">Renfe Avant + AVE</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Máximo Confort
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Lanzadera Avant Toledo → Madrid Puerta de Atocha (33 min) y enlace directo con AVE Madrid → Granada (3h 15 min).
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <a
              href="https://www.renfe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Consultar Trenes Renfe</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* SMART LUGGAGE CHECKLIST */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Luggage className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-black text-stone-900">Checklist de Maleta Inteligente</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Marca cada objeto antes de salir de casa para no dejarte nada importante.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setTripFilter('weekend')}
                className={`px-3 py-1 rounded-lg transition ${
                  tripFilter === 'weekend' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Fin de Semana
              </button>
              <button
                onClick={() => setTripFilter('vacation')}
                className={`px-3 py-1 rounded-lg transition ${
                  tripFilter === 'vacation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Vacaciones
              </button>
              <button
                onClick={() => setTripFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  tripFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Todo
              </button>
            </div>

            <button
              onClick={resetLuggageChecklist}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
              title="Desmarcar todos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-stone-600">Progreso de la maleta</span>
            <span className="text-emerald-700">{progressPercent}% completado</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List categorized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredLuggage.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleLuggageItem(item.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                item.checked
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold line-through'
                  : 'bg-[#fafcf9] border-stone-200/80 hover:border-emerald-300 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}}
                  className="accent-emerald-600 w-4 h-4 rounded"
                />
                <span className="text-xs">{item.name}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-semibold shrink-0">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
