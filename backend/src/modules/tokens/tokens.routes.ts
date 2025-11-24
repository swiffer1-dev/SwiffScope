import { Router } from 'express';
import { listTokensWithScores, getTokenById } from './tokens.service';

export const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await listTokensWithScores(100);
    res.json({ tokens: rows });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const token = await getTokenById(id);
    if (!token) return res.status(404).json({ error: 'not_found' });
    res.json(token);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});
