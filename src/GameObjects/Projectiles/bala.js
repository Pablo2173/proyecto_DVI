import Projectile from './projectile.js';
import balaTexture from '../../../assets/sprites/Projectiles/bala_mcuaktro.png';

export default class Bala extends Projectile {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, 'bala_mcuaktro', config);
        this.setScale(1);
    }

    static preload(scene) {
        scene.load.image('bala_mcuaktro', balaTexture);
    }
}