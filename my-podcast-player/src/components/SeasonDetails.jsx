import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const SeasonDetails = () => {
  const { showId, seasonId } = useParams();
  const [season, setSeason] = useState(null);

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
          <li key={episode.id}>{episode.title}</li>
        ))}
      </ul>
      <Link to={`/shows/${showId}`}>Back to show details</Link>
    </div>
  );
};

export default SeasonDetails;