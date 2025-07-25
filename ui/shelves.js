export const trays = [];
export const shelfBoxes = [];

export function createShelves(scene) {
  const rackGroup = new THREE.Group();

  for (let x = -10; x <= 10; x += 2) {
    for (let level = 0; level < 4; level++) {
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.2, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xffcc00 })
      );
      tray.position.set(x, 1.2 + level * 1.2, -10);
      tray.castShadow = true;
      rackGroup.add(tray);
      trays.push(tray);

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x3399ff })
      );
      box.position.set(x, 1.5 + level * 1.2, -10);
      box.userData = {
        label: `Shelf box ${x}, level ${level}`,
        info: `Contains product batch #${x * 10 + level}`
      };
      box.castShadow = true;
      scene.add(box);
      shelfBoxes.push(box);

      const uprights = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 5, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      uprights.position.set(x, 2.5, -11);
      rackGroup.add(uprights);
    }
  }

  scene.add(rackGroup);
}

