import Projectile from './projectile.js';

/**
 * CuchilloSwing — proyectil melee para el cuchillo.
 *
 * Swing más rápido y corto que el mazo.
 */
export default class CuchilloSwing extends Projectile {

    constructor(scene, x, y, config = {}) {
        super(scene, x, y, null, { damage: config.damage ?? 25 });

        this.owner          = config.owner;
        this.duration       = config.duration      ?? 120;
        this.swingAmplitude = config.swingAngle    ?? Math.PI * 0.6;   // 108°
        this.radius         = config.radius        ?? 36;
        this.baseRotation   = config.weaponRotation ?? 0;
        this.startTime      = scene.time.now;

        this.setVisible(false);
        this.speedX = 0;
        this.speedY = 0;
    }

    _update(time, delta) {
        if (!this.active) return;

        const elapsed = time - this.startTime;
        if (elapsed >= this.duration) {
            this.destroy();
            return;
        }

        const progress    = elapsed / this.duration;
        const angleOffset = -this.swingAmplitude / 2 + this.swingAmplitude * progress;
        const angle       = this.baseRotation + angleOffset;

        const ownerX = this.owner ? this.owner.x : this.x;
        const ownerY = this.owner ? this.owner.y : this.y;

        this.x = ownerX + Math.cos(angle) * this.radius;
        this.y = ownerY + Math.sin(angle) * this.radius;
    }
}