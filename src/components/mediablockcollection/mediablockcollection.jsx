import React, { useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./mediablockcollection.css";

const MediaBlockCollection = ({ items }) => {
  useEffect(() => {
    console.log("MediaBlockCollection mounted");
    console.log("MediaBlockCollection items:", items);
  }, [items]);

  if (!items || items.length === 0) {
    console.log("No media blocks available.");
    return <div>No media blocks available.</div>;
  }

  return (
    <div className="media-block-collection">
      {items.map((item) => {
        if (!item) return null;

        console.log("Rendering item:", item);

        switch (item.__typename) {
          case "ComponentImageBlockDouble":
            return (
              item.imageBlockCollection?.items?.length > 0 && (
                <div key={item.sys.id} className="image-block-double">
                  <h2>{item.internalTitle || "Default Title"}</h2>
                  {item.imageBlockCollection.items.map((image, index) => (
                    <div key={index} className="image">
                      <img src={image.url} alt={image.title || "Default Alt"} />
                      <p>{image.description || "Default Description"}</p>
                    </div>
                  ))}
                </div>
              )
            );
          case "ComponentImageBlockSingle":
            return (
              item.image && (
                <div key={item.sys.id} className="image-block-single">
                  <h2>{item.internalTitle || "Default Title"}</h2>
                  <img
                    src={item.image.url}
                    alt={item.image.title || "Default Alt"}
                  />
                  <p>{item.image.description || "Default Description"}</p>
                </div>
              )
            );
          case "ComponentText":
            return (
              item.textContent && (
                <div key={item.sys.id} className="text-block">
                  <h2>{item.internalTitle || "Default Title"}</h2>
                  <div>{documentToReactComponents(item.textContent.json)}</div>
                </div>
              )
            );
          case "ComponentVideoTextBlock":
            return (
              item.video &&
              item.videoText && (
                <div
                  key={item.sys.id}
                  className={`video-text-block ${item.textPosition || "left"}`}
                >
                  <h2>{item.internalTitle || "Text Video Block"}</h2>
                  <div className="video">
                    <video src={item.video.url} controls />
                    <p>{item.video.description || "Default Description"}</p>
                  </div>
                  <div className="text">
                    {documentToReactComponents(item.videoText.json)}
                  </div>
                </div>
              )
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default MediaBlockCollection;
