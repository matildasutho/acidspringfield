import React from 'react';
import { useAudio } from '../audiocontext/AudioContext'; // Adjust the import path as necessary
import './togglebutton.css'; // Create and style this CSS file as needed

const ToggleButton = ({ audioRefs }) => {
  const { isPlaying, togglePlayback } = useAudio();

  const handleToggle = () => {
    togglePlayback();
    audioRefs.current.forEach(audio => {
      if (audio) {
        if (isPlaying) {
          audio.pause();
          console.log("allPaused");
        } else {
          audio.play();
          console.log("allPlayed");
        }
      }
    });
  };

  return (
    <button className="toggle-button" onClick={handleToggle}>
      {isPlaying ? 'Stop All' : 'Play All'}
    </button>
  );
};

export default ToggleButton;