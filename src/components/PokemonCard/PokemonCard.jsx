import { Link } from "react-router-dom";

import fallbackImage from "../../assets/images/Question_mark_pokeball.png";
import { getTypeColor } from "../../utils/getTypeColor";

import "./PokemonCard.css";

import TypeBadge from "../TypeBadge/TypeBadge";

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
            "--type1": getTypeColor(type1),
            "--type2": getTypeColor(type2)
          }}
        >
            <img
              src={pokemon.sprites.front_default || fallbackImage}
              alt={pokemon.name}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
                event.currentTarget.onerror = null;
              }}
            />

            <div className="pokemon-info">

                <h2>
                  {pokemon.name}
                </h2>

                <p>
                  #{pokemon.id}
                </p>

                <div className="card-types">

                  {pokemon.types.map((type)=>(

                    <TypeBadge
                      key={type.type.name}
                      type={type.type.name}
                    />

                  ))}

                </div>

            </div>

        </div>

    </Link>

  );

}


export default PokemonCard;