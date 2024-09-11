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
import { AudioProvider } from "./components/audiocontext/AudioContext";
import ToggleButton from "./components/togglebutton/togglebutton";
import "./App.css";

function updateCSSVariables() {
  if (document.body.classList.contains("home-page")) {
    document.documentElement.style.setProperty("--overlay", "#9D989A"); // Example color
    document.documentElement.style.setProperty("--background", "#FFF5E1"); // Example color
    document.documentElement.style.setProperty("--active", "#9D989A"); // Example color
    document.documentElement.style.setProperty("--BG-color", "rgba(255, 255, 255, 0.0)");
  } else {
    document.documentElement.style.setProperty("--overlay", "#007be5");
    document.documentElement.style.setProperty("--background", "#DDE2D6");
    document.documentElement.style.setProperty("--active", "#000000");
    document.documentElement.style.setProperty("--hover", "#007be5");
    document.documentElement.style.setProperty("--BG-color", "rgba(255, 255, 255, 0.8)");
  }
}

function App() {
  const location = useLocation();

  useEffect(() => {
    updateCSSVariables();
    window.addEventListener("popstate", updateCSSVariables);
    return () => {
      window.removeEventListener("popstate", updateCSSVariables);
    };
  }, []);

  return (
    <div>
      <div id="main-container">
        <Nav />
        <TransitionGroup>
          <Organ />
            <CSSTransition
              key={location.key}
              timeout={1000}
              classNames="fade"
            >
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