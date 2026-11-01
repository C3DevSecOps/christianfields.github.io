// Title-screen panorama: six in-game screenshots (one per direction) wrapped into
// a cube around the camera, slowly rotated, with the CSS blur giving the soft
// "menu background" look.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js";

const canvas = document.getElementById("world");
const settings = () => window.SETTINGS || { motion: true };

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
} catch {
  document.body.classList.add("no-webgl");
  throw new Error("WebGL unavailable; using flat background");
}

// Minecraft and three.js share axes: +x east, +z south, +y up.
// Cube faces go in three.js order: +x, -x, +y, -y, +z, -z, but three.js mirrors
// background cubemaps on x, so east and west trade places.
const FACES = ["west", "east", "up", "down", "south", "north"].map((f) => `panorama/${f}.png`);
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().load(FACES, (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  document.body.classList.add("bg-ready");
});

const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 10);

function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

// start facing the sunset (west) and drift slowly to the right
let yaw = Math.PI / 2 + 0.6, prev = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - prev) / 1000);
  prev = now;
  if (settings().motion) yaw += dt * 0.03;
  camera.lookAt(Math.sin(yaw) * -1, 0.05, Math.cos(yaw));
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
