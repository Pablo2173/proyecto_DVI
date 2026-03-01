import Phaser from "phaser";
import Boot from "./scenes/Boot.js";
import MenuScene from "./scenes/MenuScene.js";

async function loadFont() {
  // Ruta robusta en Electron-Vite (no depende de /public)
  const fontUrl = new URL("../css/typo/GothicByte.ttf", import.meta.url);
  const font = new FontFace("GothicByte", `url(${fontUrl})`);
  await font.load();
  document.fonts.add(font);
}

(async () => {
  await loadFont();

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "juego",
    backgroundColor: "#000000",

    // Pixel-art nítido
    pixelArt: true,
    roundPixels: true,

    // Menú primero, luego ya irás a MainScene desde el botón JUGAR
    scene: [Boot, MenuScene],

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  window.game = new Phaser.Game(config);
})();