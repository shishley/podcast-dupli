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
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
    /*
remembers and shows what episodes user listened all the way through: userProgress state remembers the progress
 for each episode using their episodeId. progress stored in localStorage.
*/
    const storedProgress = JSON.parse(localStorage.getItem("userProgress"));
    if (storedProgress) {
      setUserProgress(storedProgress);
    }
  }, []);

  useEffect(() => {
    console.log("favorites state updated:", favorites);
  }, [favorites]);

  //
  useEffect(() => {
    // Show reset confirmation dialog
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      if (Object.keys(userProgress).length > 0 || favorites.length > 0) {
        e.returnValue = "";
        return "";
      }
    });
  }, [userProgress, favorites]);
  /*
option to "reset" all their progress, removing listening history:  the resetProgress function clears
 the userProgress state and removes the userProgress and favorites data from localStorage.
*/
  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setUserProgress({});
      localStorage.removeItem("userProgress");
      setFavorites([]);
      localStorage.removeItem("favorites");
    }
  };
  /*
   remembers the exact timestamp where user stopped listening within a 10 seconds accuracy of closing:
     updateUserProgress function updates the userProgress state with the current time of the audio player.
      which then is called on the onTimeUpdate event of the audio element in AudioPlayer component
  */
  const updateUserProgress = (episodeId, currentTime) => {
    setUserProgress((prevProgress) => ({
      ...prevProgress,
      [episodeId]: currentTime,
    }));
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
                userProgress={userProgress}
                updateUserProgress={updateUserProgress}
                currentEpisode={currentEpisode}
                setCurrentEpisode={setCurrentEpisode}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
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
        <AudioPlayer
          src={currentEpisode?.file}
          episodeId={currentEpisode?.id}
          userProgress={userProgress}
          updateUserProgress={updateUserProgress}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </Router>
      <footer className="App-footer">
        <button onClick={resetProgress}>Reset all progress</button>
      </footer>
    </div>
  );
}

export default App;
