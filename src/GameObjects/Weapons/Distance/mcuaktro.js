import DistanceWeapon from '../distanceWeapon.js';
import Bala from '../../Projectiles/bala.js';
import m4Texture from '../../../../assets/sprites/Weapons/mcuaktro.png';

export default class Mcuaktro extends DistanceWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'mcuaktro', {
            damage:          10,
            attackSpeed:     120,
            projectileClass: Bala,
            projectileSpeed: 1000,
            range:           500,
            optimalDistance: 250,
            debug:           true,
            scale:           1,
        });
    }

    static preload(scene) {
        scene.load.image('mcuaktro', m4Texture);
    }
}