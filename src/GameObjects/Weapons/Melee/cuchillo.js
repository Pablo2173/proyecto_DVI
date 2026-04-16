import Phaser from 'phaser';
import Weapon from '../weapon.js';
import cuchilloSprite from '../../../../assets/sprites/Weapons/cuchillo.png';
import CuchilloSwing from '../../Projectiles/cuchilloSwing.js';

export default class Cuchillo extends Weapon {
    constructor(scene, owner, bar = null) {
        // Detectar si el propietario es un enemigo para ajustar parámetros
        const isEnemy = owner?.constructor?.name === 'Enemy';
        
        super(scene, owner, {
            texture:         'cuchillo',
            isRanged:        false,
            damage:          isEnemy ? 20 : 25,
            attackSpeed:     1000,
            durability:      6,
            range:           isEnemy ? 150 : 200,
            optimalDistance: isEnemy ? 30 : 55,
            swingAngle:      80,
            swingDuration:   100,
            scale:           1.5,
            debug:           false,
            bar:             bar
        });

        this.attackArcDeg = 60;
    }

    static preload(scene) {
        scene.load.image('cuchillo', cuchilloSprite);
    }

    attack() {
        if (!this._canAttack()) return;
        const scene = this.scene ?? this.owner?.scene;
        if (!scene?.time) return;

        this.lastAttackTime = scene.time.now;

        scene.sound.play('cuchillo_sound', {
            volume: 0.5,
            rate: Phaser.Math.FloatBetween(0.96, 1.04)
        });

        new CuchilloSwing(scene, this.owner.x, this.owner.y, {
            owner: this.owner,
            team: this.owner?.team ?? 'neutral',
            damage: this.getDamage(),
            range: this.range,
            attackArcDeg: this.attackArcDeg,
            weaponRotation: this.rotation,
            duration: this.swingDuration,
            swingAngle: Phaser.Math.DegToRad(this.swingAngle)
        });

        this.on_shoot();

        if (!this.scene || !this.owner || !this.active) return;

        this._quarterSwingAnimation(scene);
    }

    onDash() {
        if (!this.owner?.startInvisibleState) return;
        if (!this.owner.canStartInvisible?.()) return;

        this.owner.startInvisibleState(4000);
        //if (!this.owner) return;

        const enemiesContainer = this.owner.scene?.enemies;
        const enemies = Array.isArray(enemiesContainer)
            ? enemiesContainer
            : enemiesContainer?.getChildren?.() ?? [];

        enemies.forEach(enemy => enemy?.resetAlertState?.());
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