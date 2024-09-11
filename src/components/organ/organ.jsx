import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { DotScreenShader } from './customshader.js';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './organ.css';

function Organ() {
  const refContainer = useRef(null);
  let composer;

  useEffect(() => {
    let renderer, scene, camera, controls, material;

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
     uniform float progress;
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
         float noiseValue = noise(vec3(uv * 10.0, offset));
         uv.y += noiseValue * 0.1; // Adjust the scale of the noise perturbation

         return smoothstep(
             0.0, 0.5 + offset * 0.5,
             0.5 * abs((sin(uv.x * 1.0) + offset * 2.0))
         );
     }

     mat2 rotate2D(float a) {
       return mat2(cos(a), -sin(a), sin(a), cos(a));
     } 

     void main() {
       vec3 pink = vec3(0.91,0.38,0.7);
       vec3 yellow = vec3(0.81,0.91,0.9);
       vec3 brown = vec3(0.23,0.16,0.12);
       vec3 lightGrey = vec3(0.96,0.96,0.96);
       vec3 darkGrey = vec3(0.05,0.05,0.05);
       vec3 black = vec3(0.01,0.01,0.1);

       float n = noise(vPosition + time);
       vec2 baseUV = rotate2D(n) * vUv * 10.0; // Adjusted scaling factor
       float basePattern = lines(baseUV, 0.2);
       float secondPattern = lines(baseUV, 0.3);

       vec3 baseColor = mix(black, darkGrey, basePattern);
       vec3 secondBaseColor = mix(baseColor, lightGrey, secondPattern);

       gl_FragColor = vec4(secondBaseColor, 1.0);
     }
   `;

   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   refContainer.current && refContainer.current.appendChild(renderer.domElement);

   controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   controls.dampingFactor = 0.25;
   controls.screenSpacePanning = false;
   controls.minDistance = 1;
   controls.maxDistance = 500;
   controls.maxPolarAngle = Math.PI / 2;

   var geometry = new THREE.SphereGeometry(5, 64, 64);
   geometry.rotateX(165);
   geometry.rotateY(240);
   material = new THREE.ShaderMaterial({
     vertexShader: vertexShader,
     fragmentShader: fragmentShader,
     uniforms: {
       time: { value: 0.001 },
     },
     side: THREE.DoubleSide,
   });
   var sphere = new THREE.Mesh(geometry, material);


   scene.add(sphere);
   camera.position.z = 0;

      function animate() {
        requestAnimationFrame(animate);
        material.uniforms.time.value += 0.003;
        renderer.render(scene, camera);
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

    window.addEventListener('resize', onWindowResize, false);
    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="threejs-canvas" ref={refContainer}></div>
  );
}

export default Organ;