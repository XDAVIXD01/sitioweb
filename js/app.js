import * as THREE from "../vendor/three.module.js";

const canvas = document.getElementById("battlefield");

gsap.from(".hero-copy > *", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
gsap.from(".character-card", { x: 28, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.16 });

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x09070c, 0.034);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5.1, 10.8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

scene.add(new THREE.AmbientLight(0xffd5c2, 0.48));

const peachLight = new THREE.PointLight(0xffb36b, 3.2, 18);
peachLight.position.set(-4, 5, 4);
scene.add(peachLight);

const violetLight = new THREE.PointLight(0xb77cff, 2.8, 15);
violetLight.position.set(5, 3, -2);
scene.add(violetLight);

const grid = new THREE.GridHelper(36, 36, 0xffb36b, 0x493040);
grid.material.transparent = true;
grid.material.opacity = 0.28;
group.add(grid);

const ringColors = [0xffb36b, 0xff7ca8, 0xb77cff, 0x8dffcf];
for (let i = 0; i < 5; i += 1) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.4 + i * 1.25, 0.012, 12, 96),
    new THREE.MeshBasicMaterial({ color: ringColors[i % ringColors.length], transparent: true, opacity: 0.5 - i * 0.055 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  group.add(ring);
}

const towerMaterial = new THREE.MeshStandardMaterial({
  color: 0x171018,
  emissive: 0x34203f,
  metalness: 0.45,
  roughness: 0.38
});

const glowMaterials = ringColors.map((color) => new THREE.MeshStandardMaterial({
  color,
  emissive: color,
  emissiveIntensity: 0.9,
  metalness: 0.2,
  roughness: 0.24
}));

const towers = [];
[
  [-5.8, -4.4, 1.8],
  [-2.8, -2.1, 2.7],
  [3.2, -3.8, 2.2],
  [5.8, -0.8, 3.1],
  [-6.2, 1.8, 2.4],
  [1.3, 2.4, 3.4],
  [5.1, 3.2, 2.5]
].forEach(([x, z, height], index) => {
  const tower = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.82, height, 0.82), towerMaterial);
  base.position.y = height / 2;
  const top = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), glowMaterials[index % glowMaterials.length]);
  top.position.y = height + 0.42;
  tower.add(base, top);
  tower.position.set(x, 0, z);
  towers.push({ top });
  group.add(tower);
});

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.86, 1),
  new THREE.MeshStandardMaterial({ color: 0xff7ca8, emissive: 0xff7ca8, emissiveIntensity: 1.15, metalness: 0.2, roughness: 0.24 })
);
core.position.y = 1.1;
group.add(core);

const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xffd5c2, size: 0.035, transparent: true, opacity: 0.68 })
);

const particlePositions = [];
for (let i = 0; i < 520; i += 1) {
  particlePositions.push((Math.random() - 0.5) * 28, Math.random() * 8 + 0.4, (Math.random() - 0.5) * 20);
}
particles.geometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
scene.add(particles);

function animate(time) {
  const seconds = time * 0.001;
  group.rotation.y = Math.sin(seconds * 0.18) * 0.12;
  core.rotation.x = seconds * 0.75;
  core.rotation.y = seconds * 1.1;
  core.position.y = 1.1 + Math.sin(seconds * 2.2) * 0.12;
  particles.rotation.y = seconds * 0.035;

  towers.forEach(({ top }, index) => {
    top.rotation.y = seconds * (0.8 + index * 0.04);
    top.position.y += Math.sin(seconds * 2 + index) * 0.0018;
  });

  camera.position.x = Math.sin(seconds * 0.16) * 0.55;
  camera.lookAt(0, 0.8, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
requestAnimationFrame(animate);
