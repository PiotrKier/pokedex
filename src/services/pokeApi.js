const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(limit = 2000, offset = 0) {//limit pobranych pokemonów
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy Pokémonów.");
  }

  return response.json();
}

export async function getPokemon(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych Pokémona.");
  }

  return response.json();
}

export async function getPokemonSpecies(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych species Pokémona.");
  }

  return response.json();
}

export async function getEvolutionChain(urlOrId) {
  const url = String(urlOrId).startsWith("http") ? urlOrId : `${BASE_URL}/evolution-chain/${urlOrId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać drzewa ewolucji.");
  }

  return response.json();
}