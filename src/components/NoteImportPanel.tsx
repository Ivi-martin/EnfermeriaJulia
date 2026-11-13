import React, { useMemo, useRef, useState } from 'react';
import { StudentNote } from '../types';
import {
  blobToBase64,
  extractTextFromFile,
  formatFileSize,
  getNoteAttachment,
  inferMimeType,
  isGeminiMultimodalMime,
  saveNoteAttachment,
} from '../utils/notesStorage';
import {
  CheckCircle2,
  File,
  FileText,
  FolderOpen,
  NotebookPen,
  Search,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

export interface ImportedNotePayload {
  noteId?: string;
  title: string;
  subject: string;
  topic: string;
  text: string;
  fileBase64?: string;
  fileMimeType?: string;
  fileName?: string;
}

interface NoteImportPanelProps {
  notes: StudentNote[];
  subjects: { code: string; name: string; year: number }[];
  selectedNoteId?: string | null;
  onImport: (payload: ImportedNotePayload) => void;
  onSaveUploadedNote?: (
    note: Omit<StudentNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => StudentNote;
  onOpenNotesLibrary?: () => void;
  compactTitle?: string;
}

export const NoteImportPanel: React.FC<NoteImportPanelProps> = ({
  notes,
  subjects,
  selectedNoteId,
  onImport,
  onSaveUploadedNote,
  onOpenNotesLibrary,
  compactTitle = 'Importar desde Mis Apuntes o subir archivo',
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [saveUploadedToLibrary, setSaveUploadedToLibrary] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);
  const [activeImportedMeta, setActiveImportedMeta] = useState<{
    title: string;
    subject: string;
    topic: string;
    hasMultimodalFile: boolean;
    fileName?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notesSubjects = useMemo(() => {
    const map = new Map<string, string>();
    notes.forEach((n) => {
      const key = n.subjectCode || n.subjectName;
      if (!map.has(key)) map.set(key, n.subjectName);
    });
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [notes]);

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    notes
      .filter((n) => subjectFilter === 'ALL' || n.subjectCode === subjectFilter || n.subjectName === subjectFilter)
      .forEach((n) => set.add(n.topic || 'General'));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [notes, subjectFilter]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (subjectFilter !== 'ALL' && n.subjectCode !== subjectFilter && n.subjectName !== subjectFilter) {
        return false;
      }
      if (topicFilter !== 'ALL' && (n.topic || 'General') !== topicFilter) {
        return false;
      }
      if (q) {
        const hay = `${n.title} ${n.subjectName} ${n.topic} ${n.content}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [notes, subjectFilter, topicFilter, search]);

  const handleSelectExistingNote = async (note: StudentNote) => {
    setIsLoadingNote(true);
    setErrorMsg(null);
    try {
      let fileBase64: string | undefined;
      let fileMimeType: string | undefined;
      let hasMultimodalFile = false;

      if (note.hasAttachment) {
        const att = await getNoteAttachment(note.id);
        const mime = att?.mimeType || note.fileMimeType || '';
        if (att?.blob && isGeminiMultimodalMime(mime)) {
          fileBase64 = await blobToBase64(att.blob);
          fileMimeType = mime;
          hasMultimodalFile = true;
        }
      }

      if (!hasMultimodalFile && (!note.content || note.content.trim().length < 15)) {
        setErrorMsg(
          `El apunte "${note.title}" no tiene texto extraído ni un PDF/imagen compatible para analizar. Edítalo en Mis Apuntes o sube un archivo PDF/Word/TXT/Imagen.`
        );
        return;
      }

      setActiveImportedMeta({
        title: note.title,
        subject: note.subjectName,
        topic: note.topic || 'General',
        hasMultimodalFile,
        fileName: note.fileName,
      });

      onImport({
        noteId: note.id,
        title: note.title,
        subject: note.subjectName,
        topic: note.topic || 'General',
        text: note.content || '',
        fileBase64,
        fileMimeType,
        fileName: note.fileName,
      });
      setIsExpanded(false);
    } catch {
      setErrorMsg('No se pudo cargar el contenido del apunte seleccionado.');
    } finally {
      setIsLoadingNote(false);
    }
  };

  const handleUploadDirectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsLoadingNote(true);
    setErrorMsg(null);
    try {
      const mime = inferMimeType(file.name, file.type);
      const { text } = await extractTextFromFile(file);
      const isMultimodal = isGeminiMultimodalMime(mime);
      const fileBase64 = isMultimodal ? await blobToBase64(file) : undefined;

      if (!isMultimodal && text.trim().length < 15) {
        setErrorMsg('No se pudo extraer suficiente texto de ese archivo. Prueba con PDF, Word (.docx), .txt, .md o imagen.');
        return;
      }

      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      const subjObj =
        subjectFilter !== 'ALL'
          ? subjects.find((s) => s.code === subjectFilter) || { code: 'GENERAL', name: 'General' }
          : subjects[0] || { code: 'GENERAL', name: 'Enfermería' };
      const topic = topicFilter !== 'ALL' ? topicFilter : 'General';

      let createdNoteId: string | undefined;
      if (saveUploadedToLibrary && onSaveUploadedNote) {
        const noteId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        await saveNoteAttachment(noteId, file, file.name, mime);
        const created = onSaveUploadedNote({
          id: noteId,
          title,
          subjectCode: subjObj.code,
          subjectName: subjObj.name,
          topic,
          category: mime === 'application/pdf' ? 'Diapositivas / PDF' : mime.startsWith('image/') ? 'Esquema' : 'Apuntes de clase',
          content: text,
          fileName: file.name,
          fileMimeType: mime,
          fileSize: file.size,
          hasAttachment: true,
          tags: ['importado-ia'],
        });
        createdNoteId = created.id;
      }

      setActiveImportedMeta({
        title,
        subject: subjObj.name,
        topic,
        hasMultimodalFile: isMultimodal,
        fileName: file.name,
      });

      onImport({
        noteId: createdNoteId,
        title,
        subject: subjObj.name,
        topic,
        text,
        fileBase64,
        fileMimeType: isMultimodal ? mime : undefined,
        fileName: file.name,
      });
    } catch {
      setErrorMsg('Error al leer el archivo seleccionado.');
    } finally {
      setIsLoadingNote(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,.markdown,.csv,.json,.docx,.png,.jpg,.jpeg,.webp"
        onChange={(e) => void handleUploadDirectFile(e)}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#365e45] text-white flex items-center justify-center shrink-0">
            <NotebookPen className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs sm:text-sm font-extrabold text-stone-900 block">
              {compactTitle}
            </strong>
            <span className="text-[11px] text-stone-600 block">
              {notes.length} {notes.length === 1 ? 'apunte disponible' : 'apuntes disponibles'} en tu biblioteca · Admite PDF, imágenes, Word y texto
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-[#1e3d2c] text-xs font-extrabold flex items-center gap-1.5 transition shadow-2xs"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Ocultar mis apuntes' : `Elegir de Mis Apuntes (${notes.length})`}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoadingNote}
            className="px-3 py-2 rounded-xl bg-[#365e45] hover:bg-[#294a36] text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isLoadingNote ? 'Cargando...' : 'Subir archivo directo'}</span>
          </button>
        </div>
      </div>

      {activeImportedMeta && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-extrabold text-stone-900 truncate block">
                Apunte importado: {activeImportedMeta.title}
              </span>
              <span className="text-[11px] text-stone-500">
                {activeImportedMeta.subject} · {activeImportedMeta.topic}
                {activeImportedMeta.hasMultimodalFile && activeImportedMeta.fileName
                  ? ` · Archivo IA adjunto (${activeImportedMeta.fileName})`
                  : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveImportedMeta(null)}
            className="p-1 text-stone-400 hover:text-stone-700"
            title="Ocultar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-rose-500 font-bold">
            ✕
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-[11px] font-semibold text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={saveUploadedToLibrary}
                onChange={(e) => setSaveUploadedToLibrary(e.target.checked)}
                className="accent-[#365e45] rounded"
              />
              <span>Guardar también en «Mis Apuntes» al subir archivo directo</span>
            </label>
            {onOpenNotesLibrary && (
              <button
                type="button"
                onClick={onOpenNotesLibrary}
                className="text-[11px] font-extrabold text-[#365e45] hover:underline"
              >
                Ir a organizar Mis Apuntes →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar apunte..."
                className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#365e45]"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setTopicFilter('ALL');
              }}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none"
            >
              <option value="ALL">Todas las asignaturas</option>
              {notesSubjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none"
            >
              <option value="ALL">Todos los temas</option>
              {availableTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200 text-xs text-stone-500">
              {notes.length === 0
                ? 'Aún no tienes apuntes guardados en «Mis Apuntes». Puedes subir un archivo directamente arriba o crearlos en Mis Apuntes.'
                : 'No hay apuntes que coincidan con ese filtro.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isSelected = selectedNoteId === note.id;
                return (
                  <button
                    key={note.id}
                    type="button"
                    disabled={isLoadingNote}
                    onClick={() => void handleSelectExistingNote(note)}
                    className={`text-left p-3 rounded-xl border transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-stone-50/60 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {note.hasAttachment ? (
                          <File className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        )}
                        <strong className="text-xs font-extrabold text-stone-900 truncate">
                          {note.title}
                        </strong>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                          {note.subjectName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                          {note.topic || 'General'}
                        </span>
                        {note.fileSize ? (
                          <span className="text-stone-400">{formatFileSize(note.fileSize)}</span>
                        ) : null}
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-[#365e45] text-white text-[10px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Importar
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
