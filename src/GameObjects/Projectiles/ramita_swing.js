import Phaser from 'phaser';
import Projectile from './projectile.js';

/**
 * RamitaSwing — proyectil melee para la ramita.
 *
 * Muy rápido, radio pequeño, daño mínimo.
 */
export default class RamitaSwing extends Projectile {
    static TEXTURE_KEY = 'ramita';

    constructor(scene, x, y, config = {}) {
        super(scene, x, y, RamitaSwing.TEXTURE_KEY, {
            damage: config.damage ?? 5,
            speed: 0,
            range: 99999,
            collisionRadius: 1
        });

        this.owner          = config.owner;
        this.team           = config.team ?? (this.owner ? this.owner.team : 'neutral');
        this.duration       = Math.max(config.duration ?? 90, 500);
        this.swingAmplitude = config.swingAngle    ?? Math.PI * 0.55;   // ~99°
        this.radius         = config.radius        ?? Math.floor((config.range ?? 80) / 1.25);
        this.baseRotation   = config.weaponRotation ?? 0;
        this.attackArcDeg   = config.attackArcDeg  ?? 60;
        this.hitRange       = config.range         ?? 170;
        this.startTime      = scene.time.now;

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

        this._applyQuarterCircleDamage();
    }

    // esta funcion es la que crea el proyectil y comprueba si hay un enemigo para aplicarle el daño
    _applyQuarterCircleDamage() {
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

    // aqui compruebo para aplicar el daño y el retroceso al enemigo
    _applyDamageToTarget(target) {
        if (target.team && this.owner?.team && target.team === this.owner.team) return;

        if (typeof target.isDead === 'function' && target.isDead()) return;

        if (typeof target.takeDamage === 'function') {
            target.takeDamage(this.damage);
            this._applyKnockback(target);
        }
    }

    // Empuja al objetivo en la direccion opuesta al atacante
    _applyKnockback(target) {
        if (!target || !target.body || !this.owner) return;

        const dx = target.x - this.owner.x;
        const dy = target.y - this.owner.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0.0001) return;

        const nx = dx / dist;
        const ny = dy / dist;

        if (typeof target.applyKnockback === 'function') {
            target.applyKnockback(nx, ny, 120, 120);
            return;
        }

        const knockbackSpeed = 180;
        if (typeof target.body.setVelocity === 'function') {
            target.body.setVelocity(
                nx * knockbackSpeed,
                ny * knockbackSpeed
            );
        }
    }

    // rota el proyectil para dar ese toque de movimiento
    _update(time, _delta) {
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
        this.setRotation(angle);
        this.setAlpha(1 - progress * 0.45);
    }
}