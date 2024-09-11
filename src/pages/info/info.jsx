import React, { useEffect, useState } from "react";
import RightColumn from "../../components/rightColumn/rightColumn";
import { fetchData } from "../../API/contentful/fetchContentful";

import "./info.css";

// Utility function to convert text to HTML with line breaks
const convertToHTML = (text) => {
  return text.replace(/\n/g, "<br />");
};

const Info = () => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setInfo(data.infoCollection.items);
      })
      .catch((error) => console.error(error));
  }, []);

  // Ensure info is not empty and has the required properties
  const infoEntry = info.length > 0 ? info[0] : {};
  const infoSUMMARY = infoEntry.infoSummary
    ? convertToHTML(infoEntry.infoSummary)
    : "";
  const paragraph1HTML = infoEntry.paragraph1
    ? convertToHTML(infoEntry.paragraph1)
    : "";

  const sideBarHTML = infoEntry.sideBar ? convertToHTML(infoEntry.sideBar) : "";
  const sideBarP = sideBarHTML && (
    <div
      className="smll-txt"
      dangerouslySetInnerHTML={{ __html: sideBarHTML }}
    />
  );

  return (
    <div className="flex-row fade-in">
      {info.map((item, index) => (
        <div key={index} className="content flex-col">
          <div className="info-summary">
            <strong>Welcome to </strong>
            <span className="emph-txt">Acid Springfield;</span>
            <br />
            <span className="all-caps">
              an experimental audio project and ongoing WIP redefining sound's
              role in the creative process. 
            </span>
          </div>

          <p
            className="p5"
            dangerouslySetInnerHTML={{ __html: paragraph1HTML }}
          ></p>
        </div>
      ))}

      <RightColumn text={sideBarP} />
    </div>
  );
};

export default Info;
