import React, { useEffect, useState, useCallback, useRef } from "react";
import RightColumn from "../../components/rightColumn/rightColumn";

import "./home.css";

const Home = ({ onAudioReady }) => {
  const [audioObject, setAudioObject] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [showTrigger, setShowTrigger] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const audiotrigger = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  useEffect(() => {
    if (!fadeOut && audiotrigger.current) {
      audiotrigger.current.classList.remove("hidden");
    }
  }, [fadeOut]);

  const handleAudioReady = useCallback((audioObj, audioCtx) => {
    setAudioObject(audioObj);
    setAudioContext(audioCtx);
    audioContextRef.current = audioCtx;
  }, []);

  const handleTriggerClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowTrigger(false);
    }, 1000); // Adjust the timeout duration to match the fade-out animation duration
  };

  return (
    <>
      {showTrigger && (
        <div
          ref={audiotrigger}
          className={`audio-trig emph-txt fade-in ${fadeOut ? "fade-out" : ""}`}
          onClick={handleTriggerClick}
        >
          <h3>
            Click to build your own mix of Acid Springfield samples and field
            recordings.
          </h3>
        </div>
      )}
      <div className="main-container">
        <div className="content">
          {/* <MusicPlayer onAudioReady={handleAudioReady} /> */}
          <div className="cloud-BG"></div>
        </div>
      </div>
      <RightColumn text="" />
    </>
  );
};

export default Home;
