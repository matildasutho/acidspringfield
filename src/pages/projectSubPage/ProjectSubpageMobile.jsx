import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../../components/lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import "./projectsubpagemobile.css";

const ProjectSubpageMobile = ({ items }) => {
  return (
    <div className="project-subpage-mobile">
      {items.map((item, index) => {
        console.log("Rendering item:", item);

        if (item.__typename === "ComponentVideoTextBlock") {
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
        } else if (item.__typename === "ComponentText") {
          return (
            <div key={index} className="media-block text-block">
              {documentToReactComponents(item.textContent.json)}
            </div>
          );
        } else if (item.__typename === "ComponentImageBlockDouble") {
          return (
            <div key={index} className="media-block image-block-double">
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
          return (
            <div key={index} className="media-block image-block-single">
              <LazyLoadMedia
                src={item.image.url}
                type="image"
                alt={item.image.title}
                className="image"
              />
              <p>{item.image.description}</p>
            </div>
          );
        } else if (item.__typename === "ComponentProjectMediaGallery") {
          return (
            <div key={index} className="media-block media-gallery">
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
        } else {
          console.log("Unknown item type:", item);
          return null;
        }
      })}
    </div>
  );
};

const VideoPlayer = ({ src }) => {
  return (
    <div className="video-player">
      <video className="video" src={src} controls />
    </div>
  );
};

export default ProjectSubpageMobile;
