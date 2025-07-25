// physics.js
export let world, chassisBody;
export const wheelBodies = [];

export function initPhysics(CANNON) {
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  // 🚜 Forklift chassis body
  chassisBody = new CANNON.Body({ mass: 150 });
  const chassisShape = new CANNON.Box(new CANNON.Vec3(1.2, 0.4, 2.0));
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 0.5, -5);
  world.addBody(chassisBody);

  // 🛞 Add 4 wheels
  const wheelOffsets = [
    [-1.0, -0.4, -1.5], // Front left
    [1.0, -0.4, -1.5],  // Front right
    [-1.0, -0.4, 1.5],  // Rear left
    [1.0, -0.4, 1.5]    // Rear right
  ];

  wheelOffsets.forEach(([x, y, z]) => {
    const wheel = new CANNON.Body({ mass: 20 });
    const wheelShape = new CANNON.Sphere(0.3);
    wheel.addShape(wheelShape);
    wheel.position.set(chassisBody.position.x + x, chassisBody.position.y + y, chassisBody.position.z + z);
    wheelBodies.push(wheel);
    world.addBody(wheel);

    // 🔗 Constraint: Simple hinge constraint to allow rotation
    const hinge = new CANNON.HingeConstraint(chassisBody, wheel, {
      pivotA: new CANNON.Vec3(x, y, z),
      axisA: new CANNON.Vec3(0, 0, 1),
      pivotB: new CANNON.Vec3(0, 0, 0),
      axisB: new CANNON.Vec3(0, 0, 1)
    });
    world.addConstraint(hinge);
  });
}

export function updatePhysics(dt) {
  world.step(dt);
}