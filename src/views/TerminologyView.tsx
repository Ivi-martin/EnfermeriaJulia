import React, { useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { MedicalTerm } from '../types';
import {
  BookA,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const TerminologyView: React.FC = () => {
  const { state } = useCampusStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'dictionary' | 'flashcards'>('dictionary');

  // Flashcards state
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Todos los términos' },
    { id: 'Prefijo', label: 'Prefijos (Taqui-, Bradi...)' },
    { id: 'Sufijo', label: 'Sufijos (-itis, -ectomía...)' },
    { id: 'Raíz', label: 'Raíces anatómicas' },
    { id: 'Abreviatura', label: 'Abreviaturas hospitalarias' },
    { id: 'Posición Anatómica', label: 'Posiciones de Enfermería' }
  ];

  const filteredTerms = state.terms.filter((term) => {
    const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;
    const termLower = searchTerm.toLowerCase();
    const matchesSearch =
      term.term.toLowerCase().includes(termLower) ||
      term.meaning.toLowerCase().includes(termLower) ||
      (term.example && term.example.toLowerCase().includes(termLower)) ||
      (term.notes && term.notes.toLowerCase().includes(termLower));
    return matchesCat && matchesSearch;
  });

  const currentFlashcard = filteredTerms[flashIndex] || filteredTerms[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashIndex((prev) => (prev + 1) % Math.max(1, filteredTerms.length));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashIndex((prev) => (prev - 1 + filteredTerms.length) % Math.max(1, filteredTerms.length));
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#365e45]">
            LENGUAJE MÉDICO Y CLÍNICO
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Terminología Médica Esencial
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Prefijos, sufijos, siglas habituales en hospital y posiciones de enfermería para 1.º curso.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-200/70 border border-stone-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('dictionary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'dictionary'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Diccionario</span>
          </button>
          <button
            onClick={() => {
              setViewMode('flashcards');
              setFlashIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'flashcards'
                ? 'bg-[#365e45] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modo Flashcards</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFlashIndex(0);
            }}
            placeholder="Buscar término o significado (ej. Taqui-, HTA, Disnea, Braden, Fowler, -ectomía)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#365e45] shadow-xs"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                setFlashIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-[#365e45] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FLASHCARDS INTERACTIVE MODE */}
      {viewMode === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
          {currentFlashcard ? (
            <div className="space-y-4">
              {/* Progress status */}
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-2">
                <span>
                  Tarjeta {flashIndex + 1} de {filteredTerms.length}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{masteredIds.length} dominadas</span>
                </span>
              </div>

              {/* The Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[260px] p-8 rounded-3xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01] shadow-md ${
                  isFlipped
                    ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-300'
                    : 'bg-gradient-to-br from-white via-[#fafbfa] to-[#f4f7f4] border-stone-200'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#365e45] px-3 py-1 rounded-full bg-[#e8f0e8] mb-4">
                  {currentFlashcard.category} · {isFlipped ? 'RESPUESTA / SIGNIFICADO' : 'PREGUNTA / TÉRMINO'}
                </span>

                {!isFlipped ? (
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                      {currentFlashcard.term}
                    </h2>
                    <p className="text-xs text-stone-400 mt-2">Toca la tarjeta para ver el significado clínico</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-md animate-fadeIn">
                    <p className="text-lg font-bold text-stone-900 leading-snug">
                      {currentFlashcard.meaning}
                    </p>
                    {currentFlashcard.example && (
                      <p className="text-xs text-emerald-900 bg-emerald-100/60 p-2.5 rounded-xl italic">
                        <strong>Ejemplo clínico:</strong> {currentFlashcard.example}
                      </p>
                    )}
                    {currentFlashcard.notes && (
                      <p className="text-xs text-stone-500">{currentFlashcard.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  onClick={() => toggleMastered(currentFlashcard.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                    masteredIds.includes(currentFlashcard.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e8f0e8] text-[#2d523e] hover:bg-[#d8e8d8]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{masteredIds.includes(currentFlashcard.id) ? '¡Dominada!' : 'Marcar como aprendida'}</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2.5 rounded-2xl bg-[#365e45] text-white font-bold text-xs hover:bg-[#284835] transition flex items-center gap-1.5"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500">No hay términos con los filtros actuales.</div>
          )}
        </div>
      )}

      {/* DICTIONARY LIST MODE */}
      {viewMode === 'dictionary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <strong className="text-base font-bold text-stone-900 tracking-tight">
                      {term.term}
                    </strong>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        term.category === 'Prefijo'
                          ? 'bg-blue-50 text-blue-800'
                          : term.category === 'Sufijo'
                          ? 'bg-purple-50 text-purple-800'
                          : term.category === 'Raíz'
                          ? 'bg-emerald-50 text-emerald-800'
                          : term.category === 'Posición Anatómica'
                          ? 'bg-rose-50 text-rose-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {term.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">{term.meaning}</p>
                </div>

                {term.example && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <strong className="text-stone-600">Ejemplo:</strong> {term.example}
                  </div>
                )}
                {term.notes && (
                  <div className="mt-1 text-[11px] text-stone-400 italic">{term.notes}</div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 p-12 text-center rounded-3xl bg-white border border-stone-200 text-stone-500">
              No se encontraron términos que coincidan con «{searchTerm}».
            </div>
          )}
        </div>
      )}
    </div>
  );
};
