import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../API/contentful/fetchContentful";
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
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjects();
        const fetchedText = data.projectCollection.items;

        // Sort projects by date (newest to oldest)
        const sortedProjects = fetchedText.sort(
          (a, b) => new Date(b.projectDate) - new Date(a.projectDate)
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error fetching project content:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
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
