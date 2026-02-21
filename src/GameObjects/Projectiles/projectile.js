import Phaser from 'phaser';

export default class Projectile extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.speed    = config.speed  ?? 600;
        this.range    = config.range  ?? 800;
        this.damage   = config.damage ?? 10;
        this.distanceMoved = 0;

        const dir = config.direction ?? new Phaser.Math.Vector2(1, 0);
        this.speedX = dir.x * this.speed;
        this.speedY = dir.y * this.speed;

        // Para rotar el proyectil hacia donde apunta
        this.setRotation(Math.atan2(dir.y, dir.x));

        scene.events.on('update', this._update, this);
        this.once('destroy', () => scene.events.off('update', this._update, this));
    }

    _update(time, delta) {
        if (!this.active) return;

        const deltaS = delta / 1000;
        const dx = this.speedX * deltaS;
        const dy = this.speedY * deltaS;

        this.x += dx;
        this.y += dy;
        this.distanceMoved += Math.hypot(dx, dy);

        if (this.distanceMoved >= this.range) {
            this.destroy();
        }
    }
}