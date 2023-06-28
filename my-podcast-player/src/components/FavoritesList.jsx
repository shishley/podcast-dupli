import React from "react";
import { Link } from "react-router-dom";

const FavoritesList = ({ favorites, setFavorites }) => {
  const groupedFavorites = {};

  favorites.forEach((favorite) => {
    const { showId, seasonId, episode } = favorite;
    if (!groupedFavorites[showId]) {
      groupedFavorites[showId] = {
        showTitle: episode.showTitle,
        seasons: {},
      };
    }

    if (!groupedFavorites[showId].seasons[seasonId]) {
      groupedFavorites[showId].seasons[seasonId] = {
        seasonTitle: episode.seasonTitle,
        episodes: [],
      };
    }

    groupedFavorites[showId].seasons[seasonId].episodes.push(episode);
  });

  const removeFromFavorites = (episode) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.episode.id !== episode.id
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h2>Favorites</h2>
      {Object.entries(groupedFavorites).map(([showId, show]) => (
        <div key={showId}>
          <h3>
            <Link to={`/shows/${showId}`}>{show.showTitle}</Link>
          </h3>
          {Object.entries(show.seasons).map(([seasonId, season]) => (
            <div key={seasonId}>
              <h4>
                <Link to={`/shows/${showId}/seasons/${seasonId}`}>
                  {season.seasonTitle}
                </Link>
              </h4>
              <ul>
                {season.episodes.map((episode) => (
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
                    <button onClick={() => removeFromFavorites(episode)}>
                      Remove from favorites
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
