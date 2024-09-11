import React from "react";
import { useLocation } from "react-router-dom";

import "./nav.css";

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <>
      <div className="logo">
        <a href="/">
          <img src="/AS_logo-type.png"></img>
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
          <a>Listen</a>
        </div>
      </div>
    </>
  );
};

export default Nav;
