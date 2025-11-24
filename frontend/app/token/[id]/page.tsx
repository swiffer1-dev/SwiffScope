type Props = { params: { id: string } };

async function fetchToken(id: string) {
  const res = await fetch(`http://localhost:4000/tokens/${id}`, {
    cache: "no-store"
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function TokenDetail({ params }: Props) {
  const data = await fetchToken(params.id);

  if (!data) {
    return (
      <main className="p-4">
        <h1 className="text-xl">Token not found</h1>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-2">
        {data.name} ({data.symbol})
      </h1>
      <p className="text-sm text-gray-400 mb-4">Chain: {data.chain}</p>
      <pre className="bg-neutral-900 rounded p-4 text-xs overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
