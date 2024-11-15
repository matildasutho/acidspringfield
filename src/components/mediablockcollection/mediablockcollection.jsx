import React, { useRef, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  // console.log("MediaBlockCollection items:", items);

  return (
    <div className="media-block-collection">
      {items.map((item, index) => {
        // console.log("Rendering item:", item);

        if (item.__typename === "ComponentVideoTextBlock") {
          const textStyle = {
            marginLeft:
              item.textPosition === true
                ? "0"
                : item.textPosition === false
                ? "auto"
                : "6rem",
          };

          if (item.reelFormat) {
            // Render video reel component
            return (
              <div key={index} className="media-block video-reel">
                <VideoPlayer src={item.video.url} />
                {item.videoText && (
                  <div className="video-text" style={textStyle}>
                    {documentToReactComponents(item.videoText.json)}
                  </div>
                )}
              </div>
            );
          } else {
            // Render regular full width video component
            return (
              <div key={index} className="media-block video-full">
                <VideoPlayer src={item.video.url} />
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
            marginLeft:
              item.textAlignment === true
                ? "0"
                : item.textAlignment === false
                ? "auto"
                : "6rem",
            width: item.textWidth ? "100%" : "50%",
          };

          return (
            <div
              key={index}
              className="media-block text-block"
              style={textStyle}
            >
              {documentToReactComponents(item.textContent.json)}
            </div>
          );
        } else if (item.__typename === "ComponentImageBlockDouble") {
          // Handle ComponentImageBlockDouble
          const doubleImageStyle = {
            flexDirection: item.layout ? "row" : "column",
            width: item.layout ? "480px" : "323px",
            height: item.layout ? "323px" : "480px",
            marginLeft:
              item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "auto"
                : "6rem",
          };

          return (
            <div
              key={index}
              className="image-block-double"
              style={doubleImageStyle}
            >
              {item.imageBlockCollection.items.map((image, imgIndex) => (
                <div key={imgIndex} className="double-image">
                  <LazyLoadMedia
                    src={image.url}
                    type="image"
                    alt={image.title}
                    className="image"
                  />
                </div>
              ))}
            </div>
          );
        } else if (item.__typename === "ComponentImageBlockSingle") {
          // Handle ComponentImageBlockSingle
          const fullWidth = {
            width: "100%",
            height: "auto",
          };
          const halfWidth = {
            width:
              item.imageOrientation === true
                ? "480px"
                : item.imageOrientation === false
                ? "323px"
                : "calc(100vw / 12 * 4)",
            height:
              item.imageOrientation === true
                ? "323px"
                : item.imageOrientation === false
                ? "480px"
                : "auto",
            marginLeft:
              item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "auto"
                : "6rem",
          };

          return (
            <div
              key={index}
              className={`image-block-single ${item.layout}`}
              style={item.imageWidth ? fullWidth : halfWidth}
            >
              <div className="image-container">
                <LazyLoadMedia
                  src={item.image.url}
                  type="image"
                  alt={item.image.title}
                  className="image"
                />
              </div>
            </div>
          );
        } else if (item.__typename === "ComponentProjectMediaGallery") {
          // Handle ComponentProjectMediaGallery
          const galleryStyle = {
            width: item.galleryWidth ? "calc(100vw / 12 * 4)" : "100%",
            marginLeft: item.galleryAlignment ? "0" : "auto",
          };

          return (
            <div
              key={index}
              className="media-block media-gallery"
              style={galleryStyle}
            >
              <div className="gallery-container">
                {item.galleryContentCollection.items.map(
                  (media, mediaIndex) => (
                    <div key={mediaIndex} className="gallery-item">
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
            </div>
          );
        }
      })}
    </div>
  );
};

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
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

  return (
    <div className="video-player">
      <video ref={videoRef} className="video" src={src} />
      <div className="video-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default MediaBlockCollection;
