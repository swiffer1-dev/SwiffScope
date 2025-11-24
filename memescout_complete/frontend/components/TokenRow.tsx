type Props = {
  token: any;
};

export default function TokenRow({ token }: Props) {
  return (
    <a
      href={`/token/${token.id}`}
      className="p-3 border border-neutral-800 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/60 transition flex justify-between items-center"
    >
      <div>
        <div className="font-semibold">
          {token.name} ({token.symbol})
        </div>
        <div className="text-xs text-gray-400">{token.chain}</div>
      </div>
      <div className="text-right text-xs">
        <div>Risk: {token.risk_score ?? 0}</div>
        <div>Momentum: {token.momentum_score ?? 0}</div>
        <div className="text-gray-400">
          LP: ${token.liquidity_usd ? token.liquidity_usd.toFixed(0) : 0}
        </div>
      </div>
    </a>
  );
}
