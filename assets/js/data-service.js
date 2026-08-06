const cache = new Map();

export async function getJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Não foi possível carregar ${path} (${response.status}).`);
  const data = await response.json();
  cache.set(path, data);
  return data;
}

export async function getText(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(path, { headers: { Accept: 'text/plain' } });
  if (!response.ok) throw new Error(`Não foi possível carregar ${path} (${response.status}).`);
  const data = await response.text();
  cache.set(path, data);
  return data;
}

export function clearDataCache() {
  cache.clear();
}
