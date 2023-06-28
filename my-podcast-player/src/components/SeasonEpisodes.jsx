import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { isEpisodeInFavorites } from "../helpers/favorites";

const SeasonEpisodes = ({ favorites, setFavorites }) => {
  const { showId, season } = useParams();
  const [show, setShow] = useState(null);
  const [episodesInSeason, setEpisodesInSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleFavoriteClick = (episode) => {
    const newFavorite = {
      showId: show.id,
      seasonId: parseInt(season),
      episode: { ...episode, addedAt: new Date().toISOString() },
    };

    if (!favorites.some((fav) => fav.episode.id === episode.id)) {
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter(
        (fav) => fav.episode.id !== episode.id
      );
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
        const show = await response.json();
        setShow(show);

        if (show.seasons) {
          const foundSeason = show.seasons.find(
            (s) => s.season === parseInt(season)
          );

          if (foundSeason && foundSeason.episodes) {
            const filteredEpisodes = foundSeason.episodes;
            console.log("Filtered episodes:", filteredEpisodes);
            setEpisodesInSeason(filteredEpisodes);
          } else {
            setEpisodesInSeason([]);
          }
        } else {
          setEpisodesInSeason([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching show details:", error);
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId, season]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Season {season}</h1>
      <h2>Episodes</h2>{" "}
      {episodesInSeason.length > 0 ? (
        <ul>
          {episodesInSeason.map((episode) => {
            const uniqueKey = `season-${season}-episode-${episode.episode}`;
            return (
              <li key={episode.id}>
                <h3>{episode.title}</h3>
                <p>
                  <strong>Episode:</strong> {episode.episode}
                </p>
                <p>{episode.description}</p>
                <audio controls>
                  <source src={episode.file} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button onClick={() => handleFavoriteClick(episode)}>
                  {isEpisodeInFavorites(favorites, episode)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No episodes found for this season.</p>
      )}
      <Link to={`/shows/${showId}`}>Back to show details</Link>
    </div>
  );
};
export default SeasonEpisodes;
