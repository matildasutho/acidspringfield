import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchHomePageLinks } from "../../API/contentful/fetchContentful";
import RichTextRenderer from "../../components/hyperlink/hyperlink";
import "./nav.css"; // Ensure you have the necessary CSS

const Nav = () => {
  const { pathname } = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [links, setLinks] = useState([]);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 900px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 900px)")
      .addEventListener("change", (e) => setMatches(e.matches));
    setHoveredLink(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHomePageLinks();
        const fetchedText = data.componentHomePageLinksCollection.items;
        setLinks(fetchedText);
      } catch (error) {
        console.error("Error fetching homepage links subpage:", error);
      }
    };

    fetchData();
  }, []);

  const toggleLinks = () => {
    if (hoveredLink === true) {
      setHoveredLink(false);
      // console.log("closing");
    } else {
      setHoveredLink(true);
      // console.log("opening");
    }
  };
  return (
    <>
      {matches && (
        <>
          <div className="logo">
            <a href="/">
              <img src="/AS_logo-type.png" alt="Logo" />
            </a>
          </div>
          <div className="sidebar-col nav-inner">
            <div className="flex-col">
              <a
                href="/info"
                className={pathname === "/info" ? "active-link" : ""}
              >
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
                            <li className="link-txt" key={index}>
                              <RichTextRenderer
                                document={link.linksList.json}
                              />
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
      )}
      {!matches && (
        <>
          <div className="nav-inner-mobile">
            <div className="logo-mobile">
              <a href="/">
                <img src="/AS_logo-type.png" alt="Logo" />
              </a>
            </div>

            <a
              href="/info"
              className={pathname === "/info" ? "active-link" : ""}
            >
              Info
            </a>

            <a
              href="/projects"
              className={pathname === "/projects" ? "active-link" : ""}
            >
              Projects
            </a>
            <div
              onClick={toggleLinks}
              onTouchStart={toggleLinks}
              className={"nav-item"}
            >
              <a>Listen</a>
            </div>
          </div>
          {hoveredLink && links.length > 0 && (
            <div className="mobile-wrap">
              <div className="hover-content-mobile">
                <ul>
                  {links.map(
                    (link, index) =>
                      link.linksList &&
                      link.linksList.json && (
                        <li className="link-txt" key={index}>
                          <RichTextRenderer document={link.linksList.json} />
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Nav;
