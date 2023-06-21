import React from "react";
import { Link } from "react-router-dom";

const Favorites = ({ favorites }) => {
  if (favorites.length === 0) {
    return <p>No favorites yet. Add some episodes to your favorites list!</p>;
  }

  return (
    <div>
      <h1>Favorite Episodes</h1>
      <ul>
        {favorites.map((episode) => (
          <li key={episode.id}>
            <Link to={`/shows/${episode.showId}/seasons/${episode.seasonId}/episodes/${episode.id}`}>
              {episode.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;