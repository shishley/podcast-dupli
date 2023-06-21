import React, { useRef, useEffect } from "react";

const AudioPlayer = ({ src, userProgress, setUserProgress }) => {
  const audioRef = useRef();

  const handleTimeUpdate = (e) => {
    console.log("Current time:", e.target.currentTime);
    
    // Save user progress to local storage
    setUserProgress((prevState) => {
      const newProgress = { ...prevState, [src]: e.target.currentTime };
      localStorage.setItem("userProgress", JSON.stringify(newProgress));
      return newProgress;
    });
  };

  useEffect(() => {
    // Update audio player's currentTime based on user progress
    if (userProgress[src]) {
      audioRef.current.currentTime = userProgress[src];
    }
  }, [src, userProgress]);

  return (
    <audio
      ref={audioRef}
      src={src}
      controls
      onTimeUpdate={handleTimeUpdate}
    ></audio>
  );
};

export default AudioPlayer;
