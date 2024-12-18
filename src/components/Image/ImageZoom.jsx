import React from "react";
import Image from "./Image";
import "./image.css";

export const imageZoom = (imageSrc, imageTitle, setModalImage) => {
  setModalImage({ src: imageSrc, title: imageTitle });
};
