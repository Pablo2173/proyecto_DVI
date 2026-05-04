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
import arcoSfxUrl from "../../assets/sounds/disparo_arco.mp3?url";
import damageRecibidoUrl from "../../assets/sounds/daño_recibido.mp3?url";
import cuchilloUrl from "../../assets/sounds/cuchillo.mp3?url";
import ramitaUrl from "../../assets/sounds/ramita.mp3?url";
import mazoUrl from "../../assets/sounds/mazo.mp3?url";
import escobaUrl from "../../assets/sounds/escoba.mp3?url";
import armaUrl from "../../assets/sounds/m4.mp3?url";
import deathUrl from "../../assets/sounds/death.mp3?url";




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

    // 🖤 Fondo negro
    this.add.rectangle(0, 0, W, H, 0x000000).setOrigin(0);

    // 📝 Texto LOADING
    const loadingText = this.add.text(W / 2, H / 2, "LOADING", {
      fontFamily: "ReturnOfTheBoss",
      fontSize: "72px",
      color: "#ff0000",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // ✨ Animación de puntos
    let dots = 0;

    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        dots = (dots + 1) % 4; // 0,1,2,3
        loadingText.setText("LOADING" + ".".repeat(dots));
      }
    });

    // ───────── AUDIO ─────────
    this.load.audio("menu_music", menuMusicUrl);
    this.load.audio("disparo_arco", arcoSfxUrl);
    this.load.audio('damage_hit', damageRecibidoUrl);
    this.load.audio('cuchillo_sound', cuchilloUrl);
    this.load.audio('ramita_sound', ramitaUrl);
    this.load.audio('mazo_sound', mazoUrl);
    this.load.audio('escoba_sound', escobaUrl);
    this.load.audio('arma_sound', armaUrl);
    this.load.audio('death_sound', deathUrl);

    // ───────── MENU ─────────
    this.load.image("sky", skyUrl);
    this.load.image("clouds", cloudsUrl);
    this.load.image("backfield", backfieldUrl);
    this.load.image("trees", treesUrl);
    this.load.image("ground", groundUrl);

    // ───────── CONFIG ─────────
    this.load.image("config_sky", configSkyUrl);
    this.load.image("config_clouds", configCloudsUrl);
    this.load.image("config_backfield", configBackfieldUrl);
    this.load.image("config_ground", configGroundUrl);
    this.load.image("config_trees", configTreesUrl);
  }

  create() {
    console.log("menu_music exists?", this.cache.audio.exists("menu_music"));
    this.scene.start("MainScene");
  }
}