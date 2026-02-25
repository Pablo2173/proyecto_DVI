import Weapon from '../weapon.js';
import Flecha from '../../Projectiles/flecha.js';
import arcoSprite from '../../../../assets/sprites/weapons/arco.png';

export default class Arco extends Weapon {
    constructor(scene, owner) {
        super(scene, owner, {
            texture:         'arco',
            isRanged:        true,
            projectileClass: Flecha,
            projectileSpeed: 700,
            damage:          20,
            attackSpeed:     600,
            range:           400,
            optimalDistance: 280,
            scale:           1,
            spriteAngleOffset: 0,
            debug:           false
        });
    }

    static preload(scene) {
        scene.load.image('arco', arcoSprite);
    }
}