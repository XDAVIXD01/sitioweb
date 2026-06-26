<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zona Gamer | Radar Neon</title>
  <style>
    :root {
      --bg: #07080d;
      --panel: rgba(10, 18, 28, 0.78);
      --cyan: #39f6ff;
      --green: #7cff6b;
      --pink: #ff3df2;
      --amber: #ffbf3d;
      --red: #ff3c5f;
      --text: #eef8ff;
      --muted: #92a8bb;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      min-height: 100vh;
      overflow-x: hidden;
      color: var(--text);
      font-family: "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(circle at 15% 20%, rgba(57, 246, 255, 0.18), transparent 30%),
        radial-gradient(circle at 80% 8%, rgba(255, 61, 242, 0.16), transparent 28%),
        linear-gradient(145deg, #05060a 0%, #0b121c 42%, #120a1d 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -2;
      opacity: 0.48;
      background-image:
        linear-gradient(rgba(57, 246, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(57, 246, 255, 0.08) 1px, transparent 1px);
      background-size: 54px 54px;
      mask-image: linear-gradient(to bottom, black, transparent 92%);
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.035) 0,
        rgba(255, 255, 255, 0.035) 1px,
        transparent 1px,
        transparent 5px
      );
      mix-blend-mode: screen;
    }

    .shell {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 24px 0 40px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 64px;
      border-bottom: 1px solid rgba(57, 246, 255, 0.24);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 42px;
      aspect-ratio: 1;
      color: #051018;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--cyan), var(--green));
      box-shadow: 0 0 28px rgba(57, 246, 255, 0.75);
    }

    .nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .nav a,
    .action,
    .trap-button {
      color: var(--text);
      text-decoration: none;
      border: 1px solid rgba(238, 248, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    }

    .nav a:hover,
    .action:hover,
    .trap-button:hover {
      transform: translateY(-2px);
      border-color: var(--cyan);
      box-shadow: 0 0 18px rgba(57, 246, 255, 0.28);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
      gap: 30px;
      align-items: center;
      min-height: calc(100vh - 96px);
      padding: 34px 0;
    }

    .hero-copy h1 {
      max-width: 760px;
      margin: 0;
      font-size: clamp(3rem, 8vw, 6.8rem);
      line-height: 0.9;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow: 0 0 26px rgba(57, 246, 255, 0.55);
    }

    .hero-copy h1 span {
      color: var(--cyan);
    }

    .hero-copy p {
      max-width: 650px;
      margin: 24px 0;
      color: #c9d7e3;
      font-size: 1.08rem;
      line-height: 1.7;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .action.primary {
      color: #061018;
      border-color: transparent;
      background: linear-gradient(135deg, var(--green), var(--cyan));
      box-shadow: 0 0 30px rgba(124, 255, 107, 0.28);
    }

    .hud {
      border: 1px solid rgba(57, 246, 255, 0.28);
      background: var(--panel);
      box-shadow: 0 0 48px rgba(57, 246, 255, 0.14), inset 0 0 28px rgba(57, 246, 255, 0.05);
      backdrop-filter: blur(14px);
      border-radius: 8px;
      padding: 18px;
    }

    .radar {
      position: relative;
      display: grid;
      place-items: center;
      width: min(100%, 380px);
      aspect-ratio: 1;
      margin: 0 auto 18px;
      overflow: hidden;
      border: 2px solid rgba(57, 246, 255, 0.58);
      border-radius: 50%;
      background:
        radial-gradient(circle, transparent 0 18%, rgba(57, 246, 255, 0.14) 19% 20%, transparent 21% 38%, rgba(57, 246, 255, 0.16) 39% 40%, transparent 41% 58%, rgba(57, 246, 255, 0.14) 59% 60%, transparent 61%),
        linear-gradient(rgba(57, 246, 255, 0.14) 1px, transparent 1px),
        linear-gradient(90deg, rgba(57, 246, 255, 0.14) 1px, transparent 1px),
        #061018;
      background-size: auto, 38px 38px, 38px 38px, auto;
      box-shadow: inset 0 0 40px rgba(57, 246, 255, 0.25), 0 0 42px rgba(57, 246, 255, 0.24);
    }

    .radar::before {
      content: "";
      position: absolute;
      width: 50%;
      height: 50%;
      left: 50%;
      top: 0;
      transform-origin: 0 100%;
      background: conic-gradient(from 12deg, rgba(124, 255, 107, 0.62), rgba(124, 255, 107, 0.08), transparent 42deg);
      animation: sweep 3s linear infinite;
    }

    .radar::after {
      content: "";
      position: absolute;
      inset: 50% auto auto 50%;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      box-shadow:
        -86px -44px 0 4px var(--pink),
        74px -90px 0 3px var(--green),
        90px 48px 0 5px var(--amber),
        -34px 92px 0 4px var(--cyan);
      animation: blink 1.2s infinite alternate;
    }

    .radar-core {
      z-index: 1;
      display: grid;
      place-items: center;
      width: 76px;
      aspect-ratio: 1;
      color: #061018;
      border-radius: 50%;
      font-weight: 900;
      background: var(--cyan);
      box-shadow: 0 0 30px rgba(57, 246, 255, 0.78);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .stat {
      min-height: 82px;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
    }

    .stat small {
      color: var(--muted);
      text-transform: uppercase;
      font-weight: 800;
    }

    .stat strong {
      display: block;
      margin-top: 8px;
      font-size: 1.35rem;
    }

    .section-title {
      margin: 10px 0 20px;
      font-size: clamp(1.8rem, 4vw, 3rem);
      text-transform: uppercase;
    }

    .arena {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }

    .tile {
      position: relative;
      min-height: 170px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.13);
      border-radius: 8px;
      padding: 16px;
      background: linear-gradient(150deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025));
      cursor: crosshair;
      transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
    }

    .tile:hover {
      transform: translateY(-4px) scale(1.01);
      border-color: var(--cyan);
      box-shadow: 0 0 26px rgba(57, 246, 255, 0.22);
    }

    .tile::before {
      content: "";
      position: absolute;
      inset: -40%;
      opacity: 0;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 34%);
      transform: translate(var(--mx, 0), var(--my, 0));
      transition: opacity 160ms ease;
    }

    .tile:hover::before {
      opacity: 1;
    }

    .tile h3 {
      position: relative;
      margin: 0 0 10px;
      font-size: 1.18rem;
      text-transform: uppercase;
    }

    .tile p {
      position: relative;
      margin: 0;
      color: #b9c7d4;
      line-height: 1.55;
    }

    .tile .icon {
      position: absolute;
      right: 16px;
      bottom: 12px;
      font-size: 3rem;
      filter: drop-shadow(0 0 14px currentColor);
    }

    .bomb {
      color: var(--red);
    }

    .trap {
      color: var(--amber);
    }

    .shield {
      color: var(--cyan);
    }

    .boost {
      color: var(--green);
    }

    .control-room {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 16px;
      align-items: stretch;
      margin-bottom: 30px;
    }

    .console {
      min-height: 220px;
      border: 1px solid rgba(124, 255, 107, 0.34);
      border-radius: 8px;
      padding: 18px;
      background: rgba(4, 12, 14, 0.72);
      box-shadow: inset 0 0 30px rgba(124, 255, 107, 0.08);
      font-family: Consolas, "Courier New", monospace;
    }

    .log-line {
      margin: 0 0 10px;
      color: #baffb1;
    }

    .trap-panel {
      display: grid;
      align-content: start;
      gap: 10px;
      border: 1px solid rgba(255, 61, 242, 0.32);
      border-radius: 8px;
      padding: 16px;
      background: rgba(17, 9, 22, 0.74);
    }

    .trap-button {
      width: 100%;
      text-align: left;
    }

    .floating {
      position: fixed;
      inset: auto auto 30px 30px;
      z-index: 10;
      display: none;
      max-width: min(360px, calc(100% - 60px));
      padding: 14px 16px;
      border: 1px solid var(--amber);
      border-radius: 8px;
      color: #fff4d7;
      background: rgba(26, 15, 3, 0.92);
      box-shadow: 0 0 26px rgba(255, 191, 61, 0.3);
    }

    .floating.show {
      display: block;
      animation: pop 380ms ease;
    }

    .explosion {
      position: fixed;
      width: 16px;
      aspect-ratio: 1;
      pointer-events: none;
      border-radius: 50%;
      background: var(--amber);
      box-shadow: 0 0 0 8px rgba(255, 191, 61, 0.36), 0 0 0 18px rgba(255, 60, 95, 0.24);
      animation: explode 620ms ease-out forwards;
    }

    @keyframes sweep {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes blink {
      from {
        opacity: 0.38;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes pop {
      from {
        transform: translateY(16px) scale(0.96);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    @keyframes explode {
      to {
        transform: scale(12);
        opacity: 0;
      }
    }

    @media (max-width: 860px) {
      .topbar,
      .hero,
      .control-room {
        grid-template-columns: 1fr;
      }

      .topbar {
        display: grid;
        justify-items: start;
        padding-bottom: 16px;
      }

      .nav {
        justify-content: flex-start;
      }

      .arena {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 560px) {
      .shell {
        width: min(100% - 20px, 1180px);
      }

      .hero {
        min-height: auto;
      }

      .arena,
      .stats {
        grid-template-columns: 1fr;
      }

      .nav a,
      .action {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">GX</div>
        <div>Ghost X Arena</div>
      </div>
      <nav class="nav" aria-label="Navegacion principal">
        <a href="#arena">Arena</a>
        <a href="#control">Control</a>
        <a href="#radar">Radar</a>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <h1>Modo <span>Gamer</span> Activado</h1>
        <p>
          Entra a una zona tactica con radar vivo, luces de energia, trampas reactivas y bombas visuales.
          Cada panel responde a tus movimientos para sentir que estas piloteando una sala de control futurista.
        </p>
        <div class="actions">
          <a class="action primary" href="#arena">Explorar arena</a>
          <button class="action" id="panicButton" type="button">Lanzar bomba flash</button>
        </div>
      </div>

      <aside class="hud" id="radar" aria-label="Radar tactico">
        <div class="radar">
          <div class="radar-core">LIVE</div>
        </div>
        <div class="stats">
          <div class="stat">
            <small>Energia</small>
            <strong id="energy">97%</strong>
          </div>
          <div class="stat">
            <small>Trampas</small>
            <strong id="traps">04</strong>
          </div>
          <div class="stat">
            <small>Riesgo</small>
            <strong id="risk">ALTO</strong>
          </div>
        </div>
      </aside>
    </section>

    <section id="arena">
      <h2 class="section-title">Campo De Batalla</h2>
      <div class="arena">
        <article class="tile bomb" data-message="Bomba magnetica armada. Cuenta regresiva visual iniciada.">
          <h3>Bomba Magnetica</h3>
          <p>Explota con un pulso de luz al tocar el panel. Perfecta para romper escudos enemigos.</p>
          <div class="icon">B</div>
        </article>
        <article class="tile trap" data-message="Trampa laser activada. Los sensores estan siguiendo movimiento.">
          <h3>Trampa Laser</h3>
          <p>Una red de precision que cambia de estado cuando pasas el cursor por encima.</p>
          <div class="icon">T</div>
        </article>
        <article class="tile shield" data-message="Escudo ionico cargado. Defensa temporal lista.">
          <h3>Escudo Ionico</h3>
          <p>Zona defensiva de energia azul para aguantar el siguiente impacto critico.</p>
          <div class="icon">S</div>
        </article>
        <article class="tile boost" data-message="Turbo neon conectado. Velocidad aumentada al maximo.">
          <h3>Turbo Neon</h3>
          <p>Impulso de movimiento con particulas verdes y lectura instantanea del radar.</p>
          <div class="icon">X</div>
        </article>
      </div>
    </section>

    <section class="control-room" id="control">
      <div class="console" id="console" aria-live="polite">
        <p class="log-line">&gt; Sistema iniciado...</p>
        <p class="log-line">&gt; Radar sincronizado con la arena.</p>
        <p class="log-line">&gt; Esperando accion del jugador.</p>
      </div>
      <aside class="trap-panel">
        <h2 class="section-title">Trampas</h2>
        <button class="trap-button" type="button" data-trap="Muro electrico desplegado">Muro electrico</button>
        <button class="trap-button" type="button" data-trap="Mina fantasma escondida">Mina fantasma</button>
        <button class="trap-button" type="button" data-trap="Radar enemigo interferido">Interferencia radar</button>
      </aside>
    </section>
  </main>

  <div class="floating" id="notice">Alerta tactica</div>

  <script>
    const tiles = document.querySelectorAll(".tile");
    const buttons = document.querySelectorAll(".trap-button");
    const panicButton = document.getElementById("panicButton");
    const notice = document.getElementById("notice");
    const consoleBox = document.getElementById("console");
    const energy = document.getElementById("energy");
    const traps = document.getElementById("traps");
    const risk = document.getElementById("risk");
    let trapCount = 4;
    let noticeTimer;

    function showNotice(message) {
      notice.textContent = message;
      notice.classList.add("show");
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => notice.classList.remove("show"), 2600);
    }

    function addLog(message) {
      const line = document.createElement("p");
      line.className = "log-line";
      line.textContent = "> " + message;
      consoleBox.appendChild(line);
      while (consoleBox.children.length > 7) {
        consoleBox.removeChild(consoleBox.firstElementChild);
      }
    }

    function flashAt(x, y) {
      const boom = document.createElement("span");
      boom.className = "explosion";
      boom.style.left = x + "px";
      boom.style.top = y + "px";
      document.body.appendChild(boom);
      boom.addEventListener("animationend", () => boom.remove());
    }

    tiles.forEach((tile) => {
      tile.addEventListener("pointermove", (event) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", event.clientX - rect.left - rect.width / 2 + "px");
        tile.style.setProperty("--my", event.clientY - rect.top - rect.height / 2 + "px");
      });

      tile.addEventListener("click", (event) => {
        const message = tile.dataset.message;
        flashAt(event.clientX, event.clientY);
        showNotice(message);
        addLog(message);
        energy.textContent = Math.max(42, Math.floor(Math.random() * 55) + 42) + "%";
        risk.textContent = ["MEDIO", "ALTO", "CRITICO"][Math.floor(Math.random() * 3)];
      });
    });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        trapCount = Math.max(0, trapCount - 1);
        traps.textContent = String(trapCount).padStart(2, "0");
        showNotice(button.dataset.trap);
        addLog(button.dataset.trap);
      });
    });

    panicButton.addEventListener("click", (event) => {
      flashAt(event.clientX, event.clientY);
      showNotice("Bomba flash lanzada. Toda la arena quedo iluminada.");
      addLog("Bomba flash lanzada por el jugador.");
      document.body.animate(
        [
          { filter: "brightness(1)" },
          { filter: "brightness(1.8) saturate(1.6)" },
          { filter: "brightness(1)" }
        ],
        { duration: 520, easing: "ease-out" }
      );
    });
  </script>
</body>
</html>
