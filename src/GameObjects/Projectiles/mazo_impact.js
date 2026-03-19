import Phaser from 'phaser';
import Projectile from './projectile.js';

/**
 * MazoImpact — circular area-of-effect damage from a charged mazo slam.
 *
 * 3 tiers based on charge level, each with increasing radius.
 * No sprite — uses a Graphics circle for visual feedback.
 */
export default class MazoImpact extends Projectile {

    constructor(scene, x, y, config = {}) {
        const radius = config.radius ?? 35;

        super(scene, x, y, null, {
            damage: config.damage ?? 10,
            collisionRadius: radius,
            speed: 0,
            range: 99999
        });

        this.setVisible(false);
        this.speedX = 0;
        this.speedY = 0;
        if (this.body) {
            this.body.setVelocity(0, 0);
            // Centrar el círculo de colisión sobre la posición del impacto
            this.body.setCircle(radius, -radius, -radius);
            this.body.debugShowBody = false;
        }

        this.piercing   = true;        // hits ALL enemies in the area
        this.hitEnemies = new Set();
        this.duration   = 300;         // ms the impact is active
        this.startTime  = scene.time.now;
        this.impactRadius = radius;
        this.impactColor  = 0xff0000;

        this.owner = config.owner ?? null;
        this.team = config.team ?? (this.owner ? this.owner.team : 'neutral');

        // Visual circle
        this.gfx = scene.add.graphics();
        this.gfx.setDepth(3);
        this._drawCircle(0.5);
    }

    _drawCircle(alpha) {
        this.gfx.clear();
        this.gfx.fillStyle(this.impactColor, alpha);
        this.gfx.fillCircle(this.x, this.y, this.impactRadius);
    }

    _update(time, _delta) {
        if (!this.active) return;

        const elapsed = time - this.startTime;
        if (elapsed >= this.duration) {
            if (this.gfx) this.gfx.destroy();
            this.destroy();
            return;
        }

        // Fade out
        const alpha = 0.5 * (1 - elapsed / this.duration);
        this._drawCircle(alpha);
    }
}
