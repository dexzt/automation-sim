export const boxes = [];
export let boxCount = 20;

export function createBoxes(scene) {
  for (let i = 0; i < boxCount; i++) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xff6600 })
    );
    box.castShadow = false;
    scene.add(box);
    boxes.push({ mesh: box, phase: i * (192 / boxCount) });
  }
}

export function animateBoxes(trays, isPaused = false) {
  boxes.forEach(obj => {
    if (!isPaused) obj.phase += 0.05;
    let p = obj.phase, x = 0, z = 0;

    if (p < 48) x = -12 + p * 0.5, z = -2;
    else if (p < 80) x = 12, z = -2 - (p - 48) * 0.5;
    else if (p < 128) x = 12 - (p - 80) * 0.5, z = -18;
    else if (p < 160) x = -12, z = -18 + (p - 128) * 0.5;
    else obj.phase = 0;

    obj.mesh.position.set(x, 0.5, z);

    if (p >= 160) {
    obj.mesh.visible = false;
    obj.phase = 0;
    } else {
    obj.mesh.visible = true;
    }


    const boxBB = new THREE.Box3().setFromObject(obj.mesh);
    trays.forEach(tray => {
      const trayBB = new THREE.Box3().setFromObject(tray);
      tray.material.color.set(boxBB.intersectsBox(trayBB) ? 0x00ff00 : 0xffcc00);
    });
  });
}