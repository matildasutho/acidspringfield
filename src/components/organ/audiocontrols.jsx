import React from "react";

const AudioControls = ({
  Goobath,
  handlePlayPause,
  audioRefs,
  buttonPositions,
  getFileName,
}) => {
  return (
    <div className="audio-controls">
      {Goobath.map((sample, index) => (
        <button
          key={index}
          onClick={() => handlePlayPause(index)}
          className="audio-button"
          ref={(el) => (audioRefs.current[index] = el)}
          style={{
            position: "absolute",
            top: buttonPositions[index]?.top,
            left: buttonPositions[index]?.left,
          }}
        >
          <span>{getFileName(sample)}</span>
          <span>.mp3</span>
        </button>
      ))}
    </div>
  );
};

export default AudioControls;
