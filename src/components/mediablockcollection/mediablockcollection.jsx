import React, { useRef, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  return (
    <div className="media-block-collection">
      {items.map((item, index) => {
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
            return (
              <div key={index} className="media-block video-reel">
                <VideoPlayer src={item.video.url} style={{ width: "277px" }} />
                {item.videoText && (
                  <div className="video-text" style={textStyle}>
                    {documentToReactComponents(item.videoText.json)}
                  </div>
                )}
              </div>
            );
          } else {
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
          const doubleImageStyle = {
            flexDirection: item.layout ? "row" : "column",
            width: item.layout ? "247px" : "247px",
            height: item.layout ? "323px" : "323px",
            marginLeft:
              item.imageAlignment === true
                ? "0"
                : item.imageAlignment === false
                ? "auto"
                : "6rem",
          };
          const containerStyle = {
            boxSizing: "border-box",
            display: "flex",
            flexDirection: item.imageAlignment === true ? "row" : "row-reverse",
            gap: "var(--global-padding)",
          };

          return (
            <div key={index} className="image-block-double">
              <div style={containerStyle}>
                {item.imageBlockCollection.items.map((image, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="double-image"
                    style={doubleImageStyle}
                  >
                    <LazyLoadMedia
                      src={image.url}
                      type="image"
                      alt={image.title}
                      className="image"
                    />
                  </div>
                ))}
                {item.textBlock && (
                  <div className="text-container">
                    {documentToReactComponents(item.textBlock.json)}
                  </div>
                )}
              </div>
            </div>
          );
        } else if (item.__typename === "ComponentImageBlockSingle") {
          const fullWidth = {
            width: "100%",
            height: "auto",
          };
          const halfWidth = {
            width: item.imageOrientation === true ? "480px" : "323px",
            height:
              item.imageOrientation === true
                ? "323px"
                : item.imageOrientation === false
                ? "480px"
                : "auto",
          };

          const containerStyle = {
            display: "flex",
            flexDirection: item.imageAlignment === true ? "row" : "row-reverse",
            gap: "var(--global-padding)",
          };

          const imageStyle = item.imageWidth ? fullWidth : halfWidth;

          return (
            <div key={index} className="image-block-single">
              <div style={containerStyle}>
                <div className="image-container" style={imageStyle}>
                  <LazyLoadMedia
                    src={item.image.url}
                    type="image"
                    alt={item.image.title}
                    className="image"
                  />
                </div>
                {item.textBlock && (
                  <div className="text-container">
                    {documentToReactComponents(item.textBlock.json)}
                  </div>
                )}
              </div>
            </div>
          );
        } else if (item.__typename === "ComponentProjectMediaGallery") {
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

const VideoPlayer = ({ src, style }) => {
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
      <video ref={videoRef} className="video" src={src} style={style} />
      <div className="video-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
    </div>
  );
};

export default MediaBlockCollection;
