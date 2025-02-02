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
    window.matchMedia("(max-width: 900px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
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
    const scrollAmount = direction === "left" ? -400 : 400;
    galleryContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    console.log("scrolling", direction);
  };

  return (
    <>
      <div className="media-block-collection">
        {items.map((item, index) => {
          if (item.__typename === "ComponentVideoTextBlock") {
            const containerStyle = {
              width: isMobile
                ? "100%"
                : "calc((100vw / 12 * 8) - var(--global-padding) * 2)",
              display: "flex",
              flexDirection: isMobile
                ? "column"
                : item.textPosition
                ? "row"
                : "row-reverse",
            };
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
              width: isMobile ? "100%" : "calc(100vw / 12 * 4)",
              marginLeft: isMobile
                ? "0%"
                : item.textPosition === true
                ? "0"
                : item.textPosition === false
                ? "auto"
                : "6em",
            };

            if (item.reelFormat) {
              return (
                <div
                  key={item.sys.id}
                  className="media-block video-reel"
                  style={containerStyle}
                >
                  <VideoPlayer
                    src={item.video.url}
                    mobileSrc={item.mobileVideo?.url || item.video.url}
                    style={reelStyle}
                  />

                  {item.videoText && (
                    <div className="video-text" style={textStyle}>
                      {documentToReactComponents(item.videoText.json)}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={item.sys.id}>
                  <div className="media-block">
                    <VideoPlayer
                      src={item.video.url}
                      mobileSrc={item.mobileVideo?.url || item.video.url}
                    />
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
            const containerStyle = {
              display: "flex",
              flexDirection: "column", // Always use column layout
              gap: "var(--global-padding)",
              width: "100%", // Ensure the container takes up the full width
            };

            const imageBlock = {
              width: "100%", // Ensure the image block takes up the full width
              minHeight: isMobile ? "50vh" : "300px",
              display: "flex",
              flexDirection: item.layout ? "row" : "column", // Always use column layout
              gap: "0.5rem",
              marginLeft: isMobile
                ? "0rem"
                : item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "calc(100vw / 12 * 4 - (var(--global-padding) * 2))"
                : "6rem",
              marginRight: item.imageAlignment === false ? "0" : "auto",
            };

            const imageBlockMobile = {
              width: "100%", // Ensure the image block takes up the full width
              display: "flex",
              flexDirection: "column", // Always use column layout
              gap: "0.5rem",
            };

            const doubleImageMobile = {
              width: "100%",
              height: "auto",
              aspectRatio: "3/2",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            };

            const doubleImageStyle = {
              width: isMobile
                ? "100%"
                : item.layout
                ? "calc(100vw / 12 * 2 - 0.25rem)"
                : "calc(100vw / 12 * 4)", // Ensure the images take up the full width of the image block
              height: item.layout ? "calc(100vw / 12 * 3)" : "auto",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              aspectRatio: "3/2",
            };

            const textStyle = {
              width: isMobile ? "100%" : "calc(100vw / 12 * 4)",
              marginLeft: isMobile
                ? "0rem"
                : item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "calc(100vw / 12 * 4 - var(--global-padding) * 2 - 0.5rem)"
                : "6rem",
            };

            return (
              <div
                key={item.sys.id}
                className="image-block-double"
                style={containerStyle}
              >
                <div style={isMobile ? imageBlockMobile : imageBlock}>
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
                      style={{
                        ...(isMobile ? doubleImageMobile : doubleImageStyle),
                        backgroundImage: `url(${image.url})`,
                      }}
                    >
                      {/* Remove the img tag */}
                    </div>
                  ))}
                </div>
                {item.textBlock && (
                  <div className="text-container" style={textStyle}>
                    {documentToReactComponents(item.textBlock.json)}
                  </div>
                )}
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
            const containerStyle = {
              boxSizing: "border-box",
              display: "flex",
              flexDirection: isMobile
                ? "column"
                : item.imageWidth
                ? "column"
                : "row",
              gap: "var(--global-padding)",
            };
            const textStyle = {
              width: isMobile
                ? "100%"
                : "calc(100vw / 12 * 4 - var(--global-padding) * 3)",
              marginLeft:
                isMobile && item.imageAlignment === false
                  ? "0rem"
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
                style={containerStyle}
                onClick={() =>
                  handleImageClick(item.image.url, item.image.title)
                }
              >
                <div
                  className="image-container"
                  style={item.imageWidth ? fullWidth : halfWidth}
                >
                  <LazyLoadMedia
                    src={item.image.url}
                    type="image"
                    alt={item.image.title}
                    className="image"
                  />
                </div>
                {item.textBlock && (
                  <div className="text-container" style={textStyle}>
                    {documentToReactComponents(item.textBlock.json)}
                  </div>
                )}
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
                        onTouchStart={() =>
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
                    onTouchStart={() => scrollGallery("left")}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => scrollGallery("right")}
                    onTouchStart={() => scrollGallery("right")}
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

const VideoPlayer = ({ src, mobileSrc, style }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

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

  const videoSrc = isMobile && mobileSrc ? mobileSrc : src;

  return (
    <div className="video-player" style={style}>
      <video className="video" src={videoSrc} ref={videoRef} />
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
