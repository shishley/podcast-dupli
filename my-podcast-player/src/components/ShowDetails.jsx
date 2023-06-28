import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { isEpisodeInFavorites } from "../helpers/favorites";
import { getGenreTitle } from "../helpers/genres";

const ShowDetails = ({ match, favorites, setFavorites, handleGenreClick }) => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [genreFilter, setGenreFilter] = useState(null);

  const handleFavoriteClick = (episode) => {
    const newFavorite = { ...episode, addedAt: new Date().toISOString() };

    if (!favorites.some((fav) => fav.id === episode.id)) {
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter((fav) => fav.id !== episode.id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${showId}`
        );
        const data = await response.json();
        setShow(data);
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShow();
  }, [showId]);

  if (!show) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>{show.title}</h1>{" "}
      <img src={show.image} alt={show.title} width="100" height="100" />
      <p>{show.description}</p>
      <p>
        Genres:{" "}
        {show.genreIds
          ? show.genreIds.map((genreId) => getGenreTitle(genreId)).join(", ")
          : "unknown"}
      </p>
      <h2>Seasons</h2>
      <ul>
        {show.seasons.map((season) => (
          <li key={season.season}>
            <Link to={`/shows/${show.id}/seasons/${season.season}`}>
              Season {season.season}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/">Back to show list</Link>
    </div>
  );
};

export default ShowDetails;
