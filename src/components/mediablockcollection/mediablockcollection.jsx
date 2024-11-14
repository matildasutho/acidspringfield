import React, { useRef, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  console.log("MediaBlockCollection items:", items);

  return (
    <div className="media-block-collection">
      {items.map((item, index) => {
        console.log("Rendering item:", item);

        if (item.video) {
          const textStyle = {
            marginLeft: item.textPosition ? "auto" : "6rem",
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
        } else if (item.textContent) {
          const textStyle = {
            marginLeft: item.textAlignment ? "var(--global-padding)" : "auto",
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
        } else if (item.imageBlockCollection) {
          // Handle ComponentImageBlockDouble
          const doubleImageStyle = {
            flexDirection: item.layout ? "row" : "column",
            width: "468px",
            height: item.layout ? "323px" : "600px",
            marginLeft: item.imageAlignment ? "0" : "auto",
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
        } else if (item.image) {
          // Handle ComponentImageBlockSingle
          const fullWidth = {
            width: "100%",
            height: "auto",
          };
          const halfWidth = {
            width: item.imageOrientation ? "480px" : "323px",
            height: item.imageOrientation ? "323px" : "480px",
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
              <p>{item.image.description}</p>
            </div>
          );
        } else if (item.componentProjectMediaGallery) {
          // Handle ComponentProjectMediaGallery
          console.log(
            "Rendering componentProjectMediaGallery:",
            item.componentProjectMediaGallery
          );
          console.log(
            "Gallery items:",
            item.componentProjectMediaGallery.galleryContentCollection.items
          );

          return (
            <div key={index} className="media-block media-gallery">
              <div className="gallery-container">
                {item.componentProjectMediaGallery.galleryContentCollection.items.map(
                  (media, mediaIndex) => {
                    console.log("Rendering media item:", media);
                    console.log("Media URL:", media.url);
                    return (
                      <div key={mediaIndex} className="gallery-item">
                        <LazyLoadMedia
                          src={media.url}
                          type="image"
                          alt={media.title}
                          className="gallery-media"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        } else {
          return null;
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
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
    </div>
  );
};

export default MediaBlockCollection;
