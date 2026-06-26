const stage = document.getElementById("stage");
const natsu = document.getElementById("natsu");
const shadow = document.getElementById("shadow");
const stateLabel = document.getElementById("stateLabel");
const directionLabel = document.getElementById("directionLabel");
const energyLabel = document.getElementById("energyLabel");
const actionButtons = document.querySelectorAll(".action-btn");
const touchButtons = document.querySelectorAll(".touch-pad button");

const frames = {
  idleDown: [
    { x: 43, y: 164, w: 104, h: 206 },
    { x: 43, y: 1084, w: 92, h: 138 },
    { x: 132, y: 1084, w: 92, h: 138 }
  ],
  walkDown: [
    { x: 654, y: 158, w: 106, h: 202 },
    { x: 795, y: 158, w: 106, h: 202 },
    { x: 938, y: 158, w: 106, h: 202 },
    { x: 1080, y: 158, w: 106, h: 202 }
  ],
  walkUp: [
    { x: 48, y: 494, w: 100, h: 190 },
    { x: 188, y: 494, w: 100, h: 190 },
    { x: 330, y: 494, w: 100, h: 190 },
    { x: 472, y: 494, w: 100, h: 190 }
  ],
  walkLeft: [
    { x: 650, y: 478, w: 104, h: 176 },
    { x: 794, y: 478, w: 104, h: 176 },
    { x: 936, y: 478, w: 104, h: 176 },
    { x: 1080, y: 478, w: 104, h: 176 }
  ],
  walkRight: [
    { x: 48, y: 782, w: 104, h: 176 },
    { x: 190, y: 782, w: 104, h: 176 },
    { x: 330, y: 782, w: 104, h: 176 },
    { x: 472, y: 782, w: 104, h: 176 }
  ],
  attack: [
    { x: 252, y: 1086, w: 92, h: 136 },
    { x: 352, y: 1086, w: 96, h: 136 },
    { x: 450, y: 1086, w: 96, h: 136 }
  ],
  magic: [
    { x: 552, y: 1072, w: 130, h: 150 },
    { x: 696, y: 1060, w: 224, h: 165 }
  ],
  damage: [
    { x: 916, y: 1084, w: 90, h: 138 }
  ],
  dead: [
    { x: 1064, y: 1110, w: 164, h: 100 }
  ]
};

const state = {
  x: 50,
  y: 58,
  direction: "down",
  mode: "idle",
  frame: 0,
  frameTimer: 0,
  energy: 100,
  lockedUntil: 0,
  keys: new Set()
};

const labels = {
  down: "Frente",
  up: "Espalda",
  left: "Izquierda",
  right: "Derecha"
};

const keyMap = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right"
};

function currentFrames() {
  if (state.mode === "attack") return frames.attack;
  if (state.mode === "magic") return frames.magic;
  if (state.mode === "damage") return frames.damage;
  if (state.mode === "dead") return frames.dead;
  if (state.mode === "walk") {
    if (state.direction === "up") return frames.walkUp;
    if (state.direction === "left") return frames.walkLeft;
    if (state.direction === "right") return frames.walkRight;
    return frames.walkDown;
  }
  return frames.idleDown;
}

function drawFrame() {
  const set = currentFrames();
  const frame = set[state.frame % set.length];
  natsu.style.width = frame.w + "px";
  natsu.style.height = frame.h + "px";
  natsu.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
  natsu.style.left = state.x + "%";
  natsu.style.top = state.y + "%";
  shadow.style.left = state.x + "%";
  shadow.style.top = state.y + "%";
  stateLabel.textContent = state.mode === "walk" ? "Caminando" : state.mode === "magic" ? "Llama" : state.mode === "attack" ? "Ataque" : state.mode === "damage" ? "Danado" : state.mode === "dead" ? "Caido" : "Reposo";
  directionLabel.textContent = labels[state.direction];
  energyLabel.textContent = state.energy + "%";
}

function setAction(mode, duration) {
  state.mode = mode;
  state.frame = 0;
  state.frameTimer = 0;
  state.lockedUntil = performance.now() + duration;
  if (mode === "magic") {
    state.energy = Math.max(0, state.energy - 12);
    burstFlame();
  }
  if (mode === "attack") {
    state.energy = Math.max(0, state.energy - 5);
    punchFlash();
  }
  if (window.gsap) {
    gsap.fromTo(natsu, { filter: "drop-shadow(0 0 28px rgba(255, 106, 31, 0.9))" }, { filter: "drop-shadow(0 0 12px rgba(255, 106, 31, 0.42))", duration: 0.5 });
  }
  drawFrame();
}

