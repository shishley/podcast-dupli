import React from "react";
import { Link } from "react-router-dom";
import { getGenreTitle } from "../helpers/genres";

const ShowPreview = ({ show }) => {
  const lastUpdated = new Date(show.updated).toLocaleDateString();

  return (
    <div>
      <h2>
        <Link to={`/shows/${show.id}`}>{show.title}</Link>
      </h2>
      <p>
        Genres:{" "}
        {show.genreIds.map((genreId) => getGenreTitle(genreId)).join(", ")}
      </p>
      <p>Last updated: {lastUpdated}</p>
    </div>
  );
};

export default ShowPreview;