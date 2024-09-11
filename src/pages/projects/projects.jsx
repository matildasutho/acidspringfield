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

  useEffect(() => {
    fetchData()
      .then((data) => {
        setProjects(data.projectCollection.items);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="flex-col projects-content">
        {projects.map((project, index) => (
          <Link
            key={index}
            to={`/projects/${generateSlug(project.projectTitle)}`}
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
    </>
  );
};

export default Projects;
