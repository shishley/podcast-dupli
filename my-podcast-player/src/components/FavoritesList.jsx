import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../helpers/formatDate";

//

//

const FavoritesList = ({ favorites, setFavorites }) => {
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    // empty function will cause a re-render when sortOrder or favorites change
  }, [sortOrder, favorites]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedEpisodes = (episodes) => {
    if (sortOrder === "titleAZ") {
      return [...episodes].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "titleZA") {
      return [...episodes].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === "recent") {
      return [...episodes].sort(
        (a, b) => new Date(b.showUpdated) - new Date(a.showUpdated)
      );
    } else if (sortOrder === "oldest") {
      return [...episodes].sort(
        (a, b) => new Date(a.showUpdated) - new Date(b.showUpdated)
      );
    } else {
      return episodes;
    }
  };

  const groupedFavorites = {};

  favorites.forEach((favorite) => {
    const { showId, seasonId, episode, showUpdated, seasonTitle } = favorite;
    if (!groupedFavorites[showId]) {
      groupedFavorites[showId] = {
        showTitle: episode.showTitle,
        updated: showUpdated ? new Date(showUpdated) : "Unknown",
        seasons: {},
      };
    }

    if (!groupedFavorites[showId].seasons[seasonId]) {
      groupedFavorites[showId].seasons[seasonId] = {
        seasonTitle: seasonTitle,
        episodes: [],
      };
    }

    groupedFavorites[showId].seasons[seasonId].episodes.push(episode);
  });

  // Flatten episodes array
  const allEpisodes = [];
  Object.values(groupedFavorites).forEach((show) => {
    Object.values(show.seasons).forEach((season) => {
      season.episodes.forEach((episode) => {
        allEpisodes.push({ ...episode, seasonTitle: season.seasonTitle });
      });
    });
  });

  // Sort all episodes based on the sortOrder state
  const sortedAllEpisodes = sortedEpisodes(allEpisodes);

  // Re-group episodes by show and season after sorting
  const sortedGroupedFavorites = {};
  sortedAllEpisodes.forEach((episode) => {
    const { showId, seasonId, seasonTitle } = episode;

    if (!sortedGroupedFavorites[showId]) {
      sortedGroupedFavorites[showId] = {
        ...groupedFavorites[showId],
        seasons: {},
      };
    }

    if (!sortedGroupedFavorites[showId].seasons[seasonId]) {
      sortedGroupedFavorites[showId].seasons[seasonId] = {
        seasonTitle: seasonTitle,
        episodes: [],
      };
    }

    sortedGroupedFavorites[showId].seasons[seasonId].episodes.push(episode);
  });
  const removeFromFavorites = (episodeToRemove) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.episode.id !== episodeToRemove.id
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  //

  return (
    <div>
      <h2>Favorites</h2>
      <select onChange={handleSortChange}>
        <option value="none">Sort by...</option>
        <option value="titleAZ">Title (A-Z)</option>
        <option value="titleZA">Title (Z-A)</option>
        <option value="recent">Most recent</option>
        <option value="oldest">Oldest</option>
      </select>
      ;
      {Object.entries(sortedGroupedFavorites).map(([showId, show]) => (
        <div key={showId}>
          <h3>
            <Link to={`/shows/${showId}`}>{show.showTitle}</Link>
          </h3>
          <p>
            Last updated:{" "}
            {show.updated === "Unknown"
              ? "Unknown"
              : formatDate(new Date(show.updated))}
          </p>
          {Object.entries(show.seasons).map(([seasonId, season]) => (
            <div key={seasonId}>
              <h4>
                <Link to={`/shows/${showId}/seasons/${seasonId}`}>
                  {season.seasonTitle}
                </Link>
              </h4>
              <ul>
                {season.episodes.map(
                  (
                    episode //
                  ) => (
                    <li key={episode.id}>
                      <h3>{episode.title}</h3>
                      <p>
                        <strong>Episode:</strong> {episode.episode}
                      </p>
                      <p>
                        <strong>Season:</strong> {season.seasonTitle}
                      </p>

                      <p>{episode.description}</p>
                      <p>Added on {formatDate(new Date(episode.addedAt))}</p>
                      <audio controls>
                        <source src={episode.file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <button onClick={() => removeFromFavorites(episode)}>
                        Remove from favorites
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <Link to="/">Back to show list</Link>
    </div>
  );
};

export default FavoritesList;
