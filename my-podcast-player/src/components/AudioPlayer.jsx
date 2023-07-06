import React, { useRef, useEffect, useState } from "react";

const AudioPlayer = ({
  src,
  episodeId,
  userProgress,
  updateUserProgress,
  isPlaying,
  setIsPlaying,
}) => {
  const audioRef = useRef();

  useEffect(() => {
    // Update audio player's currentTime based on user progress
    if (episodeId && userProgress && userProgress[episodeId]) {
      audioRef.current.currentTime = userProgress[episodeId];
    }
  }, [src, episodeId, userProgress]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
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
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      ></audio>
      {isPlaying && <p>Audio playing</p>}
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Resume"}</button>
    </div>
  );
};

export default AudioPlayer;
