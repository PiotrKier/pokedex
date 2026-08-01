import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import PokemonDetails from "./pages/PokemonDetails/PokemonDetails";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/Navbar/Navbar";

function App(){

return (

<>
<Navbar/>

<Routes>

<Route 
path="/" 
element={<Home/>}
/>


<Route
path="/pokemon/:name"
element={<PokemonDetails/>}
/>


<Route
path="*"
element={<NotFound/>}
/>


</Routes>

</>

)

}


export default App;