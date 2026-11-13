import { analyzeNoteWithAI } from '../../server/aiServices.js';

export const config = { maxDuration: 60 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'Método no permitido.' });
    return;
  }
  const result = await analyzeNoteWithAI(req.body || {});
  res.status(result.success ? 200 : 400).json(result);
}
