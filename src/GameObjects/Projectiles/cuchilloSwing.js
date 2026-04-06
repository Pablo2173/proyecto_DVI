import MeleeSwing from './meleeSwing.js';

/**
 * CuchilloSwing — proyectil melee para el cuchillo.
 *
 * Swing más rápido y corto que el mazo.
 */
export default class CuchilloSwing extends MeleeSwing {
    static TEXTURE_KEY = 'cuchillo'; //cambiar por la animacion de golpe cuando este lista


    constructor(scene, x, y, config = {}) {
        super(scene, x, y, CuchilloSwing.TEXTURE_KEY, {
            ...config,
            damage: config.damage ?? 25,
            range: config.range ?? 200,
            duration: config.duration ?? 120,
            swingAngle: config.swingAngle ?? Math.PI * 0.6,
            knockbackAbilitySpeed: config.knockbackAbilitySpeed ?? 180,
            knockbackSpeed: config.knockbackSpeed ?? 180,
            knockbackDuration: config.knockbackDuration ?? 180,
            notifyWeaponOnHit: config.notifyWeaponOnHit ?? true
        });
    }
}