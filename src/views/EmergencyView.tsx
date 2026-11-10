import React, { useState } from 'react';
import {
  PhoneCall,
  MapPin,
  Share2,
  Heart,
  AlertTriangle,
  Hospital,
  ShieldCheck,
  CheckCircle2,
  Send,
  Navigation
} from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const emergencyContacts = [
    {
      title: 'Papá (Contacto SOS 1)',
      name: 'Ivi Martín',
      number: '+34600000000',
      isFamily: true,
      role: 'Contacto Prioritario',
    },
    {
      title: 'Servicio de Emergencias 112',
      name: 'Urgencias Médicas, Policía y Bomberos',
      number: '112',
      isFamily: false,
      role: 'Emergencias Oficiales España',
    },
    {
      title: 'Hospital Universitario de Toledo',
      name: 'Urgencias Generales (Av. Barber / Santa M.ª de Benquerencia)',
      number: '925269200',
      isFamily: false,
      role: 'Hospital de Referencia',
    },
    {
      title: 'Seguridad Campus Fábrica de Armas UCLM',
      name: 'Control de Acceso y Vigilancia Campus Toledo',
      number: '925268800',
      isFamily: false,
      role: 'Campus Universitario',
    },
    {
      title: 'Policía Local de Toledo',
      name: 'Atención Ciudadana y Seguridad',
      number: '092',
      isFamily: false,
      role: 'Policía Local',
    },
    {
      title: 'Hospital San Cecilio / Virgen de las Nieves (Granada)',
      name: 'Urgencias Sanitarias Granada (Casa)',
      number: '958020000',
      isFamily: false,
      role: 'Hospital Granada',
    },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en este navegador.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Default to Campus Fábrica de Armas Toledo
        setGpsLocation({
          lat: 39.8647,
          lng: -4.0381,
        });
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const getWhatsAppMessageUrl = (type: 'arrived_toledo' | 'arrived_granada' | 'on_my_way') => {
    let text = '';
    const mapsLink = gpsLocation
      ? `https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`
      : 'https://maps.google.com/?q=Toledo';

    if (type === 'arrived_toledo') {
      text = `📍 ¡Hola papá! Ya he llegado bien a Toledo. Todo en orden. ${mapsLink}`;
    } else if (type === 'arrived_granada') {
      text = `📍 ¡Hola papá! Ya he llegado bien a Granada. ¡Nos vemos en nada! ${mapsLink}`;
    } else {
      text = `📍 Hola, voy de camino ahora mismo. Te comparto mi ubicación en tiempo real: ${mapsLink}`;
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#450a0a] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-rose-300" />
              <span>SEGURIDAD, FAMILIA & PROTOCOLOS DE ASISTENCIA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Contactos de Emergencia & Compartir Ubicación
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Botón directo al 112 con tus coordenadas en pantalla, aviso a papá por WhatsApp con un solo clic («He llegado bien») y directorio telefónico de Toledo y Granada.
            </p>
          </div>

          <a
            href="tel:112"
            className="px-8 py-4 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 text-base font-black transition flex items-center justify-center gap-2.5 shadow-2xl shrink-0 animate-pulse"
          >
            <PhoneCall className="w-6 h-6 fill-rose-900" />
            <span>LLAMAR AL 112</span>
          </a>
        </div>
      </div>

      {/* SHARE LOCATION WITH FAMILY WIDGET */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900">
                Compartir Ubicación con la Familia (WhatsApp)
              </h2>
              <p className="text-xs text-stone-500">
                Avisa a casa en 1 segundo sin tener que teclear nada.
              </p>
            </div>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{gpsLocation ? 'Ubicación GPS Lista' : 'Obtener Coordenadas GPS'}</span>
          </button>
        </div>

        {gpsLocation && (
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-mono flex items-center justify-between">
            <span>📍 Coordenadas: {gpsLocation.lat.toFixed(4)} N, {gpsLocation.lng.toFixed(4)} W (Toledo / Trayecto)</span>
            <span className="text-[10px] font-bold text-emerald-700 font-sans">GPS Activo</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={getWhatsAppMessageUrl('arrived_toledo')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-extrabold text-xs transition flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm">«Ya he llegado a Toledo»</span>
              <span className="text-[10px] font-normal text-stone-600">Aviso rápido para papá</span>
            </div>
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </a>

          <a
            href={getWhatsAppMessageUrl('arrived_granada')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-extrabold text-xs transition flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm">«Ya he llegado a Granada»</span>
              <span className="text-[10px] font-normal text-stone-600">Llegada a casa</span>
            </div>
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </a>

          <a
            href={getWhatsAppMessageUrl('on_my_way')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm">«Voy de camino»</span>
              <span className="text-[10px] font-normal text-stone-500">Con enlace GPS</span>
            </div>
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </a>
        </div>
      </div>

      {/* MEDICAL SOS CARD & PHONE DIRECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Julia's Emergency Medical Card (1 Col) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Heart className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-black text-stone-900">Ficha Médica de Emergencia</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Titular:</span>
              <strong className="text-stone-900 text-sm block">Julia H. Carreras</strong>
              <span className="text-[11px] text-stone-500">Estudiante 1.º Grado en Enfermería UCLM</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 block">Grupo Sanguíneo</span>
                <strong className="text-sm font-black text-stone-900">A +</strong>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 block">Alergias</span>
                <strong className="text-sm font-black text-emerald-700">Ninguna conocida</strong>
              </div>
            </div>

            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-rose-950">
              <span className="text-[10px] font-bold uppercase block text-rose-800">Contacto Familiar Prioritario:</span>
              <strong className="block font-black mt-0.5">Papá (Ivi Martín)</strong>
              <span className="text-[11px] font-semibold text-rose-900">Teléfono registrado en la app</span>
            </div>
          </div>
        </div>

        {/* Telephone Directory (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-black text-stone-900">Directorio Telefónico de Urgencias</h3>
            <span className="text-xs text-stone-400 font-bold">Toledo · UCLM · Granada</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.number}`}
                className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-[#f6faf7] transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    {contact.role}
                  </span>
                  <strong className="text-sm font-extrabold text-stone-900 block group-hover:text-emerald-800 transition">
                    {contact.title}
                  </strong>
                  <span className="text-xs text-stone-500 block line-clamp-1 mt-0.5">
                    {contact.name}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-[#365e45] group-hover:text-white flex items-center justify-center text-stone-700 transition shrink-0 ml-2">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
