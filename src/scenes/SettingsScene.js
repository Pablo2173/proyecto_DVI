import Phaser from "phaser";

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create() {
    const saved = localStorage.getItem("settings");

    if (saved) {
      const s = JSON.parse(saved);
      this.mute = s.mute ?? false;
      this.volume = s.volume ?? 1;
      this.fontSize = s.fontSize ?? 28;
    } else {
      this.mute = false;
      this.volume = 1;
      this.fontSize = 28;
    }

    this.sound.mute = this.mute;
    this.sound.volume = this.volume;

    const W = this.scale.width;
    const H = this.scale.height;

    this.buildBackground();

    // oscurecer un poco para leer mejor
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.35).setDepth(5);

    // título
    this.add.text(W / 2, 90, "CONFIGURACIÓN", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "54px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 7
    })
      .setOrigin(0.5)
      .setDepth(10);

    // layout centrado
    const labelX = W / 2 - 230;
    const controlX = W / 2 + 120;

    const row1Y = 190;
    const row2Y = 295;
    const row3Y = 400;
    const row4Y = 505;

    const labelStyle = {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "30px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5
    };

    // SONIDO
    this.add.text(labelX, row1Y, "SONIDO", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.soundBox = this.createCheckbox(controlX, row1Y, !this.mute, (checked) => {
      this.mute = !checked;
      this.sound.mute = this.mute;
      this.saveSettings();
    });

    // VOLUMEN
    this.add.text(labelX, row2Y, "VOLUMEN", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.volumeBoxes = [];
    const volumeLevels = [0, 0.25, 0.5, 0.75, 1];
    const volumeStartX = controlX - 120;

    volumeLevels.forEach((level, i) => {
      const x = volumeStartX + i * 65;
      const selected = Math.abs(this.volume - level) < 0.01;

      const box = this.createSelectBox(x, row2Y, selected, `${i}`, () => {
        this.volume = level;
        this.sound.volume = this.volume;
        this.updateVolumeBoxes();
        this.saveSettings();
      });

      this.volumeBoxes.push({ box, level });
    });

    // TAMAÑO LETRA
    this.add.text(labelX, row3Y, "TAMAÑO LETRA", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.fontBoxes = [];

    const fontOptions = [
      { label: "S", value: 20 },
      { label: "M", value: 28 },
      { label: "L", value: 36 }
    ];

    const fontStartX = controlX - 40;

    fontOptions.forEach((opt, i) => {
      const x = fontStartX + i * 78;
      const selected = this.fontSize === opt.value;

      const box = this.createSelectBox(x, row3Y, selected, opt.label, () => {
        this.fontSize = opt.value;
        this.updateFontBoxes();
        this.saveSettings();
      });

      this.fontBoxes.push({ box, value: opt.value });
    });

    // PANTALLA COMPLETA
    this.add.text(labelX, row4Y, "PANTALLA COMPLETA", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.fullscreenBox = this.createCheckbox(
      controlX + 40,
      row4Y,
      this.scale.isFullscreen,
      (checked) => {
        if (checked && !this.scale.isFullscreen) {
          this.scale.startFullscreen();
        } else if (!checked && this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        }
      }
    );

    // VOLVER
    this.backButton = this.add.rectangle(W / 2, 585, 340, 72, 0x000000, 0.5)
      .setStrokeStyle(4, 0xffffff, 0.8)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    this.backLabel = this.add.text(W / 2, 585, "VOLVER", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "36px",
      color: "#ff6666",
      stroke: "#000000",
      strokeThickness: 6
    })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    const goBack = () => this.scene.start("MenuScene");

    this.backButton.on("pointerdown", goBack);
    this.backLabel.on("pointerdown", goBack);

    this.updateVolumeBoxes();
    this.updateFontBoxes();

    this.scale.on("resize", () => {
      this.layoutBackground();
    });
  }

  createCheckbox(x, y, checked, onToggle) {
    const box = this.add.rectangle(x, y, 42, 42, 0x000000, 0.7)
      .setStrokeStyle(3, 0xffffff, 0.95)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    const mark = this.add.text(x, y, checked ? "X" : "", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "30px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    const setChecked = (value) => {
      mark.setText(value ? "X" : "");
    };

    const toggle = () => {
      const newValue = mark.text !== "X";
      setChecked(newValue);
      onToggle?.(newValue);
    };

    box.on("pointerdown", toggle);
    mark.on("pointerdown", toggle);

    return {
      box,
      mark,
      setChecked
    };
  }

  createSelectBox(x, y, selected, label, onSelect) {
    const bg = this.add.rectangle(x, y, 50, 50, 0x000000, 0.7)
      .setStrokeStyle(3, selected ? 0xffff99 : 0xffffff, selected ? 1 : 0.85)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "26px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    const setSelected = (value) => {
      bg.setStrokeStyle(3, value ? 0xffff99 : 0xffffff, value ? 1 : 0.85);
      bg.setFillStyle(0x000000, value ? 0.9 : 0.7);
    };

    bg.on("pointerdown", onSelect);
    text.on("pointerdown", onSelect);

    setSelected(selected);

    return {
      bg,
      text,
      setSelected
    };
  }

  updateVolumeBoxes() {
    this.volumeBoxes.forEach(({ box, level }) => {
      const selected = Math.abs(this.volume - level) < 0.01;
      box.setSelected(selected);
    });
  }

  updateFontBoxes() {
    this.fontBoxes.forEach(({ box, value }) => {
      box.setSelected(this.fontSize === value);
    });
  }

  saveSettings() {
    localStorage.setItem("settings", JSON.stringify({
      mute: this.mute,
      volume: this.volume,
      fontSize: this.fontSize
    }));
  }

  buildBackground() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.cloudSpeedPxPerSec = 14;
    this.backfieldSpeedPxPerSec = 2;

    this._cloudScroll = 0;
    this._backScroll = 0;

    this.sky = this.add.image(W / 2, H / 2, "config_sky").setDepth(0);

    this.cloudA = this.add.image(0, H / 2, "config_clouds").setOrigin(0, 0.5).setDepth(1);
    this.cloudB = this.add.image(0, H / 2, "config_clouds").setOrigin(0, 0.5).setDepth(1);

    this.backA = this.add.image(0, H / 2, "config_backfield").setOrigin(0, 0.5).setDepth(2);
    this.backB = this.add.image(0, H / 2, "config_backfield").setOrigin(0, 0.5).setDepth(2);

    this.ground = this.add.image(W / 2, H / 2, "config_ground").setDepth(3);
    this.trees = this.add.image(W / 2, H, "config_trees").setDepth(4);

    this.trees.setOrigin(0.5, 1);

    this.layoutBackground();
  }

  layoutBackground() {
    const W = this.scale.width;
    const H = this.scale.height;

    this._scaleToCover(this.sky, W, H).setPosition(W / 2, H / 2);
    this._scaleToCover(this.ground, W, H).setPosition(W / 2, H / 2);

    this._scaleToCover(this.trees, W, H);
    this.trees.y = H;
    this.trees.x = W / 2;

    this._scaleToCover(this.backA, W, H);
    this.backB.setScale(this.backA.scaleX, this.backA.scaleY);

    const bw = this.backA.displayWidth;
    this.backA.y = H / 2;
    this.backB.y = H / 2;

    const backOffset = ((this._backScroll % bw) + bw) % bw;
    this.backA.x = -backOffset;
    this.backB.x = this.backA.x + bw;

    this._scaleToCover(this.cloudA, W, H);
    this.cloudB.setScale(this.cloudA.scaleX, this.cloudA.scaleY);

    const cw = this.cloudA.displayWidth;
    this.cloudA.y = H / 2;
    this.cloudB.y = H / 2;

    const cloudOffset = ((this._cloudScroll % cw) + cw) % cw;
    this.cloudA.x = -cloudOffset;
    this.cloudB.x = this.cloudA.x + cw;
  }

  _scaleToCover(img, W, H) {
    const s = Math.max(W / img.width, H / img.height);
    img.setScale(s);
    return img;
  }

  update(_, dt) {
    if (!this.cloudA || !this.backA) return;

    const dts = dt / 1000;

    this._cloudScroll += this.cloudSpeedPxPerSec * dts;
    this._backScroll += this.backfieldSpeedPxPerSec * dts;

    const cw = this.cloudA.displayWidth;
    const bw = this.backA.displayWidth;

    const cloudOffset = ((this._cloudScroll % cw) + cw) % cw;
    this.cloudA.x = -cloudOffset;
    this.cloudB.x = this.cloudA.x + cw;

    const backOffset = ((this._backScroll % bw) + bw) % bw;
    this.backA.x = -backOffset;
    this.backB.x = this.backA.x + bw;
  }
}