import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const ComponentText = ({ textContent, layout }) => {
  return (
    <div className={`text-block ${layout}`}>
      {documentToReactComponents(textContent.json)}
    </div>
  );
};

export default ComponentText;
