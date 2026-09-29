import { useState } from "react";
import "./MovieCard.css";

type MovieCardProps = {
  title: string;
  year: number;
  genre: string;
  czyObejrzane: boolean;
  dodajDoObejrzanych: () => void;
};

function MovieCard({
  title,
  year,
  genre,
  czyObejrzane,
  dodajDoObejrzanych,
}: MovieCardProps) {
  const [ocena, ustawOcene] = useState(0);

  return (
    <div className="movie-card">
      <div className="movie-info">
        <h2>Tytuł: {title}</h2>
        <p>Rok: {year}</p>
        <p>Gatunek: {genre}</p>
      </div>

      <button
        className="watched-button"
        onClick={dodajDoObejrzanych}
        disabled={czyObejrzane}
      >
        {czyObejrzane ? "Obejrzane!" : "Dodaj do obejrzanych"}
      </button>

      <div>
        <p>Ocena:</p>

        <div className="rating">
          {[1, 2, 3, 4, 5].map((gwiazdka) => (
            <button
              key={gwiazdka}
              className={gwiazdka <= ocena ? "active" : ""}
              onClick={() => ustawOcene(gwiazdka)}
            >
              ★
            </button>
          ))}
        </div>

        <p>Twoja ocena: {ocena}/5</p>
      </div>
    </div>
  );
}

export default MovieCard;
