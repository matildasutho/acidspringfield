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
import ToggleButton from "./components/togglebutton/togglebutton";
import "./App.css";

function updateCSSVariables() {
  if (document.body.classList.contains("home-page")) {
    document.documentElement.style.setProperty("--overlay", "#9D989A"); // Example color
    document.documentElement.style.setProperty("--background", "#FFF5E1"); // Example color
    document.documentElement.style.setProperty("--active", "#9D989A"); // Example color
    document.documentElement.style.setProperty("--opacity", "1");
  } else {
    document.documentElement.style.setProperty("--overlay", "#007be5");
    document.documentElement.style.setProperty("--background", "#DDE2D6");
    document.documentElement.style.setProperty("--active", "#000000");
    document.documentElement.style.setProperty("--hover", "#007be55E");
    document.documentElement.style.setProperty("--opacity", "0.1");
  }
}

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("splashShown") !== "true";
  });

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
      {showSplash && <Splash onHide={handleHideSplash} />}
      {/* {!showSplash && ( */}
      <div id="main-container" className={showSplash ? "home-page" : ""}>
        <Nav />
        <TransitionGroup>
          <Organ />
          <CSSTransition key={location.key} timeout={1000} classNames="fade">
            <div id="content-container">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/info" element={<Info />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectSubPage />} />
              </Routes>

              <Footer />
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      {/* )} */}
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