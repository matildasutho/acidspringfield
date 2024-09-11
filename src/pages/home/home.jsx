import React from "react";
import { useEffect } from "react";
import RightColumn from "../../components/rightColumn/rightColumn";
import MusicPlayer from "../../components/musicplayer/musicplayer";

import "./home.css";

const Home = () => {
  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="content">
          <MusicPlayer />
          <div className="cloud-BG"></div>
        </div>
      </div>
      <RightColumn text="" />
    </>
  );
};

export default Home;
