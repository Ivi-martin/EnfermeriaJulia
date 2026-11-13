import React from 'react';
import {
  Sun,
  Pill,
  Calculator,
  BookA,
  Bell,
  Sparkles,
  BookOpen,
  Stethoscope,
  Activity,
  GraduationCap,
  FileText,
  Heart,
  X,
  TestTube2,
  Bot,
  Brain,
  Bookmark,
  HeartPulse,
  Flame,
  ShieldAlert,
  Car,
  FolderLock,
  Layers,
  Compass,
  CalendarDays,
  Library,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  ScrollText,
  Wrench,
  UtensilsCrossed,
  NotebookPen
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navSections = [
    {
      title: 'MI DÍA',
      items: [
        { id: 'today', label: 'Mi Día', icon: Sun },
        { id: 'smartWeek', label: 'Mi semana inteligente', icon: CalendarDays },
        { id: 'reminders', label: 'Agenda & plazos', icon: Bell },
      ]
    },
    {
      title: 'APRENDER',
      items: [
        { id: 'uclm', label: 'Mi UCLM · Plan de estudios', icon: GraduationCap },
        { id: 'notes', label: 'Mis Apuntes', icon: NotebookPen },
        { id: 'academy', label: 'Academia & Exámenes', icon: Brain },
        { id: 'evidence', label: 'Biblioteca científica', icon: Library },
        { id: 'tfg', label: 'Trabajo Fin de Grado', icon: ScrollText },
        { id: 'tutorAI', label: 'Tutor IA (10 asistentes)', icon: Bot },
        { id: 'anatomy', label: 'Anatomía interactiva', icon: Activity },
        { id: 'terminology', label: 'Terminología médica', icon: BookA },
      ]
    },
    {
      title: 'BIENESTAR & ACOMPAÑAMIENTO',
      items: [
        { id: 'tuAmore', label: 'Tu Amore · Bienestar emocional', icon: Heart },
      ]
    },
    {
      title: 'TUTORES IA DEL HOGAR',
      items: [
        { id: 'manitas', label: 'El Manitas de casa (IA)', icon: Wrench },
        { id: 'chefNutri', label: 'Chef & Nutrición (IA)', icon: UtensilsCrossed },
      ]
    },
    {
      title: 'ENTRENAR',
      items: [
        { id: 'ecoe', label: 'Simulación ECOE', icon: Stethoscope },
        { id: 'ecoeTrainer', label: 'Entrenador ECOE', icon: ClipboardCheck },
        { id: 'laboratory', label: 'Laboratorio & ECG', icon: TestTube2 },
        { id: 'pharmacologyPro', label: 'Farmacología PRO & CIMA', icon: Pill },
        { id: 'clinicalCases', label: 'Casos clínicos simulados', icon: Stethoscope },
        { id: 'cpr', label: 'RCP / SVA · material docente', icon: HeartPulse },
        { id: 'tools', label: 'PAE & SBAR', icon: Layers },
        { id: 'manuals', label: 'Manuales clínicos', icon: BookOpen },
        { id: 'scales', label: 'Escalas de valoración', icon: FileText },
        { id: 'clinicalSources', label: 'Fuentes clínicas verificadas', icon: ShieldCheck },
      ]
    },
    {
      title: 'MIS PRÁCTICAS',
      items: [
        { id: 'practice360', label: 'Prácticas 360', icon: Activity },
        { id: 'practicePassport', label: 'Mi pasaporte de prácticas', icon: ClipboardCheck },
      ]
    },
    {
      title: 'MI VIDA EN TOLEDO',
      items: [
        { id: 'toledoPocket', label: 'Toledo en mi bolsillo', icon: MapPin },
        { id: 'travel', label: 'Viajes', icon: Car },
        { id: 'emergency', label: 'Emergencias 112', icon: ShieldAlert },
        { id: 'life', label: 'Gastos, menús & hábitos', icon: Heart },
        { id: 'shortcuts', label: 'Atajos y enlaces', icon: Compass },
        { id: 'vault', label: 'Bóveda personal', icon: FolderLock },
      ]
    },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#365e45] text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <span className="text-xl leading-none">✚</span>
            </div>
            <div>
              <strong className="text-sm font-extrabold text-stone-900 tracking-tight block">
                Campus Enfermería
              </strong>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-[#e8f0e8] px-1.5 py-0.5 rounded">
                TOLEDO · UCLM
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 lg:hidden rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Julia Profile Chip in Sidebar */}
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-[#f6f9f6] border border-emerald-200/80 flex items-center gap-3 shadow-2xs">
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/Ilustraci_n_alegre_de_estudiante_de_enfermer_a_aa60d2b2.png`}
            alt="Julia"
            className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              ESTUDIANTE
            </span>
            <strong className="text-xs font-bold text-stone-900 truncate block leading-tight">
              Julia
            </strong>
            <span className="text-[11px] text-stone-500 block truncate">
              1.º Grado en Enfermería
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1.5">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-3 text-left ${
                      isActive
                        ? 'bg-[#365e45] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-stone-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer with PWA Install Prompt & IviMOCA */}
        <div className="p-4 border-t border-stone-100 bg-[#fafbfa] space-y-3">
          <a
            href="/guia-usuario-julia.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-extrabold transition flex items-center justify-between shadow-2xs group"
            title="Abrir la Guía Interactiva Completa de Usuario para Julia"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📖</span>
              <span className="font-extrabold text-[#1a3827]">Guía Interactiva</span>
            </div>
            <span className="text-[10px] bg-[#2d553e] text-white font-bold px-2 py-0.5 rounded-md group-hover:scale-105 transition">
              Abrir ↗
            </span>
          </a>
          <PWAInstallButton />
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400">
            <span>UCLM Fábrica de Armas</span>
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/logo-ivimoca_6074b254.png`}
              alt="IviMOCA"
              className="h-4 w-auto object-contain opacity-70 hover:opacity-100 transition"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
