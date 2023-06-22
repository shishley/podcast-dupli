import React from "react";
import { Link } from "react-router-dom";
import { getGenreTitle } from "../helpers/genres";
import "./App.css";

const ShowPreview = ({ show }) => {
  const lastUpdated = new Date(show.updated).toLocaleDateString();
  <p>
    Genres: {show.genreIds.map((genreId) => getGenreTitle(genreId)).join(", ")}
  </p>;

  return (
    <div>
      <h2>
        <Link to={`/shows/${show.id}`}>
          {show.title}
          <img
            src={showData.image}
            alt={showData.title}
            width="100"
            height="100"
          />
        </Link>
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
