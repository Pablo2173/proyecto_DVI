import Weapon from '../weapon.js';
import ramitaSprite from '../../../../assets/sprites/weapons/ramita.png';

export default class Ramita extends Weapon {
    constructor(scene, owner) {
        super(scene, owner, {
            texture:         'ramita',
            isRanged:        false,
            damage:          5,
            attackSpeed:     250,   // rápida pero débil
            range:           70,
            optimalDistance: 50,
            swingAngle:      70,
            swingDuration:   90,
            scale:           1,
            debug:           false
        });
    }

    static preload(scene) {
        scene.load.image('ramita', ramitaSprite);
    }
}