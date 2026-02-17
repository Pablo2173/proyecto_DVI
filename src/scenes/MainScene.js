import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';
import player_sprite from '../../assets/sprites/player.png';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('pato', player_sprite);
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // crear pato con sprite
        this.duck = new Duck(this, 200, 200, 'pato');

        // instrucciones en pantalla
        this.add.text(10, 10, 'Control: Flechas | Dash: Espacio | Pick: P', {
            fontSize: '16px',
            fill: '#FFFFFF'
        });
    }

    update(time, delta) {
        // Duck.preUpdate se llama automáticamente
    }
}