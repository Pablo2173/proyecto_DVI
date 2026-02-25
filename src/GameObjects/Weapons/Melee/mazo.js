import Weapon from '../weapon.js';
import mazoSprite from '../../../../assets/sprites/weapons/mazo.png';

export default class Mazo extends Weapon {
    constructor(scene, owner) {
        super(scene, owner, {
            texture:         'mazo',
            isRanged:        false,
            damage:          45,
            attackSpeed:     800,   // arma lenta pero poderosa
            range:           90,
            optimalDistance: 65,
            swingAngle:      90,
            swingDuration:   180,
            scale:           1.2,
            debug:           false
        });
    }

    static preload(scene) {
        scene.load.image('mazo', mazoSprite);
    }
}