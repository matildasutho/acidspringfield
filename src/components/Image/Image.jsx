import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";

import "./image.css";

const Image = ({ setImage, imageTitle, zoomedImage, mobileImage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageSrc, setImageSrc] = useState(setImage);


  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) {
        setImageSrc(mobileImage);
      } else {
        setImageSrc(setImage);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setImage, mobileImage]);

  return (
    <div className={"image-cont"}>
      <img
        src={imageSrc}
        className={"image-style"}
        alt={imageTitle}
        onClick={toggleZoom}
    
      />

      {isZoomed && (
        <div className={"zoomed-cont"}>
          <img
            src={imageSrc}
            className={"zoomed-style"}
            alt={imageTitle}
            onClick={toggleZoom}
    
          />
        </div>
      )}
    </div>
  );
};

export default Image;
