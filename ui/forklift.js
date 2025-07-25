export let forklift, forksMesh;

export function loadForklift(scene) {
  const forkliftURL = "https://dexzt.github.io/automation-sim/models/moving_forklift.glb";
  const loader = new THREE.GLTFLoader();

  loader.load(forkliftURL, gltf => {
    forklift = gltf.scene;
    forklift.scale.set(0.8, 0.8, 0.8);
    forklift.position.set(2, 0.75, -18);

    forklift.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = false;
        if (obj.name === "Object_23") forksMesh = obj;
        if (obj.material?.color) obj.material.color.set(0xffcc00);
      }
    });

    scene.add(forklift);
  });
}

export function controlForklift(keys) {
  if (!forklift) return;

  const moveSpeed = 0.01, rotateSpeed = 0.005, liftSpeed = 0.05;

  if (keys.w) forklift.translateX(-moveSpeed);
  if (keys.s) forklift.translateX(moveSpeed);
  if (keys.a) forklift.rotation.y += rotateSpeed;
  if (keys.d) forklift.rotation.y -= rotateSpeed;

  if (forksMesh) {
    const deltaY = (keys.ArrowUp ? 0.05 : keys.ArrowDown ? -0.05 : 0);
    const targetY = THREE.MathUtils.clamp(forksMesh.position.y + deltaY, 0, 4);
    forksMesh.position.y = targetY;
  }
}