export function createConveyor(scene) {
  const conveyorGroup = new THREE.Group();
  const beltMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

  const segments = [
    { size: [24, 0.3, 1], pos: [0, 0.15, -2] },
    { size: [1, 0.3, 16], pos: [-12, 0.15, -10] },
    { size: [1, 0.3, 16], pos: [12, 0.15, -10] },
    { size: [24, 0.3, 1], pos: [0, 0.15, -18] }
  ];

  segments.forEach(({ size, pos }) => {
    const belt = new THREE.Mesh(new THREE.BoxGeometry(...size), beltMaterial);
    belt.position.set(...pos);
    belt.castShadow = true;
    conveyorGroup.add(belt);
  });

  scene.add(conveyorGroup);
}