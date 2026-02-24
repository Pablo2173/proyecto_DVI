import Weapon from './weapon.js';

export default class MeleeWeapon extends Weapon {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture, config);

        this.swingAngle    = config.swingAngle    ?? 60;
        this.swingDuration = config.swingDuration ?? 100;
        this.offsetX       = config.offsetX       ?? 36;
        this.offsetY       = config.offsetY       ?? -6;

        this.owner = null;

        this.setOrigin(0.5, 0.5);
    }

    update() {
        super.update(); // ── dibuja círculos debug si debugMode === true

        if (!this.owner) return;

        const facing = this.owner.facing ?? 1;

        this.x = this.owner.x + this.offsetX * facing;
        this.y = this.owner.y + this.offsetY;

        this.setFlipX(facing === -1);
    }

    attack() {
        if (!this.canAttack()) return;
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.lastAttackTime = this.scene.time.now;

        const facing = this.owner?.facing ?? 1;

        this.scene.tweens.add({
            targets: this,
            angle: this.swingAngle * facing,
            duration: this.swingDuration,
            yoyo: true,
            ease: 'Power1',
            onComplete: () => {
                this.angle = 0;
                this.isAttacking = false;
            }
        });
    }
}