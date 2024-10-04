import React, { useState, useEffect, useRef } from "react";
import "./musicplayer.css"; // Ensure you have the necessary CSS for positioning

const Goobath = [
  "/samples/Goobath/compost_horn.mp3",
  "/samples/Goobath/cork_pop.mp3",
  "/samples/Goobath/deep_bass.mp3",
  "/samples/Goobath/demon_spring.mp3",
  "/samples/Goobath/openoneeye.mp3",
  "/samples/Goobath/peace_pad.mp3",
  "/samples/Goobath/pluck.mp3",
  "/samples/Goobath/reverse_metalscrape.mp3",
  "/samples/Goobath/swamp_soda.mp3",
  "/samples/Goobath/waterlogged_dub.mp3",
];

const MusicPlayer = ({ onAudioReady }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrigger, setShowTrigger] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [audioSamples, setAudioSamples] = useState([]);
  const audiotrigger = useRef(null);
  const audioRefs = useRef([]);
  const animationStyleSheet = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioObject = new Audio();
    const audioSource =
      audioContextRef.current.createMediaElementSource(audioObject);
    audioSource.connect(audioContextRef.current.destination);

    onAudioReady(audioObject, audioContextRef.current);
  }, [onAudioReady]);

  const handleTogglePlayPause = (index) => {
    const audioElement = audioRefs.current[index];
    if (audioElement.paused) {
      audioElement.play();
      audioElement.parentElement.classList.add("audio-playing");
      setIsPlaying(true);
      // console.log("playing");
    } else {
      audioElement.pause();
      audioElement.parentElement.classList.remove("audio-playing");
      setIsPlaying(false);
      // console.log("paused");
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

    for (let i = 0; i < Goobath.length; i++) {
      const randomIndex = getRandomSample(usedIndices);
      usedIndices.push(randomIndex);

      const randomPositionIndex = Math.floor(
        Math.random() * gridPositions.length
      );
      const position = gridPositions.splice(randomPositionIndex, 1)[0];

      selectedSamples.push({
        source: Goobath[randomIndex],
        label: Goobath[randomIndex].split("/samples/Goobath/").pop(),
        position: position,
      });
    }

    // console.log(selectedSamples);
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
    playRandomSamples();
  }, []);

  useEffect(() => {
    if (!fadeOut && audiotrigger.current) {
      audiotrigger.current.classList.remove("hidden");
    }
  }, [fadeOut]);

  useEffect(() => {
    if (!animationStyleSheet.current) {
      const style = document.createElement("style");
      document.head.appendChild(style);
      animationStyleSheet.current = style.sheet;
    }

    audioSamples.forEach((sample, index) => {
      const keyframes = generateRandomKeyframes();
      animationStyleSheet.current.insertRule(
        keyframes,
        animationStyleSheet.current.cssRules.length
      );
      const animationName = keyframes.match(/@keyframes\s+(\S+)\s*\{/)[1];
      audioRefs.current[
        index
      ].style.animation = `${animationName} 15s ease-in-out infinite-reverse`;
    });
  }, [audioSamples, isPlaying]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowTrigger(false);
      }, 500); // Match the CSS transition duration
    }, 5000); // Hide the trigger after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleUserGesture = () => {
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().then(() => {
        // console.log("AudioContext resumed");
      });
    }
  };


  return (
    <>
      {showTrigger && (
        <div
          ref={audiotrigger}
          className={`audio-trig emph-txt fade-in ${fadeOut ? "fade-out" : ""}`}
          onClick={handleUserGesture}
        >
          <h3>
            Click to build your own mix of Acid Springfield samples and field
            recordings.
          </h3>
        </div>
      )}
      <div className="player-cont">
        {audioSamples.map((sample, index) => (
          <div
            key={index}
            className="audio-wrapper fade-in"
            style={{
              gridColumn: sample.position.gridColumn,
              gridRow: sample.position.gridRow,
            }}
            onClick={() => {
              handleTogglePlayPause(index);
              handleUserGesture();
            }}
          >
            <span className="point-symbol"></span>
            <audio
              ref={(el) => (audioRefs.current[index] = el)}
              src={sample.source}
              onPlay={() => {
                audioRefs.current[index].parentElement.classList.add(
                  "audio-playing"
                );
              }}
              onPause={() => {
                audioRefs.current[index].parentElement.classList.remove(
                  "audio-playing"
                );
              }}
            />
            <p>{sample.label}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default MusicPlayer;
