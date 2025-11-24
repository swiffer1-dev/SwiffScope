import { TokenContext } from './types';

export function calcLpScore(ctx: TokenContext): number {
  if (ctx.liquidityUsd < 2000) return 5;

  let base = 60;

  if (!ctx.lpLocked) {
    base -= 30;
  } else if (ctx.lpLockUntil) {
    const diffDays =
      (ctx.lpLockUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) base += 0;
    else if (diffDays < 7) base += 10;
    else if (diffDays < 30) base += 20;
    else base += 30;
  }

  if (ctx.liquidityUsd >= 10000) base += 10;
  if (ctx.liquidityUsd >= 50000) base += 10;

  return Math.max(0, Math.min(100, base));
}

export function calcContractScore(ctx: TokenContext): number {
  if (ctx.isHoneypot === true) return 0;

  let score = 90;

  if (ctx.mintAuthorityEnabled === true) score -= 40;
  if (ctx.freezeAuthorityEnabled === true) score -= 20;

  return Math.max(0, Math.min(100, score));
}

export function calcDistributionScore(ctx: TokenContext): number {
  let score = 80;
  const p = ctx.topHolderPct;

  if (p > 50) score -= 50;
  else if (p > 40) score -= 35;
  else if (p > 30) score -= 25;
  else if (p > 20) score -= 15;
  else if (p > 10) score -= 5;

  if (ctx.holdersCount < 50) score -= 20;
  else if (ctx.holdersCount < 150) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function calcDeployerScore(ctx: TokenContext): number {
  let score = 80;

  if (ctx.deployerKnownRugs >= 3) return 0;
  if (ctx.deployerKnownRugs === 2) score -= 50;
  if (ctx.deployerKnownRugs === 1) score -= 30;

  if (ctx.deployerAgeDays !== null) {
    if (ctx.deployerAgeDays < 1) score -= 20;
    else if (ctx.deployerAgeDays < 7) score -= 10;
  }

  if (ctx.deployerPastTokens > 10 && ctx.deployerKnownRugs === 0) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function calcAnomalyScore(ctx: TokenContext): number {
  let score = 80;

  if (ctx.suspiciousWalletClusters > 0) score -= 15;
  if (ctx.suspiciousWalletClusters > 3) score -= 15;
  if (ctx.sameBuyerAsPreviousRugs) score -= 30;

  return Math.max(0, Math.min(100, score));
}

export function calcExternalScore(ctx: TokenContext): number {
  if (ctx.externalRiskScore == null) return 50;
  return Math.max(0, Math.min(100, ctx.externalRiskScore));
}

export function calcFinalRiskScore(ctx: TokenContext): number {
  const lpScore = calcLpScore(ctx);
  const contractScore = calcContractScore(ctx);
  const distributionScore = calcDistributionScore(ctx);
  const deployerScore = calcDeployerScore(ctx);
  const anomalyScore = calcAnomalyScore(ctx);
  const externalScore = calcExternalScore(ctx);

  const riskScore =
    0.25 * lpScore +
    0.2 * contractScore +
    0.15 * distributionScore +
    0.2 * deployerScore +
    0.1 * anomalyScore +
    0.1 * externalScore;

  return Math.round(Math.max(0, Math.min(100, riskScore)));
}
