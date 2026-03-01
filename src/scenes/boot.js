import Phaser from "phaser";

// Vite convierte estos imports en URLs válidas en dev y build
import skyUrl from "../../assets/menu/sky.png?url";
import cloudsUrl from "../../assets/menu/clouds.png?url";
import backfieldUrl from "../../assets/menu/backfield.png?url";
import treesUrl from "../../assets/menu/trees.png?url";
import groundUrl from "../../assets/menu/ground.png?url";


export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Debug: si algo falla lo verás seguro
    this.load.on("loaderror", (file) => {
      console.error("❌ Error cargando asset:", file?.key, file?.src);
    });

    // Barra simple
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

    // ✅ Carga garantizada
    this.load.image("sky", skyUrl);
    this.load.image("clouds", cloudsUrl);
    this.load.image("backfield", backfieldUrl);
    this.load.image("trees", treesUrl);
    this.load.image("ground", groundUrl);
 
  }

  create() {
    // Verificación extra: si esto da false, algo sigue mal
    console.log("sky exists?", this.textures.exists("sky"));
    console.log("clouds exists?", this.textures.exists("clouds"));
    console.log("backfield exists?", this.textures.exists("backfield"));
    console.log("trees exists?", this.textures.exists("trees"));
    console.log("ground exists?", this.textures.exists("ground"));

    this.scene.start("MenuScene");
  }
}