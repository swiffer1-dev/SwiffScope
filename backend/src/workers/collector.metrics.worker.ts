import { httpGet } from '../utils/httpClient';
import { db } from '../db';
import { logInfo, logError } from '../utils/logger';

async function pollMetricsForActiveTokens() {
  const res = await db.query(
    `
    SELECT t.id, tp.pair_address, c.short_name as chain
    FROM tokens t
    JOIN chains c ON c.id = t.chain_id
    JOIN token_pairs tp ON tp.token_id = t.id
    WHERE t.is_active = TRUE
  `
  );

  for (const row of res.rows) {
    try {
      const url = `https://api.dexscreener.com/latest/dex/pairs/${row.chain.toLowerCase()}/${row.pair_address}`;
      const data = await httpGet<any>(url);
      const pair = data.pairs?.[0];
      if (!pair) continue;

      await db.query(
        `
        INSERT INTO token_metrics_snapshot (
          token_id, timestamp, price_usd, liquidity_usd,
          volume_5m_usd, buys_5m, sells_5m, holders_count,
          top_holder_pct, smart_wallet_buys, unique_buyers_5m
        ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          row.id,
          pair.priceUsd || 0,
          pair.liquidity?.usd ?? 0,
          pair.volume?.m5 ?? 0,
          pair.trades?.m5?.buys ?? 0,
          pair.trades?.m5?.sells ?? 0,
          0,
          0,
          0,
          0
        ]
      );
    } catch (err: any) {
      logError('Error polling metrics for token', { tokenId: row.id, err });
    }
  }
}

export async function runMetricsCollector() {
  try {
    logInfo('Running metrics collector');
    await pollMetricsForActiveTokens();
    logInfo('Metrics collector done');
  } catch (err: any) {
    logError('Error in metrics collector', err);
  }
}

if (require.main === module) {
  runMetricsCollector().then(() => process.exit(0));
}
