class MenuScene extends Phaser.Scene {
  preload() {
    this.load.image("sky",    "assets/menu/sky.png");
    this.load.image("clouds", "assets/menu/clouds.png");
    this.load.image("back",   "assets/menu/backfield.png");
    this.load.image("trees",  "assets/menu/trees.png");
    this.load.image("ground", "assets/menu/ground.png");
  }

  create() {
    this.cameras.main.setRoundPixels(true);

    const w = this.scale.width;
    const h = this.scale.height;

    // Guarda referencias (clave para resize)
    this.sky = this.add.image(w/2, h/2, "sky").setDisplaySize(w, h);

    this.clouds = this.add.tileSprite(0, 0, w, h, "clouds").setOrigin(0).setAlpha(0.95);
    this.back   = this.add.tileSprite(0, h, w, h, "back").setOrigin(0, 1);
    this.trees  = this.add.tileSprite(0, h, w, h, "trees").setOrigin(0, 1);
    this.ground = this.add.tileSprite(0, h, w, h, "ground").setOrigin(0, 1);

    this.cloudsBaseY = 0;

    // Resize handler
    this.scale.on("resize", (gameSize) => {
      const w = gameSize.width;
      const h = gameSize.height;

      this.sky.setPosition(w/2, h/2).setDisplaySize(w, h);

      this.clouds.setSize(w, h).setPosition(0, 0);
      this.back.setSize(w, h).setPosition(0, h);
      this.trees.setSize(w, h).setPosition(0, h);
      this.ground.setSize(w, h).setPosition(0, h);
    });
  }

  update(time, delta) {
    const dt = delta / 1000;

    this.clouds.tilePositionX += 6   * dt;
    this.back.tilePositionX   += 1.2 * dt;
    this.trees.tilePositionX  += 2.0 * dt;
    this.ground.tilePositionX += 0.5 * dt;

    this.clouds.y = this.cloudsBaseY + Math.sin(time * 0.001) * 2;
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  pixelArt: true,
  scene: [MenuScene],
  scale: {
    mode: Phaser.Scale.RESIZE
  }
};

new Phaser.Game(config);
