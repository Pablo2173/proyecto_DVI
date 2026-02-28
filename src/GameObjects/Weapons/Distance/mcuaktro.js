import Weapon from '../weapon.js';
import Bala from '../../Projectiles/bala.js';
import mcuaktroSprite from '../../../../assets/sprites/weapons/mcuaktro.png';

export default class Mcuaktro extends Weapon {
    constructor(scene, owner) {
        super(scene, owner, {
            texture:         'mcuaktro',
            isRanged:        true,
            projectileClass: Bala,
            projectileSpeed: 900,
            damage:          15,
            attackSpeed:     200,   // cadencia alta
            range:           500,
            optimalDistance: 350,
            scale:           1,
            spriteAngleOffset: 0,
            debug:           true
        });
    }

    static preload(scene) {
        scene.load.image('mcuaktro', mcuaktroSprite);
    }
}