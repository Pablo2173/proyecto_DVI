import Phaser from 'phaser';
import Weapon from '../weapon.js';
import { TEAM } from '../../team.js';
import escobaSprite from '../../../../assets/sprites/Weapons/escoba.png';
import EscobaSwing from '../../Projectiles/escobaSwing.js';
import WeaponBar from '../weaponBar.js';

export default class Escoba extends Weapon {
    static CHARGE_DURATION = 2500;  // 2.5 segundos para carga completa

    constructor(scene, owner, bar = null) {
        // Detectar si el propietario es un enemigo para ajustar parámetros
        const isEnemy = owner?.team === TEAM.ENEMY;
        
        super(scene, owner, {
            texture:         'escoba',
            isRanged:        false,
            damage:          10,
            attackSpeed:     700,
            durability:      12,
            range:           isEnemy ? 150 : 200,
            optimalDistance: isEnemy ? 30 : 55,
            swingAngle:      80,
            swingDuration:   100,
            scale:           1,
            debug:           false,
            bar:             bar
        });

        this.attackArcDeg = 180;
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
        if (!this._canAttack()) return;

        if (this.isEnemy) {
            // Enemigos disparan directo sin carga
            this.lastAttackTime = this.scene.time.now;
            this.on_shoot();
            
            new EscobaSwing(this.scene, this.owner.x, this.owner.y, {
                owner: this.owner,
                team: this.owner?.team ?? 'neutral',
                damage: this.getDamage() * 2,
                range: this.range,
                attackArcDeg: this.attackArcDeg,
                weaponRotation: this.rotation,
                duration: this.swingDuration,
                swingAngle: Phaser.Math.DegToRad(this.swingAngle),
                knockbackAbilitySpeed: 1000,
                knockbackSpeed: 1000,
                knockbackDuration: 300
            });
            return;
        }

        // Jugador: inicia carga
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
        const scene = this.scene ?? this.owner?.scene;
        if (!scene?.time) {
            this._cancelCharge();
            return;
        }
        
        scene.sound.play('escoba_sound', {
            volume: 0.8,
            rate: Phaser.Math.FloatBetween(0.92, 1.08)
        });
        // Daño base + multiplicador según carga (1x hasta 1.5x)
        const damageMult = 2;
        
        new EscobaSwing(scene, this.owner.x, this.owner.y, {
            owner: this.owner,
            team: this.owner?.team ?? 'neutral',
            damage: this.getDamage() * damageMult,
            range: this.range,
            attackArcDeg: this.attackArcDeg,
            weaponRotation: this.rotation,
            duration: this.swingDuration,
            swingAngle: Phaser.Math.DegToRad(this.swingAngle),
            knockbackAbilitySpeed: 250 + (this.chargeLevel * 500),
            knockbackSpeed: 250 + (this.chargeLevel * 500),
            knockbackDuration: 150 + (this.chargeLevel * 300)
        });

        if (!this.scene || !this.owner || !this.active) return;

        this.lastAttackTime = scene.time.now;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();

        this._quarterSwingAnimation(scene);

        this.on_shoot();
    }

    _cancelCharge() {
        this.isCharging = false;
        this.isAttacking = false;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();
    }

    _quarterSwingAnimation(scene = this.scene ?? this.owner?.scene) {
        this.isAttacking = true;

        if (!scene?.tweens) {
            this.isAttacking = false;
            return;
        }

        const baseAngle = this.angle;
        const halfSwing = this.swingAngle / 2;

        scene.tweens.add({
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