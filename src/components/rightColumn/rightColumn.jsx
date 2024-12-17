import React, { useState, useEffect } from "react";
import "./rightColumn.css";

const RightColumn = ({ text, bgColor }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 900px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 900px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };
  const openOverlay = () => {
    setIsOverlayVisible(true);
  };
  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  return (
    <>
      {matches && (
        <>
          <div className="right-column-container">
            <div className="icon-container" onClick={closeOverlay}></div>
            <div className="col-inner" onClick={openOverlay}>
              <div className="smll-txt">{text}</div>
            </div>
          </div>
        </>
      )}

      {!matches && (
        <>
          <div className="right-column-container">
            <div
              className={`icon-container ${
                isOverlayVisible ? "expanded fade-in" : ""
              }`}
              onClick={closeOverlay}
            ></div>
            <div
              className={`col-inner ${
                isOverlayVisible ? "overlay-visible" : ""
              }`}
              onClick={openOverlay}
              style={{ backgroundColor: bgColor }}
            >
              <h3>Overview</h3>
              <div className="smll-txt">{text}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RightColumn;
