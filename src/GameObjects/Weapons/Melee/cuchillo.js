import Weapon from '../weapon.js';
import cuchilloSprite from '../../../../assets/sprites/weapons/cuchillo.png';

export default class Cuchillo extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture:         'cuchillo',
            isRanged:        false,
            damage:          25,
            attackSpeed:     350,
            range:           80,
            optimalDistance: 55,
            swingAngle:      80,
            swingDuration:   100,
            scale:           1,
            debug:           true,
            bar:             bar
        });
    }

    static preload(scene) {
        scene.load.image('cuchillo', cuchilloSprite);
    }
}