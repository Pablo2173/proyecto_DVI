import MeleeWeapon from '../meleeWeapon.js';
import mazoTexture from '../../../../assets/sprites/Weapons/mazo.png';

export default class Mazo extends MeleeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'mazo', {
            damage:        30,
            attackSpeed:   800,
            swingAngle:    70,
            swingDuration: 200,
            scale:         0.2,
            origin:        { x: 0, y: 0.5 }
        });
    }

    static preload(scene) {
        scene.load.image('mazo', mazoTexture);
    }
}