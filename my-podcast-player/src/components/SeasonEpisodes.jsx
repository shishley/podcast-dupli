import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { isEpisodeInFavorites } from "../helpers/favorites";

const SeasonEpisodes = ({ favorites, setFavorites }) => {
  const { showId, seasonId } = useParams();
  const [season, setSeason] = useState(null);

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
    const fetchSeason = async () => {
      try {
        const response = await axios.get(
          `https://podcast-api.netlify.app/shows/${showId}/seasons/${seasonId}`
        );
        setSeason(response.data);
      } catch (error) {
        console.error("Error fetching season details:", error);
      }
    };

    fetchSeason();
  }, [showId, seasonId]);

  if (!season) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Season {season.number}</h1>
      <h2>Episodes</h2>
      <ul>
      {season.episodes.map((episode) => (
  <li key={episode.id}>
    {episode.title}{" "}
    <button onClick={() => handleFavoriteClick(episode)}>
      {isEpisodeInFavorites(favorites, episode)
        ? "Remove from favorites"
        : "Add to favorites"}
    </button>
  </li>
))}
      </ul>
      <Link to={`/shows/${showId}`}>Back to show details</Link>
    </div>
  );
};

export default SeasonEpisodes;