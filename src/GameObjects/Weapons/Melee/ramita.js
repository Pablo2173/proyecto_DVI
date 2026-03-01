import Weapon from '../weapon.js';
import ramitaSprite from '../../../../assets/sprites/weapons/ramita.png';

export default class Ramita extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture:         'ramita',
            isRanged:        false,
            damage:          5,
            attackSpeed:     250,
            range:           70,
            optimalDistance: 50,
            swingAngle:      70,
            swingDuration:   90,
            scale:           1,
            debug:           true,
            bar:             bar
        });
    }

    static preload(scene) {
        scene.load.image('ramita', ramitaSprite);
    }
}