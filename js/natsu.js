const stage = document.getElementById("stage");
const natsu = document.getElementById("natsu");
const shadow = document.getElementById("shadow");
const stateLabel = document.getElementById("stateLabel");
const directionLabel = document.getElementById("directionLabel");
const energyLabel = document.getElementById("energyLabel");
const actionButtons = document.querySelectorAll("[data-action]");
const touchButtons = document.querySelectorAll("[data-hold]");
const audio = document.getElementById("musicAudio");
const trackName = document.getElementById("trackName");
const playButtons = document.querySelectorAll("#playPause, #mobilePlayPause");
const mobilePrevTrack = document.getElementById("mobilePrevTrack");
const mobileNextTrack = document.getElementById("mobileNextTrack");
const trackButtons = document.querySelectorAll("[data-track]");
const volumeControl = document.getElementById("volumeControl");
const audioStatus = document.getElementById("audioStatus");

const spriteBase = "assets/natsu_sprites/";
const tracks = {
  natsu: {
    title: "Natsu Theme",
    src: "assets/audio/natsu-theme.mp3"
  },
  battle: {
    title: "Gekitou Mahoujin",
    src: "assets/audio/gekitou-mahoujin.mp3"
  }
};
const trackOrder = ["natsu", "battle"];
let currentTrack = "natsu";

const frames = {
  idleDown: ["idle_front_01", "idle_front_02"],
  walkDown: ["walk_down_01", "walk_down_02", "walk_down_03", "walk_down_04"],
  walkUp: ["walk_up_01", "walk_up_02", "walk_up_03", "walk_up_04"],
  walkLeft: ["walk_left_01", "walk_left_02", "walk_left_03", "walk_left_04"],
  walkRight: ["walk_right_01", "walk_right_02", "walk_right_03", "walk_right_04"],
  attack: ["attack_front_01", "attack_front_02", "attack_front_03", "attack_front_04", "attack_front_05", "attack_front_06", "attack_front_07"],
  magic: ["magic_fire_01", "magic_fire_02", "magic_fire_03", "magic_fire_04", "magic_fire_05", "magic_fire_06", "magic_fire_07"],
  damage: ["hurt_01"],
  dead: ["death_01", "death_02"]
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

Object.values(frames).flat().forEach((name) => {
  const img = new Image();
  img.src = spriteBase + name + ".png";
});

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
  const frameName = set[state.frame % set.length];
  natsu.style.backgroundImage = `url("${spriteBase}${frameName}.png")`;
  natsu.style.left = state.x + "%";
  natsu.style.top = state.y + "%";
  shadow.style.left = state.x + "%";
  shadow.style.top = state.y + "%";
  stateLabel.textContent = state.mode === "walk" ? "Caminando" : state.mode === "magic" ? "Llama" : state.mode === "attack" ? "Ataque" : state.mode === "damage" ? "Danado" : state.mode === "dead" ? "Caido" : "Reposo";
  directionLabel.textContent = labels[state.direction];
  energyLabel.textContent = Math.round(state.energy) + "%";
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

function syncPlayLabels() {
  const label = audio.paused ? "Play" : "Pausa";
  playButtons.forEach((button) => {
    if (button.classList.contains("icon-player")) {
      button.classList.toggle("is-playing", !audio.paused);
      button.setAttribute("aria-label", audio.paused ? "Reproducir" : "Pausar");
    } else {
      button.textContent = label;
    }
  });
  if (audioStatus && !audio.paused) {
    audioStatus.textContent = "Reproduciendo automaticamente.";
  }
}

function setTrack(trackId) {
  const track = tracks[trackId];
  if (!track) return;
  const wasPlaying = !audio.paused;
  currentTrack = trackId;
  audio.src = track.src;
  trackName.textContent = track.title;
  trackButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.track === trackId);
  });
  if (wasPlaying) {
    startMusic().catch(() => syncPlayLabels());
  }
}

function changeTrack(step) {
  const currentIndex = trackOrder.indexOf(currentTrack);
  const nextIndex = (currentIndex + step + trackOrder.length) % trackOrder.length;
  setTrack(trackOrder[nextIndex]);
  startMusic().catch(syncPlayLabels);
}

function startMusic() {
  audio.muted = false;
  return audio.play().then(() => {
    syncPlayLabels();
    if (audioStatus) audioStatus.textContent = "Reproduciendo automaticamente.";
  }).catch((error) => {
    syncPlayLabels();
    if (audioStatus) {
      audioStatus.textContent = "El navegador bloqueo el inicio automatico. Toca Play o cualquier control.";
    }
    throw error;
  });
}

function toggleMusic() {
  if (audio.paused) {
    startMusic().catch(syncPlayLabels);
  } else {
    audio.pause();
    if (audioStatus) audioStatus.textContent = "Musica pausada.";
    syncPlayLabels();
  }
}

function tryAutoplay() {
  audio.volume = volumeControl ? Number(volumeControl.value) : 0.65;
  audio.load();
  startMusic().catch(() => {
    const unlock = () => {
      startMusic().catch(syncPlayLabels);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
  });
}

function requestLandscapeMode() {
  if (!matchMedia("(max-width: 980px)").matches) return;
  const root = document.documentElement;
  const goFullscreen = root.requestFullscreen ? root.requestFullscreen.bind(root) : null;
  const lock = () => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(() => {});
    }
  };
  if (goFullscreen && !document.fullscreenElement) {
    goFullscreen().then(lock).catch(lock);
  } else {
    lock();
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

playButtons.forEach((button) => {
  button.addEventListener("click", toggleMusic);
});

trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTrack(button.dataset.track);
    startMusic().catch(syncPlayLabels);
  });
});

if (mobilePrevTrack) {
  mobilePrevTrack.addEventListener("click", () => changeTrack(-1));
}

if (mobileNextTrack) {
  mobileNextTrack.addEventListener("click", () => changeTrack(1));
}

if (volumeControl) {
  audio.volume = Number(volumeControl.value);
  volumeControl.addEventListener("input", () => {
    audio.volume = Number(volumeControl.value);
  });
}

audio.addEventListener("play", syncPlayLabels);
audio.addEventListener("pause", syncPlayLabels);
audio.addEventListener("error", () => {
  if (audioStatus) audioStatus.textContent = "No se pudo cargar el archivo de audio.";
});

touchButtons.forEach((button) => {
  if (button.classList.contains("center")) return;
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
window.addEventListener("pointerdown", requestLandscapeMode, { once: true });
stage.addEventListener("pointerdown", () => stage.focus());

if (window.gsap) {
  gsap.from(".trainer-console > *", { y: 18, opacity: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" });
  gsap.from(".stage-panel", { scale: 0.98, opacity: 0, duration: 0.65, ease: "power3.out" });
}

drawFrame();
stage.focus();
tryAutoplay();
requestAnimationFrame(loop);
