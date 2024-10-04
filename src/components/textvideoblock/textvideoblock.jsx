import React, { useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./textvideoblock.css";

const ComponentVideoTextBlock = ({
  internalTitle,
  video,
  videoText,
  textPosition,
}) => {
  useEffect(() => {
    console.log("ComponentVideoTextBlock mounted");
    console.log("ComponentVideoTextBlock props:", {
      internalTitle,
      video,
      videoText,
      textPosition,
    });
  }, [internalTitle, video, videoText, textPosition]);

  if (!video || !videoText) {
    console.log("Missing video or videoText data");
    return null;
  }

  console.log("Rendering ComponentVideoTextBlock with video and videoText");

  return (
    <div className={`video-text-block ${textPosition}`}>
      <h2>{internalTitle || "Text Video Block"}</h2>
      {video && (
        <div className="video">
          <video src={video.url} controls />
          <p>{video.description}</p>
        </div>
      )}
      {videoText && (
        <div className="text">{documentToReactComponents(videoText.json)}</div>
      )}
    </div>
  );
};

export default ComponentVideoTextBlock;
