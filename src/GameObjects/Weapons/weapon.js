import Phaser from 'phaser';

export default class Weapon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        if (new.target === Weapon) {
            throw new Error('Weapon es una clase abstracta y no puede instanciarse directamente.');
        }

        super(scene, x, y, texture);
        scene.add.existing(this);

        this.scene = scene;
        this.damage      = config.damage      ?? 10;
        this.attackSpeed = config.attackSpeed ?? 500; // ms entre ataques
        this.cooldown    = config.cooldown    ?? this.attackSpeed;
        this.lastAttackTime = 0;

        this.facing = 'right';
        this.isAttacking = false;

        if (config.scale)  this.setScale(config.scale);
        if (config.origin) this.setOrigin(config.origin.x, config.origin.y);
    }

    canAttack() {
        const now = this.scene.time.now;
        return now - this.lastAttackTime >= this.attackSpeed;
    }

    attack() {
        throw new Error(`${this.constructor.name} debe implementar el método attack().`);
    }

    static preload(scene) {}
}