import React from "react";

const ComponentImageBlockDouble = ({
  internalTitle,
  imageBlockCollection,
  layout,
}) => {
  return (
    <div className={`image-block-double ${layout}`}>
      <h2>{internalTitle}</h2>
      <div className="images">
        {imageBlockCollection.items.map((image, index) => (
          <div key={index} className="image">
            <img src={image.url} alt={image.title} />
            <p>{image.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentImageBlockDouble;
