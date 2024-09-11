import React, {useRef} from 'react';
import "./audioobject.css";

const AudioObject = React.forwardRef(({source, label}, ref) => {
    const audioRef = useRef(null);

    const handleTogglePlayPause = () => {
      if (audioRef.current.paused) {
        audioRef.current.play();
        console.log("playing");
      } else {
        audioRef.current.pause();
        console.log("paused")
      }
    };
    return (
        <div className="audio-cont" >
            <span className="point"></span>
       <audio ref={ref} loop src={source}><h4>{label}</h4></audio>
       </div>
    )
});

export default AudioObject;