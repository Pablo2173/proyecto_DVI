import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';

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
    SWIMMING: 4
});

export default class Duck extends BaseCharacter {

    constructor(scene, x, y, weaponKey = 'arco') {
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
        this._maxSpeed = 360;
        this.dashSpeed = 600;
        this.dashDuration = 200;
        this.lastDashTime = 0;
        this.state = DUCK_STATE.IDLE;
        this.facingX = 1;
        this.facingY = 0;
        this.scale = 3;

        // Multiplicadores para consumibles
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;

        // Inventario de consumibles
        this.consumables = [];

        // GESTIÓN PLUMAS / VIDA
        this.maxFeathers = 10;
        this.healthPerFeather = 50;

        this.maxHealth = this.maxFeathers * this.healthPerFeather;

        // empieza con 5 plumas
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

        // ── Input ──
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyW = scene.input.keyboard.addKey('W');
        this.keyA = scene.input.keyboard.addKey('A');
        this.keyS = scene.input.keyboard.addKey('S');
        this.keyD = scene.input.keyboard.addKey('D');
        this.keySpace = scene.input.keyboard.addKey('SPACE');
        this.keyC = scene.input.keyboard.addKey('C');
        this.keyE = scene.input.keyboard.addKey('E');

        this.quackDuration = 600;
        this.quackEndTime = 0;

        this.keySpace.on('down', () => this.startDash());
        this.keyC.on('down', () => this.quack());

        // ── Equipar arma inicial ──
        this.equipWeapon(weaponKey);
    }
    // ─────────────────────────────────────────
    //  GESTIÓN DE PlUMAS
    // ─────────────────────────────────────────
    addFeather(amount = 1) {
        const heal = amount * this.healthPerFeather;
        this.health = Phaser.Math.Clamp(this.health + heal, 0, this.maxHealth);
        this.updateFeathersFromHealth();
    }

    loseFeather(amount = 1) {
        const damage = amount * this.healthPerFeather;
        this.health = Math.max(0, this.health - damage);

        this.updateFeathersFromHealth();
    }

    setFeathers(amount) {
        this.feathers = Phaser.Math.Clamp(amount, 0, this.maxFeathers);
        this.health = this.feathers * this.healthPerFeather;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        if (this.scene?.featherUI) {
            this.scene.featherUI.refresh();
        }

        if (this.health <= 0) {
            this.defeat();
        }
    }

    canTakeDamage() {
        return super.canTakeDamage() && !this.isInvulnerable && !this.scene?.isPlayerDead;
    }

    beforeTakeDamage() {
        this.isInvulnerable = true;
    }

    afterTakeDamage(amount, previousHealth, newHealth) {
        console.log(`Vida ahora: ${newHealth}`);

        this.updateFeathersFromHealth();

        if (newHealth <= 0 || this.scene?.isPlayerDead || !this.scene?.time) {
            return;
        }

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
            case DUCK_STATE.SWIMMING: this.play('duck-idle', true); break;
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
        if (now < this.lastDashTime + 800) return;
        this.lastDashTime = now;
        this.setState(DUCK_STATE.DASHING);

        this.scene.time.delayedCall(this.dashDuration, () => {
            if (this.state === DUCK_STATE.DASHING) this.setState(DUCK_STATE.IDLE);
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

        // Fin de quack
        if (this.state === DUCK_STATE.QUACKING && time >= this.quackEndTime) {
            this.setState(DUCK_STATE.IDLE);
        }

        // ── Movimiento ──
        let vx = 0, vy = 0;

        if (this.state !== DUCK_STATE.DASHING) {
            if (this.cursors.left.isDown || this.keyA.isDown) vx -= 1;
            if (this.cursors.right.isDown || this.keyD.isDown) vx += 1;
            if (this.cursors.up.isDown || this.keyW.isDown) vy -= 1;
            if (this.cursors.down.isDown || this.keyS.isDown) vy += 1;
        }

        const isDashing = this.state === DUCK_STATE.DASHING;
        const speed = (isDashing ? this.dashSpeed : this._speed) * this.speedMultiplier;

        let moveDirX = vx;
        let moveDirY = vy;

        if (isDashing && moveDirX === 0 && moveDirY === 0) {
            moveDirX = this.facingX;
            moveDirY = this.facingY;
        }

        const isMoving = moveDirX !== 0 || moveDirY !== 0;

        if (isMoving) {
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
                if (this.state !== DUCK_STATE.SWIMMING) this.setState(DUCK_STATE.WALKING);
            }
        } else {
            if (this.body) {
                this.body.setVelocity(0, 0);
            }
            if (this.state !== DUCK_STATE.QUACKING && this.state !== DUCK_STATE.SWIMMING) {
                this.setState(DUCK_STATE.IDLE);
            }
        }

        // Flip del sprite del pato
        if (vx > 0) this.setFlipX(true);
        if (vx < 0) this.setFlipX(false);

        // ── Actualizar arma (posición + rotación + debug) ──
        if (this.weapon) {
            this.weapon.update();
        }

        // ── Detección de drops cercanos (tecla E) ──
        this._checkDropPickup();

        this.weaponBar.updatePosition()
    }

    /**
     * Comprueba si hay drops o consumables cerca y el jugador pulsa E.
     * Usa checkDown con cooldown de 250ms para evitar recogidas múltiples.
     */
    _checkDropPickup() {
        // Revisar drops de armas
        if (this.scene.dropItems) {
            const drops = this.scene.dropItems.getChildren();
            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                if (!drop.active) continue;

                if (drop.isNear(this, 40) &&
                    this.scene.input.keyboard.checkDown(this.keyE, 250)) {
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

                // Si es una pluma, recoger automáticamente al pasar cerca
                if (consumable.constructor.name === 'DropFeather' && consumable.isNear(this, 40)) {
                    consumable.interact(this);
                    return;
                }

                // Otros consumibles requieren pulsar E
                if (consumable.isNear(this, 40) &&
                    this.scene.input.keyboard.checkDown(this.keyE, 250)) {
                    consumable.interact(this);
                    return; // solo un item por pulsación
                }
            }
        }
    }
}