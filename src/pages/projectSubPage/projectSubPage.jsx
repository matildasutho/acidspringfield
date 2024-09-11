import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RightColumn from "../../components/rightColumn/rightColumn";
import { fetchData } from "../../API/contentful/fetchContentful";
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import Image from "../../components/Image/Image";

import "./projectSubPage.css";

const colorPairs = [
  { background: "#EFF3E8", foreground: "#007BE5" },
  { background: "#7A7064", foreground: "#201E1E" },
  { background: "#D0F85F", foreground: "#6E6B6C" },
];

// Function to generate slug from project title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove symbols
    .replace(/\s+/g, ""); // Replace spaces with %
};
// Utility function to convert text to HTML with line breaks
const convertToHTML = (text) => {
  return text.replace(/\n/g, "<br />");
};

// Function to add emph-txt class to the first instance of the project title
const emphasizeProjectTitle = (summary, title) => {
  const titleRegex = new RegExp(title, "i");
  return summary.replace(titleRegex, `<span class="emph-txt">${title}</span>`);
};

function ProjectSubPage() {
  const [projects, setProjects] = useState([]);
  const { slug } = useParams();
  const [bodyTextColor, setBodyTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(
    colorPairs[0].background
  );
  const [foregroundColor, setForegroundColor] = useState(
    colorPairs[0].foreground
  );
  const fruitWrapRef = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const randomColorPair =
            colorPairs[Math.floor(Math.random() * colorPairs.length)];
          setBodyTextColor(randomColorPair.foreground);
        } else {
          setBodyTextColor("");
        }
      });
      setBackgroundColor(randomColorPair.background);
      setForegroundColor(randomColorPair.foreground);
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.1,
    });

    if (fruitWrapRef.current) {
      observer.observe(fruitWrapRef.current);
    }

    return () => {
      if (fruitWrapRef.current) {
        observer.unobserve(fruitWrapRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.color = bodyTextColor;
  }, [bodyTextColor]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setProjects(data.projectCollection.items);
      })
      .catch((error) => console.error(error));
  }, []);

  if (projects.length === 0) {
    return (
      <div className="content">
        <i>Bending frequencies...</i>
      </div>
    );
  }

  // Find the project that matches the slug
  const project = projects.find(
    (project) => generateSlug(project.projectTitle) === slug
  );

  if (!project) {
    return <div>Project not found</div>;
  }

  const paragraph1HTML = convertToHTML(project.paragraph1);
  const paragraph2HTML = project.paragraph2
    ? convertToHTML(project.paragraph2)
    : null;
  const paragraph3HTML = project.paragraph3
    ? convertToHTML(project.paragraph3)
    : null;
  const paragraph4HTML = project.paragraph4
    ? convertToHTML(project.paragraph4)
    : null;
  const sideBarHTML = project.sideBar ? convertToHTML(project.sideBar) : null;
  const ourRoleHTML = project.ourRole ? convertToHTML(project.ourRole) : null;

  const sideBarP = sideBarHTML && (
    <div
      className="smll-txt"
      dangerouslySetInnerHTML={{ __html: sideBarHTML }}
    />
  );
  const ourRoleP = ourRoleHTML && (
    <div
      className="smll-txt"
      dangerouslySetInnerHTML={{ __html: ourRoleHTML }}
    />
  );

  // Emphasize the project title in the project summary
  const emphasizedSummary = emphasizeProjectTitle(
    project.projectSummary,
    project.projectTitle
  );

  console.log(project.rightColumn.json.content);

  return (
    <div className="flex-row">
      <div className="flex-col">
        <div className="content">
          <div className="hero-image">
            <img src={project.heroImage.url} alt={project.heroImage.title} />
          </div>
          <span className="tiny-txt">
            <span>PROJECT</span> <span className="caption-font">{project.projectTitle}</span>
          </span>
          <div className="project-wrap">
            <span className="project-summary">
              <h2 dangerouslySetInnerHTML={{ __html: emphasizedSummary }} />
            </span>

            <h3
              className="p1"
              dangerouslySetInnerHTML={{ __html: paragraph1HTML }}
            />
            <div className="imgBlock1">
              {project.imageBlock1Collection &&
                project.imageBlock1Collection.items.map((image, imgIndex) => (
                  // <img key={imgIndex} src={image.url} alt={image.title} />
                  <Image
                  key={imgIndex}
              setImage={image.url} 
              zoomedImage={image.url}
      
              imageTitle={image.title}
            />
                ))}
            </div>
          </div>
        </div>

        <div
          className="fruit-wrap content"
          ref={fruitWrapRef}
          style={{
            backgroundColor: backgroundColor,
            color: foregroundColor,
            height: "100%",
          }}
        >
          <br />
          {paragraph2HTML && (
            <div
              className="smll-txt p2"
              dangerouslySetInnerHTML={{ __html: paragraph2HTML }}
            />
          )}
          <br />
          {paragraph3HTML && (
          <span className="img-txt-block">
            <div className="imgBlock2">
              {project.imageBlock2Collection &&
                project.imageBlock2Collection.items.map((image, imgIndex) => (
                  // <img key={imgIndex} src={image.url} alt={image.title} />
                  <Image
                  key={imgIndex}
              setImage={image.url}
              imageTitle={image.title}
            />
                ))}
            </div>
            
              <span
                className="smll-txt p3"
                dangerouslySetInnerHTML={{ __html: paragraph3HTML }}
              />
       
          </span>
               )}
          <br />
          
            {project.media1 && (
              <div className="hero-image">
              <img src={project.media1.url} alt={project.media1.title} />
            
              </div>
            )}
        
          <br />
          {paragraph4HTML && (
            <div
              className="smll-txt p4"
              dangerouslySetInnerHTML={{ __html: paragraph4HTML }}
            />
          )}
          <br />
        </div>
      </div>
      <RightColumn text={documentToReactComponents(project.rightColumn.json)} />
    </div>
  );
}

export default ProjectSubPage;
