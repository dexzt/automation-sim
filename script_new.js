import { createBoxes, animateBoxes } from "/ui/boxes.js";
import { loadForklift, controlForklift } from "/ui/forklift.js";
import { createConveyor } from "/ui/conveyor.js";
import { createShelves, trays, shelfBoxes } from "/ui/shelves.js";

const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false };
document.addEventListener("keydown", e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
document.addEventListener("keyup", e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

document.addEventListener("DOMContentLoaded", () => {
  const keyMap = {
    btnForward: "w", btnBackward: "s", btnLeft: "a", btnRight: "d",
    btnLiftUp: "ArrowUp", btnLiftDown: "ArrowDown"
  };
  Object.entries(keyMap).forEach(([id, key]) => {
    const btn = document.getElementById(id);
    ["touchstart", "mousedown"].forEach(evt => btn?.addEventListener(evt, () => keys[key] = true));
    ["touchend", "mouseup"].forEach(evt => btn?.addEventListener(evt, () => keys[key] = false));
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(16, 7, 15);
  camera.minZoom = .5;
  camera.maxZoom = 2.0;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 2, -10);
  controls.minDistance = 5;
  controls.MaxDistance = 5;
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(35, 40),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Modular components
  createConveyor(scene);
  createShelves(scene);
  createBoxes(scene);
  loadForklift(scene);

  let isPaused = false;
  window.pauseAnimation = () => isPaused = true;
  window.resumeAnimation = () => isPaused = false;

const tooltip = document.getElementById("tooltip");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


function updateTooltip(camera) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(shelfBoxes);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const screenPos = obj.position.clone().project(camera);

    tooltip.innerHTML = `<strong>${obj.userData.label}</strong><br>${obj.userData.info}`;
    tooltip.style.display = "block";
    tooltip.style.left = `${(screenPos.x * 0.5 + 0.5) * window.innerWidth}px`;
    tooltip.style.top = `${(-screenPos.y * 0.5 + 0.5) * window.innerHeight}px`;
  } else {
    tooltip.style.display = "none";
  }
}


  function animate() {
    requestAnimationFrame(animate);
    animateBoxes(trays, isPaused);
    controlForklift(keys);
    controls.update();
    renderer.render(scene, camera);
    updateTooltip(camera);
  }

  animate();

  // UI Animation
  gsap.from("#controlPanel", { x: -100, opacity: 0, duration: 1, ease: "power2.out" });
  gsap.from(".navbar", { y: -50, opacity: 0, duration: 1, delay: 0.3, ease: "power2.out" });
});