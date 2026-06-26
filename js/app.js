import * as THREE from "../vendor/three.module.js";

const canvas = document.getElementById("battlefield");
const toast = document.getElementById("toast");
const log = document.getElementById("log");
const energyValue = document.getElementById("energyValue");
const threatValue = document.getElementById("threatValue");
const trapValue = document.getElementById("trapValue");
const energyBar = document.getElementById("energyBar");
const threatBar = document.getElementById("threatBar");
const trapBar = document.getElementById("trapBar");
const deployBtn = document.getElementById("deployBtn");
const overloadBtn = document.getElementById("overloadBtn");
const missionCards = document.querySelectorAll(".mission-card");
const trapButtons = document.querySelectorAll(".trap-btn");

let traps = 6;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  gsap.fromTo(toast, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addLog(message) {
  const line = document.createElement("p");
  line.textContent = "> " + message;
  log.appendChild(line);
  while (log.children.length > 8) {
    log.removeChild(log.firstElementChild);
  }
}

function blast(x, y) {
  const node = document.createElement("span");
  node.className = "blast";
  node.style.left = x + "px";
  node.style.top = y + "px";
  document.body.appendChild(node);
  gsap.to(node, {
    scale: 14,
    opacity: 0,
    duration: 0.72,
    ease: "power3.out",
    onComplete: () => node.remove()
  });
}

function setBars(energy, threat) {
  energyValue.textContent = energy + "%";
  threatValue.textContent = threat > 82 ? "Critica" : threat > 56 ? "Alta" : "Media";
  energyBar.style.width = energy + "%";
  threatBar.style.width = threat + "%";
}

function updateTrapCount() {
  trapValue.textContent = String(traps).padStart(2, "0");
  trapBar.style.width = Math.max(8, traps / 6 * 100) + "%";
}

missionCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", event.clientX - rect.left - rect.width / 2 + "px");
    card.style.setProperty("--my", event.clientY - rect.top - rect.height / 2 + "px");
  });

  card.addEventListener("click", (event) => {
    const message = card.dataset.action;
    blast(event.clientX, event.clientY);
    showToast(message);
    addLog(message);
    setBars(Math.floor(68 + Math.random() * 28), Math.floor(45 + Math.random() * 52));
    pulseScene(card.dataset.type);
  });
});

trapButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    traps = Math.max(0, traps - 1);
    updateTrapCount();
    blast(event.clientX, event.clientY);
    showToast(button.dataset.trap);
    addLog(button.dataset.trap);
    pulseScene("trap");
  });
});

deployBtn.addEventListener("click", (event) => {
  blast(event.clientX, event.clientY);
  showToast("Despliegue iniciado. Escuadron entrando por el flanco este.");
  addLog("Despliegue tactico confirmado.");
  setBars(100, 62);
  pulseScene("scan");
});

overloadBtn.addEventListener("click", (event) => {
  blast(event.clientX, event.clientY);
  showToast("Nucleo sobrecargado. Potencia maxima durante 8 segundos.");
  addLog("Sobrecarga del nucleo activada.");
  gsap.fromTo(document.body, { filter: "brightness(1.65) saturate(1.5)" }, { filter: "brightness(1) saturate(1)", duration: 0.9 });
  pulseScene("bomb");
});

gsap.from(".hero-copy > *", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
gsap.from(".hud", { x: 28, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.15 });

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04070d, 0.034);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5.1, 10.8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

const ambient = new THREE.AmbientLight(0x6cdfff, 0.45);
scene.add(ambient);

const cyanLight = new THREE.PointLight(0x46e8ff, 3.8, 18);
cyanLight.position.set(-4, 5, 4);
scene.add(cyanLight);

const pinkLight = new THREE.PointLight(0xff4df0, 2.4, 15);
pinkLight.position.set(5, 3, -2);
scene.add(pinkLight);

const grid = new THREE.GridHelper(36, 36, 0x46e8ff, 0x163647);
grid.material.transparent = true;
grid.material.opacity = 0.34;
group.add(grid);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x46e8ff, transparent: true, opacity: 0.72 });
for (let i = 0; i < 5; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4 + i * 1.25, 0.012, 12, 96), ringMaterial.clone());
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  ring.material.opacity = 0.5 - i * 0.06;
  group.add(ring);
}

const towerMaterial = new THREE.MeshStandardMaterial({
  color: 0x081522,
  emissive: 0x123a52,
  metalness: 0.65,
  roughness: 0.28
});

const topMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xff3f63, emissive: 0xff173d, emissiveIntensity: 1.2 }),
  new THREE.MeshStandardMaterial({ color: 0x8dff71, emissive: 0x4bff35, emissiveIntensity: 1.1 }),
  new THREE.MeshStandardMaterial({ color: 0xffc247, emissive: 0xff8c1f, emissiveIntensity: 1.1 }),
  new THREE.MeshStandardMaterial({ color: 0x8f68ff, emissive: 0x7655ff, emissiveIntensity: 1.1 })
];

const towers = [];
const towerPositions = [
  [-5.8, -4.4, 1.8],
  [-2.8, -2.1, 2.7],
  [3.2, -3.8, 2.2],
  [5.8, -0.8, 3.1],
  [-6.2, 1.8, 2.4],
  [1.3, 2.4, 3.4],
  [5.1, 3.2, 2.5]
];

towerPositions.forEach(([x, z, height], index) => {
  const tower = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.82, height, 0.82), towerMaterial);
  base.position.y = height / 2;
  const top = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), topMaterials[index % topMaterials.length]);
  top.position.y = height + 0.42;
  tower.add(base, top);
  tower.position.set(x, 0, z);
  towers.push({ tower, top });
  group.add(tower);
});

const sweep = new THREE.Mesh(
  new THREE.CircleGeometry(7.6, 64, 0, Math.PI / 5),
  new THREE.MeshBasicMaterial({ color: 0x8dff71, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
);
sweep.rotation.x = -Math.PI / 2;
sweep.position.y = 0.08;
group.add(sweep);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.86, 1),
  new THREE.MeshStandardMaterial({ color: 0x46e8ff, emissive: 0x46e8ff, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.22 })
);
core.position.y = 1.1;
group.add(core);

const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0x9df6ff, size: 0.035, transparent: true, opacity: 0.72 })
);

const particlePositions = [];
for (let i = 0; i < 520; i += 1) {
  particlePositions.push(
    (Math.random() - 0.5) * 28,
    Math.random() * 8 + 0.4,
    (Math.random() - 0.5) * 20
  );
}
particles.geometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
scene.add(particles);

function pulseScene(type) {
  const color = type === "bomb" ? 0xff3f63 : type === "trap" ? 0xffc247 : type === "scan" ? 0x46e8ff : 0x8dff71;
  core.material.emissive.setHex(color);
  gsap.fromTo(core.scale, { x: 1.7, y: 1.7, z: 1.7 }, { x: 1, y: 1, z: 1, duration: 0.55, ease: "power2.out" });
  gsap.to(cyanLight, { intensity: 6.5, duration: 0.14, yoyo: true, repeat: 1 });
}

function animate(time) {
  const seconds = time * 0.001;
  group.rotation.y = Math.sin(seconds * 0.18) * 0.12;
  sweep.rotation.z = seconds * 1.35;
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
