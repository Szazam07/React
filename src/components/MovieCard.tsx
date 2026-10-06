import "./MovieCard.css";

interface MovieCardProps {
  title: string;
  year: number;
  genre: string[];
  czyObejrzane: boolean;
  oznaczJakoObejrzany: () => void;
  ocena: number;
  ustawOcene: (ocena: number) => void;
}

function MovieCard({
  title,
  year,
  genre,
  czyObejrzane,
  oznaczJakoObejrzany,
  ocena,
  ustawOcene,
}: MovieCardProps) {

  return (
    <div className="movie-card">
      <div className="movie-info">
        <h2>Tytuł: {title}</h2>
        <p>Rok: {year}</p>
        <p>Gatunek: {genre.join(", ")}</p>
      </div>

      <button
        className="watched-button"
        onClick={oznaczJakoObejrzany}
      >
        {czyObejrzane ? "Obejrzane!" : "Dodaj do obejrzanych"}
      </button>

      <div>
        <p>Ocena:</p>

        <div className="rating">
          {[1, 2, 3, 4, 5].map((gwiazdka) => (
            <button
              key={gwiazdka}
              className={gwiazdka <= ocena ? "active" : "" }
              onClick={() => ustawOcene(gwiazdka)}
            >
              ✮
            </button>
          ))}
        </div>

        <p>Twoja ocena: {ocena}/5</p>
      </div>
    </div>
  );
}

export default MovieCard;