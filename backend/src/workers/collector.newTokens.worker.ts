import { httpGet } from '../utils/httpClient';
import { upsertChain, upsertToken, upsertPair } from '../modules/tokens/tokens.service';
import { logInfo, logError } from '../utils/logger';

function mapDexToChain(chainId: string | undefined): string {
  if (!chainId) return 'UNKNOWN';
  return chainId.toUpperCase();
}

export async function runNewTokensCollector() {
  try {
    logInfo('Running Dexscreener new tokens collector');
    const data = await httpGet<any>('https://api.dexscreener.com/latest/dex/pairs');
    const pairs = data.pairs || [];

    for (const p of pairs) {
      if (!p.isNew) continue;

      const chainShort = mapDexToChain(p.chainId);
      const chainId = await upsertChain(chainShort);

      const tokenId = await upsertToken({
        chainId,
        address: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol
      });

      await upsertPair({
        tokenId,
        dexName: p.dexId,
        pairAddress: p.pairAddress,
        liquidityUsd: p.liquidity?.usd ?? 0,
        createdAt: p.pairCreatedAt ? new Date(p.pairCreatedAt) : new Date()
      });
    }

    logInfo('Dexscreener new tokens collector done');
  } catch (err: any) {
    logError('Error in new tokens collector', err);
  }
}

if (require.main === module) {
  runNewTokensCollector().then(() => process.exit(0));
}
