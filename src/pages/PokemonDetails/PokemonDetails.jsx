import { useEffect, useState, useRef } from "react";
import { getTypeColor } from "../../utils/getTypeColor";
import { useParams, Link } from "react-router-dom";

import fallbackImage from "../../assets/images/Question_mark_pokeball.png";
import weightIcon from "../../assets/icons/weight.png";
import heightIcon from "../../assets/icons/height.png";
import hiddenAbilityIcon from "../../assets/icons/hidden_ability.png";
import { getPokemon, getPokemonSpecies, getAbility } from "../../services/pokeApi";
import Ewolution from "../../components/Ewolution/Ewolution";
import TypeBadge from "../../components/TypeBadge/TypeBadge";

import "./PokemonDetails.css";

function PokemonDetails() {

  const { name } = useParams();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [species, setSpecies] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [abilities, setAbilities] = useState([]);


  useEffect(() => {

    async function loadPokemon(){

      try {

        setLoading(true);
        setError(false);
        setPokemon(null);
        setSpecies(null);


        const data = await getPokemon(name);
        setPokemon(data);

        // pobierz dane species, aby uzyskać flavor_text_entries i evolution_chain
        try {
          const sp = await getPokemonSpecies(name);
          setSpecies(sp);
          // wykryj, czy species zawiera cries
          if (sp.cries && (sp.cries.latest || sp.cries.legacy)) {
            setAudioAvailable(!!sp.cries.latest || !!sp.cries.legacy);
          }
        } catch (e) {
          // błąd niekrytyczny: pozostaw species jako null
          console.warn(e);
        }

        // pobierz szczegóły umiejętności
        try {
          if (data.abilities && data.abilities.length > 0) {
            const abilitiesData = await Promise.all(
              data.abilities.map(async (ability) => {
                try {
                  const details = await getAbility(ability.ability.name);
                  const effect = details.effect_entries?.find(
                    (e) => e.language.name === "en" || e.language.name === "pl"
                  );
                  return {
                    name: ability.ability.name,
                    isHidden: ability.is_hidden,
                    effect: effect?.effect || "Brak opisu.",
                  };
                } catch (e) {
                  return {
                    name: ability.ability.name,
                    isHidden: ability.is_hidden,
                    effect: "Brak opisu.",
                  };
                }
              })
            );
            setAbilities(abilitiesData);
          }
        } catch (e) {
          console.warn("Błąd pobierania umiejętności:", e);
        }


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

      <Link to="/" className="back-button">Powrót do listy</Link>

      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>

      <div className="details-grid">

        <section className="left">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default || fallbackImage}
            alt={pokemon.name}
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
              event.currentTarget.onerror = null;
            }}
          />

          <h3>ID Pokémon'a: #{pokemon.id}</h3>

          <div className="types">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.type.name} type={type.type.name} />
            ))}
          </div>
            <div className="sound-controls">
              <button
                className="sound-button"
                onClick={async () => {
                  // określ źródło audio: preferuj pokemon.cries.latest -> species.cries.latest -> URL zapasowy
                  const src =
                    pokemon?.cries?.latest || species?.cries?.latest || species?.cries?.legacy ||
                    `https://play.pokemonshowdown.com/audio/cries/${pokemon.name}.mp3`;

                  if (!src) return;

                  try {
                    if (!audioRef.current) {
                      audioRef.current = new Audio(src);
                      audioRef.current.volume = volume;
                      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
                      audioRef.current.addEventListener("error", () => {
                        setIsPlaying(false);
                        console.warn("Błąd odtwarzania dźwięku", src);
                      });
                    }

                    if (isPlaying) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                      setIsPlaying(false);
                    } else {
                      // jeśli src się zmieniło, zaktualizuj audio
                      if (audioRef.current.src !== src) {
                        audioRef.current.src = src;
                      }
                      audioRef.current.volume = volume;
                      await audioRef.current.play();
                      setIsPlaying(true);
                    }
                  } catch (err) {
                    console.warn(err);
                    setIsPlaying(false);
                  }
                }}
                disabled={!pokemon}
                title="Odtwórz dźwięk"
              >
                {isPlaying ? "Stop" : "Dźwięk"}
              </button>

              <input
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                aria-label="Głośność"
              />
            </div>

          <div className="measurements">
            <p><img src={weightIcon} alt="Waga" title="Waga" className="measurement-icon" /> {(pokemon.weight / 10).toFixed(1)} kg</p>
            <p><img src={heightIcon} alt="Wzrost" title="Wzrost" className="measurement-icon" /> {(pokemon.height / 10).toFixed(1)} m</p>
          </div>

          <div className="stats">
            <h2>Podstawowe statystyki</h2>
            {pokemon.stats.map((stat) => (
              <p key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </p>
            ))}
          </div>
        </section>

        <aside className="right">
          <div className="flavor">
            <h2>Opis</h2>
            {species ? (
              (() => {
                const entry = species.flavor_text_entries.find(
                  (e) => e.language.name === "en" || e.language.name === "pl"
                );
                return <p>{entry ? entry.flavor_text.replace(/\f/g, " ") : "Brak opisu."}</p>;
              })()
            ) : (
              <p>Brak opisu.</p>
            )}
          </div>

          <div className="abilities">
            <h2>Umiejętności</h2>
            {abilities.length > 0 ? (
              <div className="abilities-list">
                {abilities.map((ability, idx) => (
                  <div key={idx} className="ability-item">
                    <h3>
                      {ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}
                      {ability.isHidden && <img src={hiddenAbilityIcon} alt="Ukryta umiejętność" title="Ukryta umiejętność" className="hidden-ability-icon" />}
                    </h3>
                    <p>{ability.effect}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Brak informacji o umiejętnościach.</p>
            )}
          </div>

          <div className="evolution">
            <h2>Drzewko ewolucji</h2>
            {species && species.evolution_chain ? (
              <Ewolution chainUrl={species.evolution_chain.url} current={pokemon.name} />
            ) : (
              <p>Brak informacji o ewolucji.</p>
            )}
          </div>
        </aside>

      </div>

    </main>
  );

}


export default PokemonDetails;