import { handleTutorRequest } from '../../server/tutor.js';

export const config = { maxDuration: 30 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }
  const { status, body } = await handleTutorRequest(req.body);
  res.status(status).json(body);
}
