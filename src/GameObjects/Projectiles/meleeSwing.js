import Phaser from 'phaser';
import Projectile from './projectile.js';

/**
 * Base projectile for melee arc swings.
 *
 * Concrete swings pass texture and tuning values through config.
 */
export default class MeleeSwing extends Projectile {
    constructor(scene, x, y, textureKey, config = {}) {
        super(scene, x, y, textureKey, {
            damage: config.damage ?? 10,
            speed: 0,
            range: 99999,
            collisionRadius: 1
        });

        this.owner = config.owner;
        this.team = config.team ?? (this.owner ? this.owner.team : 'neutral');
        this.duration = Math.max(config.duration ?? 120, config.minDuration ?? 500);
        this.swingAmplitude = config.swingAngle ?? Math.PI;
        this.radius = config.radius ?? Math.floor((config.range ?? 200) / 1.5);
        this.baseRotation = config.weaponRotation ?? 0;
        this.attackArcDeg = config.attackArcDeg ?? 60;
        this.hitRange = config.range ?? 200;
        this.startTime = scene.time.now;

        this.knockbackAbilitySpeed = config.knockbackAbilitySpeed ?? 360;
        this.knockbackSpeed = config.knockbackSpeed ?? 360;
        this.knockbackDuration = config.knockbackDuration ?? 180;
        this.notifyWeaponOnHit = config.notifyWeaponOnHit ?? true;

        this.setVisible(true);
        this.setDepth(9997);
        this.setScale(config.spriteScale ?? 1.3);
        this.setAlpha(1);
        this.speedX = 0;
        this.speedY = 0;

        if (scene.projectiles) {
            scene.projectiles.remove(this);
        }

        if (this.body) {
            this.body.setEnable(false);
        }

        this._applyAmplitudDamage();
    }

    _applyAmplitudDamage() {
        const ownerX = this.owner?.x ?? this.x;
        const ownerY = this.owner?.y ?? this.y;
        const forwardAngle = this.baseRotation;
        const halfArc = Phaser.Math.DegToRad(this.attackArcDeg / 2);

        const targets = this._getPotentialTargets();
        if (!targets || typeof targets[Symbol.iterator] !== 'function') {
            return;
        }

        for (const target of targets) {
            if (!target || !target.active) continue;

            const dist = Phaser.Math.Distance.Between(ownerX, ownerY, target.x, target.y);
            if (dist > this.hitRange) continue;

            const toTarget = Phaser.Math.Angle.Between(ownerX, ownerY, target.x, target.y);
            const delta = Phaser.Math.Angle.Wrap(toTarget - forwardAngle);
            if (Math.abs(delta) > halfArc) continue;

            this._applyDamageToTarget(target);
        }
    }

    _getPotentialTargets() {
        if (this.owner?.team === 'ally') {
            const enemies = this.scene?.enemies;
            if (!enemies) return [];

            if (Array.isArray(enemies)) return enemies;
            if (typeof enemies.getChildren === 'function') return enemies.getChildren();
            if (typeof enemies[Symbol.iterator] === 'function') return enemies;

            return [];
        }

        const duck = this.scene?.duck;
        return duck ? [duck] : [];
    }

    _applyDamageToTarget(target) {
        if (target.team && this.owner?.team && target.team === this.owner.team) return;

        if (typeof target.isDead === 'function' && target.isDead()) return;

        if (typeof target.takeDamage === 'function') {
            target.takeDamage(this.damage);
            if (this.notifyWeaponOnHit) {
                this.owner?.weapon?.onHitTarget?.(target);
            }
            this._applyKnockback(target);
        }
    }

    _applyKnockback(target) {
        if (!target || !target.body || !this.owner) return;

        const dx = target.x - this.owner.x;
        const dy = target.y - this.owner.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0.0001) return;

        const nx = dx / dist;
        const ny = dy / dist;

        if (typeof target.applyKnockback === 'function') {
            target.applyKnockback(nx, ny, this.knockbackAbilitySpeed, this.knockbackDuration);
            return;
        }

        if (typeof target.body.setVelocity === 'function') {
            target.body.setVelocity(
                nx * this.knockbackSpeed,
                ny * this.knockbackSpeed
            );
        }
    }

    _update(time, _delta) {
        if (!this.active) return;

        const elapsed = time - this.startTime;
        if (elapsed >= this.duration) {
            this.destroy();
            return;
        }

        const progress = elapsed / this.duration;
        const angleOffset = -this.swingAmplitude / 2 + this.swingAmplitude * progress;
        const angle = this.baseRotation + angleOffset;

        const ownerX = this.owner ? this.owner.x : this.x;
        const ownerY = this.owner ? this.owner.y : this.y;

        this.x = ownerX + Math.cos(angle) * this.radius;
        this.y = ownerY + Math.sin(angle) * this.radius;
        this.setRotation(angle);
        this.setAlpha(1 - progress * 0.45);
    }
}
