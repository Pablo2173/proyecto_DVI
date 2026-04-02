import Weapon from '../weapon.js';
import Flecha from '../../Projectiles/flecha.js';
import arcoSprite from '../../../../assets/sprites/Weapons/arco.png';
// Cuando existan los sprites de carga, importarlos aquí:
// import arcoCarga1Sprite from '../../../../assets/sprites/Weapons/arco_carga_1.png';
// import arcoCarga2Sprite from '../../../../assets/sprites/Weapons/arco_carga_2.png';

export default class Arco extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture:         'arco',
            isRanged:        true,
            projectileClass: Flecha,

            projectileSpeed: 400,
            damage:          20,
            attackSpeed:     500,    // para jugador, la carga controla el ritmo
            range:           800,

            optimalDistance: 280,
            scale:           1,
            spriteAngleOffset: 0,
            debug:           true,
            bar:             bar
        });

        // ── Carga ──
        this.maxRange = this.range;          // rango máximo al 100% de carga
        this.minRangeRatio = 0.4;            // 40% del rango máximo como mínimo
        this.chargeTime = 1500;              // ms para carga completa
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.chargePercent = 0;
        this._piercing = false;              // se activa al 100% de carga

        if (this.isEnemy) {
            // Enemigo: rango fijo alto y disparo cada 1 segundo, sin carga.
            this.attackSpeed = 1000;
            this.range = this.maxRange * 0.85;
        } else {
            this.range = this.maxRange * this.minRangeRatio;
        }
    }

    static preload(scene) {
        scene.load.image('arco', arcoSprite);
        // Cuando existan los sprites de carga, cargarlos aquí:
        // scene.load.image('arco_carga_1', arcoCarga1Sprite);
        // scene.load.image('arco_carga_2', arcoCarga2Sprite);
    }

    // ── Equip: barra vacía (representa la carga) ──
    on_equip() {
        if (this.bar) this.bar.setEmpty();
    }

    // ── Se llama al pulsar click (pointerdown / hold) ──
    attack() {
        // Los enemigos disparan normal, sin carga
        if (this.isEnemy) { super.attack(); return; }

        // Iniciar carga si no está cargando
        if (!this.isCharging) {
            this.isCharging = true;
            this.chargeStartTime = this.scene.time.now;
            this.chargePercent = 0;
            if (this.bar) { this.bar.setEmpty(); this.bar.updateFill(); }
            // Cambiar al sprite de carga fase 1 cuando exista:
            // this.setTexture('arco_carga_1');
        }
    }

    // ── Se llama al soltar click (pointerup) ──
    releaseAttack() {
        if (!this.isCharging) return;
        this.isCharging = false;

        // Siempre dispara al soltar, el rango escala con la carga
        const chargeRatio = this.chargePercent / 100;
        this._piercing = (this.chargePercent >= 100);
        this.lastAttackTime = this.scene.time.now;
        this._fireChargedProjectile(chargeRatio);
        this._piercing = false;

        // Resetear barra, rango visual y sprite
        this.chargePercent = 0;
        this.range = this.maxRange * this.minRangeRatio;
        if (this.bar) { this.bar.setEmpty(); this.bar.updateFill(); }
        // Volver al sprite normal cuando existan los de carga:
        // this.setTexture('arco');
    }

    // ── Update: actualizar carga mientras se mantiene pulsado ──
    update() {
        super.update();

        if (this.isCharging && !this.isEnemy) {
            const elapsed = this.scene.time.now - this.chargeStartTime;
            this.chargePercent = Math.min(100, (elapsed / this.chargeTime) * 100);

            // Actualizar rango visual según carga (mínimo 20%)
            const ratio = Math.max(this.minRangeRatio, this.chargePercent / 100);
            this.range = this.maxRange * ratio;

            // Actualizar barra de carga
            if (this.bar) {
                this.bar.currentCharge = this.chargePercent;
                this.bar.updateFill();
            }

            // Cambiar sprite según nivel de carga (comentado hasta tener sprites):
            // if (this.chargePercent >= 80) {
            //     this.setTexture('arco_carga_2');
            // } else {
            //     this.setTexture('arco_carga_1');
            // }
        }
    }

    // ── Disparo con rango proporcional a la carga y posible perforación ──
    _fireChargedProjectile(chargeRatio) {
        if (!this.projectileClass) return;

        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            this.owner.x, this.owner.y,
            pointer.worldX, pointer.worldY
        );

        const direction = new Phaser.Math.Vector2(
            Math.cos(angle), Math.sin(angle)
        );

        const length = this.displayWidth;
        const spawnX = this.owner.x + Math.cos(angle) * length;
        const spawnY = this.owner.y + Math.sin(angle) * length;

        // Descontar la distancia de spawn para que la flecha desaparezca al borde del rango
        const effectiveRange = this.maxRange * Math.max(this.minRangeRatio, chargeRatio) - length;

        new this.projectileClass(this.scene, spawnX, spawnY, {
            direction,
            speed: this.projectileSpeed,
            range: Math.max(0, effectiveRange),
            damage: this.damage,
            piercing: this._piercing
        });
    }

    // La barra solo representa carga, no bloquea el disparo
    barCanShoot() { return true; }

    // No recargar automáticamente
    on_wait() { }
    on_shoot() { }
}