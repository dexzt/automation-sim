// Basic scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Conveyor Belt Box
const beltGeometry = new THREE.BoxGeometry(10, 0.5, 1);
const beltMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const belt = new THREE.Mesh(beltGeometry, beltMaterial);
belt.position.set(0, 0.25, 0);
scene.add(belt);

// Moving box
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-4, 0.5, 0);
scene.add(box);

function animate() {
  requestAnimationFrame(animate);
  
  // Move the box along the belt
  box.position.x += 0.02;
  if (box.position.x > 4) {
    box.position.x = -4; // Reset position
  }
  
  renderer.render(scene, camera);
}

animate();

let isPaused = false;

function animateBox() {
  if (!isPaused) {
    box.position.x += 0.02;
    if (box.position.x > 4) {
      box.position.x = -4;
    }
  }
}

// Animate loop
function animate() {
  requestAnimationFrame(animate);
  animateBox();
  renderer.render(scene, camera);
}
animate();

// Control Panel animations
gsap.from("#controlPanel", {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});
gsap.from(".navbar", {
  y: -50,
  opacity: 0,
  duration: 1,
  delay: 0.3,
  ease: "power2.out"
});

// Button Logic
window.pauseAnimation = () => isPaused = true;
window.resumeAnimation = () => isPaused = false;