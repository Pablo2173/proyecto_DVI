import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';

// ─────────────────────────────────────────
//  ESTADOS
// ─────────────────────────────────────────
const CrocoState = Object.freeze({
    IDLE:     'idle',
    WALKING:  'walking',
    SWIMMING: 'swimming',
    ALERTED:  'alerted',
    SEARCH:   'search',
    DEAD:     'dead'
});

export default class Crocodile extends BaseCharacter {

    // ─────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────
    constructor(scene, name, x, y, texture, frame = null) {
        super(scene, x, y, texture ?? 'croco_idle', frame, TEAM.ENEMY);

        // ── Identidad ──
        this._nombre = name;
        this.team    = TEAM.ENEMY;
        this.weapon  = null; // El cocodrilo no usa armas

        // ── Stats ──
        this.health  = 120;
        this._speed  = (scene.duck?._speed ?? 320) + 30; // ligeramente más rápido que el duck
        this.damage  = 2;

        // ── Radios ──
        this.attackRadius = 200;
        this.alertRadius  = 400;

        // ── FSM ──
        this.states       = CrocoState;
        this.currentState = this.states.IDLE;

        // ── Ataque ──
        this.isAttacking    = false;
        this.attackCooldown = 2000;
        this.lastAttackTime = 0;

        // ── Búsqueda ──
        this.searchTimer   = 0;
        this._lastKnownX   = null;
        this._lastKnownY   = null;

        // ── Física ──
        if (scene.physics?.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setCollideWorldBounds(true);
                this.body.setAllowGravity(false);
                this.body.setImmovable(false);
                this.body.setSize(28, 28);
                this.body.setOffset(2, 2);
            }
        }

