import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';
import InputManager from '../managers/InputManager.js';

// Importa las armas concretas
import Arco from './Weapons/Distance/arco.js';
import Mcuaktro from './Weapons/Distance/mcuaktro.js';
import Cuchillo from './Weapons/Melee/cuchillo.js';
import Mazo from './Weapons/Melee/mazo.js';
import Ramita from './Weapons/Melee/ramita.js';
import Escoba from './Weapons/Melee/escoba.js';


export const DUCK_STATE = Object.freeze({
    IDLE: 0,
    WALKING: 1,
    DASHING: 2,
    QUACKING: 3,
    SWIMMING: 4,
    INVISIBLE: 5
});

export default class Duck extends BaseCharacter {

    constructor(scene, x, y, weaponKey = 'arco', inputManager = null) {
        super(scene, x, y, 'idle_duck', 0, TEAM.ALLY);
        this.weaponMap = {
            arco: Arco,
            mcuaktro: Mcuaktro,
            cuchillo: Cuchillo,
            mazo: Mazo,
            ramita: Ramita,
            escoba: Escoba
        };

        this._speed = 320;
        this._maxSpeed = 550;
        this._acceleration = 5;
        this._currentSpeed = this._speed;
        this.dashSpeed = 3600;
        this.dashDuration = 100;
        this.dashCooldown = 1600;
        this.lastDashTime = 0;
        this.dashReadyFlashPlayed = true;
        this.isDashInvisible = false;
        this.state = DUCK_STATE.IDLE;
        this.invisibleUntil = 0;
        this.invisibleCooldownUntil = 0;
        this.invisibleAlpha = 0.45;
        this.facingX = 1;
        this.facingY = 0;
        this.scale = 3;

        // Multiplicadores para consumibles
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
        this.baseAttackBonusPercent = 0;
        this.weaponDurationBonusPercent = 0;

        // Inventario de consumibles
        this.consumables = [];

        // Estado de invisibilidad por máscara (independiente del sistema de dash invisible)
        this.isInvisible = false;

        // GESTIÓN PLUMAS / VIDA
        this.healthPerFeather = 50;

        // empieza con 5 plumas (sin máximo)
        this.feathers = 5;
        this.health = this.feathers * this.healthPerFeather;
        this.lastPuddle = null;      // checkpoint actual
        this.lastDeathPosition = null;
        this.isInvulnerable = false; // útil para evitar perder 20 plumas por un solo golpe

        // --- FÍSICA (top-down) ---
        if (scene.physics && scene.physics.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setCollideWorldBounds(true);
                this.body.setAllowGravity(false); // Sin gravedad porque estamos haciendo un top-down
                this.body.setImmovable(false);    // Basicamente lo pongo a false para que le puedan empujar

                this.body.setCircle(6, 6);
                this.body.setOffset(9, 13);
            }
        }

        // ── Equipo ──
        this.team = TEAM.ALLY;

        // ── Arma ──
        this.weapon = null;

        // Equipar arma inicial
        this.equipWeapon(weaponKey);

        // ── Input Manager (centralizado para teclado + gamepad) ──
        this.inputManager = inputManager || new InputManager(scene);

