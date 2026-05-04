import Enemy from "../enemy";

export default class Car extends Enemy {

    static BASE_STATS = {
        visionRadius: 0,
        hp: 40,
        speed: 2000
    };

    constructor(scene, name, x, y, texture = 'coche_enemy', frame = null) {
        const stats = Car.BASE_STATS;
        // No arma, movimiento simple
        super(scene, name, x, y, texture, frame, stats.visionRadius, stats.hp, stats.speed, null, null, false, ['right']);

        this.setScale(4.0);

        // Tamaño del cuerpo y físicas
        if (this.body) {
            this.body.setAllowGravity(false);
            this.body.setImmovable(false);
            this.body.setCollideWorldBounds(true);
            try {
                // Ajuste de hitbox algo más grande para el coche
                this.body.setSize(40, 26);
                this.body.setOffset(2, 6);
            } catch (e) {
                // algunos cuerpos pueden no soportar setSize si no existen; ignorar
            }
        }

        // Daño fuerte
        this.damageToPlayer = 5; // número de plumas a quitar (cada pluma = 50 de vida)
        this.damageToEnemy  = 200; // daño directo a enemigos (_hp)

        // Cooldown para evitar daño repetido por overlap continuo (ms)
        this._hitCooldownMs = 300;
        this._lastHitAt = 0;

        // Empieza moviéndose a la derecha
        if (this.body) this.body.setVelocity(this._speed, 0);

        // Overlaps específicos: dañar al jugador y a otros enemigos
        if (scene && scene.physics) {
            // Asegurarse de que duck exista en la escena
            if (scene.duck) {
                scene.physics.add.overlap(this, scene.duck, (_car, duck) => {
                    this._onHitDuck(duck);
                });
            }

            // Dañar a otros enemigos (excluye a sí mismo)
            if (scene.enemies) {
                scene.physics.add.overlap(this, scene.enemies, (carObj, otherEnemy) => {
                    if (!otherEnemy || otherEnemy === this) return;
                    this._onHitEnemy(otherEnemy);
                });
            }

            // Colisión con capas del mapa (si choca, se destruye)
            if (scene.colisionLayer) {
                scene.physics.add.collider(this, scene.colisionLayer, () => {
                    this._onHitWorld();
                });
            }
        }
    }

    preUpdate(time, delta) {
        // Mantener velocidad hacia la derecha
        if (this.body && !this.isDead()) {
            // Si por alguna razón la velocidad se modificó, restaurarla
            if (Math.abs(this.body.velocity.x) < 1) this.body.setVelocity(this._speed, 0);
            // Orientación visual
            this.setFlipX(true);
        }

        if (super.preUpdate) super.preUpdate(time, delta);
    }

    _canApplyHit() {
        const now = this.scene?.time?.now ?? Date.now();
        if (now < this._lastHitAt + this._hitCooldownMs) return false;
        this._lastHitAt = now;
        return true;
    }

    _onHitDuck(duck) {
        if (!duck || !duck.active) return;
        if (!this._canApplyHit()) return;

        // Quitar varias plumas (daño fuerte)
        if (typeof duck.loseFeather === 'function') {
            duck.loseFeather(this.damageToPlayer);
        } else if (typeof duck.takeDamage === 'function') {
            // Fallback: llamar varias veces a takeDamage
            const hits = Math.max(1, Math.floor((this.damageToPlayer * (duck.healthPerFeather||50)) / 50));
            for (let i = 0; i < hits; i++) duck.takeDamage();
        }

        // Opcional: efecto visual/sonoro
        if (this.scene?.cameras?.main) this.scene.cameras.main.shake(120, 0.01);
    }

    _onHitEnemy(enemy) {
        if (!enemy || !enemy.active) return;
        if (enemy === this) return;
        if (!this._canApplyHit()) return;

        if (typeof enemy.takeDamage === 'function') {
            enemy.takeDamage(this.damageToEnemy);
        }
    }

    _onHitWorld() {
        // Si choca con el mundo, explota y se destruye
        this._explodeAndDestroy();
    }

    _explodeAndDestroy() {
        if (!this.scene) return;

        // Reproducir sonido si existe
        try { this.scene.sound?.play?.('heavy_hit', { volume: 0.7 }); } catch (e) {}

        // Pequeña explosión visual: crear un sprite de impacto si existe la textura
        if (this.scene.add && this.scene.textures.exists('impact')) {
            const fx = this.scene.add.sprite(this.x, this.y, 'impact').setScale(2);
            if (fx.anims && this.scene.anims.exists('impact_anim')) fx.play('impact_anim');
            this.scene.time.delayedCall(400, () => fx.destroy());
        }

        // Destruir objeto
        this.destroy();
    }

}
