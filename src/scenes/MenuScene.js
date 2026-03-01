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
  }

  create() {
    this.buildBackground();
    this.buildUI();

    // Resize (FIT): re-layout sin romper el loop
    this.scale.on("resize", () => {
      this.layoutBackground();
      this.layoutUI();
    });

    this.setupKeyboard();
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

    // Título (más fino + resolution)
    this.titleText = this.add
      .text(0, -178, "THE DUCKLER", {
        fontFamily: "GothicByte",
        fontSize: "56px",
        fontStyle: "normal",
        color: "#ffffff",
        resolution: 2,
      })
      .setOrigin(0.5);

    // Botones (4)
    const items = [
      { label: "JUGAR", fn: () => console.log("JUGAR") /* this.scene.start("MainScene") */ },
      { label: "CONFIGURACIÓN", fn: () => console.log("CONFIG") },
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

  _makeButton(text, onClick, index) {
    const bg = this.add
      .rectangle(0, 0, 380, 56, 0x000000, 0.35)
      .setStrokeStyle(3, 0xffffff, 0.25)
      .setOrigin(0.5);

    // Texto del botón (más fino + resolution)
    const label = this.add
      .text(0, 0, text, {
        fontFamily: "GothicByte",
        fontSize: "28px",
        fontStyle: "normal",
        color: "#ffffff",
        resolution: 2,
      })
      .setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true });

    const over = () => {
      this._selectedIndex = index;
      this.updateButtonSelection();
    };

    bg.on("pointerover", over);
    label.setInteractive({ useHandCursor: true });
    label.on("pointerover", over);

    const press = () => {
      bg.setScale(0.98);
    };

    const release = () => {
      bg.setScale(1);
      onClick?.();
    };

    bg.on("pointerdown", press);
    bg.on("pointerup", release);
    label.on("pointerdown", press);
    label.on("pointerup", release);

    bg.on("pointerout", () => this.updateButtonSelection());
    label.on("pointerout", () => this.updateButtonSelection());

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

  updateButtonSelection() {
    this._buttonObjs.forEach((b, i) => {
      const selected = i === this._selectedIndex;

      b.bg.setAlpha(selected ? 0.55 : 0.35);
      b.bg.setScale(selected ? 1.03 : 1);
      b.label.setAlpha(selected ? 1 : 0.9);
    });
  }
}