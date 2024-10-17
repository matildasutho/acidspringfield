import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import LazyLoadMedia from "../lazyloadmedia/LazyLoadMedia"; // Adjust the import path as necessary
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  return (
    <div className="media-block-collection">
      {items.map((item, index) => {
        if (item.video) {
          const textStyle = {
            marginLeft: item.textPosition ? "auto" : "6rem",
          };

          return (
            <div key={index} className="media-block video-block">
              <LazyLoadMedia
                src={item.video.url}
                type="video"
                className="video"
              />
              {item.videoText && (
                <div className="video-text" style={textStyle}>
                  {documentToReactComponents(item.videoText.json)}
                </div>
              )}
            </div>
          );
        } else if (item.textContent) {
          return (
            <div key={index} className="media-block text-block">
              {documentToReactComponents(item.textContent.json)}
            </div>
          );
        } else if (item.imageBlockCollection) {
          // Handle ComponentImageBlockDouble
          return (
            <div key={index} className={`image-block-double ${item.layout}`}>
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
          return (
            <div key={index} className={`image-block-single ${item.layout}`}>
              <LazyLoadMedia
                src={item.image.url}
                type="image"
                alt={item.image.title}
                className="image"
              />
              <p>{item.image.description}</p>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default MediaBlockCollection;
