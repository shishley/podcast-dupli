import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ShowList from "./components/ShowList";
import ShowDetails from "./components/ShowDetails";
import AudioPlayer from "./components/AudioPlayer";
import SeasonEpisodes from "./components/SeasonEpisodes";
import FavoritesList from "./components/FavoritesList";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }

    const storedProgress = JSON.parse(localStorage.getItem("userProgress"));
    if (storedProgress) {
      setUserProgress(storedProgress);
    }
  }, []);

  const resetProgress = () => {
    setUserProgress({});
    localStorage.removeItem("userProgress");
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ShowList />} />
          <Route
            path="/shows/:showId"
            element={
              <ShowDetails favorites={favorites} setFavorites={setFavorites} />
            }
          />
          <Route
            path="/shows/:showId/seasons/:season"
            element={
              <SeasonEpisodes
                favorites={favorites}
                setFavorites={setFavorites}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesList
                favorites={favorites}
                setFavorites={setFavorites}
              />
            }
          />
        </Routes>
      </Router>
      <footer className="App-footer">
        <AudioPlayer
          src="https://example.com/path/to/your/audio/file.mp3"
          userProgress={userProgress}
          setUserProgress={setUserProgress}
        />
        <button onClick={resetProgress}>Reset progress</button>
      </footer>
    </div>
  );
}

export default App;
