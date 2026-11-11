import { cleanClassTranscript } from '../../server/aiServices.js';

export const config = { maxDuration: 30 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'Método no permitido.' });
    return;
  }
  const result = await cleanClassTranscript(req.body || {});
  res.status(result.success ? 200 : 400).json(result);
}
