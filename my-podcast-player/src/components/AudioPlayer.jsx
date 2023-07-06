import React, { useRef, useEffect, useState } from "react";

const AudioPlayer = ({ src, episodeId, userProgress, updateUserProgress }) => {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Update audio player's currentTime based on user progress
    if (episodeId && userProgress && userProgress[episodeId]) {
      audioRef.current.currentTime = userProgress[episodeId];
    }
  }, [src, episodeId, userProgress]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (playing) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? The audio is still playing.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [playing]);

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (episodeId) {
      updateUserProgress(episodeId, audioRef.current.currentTime);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      ></audio>
      {playing && <p>Audio playing</p>}
      <button onClick={togglePlay}>{playing ? "Pause" : "Resume"}</button>
    </div>
  );
};

export default AudioPlayer;
