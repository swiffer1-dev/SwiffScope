import { MomentumContext } from './types';

function ratio(a: number, b: number): number {
  if (b === 0) return a > 0 ? a : 0;
  return a / b;
}

function clampScore(val: number, minV: number, maxV: number): number {
  if (val <= minV) return 0;
  if (val >= maxV) return 100;
  return ((val - minV) / (maxV - minV)) * 100;
}

export function calcMomentumScore(ctx: MomentumContext): number {
  const priceChangePct =
    ctx.pricePrev === 0
      ? 0
      : ((ctx.priceNow - ctx.pricePrev) / ctx.pricePrev) * 100;

  const liqChangePct =
    ctx.liquidityPrev === 0
      ? 0
      : ((ctx.liquidityNow - ctx.liquidityPrev) / ctx.liquidityPrev) * 100;

  const buySellRatio = ratio(ctx.buys5m, ctx.sells5m + 1);
  const holderGrowthPct =
    ((ctx.holdersNow - ctx.holdersPrev) / Math.max(1, ctx.holdersPrev)) * 100;

  const socialBurstPct =
    ((ctx.socialMentionsNow - ctx.socialMentionsPrev) /
      Math.max(1, ctx.socialMentionsPrev)) *
    100;

  const priceMomentum = clampScore(priceChangePct, -50, 200);
  const liqMomentum = clampScore(liqChangePct, -50, 300);
  const buyPressure = clampScore(buySellRatio, 0, 10);
  const holderMomentum = clampScore(holderGrowthPct, 0, 500);
  const socialMomentum = clampScore(socialBurstPct, 0, 1000);
  const smartMoney = clampScore(ctx.smartWalletBuys5m, 0, 5);

  const raw =
    0.3 * priceMomentum +
    0.2 * liqMomentum +
    0.15 * buyPressure +
    0.15 * holderMomentum +
    0.1 * socialMomentum +
    0.1 * smartMoney;

  return Math.round(Math.max(0, Math.min(100, raw)));
}
