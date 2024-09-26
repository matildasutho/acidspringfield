import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../API/contentful/fetchContentful";
import "./projects.css";

// Function to generate slug from project title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove symbols
    .replace(/\s+/g, ""); // Replace spaces with %
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hoverImg, setHoverImg] = useState(null);
  const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });

  const handleButtonHover = (imagePath) => {
    setHoverImg(imagePath);
  };

  const handleImageMouseMove = (e) => {
    setImgPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        setProjects(data.projectCollection.items);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="flex-col projects-content fade-in">
        {projects.map((project, index) => (
          <Link
            key={index}
            to={`/projects/${generateSlug(project.projectTitle)}`}
            onMouseEnter={() => handleButtonHover(project.heroImage.url)}
            onMouseLeave={() => handleButtonHover(null)}
            onMouseMove={handleImageMouseMove}
          >
            <div className="link-col">
              <div className="tiny-txt">{project.projectTitle}</div>
              <div className="preview-txt">
                <h1>{project.projectSummary}</h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {hoverImg && (
        <img
          src={hoverImg}
          alt="Hover"
          style={{
            position: "absolute",
            top: imgPosition.y + 20,
            left: imgPosition.x + 20,
            width: "calc(100vw / 12 * 2)",
            height: "auto",
            pointerEvents: "none",
            zIndex: 200,
          }}
        />
      )}
    </>
  );
};

export default Projects;
