import Phaser from 'phaser';
import { DUCK_STATE } from './duck.js';

export default class Puddle extends Phaser.GameObjects.Sprite {
    // ─────────────────────────────────────────
    // PUDDLE
    // Charco circular invisible que detecta si el pato está dentro
    // y cambia su estado a SWIMMING.
    // ─────────────────────────────────────────

    constructor(scene, x, y, radius = 50) {
        super(scene, x, y);

        this.radius = radius;
        this._duckInside = false;

        scene.add.existing(this);

        this.setOrigin(0.5);
        this.setVisible(false);
        this.setActive(true);

        // Escucha el update de la escena con el contexto correcto
        scene.events.on('update', this._checkDuck, this);

        // Limpieza segura al reiniciar / destruir escena
        scene.events.once('shutdown', this._cleanup, this);
        scene.events.once('destroy', this._cleanup, this);
    }

    // Devuelve true si el jugador está dentro del radio del charco
    isPlayerInPuddle(player) {
        if (!player || !player.active) return false;

        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y
        );

        return dist <= this.radius;
    }

    _checkDuck() {
        // Blindajes para evitar errores al reiniciar escena
        if (!this.active) return;
        if (!this.scene) return;
        if (this.scene.isPlayerDead) return;

        const duck = this.scene.duck;
        if (!duck || !duck.active) return;

        const inside = this.isPlayerInPuddle(duck);

        if (inside && !this._duckInside) {
            this._duckInside = true;

            if (duck.state !== DUCK_STATE.SWIMMING) {
                duck.setState(DUCK_STATE.SWIMMING);
            }
        } else if (!inside && this._duckInside) {
            this._duckInside = false;

            if (duck.state === DUCK_STATE.SWIMMING) {
                duck.setState(DUCK_STATE.IDLE);
            }
        }
    }

    _cleanup() {
        if (this.scene && this.scene.events) {
            this.scene.events.off('update', this._checkDuck, this);
        }
    }

    destroy(fromScene) {
        this._cleanup();
        super.destroy(fromScene);
    }
}