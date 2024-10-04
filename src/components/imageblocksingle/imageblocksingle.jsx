import React from "react";

const ComponentImageBlockSingle = ({ internalTitle, image, layout }) => {
  return (
    <div className={`image-block-single ${layout}`}>
      <h2>{internalTitle}</h2>
      <div className="image">
        <img src={image.url} alt={image.title} />
        <p>{image.description}</p>
      </div>
    </div>
  );
};

export default ComponentImageBlockSingle;
