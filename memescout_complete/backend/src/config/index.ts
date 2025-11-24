export const config = {
  databaseUrl: process.env.DATABASE_URL || 'postgres://memescout:memescout@localhost:5432/memescout',
  dexscreenerBaseUrl: 'https://api.dexscreener.com/latest/dex',
  pumpfunRecentUrl: 'https://api.pump.fun/coins/recent',
  solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://solana-mainnet.rpc.example',
  honeypotCheckUrl: process.env.HONEYPOT_CHECK_URL || 'https://honeypot-check.example/api',
  lpLockCheckUrl: process.env.LP_LOCK_CHECK_URL || 'https://lp-lock-check.example/api'
};
