import MeleeWeapon from '../meleeWeapon.js';
import ramitaTexture from '../../../../assets/sprites/Weapons/ramita.png';

export default class Ramita extends MeleeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'ramita', {
            damage:        5,
            attackSpeed:   500,
            swingAngle:    40,
            swingDuration: 150,
            scale:         0.15,
            origin:        { x: 0.2, y: 0.5 }
        });
    }

    static preload(scene) {
        scene.load.image('ramita', ramitaTexture);
    }
}