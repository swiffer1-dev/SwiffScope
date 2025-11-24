import TokenRow from "../components/TokenRow";

async function fetchTokens() {
  const res = await fetch("http://localhost:4000/tokens", { cache: "no-store" });
  return res.json();
}

export default async function Home() {
  const data = await fetchTokens();
  const tokens = data.tokens ?? [];

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">New Tokens</h1>
      <div className="flex flex-col gap-2">
        {tokens.map((t: any) => (
          <TokenRow key={t.id} token={t} />
        ))}
      </div>
    </main>
  );
}
