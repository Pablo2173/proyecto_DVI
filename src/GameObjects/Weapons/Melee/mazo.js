import Phaser from 'phaser';
import Weapon from '../weapon.js';
import MazoImpact from '../../Projectiles/mazo_impact.js';
import WeaponBar from '../../weaponBar.js';
import mazoSprite from '../../../../assets/sprites/Weapons/mazo.png';

export default class Mazo extends Weapon {

    static CHARGE_DURATION = 3000;  // ~3 s para carga máxima
    static MIN_SPEED_FACTOR = 0.2;   // velocidad mínima del pato al máx. carga

    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture: 'mazo',
            isRanged: false,
            damage: 55,
            attackSpeed: 500,
            durability: 10,
            range: 90,
            optimalDistance: 65,
            swingAngle: 70,
            swingDuration: 180,
            scale: 1.5,
            debug: true,
            bar: bar
        });

        // ── Estado de carga ──
        this.isCharging = false;
        this.isSlamming = false;
        this.chargeStartTime = 0;
        this.chargeLevel = 0;   // 0..1
        this.originalDuckSpeed = null;
        this.baseRange = this.range;  // radio mínimo (sin carga)

        // Gráficos del círculo de rango dinámico (rojo)
        this.rangeCircleGfx = scene.add.graphics();
        this.rangeCircleGfx.setDepth(2);
    }

    static preload(scene) {
        scene.load.image('mazo', mazoSprite);
    }

    // ── Equip ────────────────────────────────
    on_equip() {
        if (this.bar) this.bar.setEmpty();
    }

    // ── Attack override: inicia la carga ─────
    attack() {
        if (this.isCharging || this.isSlamming) return;
        if (this.isEnemy) { super.attack(); return; }
        if (!this._canAttack()) return;

        this.isCharging = true;
        this.isAttacking = true;   // bloquea _canAttack() y on_wait()
        this.chargeStartTime = this.scene.time.now;
        this.chargeLevel = 0;
        this.originalDuckSpeed = this.owner._speed;

        if (this.bar) this.bar.setEmpty();
    }

    // ── Update cada frame ────────────────────
    update() {
        if (!this.owner || !this.scene) return;

        // Cancelar carga si está nadando
        if (this.isCharging && this.owner.state === 4) {
            this._cancelCharge();
        }

        // Durante el slam solo sincronizar posición
        if (this.isSlamming) {
            this.x = this.owner.x;
            this.y = this.owner.y;
            return;
        }

        super.update();

        if (this.isCharging && !this.isEnemy) {
            if (!this.scene.input.activePointer.isDown) {
                this._releaseCharge();
            } else {
                this._updateCharge();
            }
        }
    }

    // ── Lógica de carga ──────────────────────
    _updateCharge() {
        const elapsed = this.scene.time.now - this.chargeStartTime;
        const t = Math.min(elapsed / Mazo.CHARGE_DURATION, 1);

        // Ease-out cuadrático: rápido al principio, lento al acercarse al tope
        this.chargeLevel = 1 - Math.pow(1 - t, 2);

        // ── Actualizar barra ──
        if (this.bar) {
            this.bar.currentCharge = this.chargeLevel * WeaponBar.MAX_CHARGE;
            this.bar.updateFill();
        }

        // ── Reducir velocidad del pato ──
        const speedFactor = 1 - (1 - Mazo.MIN_SPEED_FACTOR) * this.chargeLevel;
        this.owner._speed = this.originalDuckSpeed * speedFactor;

        // ── Radio dinámico: 1× – 2× del baseRange ──
        this.range = this.baseRange * (1 + this.chargeLevel);

        // ── Dibujar círculo rojo de rango ──
        this._drawRangeCircle();

        // ── Elevar el mazo (arco más corto hacia -90° = arriba) ──
        const cur = this.angle;
        let diff = -90 - cur;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        const elevated = cur + diff * this.chargeLevel;
        this.setAngle(elevated);

        // Corregir flip para el ángulo elevado
        const wrapped = Phaser.Math.Angle.WrapDegrees(elevated);
        this.setFlipY(wrapped > 90 || wrapped < -90);
    }

    // ── Soltar: slam + impacto ───────────────
    _releaseCharge() {
        if (!this.isCharging) return;
        this.isCharging = false;

        // Restaurar velocidad del pato
        if (this.originalDuckSpeed !== null) {
            this.owner._speed = this.originalDuckSpeed;
            this.originalDuckSpeed = null;
        }

        // Radio de impacto proporcional a la carga (1× – 2× baseRange)
        const impactRadius = this.baseRange * (1 + this.chargeLevel);

        // Daño escala con la carga (50 % – 200 % del daño base)
        const impactDamage = this.getDamage() * (0.5 + this.chargeLevel * 1.5);

        // Crear impacto bajo el pato
        new MazoImpact(this.scene, this.owner.x, this.owner.y, {
            radius: impactRadius,
            damage: impactDamage,
            owner: this.owner,
            team: this.owner?.team ?? 'neutral'
        });

        // Restaurar radio base y limpiar círculo
        this.range = this.baseRange;
        this._clearRangeCircle();

        // Cooldown
        this.lastAttackTime = this.scene.time.now;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();

        // Animación de slam
        this._slamAnimation();
    }

    // ── Cancelar carga (p.ej. al nadar) ──────
    _cancelCharge() {
        if (!this.isCharging) return;
        this.isCharging = false;
        this.isSlamming = false;
        this.isAttacking = false;
        this.chargeLevel = 0;

        if (this.originalDuckSpeed !== null) {
            this.owner._speed = this.originalDuckSpeed;
            this.originalDuckSpeed = null;
        }
        this.range = this.baseRange;
        this._clearRangeCircle();
        if (this.bar) this.bar.setEmpty();
    }

    // ── Animación de slam (mazo baja) ────────
    _slamAnimation() {
        this.isSlamming = true;
        this.setAngle(90);          // mazo apunta abajo

        this.scene.time.delayedCall(200, () => {
            if (!this.scene) return;
            this.isSlamming = false;
            this.isAttacking = false;
        });
    }

    // ── Callbacks de barra (solo para enemigos) ──
    on_shoot() {
        if (!this.bar || !this.isEnemy) return;
        this.bar.removeCharge(5);
        if (this.bar.isFull()) this.bar.startCooldown(5000);
        this.attackSpeed += 3;
        this.accuracy += 7;
    }

    barCanShoot() {
        if (!this.bar) return true;
        if (this.isEnemy) return !this.bar.isFull() && this.bar.cooldownTime === 0;
        return true;
    }

    on_wait() {
        if (!this.bar || !this.isEnemy) return;
        this.bar.addCharge(1);
    }

    // ── Círculo de rango dinámico ─────────────
    _drawRangeCircle() {
        this.rangeCircleGfx.clear();
        this.rangeCircleGfx.lineStyle(2, 0xff0000, 0.5);
        this.rangeCircleGfx.strokeCircle(this.owner.x, this.owner.y, this.range);
        this.rangeCircleGfx.fillStyle(0xff0000, 0.08);
        this.rangeCircleGfx.fillCircle(this.owner.x, this.owner.y, this.range);
    }

    _clearRangeCircle() {
        if (this.rangeCircleGfx) this.rangeCircleGfx.clear();
    }

    // ── Limpieza ─────────────────────────────
    destroy(fromScene) {
        this._clearRangeCircle();
        if (this.rangeCircleGfx) {
            this.rangeCircleGfx.destroy();
            this.rangeCircleGfx = null;
        }
        this._cancelCharge();
        super.destroy(fromScene);
    }
}