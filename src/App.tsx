import { useState } from "react";
import "./App.css";
import { useForm, useFieldArray } from "react-hook-form";
import movies from "./data/movies.json";
import MovieCard from "./components/MovieCard";

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
}

interface FormData {
  nazwa: string;
  rok: number;
  typ: { value: string }[];
}

type Oceny = Record<number, number>;

function App() {
  const [filmy, setFilm] = useState<Movie[]>(
    movies.map((movie) => ({
      ...movie,
      genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
    })) as Movie[]
  );

  const [lastId, setLastId] = useState<number>(movies.length);
  const [obejrzane, setObejrzane] = useState<number[]>([]);
  const [filtr, setFiltr] = useState<
    "wszystkie" | "obejrzane" | "nieobejrzane"
  >("wszystkie");
  const [oceny, setOceny] = useState<Oceny>({});

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nazwa: "",
      rok: undefined,
      typ: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "typ",
  });

  const dodajDoBazy = (data: FormData) => {
    console.log("Dane formularza:", data);

    const newId = lastId + 1;

    setLastId(newId);

    setFilm((prev) => [
      ...prev,
      {
        id: newId,
        title: data.nazwa,
        year: data.rok,
        genre: data.typ
          .map((t) => t.value)
          .filter((v) => v.trim().length > 0),
      },
    ]);

    reset({
      nazwa: "",
      rok: undefined,
      typ: [{ value: "" }],
    });
  };

  function oznaczJakoObejrzany(id: number) {
    setObejrzane((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function ustawOcene(id: number, ocena: number) {
    setOceny((prev) => ({
      ...prev,
      [id]: ocena,
    }));
  }

  function resetuj() {
    setObejrzane([]);
    setOceny({});
  }

  const wyswietlaneFilmy = filmy.filter((movie) => {
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
      <header>
        <h1>
          Obejrzane: {obejrzane.length} / {filmy.length}
        </h1>
      </header>

      <div id="formularz">
        <form onSubmit={handleSubmit(dodajDoBazy)}>
          <div>
            <label htmlFor="nazwa">Nazwa</label>
            <input
              id="nazwa"
              type="text"
              {...register("nazwa", {
                required: "Nazwa filmu jest wymagana",
                minLength: {
                  value: 2,
                  message: "Nazwa musi mieć co najmniej 2 znaki",
                },
              })}
            />
            {errors.nazwa && <p>{errors.nazwa.message}</p>}
          </div>

          <div>
            <label htmlFor="rok">Rok</label>
            <input
              id="rok"
              type="number"
              {...register("rok", {
                required: "Rok jest wymagany",
                valueAsNumber: true,
                min: {
                  value: 1888,
                  message: "Podaj poprawny rok",
                },
                max: {
                  value: new Date().getFullYear(),
                  message: "Rok nie może być z przyszłości",
                },
              })}
            />
            {errors.rok && <p>{errors.rok.message}</p>}
          </div>

          <div>
            <label>Typ</label>

            {fields.map((field, index) => (
              <div key={field.id}>
                <input
                  type="text"
                  {...register(`typ.${index}.value` as const, {
                    required: "Typ nie może być pusty",
                  })}
                />

                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)}>
                    -
                  </button>
                )}

                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                  >
                    +
                  </button>
                )}
              </div>
            ))}

            {errors.typ && <p>Uzupełnij wszystkie pola typu</p>}
          </div>

          <button type="submit">Dodaj</button>
        </form>
      </div>

      <nav>
        <button
          onClick={() => setFiltr("wszystkie")}
          id="wybor"
        >
          Wszystkie
        </button>

        <button
          onClick={() => setFiltr("obejrzane")}
          id="wybor"
        >
          Obejrzane
        </button>

        <button
          onClick={() => setFiltr("nieobejrzane")}
          id="wybor"
        >
          Nieobejrzane
        </button>

        <button onClick={resetuj} id="wybor">
          Wyczyść wszystkie
        </button>
      </nav>

      <main>
        {wyswietlaneFilmy.length > 0 ? (
          wyswietlaneFilmy.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              year={movie.year}
              genre={movie.genre}
              czyObejrzane={obejrzane.includes(movie.id)}
              oznaczJakoObejrzany={() =>
                oznaczJakoObejrzany(movie.id)
              }
              ocena={oceny[movie.id] || 0}
              ustawOcene={(ocena: number) =>
                ustawOcene(movie.id, ocena)
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