import React, { useRef, useEffect, useState } from "react";

const LazyLoadMedia = ({ src, type, alt, className, style }) => {
  const mediaRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mediaRef.current) {
      observer.observe(mediaRef.current);
    }

    return () => {
      if (mediaRef.current) {
        observer.unobserve(mediaRef.current);
      }
    };
  }, [isMobile]);

  if (type === "image") {
    return (
      <img
        ref={mediaRef}
        src={isLoaded ? src : ""}
        alt={alt}
        className={`${className} ${isLoaded ? "fade-in" : ""}`}
        loading="lazy"
        style={style}
      />
    );
  } else if (type === "video") {
    return isLoaded ? (
      <video
        ref={mediaRef}
        controls
        className={`${className} fade-in`}
        style={style}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <div ref={mediaRef} className={className}>
        Loading video...
      </div>
    );
  }

  return null;
};

export default LazyLoadMedia;
