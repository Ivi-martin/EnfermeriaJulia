import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { handleTutorRequest, geminiConfigured } from './server/tutor.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// API Route for Tutor IA (la lógica vive en server/tutor.ts)
app.post('/api/ai/tutor', async (req, res) => {
  const { status, body } = await handleTutorRequest(req.body);
  res.status(status).json(body);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Campus Enfermería Toledo 2.0',
    geminiConfigured: geminiConfigured(),
  });
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
