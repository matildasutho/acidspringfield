import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Splash from "./components/splash/splash";
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
  } else {
    document.documentElement.style.setProperty("--overlay", "#6E6B6C");
    document.documentElement.style.setProperty("--background", "#dde2d6");
    document.documentElement.style.setProperty("--active", "#000000");
    document.documentElement.style.setProperty("--hover", "#007be5");
  }
}

function App() {
  const location = useLocation();

  // const [showSplash, setShowSplash] = useState(() => {
  //   return sessionStorage.getItem("splashShown") !== "true";
  // });
  
  useEffect(() => {
    updateCSSVariables();
    window.addEventListener("popstate", updateCSSVariables);
    return () => {
      window.removeEventListener("popstate", updateCSSVariables);
    };
  }, []);
  
  // useEffect(() => {
  //   if (
  //     location.pathname === "/" &&
  //     sessionStorage.getItem("splashShown") !== "true"
  //   ) {
  //     setShowSplash(true);
  //   } else {
  //     setShowSplash(false);
  //   }
  // }, [location]);

  // const handleHideSplash = () => {
  //   setShowSplash(false);
  //   sessionStorage.setItem("splashShown", "true");
  // };

  return (
    <div>
      {/* {showSplash && <Splash onHide={handleHideSplash} />}
      {!showSplash && ( */}
        <div id="main-container">
          {/* <Organ /> */}
          <Nav />
          <div id="content-container">
            <Routes render={({location}) => (
              <TransitionGroup>
              <CSSTransition
              key={location.key}
              timeout={450}
              clasNames="fade">
             
              <Route path="/" element={<Home />} />
              <Route path="/info" element={<Info />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectSubPage />} />
           
              </CSSTransition>
              </TransitionGroup>
            )}/>
            
            <Footer />
          </div>
        </div>
      {/* )} */}
    </div>
  );
}

function AppWrapper() {
  const audioRefs = useRef([]);
  return (
    <AudioProvider>
      {/* <ToggleButton audioRefs={audioRefs} /> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AudioProvider>
  );
}

export default AppWrapper;
