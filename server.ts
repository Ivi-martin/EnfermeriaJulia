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

// Endpoint directo para forzar la descarga del parche .patch en cualquier navegador
const servePatch = (req: express.Request, res: express.Response) => {
  const filename = req.path.includes('v3') || req.path.includes('actualizacion-completa-julia')
    ? 'actualizacion-completa-julia.patch'
    : 'enfermeria-julia-v3.patch';
  const patchPath = path.resolve(process.cwd(), 'enfermeria-julia-v3.patch');
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(patchPath);
};

app.get('/enfermeria-julia-v3.patch', servePatch);
app.get('/enfermeria-julia-v2.patch', servePatch);
app.get('/actualizacion-completa-julia.patch', servePatch);
app.get('/descargar-parche', servePatch);
app.get('/descargar-parche-v3', servePatch);
app.get('/descargar-parche-v2', servePatch);
app.get('/parche', servePatch);
app.get('/api/download-patch', servePatch);
app.get('/actualizacion-completa-enfermeria-julia.patch', servePatch);

// Endpoint directo para ver y descargar la Guía de Usuario interactiva de Julia
const serveGuide = (req: express.Request, res: express.Response) => {
  const guidePath = path.resolve(process.cwd(), 'public', 'guia-usuario-julia.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(guidePath);
};

const downloadGuide = (req: express.Request, res: express.Response) => {
  const guidePath = path.resolve(process.cwd(), 'public', 'guia-usuario-julia.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="guia-usuario-julia.html"');
  res.sendFile(guidePath);
};

app.get('/guia', serveGuide);
app.get('/manual', serveGuide);
app.get('/guia-usuario', serveGuide);
app.get('/descargar-guia', downloadGuide);

// Endpoint directo para descargar todo el proyecto completo en un único archivo ZIP
const serveZip = (req: express.Request, res: express.Response) => {
  const zipPath = path.resolve(process.cwd(), 'public', 'enfermeria-julia-completa.zip');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="enfermeria-julia-completa.zip"');
  res.sendFile(zipPath);
};

app.get('/enfermeria-julia-completa.zip', serveZip);
app.get('/descargar-zip', serveZip);
app.get('/descargar-codigo-completo.zip', serveZip);



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
