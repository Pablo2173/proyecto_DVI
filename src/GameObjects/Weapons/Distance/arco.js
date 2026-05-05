import Weapon from '../weapon.js';
import Flecha from '../../Projectiles/flecha.js';
import arcoSprite from '../../../../assets/sprites/Weapons/arco.png';
import arcoRelajadoSprite from '../../../../assets/sprites/Weapons/arco_realajado.png';
// Cuando existan los sprites de carga, importarlos aquí:
// import arcoCarga1Sprite from '../../../../assets/sprites/Weapons/arco_carga_1.png';
// import arcoCarga2Sprite from '../../../../assets/sprites/Weapons/arco_carga_2.png';

export default class Arco extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture:         'arco_relajado',
            isRanged:        true,
            projectileClass: Flecha,

            projectileSpeed: 800,
            damage:          30,
            attackSpeed:     500,    // para jugador, la carga controla el ritmo
            durability:      8,
            range:           800,

            optimalDistance: 280,
            scale:           1.5,
            spriteAngleOffset: 0,
            debug:           false,
            bar:             bar
        });

        // ── Carga ──
        this.maxRange = this.range;          // rango máximo al 100% de carga
        this.minRangeRatio = 0.4;            // 40% del rango máximo como mínimo
        this.chargeTime = 1500;              // ms para carga completa
        this.chargeCurvePower = 2.2;         // >1: más difícil llenar cerca del 100%
        this.maxChargeHoldTime = 5000;       // ms permitidos al 100% de carga
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.chargePercent = 0;
        this._piercing = false;              // se activa al 100% de carga
        this.maxChargeReachedAt = null;
        this.blockChargeUntilLeftRelease = false;

        if (this.isEnemy) {
            // Enemigo: rango fijo alto y disparo cada 1 segundo, sin carga.
            this.attackSpeed = 1000;
            this.range = this.maxRange * 0.85;
        } else {
            this.range = this.maxRange * this.minRangeRatio;
        }

        this._syncWearBar();
    }

    static preload(scene) {
        scene.load.image('arco_relajado', arcoRelajadoSprite);
        scene.load.image('arco', arcoSprite);
        // Cuando existan los sprites de carga, cargarlos aquí:
        // scene.load.image('arco_carga_1', arcoCarga1Sprite);
        // scene.load.image('arco_carga_2', arcoCarga2Sprite);
    }

    // ── Equip: barra vacía (representa la carga) ──
    on_equip() {
        this.setTexture('arco_relajado');
        this._syncWearBar();
    }

    // ── Se llama al pulsar click (pointerdown / hold) ──
    attack() {
        // Los enemigos disparan normal, sin carga
        if (this.isEnemy) { super.attack(); return; }

        const pointer = this.scene?.input?.activePointer;
        if (this.blockChargeUntilLeftRelease) {
            if (pointer?.leftButtonDown?.()) return;
            this.blockChargeUntilLeftRelease = false;
        }

        // Iniciar carga si no está cargando
        if (!this.isCharging) {
            this.isCharging = true;
            this.setTexture('arco');
            this.chargeStartTime = this.scene.time.now;
            this.chargePercent = 0;
            this.maxChargeReachedAt = null;
            this._setBarCharge(0);
            // Cambiar al sprite de carga fase 1 cuando exista:
            // this.setTexture('arco_carga_1');
        }
    }

    // ── Se llama al soltar click (pointerup) ──
    releaseAttack() {
        if (!this.isCharging) return;
        this.isCharging = false;
        this.maxChargeReachedAt = null;

        this.scene.sound.play('disparo_arco', {
            volume: 0.5,
            rate: Phaser.Math.FloatBetween(0.92, 1.08)
        });

        // Siempre dispara al soltar, el rango escala con la carga
        const chargeRatio = this.chargePercent / 100;
        this._piercing = (this.chargePercent >= 100);
        this.lastAttackTime = this.scene.time.now;
        this._fireChargedProjectile(chargeRatio);
        this._piercing = false;

        // Resetear barra, rango visual y sprite
        this.chargePercent = 0;
        this.range = this.maxRange * this.minRangeRatio;
        this.setTexture('arco_relajado');
        this.on_shoot();
        // Volver al sprite normal cuando existan los de carga:
        // this.setTexture('arco');
    }

    _cancelChargeAndLockUntilLeftRelease() {
        if (!this.isCharging) return;

        this.isCharging = false;
        this.chargePercent = 0;
        this.range = this.maxRange * this.minRangeRatio;
        this._piercing = false;
        this.maxChargeReachedAt = null;
        this.setTexture('arco_relajado');

        this._syncWearBar();

        if (this.scene?.input?.activePointer?.leftButtonDown?.()) {
            this.blockChargeUntilLeftRelease = true;
        }
    }

    _applyFullChargeShake() {
        if (this.maxChargeReachedAt === null) return;

        const now = this.scene.time.now;
        const holdMs = Math.max(0, now - this.maxChargeReachedAt);

        // Intensidad progresiva: arranca sutil y crece hasta el límite de cancelación.
        const t = Math.min(1, holdMs / this.maxChargeHoldTime);
        const growth = t * t;

        const posAmp = 0.18 + (2.4 * growth);
        const rotAmpDeg = 0.25 + (4.5 * growth);
        const wave = now * (0.04 + 0.08 * growth);

        const jitterX = Math.sin(wave * 1.4) * posAmp + (Math.random() - 0.5) * posAmp * 0.6;
        const jitterY = Math.cos(wave * 1.8) * posAmp + (Math.random() - 0.5) * posAmp * 0.6;
        const jitterAngle = Math.sin(wave * 2.1) * rotAmpDeg + (Math.random() - 0.5) * rotAmpDeg * 0.35;

        this.x += jitterX;
        this.y += jitterY;
        this.setAngle(this.angle + jitterAngle);
    }

    // ── Update: actualizar carga mientras se mantiene pulsado ──
    update() {
        super.update();

        if (this.blockChargeUntilLeftRelease && !this.scene?.input?.activePointer?.leftButtonDown?.()) {
            this.blockChargeUntilLeftRelease = false;
        }

        if (this.isCharging && !this.isEnemy) {
            this.setTexture('arco');
            const elapsed = this.scene.time.now - this.chargeStartTime;
            const linearProgress = Phaser.Math.Clamp(elapsed / this.chargeTime, 0, 1);
            const easedProgress = 1 - Math.pow(1 - linearProgress, this.chargeCurvePower);
            this.chargePercent = easedProgress * 100;

            if (this.chargePercent >= 100) {
                if (this.maxChargeReachedAt === null) {
                    this.maxChargeReachedAt = this.scene.time.now;
                } else if ((this.scene.time.now - this.maxChargeReachedAt) >= this.maxChargeHoldTime) {
                    this._cancelChargeAndLockUntilLeftRelease();
                    return;
                }

                this._applyFullChargeShake();
            } else {
                this.maxChargeReachedAt = null;
            }

            // Actualizar rango visual según carga (mínimo 20%)
            const ratio = Math.max(this.minRangeRatio, this.chargePercent / 100);
            this.range = this.maxRange * ratio;

            // Actualizar barra de carga
            this._setBarCharge(this.chargePercent);

            // Cambiar sprite según nivel de carga (comentado hasta tener sprites):
            // if (this.chargePercent >= 80) {
            //     this.setTexture('arco_carga_2');
            // } else {
            //     this.setTexture('arco_carga_1');
            // }
        } else if (!this.isEnemy) {
            this.setTexture('arco_relajado');
        }
    }

    // ── Disparo con rango proporcional a la carga y posible perforación ──
    _fireChargedProjectile(chargeRatio) {
        if (!this.projectileClass) return;

        const effectiveCharge = Phaser.Math.Clamp(
            Math.max(this.minRangeRatio, chargeRatio),
            0,
            1
        );
        const durabilityRatio = this._getDurabilityRatio();
        const visualChargeRatio = Phaser.Math.Clamp(chargeRatio * durabilityRatio, 0, 1);

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
        const effectiveRange = this.maxRange * effectiveCharge - length;
        const chargedDamage = this.getDamage() * chargeRatio;

        new this.projectileClass(this.scene, spawnX, spawnY, {
            direction,
            speed: this.projectileSpeed,
            range: Math.max(0, effectiveRange),
            damage: chargedDamage,
            piercing: this._piercing
        });
    }

    // La barra solo representa carga, no bloquea el disparo
    barCanShoot() { return true; }

    // No recargar automáticamente
    on_wait() { }
    on_shoot() {
        if (this.isEnemy) {
            this.scene.sound.play("disparo_arco", { volume: 1.5 });
        }
        this.consumeDurability(1);
        this._syncWearBar();
    }

    _getDurabilityRatio() {
        if (typeof this.maxDurability !== 'number' || this.maxDurability <= 0) return 1;
        if (typeof this.durability !== 'number') return 1;
        return Phaser.Math.Clamp(this.durability / this.maxDurability, 0, 1);
    }

    _setBarCharge(chargePercent) {
        if (!this.bar) return;

        const durabilityRatio = this._getDurabilityRatio();
        this.bar.currentCharge = Phaser.Math.Clamp(chargePercent * durabilityRatio, 0, 100);
        this.bar.updateFill();
    }

    _syncWearBar() {
        if (!this.bar) return;

        this.bar.currentCharge = this._getDurabilityRatio() * 100;
        this.bar.updateFill();
    }
}