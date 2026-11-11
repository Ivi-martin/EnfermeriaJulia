import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { QuickLink } from '../types';
import {
  ExternalLink,
  Search,
  Plus,
  Trash2,
  GraduationCap,
  Car,
  Bus,
  Train,
  Sparkles,
  Brain,
  Layers,
  Heart,
  Smile,
  MapPin,
  Bookmark,
  Stethoscope,
  BookOpen,
  FileText,
  Laptop,
  Check,
  Compass,
  Building2,
  Smartphone,
  RotateCcw
} from 'lucide-react';

export const ShortcutsView: React.FC = () => {
  const { state, addQuickLink, deleteQuickLink, resetQuickLinks } = useCampusStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New link modal/form state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    category: 'estudio' as QuickLink['category'],
    description: '',
    badge: 'Personal',
  });

  const categories = [
    { id: 'all', label: 'Todos los atajos' },
    { id: 'uclm', label: '🎓 UCLM & Becas' },
    { id: 'viajes', label: '🚗 Viajes Toledo ↔ Granada' },
    { id: 'estudio', label: '📚 Estudio & IA' },
    { id: 'salud', label: '💚 Salud Mental & Apoyo' },
    { id: 'utilidades', label: '📍 Movilidad & Recursos' },
  ];

  const filteredLinks = state.quickLinks.filter((link) => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      link.name.toLowerCase().includes(term) ||
      link.description.toLowerCase().includes(term) ||
      (link.badge && link.badge.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'uclm':
        return <GraduationCap className="w-5 h-5 text-emerald-700" />;
      case 'viajes':
        return <Car className="w-5 h-5 text-blue-700" />;
      case 'estudio':
        return <Brain className="w-5 h-5 text-purple-700" />;
      case 'salud':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'utilidades':
        return <Compass className="w-5 h-5 text-amber-700" />;
      default:
        return <ExternalLink className="w-5 h-5 text-stone-600" />;
    }
  };

  const getLinkIcon = (link: QuickLink) => {
    switch (link.iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-emerald-700" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-emerald-700" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-emerald-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-700" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-700" />;
      case 'Bus':
        return <Bus className="w-5 h-5 text-blue-700" />;
      case 'Train':
        return <Train className="w-5 h-5 text-blue-700" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-purple-700" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-700" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-rose-600" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-amber-700" />;
      case 'Bookmark':
        return <Bookmark className="w-5 h-5 text-purple-700" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-teal-700" />;
      default:
        return getCategoryIcon(link.category);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name.trim() || !newLink.url.trim()) return;
    let url = newLink.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    addQuickLink({
      name: newLink.name.trim(),
      url,
      category: newLink.category,
      description: newLink.description.trim() || 'Enlace añadido por Julia',
      badge: newLink.badge || 'Personal',
    });
    setNewLink({
      name: '',
      url: '',
      category: 'estudio',
      description: '',
      badge: 'Personal',
    });
    setIsAddingLink(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1a3426] via-[#2d523e] to-[#15281e] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>PANEL DE ACCESO RÁPIDO Y RECURSOS DIARIOS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Atajos y Enlaces Rápidos
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Todos los portales imprescindibles para el día a día de Julia: Facultad de Enfermería (FAFETO), Campus Virtual, appUCLM Móvil, prest.on y portátiles, sede de becas MEC, BlaBlaCar y Alsa Toledo–Granada, Anki, Zotero y transporte urbano.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('¿Quieres restaurar los enlaces oficiales de la UCLM a sus URLs oficiales actualizadas?')) {
                  resetQuickLinks();
                }
              }}
              title="Restaurar enlaces oficiales de la UCLM"
              className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/20"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Restaurar Oficiales</span>
            </button>

            <button
              onClick={() => setIsAddingLink(true)}
              className="px-4 py-3 rounded-2xl bg-white text-[#1f422f] hover:bg-emerald-50 text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Atajo</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#1a3426] shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3 shadow-2xs">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar enlace por nombre, descripción o servicio (ej. becas, Alsa, Zotero, Toledo)..."
          className="w-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-stone-400 hover:text-stone-700 px-2 font-bold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link) => (
          <div
            key={link.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  {getLinkIcon(link)}
                </div>
                <div className="flex items-center gap-1.5">
                  {link.badge && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {link.badge}
                    </span>
                  )}
                  {link.isCustom && (
                    <button
                      onClick={() => deleteQuickLink(link.id)}
                      className="p-1 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Eliminar atajo personalizado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-800 transition line-clamp-1">
                {link.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                {link.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopy(link.id, link.url)}
                className="text-[11px] font-bold text-stone-400 hover:text-stone-700 transition flex items-center gap-1"
                title="Copiar URL"
              >
                {copiedId === link.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <span>Copiar enlace</span>
                )}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#365e45] text-white hover:bg-[#284935] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group-hover:shadow-xs"
              >
                <span>Abrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-stone-300 text-center space-y-2">
          <p className="text-sm font-bold text-stone-600">No se encontraron atajos con ese criterio.</p>
          <p className="text-xs text-stone-400">Prueba con otra palabra o añade tu propio atajo.</p>
        </div>
      )}

      {/* Modal Añadir Enlace Personalizado */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Añadir Nuevo Atajo</h3>
              <button
                onClick={() => setIsAddingLink(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Nombre del Servicio / App</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Biblioteca UCLM, Google Drive, Renfe..."
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">URL / Enlace Web</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Categoría</label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value as QuickLink['category'] })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="uclm">🎓 UCLM & Becas</option>
                  <option value="viajes">🚗 Viajes Toledo ↔ Granada</option>
                  <option value="estudio">📚 Estudio & IA</option>
                  <option value="salud">💚 Salud Mental & Apoyo</option>
                  <option value="utilidades">📍 Movilidad & Recursos</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Para qué lo utilizas en tu día a día..."
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Etiqueta / Badge</label>
                <input
                  type="text"
                  placeholder="ej. Favorito, Diario, Prácticas..."
                  value={newLink.badge}
                  onChange={(e) => setNewLink({ ...newLink, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddingLink(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#365e45] text-white text-xs font-extrabold hover:bg-[#284935] transition shadow-xs"
                >
                  Guardar Atajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
