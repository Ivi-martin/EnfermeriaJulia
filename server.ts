import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { handleTutorRequest, geminiConfigured } from './server/tutor.ts';
import {
  generateStudyMaterials,
  handleClinicalCaseStep,
  generateCitations,
  summarizeNursingNotes,
  cleanClassTranscript,
} from './server/aiServices.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// API Route for Tutor IA (la lógica vive en server/tutor.ts)
app.post('/api/ai/tutor', async (req, res) => {
  const { status, body } = await handleTutorRequest(req.body);
  res.status(status).json(body);
});

// Generador de tests y flashcards con IA
app.post('/api/ai/generate-study', async (req, res) => {
  const result = await generateStudyMaterials(req.body);
  res.json(result);
});

// Simulador de Casos Clínicos con IA
app.post('/api/ai/clinical-case', async (req, res) => {
  const result = await handleClinicalCaseStep(req.body);
  res.json(result);
});

// Generador de Citas Vancouver & APA 7
app.post('/api/ai/citations', async (req, res) => {
  const result = await generateCitations(req.body);
  res.json(result);
});

// Resumen de apuntes con IA
app.post('/api/ai/summarize', async (req, res) => {
  const result = await summarizeNursingNotes(req.body);
  res.json(result);
});

// Limpieza de transcripciones de clase
app.post('/api/ai/transcribe', async (req, res) => {
  const result = await cleanClassTranscript(req.body);
  res.json(result);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Campus Enfermería Toledo 2.0',
    geminiConfigured: geminiConfigured(),
  });
});

// Endpoint directo para descargar el parche .patch
app.get('/api/download-patch', (req, res) => {
  const patchPath = path.resolve(process.cwd(), 'actualizacion-completa-enfermeria-julia.patch');
  res.download(patchPath, 'actualizacion-completa-enfermeria-julia.patch');
});

// Mount Vite or static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Campus Enfermería Toledo 2.0] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
