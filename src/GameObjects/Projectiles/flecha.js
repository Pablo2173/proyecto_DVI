import Projectile from './projectile.js';
import flechaTexture from '../../../assets/sprites/Projectiles/flecha_arco.png';

export default class Flecha extends Projectile {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y, 'flecha_arco', config);
        this.setScale(0.2);
        // Ajustar el tamaño de colisión al tamaño visual del sprite escalado
        if (this.body) {
            this.body.setSize(this.width / 3, this.height / 3);
        }
    }

    static preload(scene) {
        scene.load.image('flecha_arco', flechaTexture);
    }
}