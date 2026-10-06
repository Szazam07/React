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

  const [gatunki, setGatunki] = useState<string[]>([""]);

  const [obejrzane, setObejrzane] = useState<number[]>([]);
  const [oceny, setOceny] = useState<Record<number, number>>({});

  const [filtr, setFiltr] = useState<
    "wszystkie" | "obejrzane" | "nieobejrzane"
  >("wszystkie");

  const dodajGatunek = () => {
    setGatunki([...gatunki, ""]);
  };

  const usunGatunek = (index: number) => {
    if (gatunki.length === 1) {
      return;
    }

    setGatunki(gatunki.filter((gatunek, i) => i !== index));
  };

  const zmienGatunek = (index: number, wartosc: string) => {
    const noweGatunki = [...gatunki];
    noweGatunki[index] = wartosc;
    setGatunki(noweGatunki);
  };

  const dodajFilm = () => {
    if (nazwa === "" || rok === "") {
      return;
    }

    const poprawneGatunki = gatunki
      .map((gatunek) => gatunek.trim())
      .filter((gatunek) => gatunek !== "");

    if (poprawneGatunki.length === 0) {
      return;
    }

    const nowyFilm: Movie = {
      id: filmy.length + 1,
      title: nazwa,
      year: Number(rok),
      genre: poprawneGatunki,
    };

    setFilmy([...filmy, nowyFilm]);

    setNazwa("");
    setRok("");
    setGatunki([""]);
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
               placeholder="Nazwa"
            />
          </div>

          <div>
            <label>Rok</label>
            <input
              type="number"
              value={rok}
              onChange={(e) => setRok(e.target.value)}
              placeholder="Rok"
              
            />
          </div>

          <div>
            <label>Gatunki</label>

            {gatunki.map((gatunek, index) => (
              <div key={index} className="gatunek-input">
                <input
                  type="text"
                  value={gatunek}
                  onChange={(e) =>
                    zmienGatunek(index, e.target.value)
                  }
                  placeholder="Gatunek"
                />

                <button
                  type="button"
                  onClick={dodajGatunek}
                  className="plus"
                >
                  +
                </button>

                {gatunki.length > 1 && (
                  <button
                    type="button"
                    onClick={() => usunGatunek(index)}
                    className="minus"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={dodajFilm} className="wybor">
            Dodaj
          </button>
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