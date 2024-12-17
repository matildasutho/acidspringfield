import React, { useState, useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import Image from "../Image/Image"; // Adjust the import path as necessary
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  const [modalImage, setModalImage] = useState(null);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 600px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 600px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const handleImageClick = (src, title) => {
    setModalImage({ src, title });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      {matches && (
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
                    <VideoPlayer
                      src={item.video.url}
                      style={{ width: "277px" }}
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
                width: "247px",
                height: "323px",
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
                flexDirection: item.layout ? "row" : "column",
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
                          onClick={() =>
                            handleImageClick(image.url, image.title)
                          }
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
                width: item.imageOrientation ? "480px" : "323px",
                height: item.imageOrientation ? "240px" : "480px",
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
                      onClick={() =>
                        handleImageClick(item.image.url, item.image.title)
                      }
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
                  key={index}
                  className="media-block media-gallery"
                  style={galleryStyle}
                >
                  <div className="gallery-container">
                    {item.galleryContentCollection.items.map(
                      (media, mediaIndex) => (
                        <div
                          key={mediaIndex}
                          className="gallery-item"
                          onClick={() =>
                            handleImageClick(media.url, media.title)
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
                </div>
              );
            } else {
              console.log("Unknown item type:", item);
              return null;
            }
          })}
          {modalImage && (
            <Image
              setImage={modalImage.src}
              imageTitle={modalImage.title}
              zoomedImage={modalImage.src}
              mobileImage={modalImage.src}
            />
          )}
        </div>
      )}
      {!matches && ( // mobile view
        <div className="media-block-collection">
          {items.map((item, index) => {
            if (item.__typename === "ComponentVideoTextBlock") {
              // const textStyle = {
              //   marginLeft:
              //     item.textPosition === true
              //       ? "0"
              //       : item.textPosition === false
              //       ? "auto"
              //       : "6rem",
              // };

              if (item.reelFormat) {
                return (
                  <div key={index} className="media-block video-reel">
                    <VideoPlayer
                      src={item.video.url}
                      style={{ width: "277px" }}
                    />
                    {item.videoText && (
                      <div className="video-text">
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
                      <div className="video-text">
                        {documentToReactComponents(item.videoText.json)}
                      </div>
                    )}
                  </div>
                );
              }
            } else if (item.__typename === "ComponentText") {
              // const textStyle = {
              //   marginLeft:
              //     item.textAlignment === true
              //       ? "0"
              //       : item.textAlignment === false
              //       ? "auto"
              //       : "6rem",
              //   width: item.textWidth ? "100%" : "50%",
              // };

              return (
                <div key={index} className="media-block text-block">
                  {documentToReactComponents(item.textContent.json)}
                </div>
              );
            } else if (item.__typename === "ComponentImageBlockDouble") {
              const doubleImageStyle = {
                width: "247px",
                height: "323px",
                // marginLeft:
                //   item.imageAlignment === true
                //     ? "0"
                //     : item.imageAlignment === false
                //     ? "auto"
                //     : "6rem",
              };
              const containerStyle = {
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                // flexDirection: item.layout ? "row" : "column",
                gap: "var(--global-padding)",
              };

              return (
                <div key={index} className="image-block-double">
                  <div>
                    {item.imageBlockCollection.items.map((image, imgIndex) => (
                      <div key={imgIndex} className="double-image">
                        <LazyLoadMedia
                          src={image.url}
                          type="image"
                          alt={image.title}
                          onClick={() =>
                            handleImageClick(image.url, image.title)
                          }
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
                width: item.imageOrientation ? "480px" : "323px",
                height: item.imageOrientation ? "240px" : "480px",
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
                      onClick={() =>
                        handleImageClick(item.image.url, item.image.title)
                      }
                    />
                  </div>
                  <p>{item.image.description}</p>
                </div>
              );
            } else if (item.__typename === "ComponentProjectMediaGallery") {
              // const galleryStyle = {
              //   width: item.galleryWidth ? "calc(100vw / 12 * 4)" : "100%",
              //   marginLeft: item.galleryAlignment ? "0" : "auto",
              // };

              return (
                <div
                  key={index}
                  className="media-block media-gallery"
                  // style={galleryStyle}
                >
                  <div className="gallery-container">
                    {item.galleryContentCollection.items.map(
                      (media, mediaIndex) => (
                        <div
                          key={mediaIndex}
                          className="gallery-item"
                          onClick={() =>
                            handleImageClick(media.url, media.title)
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
                </div>
              );
            } else {
              console.log("Unknown item type:", item);
              return null;
            }
          })}
          {modalImage && (
            <Image
              setImage={modalImage.src}
              imageTitle={modalImage.title}
              zoomedImage={modalImage.src}
              mobileImage={modalImage.src}
            />
          )}
        </div>
      )}
    </>
  );
};

const VideoPlayer = ({ src }) => {
  return (
    <div className="video-player">
      <video className="video" src={src} controls />
    </div>
  );
};

export default MediaBlockCollection;
