import React from "react";
import { useEffect, useState, useCallback } from "react";
import RightColumn from "../../components/rightColumn/rightColumn";
import MusicPlayer from "../../components/musicplayer/musicplayer";

import "./home.css";

const Home = ({ onAudioReady }) => {
  const [audioObject, setAudioObject] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  const handleAudioReady = useCallback((audioObj, audioCtx) => {
    setAudioObject(audioObj);
    setAudioContext(audioCtx);
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="content">
          {/* <MusicPlayer onAudioReady={handleAudioReady} /> */}
          <div className="cloud-BG"></div>
        </div>
      </div>
      {/* <RightColumn text="" /> */}
    </>
  );
};

export default Home;
