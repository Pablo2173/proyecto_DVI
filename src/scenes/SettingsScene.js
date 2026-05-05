import Phaser from "phaser";

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create(data) {
    this.returnScene = data?.returnScene || "MenuScene";
    this.pauseUnderlyingScene = data?.pauseUnderlyingScene ?? false;

    const saved = localStorage.getItem("settings");

    if (saved) {
      const s = JSON.parse(saved);

      this.mute = s.mute ?? false;

      this.menuMusicEnabled = s.menuMusicEnabled ?? true;
      this.menuVolume = s.menuVolume ?? 1;

      this.gameMusicEnabled = s.gameMusicEnabled ?? true;
      this.gameVolume = s.gameVolume ?? 1;

      this.fontSize = s.fontSize ?? 28;
    } else {
      this.mute = false;

      this.menuMusicEnabled = true;
      this.menuVolume = 1;

      this.gameMusicEnabled = true;
      this.gameVolume = 1;

      this.fontSize = 28;
    }

    this.sound.mute = this.mute;

    const W = this.scale.width;
    const H = this.scale.height;

    this.buildBackground();

    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.35).setDepth(5);

    this.add.text(W / 2, 70, "CONFIGURACIÓN", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "54px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 7
    })
      .setOrigin(0.5)
      .setDepth(10);

    const labelX = W / 2 - 250;
    const toggleX = W / 2 + 40;
    const volumeStartX = W / 2 + 110;

    const row1Y = 155;
    const row2Y = 235;
    const row3Y = 315;
    const row4Y = 415;
    const row5Y = 515;

    const labelStyle = {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5
    };

    const volumeLevels = [0, 0.25, 0.5, 0.75, 1];

    this.menuMusic = this.sound.get("menu_music") ?? null;

    if (!this.menuMusic && this.cache.audio.exists("menu_music") && this.menuMusicEnabled) {
      this.menuMusic = this.sound.add("menu_music", {
        loop: true,
        volume: this.menuVolume
      });
      this.menuMusic.play();
    }

    this.applyAudioSettings();

    this.add.text(labelX, row1Y, "SONIDO GENERAL", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.soundBox = this.createCheckbox(toggleX + 65, row1Y, !this.mute, (checked) => {
      this.mute = !checked;
      this.applyAudioSettings();
      this.saveSettings();
    });

    this.add.text(labelX, row2Y, "MÚSICA MENÚ", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.menuVolumeBoxes = [];
    volumeLevels.forEach((level, i) => {
      const x = volumeStartX + i * 58;
      const selected = Math.abs(this.menuVolume - level) < 0.01;

      const box = this.createSelectBox(x, row2Y, selected, `${i}`, () => {
        this.menuVolume = level;
        this.updateMenuVolumeBoxes();
        this.applyAudioSettings();
        this.saveSettings();
      });

      this.menuVolumeBoxes.push({ box, level });
    });

    this.add.text(labelX, row3Y, "MÚSICA JUEGO", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.gameVolumeBoxes = [];
    volumeLevels.forEach((level, i) => {
      const x = volumeStartX + i * 58;
      const selected = Math.abs(this.gameVolume - level) < 0.01;

      const box = this.createSelectBox(x, row3Y, selected, `${i}`, () => {
        this.gameVolume = level;
        this.updateGameVolumeBoxes();
        this.saveSettings();
      });

      this.gameVolumeBoxes.push({ box, level });
    });

    this.add.text(labelX, row4Y, "TAMAÑO LETRA", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.fontBoxes = [];

    const fontOptions = [
      { label: "S", value: 20 },
      { label: "M", value: 28 },
      { label: "L", value: 36 }
    ];

    const fontStartX = W / 2 + 110;

    fontOptions.forEach((opt, i) => {
      const x = fontStartX + i * 78;
      const selected = this.fontSize === opt.value;

      const box = this.createSelectBox(x, row4Y, selected, opt.label, () => {
        this.fontSize = opt.value;
        this.updateFontBoxes();
        this.saveSettings();
        // Emitir evento global para que otras escenas puedan reaccionar al cambio de fuente
        this.game.events.emit('fontSizeChanged', this.fontSize);
      });

      this.fontBoxes.push({ box, value: opt.value });
    });

    this.add.text(labelX, row5Y, "PANTALLA COMPLETA", labelStyle)
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.fullscreenBox = this.createCheckbox(
      toggleX + 100,
      row5Y,
      this.scale.isFullscreen,
      (checked) => {
        if (checked && !this.scale.isFullscreen) {
          this.scale.startFullscreen();
        } else if (!checked && this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        }
      }
    );

    this.backButton = this.add.rectangle(W / 2, 610, 340, 72, 0x000000, 0.5)
      .setStrokeStyle(4, 0xffffff, 0.8)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    this.backLabel = this.add.text(W / 2, 610, "VOLVER", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "36px",
      color: "#ff6666",
      stroke: "#000000",
      strokeThickness: 6
    })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    const goBack = () => {
      if (this.pauseUnderlyingScene && this.returnScene) {
        this.scene.stop();
        this.scene.resume(this.returnScene);

        const underlyingScene = this.scene.get(this.returnScene);
        if (underlyingScene?.closePauseMenu) {
          underlyingScene.closePauseMenu();
        }
      } else {
        this.scene.start(this.returnScene);
      }
    };

    this.backButton.on("pointerup", goBack);
    this.backLabel.on("pointerup", goBack);

    this._onSettingsGamepadDown = (pad, button, index) => {
      if (index === 9) {
        goBack();
      }
    };

    if (this.input.gamepad) {
      this.input.gamepad.on("down", this._onSettingsGamepadDown);
    }

    this.events.once("shutdown", () => {
      if (this.input?.gamepad && this._onSettingsGamepadDown) {
        this.input.gamepad.off("down", this._onSettingsGamepadDown);
      }
    });

    this.updateMenuVolumeBoxes();
    this.updateGameVolumeBoxes();
    this.updateFontBoxes();

    this.scale.on("resize", () => {
      this.layoutBackground();
    });

    this.input.keyboard.on("keydown-ESC", goBack);
  }

  applyAudioSettings() {
    this.sound.mute = this.mute;

      // si volumen 0 → no hay música
    if (this.menuVolume <= 0) {
      if (this.menuMusic) {
        this.menuMusic.stop();
        this.menuMusic = null;
      }
      return;
    }

    if (!this.menuMusic && this.cache.audio.exists("menu_music")) {
      this.menuMusic = this.sound.add("menu_music", {
        loop: true,
        volume: this.menuVolume
      });
      this.menuMusic.play();
    }

    if (this.menuMusic) {
      this.menuMusic.setVolume(this.menuVolume);
    }
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

    box.on("pointerup", toggle);
    mark.on("pointerup", toggle);

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

    bg.on("pointerup", onSelect);
    text.on("pointerup", onSelect);

    setSelected(selected);

    return {
      bg,
      text,
      setSelected
    };
  }

  updateMenuVolumeBoxes() {
    this.menuVolumeBoxes.forEach(({ box, level }) => {
      const selected = Math.abs(this.menuVolume - level) < 0.01;
      box.setSelected(selected);
    });
  }

  updateGameVolumeBoxes() {
    this.gameVolumeBoxes.forEach(({ box, level }) => {
      const selected = Math.abs(this.gameVolume - level) < 0.01;
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
      menuMusicEnabled: this.menuMusicEnabled,
      menuVolume: this.menuVolume,
      gameMusicEnabled: this.gameMusicEnabled,
      gameVolume: this.gameVolume,
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