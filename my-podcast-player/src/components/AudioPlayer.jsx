import React, { useRef, useEffect, useState } from "react";

const AudioPlayer = ({ src, userProgress, setUserProgress }) => {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);

  const handleTimeUpdate = (e) => {
    // Save progress every 10 seconds
    if (Math.floor(e.target.currentTime) % 10 === 0) {
      setUserProgress((prevState) => {
        const newProgress = { ...prevState, [src]: e.target.currentTime };
        localStorage.setItem("userProgress", JSON.stringify(newProgress));
        return newProgress;
      });
    }
  };

  useEffect(() => {
    // Show confirm dialog when page closes
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    });

    // Update audio player's currentTime based on user progress
    if (userProgress[src]) {
      audioRef.current.currentTime = userProgress[src];
      setPlaying(true);
    }
  }, [src, userProgress]);

  const handlePlayPause = () => {
    setPlaying(!playing);
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
      <button onClick={handlePlayPause}>{playing ? "Pause" : "Resume"}</button>
    </div>
  );
};

export default AudioPlayer;
