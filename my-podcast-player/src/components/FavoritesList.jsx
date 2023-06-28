
import React from "react";
import { Link } from "react-router-dom";

const FavoritesList = ({ favorites }) => {
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
                  <li key={episode.id}>{episode.title}</li>
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