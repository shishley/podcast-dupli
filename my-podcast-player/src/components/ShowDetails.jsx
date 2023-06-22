import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { isEpisodeInFavorites } from "../helpers/favorites";
import SeasonDetails from "./SeasonDetails";

const ShowDetails = ({ match, favorites, setFavorites, handleGenreClick }) => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]); 

  const handleFavoriteClick = (episode) => {
    const newFavorite = { ...episode, addedAt: new Date().toISOString() }; // Add the addedAt property

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

        // Extract episodes from the response and set it to the state
        const allEpisodes = response.data.seasons.flatMap(
          (season) => season.episodes
        );
        setEpisodes(allEpisodes);
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
      <h1>{show.title}</h1>
      <p>{show.description}</p>
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
      {episodes.map((episode) => (
        <div key={episode.id}>
          {/* Display episode title and other information here */}
          <button onClick={() => handleFavoriteClick(episode)}>
            {isEpisodeInFavorites(favorites, episode)
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
        </div>
      ))}
      <Link to="/">Back to show list</Link>
    </div>
  );
};

export default ShowDetails;
