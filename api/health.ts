import { geminiConfigured } from '../server/tutor.js';

export default function handler(_req: any, res: any) {
  res.status(200).json({ status: 'ok', geminiConfigured: geminiConfigured() });
}
