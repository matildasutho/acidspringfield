import React, { useEffect, useState, useRef } from "react";
import { fetchScrollingText } from "../../API/contentful/fetchContentful";
import "./scrolltext.css";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const ScrollText = () => {
  const [marqueeContent, setMarqueeContent] = useState([]);
  const [text, setText] = useState([]);
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const scrollRef = useRef(""); // Ref to store the current scroll content

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchScrollingText();
        const fetchedText = data.componentScrollingTextCollection.items;
        setText(fetchedText);

        if (fetchedText.length > 0 && fetchedText[0].textContent) {
          const scrollContent = documentToReactComponents(
            fetchedText[0].textContent.json
          );
          setMarqueeContent((prevContent) => [...prevContent, scrollContent]);
          scrollRef.current = scrollContent; // Update the ref with the scroll content
        }
      } catch (error) {
        console.error("Error fetching scrolling text:", error);
        setError("Failed to fetch scrolling text. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueeContent((prevContent) => {
        const newContent = [...prevContent, scrollRef.current];
        if (newContent.length > 50) {
          newContent.shift(); // Remove the oldest item if the array exceeds 10 items
        }
        return newContent;
      });
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  if (error) {
    return <div className="error">{error}</div>; // Render error message
  }

  return (
    <div className="marquee-container">
      <div className="marquee">
        {marqueeContent.map((content, index) => (
          <span className="marquee-content" key={index}>
            <div>{content}</div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollText;
