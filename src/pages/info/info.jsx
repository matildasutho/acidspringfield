import React, { useEffect, useState } from "react";
import RightColumn from "../../components/rightColumn/rightColumn";
import { fetchInfo } from "../../API/contentful/fetchContentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import RichTextRenderer from "../../components/hyperlink/hyperlink";
import Footer from "../../components/footer/footer.jsx";

import "./info.css";

// Utility function to convert text to HTML with line breaks
const convertToHTML = (text) => {
  return text
    .replace(/\n/g, "<br />")
    .replace(
      /ben mackie/gi,
      '<span class="hover-target ben-mackie">Ben Mackie</span>'
    )
    .replace(
      /erica stevens/gi,
      '<span class="hover-target erica-stevens">Erica Stevens</span>'
    );
};

const Info = () => {
  const [info, setInfo] = useState([]);
  const [hoverImg, setHoverImg] = useState(null);
  const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 900px)").matches
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInfo();
        const fetchedText = data.infoCollection.items;
        setInfo(fetchedText);
      } catch (error) {
        console.error("Error fetching info content:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handleButtonHover = (imagePath) => {
    if (!isMobile) {
      setHoverImg(imagePath);
    }
  };

  const handleImageMouseMove = (e) => {
    if (!isMobile) {
      setImgPosition({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    document.body.classList.add("info-page");

    return () => {
      document.body.classList.remove("info-page");
    };
  }, []);

  useEffect(() => {
    const benMackieElements = document.querySelectorAll(".ben-mackie");
    const ericaStevensElements = document.querySelectorAll(".erica-stevens");

    benMackieElements.forEach((element) => {
      element.addEventListener("mouseenter", () =>
        handleButtonHover("benImage")
      );
      element.addEventListener("mouseleave", () => handleButtonHover(null));
    });

    ericaStevensElements.forEach((element) => {
      element.addEventListener("mouseenter", () =>
        handleButtonHover("ericaImage")
      );
      element.addEventListener("mouseleave", () => handleButtonHover(null));
    });

    return () => {
      benMackieElements.forEach((element) => {
        element.removeEventListener("mouseenter", () =>
          handleButtonHover("benImage")
        );
        element.removeEventListener("mouseleave", () =>
          handleButtonHover(null)
        );
      });

      ericaStevensElements.forEach((element) => {
        element.removeEventListener("mouseenter", () =>
          handleButtonHover("ericaImage")
        );
        element.removeEventListener("mouseleave", () =>
          handleButtonHover(null)
        );
      });
    };
  }, [info]);

  // Ensure info is not empty and has the required properties
  const infoEntry = info.length > 0 ? info[0] : {};
  const infoSUMMARY = infoEntry.infoSummary
    ? convertToHTML(infoEntry.infoSummary)
    : "";
  const paragraph1HTML = infoEntry.paragraph1
    ? convertToHTML(infoEntry.paragraph1)
    : "";

  const benImage = infoEntry.benImage ? infoEntry.benImage.url : "";
  const ericaImage = infoEntry.ericaImage ? infoEntry.ericaImage.url : "";

  const imageStyle = {
    position: "absolute",
    left: `${imgPosition.x + 20}px`,
    top: `${imgPosition.y + 20}px`,
    width: "calc(100vw / 12 * 2)",
    display: hoverImg ? "block" : "none",
  };

  const rightColumnContent = (
    <>
      {infoEntry.rightColumn && infoEntry.rightColumn.json && (
        <div>{documentToReactComponents(infoEntry.rightColumn.json)}</div>
      )}
      {infoEntry.infoLinks && infoEntry.infoLinks.json && (
        <RichTextRenderer document={infoEntry.infoLinks.json} />
      )}
    </>
  );

  return (
    <div className="flex-row fade-in" onMouseMove={handleImageMouseMove}>
      {info.map((item, index) => (
        <div key={index} className="content flex-col info-wrapper">
          <div className="info-header">
            <div className="info-hero fade-in">
              <img
                src={infoEntry.heroImage.url}
                alt={infoEntry.heroImage.title}
              />
            </div>

            <div className="info-summary">
              <h2>
                <strong>Welcome to </strong>
                <span className="emph-txt">Acid Springfield;</span>
                <br />
                <span className="all-caps">
                  an experimental audio project and ongoing WIP redefining
                  sound's role in the creative process. 
                </span>
              </h2>
            </div>
          </div>
          <p
            className="p5"
            dangerouslySetInnerHTML={{ __html: paragraph1HTML }}
          ></p>
          <br />
          {isMobile && <Footer />}
        </div>
      ))}

      <RightColumn text={rightColumnContent} bgColor={"#FFB6C7"} />

      {hoverImg && (
        <img
          src={hoverImg === "benImage" ? benImage : ericaImage}
          alt={hoverImg === "benImage" ? "Ben Mackie" : "Erica Stevens"}
          className="hover-image fade-in-img"
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default Info;
