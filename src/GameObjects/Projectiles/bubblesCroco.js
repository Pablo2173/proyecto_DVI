import Projectile from './projectile.js';
import balaTexture from '../../../assets/sprites/Projectiles/bubbles_croco.png';

export default class BubblesCroco extends Projectile {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, 'bubbles_croco', config);
        this.setScale(5);
        // Ajustar el tamaño de colisión al tamaño visual del sprite escalado
        if (this.body) {
            this.body.setSize(this.width / 6, this.height / 6);
        }
    }

    static preload(scene) {
        scene.load.image('bubbles_croco', balaTexture);
    }
}