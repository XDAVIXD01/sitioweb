const icons = {
  home: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
  gamepad:
    '<path d="M7 7h10c3 0 5 10 4 12-2 2-5-3-6-3H9c-1 0-4 5-6 3C2 17 4 7 7 7Z"/><path d="M6 11h5M8.5 8.5v5M16 10h.01M18 13h.01"/>',
  orbit:
    '<circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="12" ry="4" transform="rotate(-40 12 12)"/>',
  book: '<path d="M12 5C9 2 4 3 2 4v16c3-2 7-2 10 0 3-2 7-2 10 0V4c-3-1-7-2-10 1v15"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>',
  moon: '<path d="M20.5 14A9 9 0 0 1 10 3a9 9 0 1 0 10.5 11Z"/><path d="m17 3 .5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  flame:
    '<path d="M13 2c1 6-4 6-2 10-3-1-4-3-4-5-6 7-5 15 5 15 9 0 11-10 5-15 0 4-2 5-2 5 1-5-1-8-2-10Z" fill="currentColor" stroke="none"/>',
  user: '<circle cx="12" cy="7" r="4" fill="currentColor" stroke="none"/><path d="M4 22v-5c0-7 16-7 16 0v5Z" fill="currentColor" stroke="none"/>',
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M12 17v4m-5 0h10"/>',
  arrow: '<path d="M3 12h17m-6-6 6 6-6 6"/>',
  phone:
    '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 5h6M11 19h2"/>',
  music:
    '<path d="M9 17V5l12-3v12M9 8l12-3"/><ellipse cx="5.5" cy="18.5" rx="3.5" ry="2.5" fill="currentColor"/><ellipse cx="17.5" cy="15.5" rx="3.5" ry="2.5" fill="currentColor"/>',
  settings:
    '<path d="m10 2-1 3-3 1-3-1-2 4 3 2v3l-2 2 2 4 3-1 3 1 1 3 4-1 1-3 3-1 3 1 2-4-3-2v-3l2-2-2-4-3 1-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
  chevron: '<path d="m3 8 9 8 9-8"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>',
};
function renderIcon(element, name) {
  element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}
document
  .querySelectorAll("[data-icon]")
  .forEach((element) => renderIcon(element, element.dataset.icon));
const themeToggle = document.querySelector("#theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "light"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Activar tema claro" : "Activar tema oscuro",
  );
  renderIcon(themeToggle.querySelector("i"), theme === "dark" ? "moon" : "sun");
}
try {
  applyTheme(localStorage.getItem("hb-theme") === "light" ? "light" : "dark");
} catch {
  applyTheme("dark");
}
themeToggle.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("hb-theme", theme);
  } catch {
    /* Theme works without storage. */
  }
});
const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}
menuToggle.addEventListener("click", () => {
  const open = navigation.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
const panels = {
  modes: {
    title: "Elige tu entrenamiento",
    content:
      '<p>Entra al campo de práctica de tu personaje. Muévete libremente, combina ataques y prueba su magia a tu ritmo.</p><div class="dialog-links"><a class="btn natsu-cta" href="natsu.html">Natsu · Magia de fuego →</a><a class="btn zeref-cta" href="zeref.html">Zeref · Magia oscura →</a></div>',
  },
  guide: {
    title: "Todo empieza con un movimiento",
    content:
      '<p>Elige a Natsu o Zeref para entrar al campo de entrenamiento.</p><div class="control-row"><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> o las flechas · Moverte</div><div class="control-row"><kbd>J</kbd> · Ataque frontal</div><div class="control-row"><kbd>F</kbd> · Llama o magia oscura</div><p>En celular, usa el joystick y los botones táctiles del campo. Controla la música y el volumen desde el reproductor de cada personaje.</p>',
  },
  downloads: {
    title: "Lleva la música contigo",
    content:
      '<p>El portal se juega directamente desde el navegador, sin instalar nada. También puedes descargar las pistas incluidas.</p><div class="dialog-links"><a class="btn natsu-cta" href="assets/audio/natsu-theme.mp3" download="natsu-theme.mp3">↓ Natsu Theme · MP3</a><a class="btn zeref-cta" href="assets/audio/gekitou-mahoujin.mp3" download="gekitou-mahoujin.mp3">↓ Gekitou Mahoujin · MP3</a></div>',
  },
};
const dialog = document.querySelector("#info-dialog");
document.querySelectorAll("[data-dialog]").forEach((button) =>
  button.addEventListener("click", () => {
    const panel = panels[button.dataset.dialog];
    document.querySelector("#dialog-title").textContent = panel.title;
    document.querySelector("#dialog-content").innerHTML = panel.content;
    closeMenu();
    dialog.showModal();
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
