import Phaser from 'phaser';

export default class DropItem extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);

        // Efecto para que floten sobre el suelo
        this._baseY = y;
        scene.tweens.add({
            targets:    this,
            y:          y - 6,
            duration:   900,
            ease:       'Sine.easeInOut',
            yoyo:       true,
            repeat:     -1
        });
    }

    /**
     * Comprueba si el jugador está lo suficientemente cerca para interactuar.
     * @param {Phaser.GameObjects.Sprite} player
     * @param {number} threshold - distancia en píxeles (default 40)
     * @returns {boolean}
     */
    isNear(player, threshold = 40) {
        return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < threshold;
    }

    /**
     * Método abstracto. Las subclases deben sobrescribirlo.
     * @param {Duck} player
     */
    interact(player) {
        throw new Error(`${this.constructor.name} debe implementar interact(player).`);
    }
}