        // ── Sprite inicial ──
        this.setTexture('croco_idle');
        this.setScale(3);
        this.setDepth(10);
    }

    // ─────────────────────────────────────────
    //  HELPERS DE ESTADO
    // ─────────────────────────────────────────

    _transitionTo(newState) {
        if (this.currentState === newState) return;
        this.currentState = newState;
        this._onEnterState(newState);
    }

    _onEnterState(state) {
        switch (state) {
            case this.states.IDLE:
                this.setTexture('croco_idle');
                this.body?.setVelocity(0, 0);
                break;

            case this.states.WALKING:
                this.setTexture('croco_idle');
                break;

            case this.states.SWIMMING:
                this.setTexture('croco_submerge');
                break;

            case this.states.ALERTED:
                // Sin cambio de sprite al alertarse; walking/swimming lo manejan
                break;

            case this.states.SEARCH:
                // Mantiene el último sprite de movimiento
                break;

            case this.states.DEAD:
                this._handleDeath();
                break;
        }
    }

    // ─────────────────────────────────────────
    //  DETECCIÓN DE AGUA
    // ─────────────────────────────────────────

    _isInWater() {
        const layer = this.scene?.zonasAcuaticasLayer;
        if (!layer) return false;

        const tileSize = 16 * 4; // tileWidth * SCALE
        const tileX    = Math.floor(this.x / tileSize);
        const tileY    = Math.floor(this.y / tileSize);

        return !!layer.getTileAt(tileX, tileY);
    }

    _updateTerrainState() {
        if (this.currentState === this.states.DEAD) return;

        const inWater = this._isInWater();

        if (inWater && this.currentState !== this.states.SWIMMING) {
            const wasAlerted = this.currentState === this.states.ALERTED || this.currentState === this.states.SEARCH;
            this._transitionTo(this.states.SWIMMING);
            // Conservar persecución si estaba alerted
            if (wasAlerted) this.currentState = this.states.SWIMMING;
        } else if (!inWater && this.currentState === this.states.SWIMMING) {
            this._transitionTo(this.states.WALKING);
        }
    }

    // ─────────────────────────────────────────
    //  MANEJADORES DE ESTADO
    // ─────────────────────────────────────────

    _handleIdle(distance) {
        this.body?.setVelocity(0, 0);
        this.setTexture('croco_idle');

        if (distance <= this.alertRadius) {
            this._transitionTo(this.states.ALERTED);
        }
    }

    _handleAlerted(player, distance, now) {
        // Actualizar memoria de posición del jugador
        this._lastKnownX = player.x;
        this._lastKnownY = player.y;

        // Atacar si está en rango y el cooldown lo permite
        if (distance <= this.attackRadius && !this.isAttacking && now >= this.lastAttackTime + this.attackCooldown) {
            this._executeAttack(player, now);
            return;
        }

        // Perseguir al jugador si no está atacando
        if (!this.isAttacking) {
            this._moveTowards(player);
        }

        // Si el jugador sale del radio de alerta → búsqueda
        if (distance > this.alertRadius) {
            this.searchTimer = 3000;
            this._transitionTo(this.states.SEARCH);
        }
    }

    _handleSearch(player, distance, delta) {
        // Si vuelve a detectar al jugador → alertado de nuevo
        if (distance <= this.alertRadius) {
            this._transitionTo(this.states.ALERTED);
            return;
        }

        // Moverse hacia la última posición conocida
        if (this._lastKnownX !== null) {
            const target = { x: this._lastKnownX, y: this._lastKnownY };
            this._moveTowardsPoint(target);
        }

        // Cuenta atrás de búsqueda
        this.searchTimer -= delta;
        if (this.searchTimer <= 0) {
            this._lastKnownX = null;
            this._lastKnownY = null;
            this._transitionTo(this.states.IDLE);
        }
    }

    _handleMovementState(player, distance, now) {
        // Walking/Swimming mientras está en persecución
        if (distance <= this.alertRadius) {
            // Volver a ALERTED si el jugador reaparece en rango
            this._transitionTo(this.states.ALERTED);
            return;
        }

        if (!this.isAttacking) {
            this.body?.setVelocity(0, 0);
        }
    }

    // ─────────────────────────────────────────
    //  ATAQUE
    // ─────────────────────────────────────────

    _executeAttack(player, now) {
        this.isAttacking    = true;
        this.lastAttackTime = now;

        // Detener movimiento durante el ataque
        this.body?.setVelocity(0, 0);

        // Sprite de ataque según terreno
        if (this._isInWater()) {
            this.setTexture('croco_bubble');
        } else {
            this.setTexture('croco_attack');
        }

        // Aplicar daño y screen shake
        player.takeDamage(this.damage);
        this.scene?.cameras?.main?.shake?.(200, 0.008);

        // Finalizar ataque tras 2 segundos
        this.scene?.time?.delayedCall(500, () => {
            if (!this.active || this.currentState === this.states.DEAD) return;

            this.isAttacking = false;

            // Restaurar sprite según terreno actual
            if (this._isInWater()) {
                this.setTexture('croco_submerge');
            } else {
                this.setTexture('croco_idle');
            }
        });
    }

    // ─────────────────────────────────────────
    //  MOVIMIENTO
    // ─────────────────────────────────────────

    _moveTowards(target) {
        if (!target || typeof target.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }
        this.scene.physics.moveToObject(this, target, this._speed);

        // Orientar sprite según dirección horizontal
        const dx = target.x - this.x;
        if (Math.abs(dx) > 1) {
            this.setFlipX(dx < 0);
        }
    }

    _moveTowardsPoint(point) {
        if (!point || typeof point.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }

        const dist = Phaser.Math.Distance.Between(this.x, this.y, point.x, point.y);
        if (dist < 16) {
            this.body?.setVelocity(0, 0);
            return;
        }

        this.scene.physics.moveTo(this, point.x, point.y, this._speed);

        const dx = point.x - this.x;
        if (Math.abs(dx) > 1) {
            this.setFlipX(dx < 0);
        }
    }

    // ─────────────────────────────────────────
    //  MUERTE
    // ─────────────────────────────────────────

    _handleDeath() {
        console.log(`${this._nombre} ha muerto`);

        this.body?.setVelocity(0, 0);
        if (this.body) {
            this.body.enable = false;
        }

        this.setTexture('croco_idle');
        this.setAlpha(0.5);

        this.scene?.time?.delayedCall(5000, () => {
            if (this?.scene) this.destroy();
        });
    }

    // ─────────────────────────────────────────
    //  DAÑO
    // ─────────────────────────────────────────

    canTakeDamage() {
        return super.canTakeDamage() && this.currentState !== this.states.DEAD;
    }

    afterTakeDamage(damage, previousHealth, newHealth) {
        console.log(`${this._nombre} recibió ${damage} de daño. HP: ${newHealth}`);

        if (!this.scene?.sound) return;

        if (!this._lastDamageSound || this.scene.time.now > this._lastDamageSound + 100) {
            this.scene.sound.play('damage_hit', { volume: 0.6 });
            this._lastDamageSound = this.scene.time.now;
        }
    }

    onHealthDepleted() {
        this._transitionTo(this.states.DEAD);
    }

    isDead() {
        return this.currentState === this.states.DEAD;
    }

    // ─────────────────────────────────────────
    //  PREUPDATE — FSM PRINCIPAL
    // ─────────────────────────────────────────

    preUpdate(time, delta) {
        super.preUpdate?.(time, delta);

        if (!this.active) return;
        if (this.currentState === this.states.DEAD) return;

        const player = this.scene?.duck;
        if (!player || !player.active) return;

        // Actualizar estado de terreno (agua / tierra)
        this._updateTerrainState();

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        // ── FSM principal ──
        switch (this.currentState) {
            case this.states.IDLE:
                this._handleIdle(distance);
                break;

            case this.states.ALERTED:
                this._handleAlerted(player, distance, time);
                break;

            case this.states.SEARCH:
                this._handleSearch(player, distance, delta);
                break;

            case this.states.WALKING:
            case this.states.SWIMMING:
                this._handleMovementState(player, distance, time);
                break;

            // DEAD ya se gestiona al principio del método
        }

        // Actualizar weaponBar si existe (heredado de BaseCharacter)
        if (this.weaponBar?.update) this.weaponBar.update();
    }
}

export { CrocoState };