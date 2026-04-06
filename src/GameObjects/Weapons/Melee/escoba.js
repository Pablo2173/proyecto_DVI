import Phaser from 'phaser';
import Weapon from '../weapon.js';
import escobaSprite from '../../../../assets/sprites/Weapons/mazo.png';
import EscobaSwing from '../../Projectiles/escobaSwing.js';
import WeaponBar from '../weaponBar.js';

export default class Escoba extends Weapon {
    static CHARGE_DURATION = 2500;  // 2.5 segundos para carga completa

    constructor(scene, owner, bar = null) {
        // Detectar si el propietario es un enemigo para ajustar parámetros
        const isEnemy = owner?.constructor?.name === 'Enemy';
        
        super(scene, owner, {
            texture:         'escoba',
            isRanged:        false,
            damage:          13,
            attackSpeed:     700,
            durability:      12,
            range:           isEnemy ? 150 : 200,
            optimalDistance: isEnemy ? 30 : 55,
            swingAngle:      80,
            swingDuration:   100,
            scale:           1,
            debug:           true,
            bar:             bar
        });

        this.attackArcDeg = 60;
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.chargeLevel = 0;
    }

    static preload(scene) {
        scene.load.image('escoba', escobaSprite);
    }

    on_equip() {
        if (this.bar) this.bar.setEmpty();
    }

    attack() {
        if (this.isCharging) return;
        if (this.isEnemy) { super.attack(); return; }
        if (!this._canAttack()) return;

        this.isCharging = true;
        this.isAttacking = true;
        this.chargeStartTime = this.scene.time.now;
        this.chargeLevel = 0;

        if (this.bar) this.bar.setEmpty();
    }

    update() {
        if (!this.owner || !this.scene) return;

        if (this.isCharging && this.owner.state === 4) {
            this._cancelCharge();
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

    releaseAttack() {
        if (!this.isCharging) return;
        this._releaseCharge();
    }

    _updateCharge() {
        const elapsed = this.scene.time.now - this.chargeStartTime;
        const t = Math.min(elapsed / Escoba.CHARGE_DURATION, 1);
        this.chargeLevel = 1 - Math.pow(1 - t, 2);

        if (this.bar) {
            this.bar.currentCharge = this.chargeLevel * WeaponBar.MAX_CHARGE;
            this.bar.updateFill();
        }
    }

    _releaseCharge() {
        if (!this.isCharging) return;
        this.isCharging = false;

        // Daño base + multiplicador según carga (1x hasta 1.5x)
        const damageMult = 1 + (this.chargeLevel * 0.5);
        
        new EscobaSwing(this.scene, this.owner.x, this.owner.y, {
            owner: this.owner,
            team: this.owner?.team ?? 'neutral',
            damage: this.getDamage() * damageMult,
            range: this.range,
            attackArcDeg: this.attackArcDeg,
            weaponRotation: this.rotation,
            duration: this.swingDuration,
            swingAngle: Phaser.Math.DegToRad(this.swingAngle),
            knockbackSpeed: 250 + (this.chargeLevel * 500),
            knockbackDuration: 150 + (this.chargeLevel * 300)
        });

        this.lastAttackTime = this.scene.time.now;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();

        this._quarterSwingAnimation();

        this.on_shoot();
    }

    _cancelCharge() {
        this.isCharging = false;
        this.isAttacking = false;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();
    }

    _quarterSwingAnimation() {
        this.isAttacking = true;

        const baseAngle = this.angle;
        const halfSwing = this.swingAngle / 2;

        this.scene.tweens.add({
            targets: this,
            angle: baseAngle + halfSwing,
            duration: this.swingDuration,
            yoyo: true,
            ease: 'Power1',
            onStart: () => {
                this.setAngle(baseAngle - halfSwing);
            },
            onComplete: () => {
                this.angle = baseAngle;
                this.isAttacking = false;
            }
        });
    }
}