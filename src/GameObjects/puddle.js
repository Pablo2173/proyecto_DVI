import Phaser from 'phaser';
import { DUCK_STATE } from './duck.js';

export default class Puddle extends Phaser.GameObjects.Sprite {

    // ─────────────────────────────────────────
    //  PUDDLE
    //  Un charco de agua circularinvisible que hará que el jugador cambie de sprite
    // ─────────────────────────────────────────

    constructor(scene, x, y, radius = 50) {
        super(scene, x, y, radius * 2, radius * 2);
        scene.add.existing(this);

        this.setOrigin(0.5);
        this.setVisible(true); // El charco es invisible, solo sirve para detectar si el jugador está dentro
        this.setActive(true);

        this.radius = radius;
        this._duckInside = false;

        scene.events.on('update', this._checkDuck, this);
    }

    // Método para detectar si el jugador está dentro del charco
    isPlayerInPuddle(player) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        return dist <= this.radius;
        º
    }

    _checkDuck(time, delta) {
        const duck = this.scene.duck;
        if (!duck || !duck.active) return;

        const inside = this.isPlayerInPuddle(duck);

        if (inside && !this._duckInside) {
            this._duckInside = true;
            duck.setState(DUCK_STATE.SWIMMING);
        } else if (!inside && this._duckInside) {
            this._duckInside = false;
            if (duck.state === DUCK_STATE.SWIMMING) {
                duck.setState(DUCK_STATE.IDLE);
            }
        }
    }
}