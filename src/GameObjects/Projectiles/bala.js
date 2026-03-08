import Projectile from './projectile.js';
import balaTexture from '../../../assets/sprites/Projectiles/bala_mcuaktro.png';

export default class Bala extends Projectile {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, 'bala_mcuaktro', config);
        this.setScale(5);
        // Ajustar el tamaño de colisión al tamaño visual del sprite escalado
        if (this.body) {
            this.body.setSize(this.width / 6, this.height / 6);
        }
    }

    static preload(scene) {
        scene.load.image('bala_mcuaktro', balaTexture);
    }
}