import { useEffect, useState } from "react";
import { getPokemonList, getPokemon } from "../../services/pokeApi";
import PokemonCard from "../../components/PokemonCard/PokemonCard";

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;