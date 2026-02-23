import MeleeWeapon from '../meleeWeapon.js';
import cuchilloTexture from '../../../../assets/sprites/Weapons/cuchillo.png';

export default class Cuchillo extends MeleeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'cuchillo', {
            damage:          15,
            attackSpeed:     300,
            swingAngle:      40,
            swingDuration:   80,
            range:           60,
            optimalDistance: 30,
            debug:            true,
            scale:           0.2,
            origin:          { x: 0, y: 0.5 }
        });
    }

    static preload(scene) {
        scene.load.image('cuchillo', cuchilloTexture);
    }
}