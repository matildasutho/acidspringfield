import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./nav.css"; // Ensure you have the necessary CSS

const Nav = () => {
  const { pathname } = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

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
            {hoveredLink === "listen" && (
              <div className="hover-content">
                <ul>
                  <li>
                    <a href="/listen/track1">Track 1</a>
                  </li>
                  <li>
                    <a href="/listen/track2">Track 2</a>
                  </li>
                  <li>
                    <a href="/listen/track3">Track 3</a>
                  </li>
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
