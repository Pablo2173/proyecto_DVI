import Phaser from 'phaser';
import Weapon from '../weapon.js';
import cuchilloSprite from '../../../../assets/sprites/Weapons/cuchillo.png';
import CuchilloSwing from '../../Projectiles/cuchillo_swing.js';

export default class Cuchillo extends Weapon {
    constructor(scene, owner, bar = null) {
        // Detectar si el propietario es un enemigo para ajustar parámetros
        const isEnemy = owner?.constructor?.name === 'Enemy';
        
        super(scene, owner, {
            texture:         'cuchillo',
            isRanged:        false,
            damage:          isEnemy ? 20 : 25,
            attackSpeed:     1000,
            durability:      12,
            range:           isEnemy ? 150 : 200,
            optimalDistance: isEnemy ? 30 : 55,
            swingAngle:      80,
            swingDuration:   100,
            scale:           1.5,
            debug:           true,
            bar:             bar
        });

        this.attackArcDeg = 60;
    }

    static preload(scene) {
        scene.load.image('cuchillo', cuchilloSprite);
    }

    attack() {
        if (!this._canAttack()) return;
        this.lastAttackTime = this.scene.time.now;

        new CuchilloSwing(this.scene, this.owner.x, this.owner.y, {
            owner: this.owner,
            team: this.owner?.team ?? 'neutral',
            damage: this.getDamage(),
            range: this.range,
            attackArcDeg: this.attackArcDeg,
            weaponRotation: this.rotation,
            duration: this.swingDuration,
            swingAngle: Phaser.Math.DegToRad(this.swingAngle)
        });

        this._quarterSwingAnimation();

        this.on_shoot();
    }

    onDash() {
        if (!this.owner?.startInvisibleState) return;
        if (!this.owner.canStartInvisible?.()) return;

        this.owner.startInvisibleState(4000);

        const enemiesContainer = this.owner.scene?.enemies;
        const enemies = Array.isArray(enemiesContainer)
            ? enemiesContainer
            : enemiesContainer?.getChildren?.() ?? [];

        enemies.forEach(enemy => enemy?.resetAlertState?.());
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