function punchFlash() {
  const flash = document.createElement("span");
  flash.className = "hit-flash";
  flash.style.cssText = `position:absolute;left:${state.x + 7}%;top:${state.y - 13}%;z-index:6;width:90px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,208,90,.8),rgba(255,106,31,.22),transparent 70%);pointer-events:none;`;
  stage.appendChild(flash);
  if (window.gsap) {
    gsap.to(flash, { scale: 2.2, opacity: 0, duration: 0.42, onComplete: () => flash.remove() });
  } else {
    setTimeout(() => flash.remove(), 450);
  }
}

function burstFlame() {
  for (let i = 0; i < 10; i += 1) {
    const ember = document.createElement("span");
    ember.style.cssText = `position:absolute;left:${state.x + 4}%;top:${state.y - 16}%;z-index:7;width:${8 + Math.random() * 14}px;aspect-ratio:1;border-radius:50%;background:#ff6a1f;box-shadow:0 0 18px #ffd05a;pointer-events:none;`;
    stage.appendChild(ember);
    if (window.gsap) {
      gsap.to(ember, {
        x: 80 + Math.random() * 160,
        y: -60 + Math.random() * 90,
        scale: 0,
        opacity: 0,
        duration: 0.75 + Math.random() * 0.35,
        ease: "power2.out",
        onComplete: () => ember.remove()
      });
    } else {
      setTimeout(() => ember.remove(), 900);
    }
  }
}

function handleAction(action) {
  if (action === "attack") setAction("attack", 520);
  if (action === "magic") setAction("magic", 820);
  if (action === "damage") setAction("damage", 650);
  if (action === "dead") setAction("dead", 1300);
  if (action === "idle") {
    state.mode = "idle";
    state.lockedUntil = 0;
    state.frame = 0;
  }
}

function onKeyDown(event) {
  if (keyMap[event.key]) {
    state.keys.add(keyMap[event.key]);
    event.preventDefault();
  }
  if (event.key === "j" || event.key === "J") handleAction("attack");
  if (event.key === "f" || event.key === "F") handleAction("magic");
  if (event.key === "h" || event.key === "H") handleAction("damage");
  if (event.key === "k" || event.key === "K") handleAction("dead");
  if (event.key === "i" || event.key === "I") handleAction("idle");
}

function onKeyUp(event) {
  if (keyMap[event.key]) {
    state.keys.delete(keyMap[event.key]);
    event.preventDefault();
  }
}

function updateMovement(delta) {
  if (performance.now() < state.lockedUntil) return;

  let dx = 0;
  let dy = 0;
  if (state.keys.has("up")) dy -= 1;
  if (state.keys.has("down")) dy += 1;
  if (state.keys.has("left")) dx -= 1;
  if (state.keys.has("right")) dx += 1;

  if (dx || dy) {
    const length = Math.hypot(dx, dy);
    dx /= length;
    dy /= length;
    const speed = 0.021 * delta;
    state.x = Math.min(89, Math.max(11, state.x + dx * speed));
    state.y = Math.min(87, Math.max(28, state.y + dy * speed));
    state.mode = "walk";
    if (Math.abs(dx) > Math.abs(dy)) state.direction = dx > 0 ? "right" : "left";
    else state.direction = dy > 0 ? "down" : "up";
  } else if (state.mode === "walk") {
    state.mode = "idle";
    state.frame = 0;
  }

  if (state.energy < 100 && state.mode !== "magic") {
    state.energy = Math.min(100, state.energy + 0.01 * delta);
  }
}

let previous = performance.now();
function loop(now) {
  const delta = Math.min(40, now - previous);
  previous = now;
  updateMovement(delta);

  const speed = state.mode === "walk" ? 110 : state.mode === "idle" ? 420 : 150;
  state.frameTimer += delta;
  if (state.frameTimer > speed) {
    state.frameTimer = 0;
    state.frame += 1;
    if (performance.now() >= state.lockedUntil && ["attack", "magic", "damage", "dead"].includes(state.mode)) {
      state.mode = "idle";
      state.frame = 0;
    }
  }
  drawFrame();
  requestAnimationFrame(loop);
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => handleAction(button.dataset.action));
});

touchButtons.forEach((button) => {
  const key = keyMap[button.dataset.hold];
  button.addEventListener("pointerdown", () => {
    state.keys.add(key);
    stage.focus();
  });
  button.addEventListener("pointerup", () => state.keys.delete(key));
  button.addEventListener("pointercancel", () => state.keys.delete(key));
  button.addEventListener("pointerleave", () => state.keys.delete(key));
});

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
stage.addEventListener("pointerdown", () => stage.focus());

if (window.gsap) {
  gsap.from(".trainer-console > *", { y: 18, opacity: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" });
  gsap.from(".stage-panel", { scale: 0.98, opacity: 0, duration: 0.65, ease: "power3.out" });
}

drawFrame();
stage.focus();
requestAnimationFrame(loop);
