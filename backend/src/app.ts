import express from 'express';
import { json } from 'express';
import { router as tokensRouter } from './modules/tokens/tokens.routes';

export const app = express();
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/tokens', tokensRouter);
