import React from "react";
import "./rightColumn.css";

const RightColumn = ({ text }) => {
  return (
    <div className="sidebar-col col-inner">
      <div className="">{text}</div>
    </div>
  );
};

export default RightColumn;
