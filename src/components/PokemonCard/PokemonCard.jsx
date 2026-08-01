import { Link } from "react-router-dom";

import { getTypeColor } from "../../utils/getTypeColor";

import "./PokemonCard.css";


function PokemonCard({ pokemon }) {

    const type1 = pokemon.types[0].type.name;

    const type2 = pokemon.types[1]?.type.name || type1;

    const hasTwoTypes = pokemon.types.length > 1;

    return (

    <Link 
      to={`/pokemon/${pokemon.name}`}
      className="pokemon-link"
    >

        <div
            className={`pokemon-card ${hasTwoTypes ? "two-types" : "one-type"}`}
            style={{
                "--type1": getTypeColor(pokemon.types[0].type.name),
                "--type2": getTypeColor(pokemon.types[1]?.type.name || pokemon.types[0].type.name)
            }}
        >

        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />


        <h2>
          {pokemon.name}
        </h2>


        <p>
          #{pokemon.id}
        </p>


      </div>

    </Link>

  );

}


export default PokemonCard;