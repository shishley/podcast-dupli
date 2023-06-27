import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { isEpisodeInFavorites } from "../helpers/favorites";
import { getGenreTitle } from "../helpers/genres";

const ShowDetails = ({ match, favorites, setFavorites, handleGenreClick }) => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [genreFilter, setGenreFilter] = useState(null);

  const handleFavoriteClick = (episode) => {
    const newFavorite = { ...episode, addedAt: new Date().toISOString() };

    if (!favorites.some((fav) => fav.id === episode.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
    } else {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== episode.id)
      );
    }
  };

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(
          `https://podcast-api.netlify.app/id/${showId}`
        );
        setShow(response.data);
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
        {show.genres
          ? show.genres.map((genreId) => getGenreTitle(genreId)).join(", ")
          : "unknown"}
      </p>
      <h2>Seasons</h2>
      <ul>
        {show.seasons.map((season) => (
          <li key={season.id}>
            <Link to={`/shows/${show.id}/seasons/${season.id}`}>
              Season {season.number}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/">Back to show list</Link>
    </div>
  );
};

export default ShowDetails;
