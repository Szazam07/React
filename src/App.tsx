import { useState } from "react";
import "./App.css";
import movies from "./data/movies.json";
import MovieCard from "./components/MovieCard";

function App() {
  const [obejrzane, setObejrzane] = useState<number[]>([]);
  const [filtr, setFiltr] = useState<
    "wszystkie" | "obejrzane" | "nieobejrzane"
  >("wszystkie");

  function dodajDoObejrzanych(id: number) {
    setObejrzane((prev) => [...prev, id]);
  }

  const przefiltrowaneFilmy = movies.filter((movie) => {
    if (filtr === "obejrzane") {
      return obejrzane.includes(movie.id);
    }

    if (filtr === "nieobejrzane") {
      return !obejrzane.includes(movie.id);
    }

    return true;
  });

  return (
    <>
      <div className="filters">
        <button onClick={() => setFiltr("wszystkie")}>Wszystkie</button>

        <button onClick={() => setFiltr("obejrzane")}>Obejrzane</button>

        <button onClick={() => setFiltr("nieobejrzane")}>Nieobejrzane</button>
      </div>

      <ul>
        {przefiltrowaneFilmy.map((movie) => (
          <li key={movie.id}>
            <MovieCard
              title={movie.title}
              year={movie.year}
              genre={movie.genre}
              czyObejrzane={obejrzane.includes(movie.id)}
              dodajDoObejrzanych={() => dodajDoObejrzanych(movie.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
