export type TokenContext = {
  tokenId: number;
  chain: string;
  ageMinutes: number;

  lpLocked: boolean;
  lpLockUntil?: Date | null;
  liquidityUsd: number;
  lockProvider?: string | null;

  mintAuthorityEnabled: boolean | null;
  freezeAuthorityEnabled: boolean | null;
  isHoneypot: boolean | null;

  holdersCount: number;
  topHolderPct: number;
  top10HoldersPct?: number;

  deployerAddress: string;
  deployerAgeDays: number | null;
  deployerKnownRugs: number;
  deployerPastTokens: number;
  deployerAvgLifeHours?: number | null;

  suspiciousWalletClusters: number;
  sameBuyerAsPreviousRugs: boolean;

  externalRiskScore?: number | null;
};

export type MomentumContext = {
  tokenId: number;

  priceNow: number;
  pricePrev: number;

  liquidityNow: number;
  liquidityPrev: number;

  volume5mUsd: number;
  buys5m: number;
  sells5m: number;
  uniqueBuyers5m: number;
  holdersNow: number;
  holdersPrev: number;

  smartWalletBuys5m: number;

  socialMentionsNow: number;
  socialMentionsPrev: number;
};
