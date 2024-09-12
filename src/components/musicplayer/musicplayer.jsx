import React, { useState, useEffect, useRef } from "react";
import "./musicplayer.css"; // Ensure you have the necessary CSS for positioning

const Goobath = [
  "/samples/Goobath/deep_bass.wav",
  "/samples/Goobath/demon_spring.wav",
  "/samples/Goobath/peace_pad.wav",
  "/samples/Goobath/pluck.wav",
  "/samples/Goobath/reverse_metalscrape.wav",
  "/samples/Goobath/swamp_soda.wav",
  "/samples/Goobath/waterlogged_dub.wav",
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrigger, setShowTrigger] = useState(true);
  const [audioSamples, setAudioSamples] = useState([]);
  const audiotrigger = useRef(null);
  const audioRefs = useRef([]);
  const animationStyleSheet = useRef(null);

  const handleTogglePlayPause = (index) => {    
    if (audioRefs.current[index].paused) {
        audioRefs.current[index].play();
        console.log("playing");
        } else {
        audioRefs.current[index].pause();
        console.log("paused");
    }
    };

  const getRandomSample = (usedIndices) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * Goobath.length);
    } while (usedIndices.includes(randomIndex));
    return randomIndex;
  };

  const playRandomSamples = () => {
    const usedIndices = [];
    const selectedSamples = [];

    const gridPositions = [];
    for (let row = 2; row <= 10; row++) {
      for (let col = 1; col <= 9; col++) {
        gridPositions.push({ gridColumn: col, gridRow: row });
      }
    }

    for (let i = 0; i < 5; i++) {
      const randomIndex = getRandomSample(usedIndices);
      usedIndices.push(randomIndex);

      const randomPositionIndex = Math.floor(Math.random() * gridPositions.length);
      const position = gridPositions.splice(randomPositionIndex, 1)[0];

      selectedSamples.push({
        source: Goobath[randomIndex],
        label: Goobath[randomIndex].split("/samples/Goobath/").pop(),
        position: position,
      });
    }

    console.log(selectedSamples);
    setAudioSamples(selectedSamples);
  };

  const generateRandomKeyframes = () => {
    const x1 = Math.random() * 15 - 12; 
    const y1 = Math.random() * 15 - 12; 
    const x2 = Math.random() * 15 - 12; 
    const y2 = Math.random() * 15 - 12; 

    return `
      @keyframes float${Math.random().toString(36).substr(2, 9)} {
        0% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(${x1}px, ${y1}px);
        }
        50% {
          transform: translate(${x2}px, ${y2}px);
        }
        75% {
          transform: translate(${x1}px, ${y1}px);
        }
        100% {
          transform: translate(0, 0);
        }
      }
    `;
  };

  useEffect(() => {
    if (isPlaying) {
      playRandomSamples();
      console.log(isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!showTrigger && audiotrigger.current) {
      audiotrigger.current.style.display = "none";
    }
  }, [showTrigger]);

  useEffect(() => {
    if (!animationStyleSheet.current) {
      const style = document.createElement("style");
      document.head.appendChild(style);
      animationStyleSheet.current = style.sheet;
    }

    audioSamples.forEach((sample, index) => {
      const keyframes = generateRandomKeyframes();
      animationStyleSheet.current.insertRule(keyframes, animationStyleSheet.current.cssRules.length);
      const animationName = keyframes.match(/@keyframes\s+(\S+)\s*\{/)[1];
      audioRefs.current[index].parentElement.style.animation = `${animationName} 15s ease-in-out infinite`;
    });
  }, [audioSamples]);

  return (
    <>
      <div
        ref={audiotrigger}
        className="audio-trig emph-txt fade-in"
        onClick={() => {
          setIsPlaying(true);
          setShowTrigger(false);
        }}
      >
        <h3>
          By entering this site, you agree to participate actively in the auditory
          experience that is Acid Springfield.
        </h3>
      </div>
      <div className="player-cont">
      {audioSamples.map((sample, index) => (
    <div
        key={index}
        className="audio-wrapper fade-in"
        style={{ gridColumn: sample.position.gridColumn, gridRow: sample.position.gridRow }}
        onClick={() => {
            handleTogglePlayPause(index);
        }}
    >
        <span className="point-symbol"></span>
        <audio ref={(el) => (audioRefs.current[index] = el)} src={sample.source} loop />
        <p>{sample.label}</p>
    </div>
))}
      </div>
    </>
  );
};

export default MusicPlayer;

