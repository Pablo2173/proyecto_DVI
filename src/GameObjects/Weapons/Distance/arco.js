import DistanceWeapon from '../distanceWeapon.js';
import Flecha from '../../Projectiles/flecha.js';
import arcoTexture from '../../../../assets/sprites/Weapons/arco.png';

export default class Arco extends DistanceWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'arco', {
            damage:          15,
            attackSpeed:     800,
            projectileClass: Flecha,
            projectileSpeed: 600,
            range:           500,
            optimalDistance: 250,
            debug:            true,
            scale:           1,
        });
    }

    static preload(scene) {
        scene.load.image('arco', arcoTexture);
    }
}