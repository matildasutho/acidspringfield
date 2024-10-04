import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation } from "react-router-dom";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DotScreenShader } from "./customshader.js";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import "./organ.css";
import RightColumn from "../rightColumn/rightColumn.jsx";
import AudioControls from "./audiocontrols.jsx"; // Import the new component

const generateRandomKeyframes = () => {
  const x1 = Math.random() * 15 - 12;
  const y1 = Math.random() * 15 - 12;
  const x2 = Math.random() * 15 - 12;
  const y2 = Math.random() * 15 - 12;

  return `
    @keyframes float${Math.random().toString(36).substr(2, 9)} {
      0% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(${x1}px, ${y1}px);
      }
      50% {
        transform: translate(${x2}px, ${y2}px);
      }
      75% {
        transform: translate(${x1}px, ${y1}px);
      }
      100% {
        transform: translate(0, 0);
      }
    }
  `;
};

const Goobath = [
  "/samples/Goobath/compost_horn.mp3",
  "/samples/Goobath/cork_pop.mp3",
  "/samples/Goobath/deep_bass.mp3",
  "/samples/Goobath/demon_spring.mp3",
  "/samples/Goobath/openoneeye.mp3",
  "/samples/Goobath/peace_pad.mp3",
  "/samples/Goobath/pluck.mp3",
  "/samples/Goobath/reverse_metalscrape.mp3",
  "/samples/Goobath/swamp_soda.mp3",
  "/samples/Goobath/waterlogged_dub.mp3",
];

