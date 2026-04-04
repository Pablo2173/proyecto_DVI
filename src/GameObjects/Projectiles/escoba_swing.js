import MeleeSwing from './melee_swing.js';


export default class EscobaSwing extends MeleeSwing {
    static TEXTURE_KEY = 'escoba'; //cambiar por la animacion de golpe cuando este lista


    constructor(scene, x, y, config = {}) {
        super(scene, x, y, EscobaSwing.TEXTURE_KEY, {
            ...config,
            damage: config.damage ?? 25,
            range: config.range ?? 200,
            duration: config.duration ?? 120,
            swingAngle: config.swingAngle ?? Math.PI * 0.6,
            knockbackAbilitySpeed: config.knockbackAbilitySpeed ?? config.knockbackSpeed ?? 180,
            knockbackSpeed: config.knockbackSpeed ?? 180,
            knockbackDuration: config.knockbackDuration ?? 180,
            notifyWeaponOnHit: config.notifyWeaponOnHit ?? true
        });
    }
}