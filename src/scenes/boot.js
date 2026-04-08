import Phaser from "phaser";

// ───────── MENU ─────────
import skyUrl from "../../assets/menu/sky.png?url";
import cloudsUrl from "../../assets/menu/clouds.png?url";
import backfieldUrl from "../../assets/menu/backfield.png?url";
import treesUrl from "../../assets/menu/trees.png?url";
import groundUrl from "../../assets/menu/ground.png?url";

// ───────── CONFIG ─────────
import configSkyUrl from "../../assets/config/1_sky.png?url";
import configCloudsUrl from "../../assets/config/2_clouds.png?url";
import configBackfieldUrl from "../../assets/config/3_rocksandbush.png?url";
import configGroundUrl from "../../assets/config/4_path.png?url";
import configTreesUrl from "../../assets/config/5_trees.png?url";

// ───────── AUDIO ─────────
import menuMusicUrl from "../../assets/sounds/musica_menu.mp3?url";

export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.on("loaderror", (file) => {
      console.error("❌ Error cargando asset:", file?.key, file?.src);
    });

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    const box = this.add.rectangle(W / 2, H / 2, 320, 24, 0x000000, 0.35)
      .setStrokeStyle(2, 0xffffff, 0.25);

    const bar = this.add.rectangle(W / 2 - 160, H / 2, 0, 16, 0xffffff, 0.6)
      .setOrigin(0, 0.5);

    this.load.on("progress", (p) => (bar.width = 320 * p));
    this.load.on("complete", () => {
      box.destroy();
      bar.destroy();
    });

    this.load.audio("menu_music", menuMusicUrl);

    this.load.image("sky", skyUrl);
    this.load.image("clouds", cloudsUrl);
    this.load.image("backfield", backfieldUrl);
    this.load.image("trees", treesUrl);
    this.load.image("ground", groundUrl);

    this.load.image("config_sky", configSkyUrl);
    this.load.image("config_clouds", configCloudsUrl);
    this.load.image("config_backfield", configBackfieldUrl);
    this.load.image("config_ground", configGroundUrl);
    this.load.image("config_trees", configTreesUrl);
  }

  create() {
    console.log("menu_music exists?", this.cache.audio.exists("menu_music"));
    this.scene.start("MenuScene");
  }
}