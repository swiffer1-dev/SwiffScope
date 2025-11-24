import { db } from '../../db';

export async function upsertChain(shortName: string, name?: string) {
  const res = await db.query(
    `
    INSERT INTO chains (short_name, name)
    VALUES ($1, $2)
    ON CONFLICT (short_name)
    DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `,
    [shortName, name || shortName]
  );
  return res.rows[0].id as number;
}

export async function upsertToken(params: {
  chainId: number;
  address: string;
  name?: string;
  symbol?: string;
}) {
  const res = await db.query(
    `
    INSERT INTO tokens (chain_id, address, name, symbol, first_seen_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (chain_id, address)
    DO UPDATE SET name = EXCLUDED.name, symbol = EXCLUDED.symbol
    RETURNING id
  `,
    [params.chainId, params.address, params.name, params.symbol]
  );
  return res.rows[0].id as number;
}

export async function upsertPair(params: {
  tokenId: number;
  dexName: string;
  pairAddress: string;
  liquidityUsd: number;
  createdAt: Date;
}) {
  await db.query(
    `
    INSERT INTO token_pairs (
      token_id, dex_name, pair_address,
      liquidity_usd, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (pair_address)
    DO UPDATE SET liquidity_usd = EXCLUDED.liquidity_usd,
                  updated_at = NOW()
  `,
    [
      params.tokenId,
      params.dexName,
      params.pairAddress,
      params.liquidityUsd,
      params.createdAt
    ]
  );
}

export async function listTokensWithScores(limit = 50) {
  const res = await db.query(
    `
    SELECT
      t.id,
      t.name,
      t.symbol,
      c.short_name as chain,
      EXTRACT(EPOCH FROM (NOW() - t.first_seen_at)) / 60 as age_minutes,
      r.risk_score,
      m.momentum_score,
      tp.liquidity_usd
    FROM tokens t
    JOIN chains c ON c.id = t.chain_id
    LEFT JOIN LATERAL (
      SELECT * FROM token_risk_assessments r2
      WHERE r2.token_id = t.id
      ORDER BY r2.calculated_at DESC LIMIT 1
    ) r ON TRUE
    LEFT JOIN LATERAL (
      SELECT * FROM token_momentum_assessments m2
      WHERE m2.token_id = t.id
      ORDER BY m2.calculated_at DESC LIMIT 1
    ) m ON TRUE
    LEFT JOIN LATERAL (
      SELECT * FROM token_pairs tp2
      WHERE tp2.token_id = t.id
      ORDER BY tp2.updated_at DESC LIMIT 1
    ) tp ON TRUE
    ORDER BY t.first_seen_at DESC
    LIMIT $1
  `,
    [limit]
  );

  return res.rows;
}

export async function getTokenById(id: number) {
  const res = await db.query(
    `
    SELECT
      t.*,
      c.short_name as chain
    FROM tokens t
    JOIN chains c ON c.id = t.chain_id
    WHERE t.id = $1
  `,
    [id]
  );
  return res.rows[0] || null;
}
