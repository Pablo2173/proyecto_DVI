import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'juego',
    pixelArt: false,
    antialias: false,    // desactiva suavizado para pixelart
    backgroundColor: '#cacaca',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

window.game = new Phaser.Game(config);
