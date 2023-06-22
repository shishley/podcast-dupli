import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import { getGenreTitle } from "../helpers/genres";
import "./App.css";

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("title_asc");
  const [genreFilter, setGenreFilter] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          "https://podcast-api.netlify.app/shows"
        );
        setShows(response.data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchShows();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const sortShows = (shows) => {
    switch (sortType) {
      case "title_asc":
        return [...shows].sort((a, b) =>
          a.title && b.title ? a.title.localeCompare(b.title) : 0
        );
      case "title_desc":
        return [...shows].sort((a, b) =>
          a.title && b.title ? b.title.localeCompare(a.title) : 0
        );
      case "updated_asc":
        return [...shows].sort(
          (a, b) => new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt)
        );
      case "updated_desc":
        return [...shows].sort(
          (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
        );
      default:
        return shows;
    }
  };

  const options = {
    includeScore: true,
    keys: ["title"],
  };

  const fuse = new Fuse(shows, options);
  const results = searchTerm ? fuse.search(searchTerm) : shows;
  const sortedShows = sortShows(results);

  const handleGenreClick = (genre) => {
    setGenreFilter(genre);
  };

  const filteredShows = genreFilter
    ? sortedShows.filter((show) =>
        show.item
          ? show.item.genres.includes(genreFilter)
          : show.genres.includes(genreFilter)
      )
    : sortedShows;

  return (
    <div>
      <h1>Podcast Player</h1>
      <input
        type="text"
        placeholder="Search shows..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <select value={sortType} onChange={handleSortChange}>
        <option value="title_asc">Title (A-Z)</option>
        <option value="title_desc">Title (Z-A)</option>
        <option value="updated_asc">Last Updated (Oldest)</option>
        <option value="updated_desc">Last Updated (Newest)</option>
      </select>

      <ul>
        {filteredShows.map((show) => {
          const showData = show.item ? show.item : show;
          const genreTitles = showData.genres.map(getGenreTitle);

          return (
            <li key={showData.id}>
              <Link to={`/shows/${showData.id}`}>
                {showData.title}
                <img
                  src={showData.image}
                  alt={showData.title}
                  width="100"
                  height="100"
                />
              </Link>
              <div>Genres: {genreTitles.join(", ")}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowList;
