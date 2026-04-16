import Phaser from "phaser";
import Boot from "./scenes/boot.js";
import MenuScene from "./scenes/MenuScene.js";
import MainScene from "./scenes/MainScene.js";
import SettingsScene from "./scenes/SettingsScene.js";

async function loadFont() {
  const fontUrl = new URL("../css/typo/return-of-the-boss.ttf", import.meta.url);
  const font = new FontFace("ReturnOfTheBoss", `url(${fontUrl})`);
  await font.load();
  document.fonts.add(font);
}

(async () => {
  await loadFont();

  const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'juego',
    pixelArt: true,
    antialias: false,    // desactiva suavizado para pixelart
    backgroundColor: '#cacaca',
    scene: [Boot, MenuScene, MainScene, SettingsScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // sin gravedad para top-down
        debug: false // oculta hitboxes y colisiones debug
        }
    },
  };

  window.game = new Phaser.Game(config);
})();