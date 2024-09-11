import { useState } from "react";
import "./splash.css";
import soundOn from "/sound-on.svg";

const Splash = ({ onHide }) => {
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    setVisible(false);
    onHide();
  };

  return (
    <div className={visible ? "full-page" : "hidden"}>
      <div className="enter-btn" onClick={toggleVisible}>
        {/* <img className="svg" src={soundOn} alt="sound on" /> */}
      </div>
      <div className="intro-txt">
        BY ENTERING THIS SITE, YOU AGREE TO PARTICIPATE ACTIVELY IN THE AUDITORY
        EXPERIENCE THAT IS Acid Springfield.
      </div>
    </div>
  );
};

export default Splash;
