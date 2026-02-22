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
        this.attackSpeed = config.attackSpeed ?? 500;
        this.cooldown    = config.cooldown    ?? this.attackSpeed;
        this.lastAttackTime = 0;

        this.facing = 'right';
        this.isAttacking = false;

        // ── NUEVO: radios de combate ──
        this.range           = config.range           ?? 800;
        this.optimalDistance = config.optimalDistance ?? this.range * 0.7;
        this.debugMode       = config.debug           ?? false;

        // ── NUEVO: graphics para debug ──
        this.debugGraphics = scene.add.graphics();
        this.debugGraphics.setDepth(9999);

        if (config.scale)  this.setScale(config.scale);
        if (config.origin) this.setOrigin(config.origin.x, config.origin.y);
    }

    // ── NUEVO: dibuja los dos círculos centrados en el owner o en el arma ──
    _drawDebugCircles() {
        this.debugGraphics.clear();

        const centerX = this.owner ? this.owner.x : this.x;
        const centerY = this.owner ? this.owner.y : this.y;

        // Círculo exterior → range
        this.debugGraphics.lineStyle(2, 0xff0000, 0.4);
        this.debugGraphics.strokeCircle(centerX, centerY, this.range);

        // Círculo interior → optimalDistance
        this.debugGraphics.lineStyle(2, 0x00ff00, 0.4);
        this.debugGraphics.strokeCircle(centerX, centerY, this.optimalDistance);
    }

    // ── NUEVO: update base que las subclases pueden extender con super.update() ──
    update() {
        if (this.debugMode) {
            this._drawDebugCircles();
        } else {
            this.debugGraphics.clear();
        }
    }

    canAttack() {
        const now = this.scene.time.now;
        return now - this.lastAttackTime >= this.attackSpeed;
    }

    attack() {
        throw new Error(`${this.constructor.name} debe implementar el método attack().`);
    }

    // ── NUEVO: destruir graphics al destruir el arma ──
    destroy(fromScene) {
        if (this.debugGraphics) {
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }
        super.destroy(fromScene);
    }

    static preload(scene) {}
}