function Organ() {
  const refContainer = useRef(null);
  const materialRef = useRef(null); // Ref to store the material
  const animationStyleSheet = useRef(null); // Ref to store the stylesheet
  const audioRefs = useRef([]); // Ref to store audio button references
  const [audioObjects, setAudioObjects] = useState([]);
  const [audioAnalysers, setAudioAnalysers] = useState([]);
  const [buttonPositions, setButtonPositions] = useState([]);
  const location = useLocation();

  let composer;

  useEffect(() => {
    if (location.pathname === "/") {
      document.getElementsByClassName("audio-controls")[0].style.display =
        "block";
    } else {
      document.getElementsByClassName("audio-controls")[0].style.display =
        "none";
    }
  }, [location]);

  useEffect(() => {
    let renderer, scene, camera, controls;

    function init() {
      // Generate random positions for buttons
      const positions = Goobath.map(() => ({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      }));
      setButtonPositions(positions);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      refContainer.current &&
        refContainer.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;

      var geometry = new THREE.SphereGeometry(5, 64, 64);
      geometry.rotateX(-140);
      geometry.rotateY(178);

      // Create uniforms dynamically
      const uniforms = {
        time: { value: 0.001 },
        buttonPositions: {
          value: new Array(Goobath.length).fill(new THREE.Vector2()),
        },
        audioData: { value: new Array(Goobath.length).fill(0.0) },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide,
      });
      materialRef.current = material; // Store the material in the ref
      var sphere = new THREE.Mesh(geometry, material);

      scene.add(sphere);
      camera.position.z = 0;

      const listener = new THREE.AudioListener();
      camera.add(listener);

      const audioObjects = Goobath.map((sample, index) => {
        const sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();

        audioLoader.load(sample, function (buffer) {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(0.5);
          scene.add(sound);
        });

        sound.onEnded = () => {
          console.log("onEnded");
          sound.isPlaying = false;
          document.getElementsByClassName("audio-button")[
            index
          ].style.animation = "";
          document.getElementsByClassName("audio-button")[index].style.color =
            "var(--overlay)";
        };
        return sound;
      });

      const audioAnalysers = audioObjects.map(
        (sound) => new THREE.AudioAnalyser(sound, 256)
      );

      setAudioObjects(audioObjects);
      setAudioAnalysers(audioAnalysers);

      function initPost() {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const effect1 = new ShaderPass(DotScreenShader);
        effect1.uniforms.scale.value = 4;
        composer.addPass(effect1);
      }

      function animate() {
        const frameRate = 30; // Desired frame rate in frames per second
        const interval = 1000 / frameRate; // Interval in milliseconds

        function render() {
          material.uniforms.time.value += 0.003;
          renderer.render(scene, camera);
          controls.update();
          composer.render();
        }

        function loop() {
          render();
          setTimeout(loop, interval);
        }

        loop();
      }

      initPost();
      animate();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);
    init();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const updateAudioData = () => {
      if (audioAnalysers.length > 0) {
        const audioData = audioAnalysers.map((analyser) => {
          const data = analyser.getFrequencyData();
          const average = data.reduce((a, b) => a + b) / data.length;
          return (average / 256.0) * 10; // Normalize the value
        });

        // Check if all audioData values are zero (no audio playing)
        const isAudioPlaying = audioData.some((value) => value > 0);

        if (!isAudioPlaying) {
          // Use sine/cosine wave to create a value between 0.3 and 0.7
          const waveValue = 0.5 + 0.2 * Math.sin(time);
          audioData.fill(waveValue);
        }

        // Update the shader material with the audio data
        if (materialRef.current) {
          materialRef.current.uniforms.audioData.value = audioData;
        }
      }

      time += 0.01; // Increment time for the sine wave
      animationFrameId = requestAnimationFrame(updateAudioData);
    };

    updateAudioData();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioAnalysers]);

  useEffect(() => {
    if (materialRef.current) {
      const buttonPositionsVec2 = buttonPositions.map((pos) => {
        const x = parseFloat(pos.left) / 100;
        const y = parseFloat(pos.top) / 100;
        return new THREE.Vector2(x, y);
      });
      materialRef.current.uniforms.buttonPositions.value = buttonPositionsVec2;
    }
  }, [buttonPositions]);

  useEffect(() => {
    if (!animationStyleSheet.current) {
      const style = document.createElement("style");
      document.head.appendChild(style);
      animationStyleSheet.current = style.sheet;
    }

    audioObjects.forEach((sample, index) => {
      const keyframes = generateRandomKeyframes();
      animationStyleSheet.current.insertRule(
        keyframes,
        animationStyleSheet.current.cssRules.length
      );
      const animationName = keyframes.match(/@keyframes\s+(\S+)\s*\{/)[1];
      audioRefs.current[
        index
      ].style.animation = `${animationName} 15s ease-in-out infinite`;
    });
  }, [audioObjects]);

  const handlePlayPause = (index) => {
    const sound = audioObjects[index];
    const button = document.getElementsByClassName("audio-button")[index];

    if (sound.isPlaying) {
      sound.pause();
      // Restore the original animation when paused
      const originalAnimation = button.dataset.originalAnimation;
      button.style.animation = originalAnimation;
      button.style.color = "var(--overlay)";
    } else {
      sound.play();
      // Store the original animation in a data attribute
      button.dataset.originalAnimation = button.style.animation;
      const existingAnimation = button.style.animation;
      button.style.animation = `${existingAnimation}, active-audio 3s ease-in-out infinite`;
      button.style.color = "white";
    }
  };

  // Update the onEnded event handler to restore the original animation
  audioObjects.forEach((sound, index) => {
    sound.onEnded = () => {
      console.log("onEnded");
      sound.isPlaying = false;
      const button = document.getElementsByClassName("audio-button")[index];
      const originalAnimation = button.dataset.originalAnimation;
      button.style.animation = originalAnimation;
      button.style.color = "var(--overlay)";
    };
  });
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split(".")[0];
  };

  return (
    <div>
      <div className="threejs-canvas" ref={refContainer}></div>
      <AudioControls
        Goobath={Goobath}
        handlePlayPause={handlePlayPause}
        audioRefs={audioRefs}
        buttonPositions={buttonPositions}
        getFileName={getFileName}
      />
    </div>
  );
}

export default Organ;
