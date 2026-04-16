import Phaser from 'phaser';
import Weapon from '../weapon.js';
import ramitaSprite from '../../../../assets/sprites/Weapons/ramita.png';
import RamitaSwing from '../../Projectiles/ramitaSwing.js';

export default class Ramita extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture: 'ramita',
            isRanged: false,
            damage: 15,
            attackSpeed: 700,
            range: 170,
            optimalDistance: 85,
            swingAngle: 90,
            swingDuration: 120,
            scale: 1,
            debug: false,
            bar
        });

        this.attackArcDeg = 60;
        this.testRangeVisible = false;
        this.testRangeGraphics = scene.add.graphics();
        this.testRangeGraphics.setDepth(9998);
    }

    static preload(scene) {
        scene.load.image('ramita', ramitaSprite);
    }

    on_equip() {
        // Mostrar rango de test al jugador por defecto.
        //this.setTestRangeVisible(!this.isEnemy);
        this.setTestRangeVisible(false);
    }

    update() {
        // Si el dueño está muerto o la escena está en game over, no actualizar
        const isDead = this.owner?.isDead?.() || this.owner?._state === 2 || this.scene?.isPlayerDead;
        if (isDead) {
            this.setVisible(false);
            this.setActive(false);
            return;
        }

        super.update();

        if (this.testRangeVisible) {
            this._drawTestRange();
        } else if (this.testRangeGraphics) {
            this.testRangeGraphics.clear();
        }
    }

    // Debug para testing visual del área real de golpe.
    setTestRangeVisible(visible = true) {
        this.testRangeVisible = visible;
        if (!visible && this.testRangeGraphics) {
            this.testRangeGraphics.clear();
        }
    }

    toggleTestRange() {
        this.setTestRangeVisible(!this.testRangeVisible);
    }

    attack() {
        if (!this._canAttack()) return;
        this.lastAttackTime = this.scene.time.now;
        
        this.scene.sound.play('ramita_sound', {
            volume: 0.5,
            rate: Phaser.Math.FloatBetween(0.95, 1.05)
        });
        new RamitaSwing(this.scene, this.owner.x, this.owner.y, {
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

    _drawTestRange() {
        if (!this.testRangeGraphics || !this.owner) return;

        const ownerX = this.owner.x;
        const ownerY = this.owner.y;
        const forwardAngle = this.rotation;
        const halfArc = Phaser.Math.DegToRad(this.attackArcDeg / 2);
        const startAngle = forwardAngle - halfArc;
        const endAngle = forwardAngle + halfArc;

        this.testRangeGraphics.clear();
        this.testRangeGraphics.fillStyle(0xff8800, 0.28);
        this.testRangeGraphics.lineStyle(3, 0xff8800, 1);
        this.testRangeGraphics.beginPath();
        this.testRangeGraphics.moveTo(ownerX, ownerY);
        this.testRangeGraphics.arc(ownerX, ownerY, this.range, startAngle, endAngle, false);
        this.testRangeGraphics.closePath();
        this.testRangeGraphics.fillPath();
        this.testRangeGraphics.strokePath();

        // Dibujar los dos radios para que el sector se identifique mejor al testear.
        this.testRangeGraphics.lineBetween(
            ownerX,
            ownerY,
            ownerX + Math.cos(startAngle) * this.range,
            ownerY + Math.sin(startAngle) * this.range
        );
        this.testRangeGraphics.lineBetween(
            ownerX,
            ownerY,
            ownerX + Math.cos(endAngle) * this.range,
            ownerY + Math.sin(endAngle) * this.range
        );
    }

    destroy(fromScene, options) {
        // Ocultar inmediatamente el sprite de la ramita
        this.setVisible(false);
        this.setActive(false);

        if (this.testRangeGraphics) {
            this.testRangeGraphics.destroy();
            this.testRangeGraphics = null;
        }
        super.destroy(fromScene, options);
    }
}