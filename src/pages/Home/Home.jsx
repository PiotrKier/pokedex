import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPokemonList, getPokemon } from "../../services/pokeApi";
import PokemonCard from "../../components/PokemonCard/PokemonCard";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    async function loadPokemon() {
      try {
        const data = await getPokemonList();

        const details = await Promise.all(
          data.results.map((pokemon) =>
            getPokemon(pokemon.name)
          )
        );

        setPokemonList(details);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, []);

  const searchQuery = new URLSearchParams(location.search).get("search")?.trim().toLowerCase() || "";

  const filteredPokemon = pokemonList.filter((pokemon) => {
    if (!searchQuery) return true;

    const types = pokemon.types.map((type) => type.type.name.toLowerCase());
    const matchesType = types.some((type) => type === searchQuery || type.includes(searchQuery));
    const matchesName = pokemon.name.toLowerCase().includes(searchQuery);

    return matchesType || matchesName;
  });

  if (loading) {
    return <h2>Ładowanie...</h2>;
  }

  return (
    <main>
      <h1>Pokédex</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
          />
        ))}
      </div>

      {searchQuery && filteredPokemon.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Brak wyników dla: "{searchQuery}"
        </p>
      )}
    </main>
  );
}

export default Home;