import Weapon from './weapon.js';

export default class DistanceWeapon extends Weapon {
    constructor(scene, x, y, texture, config = {}) {
        if (new.target === DistanceWeapon) {
            throw new Error('DistanceWeapon es abstracta. Usa Arco, M4 u otra subclase concreta.');
        }

        super(scene, x, y, texture, config);

        this.projectileClass = config.projectileClass ?? null;
        this.projectileSpeed = config.projectileSpeed ?? 600;
        // range ya viene de Weapon vía config

        this.owner = null;
        this.spriteAngleOffset = 0;

        this.setOrigin(0, 0.5);
    }

    update() {
        super.update(); // ── dibuja círculos debug si debugMode === true

        if (!this.owner || !this.scene) return;

        this.x = this.owner.x;
        this.y = this.owner.y;

        const pointer = this.scene.input.activePointer;
        const angleRad = Phaser.Math.Angle.Between(
            this.owner.x,
            this.owner.y,
            pointer.worldX,
            pointer.worldY
        );

        const angleDeg = Phaser.Math.RadToDeg(angleRad);
        this.setAngle(angleDeg + this.spriteAngleOffset);

        const normalized = Phaser.Math.Angle.WrapDegrees(angleDeg);
        if (normalized > 90 || normalized < -90) {
            this.setFlipY(true);
        } else {
            this.setFlipY(false);
        }
    }

    attack() {
        if (!this.canAttack()) return;
        if (!this.projectileClass) {
            console.warn(`${this.constructor.name}: no tiene projectileClass definida.`);
            return;
        }

        this.lastAttackTime = this.scene.time.now;

        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            this.owner.x,
            this.owner.y,
            pointer.worldX,
            pointer.worldY
        );

        const direction = new Phaser.Math.Vector2(
            Math.cos(angle),
            Math.sin(angle)
        );

        const length = this.displayWidth;
        const spawnX = this.x + Math.cos(angle) * length;
        const spawnY = this.y + Math.sin(angle) * length;

        new this.projectileClass(this.scene, spawnX, spawnY, {
            direction,
            speed:  this.projectileSpeed,
            range:  this.range,
            damage: this.damage
        });
    }
}