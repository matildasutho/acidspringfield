import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Nav from "./components/nav/nav";
import Home from "./pages/home/home";
import Info from "./pages/info/info";
import Projects from "./pages/projects/projects";
import ProjectSubPage from "./pages/projectSubPage/projectSubPage";
import Footer from "./components/footer/footer";
import Organ from "./components/organ/organ";
import Splash from "./components/splash/splash";
import { AudioProvider } from "./components/audiocontext/AudioContext";
import ScrollText from "./components/scrolltext/scrolltext";
import "./App.css";

function updateCSSVariables() {
  if (document.body.classList.contains("home-page")) {
    document.documentElement.style.setProperty("--overlay", "#9D989A");
    document.documentElement.style.setProperty("--background", "#FFF5E1E5");
    document.documentElement.style.setProperty("--active", "#9D989A");
    document.documentElement.style.setProperty("--opacity", "1");
    document.documentElement.style.setProperty("--banner1", "#FFF5E1");
    document.documentElement.style.setProperty("--banner2", "#000000");
  } else if (document.body.classList.contains("info-page")) {
    document.documentElement.style.setProperty("--overlay", "#FFF5E1");
    document.documentElement.style.setProperty("--background", "#007be5");
    document.documentElement.style.setProperty("--active", "#000000");
    document.documentElement.style.setProperty("--hover", "#DDE2D6");
    document.documentElement.style.setProperty("--opacity", "0.08");
    document.documentElement.style.setProperty("--banner1", "#DDE2D6");
    document.documentElement.style.setProperty("--banner2", "#007BE5");
  } else {
    document.documentElement.style.setProperty("--overlay", "#007be5");
    document.documentElement.style.setProperty("--background", "#FFFFFF");
    document.documentElement.style.setProperty("--active", "#000000");
    document.documentElement.style.setProperty("--hover", "#007be55E");
    document.documentElement.style.setProperty("--opacity", "0.13");
    document.documentElement.style.setProperty("--banner1", "#DDE2D6");
    document.documentElement.style.setProperty("--banner2", "#007BE5");
  }
}

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("splashShown") !== "true";
  });
  const [audioObject, setAudioObject] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (
      location.pathname === "/" &&
      sessionStorage.getItem("splashShown") !== "true"
    ) {
      setShowSplash(true);
    } else {
      setShowSplash(false);
    }
  }, [location]);

  const handleHideSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  };

  useEffect(() => {
    updateCSSVariables();
    window.addEventListener("popstate", updateCSSVariables);
    return () => {
      window.removeEventListener("popstate", updateCSSVariables);
    };
  }, []);

  return (
    <div>
      {showSplash ? (
        <Splash onHide={handleHideSplash} />
      ) : (
        <div
          id="main-container"
          className={location.pathname === "/" ? "home-page" : ""}
        >
          <Nav />
          <TransitionGroup>
            {/* {audioObject && audioContext && ( */}
            <Organ audioObject={audioObject} audioContext={audioContext} />
            {/* )} */}
            <CSSTransition key={location.key} timeout={1000} classNames="fade">
              <div id="content-container">
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectSubPage />} />
                </Routes>

                <Footer />
                <ScrollText />
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      )}
    </div>
  );
}

function AppWrapper() {
  const audioRefs = useRef([]);
  return (
    <AudioProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AudioProvider>
  );
}

export default AppWrapper;