        this._createDashCooldownUI();
    }

    _createDashCooldownUI() {
        if (!this.scene?.add || !this.weaponBar?.border) return;

        this.dashChargeRing = this.scene.add.graphics().setDepth(21);
        this.dashRingRadius = 9;
        this.dashRingThickness = 4;
        this.dashRingGap = 8;
    }

    _updateDashCooldownUI() {
        if (!this.dashChargeRing || !this.weaponBar?.border) return;

        const border = this.weaponBar.border;
        const iconX = border.x - (border.displayWidth / 2) - this.dashRingRadius - this.dashRingGap;
        const iconY = border.y;

        this.dashChargeRing.clear();

        const now = this.scene?.time?.now ?? 0;
        const progress = Phaser.Math.Clamp((now - this.lastDashTime) / this.dashCooldown, 0, 1);
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * progress);

        this.dashChargeRing.lineStyle(this.dashRingThickness, 0x6ce6ff, 1);
        if (progress > 0) {
            this.dashChargeRing.beginPath();
            this.dashChargeRing.arc(iconX, iconY, this.dashRingRadius, startAngle, endAngle, false);
            this.dashChargeRing.strokePath();
        }

        if (progress >= 1 && !this.dashReadyFlashPlayed) {
            this.dashReadyFlashPlayed = true;
            this._flashDashReady();
        }
    }

    _flashDashReady() {
        if (!this.scene?.time || !this.active) return;

        this.setTint(0x4da6ff);
        this.scene.time.delayedCall(120, () => {
            if (!this.active) return;
            this.clearTint();
        });
    }

    _aimDashToDirection(dirX, dirY) {
        if (!Number.isFinite(dirX) || !Number.isFinite(dirY)) return;
        if (Math.abs(dirX) < 0.001 && Math.abs(dirY) < 0.001) return;

        const angle = Phaser.Math.Angle.Between(0, 0, dirX, dirY);

        // El spritesheet de dash tiene orientación base hacia la izquierda.
        this.setFlipX(false);
        this.setRotation(angle + Math.PI);
    }
    // ─────────────────────────────────────────
    //  GESTIÓN DE PlUMAS
    // ─────────────────────────────────────────
    addFeather(amount = 1) {
        const heal = amount * this.healthPerFeather;
        this.health += heal;
        this.updateFeathersFromHealth();
    }

    loseFeather(amount = 1) {
        const damage = amount * this.healthPerFeather;
        this.health = Math.max(0, this.health - damage);

        this.updateFeathersFromHealth();
    }

    setFeathers(amount) {
        this.feathers = Math.max(0, amount);
        this.health = this.feathers * this.healthPerFeather;

        if (this.scene?.featherUI) {
            this.scene.featherUI.refresh();
        }

        if (this.health <= 0) {
            this.defeat();
        }
    }

    hasFeathers(amount = 1) {
        const required = Math.max(0, Number(amount) || 0);
        return this.feathers >= required;
    }

    spendFeathers(amount = 1) {
        const required = Math.max(0, Math.floor(Number(amount) || 0));
        if (required <= 0) return true;
        if (!this.hasFeathers(required)) return false;

        this.setFeathers(this.feathers - required);
        return true;
    }

    applyMovementSpeedBonus(percent = 0.1) {
        const safePercent = Number(percent);
        if (!Number.isFinite(safePercent) || safePercent <= 0) return;

        this.speedMultiplier *= 1 + safePercent;
    }

    applyBaseAttackBonus(percent = 0.1) {
        const safePercent = Number(percent);
        if (!Number.isFinite(safePercent) || safePercent <= 0) return;

        this.baseAttackBonusPercent += safePercent;
    }

    applyWeaponDurationBonus(percent = 0.5) {
        const safePercent = Number(percent);
        if (!Number.isFinite(safePercent) || safePercent <= 0) return;

        this.weaponDurationBonusPercent += safePercent;
        this.weapon?.applyOwnerDurationBonus?.();
    }

    canTakeDamage() {
        return super.canTakeDamage() && !this.isInvulnerable && !this.scene?.isPlayerDead;
    }

    beforeTakeDamage() {
        this.isInvulnerable = true;
    }

    takeDamage(amount = 1) {
        super.takeDamage(50);
    }

    afterTakeDamage(amount, previousHealth, newHealth) {
        console.log(`Vida ahora: ${newHealth}`);

        this.updateFeathersFromHealth();

        // Si el pato ha muerto, NO reproducir damage_hit ni otros sonidos
        if (newHealth <= 0 || this.scene?.isPlayerDead || !this.scene?.time) {
            return;
        }

        if (!this._lastDamageSound || this.scene.time.now > this._lastDamageSound + 120) {
            this.scene.sound.play('damage_hit', {
                volume: 0.6,
                rate: Phaser.Math.FloatBetween(0.95, 1.05)
            });
            this._lastDamageSound = this.scene.time.now;
        }

        this.scene?.cameras?.main?.shake?.(120, 0.005);

        this.scene.time.delayedCall(1000, () => {
            if (this.active && !this.scene?.isPlayerDead) {
                this.isInvulnerable = false;
            }
        });
    }

    defeat() {
        if (this.scene?.isPlayerDead) return;

        this.clearTint();
        this.isInvulnerable = true;

        if (this.weapon?.releaseAttack) {
            this.weapon.releaseAttack();
        }

        if (this.body) {
            this.body.setVelocity(0, 0);
            this.body.enable = false;
        }

        this.setState(DUCK_STATE.IDLE);

        this.scene.handlePlayerDeath();
    }

    setCheckpoint(puddle) {
        this.lastPuddle = puddle;
    }

    updateFeathersFromHealth() {
        const newFeathers = Math.max(0, Math.ceil(this.health / this.healthPerFeather));

        if (newFeathers !== this.feathers) {
            this.feathers = newFeathers;
            console.log(`Plumas ahora: ${this.feathers}`);

            if (this.scene?.featherUI) {
                this.scene.featherUI.refresh();
            }
        }

        if (this.health <= 0) {
            this.feathers = 0;

            if (this.scene?.featherUI) {
                this.scene.featherUI.refresh();
            }

            this.defeat();
        }
    }
    // ─────────────────────────────────────────
    //  ESTADOS
    // ─────────────────────────────────────────

    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;

        switch (newState) {
            case DUCK_STATE.IDLE: this.play('duck-idle', true); break;
            case DUCK_STATE.WALKING: this.play('duck-walk', true); break;
            case DUCK_STATE.QUACKING: this.play('duck-cuack', true); break;
            case DUCK_STATE.DASHING: this.play('duck-dash', true); break;
            case DUCK_STATE.INVISIBLE: this.play('duck-idle', true); break;
            case DUCK_STATE.SWIMMING: this.play('duck-swimming', true); break;
        }
    }

    quack() {
        this.setState(DUCK_STATE.QUACKING);
        this.quackEndTime = this.scene.time.now + this.quackDuration;
        this.scene.sound?.play('cuack');
    }

    startDash() {
        if (this.state == DUCK_STATE.SWIMMING) return; // No se puede dashar nadando 
        const now = this.scene.time.now;
        if (now < this.lastDashTime + this.dashCooldown) return;
        this.lastDashTime = now;
        this.dashReadyFlashPlayed = false;
        this.isDashInvisible = true;
        this.setAlpha(this.invisibleAlpha);
        this.setState(DUCK_STATE.DASHING);

        this.scene.time.delayedCall(this.dashDuration, () => {
            if (this.state === DUCK_STATE.DASHING) {
                this.weapon?.onDash?.();

                this.isDashInvisible = false;

                // Restaurar alpha solo si no hay otra fuente de invisibilidad activa.
                if (!this.isInvisible && this.state !== DUCK_STATE.INVISIBLE && this.invisibleUntil <= this.scene.time.now) {
                    this.setAlpha(1);
                }

                if (this.state === DUCK_STATE.DASHING) {
                    this.setState(DUCK_STATE.IDLE);
                }
            }
        });
    }

    startInvisibleState(duration = 4000) {
        if (!this.scene?.time) return;

        const now = this.scene.time.now;
        if (!this.canStartInvisible(now)) return;

        this.invisibleUntil = Math.max(this.invisibleUntil, now + duration);
        this.invisibleCooldownUntil = 0;
        this.setState(DUCK_STATE.INVISIBLE);
        this.setAlpha(this.invisibleAlpha);
        this.weaponBar?.startCountdown(duration);
    }

    updateInvisibleState(time = this.scene?.time?.now ?? 0) {
        const knifeInvisibleActive = time < this.invisibleUntil;

        if (knifeInvisibleActive) {
            this.setAlpha(this.invisibleAlpha);
            return;
        }

        if (this.invisibleUntil <= 0) return;

        this.invisibleUntil = 0;
        this.invisibleCooldownUntil = time + 10000;
        if (!this.isInvisible && !this.isDashInvisible) {
            this.setAlpha(1);
        }
        if (this.state === DUCK_STATE.INVISIBLE) {
            this.setState(DUCK_STATE.IDLE);
        }
        this.weaponBar?.startRecharge(10000);
    }

    isInvisibleState() {
        const now = this.scene?.time?.now ?? 0;
        return now < this.invisibleUntil || this.state === DUCK_STATE.INVISIBLE || this.isInvisible === true || this.isDashInvisible === true;
    }

    canStartInvisible(time = this.scene?.time?.now ?? 0) {
        const invisibleActive = time < this.invisibleUntil;
        return !invisibleActive && this.state !== DUCK_STATE.INVISIBLE && time >= this.invisibleCooldownUntil;
    }

    // ─────────────────────────────────────────
    //  INVISIBILIDAD POR MÁSCARA
    // ─────────────────────────────────────────

    /**
     * Activa la invisibilidad temporal por consumo de máscara.
     * Dura exactamente 3 segundos. No se puede stackear.
     */
    activateInvisibility() {
        // No stackear invisibilidad si ya está activa
        if (this.isInvisible) {
            console.log('Invisibilidad ya activa, ignorando uso de máscara');
            return;
        }

        console.log('Máscara usada: player invisible durante 3 segundos');

        this.isInvisible = true;
        this.setAlpha(this.invisibleAlpha);

        // Usar temporizador de Phaser (NO setTimeout suelto)
        this.scene.time.delayedCall(3000, () => {
            this.isInvisible = false;
            // Restaurar alpha solo si no hay otro estado de invisibilidad activo
            if (this.state !== DUCK_STATE.INVISIBLE) {
                this.setAlpha(1);
            }
            console.log('Efecto de máscara terminado: player visible de nuevo');
        });
    }

    // ─────────────────────────────────────────
    //  PREUPDATE — movimiento + arma + detección drops
    // ─────────────────────────────────────────

    preUpdate(time, dt) {
        super.preUpdate(time, dt);

        if (!this.active) return;
        if (this.scene?.isPlayerDead) return;
        const delta = dt / 1000;

        // Actualizar InputManager si existe
        if (this.inputManager) {
            this.inputManager.update();
        }

        // Fin de quack
        if (this.state === DUCK_STATE.QUACKING && time >= this.quackEndTime) {
            this.setState(DUCK_STATE.IDLE);
        }

        // ── Detección de controles ──
        if (this.inputManager) {
            if (this.inputManager.isDashPressed()) {
                this.startDash();
            }
            if (this.inputManager.isQuackPressed()) {
                this.quack();
            }
        }

        // ── Movimiento ──
        const moveInput = this.inputManager ? this.inputManager.getMovementInput() : { x: 0, y: 0 };
        let vx = moveInput.x;
        let vy = moveInput.y;

        if (this.state !== DUCK_STATE.DASHING) {
            // El movimiento ya viene procesado desde InputManager
        } else {
            vx = 0;
            vy = 0;
        }

        const isDashing = this.state === DUCK_STATE.DASHING;
        let speed = (isDashing ? this.dashSpeed : this._currentSpeed) * this.speedMultiplier;

        let moveDirX = vx;
        let moveDirY = vy;

        if (isDashing && moveDirX === 0 && moveDirY === 0) {
            moveDirX = this.facingX;
            moveDirY = this.facingY;
        }

        const isMoving = moveDirX !== 0 || moveDirY !== 0;

        if (isMoving) {
            if (!isDashing) {
                this._currentSpeed = Math.min(this._maxSpeed, this._currentSpeed + this._acceleration);
                speed = this._currentSpeed * this.speedMultiplier;
            }

            const len = Math.hypot(moveDirX, moveDirY) || 1;
            const velX = (moveDirX / len) * speed;
            const velY = (moveDirY / len) * speed;

            if (this.body) {
                this.body.setVelocity(velX, velY);
            } else {
                this.x += velX * delta;
                this.y += velY * delta;
            }

            if (!isDashing && (vx !== 0 || vy !== 0)) {
                this.facingX = vx;
                this.facingY = vy;
                if (this.state !== DUCK_STATE.INVISIBLE && this.state !== DUCK_STATE.SWIMMING) {
                    this.setState(DUCK_STATE.WALKING);
                }
            }
        } else {
            if (!isDashing) {
                this._currentSpeed = this._speed;
            }

            if (this.body) {
                this.body.setVelocity(0, 0);
            }
            if (this.state !== DUCK_STATE.QUACKING && this.state !== DUCK_STATE.SWIMMING && this.state !== DUCK_STATE.INVISIBLE) {
                this.setState(DUCK_STATE.IDLE);
            }
        }

        if (this.state === DUCK_STATE.INVISIBLE) {
            if (isMoving) {
                this.play('duck-walk', true);
            } else {
                this.play('duck-idle', true);
            }
        }

        // Orientación del pato
        if (isDashing) {
            this._aimDashToDirection(moveDirX, moveDirY);
        } else {
            this.setRotation(0);
            if (vx > 0) this.setFlipX(true);
            if (vx < 0) this.setFlipX(false);
        }

        // ── Actualizar arma (posición + rotación + debug) ──
        if (this.weapon) {
            this.weapon.update();
        }

        this.updateInvisibleState(time);
        this.weaponBar?.update();
        this._updateDashCooldownUI();

        // ── Detección de drops cercanos (tecla E o botón A) ──
        this._checkDropPickup();

        this.weaponBar.updatePosition()
    }

    destroy(fromScene) {
        if (this.dashChargeRing) {
            this.dashChargeRing.destroy();
            this.dashChargeRing = null;
        }

        super.destroy(fromScene);
    }

    /**
     * Comprueba si hay drops cercanos.
     * Las armas se recogen con E; los consumibles se recogen automáticamente al acercarse.
     */
    _checkDropPickup() {
        // Revisar drops de armas
        if (this.scene.dropItems && this.inputManager && this.inputManager.isInteractPressed()) {
            const drops = this.scene.dropItems.getChildren();
            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                if (!drop.active) continue;

                const interactionRadius = drop.interactionRadius ?? 40;

                if (drop.isNear(this, interactionRadius)) {
                    drop.interact(this);
                    return; // solo un item por pulsación
                }
            }
        }

        // Revisar consumables
        if (this.scene.consumableItems) {
            const consumables = this.scene.consumableItems.getChildren();
            for (let i = 0; i < consumables.length; i++) {
                const consumable = consumables[i];
                if (!consumable.active) continue;

                // Los consumibles se recogen automáticamente al pasar cerca
                if (consumable.isNear(this, 40)) {
                    consumable.interact(this);
                    return;
                }
            }
        }
    }
}