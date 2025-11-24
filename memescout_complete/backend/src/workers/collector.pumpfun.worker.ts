import { httpGet } from '../utils/httpClient';
import { upsertChain, upsertToken } from '../modules/tokens/tokens.service';
import { logInfo, logError } from '../utils/logger';
import { db } from '../db';

export async function runPumpFunCollector() {
  try {
    logInfo('Running Pump.fun collector');
    const data = await httpGet<any[]>('https://api.pump.fun/coins/recent');
    const chainId = await upsertChain('SOL', 'Solana');

    for (const t of data || []) {
      const tokenId = await upsertToken({
        chainId,
        address: t.mint,
        name: t.name,
        symbol: t.symbol
      });

      await db.query(
        `
        UPDATE tokens
        SET pumpfun_id = $1
        WHERE id = $2
      `,
        [t.id, tokenId]
      );
    }

    logInfo('Pump.fun collector done');
  } catch (err: any) {
    logError('Error in pumpfun collector', err);
  }
}

if (require.main === module) {
  runPumpFunCollector().then(() => process.exit(0));
}
