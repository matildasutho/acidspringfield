import React, { useEffect, useState } from "react";
import "./scrolltext.css";

const ScrollText = () => {
  const [marqueeContent, setMarqueeContent] = useState("SOUND ON");

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueeContent((prevContent) => prevContent + " SOUND ON");
    }, 1700);
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
