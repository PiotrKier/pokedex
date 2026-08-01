import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getPokemon } from "../../services/pokeApi";
import TypeBadge from "../../components/TypeBadge/TypeBadge";

import "./PokemonDetails.css";

function PokemonDetails() {

  const { name } = useParams();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {

    async function loadPokemon(){

      try {

        setLoading(true);
        setError(false);
        setPokemon(null);


        const data = await getPokemon(name);

        setPokemon(data);


      } catch (err) {

        setError(true);

      } finally {

        setLoading(false);

      }

    }


    loadPokemon();

  }, [name]);



  if(loading){
    return <h2>Ładowanie...</h2>;
  }


  if(error){
    return <h2>Nie znaleziono Pokémona</h2>;
  }



  return (

  <main className="pokemon-details">

    <Link 
      to="/"
      className="back-button"
    >
      Powrót do listy
    </Link>


    <h1>
      {pokemon.name}
    </h1>


      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
      />


      <h3>
        #{pokemon.id}
      </h3>


      <div className="types">

  {pokemon.types.map((type)=>(

    <TypeBadge
      key={type.type.name}
      type={type.type.name}
    />

  ))}

</div>


      <div className="stats">

        <h2>
          Stats
        </h2>


        {pokemon.stats.map((stat)=>(

          <p key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </p>

        ))}


      </div>


    </main>

  );

}


export default PokemonDetails;