import Phaser from "phaser";
import Boot from "./scenes/Boot.js";
import MenuScene from "./scenes/MenuScene.js";

async function loadFont() {
  const font = new FontFace("GothicByte", "url(/css/typo/GothicByte.ttf)");
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
    scene: [Boot, MenuScene], // ✅ NO MainScene
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  window.game = new Phaser.Game(config);
})();
