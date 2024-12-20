import React, { useState, useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import Image from "../Image/Image"; // Adjust the import path as necessary
import "./mediablockcollection.css";
import Footer from "../footer/footer.jsx";

const MediaBlockCollection = ({ items }) => {
  const [modalImage, setModalImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handleImageClick = (src, title, gallery = []) => {
    setModalImage({ src, title });
    setGalleryImages(gallery);
    setCurrentImageIndex(gallery.findIndex((img) => img.url === src));
  };

  const closeModal = () => {
    setModalImage(null);
    setGalleryImages([]);
    setCurrentImageIndex(0);
  };

  const scrollGallery = (direction) => {
    const galleryContainer = document.querySelector(".gallery-container");
    const scrollAmount = direction === "left" ? -300 : 300;
    galleryContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    console.log("scrolling", direction);
  };

  return (
    <>
      <div className="media-block-collection">
        {items.map((item, index) => {
          if (item.__typename === "ComponentVideoTextBlock") {
            const textStyle = {
              marginLeft: isMobile
                ? "0"
                : item.textPosition === true
                ? "0"
                : item.textPosition === false
                ? "auto"
                : "6rem",
            };
            const reelStyle = {
              width: isMobile ? "80%" : "calc(100vw / 12 * 4)",
              marginLeft: isMobile ? "10%" : "6em",
            };
            if (item.reelFormat) {
              return (
                <div key={item.sys.id} className="media-block video-reel">
                  <VideoPlayer src={item.video.url} style={reelStyle} />
                  {item.videoText && (
                    <div className="video-text" style={textStyle}>
                      {documentToReactComponents(item.videoText.json)}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div>
                  <div key={item.sys.id} className="media-block">
                    <VideoPlayer src={item.video.url} />
                  </div>
                  {item.videoText && (
                    <div className="video-text" style={textStyle}>
                      {documentToReactComponents(item.videoText.json)}
                    </div>
                  )}
                </div>
              );
            }
          } else if (item.__typename === "ComponentText") {
            const textStyle = {
              marginLeft: isMobile
                ? "0"
                : item.textAlignment === true
                ? "0"
                : item.textAlignment === false
                ? "auto"
                : "6rem",
              width: isMobile ? "100%" : item.textWidth ? "100%" : "50%",
            };

            return (
              <div
                key={item.sys.id}
                className="media-block text-block"
                style={textStyle}
              >
                {documentToReactComponents(item.textContent.json)}
              </div>
            );
          } else if (item.__typename === "ComponentImageBlockDouble") {
            const doubleImageStyle = {
              width: isMobile ? "100%" : "calc(100vw / 12 * 4)",
              objectFit: "cover",
              aspectRatio: item.layout ? "4/6" : "6/4",
              marginLeft:
                isMobile && item.imageAlignment === false
                  ? "0rem"
                  : item.imageAlignment === true
                  ? "0"
                  : item.imageAlignment === false
                  ? "auto"
                  : "6rem",
            };
            const containerStyle = {
              boxSizing: "border-box",
              display: "flex",
              flexDirection: item.layout ? "row" : "column",
              gap: "var(--global-padding)",
            };

            return (
              <div key={item.sys.id} className="image-block-double">
                <div style={containerStyle}>
                  {item.imageBlockCollection.items.map((image, imgIndex) => (
                    <div
                      key={item.sys.id + imgIndex}
                      className="double-image"
                      onClick={() =>
                        handleImageClick(
                          image.url,
                          image.title,
                          item.imageBlockCollection.items
                        )
                      }
                    >
                      <LazyLoadMedia
                        src={image.url}
                        type="image"
                        alt={image.title}
                        style={doubleImageStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          } else if (item.__typename === "ComponentImageBlockSingle") {
            const fullWidth = {
              width: "100%",
              height: "auto",
            };
            const halfWidth = {
              aspectRatio:
                item.imageOrientation === true
                  ? "4/6"
                  : item.imageOrientation === false
                  ? "6/4"
                  : "1/1",
              width: isMobile ? "100%" : "calc(100vw / 12 * 4)",

              marginLeft: isMobile
                ? "0"
                : item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "auto"
                : "6rem",
            };

            return (
              <div
                key={item.sys.id}
                className={`image-block-single ${item.layout}`}
                style={item.imageWidth ? fullWidth : halfWidth}
                onClick={() =>
                  handleImageClick(item.image.url, item.image.title)
                }
              >
                <div className="image-container">
                  <LazyLoadMedia
                    src={item.image.url}
                    type="image"
                    alt={item.image.title}
                    className="image"
                  />
                </div>
                <p>{item.image.description}</p>
              </div>
            );
          } else if (item.__typename === "ComponentProjectMediaGallery") {
            const galleryStyle = {
              width: item.galleryWidth ? "calc(100vw / 12 * 4)" : "100%",
              marginLeft: item.galleryAlignment ? "0" : "auto",
            };

            return (
              <div
                key={item.sys.id}
                className="media-block media-gallery"
                style={galleryStyle}
              >
                <div className="gallery-container">
                  {item.galleryContentCollection.items.map(
                    (media, mediaIndex) => (
                      <div
                        key={item.sys.id + mediaIndex}
                        className="gallery-item"
                        onClick={() =>
                          handleImageClick(
                            media.url,
                            media.title,
                            item.galleryContentCollection.items
                          )
                        }
                        onTouchEvent={() =>
                          handleImageClick(
                            media.url,
                            media.title,
                            item.galleryContentCollection.items
                          )
                        }
                      >
                        <LazyLoadMedia
                          src={media.url}
                          type="image"
                          alt={media.title}
                          className="gallery-media"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="gallery-arrows">
                  <button
                    onClick={() => scrollGallery("left")}
                    onTouchEvent={() => scrollGallery("left")}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => scrollGallery("right")}
                    onTouchEvent={() => scrollGallery("right")}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            );
          } else {
            console.log("Unknown item type:", item);
            return null;
          }
        })}
        {modalImage && (
          <div key={modalImage.src} className="modal" onClick={closeModal}>
            <Image
              setImage={modalImage.src}
              imageTitle={modalImage.title}
              zoomedImage={modalImage.src}
              mobileImage={modalImage.src}
              gallery={galleryImages}
            />
          </div>
        )}
        {isMobile && <Footer />}
      </div>
    </>
  );
};

const VideoPlayer = ({ src, style }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen(); // Firefox
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen(); // Chrome, Safari and Opera
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen(); // IE/Edge
    }
  };

  return (
    <div className="video-player" style={style}>
      <video className="video" src={src} ref={videoRef} />
      <div className="video-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
      <button className="fullscreen-button smll-txt" onClick={handleFullScreen}>
        VIEW FULL SCREEN
      </button>
    </div>
  );
};

export default MediaBlockCollection;
