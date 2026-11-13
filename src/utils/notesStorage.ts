import mammoth from 'mammoth';
import { StudentNote } from '../types';

const DB_NAME = 'CampusToledoNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'attachments';

export interface StoredNoteAttachment {
  noteId: string;
  fileName: string;
  mimeType: string;
  size: number;
  blob: Blob;
  updatedAt: string;
}

function openNotesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no está disponible en este navegador.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'noteId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Error abriendo IndexedDB.'));
  });
}

export async function saveNoteAttachment(
  noteId: string,
  blob: Blob,
  fileName: string,
  mimeType: string
): Promise<void> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record: StoredNoteAttachment = {
      noteId,
      fileName,
      mimeType: mimeType || blob.type || 'application/octet-stream',
      size: blob.size,
      blob,
      updatedAt: new Date().toISOString(),
    };
    store.put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('No se pudo guardar el archivo adjunto.'));
    };
  });
}

export async function getNoteAttachment(noteId: string): Promise<StoredNoteAttachment | null> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(noteId);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as StoredNoteAttachment | undefined) ?? null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error || new Error('No se pudo leer el archivo adjunto.'));
    };
  });
}

export async function deleteNoteAttachment(noteId: string): Promise<void> {
  try {
    const db = await openNotesDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(noteId);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Ignore if IndexedDB is unavailable
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error('Error leyendo archivo en base64.'));
    reader.readAsDataURL(blob);
  });
}

export function inferMimeType(fileName: string, providedType?: string): string {
  if (providedType && providedType !== 'application/octet-stream') return providedType;
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'text/markdown';
  if (lower.endsWith('.txt')) return 'text/plain';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.json')) return 'application/json';
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return providedType || 'application/octet-stream';
}

export function isGeminiMultimodalMime(mimeType?: string): boolean {
  if (!mimeType) return false;
  return (
    mimeType === 'application/pdf' ||
    mimeType === 'image/png' ||
    mimeType === 'image/jpeg' ||
    mimeType === 'image/webp'
  );
}

export async function extractTextFromFile(file: File): Promise<{ text: string; extractedAutomatically: boolean }> {
  const lower = file.name.toLowerCase();
  const mime = inferMimeType(file.name, file.type);

  if (
    mime.startsWith('text/') ||
    mime === 'application/json' ||
    lower.endsWith('.txt') ||
    lower.endsWith('.md') ||
    lower.endsWith('.markdown') ||
    lower.endsWith('.csv') ||
    lower.endsWith('.json')
  ) {
    const text = await file.text();
    return { text: text.trim(), extractedAutomatically: true };
  }

  if (
    lower.endsWith('.docx') ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return { text: (result.value || '').trim(), extractedAutomatically: true };
    } catch {
      return { text: '', extractedAutomatically: false };
    }
  }

  return { text: '', extractedAutomatically: false };
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadStudentNote(
  note: StudentNote,
  mode: 'original' | 'markdown' = 'original'
): Promise<void> {
  const safeBaseName = (note.title || 'apuntes')
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ _-]/g, '')
    .trim()
    .replace(/\s+/g, '_') || 'apuntes';

  if (mode === 'original' && note.hasAttachment) {
    const attachment = await getNoteAttachment(note.id);
    if (attachment?.blob) {
      triggerBlobDownload(attachment.blob, attachment.fileName || note.fileName || safeBaseName);
      return;
    }
  }

  const headerLines = [
    `# ${note.title}`,
    `**Asignatura:** ${note.subjectName}${note.subjectCode ? ` (${note.subjectCode})` : ''}`,
    `**Tema / Categoría:** ${note.topic || 'General'} · ${note.category}`,
    `**Actualizado:** ${note.updatedAt.slice(0, 10)}`,
    note.tags && note.tags.length > 0 ? `**Etiquetas:** ${note.tags.join(', ')}` : '',
    '',
    '---',
    '',
    note.content || '(Sin contenido de texto)',
  ].filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''));

  const blob = new Blob([headerLines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  triggerBlobDownload(blob, `${safeBaseName}.md`);
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
