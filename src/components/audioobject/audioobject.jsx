import React, { useRef } from "react";
import "./audioobject.css";

const AudioObject = React.forwardRef(({ source, label }, ref) => {
  const audioRef = useRef(null);

  const handleTogglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      console.log("playing");
    } else {
      audioRef.current.pause();
      console.log("paused");
    }
  };

  return (
    <div className="audio-cont" onClick={handleTogglePlayPause}>
      <span className="point"></span>
      <audio ref={audioRef} loop src={source}></audio>
      <h4>{label}</h4>
    </div>
  );
});

export default AudioObject;
