import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'juego',
    pixelArt: true,
    antialias: false,    // desactiva suavizado para pixelart
    backgroundColor: '#cacaca',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // sin gravedad para top-down
            debug: true //para ver los hitboxes, colisiones, etc
        }
    }
};

window.game = new Phaser.Game(config);
