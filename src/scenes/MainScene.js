import Player from '../player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // cargar assets cuando los tengas
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // crear jugador (el pato)
        this.player = new Player(this, 200, 200);
    }

    update(time, delta) {
        // Player.preUpdate se llama automáticamente
    }
}