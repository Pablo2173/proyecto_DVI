import MeleeSwing from './meleeSwing.js';

/**
 * RamitaSwing — proyectil melee para la ramita.
 *
 * Muy rápido, radio pequeño, daño mínimo.
 */
export default class RamitaSwing extends MeleeSwing {
    static TEXTURE_KEY = 'ramita';

    constructor(scene, x, y, config = {}) {
        super(scene, x, y, RamitaSwing.TEXTURE_KEY, {
            ...config,
            damage: config.damage ?? 5,
            range: config.range ?? 170,
            duration: config.duration ?? 90,
            swingAngle: config.swingAngle ?? Math.PI * 0.55,
            //knockbackAbilitySpeed: config.knockbackAbilitySpeed ?? 120,
            //knockbackSpeed: config.knockbackSpeed ?? 180,
            //knockbackDuration: config.knockbackDuration ?? 120,
            notifyWeaponOnHit: config.notifyWeaponOnHit ?? false
        });
    }
}