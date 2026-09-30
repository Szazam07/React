import { useState } from "react";
import "./App.css";
import movies from "./data/movies.json";
import MovieCard from "./components/MovieCard";

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
}

function App() {
  const [filmy, setFilmy] = useState<Movie[]>(
    movies.map((movie) => ({
      ...movie,
      genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
    }))
  );

  const [nazwa, setNazwa] = useState("");
  const [rok, setRok] = useState("");
  const [typ, setTyp] = useState("");

  const [obejrzane, setObejrzane] = useState<number[]>([]);
  const [oceny, setOceny] = useState<Record<number, number>>({});

  const [filtr, setFiltr] = useState<
    "wszystkie" | "obejrzane" | "nieobejrzane"
  >("wszystkie");

  const dodajFilm = () => {
    if (nazwa === "" || rok === "" || typ === "") {
      return;
    }

    const nowyFilm: Movie = {
      id: filmy.length + 1,
      title: nazwa,
      year: Number(rok),
      genre: [typ],
    };

    setFilmy([...filmy, nowyFilm]);

    setNazwa("");
    setRok("");
    setTyp("");
  };

  const oznaczJakoObejrzany = (id: number) => {
    if (obejrzane.includes(id)) {
      setObejrzane(obejrzane.filter((filmId) => filmId !== id));
    } else {
      setObejrzane([...obejrzane, id]);
    }
  };

  const ustawOcene = (id: number, ocena: number) => {
    setOceny({
      ...oceny,
      [id]: ocena,
    });
  };

  const resetuj = () => {
    setObejrzane([]);
    setOceny({});
  };

  const wyswietlaneFilmy = filmy.filter((film) => {
    if (filtr === "obejrzane") {
      return obejrzane.includes(film.id);
    }

    if (filtr === "nieobejrzane") {
      return !obejrzane.includes(film.id);
    }

    return true;
  });

  return (
    <>
      <header>
        <h1>
          Obejrzane: {obejrzane.length} / {filmy.length}
        </h1>
      </header>

      <div className="gora">
  <div id="formularz">
    <h2>Dodaj film</h2>

    <div>
      <label>Nazwa</label>
      <input
        type="text"
        value={nazwa}
        onChange={(e) => setNazwa(e.target.value)}
      />
    </div>

    <div>
      <label>Rok</label>
      <input
        type="number"
        value={rok}
        onChange={(e) => setRok(e.target.value)}
      />
    </div>

    <div>
      <label>Typ</label>
      <input
        type="text"
        value={typ}
        onChange={(e) => setTyp(e.target.value)}
      />
    </div>

    <button onClick={dodajFilm} className="wybor" >Dodaj</button>
  </div>

  <div className="filtry">
    <h2>Filtry</h2>

    <button
      onClick={() => setFiltr("wszystkie")}
      className="wybor"
    >
      Wszystkie
    </button>

    <button
      onClick={() => setFiltr("obejrzane")}
      className="wybor"
    >
      Obejrzane
    </button>

    <button
      onClick={() => setFiltr("nieobejrzane")}
      className="wybor"
    >
      Nieobejrzane
    </button>

    <button onClick={resetuj} className="wybor">
      Wyczyść
    </button>
  </div>
</div>



      <main>
        {wyswietlaneFilmy.length > 0 ? (
          wyswietlaneFilmy.map((film) => (
            <MovieCard
              key={film.id}
              title={film.title}
              year={film.year}
              genre={film.genre}
              czyObejrzane={obejrzane.includes(film.id)}
              oznaczJakoObejrzany={() =>
                oznaczJakoObejrzany(film.id)
              }
              ocena={oceny[film.id] || 0}
              ustawOcene={(ocena) =>
                ustawOcene(film.id, ocena)
              }
            />
          ))
        ) : (
          <h2>Brak filmów do wyświetlenia.</h2>
        )}
      </main>
    </>
  );
}

export default App;
