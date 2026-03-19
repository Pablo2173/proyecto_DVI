import Phaser from 'phaser';

export default class Projectile extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.speed    = config.speed  ?? 600;
        this.range    = config.range  ?? 800;
        this.damage   = config.damage ?? 10;
        this.distanceMoved = 0;
        this.owner = config.owner ?? null;
        this.team = config.team ?? (this.owner ? this.owner.team : 'neutral');

        const dir = config.direction ?? new Phaser.Math.Vector2(1, 0);
        this.speedX = dir.x * this.speed;
        this.speedY = dir.y * this.speed;

        // Para rotar el proyectil hacia donde apunta
        this.setRotation(Math.atan2(dir.y, dir.x));

        // ── FÍSICA ──
        if (scene.physics && scene.physics.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setAllowGravity(false);
                this.body.setImmovable(true);
                this.body.setVelocity(this.speedX, this.speedY);
                
                // Configurar tamaño de colisión basado en config
                if (config.collisionRadius) {
                    this.body.setCircle(config.collisionRadius);
                } else {
                    const collisionWidth = config.collisionWidth ?? 16;
                    const collisionHeight = config.collisionHeight ?? 16;
                    this.body.setSize(collisionWidth, collisionHeight);
                }
            }
        }

        // Agregar el proyectil al grupo de proyectiles de la escena
        if (scene.projectiles) {
            scene.projectiles.add(this);
        }

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