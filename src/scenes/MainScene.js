import Phaser from "phaser";
import Duck from "../GameObjects/duck.js";
import Weapon from "../GameObjects/weapon.js";
import Enemy from "../GameObjects/enemy.js";
import player_sprite from "../../assets/sprites/player.png";
import enemy_sprite from "../../assets/sprites/player.png";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  init(data) {
    // si MenuScene te pasa spawnX/spawnY, los usas
    this.spawnX = data?.spawnX ?? 200;
    this.spawnY = data?.spawnY ?? 200;
  }

  preload() {
    this.load.image("pato", player_sprite);
    this.load.image("enemy", enemy_sprite);
    Weapon.preload(this);
  }

  create() {
    // fondo simple
    const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87ceeb);
    bg.setOrigin(0);

    // ✅ crear el pato con la textura que SÍ existe
    this.duck = new Duck(this, this.spawnX, this.spawnY, "pato");

    // click para atacar
    this.input.on("pointerdown", () => {
      if (this.duck && this.duck.weapon) this.duck.weapon.attack();
    });

    // enemigo de prueba
    this.enemySprite = this.add.sprite(440, 200, "enemy");
    this.enemySprite.setFlipX(true);
    this.enemy = new Enemy("Guard", this.enemySprite.x, this.enemySprite.y, 200);

    // debug visión
    this.visionGraphics = this.add.graphics();

    // instrucciones
    this.add.text(10, 10, "Control: Flechas | Dash: Espacio | Pick: P | Atacar: Click izquierdo", {
      fontSize: "16px",
      fill: "#FFFFFF",
    });

    // (opcional) iris de entrada si lo estás usando
    // this.irisIn();
  }

  update(time, delta) {
    if (this.enemySprite && this.enemy) {
      this.enemy.setPosition(this.enemySprite.x, this.enemySprite.y);
      const alerted = this.enemy.detectAndAlert(this.duck);

      if (alerted) this.enemySprite.setTint(0xff0000);
      else this.enemySprite.clearTint();

      this.visionGraphics.clear();
      this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
    }
  }
}