import React, { useState, useEffect } from "react";
import "./image.css";

const Image = ({
  setImage,
  imageTitle,
  zoomedImage,
  mobileImage,
  gallery = [],
}) => {
  const [imageSrc, setImageSrc] = useState(setImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  useEffect(() => {
    if (gallery.length > 0) {
      setCurrentImageIndex(gallery.findIndex((img) => img.url === setImage));
    }
  }, [gallery, setImage]);

  const showNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % gallery.length;
    setCurrentImageIndex(nextIndex);
    setImageSrc(gallery[nextIndex].url);
  };

  const showPrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + gallery.length) % gallery.length;
    setCurrentImageIndex(prevIndex);
    setImageSrc(gallery[prevIndex].url);
  };

  return (
    <>
      <div className={"image-cont"}>
        <img
          src={`${imageSrc}?fit=fill`}
          className={"image-style"}
          alt={imageTitle}
          onClick={toggleZoom}
        />
      </div>

      {isZoomed && (
        <div className="modal" onClick={toggleZoom}>
          <button className="nav-button left" onClick={showPrevImage}>
            &lt;
          </button>
          <div className={"zoomed-cont"}>
            <img src={imageSrc} className={"zoomed-style"} alt={imageTitle} />
          </div>
          <button className="nav-button right" onClick={showNextImage}>
            &gt;
          </button>
        </div>
      )}
    </>
  );
};

export default Image;
