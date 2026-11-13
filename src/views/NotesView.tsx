import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCampusStore } from '../hooks/useCampusStore';
import { NoteCategory, StudentNote } from '../types';
import {
  blobToBase64,
  downloadStudentNote,
  extractTextFromFile,
  formatFileSize,
  getNoteAttachment,
  inferMimeType,
  isGeminiMultimodalMime,
  saveNoteAttachment,
} from '../utils/notesStorage';
import { SimpleMarkdown } from '../components/SimpleMarkdown';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  File,
  FileText,
  FolderOpen,
  FolderPlus,
  Image as ImageIcon,
  NotebookPen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';

interface NotesViewProps {
  initialSubjectCode?: string | null;
  onClearInitialSubject?: () => void;
  onSendNoteToAcademy?: (noteId: string) => void;
}

const NOTE_CATEGORIES: NoteCategory[] = [
  'Apuntes de clase',
  'Diapositivas / PDF',
  'Esquema',
  'Guía / Protocolo',
  'Prácticas',
  'Otro',
];

export const NotesView: React.FC<NotesViewProps> = ({
  initialSubjectCode,
  onClearInitialSubject,
  onSendNoteToAcademy,
}) => {
  const {
    state,
    addStudentNote,
    updateStudentNote,
    deleteStudentNote,
    addNoteTopic,
    renameNoteTopic,
    deleteNoteTopic,
  } = useCampusStore();

  const notes = state.studentNotes || [];
  const subjects = state.subjects || [];

  // Filters
  const [yearFilter, setYearFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>(initialSubjectCode || 'ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Status banner (replaces window.alert)
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Drag & Drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Topic creation / editing state
  const [newTopicName, setNewTopicName] = useState('');
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);
  const [renamingTopic, setRenamingTopic] = useState<{ oldName: string; newName: string } | null>(null);
  const [confirmDeleteTopic, setConfirmDeleteTopic] = useState<string | null>(null);

  // Preview / Detail modal
  const [previewNote, setPreviewNote] = useState<StudentNote | null>(null);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string | null>(null);
  const [previewAttachmentMime, setPreviewAttachmentMime] = useState<string>('');
  const [isExtractingText, setIsExtractingText] = useState(false);

  // Delete confirmation state
  const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState<string | null>(null);

  // Create / Edit modal state
  const [editorModal, setEditorModal] = useState<{
    mode: 'create' | 'edit';
    noteId?: string;
    title: string;
    subjectKey: string;
    topic: string;
    customTopic: string;
    category: NoteCategory;
    content: string;
    tagsText: string;
    pendingFile?: File | null;
    existingFileName?: string;
    existingFileMimeType?: string;
    existingFileSize?: number;
    hasExistingAttachment?: boolean;
  } | null>(null);

  useEffect(() => {
    if (initialSubjectCode) {
      setSelectedSubjectKey(initialSubjectCode);
      setSelectedTopic('ALL');
      onClearInitialSubject?.();
    }
  }, [initialSubjectCode, onClearInitialSubject]);

  // Load attachment preview URL when opening previewNote
  useEffect(() => {
    let activeUrl: string | null = null;
    let cancelled = false;
    setPreviewAttachmentUrl(null);
    setPreviewAttachmentMime('');

    if (previewNote?.hasAttachment) {
      getNoteAttachment(previewNote.id)
        .then((att) => {
          if (cancelled || !att?.blob) return;
          activeUrl = URL.createObjectURL(att.blob);
          setPreviewAttachmentUrl(activeUrl);
          setPreviewAttachmentMime(att.mimeType || previewNote.fileMimeType || '');
        })
        .catch(() => {
          // ignore
        });
    }

    return () => {
      cancelled = true;
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [previewNote]);

  // Subject lookup helper
  const subjectOptions = useMemo(() => {
    const filtered = yearFilter === 'all' ? subjects : subjects.filter((s) => s.year === yearFilter);
    return filtered;
  }, [subjects, yearFilter]);

  const getSubjectByKey = (key: string) => {
    if (key === 'GENERAL') return { code: 'GENERAL', name: 'General / Otros Apuntes' };
    return subjects.find((s) => s.code === key || s.name === key) || { code: key, name: key };
  };

  // Count notes per subject
  const noteCountBySubject = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      const key = n.subjectCode || n.subjectName || 'GENERAL';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [notes]);

  // Available topics for the currently selected subject (or editor modal subject)
  const getTopicsForSubject = (subjectKey: string): string[] => {
    if (!subjectKey || subjectKey === 'ALL') {
      const all = new Set<string>();
      Object.values(state.noteTopicsBySubject || {}).forEach((arr) => arr.forEach((t) => all.add(t)));
      notes.forEach((n) => all.add(n.topic || 'General'));
      return Array.from(all).sort((a, b) => a.localeCompare(b, 'es'));
    }
    const savedTopics = state.noteTopicsBySubject?.[subjectKey] || [];
    const fromNotes = notes
      .filter((n) => n.subjectCode === subjectKey || n.subjectName === subjectKey)
      .map((n) => n.topic || 'General');
    const subj = subjects.find((s) => s.code === subjectKey);
    const officialTopics = Array.isArray(subj?.topics) ? subj.topics : [];
    const merged = Array.from(new Set(['General', ...savedTopics, ...fromNotes, ...officialTopics]));
    return merged;
  };

  const activeSubjectTopics = useMemo(
    () => (selectedSubjectKey === 'ALL' ? [] : getTopicsForSubject(selectedSubjectKey)),
    [selectedSubjectKey, state.noteTopicsBySubject, notes, subjects]
  );

  // Filtered notes
  const filteredNotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return notes.filter((note) => {
      if (selectedSubjectKey !== 'ALL') {
        const matchesSubj =
          note.subjectCode === selectedSubjectKey || note.subjectName === selectedSubjectKey;
        if (!matchesSubj) return false;
      } else if (yearFilter !== 'all') {
        const subj = subjects.find((s) => s.code === note.subjectCode);
        if (subj && subj.year !== yearFilter) return false;
      }

      if (selectedTopic !== 'ALL' && (note.topic || 'General') !== selectedTopic) {
        return false;
      }
      if (selectedCategory !== 'ALL' && note.category !== selectedCategory) {
        return false;
      }

      if (q) {
        const haystack = [
          note.title,
          note.subjectName,
          note.topic,
          note.category,
          note.content,
          note.fileName || '',
          ...(note.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [notes, selectedSubjectKey, selectedTopic, selectedCategory, searchTerm, yearFilter, subjects]);

  const openCreateTextNote = () => {
    const defaultSubj = selectedSubjectKey !== 'ALL' ? selectedSubjectKey : subjects[0]?.code || 'GENERAL';
    const defaultTopic = selectedTopic !== 'ALL' ? selectedTopic : 'General';
    setEditorModal({
      mode: 'create',
      title: '',
      subjectKey: defaultSubj,
      topic: defaultTopic,
      customTopic: '',
      category: 'Apuntes de clase',
      content: '',
      tagsText: '',
      pendingFile: null,
    });
  };

  const openEditNote = (note: StudentNote) => {
    setEditorModal({
      mode: 'edit',
      noteId: note.id,
      title: note.title,
      subjectKey: note.subjectCode || 'GENERAL',
      topic: note.topic || 'General',
      customTopic: '',
      category: note.category,
      content: note.content,
      tagsText: (note.tags || []).join(', '),
      pendingFile: null,
      existingFileName: note.fileName,
      existingFileMimeType: note.fileMimeType,
      existingFileSize: note.fileSize,
      hasExistingAttachment: note.hasAttachment,
    });
  };

  // Handle single or multiple file uploads directly
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    // If single file, open editor modal pre-filled so Julia can verify Subject/Topic/Title
    if (files.length === 1) {
      const file = files[0];
      const mime = inferMimeType(file.name, file.type);
      const { text } = await extractTextFromFile(file);
      const baseTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      const defaultSubj = selectedSubjectKey !== 'ALL' ? selectedSubjectKey : subjects[0]?.code || 'GENERAL';
      const defaultTopic = selectedTopic !== 'ALL' ? selectedTopic : 'General';
      const inferredCategory: NoteCategory =
        mime === 'application/pdf'
          ? 'Diapositivas / PDF'
          : mime.startsWith('image/')
          ? 'Esquema'
          : 'Apuntes de clase';

      setEditorModal({
        mode: 'create',
        title: baseTitle,
        subjectKey: defaultSubj,
        topic: defaultTopic,
        customTopic: '',
        category: inferredCategory,
        content: text,
        tagsText: '',
        pendingFile: file,
        existingFileName: file.name,
        existingFileMimeType: mime,
        existingFileSize: file.size,
      });
      return;
    }

    // Multiple files: save batch straight into the currently selected Subject & Topic
    const defaultSubjKey = selectedSubjectKey !== 'ALL' ? selectedSubjectKey : subjects[0]?.code || 'GENERAL';
    const subj = getSubjectByKey(defaultSubjKey);
    const defaultTopic = selectedTopic !== 'ALL' ? selectedTopic : 'General';

    let savedCount = 0;
    for (const file of files) {
      const mime = inferMimeType(file.name, file.type);
      const { text } = await extractTextFromFile(file);
      const baseTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      const noteId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      try {
        await saveNoteAttachment(noteId, file, file.name, mime);
        addStudentNote({
          id: noteId,
          title: baseTitle,
          subjectCode: subj.code,
          subjectName: subj.name,
          topic: defaultTopic,
          category: mime === 'application/pdf' ? 'Diapositivas / PDF' : 'Apuntes de clase',
          content: text,
          fileName: file.name,
          fileMimeType: mime,
          fileSize: file.size,
          hasAttachment: true,
          tags: [],
        });
        savedCount++;
      } catch {
        // continue with next
      }
    }

    setStatusBanner({
      type: savedCount > 0 ? 'success' : 'error',
      message:
        savedCount > 0
          ? `Se han subido ${savedCount} apuntes en ${subj.name} (${defaultTopic}). Puedes editarlos o enviarlos a Academia & Exámenes.`
          : 'No se pudieron guardar los archivos seleccionados.',
    });
  };

  const handleSaveEditorModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorModal) return;

    const cleanTitle = editorModal.title.trim() || editorModal.existingFileName || 'Apuntes sin título';
    const finalTopic = (editorModal.customTopic.trim() || editorModal.topic || 'General').trim();
    const subj = getSubjectByKey(editorModal.subjectKey);
    const tags = editorModal.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editorModal.mode === 'create') {
      const noteId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      let hasAttachment = false;
      let fileName = editorModal.existingFileName;
      let fileMimeType = editorModal.existingFileMimeType;
      let fileSize = editorModal.existingFileSize;

      if (editorModal.pendingFile) {
        const mime = inferMimeType(editorModal.pendingFile.name, editorModal.pendingFile.type);
        await saveNoteAttachment(noteId, editorModal.pendingFile, editorModal.pendingFile.name, mime);
        hasAttachment = true;
        fileName = editorModal.pendingFile.name;
        fileMimeType = mime;
        fileSize = editorModal.pendingFile.size;
      }

      const created = addStudentNote({
        id: noteId,
        title: cleanTitle,
        subjectCode: subj.code,
        subjectName: subj.name,
        topic: finalTopic,
        category: editorModal.category,
        content: editorModal.content,
        fileName,
        fileMimeType,
        fileSize,
        hasAttachment,
        tags,
      });

      setEditorModal(null);
      setPreviewNote(created);
      setStatusBanner({
        type: 'success',
        message: `Apunte "${cleanTitle}" guardado en ${subj.name} → ${finalTopic}.`,
      });
    } else if (editorModal.noteId) {
      let hasAttachment = editorModal.hasExistingAttachment;
      let fileName = editorModal.existingFileName;
      let fileMimeType = editorModal.existingFileMimeType;
      let fileSize = editorModal.existingFileSize;

      if (editorModal.pendingFile) {
        const mime = inferMimeType(editorModal.pendingFile.name, editorModal.pendingFile.type);
        await saveNoteAttachment(editorModal.noteId, editorModal.pendingFile, editorModal.pendingFile.name, mime);
        hasAttachment = true;
        fileName = editorModal.pendingFile.name;
        fileMimeType = mime;
        fileSize = editorModal.pendingFile.size;
      }

      updateStudentNote(editorModal.noteId, {
        title: cleanTitle,
        subjectCode: subj.code,
        subjectName: subj.name,
        topic: finalTopic,
        category: editorModal.category,
        content: editorModal.content,
        fileName,
        fileMimeType,
        fileSize,
        hasAttachment,
        tags,
      });

      if (previewNote?.id === editorModal.noteId) {
        setPreviewNote({
          ...previewNote,
          title: cleanTitle,
          subjectCode: subj.code,
          subjectName: subj.name,
          topic: finalTopic,
          category: editorModal.category,
          content: editorModal.content,
          fileName,
          fileMimeType,
          fileSize,
          hasAttachment,
          tags,
          updatedAt: new Date().toISOString(),
        });
      }

      setEditorModal(null);
      setStatusBanner({
        type: 'success',
        message: `Apunte "${cleanTitle}" actualizado correctamente.`,
      });
    }
  };

  // Replace or attach file inside modal
  const handleModalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorModal) return;
    const mime = inferMimeType(file.name, file.type);
    const { text } = await extractTextFromFile(file);
    setEditorModal({
      ...editorModal,
      pendingFile: file,
      existingFileName: file.name,
      existingFileMimeType: mime,
      existingFileSize: file.size,
      title: editorModal.title.trim() ? editorModal.title : file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '),
      content: editorModal.content.trim() ? editorModal.content : text,
    });
    e.target.value = '';
  };

  // Extract editable Markdown text from PDF/Image via Gemini AI
  const handleExtractTextWithAI = async (note: StudentNote) => {
    if (!note.hasAttachment) return;
    setIsExtractingText(true);
    setStatusBanner(null);
    try {
      const att = await getNoteAttachment(note.id);
      if (!att?.blob) {
        setStatusBanner({ type: 'error', message: 'No se encontró el archivo adjunto en el almacenamiento local.' });
        return;
      }
      const mime = att.mimeType || note.fileMimeType || '';
      if (!isGeminiMultimodalMime(mime)) {
        setStatusBanner({
          type: 'info',
          message: 'La extracción con IA está pensada para archivos PDF e imágenes (.png, .jpg, .webp).',
        });
        return;
      }

      const fileBase64 = await blobToBase64(att.blob);
      const res = await fetch('/api/ai/analyze-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'extractText',
          fileBase64,
          fileMimeType: mime,
          fileName: att.fileName,
          subject: note.subjectName,
          topic: note.topic,
          title: note.title,
          text: note.content,
        }),
      });
      const data = await res.json();
      if (data.success && data.extractedText) {
        updateStudentNote(note.id, { content: data.extractedText });
        setPreviewNote((prev) =>
          prev && prev.id === note.id
            ? { ...prev, content: data.extractedText, updatedAt: new Date().toISOString() }
            : prev
        );
        setStatusBanner({
          type: 'success',
          message: '¡Texto extraído con IA! Ya puedes leerlo, editarlo o descargarlo en Markdown.',
        });
      } else {
        setStatusBanner({ type: 'error', message: data.error || 'No se pudo extraer el texto del archivo.' });
      }
    } catch {
      setStatusBanner({ type: 'error', message: 'Error de conexión al analizar el archivo con IA.' });
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleAddTopicForSelectedSubject = () => {
    if (selectedSubjectKey === 'ALL' || !newTopicName.trim()) return;
    addNoteTopic(selectedSubjectKey, newTopicName.trim());
    setSelectedTopic(newTopicName.trim());
    setNewTopicName('');
    setShowNewTopicInput(false);
  };

  const handleDownloadNote = async (note: StudentNote, mode: 'original' | 'markdown') => {
    try {
      await downloadStudentNote(note, mode);
    } catch {
      setStatusBanner({ type: 'error', message: 'No se pudo descargar el apunte.' });
    }
  };

  const handleDeleteNoteConfirmed = (id: string) => {
    deleteStudentNote(id);
    if (previewNote?.id === id) setPreviewNote(null);
    setConfirmDeleteNoteId(null);
    setStatusBanner({ type: 'info', message: 'Apunte eliminado correctamente.' });
  };

  const getFileBadge = (note: StudentNote) => {
    const mime = note.fileMimeType || '';
    if (mime === 'application/pdf') return { label: 'PDF', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (mime.startsWith('image/')) return { label: 'Imagen', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (note.fileName?.toLowerCase().endsWith('.docx')) return { label: 'Word', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (note.hasAttachment) return { label: 'Archivo', color: 'bg-stone-100 text-stone-700 border-stone-200' };
    return { label: 'Texto / MD', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hidden multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,.markdown,.csv,.json,.docx,.png,.jpg,.jpeg,.webp"
        onChange={(e) => {
          void handleFilesSelected(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1e3d2c] via-[#2d553e] to-[#12261b] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
              <NotebookPen className="w-4 h-4 text-emerald-300" />
              <span>BIBLIOTECA PERSONAL DE JULIA · APUNTES POR ASIGNATURA Y TEMA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mis Apuntes de Enfermería
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Sube tus PDFs, documentos Word, fotos de pizarra o apuntes en texto. Organízalos por asignatura y tema específico, edítalos, descárgalos y envíalos a Academia & Exámenes para que la IA cree resúmenes, esquemas y tests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-[#0f241a] text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Apuntes</span>
            </button>
            <button
              onClick={openCreateTextNote}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Escribir Apunte</span>
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
          <div className="bg-white/10 rounded-2xl px-4 py-2.5">
            <span className="text-emerald-200/80 block text-[10px] font-bold uppercase">Total Apuntes</span>
            <strong className="text-lg font-black">{notes.length}</strong>
          </div>
          <div className="bg-white/10 rounded-2xl px-4 py-2.5">
            <span className="text-emerald-200/80 block text-[10px] font-bold uppercase">Asignaturas con apuntes</span>
            <strong className="text-lg font-black">{Object.keys(noteCountBySubject).length}</strong>
          </div>
          <div className="bg-white/10 rounded-2xl px-4 py-2.5">
            <span className="text-emerald-200/80 block text-[10px] font-bold uppercase">Temas organizados</span>
            <strong className="text-lg font-black">
              {Array.from(new Set(notes.map((n) => `${n.subjectCode}:${n.topic}`))).length}
            </strong>
          </div>
          <div className="bg-white/10 rounded-2xl px-4 py-2.5">
            <span className="text-emerald-200/80 block text-[10px] font-bold uppercase">Con archivo adjunto</span>
            <strong className="text-lg font-black">{notes.filter((n) => n.hasAttachment).length}</strong>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {statusBanner && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-bold ${
            statusBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusBanner.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusBanner.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
          <button onClick={() => setStatusBanner(null)} className="p-1 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-3xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
          isDragging
            ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
            : 'border-stone-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#365e45] flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold text-stone-800">
              Arrastra aquí tus apuntes o haz clic para subir archivos
            </p>
            <p className="text-[11px] text-stone-500">
              Admite PDF, Word (.docx), texto (.txt, .md) e imágenes de apuntes o pizarra (.png, .jpg, .webp).
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Left Subjects/Topics Sidebar + Right Notes Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subjects & Topics Hierarchy */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#365e45]" />
                <span>Asignaturas</span>
              </h2>
              <div className="flex items-center gap-1">
                {(['all', 1, 2, 3, 4] as const).map((yr) => (
                  <button
                    key={String(yr)}
                    onClick={() => setYearFilter(yr)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition ${
                      yearFilter === yr
                        ? 'bg-[#365e45] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {yr === 'all' ? 'Todos' : `${yr}.º`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedSubjectKey('ALL');
                  setSelectedTopic('ALL');
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                  selectedSubjectKey === 'ALL'
                    ? 'bg-[#365e45] text-white'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Todas las asignaturas</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/10">{notes.length}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSubjectKey('GENERAL');
                  setSelectedTopic('ALL');
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                  selectedSubjectKey === 'GENERAL'
                    ? 'bg-[#365e45] text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">General / Otros Apuntes</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-200/70 text-stone-700">
                  {noteCountBySubject['GENERAL'] || 0}
                </span>
              </button>

              {subjectOptions.map((subj) => {
                const count = noteCountBySubject[subj.code] || 0;
                const isSelected = selectedSubjectKey === subj.code;
                return (
                  <button
                    key={subj.code}
                    onClick={() => {
                      setSelectedSubjectKey(subj.code);
                      setSelectedTopic('ALL');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 text-left transition ${
                      isSelected
                        ? 'bg-[#365e45] text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">
                      <span className="opacity-65 mr-1">{subj.year}.º</span>
                      {subj.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : count > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics Manager inside Selected Subject */}
          {selectedSubjectKey !== 'ALL' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#365e45]" />
                    <span>Temas / Categorías</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
                    {getSubjectByKey(selectedSubjectKey).name}
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTopicInput((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1 transition"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Nuevo tema</span>
                </button>
              </div>

              {showNewTopicInput && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopicForSelectedSubject();
                      }
                    }}
                    placeholder="Ej. Tema 3: Sistema Nervioso"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                  />
                  <button
                    onClick={handleAddTopicForSelectedSubject}
                    className="px-3 py-1.5 rounded-xl bg-[#365e45] text-white text-xs font-bold"
                  >
                    Añadir
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedTopic('ALL')}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                    selectedTopic === 'ALL'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>Todos los temas</span>
                  <span className="text-[10px] font-extrabold">
                    {notes.filter((n) => n.subjectCode === selectedSubjectKey || n.subjectName === selectedSubjectKey).length}
                  </span>
                </button>

                {activeSubjectTopics.map((topicName) => {
                  const topicCount = notes.filter(
                    (n) =>
                      (n.subjectCode === selectedSubjectKey || n.subjectName === selectedSubjectKey) &&
                      (n.topic || 'General') === topicName
                  ).length;
                  const isActiveTopic = selectedTopic === topicName;

                  if (renamingTopic?.oldName === topicName) {
                    return (
                      <div key={topicName} className="flex items-center gap-1.5 p-1 bg-stone-50 rounded-xl">
                        <input
                          type="text"
                          value={renamingTopic.newName}
                          onChange={(e) => setRenamingTopic({ ...renamingTopic, newName: e.target.value })}
                          className="flex-1 px-2 py-1 rounded-lg border border-stone-300 text-xs"
                        />
                        <button
                          onClick={() => {
                            renameNoteTopic(selectedSubjectKey, renamingTopic.oldName, renamingTopic.newName);
                            if (selectedTopic === renamingTopic.oldName) setSelectedTopic(renamingTopic.newName.trim());
                            setRenamingTopic(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#365e45] text-white text-[10px] font-bold"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setRenamingTopic(null)}
                          className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-[10px] font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={topicName}
                      className={`group flex items-center justify-between gap-1 px-3 py-2 rounded-xl text-xs transition ${
                        isActiveTopic
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold'
                          : 'text-stone-700 hover:bg-stone-100 font-semibold'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedTopic(topicName)}
                        className="flex-1 text-left truncate"
                      >
                        {topicName}
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        {topicName !== 'General' && (
                          <>
                            <button
                              onClick={() => setRenamingTopic({ oldName: topicName, newName: topicName })}
                              className="p-1 text-stone-400 hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition"
                              title="Renombrar tema"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            {confirmDeleteTopic === topicName ? (
                              <button
                                onClick={() => {
                                  deleteNoteTopic(selectedSubjectKey, topicName);
                                  if (selectedTopic === topicName) setSelectedTopic('ALL');
                                  setConfirmDeleteTopic(null);
                                }}
                                className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Quitar
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteTopic(topicName)}
                                className="p-1 text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition"
                                title="Eliminar tema (mueve sus apuntes a General)"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}
                        <span className="px-1.5 py-0.5 rounded-full bg-white/80 text-[10px] text-stone-600 font-bold">
                          {topicCount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Search, Category Filter & Notes List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título, tema, etiqueta o contenido de tus apuntes..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="ALL">Todas las categorías</option>
                {NOTE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#365e45] flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-stone-900">
                  {notes.length === 0
                    ? 'Todavía no has subido apuntes'
                    : 'No hay apuntes que coincidan con este filtro'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {notes.length === 0
                    ? 'Sube tus PDFs, documentos Word, fotos de apuntes o escríbelos directamente aquí. Luego podrás importarlos en Academia & Exámenes para estudiar con IA.'
                    : 'Prueba a cambiar el filtro de asignatura, tema o búsqueda, o sube un nuevo apunte en esta sección.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#365e45] hover:bg-[#2a4c37] text-white text-xs font-extrabold flex items-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir archivo</span>
                </button>
                <button
                  onClick={openCreateTextNote}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Escribir apunte</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => {
                const badge = getFileBadge(note);
                const isConfirmingDelete = confirmDeleteNoteId === note.id;
                return (
                  <div
                    key={note.id}
                    className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            {note.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold">
                          {note.updatedAt.slice(0, 10)}
                        </span>
                      </div>

                      {/* Title, Subject & Topic */}
                      <div>
                        <h3
                          onClick={() => setPreviewNote(note)}
                          className="text-base font-extrabold text-stone-900 hover:text-[#365e45] cursor-pointer leading-snug"
                        >
                          {note.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
                          <span className="font-bold text-[#365e45] bg-emerald-50 px-2 py-0.5 rounded-lg">
                            {note.subjectName}
                          </span>
                          <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg">
                            {note.topic || 'General'}
                          </span>
                        </div>
                      </div>

                      {/* Content excerpt / file info */}
                      {note.content?.trim() ? (
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {note.content}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-400 italic">
                          Archivo adjunto: {note.fileName || 'Documento'} {note.fileSize ? `(${formatFileSize(note.fileSize)})` : ''}
                        </p>
                      )}

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      {onSendNoteToAcademy && (
                        <button
                          onClick={() => onSendNoteToAcademy(note.id)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-extrabold transition flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Estudiar con IA en Academia & Exámenes</span>
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-1 text-xs">
                        <button
                          onClick={() => setPreviewNote(note)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center gap-1 transition"
                          title="Ver apunte"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        <button
                          onClick={() => openEditNote(note)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition"
                          title="Modificar apunte"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => void handleDownloadNote(note, 'original')}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-blue-50 text-stone-700 hover:text-blue-800 font-bold flex items-center gap-1 transition"
                          title="Descargar apunte"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </button>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteNoteConfirmed(note.id)}
                              className="px-2 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-[11px]"
                            >
                              Sí, borrar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteNoteId(null)}
                              className="px-2 py-1.5 rounded-xl bg-stone-200 text-stone-700 font-bold text-[11px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteNoteId(note.id)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Eliminar apunte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewNote && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-start justify-between gap-4 bg-[#fafbfa]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900">
                    {previewNote.subjectName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                    {previewNote.topic || 'General'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-200 text-stone-700">
                    {previewNote.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-stone-900 truncate">
                  {previewNote.title}
                </h2>
              </div>

              <button
                onClick={() => setPreviewNote(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Attachment viewer if PDF or Image */}
              {previewNote.hasAttachment && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      {previewAttachmentMime.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                      ) : (
                        <File className="w-4 h-4 text-rose-600" />
                      )}
                      <span>
                        {previewNote.fileName || 'Archivo adjunto'}{' '}
                        {previewNote.fileSize ? `(${formatFileSize(previewNote.fileSize)})` : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isGeminiMultimodalMime(previewAttachmentMime || previewNote.fileMimeType) && (
                        <button
                          onClick={() => void handleExtractTextWithAI(previewNote)}
                          disabled={isExtractingText}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition"
                        >
                          {isExtractingText ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                              <span>Extrayendo texto...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Transcribir a texto editable con IA</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => void handleDownloadNote(previewNote, 'original')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar original</span>
                      </button>
                    </div>
                  </div>

                  {previewAttachmentUrl && previewAttachmentMime.startsWith('image/') && (
                    <img
                      src={previewAttachmentUrl}
                      alt={previewNote.title}
                      className="max-h-96 mx-auto rounded-xl border border-stone-200 object-contain bg-white"
                    />
                  )}

                  {previewAttachmentUrl && previewAttachmentMime === 'application/pdf' && (
                    <iframe
                      src={previewAttachmentUrl}
                      title={previewNote.title}
                      className="w-full h-96 rounded-xl border border-stone-200 bg-white"
                    />
                  )}
                </div>
              )}

              {/* Markdown / Text Content */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#365e45]" />
                    <span>Contenido en texto / Markdown</span>
                  </span>
                  <button
                    onClick={() => void handleDownloadNote(previewNote, 'markdown')}
                    className="text-xs font-bold text-[#365e45] hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .md</span>
                  </button>
                </div>
                <SimpleMarkdown content={previewNote.content} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#fafbfa] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = previewNote;
                    setPreviewNote(null);
                    openEditNote(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modificar</span>
                </button>
                <button
                  onClick={() => void handleDownloadNote(previewNote, 'original')}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>

              {onSendNoteToAcademy && (
                <button
                  onClick={() => {
                    const id = previewNote.id;
                    setPreviewNote(null);
                    onSendNoteToAcademy(id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#365e45] hover:bg-[#2a4c37] text-white text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Importar en Academia & Exámenes (IA)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {editorModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900">
                {editorModal.mode === 'create' ? 'Subir / Crear Apunte' : 'Modificar Apunte'}
              </h3>
              <button
                onClick={() => setEditorModal(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => void handleSaveEditorModal(e)} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título del apunte *</label>
                <input
                  type="text"
                  required
                  value={editorModal.title}
                  onChange={(e) => setEditorModal({ ...editorModal, title: e.target.value })}
                  placeholder="Ej. Tema 4 - Fisiología Cardiovascular"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Asignatura</label>
                  <select
                    value={editorModal.subjectKey}
                    onChange={(e) =>
                      setEditorModal({
                        ...editorModal,
                        subjectKey: e.target.value,
                        topic: 'General',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                  >
                    <option value="GENERAL">General / Otros Apuntes</option>
                    {subjects.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.year}.º · {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Categoría</label>
                  <select
                    value={editorModal.category}
                    onChange={(e) =>
                      setEditorModal({ ...editorModal, category: e.target.value as NoteCategory })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                  >
                    {NOTE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tema existente</label>
                  <select
                    value={editorModal.topic}
                    onChange={(e) => setEditorModal({ ...editorModal, topic: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                  >
                    {getTopicsForSubject(editorModal.subjectKey).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    O crear tema nuevo en esta asignatura
                  </label>
                  <input
                    type="text"
                    value={editorModal.customTopic}
                    onChange={(e) => setEditorModal({ ...editorModal, customTopic: e.target.value })}
                    placeholder="Ej. Seminario ECG básico"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                  />
                </div>
              </div>

              {/* Attachment upload / replace */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-stone-700 block">Archivo adjunto (opcional)</span>
                  <span className="text-[11px] text-stone-500 block truncate">
                    {editorModal.existingFileName
                      ? `${editorModal.existingFileName} ${editorModal.existingFileSize ? `(${formatFileSize(editorModal.existingFileSize)})` : ''}`
                      : 'Ningún archivo adjunto (puedes adjuntar PDF, Word, imagen, TXT o MD)'}
                  </span>
                </div>
                <label className="px-3 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editorModal.existingFileName ? 'Cambiar archivo' : 'Adjuntar archivo'}</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,.markdown,.csv,.json,.docx,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => void handleModalFileChange(e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Contenido en texto / Markdown (editable)
                </label>
                <textarea
                  rows={8}
                  value={editorModal.content}
                  onChange={(e) => setEditorModal({ ...editorModal, content: e.target.value })}
                  placeholder="Escribe, pega o edita tus apuntes aquí... (Si subiste un PDF o imagen, puedes dejar esto vacío o transcribirlo luego con un clic usando la IA)."
                  className="w-full p-3.5 rounded-2xl border border-stone-200 text-stone-900 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Etiquetas (separadas por comas, opcional)
                </label>
                <input
                  type="text"
                  value={editorModal.tagsText}
                  onChange={(e) => setEditorModal({ ...editorModal, tagsText: e.target.value })}
                  placeholder="parcial 1, importante, esquemas..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#365e45]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditorModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#365e45] hover:bg-[#2a4c37] text-white font-extrabold transition shadow-xs"
                >
                  {editorModal.mode === 'create' ? 'Guardar Apunte' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
