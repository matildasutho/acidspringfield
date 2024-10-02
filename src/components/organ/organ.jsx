import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation } from "react-router-dom";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DotScreenShader } from "./customshader.js";
import "./organ.css";
import RightColumn from "../rightColumn/rightColumn.jsx";

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
      // Vertex shader code
      const vertexShader = `
     uniform float time;
     varying vec2 vUv;
     varying vec3 vPosition;
     uniform vec2 pixels;
     float PI = 3.141592653589793238;
     void main() {
       vUv = uv;
       vPosition = position;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
     }
   `;

      // Fragment shader code
      const fragmentShader = `
     uniform float time;
     uniform vec2 buttonPositions[${Goobath.length}];
     uniform float audioData[${Goobath.length}];
     uniform sampler2D texture1;
     uniform vec4 resolution;
     varying vec2 vUv;
     varying vec3 vPosition;
     float PI = 3.141592653589793238;

     // NOISE
     float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
     vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
     vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

     float noise(vec3 p) {
         vec3 a = floor(p);
         vec3 d = p - a;
         d = d * d * (3.0 - 2.0 * d);

         vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
         vec4 k1 = perm(b.xyxy);
         vec4 k2 = perm(k1.xyxy + b.zzww);

         vec4 c = k2 + a.zzzz;
         vec4 k3 = perm(c);
         vec4 k4 = perm(c + 1.0);

         vec4 o1 = fract(k3 * (1.0 / 41.0));
         vec4 o2 = fract(k4 * (1.0 / 41.0));

         vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
         vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

         return o4.y * d.y + o4.x * (1.0 - d.y);
     }

     float lines(vec2 uv, float offset) {
         // Add noise to the UV coordinates to make the lines wiggly
         float noiseValue = noise(vec3(uv * 0.2, offset));
         uv.y += noiseValue * 0.2; // Adjust the scale of the noise perturbation

         return smoothstep(
             0.0, 0.5 + offset * 0.5,
             0.5 * abs((sin(uv.x * 0.3) + offset * 0.2))
         );
     }

     mat2 rotate2D(float a) {
       return mat2(cos(a), -sin(a), sin(a), cos(a));
     } 

     void main() {
       vec3 pink = vec3(0.91,0.38,0.7);
       vec3 yellow = vec3(0.81,0.91,0.9);
       vec3 brown = vec3(0.23,0.16,0.12);
       vec3 lightGrey = vec3(1.0,1.0,1.0);
       vec3 darkGrey = vec3(0.05,0.05,0.05);
       vec3 black = vec3(0.0,0.0,0.);

       float n = noise(vPosition + time);
       vec2 baseUV = rotate2D(n) * vUv * 10.0; // Adjusted scaling factor
       float basePattern = lines(baseUV, 0.2);
       float secondPattern = lines(baseUV, 0.3);

       vec3 baseColor = mix(lightGrey, black, basePattern);
       vec3 secondBaseColor = mix(lightGrey, lightGrey, secondPattern);

       // Ripple effect
       float ripple = 0.1;
       for (int i = 0; i < ${Goobath.length}; i++) {
         float dist = distance(vUv, buttonPositions[i]);
         ripple += sin(dist * 10.0 - time * 2.0) * audioData[i];
       }

       gl_FragColor = vec4(secondBaseColor * (1.0 + ripple), 1.5);
     }
   `;

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

      function animate() {
        requestAnimationFrame(animate);
        material.uniforms.time.value += 0.003;
        // renderer.render(scene, camera);
        controls.update();
        composer.render();
      }

      function initPost() {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const effect1 = new ShaderPass(DotScreenShader);
        effect1.uniforms.scale.value = 4;
        composer.addPass(effect1);
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

    // Generate random positions for buttons
    const positions = Goobath.map(() => ({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    }));
    setButtonPositions(positions);

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

      time += 0.03; // Increment time for the sine wave
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

  const handlePlayPause = (index) => {
    const sound = audioObjects[index];
    if (sound.isPlaying) {
      sound.pause();
    } else {
      sound.play();
      document.getElementsByClassName("audio-button")[index].style.animation =
        "active-audio 3s ease-in-out infinite";
      // document.getElementsByClassName("audio-button")[index].style.color =
      //   "white";
    }
  };

  const getFileName = (filePath) => {
    return filePath.split("/").pop().split(".")[0];
  };

  return (
    <div>
      <div className="threejs-canvas" ref={refContainer}></div>
      <div className="audio-controls">
        {Goobath.map((sample, index) => (
          <button
            key={index}
            onClick={() => handlePlayPause(index)}
            className="audio-button"
            style={{
              position: "absolute",
              top: buttonPositions[index]?.top,
              left: buttonPositions[index]?.left,
            }}
          >
            {/* <span className="point-symbol"></span> */}

            <span>{getFileName(sample)}</span>
            <span>.mp3</span>
          </button>
        ))}
      </div>

    </div>
  );
}

export default Organ;
