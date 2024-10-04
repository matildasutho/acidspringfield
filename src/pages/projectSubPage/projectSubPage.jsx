import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RightColumn from "../../components/rightColumn/rightColumn";
import { fetchProjects } from "../../API/contentful/fetchContentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import MediaBlockCollection from "../../components/mediablockcollection/mediablockcollection";
import Image from "../../components/Image/Image";
import RichTextRenderer from "../../components/hyperlink/hyperlink";

import "./projectSubPage.css";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
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
  const [links, setLinks] = useState([]);
  const { slug } = useParams();
  const fruitWrapRef = useRef(null);
  const rightColumnRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjects();
        const fetchedText = data.projectCollection.items;
        // console.log("Fetched projects:", fetchedText);
        setProjects(fetchedText);
        setLinks(fetchedText.map((item) => item.projectLinks));
      } catch (error) {
        console.error("Error fetching project content subpage:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.body.classList.add("fruit-wrap-visible");
          console.log("fruit-wrap-visible");
        } else {
          document.body.classList.remove("fruit-wrap-visible");
          console.log("fruit-wrap-not-visible");
        }
      });
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

  // console.log("Selected project:", project);

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

  const emphasizedSummary = emphasizeProjectTitle(
    project.projectSummary,
    project.projectTitle
  );

  const rightColumnContent = (
    <>
      {project.rightColumn && project.rightColumn.json && (
        <div className="smll-txt">
          {documentToReactComponents(project.rightColumn.json)}
        </div>
      )}
      {project.projectLinks && project.projectLinks.json && (
        <RichTextRenderer document={project.projectLinks.json} />
      )}
    </>
  );

  // console.log(
  //   "MediaBlockCollection items:",
  //   project.mediaBlockCollection?.items
  // );

  return (
    <div className="flex-row">
      <div className="flex-col">
        <div className="content">
          <div className="hero-image">
            <img src={project.heroImage.url} alt={project.heroImage.title} />
          </div>
          <span className="tiny-txt">
            <span>PROJECT</span>{" "}
            <span className="caption-font">{project.projectTitle}</span>
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
                  <Image
                    key={imgIndex}
                    setImage={image.url}
                    zoomedImage={image.url}
                    imageTitle={image.title}
                  />
                ))}
            </div>
            <br />
          </div>
        </div>

        <div
          className="fruit-wrap content"
          ref={fruitWrapRef}
          style={{
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
            <div className="media-image">
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
          {project.mediaBlockCollection && (
            <MediaBlockCollection items={project.mediaBlockCollection?.items} />
          )}
          <br />
          <br />
        </div>
      </div>
      <RightColumn text={rightColumnContent}></RightColumn>
    </div>
  );
}

export default ProjectSubPage;
