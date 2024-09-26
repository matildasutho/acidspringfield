import React, { useEffect, useState } from "react";
import { fetchData } from "../../API/contentful/fetchContentful";
import "./scrolltext.css";

const ScrollText = () => {
  const [marqueeContent, setMarqueeContent] = useState("SOUND ON");
  const [text, setText] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueeContent((prevContent) => prevContent + " SOUND ON");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="marquee-container">
      <div className="marquee">
        <p>{marqueeContent}</p>
      </div>
    </div>
  );
};

export default ScrollText;
