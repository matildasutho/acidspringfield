import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchData } from "../../API/contentful/fetchContentful";
import RichTextRenderer from "../../components/hyperlink/hyperlink";
import "./nav.css"; // Ensure you have the necessary CSS

const Nav = () => {
  const { pathname } = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setLinks(data.componentHomePageLinksCollection.items);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="logo">
        <a href="/">
          <img src="/AS_logo-type.png" alt="Logo" />
        </a>
      </div>
      <div className="sidebar-col nav-inner">
        <div className="flex-col">
          <a href="/info" className={pathname === "/info" ? "active-link" : ""}>
            Info
          </a>

          <a
            href="/projects"
            className={pathname === "/projects" ? "active-link" : ""}
          >
            Projects
          </a>
          <div
            onMouseEnter={() => setHoveredLink("listen")}
            onMouseLeave={() => setHoveredLink(null)}
            className={"nav-item"}
          >
            <a>Listen</a>
            {hoveredLink === "listen" && links.length > 0 && (
              <div className="hover-content">
                <ul>
                  {links.map(
                    (link, index) =>
                      link.linksList &&
                      link.linksList.json && (
                        <li key={index}>
                          <RichTextRenderer document={link.linksList.json} />
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
