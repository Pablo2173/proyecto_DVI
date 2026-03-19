import Phaser from 'phaser';
import Mazo from './mazo.js';
import RamitaSwing from '../../Projectiles/ramita_swing.js';
import ramitaSprite from '../../../../assets/sprites/Weapons/ramita.png';

export default class Ramita extends Mazo {
    constructor(scene, owner, bar = null) {
        super(scene, owner, bar);

        // Ajustar estadísticas para ramita: similar a mazo pero un poco más ligero
        this.setTexture('ramita');
        this.damage = 30;
        this.attackSpeed = 450;
        this.range = 80;
        this.optimalDistance = 55;
        this.swingAngle = 75;
        this.swingDuration = 140;
        this.scale = 1;
    }

    static preload(scene) {
        scene.load.image('ramita', ramitaSprite);
    }

    // Sobrescribir la liberación de carga: ángulo de golpe directo sin onda expansiva
    _releaseCharge() {
        if (!this.isCharging) return;
        this.isCharging = false;

        if (this.originalDuckSpeed !== null) {
            this.owner._speed = this.originalDuckSpeed;
            this.originalDuckSpeed = null;
        }

        const chargeMultiplier = 0.5 + this.chargeLevel * 1.5;
        const impactDamage = this.damage * chargeMultiplier;

        // Desplazar en arc swing como proyectil melee de área pequeña
        new RamitaSwing(this.scene, this.owner.x, this.owner.y, {
            owner: this.owner,
            team: this.owner?.team ?? 'neutral',
            damage: impactDamage,
            duration: 200,
            swingAngle: this.swingAngle,
            radius: this.baseRange * (1 + this.chargeLevel * 0.4),
            weaponRotation: Phaser.Math.DegToRad(this.angle)
        });

        this.range = this.baseRange;
        this._clearRangeCircle();

        this.lastAttackTime = this.scene.time.now;
        this.chargeLevel = 0;
        if (this.bar) this.bar.setEmpty();

        this._slamAnimation();
    }
}