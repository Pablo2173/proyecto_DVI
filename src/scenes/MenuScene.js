import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
    this.bg = {};
    this.ui = {};
  }

  preload() {
    // ✅ Rutas robustas para Vite (assets/ está en la raíz del proyecto)
    const sky = new URL("../../assets/menu/sky.png", import.meta.url).href;
    const clouds = new URL("../../assets/menu/clouds.png", import.meta.url).href;
    const back = new URL("../../assets/menu/backfield.png", import.meta.url).href;
    const trees = new URL("../../assets/menu/trees.png", import.meta.url).href;
    const ground = new URL("../../assets/menu/ground.png", import.meta.url).href;

    this.load.image("sky", sky);
    this.load.image("clouds", clouds);
    this.load.image("back", back);
    this.load.image("trees", trees);
    this.load.image("ground", ground);
  }

  create() {
    this.cameras.main.setRoundPixels(true);

    const { width: w, height: h } = this.scale;

    // --- Fondo animado ---
    this.bg.sky = this.add.image(w / 2, h / 2, "sky").setDisplaySize(w, h);

    this.bg.clouds = this.add
      .tileSprite(0, 0, w, h, "clouds")
      .setOrigin(0)
      .setAlpha(0.95);

    this.bg.back = this.add.tileSprite(0, h, w, h, "back").setOrigin(0, 1);
    this.bg.trees = this.add.tileSprite(0, h, w, h, "trees").setOrigin(0, 1);
    this.bg.ground = this.add.tileSprite(0, h, w, h, "ground").setOrigin(0, 1);

    // --- UI (solo JS/Phaser) ---
    this.ui.title = this.add
      .text(0, 0, "THE\nDUCKLER", {
        fontFamily: "GothicByte",
        fontSize: "110px",
        color: "#b35a1a",
        stroke: "#5a2e0c",
        strokeThickness: 14,
        align: "center",
      })
      .setOrigin(0.5);

    this.ui.subtitle = this.add
      .text(0, 0, "Presiona un botón para continuar", {
        fontFamily: "GothicByte",
        fontSize: "20px",
        color: "#2b1407",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.ui.btnStart = this.makeBoxButton("INICIO", () => this.scene.start("MainScene"));
    this.ui.btnOptions = this.makeBoxButton("OPCIONES", () => console.log("Opciones"));
    this.ui.btnExit = this.makeBoxButton("SALIR", () => console.log("Salir"));

    // Teclas rápidas
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Layout + resize
    this.layout();
    this.onResize = () => this.layout();
    this.scale.on("resize", this.onResize);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this.onResize);
    });
  }

  makeBoxButton(label, onClick) {
    const container = this.add.container(0, 0);

    const bw = 520;
    const bh = 95;

    const box = this.add.graphics();

    const text = this.add
      .text(0, 0, label, {
        fontFamily: "GothicByte",
        fontSize: "44px",
        color: "#2b1407",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    const hit = this.add
      .rectangle(0, 0, bw, bh, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    const draw = (state) => {
      box.clear();

      const fill =
        state === "down" ? 0xc8955f : state === "hover" ? 0xe2b182 : 0xd9ad7c;

      // sombra
      box.fillStyle(0x000000, 0.20);
      box.fillRoundedRect(-bw / 2 + 8, -bh / 2 + 10, bw, bh, 16);

      // cuerpo
      box.fillStyle(fill, 0.96);
      box.lineStyle(6, 0x000000, 0.25);
      box.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 16);
      box.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 16);
    };

    draw("idle");

    hit.on("pointerover", () => draw("hover"));
    hit.on("pointerout", () => draw("idle"));
    hit.on("pointerdown", () => draw("down"));
    hit.on("pointerup", () => {
      draw("hover");
      onClick?.();
    });

    container.on("btn:click", () => onClick?.());
    container.add([box, text, hit]);

    return container;
  }

  layout() {
    const { width: w, height: h } = this.scale;

    // fondo
    this.bg.sky.setPosition(w / 2, h / 2).setDisplaySize(w, h);
    this.bg.clouds.setSize(w, h).setPosition(0, 0);
    this.bg.back.setSize(w, h).setPosition(0, h);
    this.bg.trees.setSize(w, h).setPosition(0, h);
    this.bg.ground.setSize(w, h).setPosition(0, h);

    // UI dentro de pantalla (✅ no se sale)
    const cx = w / 2;

    const titleSize = Math.max(64, Math.min(120, Math.floor(w / 7)));
    this.ui.title.setFontSize(titleSize);

    const top = Math.round(h * 0.24);
    this.ui.title.setPosition(cx, top);
    this.ui.subtitle.setPosition(cx, top + Math.round(h * 0.16));

    const startY = Math.round(h * 0.62);
    const gap = Math.round(h * 0.13);

    this.ui.btnStart.setPosition(cx, startY);
    this.ui.btnOptions.setPosition(cx, startY + gap);
    this.ui.btnExit.setPosition(cx, startY + gap * 2);
  }

  update(time, delta) {
    const dt = delta / 1000;

    // animación parallax
    this.bg.clouds.tilePositionX += 6 * dt;
    this.bg.back.tilePositionX += 1.2 * dt;
    this.bg.trees.tilePositionX += 2.0 * dt;
    this.bg.ground.tilePositionX += 0.5 * dt;

    this.bg.clouds.y = Math.sin(time * 0.001) * 2;

    // teclado (polling)
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.ui.btnStart.emit("btn:click");
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.ui.btnExit.emit("btn:click");
    }
  }
}
