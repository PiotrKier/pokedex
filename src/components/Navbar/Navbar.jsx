import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import "./Navbar.css";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function Navbar() {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  function handleClear(e) {

    e.preventDefault();
    setSearch("");
    navigate("/");

  }

  function handleChange(e) {
    const value = e.target.value;
    setSearch(value);

    const query = value.trim().toLowerCase();

    if (!query) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(query)}`);
  }


  return (

    <nav className="navbar">

      <Link 
        to="/"
        className="logo"
      >
        <img
          src="/src/assets/icons/Pokeball.png"
          alt="Pokéball"
          className="logo-icon"
        />
        <span>Pokédex</span>
      </Link>


      <form 
        onSubmit={handleClear}
        className="search-form"
      >

        <input

          type="text"

          placeholder="Wyszukaj Pokémon'a lub typ..."

          value={search}

          onChange={handleChange}

        />


        <button type="submit">
          Wyczyść
        </button>


      </form>


    </nav>

  );

}


export default Navbar;