import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");

    // Velocidades parallax (px/seg)
    this.cloudSpeedPxPerSec = 14;
    this.backfieldSpeedPxPerSec = 2;

    // Para mantener continuidad en resize
    this._cloudScroll = 0;
    this._backScroll = 0;

    // Navegación por teclado
    this._selectedIndex = 0;
    this._buttonObjs = [];

    // Navegación por mando
    this._menuNavRepeatMs = 170;
    this._lastMenuNavAt = -Infinity;
    this._menuActionHeld = false;
  }

  create() {
    this.buildBackground();
    this.buildUI();

    // Resize (FIT): re-layout sin romper el loop
    this.scale.on("resize", () => {
      this.layoutBackground();
      this.layoutUI();
    });

    const settings = JSON.parse(localStorage.getItem("settings")) ?? {};

    this.sound.mute = settings.mute ?? false;

    let music = this.sound.get("menu_music");

    if (!music && (settings.menuMusicEnabled ?? true)) {
      music = this.sound.add("menu_music", {
        loop: true,
        volume: settings.menuVolume ?? 1
      });
    } else if (music) {
      // actualiza volumen si ya existe
      music.setVolume(settings.menuVolume ?? 1);

      if (!(settings.menuMusicEnabled ?? true)) {
        music.setVolume(0);
      }
    }

    this.menuMusic = music;

    this.input.once("pointerdown", () => {
      this.sound.context.resume();

      if (this.menuMusic && !this.menuMusic.isPlaying && (settings.menuMusicEnabled ?? true)) {
        this.menuMusic.play();
      }
    });

    this.input.keyboard.once("keydown", () => {
      this.sound.context.resume();

      if (this.menuMusic && !this.menuMusic.isPlaying && (settings.menuMusicEnabled ?? true)) {
        this.menuMusic.play();
      }
    });

    if (this.input.gamepad) {
      this.input.gamepad.once("down", () => {
        this.sound.context.resume();

        if (this.menuMusic && !this.menuMusic.isPlaying && (settings.menuMusicEnabled ?? true)) {
          this.menuMusic.play();
        }
      });
    }

    this.setupKeyboard();
    this.setupGamepadMenu();
  }

  // -----------------------------
  // BACKGROUND
  // -----------------------------
  buildBackground() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Capas (atrás -> delante)
    this.sky = this.add.image(W / 2, H / 2, "sky").setDepth(0);

    // Nubes: 2 copias para loop continuo
    this.cloudA = this.add.image(0, H / 2, "clouds").setOrigin(0, 0.5).setDepth(1);
    this.cloudB = this.add.image(0, H / 2, "clouds").setOrigin(0, 0.5).setDepth(1);

    // backfield: 2 copias para parallax suave
    this.backA = this.add.image(0, H / 2, "backfield").setOrigin(0, 0.5).setDepth(2);
    this.backB = this.add.image(0, H / 2, "backfield").setOrigin(0, 0.5).setDepth(2);

    // Árboles y suelo
    this.trees = this.add.image(W / 2, H, "trees").setDepth(3);
    this.ground = this.add.image(W / 2, H / 2, "ground").setDepth(4);

    // Árboles: origin abajo para sway realista
    this.trees.setOrigin(0.5, 1);

    // Aplicar escala/colocación inicial
    this.layoutBackground();
  }

  layoutBackground() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Sky cubre pantalla
    this._scaleToCover(this.sky, W, H).setPosition(W / 2, H / 2);

    // Ground cubre pantalla
    this._scaleToCover(this.ground, W, H).setPosition(W / 2, H / 2);

    // Trees cubre y anclado abajo
    this._scaleToCover(this.trees, W, H);
    this.trees.y = H;

    this._treesBaseX = W / 2;
    this.trees.x = this._treesBaseX;

    // Backfield parallax: escala igual en A/B
    this._scaleToCover(this.backA, W, H);
    this.backB.setScale(this.backA.scaleX, this.backA.scaleY);

    const bw = this.backA.displayWidth;
    this.backA.y = H / 2;
    this.backB.y = H / 2;

    // Posición basada en scroll acumulado (sin reset brusco)
    const backOffset = ((this._backScroll % bw) + bw) % bw;
    this.backA.x = -backOffset;
    this.backB.x = this.backA.x + bw;

    // Clouds parallax: escala igual
    this._scaleToCover(this.cloudA, W, H);
    this.cloudB.setScale(this.cloudA.scaleX, this.cloudA.scaleY);

    const cw = this.cloudA.displayWidth;
    this.cloudA.y = H / 2;
    this.cloudB.y = H / 2;

    const cloudOffset = ((this._cloudScroll % cw) + cw) % cw;
    this.cloudA.x = -cloudOffset;
    this.cloudB.x = this.cloudA.x + cw;
  }

  update(_, dt) {
    const dts = dt / 1000;

    // Acumular scroll (mantiene continuidad en resize)
    this._cloudScroll += this.cloudSpeedPxPerSec * dts;
    this._backScroll += this.backfieldSpeedPxPerSec * dts;

    // Aplicar posiciones según scroll
    const cw = this.cloudA.displayWidth;
    const bw = this.backA.displayWidth;

    const cloudOffset = ((this._cloudScroll % cw) + cw) % cw;
    this.cloudA.x = -cloudOffset;
    this.cloudB.x = this.cloudA.x + cw;

    const backOffset = ((this._backScroll % bw) + bw) % bw;
    this.backA.x = -backOffset;
    this.backB.x = this.backA.x + bw;

    this.updateGamepadMenu();
  }

  _scaleToCover(img, W, H) {
    const s = Math.max(W / img.width, H / img.height);
    img.setScale(s);
    return img;
  }

  // -----------------------------
  // UI (Título + botones)
  // -----------------------------
  buildUI() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Container centrado
    this.ui = this.add.container(W / 2, H / 2).setDepth(10);

    // Panel título
    this.titlePanel = this.add
      .rectangle(0, -170, 560, 110, 0x000000, 0.35)
      .setStrokeStyle(4, 0xffffff, 0.25)
      .setOrigin(0.5);

    // Título (blanco con borde negro)
    this.titleText = this.add
      .text(0, -178, "THE DUCKLER", {
        fontFamily: "ReturnOfTheBoss",
        fontSize: "56px",
        fontStyle: "normal",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        resolution: 2,
      })
      .setOrigin(0.5);

    // Botones (4)
    const items = [
      { label: "JUGAR", fn: () => this.startGameTransition() },
      { label: "CONFIGURACIÓN", fn: () => this.scene.start("SettingsScene") },
      { label: "CRÉDITOS", fn: () => console.log("CREDITOS") },
      { label: "SALIR", fn: () => console.log("SALIR") },
    ];

    this._buttonObjs = items.map((it, i) => this._makeButton(it.label, it.fn, i));

    // Añadir al UI container
    this.ui.add([this.titlePanel, this.titleText]);
    this._buttonObjs.forEach((b) => this.ui.add([b.bg, b.label]));

    // Flotación sutil del título
    this.tweens.add({
      targets: [this.titlePanel, this.titleText],
      y: "+=4",
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    this.layoutUI();
    this.updateButtonSelection();
  }

  layoutUI() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Centrar container
    this.ui.setPosition(W / 2, H / 2);

    // Colocar botones en columna
    const startY = -20;
    const gap = 70;

    this._buttonObjs.forEach((b, i) => {
      const y = startY + i * gap;
      b.bg.setPosition(0, y);
      b.label.setPosition(0, y - 10);
    });
  }

  // -----------------------------
  // BOTÓN (mejorado)
  // - Texto blanco con borde negro
  // - Hover/selección: borde y glow sutil
  // -----------------------------
  _makeButton(text, onClick, index) {
    const bg = this.add
      .rectangle(0, 0, 380, 56, 0x000000, 0.35)
      .setStrokeStyle(3, 0xffffff, 0.25)
      .setOrigin(0.5);

    const label = this.add
      .text(0, 0, text, {
        fontFamily: "ReturnOfTheBoss",
        fontSize: "28px",
        fontStyle: "normal",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 5,
        resolution: 2,

        // Sombra sutil para que destaque aún más (opcional pero queda bien)
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 2,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Interacción: haz clickable tanto el fondo como el texto
    const makeSelected = () => {
      this._selectedIndex = index;
      this.updateButtonSelection();
    };

    bg.setInteractive({ useHandCursor: true });
    label.setInteractive({ useHandCursor: true });

    bg.on("pointerover", makeSelected);
    label.on("pointerover", makeSelected);

    const press = () => {
      bg.setScale(0.98);
      label.setScale(0.98);
    };

    const release = () => {
      bg.setScale(1);
      label.setScale(1);
      onClick?.();
    };

    bg.on("pointerdown", press);
    label.on("pointerdown", press);

    bg.on("pointerup", release);
    label.on("pointerup", release);

    const out = () => this.updateButtonSelection();
    bg.on("pointerout", out);
    label.on("pointerout", out);

    return { bg, label, onClick };
  }

  // -----------------------------
  // Keyboard nav
  // -----------------------------
  setupKeyboard() {
    this.input.keyboard.on("keydown-UP", () => {
      this._selectedIndex = (this._selectedIndex - 1 + this._buttonObjs.length) % this._buttonObjs.length;
      this.updateButtonSelection();
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this._selectedIndex = (this._selectedIndex + 1) % this._buttonObjs.length;
      this.updateButtonSelection();
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      const b = this._buttonObjs[this._selectedIndex];
      b?.onClick?.();
    });
  }

  setupGamepadMenu() {
    this._menuNavRepeatMs = 170;
    this._lastMenuNavAt = -Infinity;
    this._menuActionHeld = false;
  }

  _getPrimaryPad() {
    if (!this.input?.gamepad) return null;
    const pads = this.input.gamepad.getAll();
    if (!pads || pads.length === 0) return null;
    return pads.find((pad) => pad && pad.connected) || pads[0];
  }

  _getPadAxis(pad, axisIndex) {
    if (!pad || !Array.isArray(pad.axes) || !pad.axes[axisIndex]) return 0;
    const axis = pad.axes[axisIndex];
    if (typeof axis.getValue === "function") return axis.getValue();
    if (typeof axis.value === "number") return axis.value;
    return 0;
  }

  _isPadButtonDown(pad, buttonIndex) {
    if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) return false;
    const button = pad.buttons[buttonIndex];
    return !!(button.pressed || (typeof button.value === "number" && button.value > 0.5));
  }

  _moveSelection(delta) {
    if (!this._buttonObjs.length) return;
    const count = this._buttonObjs.length;
    this._selectedIndex = (this._selectedIndex + delta + count) % count;
    this.updateButtonSelection();
  }

  updateGamepadMenu() {
    const pad = this._getPrimaryPad();
    if (!pad) {
      this._menuActionHeld = false;
      return;
    }

    const now = this.time.now;
    const deadzone = 0.35;

    const leftY = this._getPadAxis(pad, 1);
    const rightY = this._getPadAxis(pad, 3);

    const dpadUp = this._isPadButtonDown(pad, 12);
    const dpadDown = this._isPadButtonDown(pad, 13);
    const dpadLeft = this._isPadButtonDown(pad, 14);
    const dpadRight = this._isPadButtonDown(pad, 15);

    const navUp = leftY < -deadzone || rightY < -deadzone || dpadUp || dpadLeft;
    const navDown = leftY > deadzone || rightY > deadzone || dpadDown || dpadRight;

    if (now - this._lastMenuNavAt >= this._menuNavRepeatMs) {
      if (navUp && !navDown) {
        this._moveSelection(-1);
        this._lastMenuNavAt = now;
      } else if (navDown && !navUp) {
        this._moveSelection(1);
        this._lastMenuNavAt = now;
      }
    }

    // A/B/X/Y ejecutan la opción seleccionada
    const actionPressed =
      this._isPadButtonDown(pad, 0) || // A
      this._isPadButtonDown(pad, 1) || // B
      this._isPadButtonDown(pad, 2) || // X
      this._isPadButtonDown(pad, 3) || // Y
      this._isPadButtonDown(pad, 9);   // START (botón Start)

    if (actionPressed && !this._menuActionHeld) {
      const b = this._buttonObjs[this._selectedIndex];
      b?.onClick?.();
    }

    this._menuActionHeld = actionPressed;
  }

  // -----------------------------
  // Selección visual (mejorada)
  // - Ajusta alpha/scale
  // - Ajusta el borde del texto para resaltar selección
  // -----------------------------
  updateButtonSelection() {
    this._buttonObjs.forEach((b, i) => {
      const selected = i === this._selectedIndex;

      b.bg.setAlpha(selected ? 0.55 : 0.35);
      b.bg.setScale(selected ? 1.03 : 1);

      b.label.setAlpha(selected ? 1 : 0.9);
      b.label.setScale(selected ? 1.03 : 1);

      // Más borde cuando está seleccionado
      b.label.setStroke("#000000", selected ? 7 : 5);

      // “Glow” sutil con sombra cuando está seleccionado
      if (selected) {
        b.label.setShadow(3, 3, "#000000", 4, true, true);
      } else {
        b.label.setShadow(2, 2, "#000000", 2, true, true);
      }
    });
  }

  // EMPIEZA EL JUEGO//
  startGameTransition() {
    // evita dobles clicks
    this.input.enabled = false;

    // Nueva partida: limpia el respawn guardado para volver al spawn inicial del mapa
    this.registry.set('duckCheckpointSpawn', null);
    this.registry.set('duckRespawnWeapon', null);

    const w = this.scale.width;
    const h = this.scale.height;

    const cx = w / 2;
    const cy = h / 2;

    // radio suficiente para cubrir toda la pantalla (diagonal / 2)
    const maxR = Math.hypot(w, h) / 2 + 10;

    const g = this.add.graphics().setDepth(9999);
    g.fillStyle(0x000000, 1);

    const state = { r: 0 };

    const draw = () => {
      g.clear();
      g.fillStyle(0x000000, 1);
      g.fillCircle(cx, cy, state.r);
    };

    draw();

    this.tweens.add({
      targets: state,
      r: maxR,
      duration: 550,
      ease: "Sine.easeInOut",
      onUpdate: draw,
      onComplete: () => {
        // Cambia a tu escena del juego y pásale spawn si quieres
        this.scene.start("MainScene", { spawnX: 200, spawnY: 200 });
      },
    });
  }
}