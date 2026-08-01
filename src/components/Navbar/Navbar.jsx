import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Navbar.css";


function Navbar() {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();


  function handleSearch(e) {

    e.preventDefault();

    if (!search.trim()) return;


    navigate(`/pokemon/${search.toLowerCase()}`);

    setSearch("");

  }


  return (

    <nav className="navbar">

      <Link 
        to="/"
        className="logo"
      >
        Pokédex
      </Link>


      <form 
        onSubmit={handleSearch}
        className="search-form"
      >

        <input

          type="text"

          placeholder="Search Pokémon..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

        />


        <button>
          Search
        </button>


      </form>


    </nav>

  );

}


export default Navbar;