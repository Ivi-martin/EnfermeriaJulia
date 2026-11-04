import React from 'react';
import { Heart, GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-stone-200/90 bg-white/80 backdrop-blur-xs py-6 px-4 sm:px-8 text-xs text-stone-600 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Dedication to Julia */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <img
            src="/assets/aistudio/Ilustraci_n_alegre_de_estudiante_de_enfermer_a_aa60d2b2.png"
            alt="Julia H. Carreras"
            className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-stone-800">
              <span>Aplicación personalizada para</span>
              <strong className="text-[#203a2b]">Julia H. Carreras</strong>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            </div>
            <p className="text-[11px] text-stone-400">
              1.º Curso Grado en Enfermería · UCLM Campus Fábrica de Armas (Toledo)
            </p>
          </div>
        </div>

        {/* Right Side: IviMOCA Logo & Branding */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
            Desarrollado por
          </span>
          <div className="p-1.5 px-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition">
            <img
              src="/assets/aistudio/logo-ivimoca_6074b254.png"
              alt="Logo IviMOCA"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
