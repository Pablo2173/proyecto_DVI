import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';
import BubblesCroco from './Projectiles/bubblesCroco.js';

const CrocoState = Object.freeze({
    IDLE: 'idle',
    WALKING: 'walking',
    SWIMMING: 'swimming',
    ALERTED: 'alerted',
    SHOOTING: 'shooting',
    SEARCH: 'search',
    DEAD: 'dead'
});

export default class Crocodile extends BaseCharacter {

    constructor(scene, name, x, y, texture, frame = null) {
        super(scene, x, y, texture ?? 'croco_idle', frame, TEAM.ENEMY);

        this.showDebugAreas = false;

        this._nombre = name;
        this.team = TEAM.ENEMY;

        this.health = 120;
        this._speed = 200;
        this.damage = 2;

        this.attackRadius = 50;
        this.alertRadius = 400;
        this.contactRadius = 100;
        this.minimumApproachRadius = 100;

        this._swimAttackRadius = 200;
        this._swimAlertRadius = 200;
        this._swimContactRadius = 140;
        this._swimChaseSpeedMultiplier = 2;

        this._shootingBurstCooldownMs = 7000;
        this._shootingShotIntervalMs = 400;
        this._shootingMaxShots = 6;
        this._shootingBurstShots = 0;
        this._shootingNextShotTime = 0;
        this._lastShootingBurstTime = -Infinity;

        this._tailSwipeCooldownMs = 2000;
        this._lastTailSwipeTime = -Infinity;

        this._swimContactDamageMs = 1000;
        this._lastSwimContactDamageTime = -Infinity;

        this.states = CrocoState;
        this.currentState = this.states.IDLE;

        this.isAttacking = false;

        this.searchTimer = 0;
        this._lastKnownX = null;
        this._lastKnownY = null;

        this._terrainDebounceMs = 120;
        this._pendingInWater = null;
        this._terrainPendingSince = 0;

        this._swimStrafeDir = 1;
        this._swimStrafeAngle = 0;
        this._swimStrafeSpeed = 0.6;
        this._swimNextStrafeSwitch = 0;

        this._lastFlipX = false;

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

        this.setTexture('croco_idle');
        this.setScale(3);
        this.setDepth(10);

        this._debugGraphics = scene.add.graphics();
        this._debugGraphics.setDepth(999);
    }

    _transitionTo(newState, force = false) {
        if (this.currentState === newState) return;
        if (this.currentState === this.states.SHOOTING && newState !== this.states.SHOOTING && !force) {
            return;
        }
        if (this.currentState === this.states.SHOOTING && newState !== this.states.SHOOTING) {
            this._resetShootingBurst();
        }
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
                this._swimStrafeAngle = 0;
                break;
            case this.states.ALERTED:
                break;
            case this.states.SHOOTING:
                this.setTexture('croco_bubble');
                this.body?.setVelocity(0, 0);
                break;
            case this.states.SEARCH:
                break;
            case this.states.DEAD:
                this._handleDeath();
                break;
        }
    }

    _isInWater() {
        const tileSize = 16 * 4;
        const tileX = Math.floor(this.x / tileSize);
        const tileY = Math.floor(this.y / tileSize);

        const layer1 = this.scene?.zonasAcuaticasLayer;
        const layer2 = this.scene?.zonaAcuatica2Layer;

        return !!(
            (layer1 && layer1.getTileAt(tileX, tileY)) ||
            (layer2 && layer2.getTileAt(tileX, tileY))
        );
    }

    _updateTerrainState(now) {
        if (this.currentState === this.states.DEAD) return;
        if (this.currentState === this.states.SHOOTING) return;

        const inWater = this._isInWater();
        const isSwimming = this.currentState === this.states.SWIMMING;

        if (inWater === isSwimming) {
            this._pendingInWater = null;
            this._terrainPendingSince = 0;
            return;
        }

        if (this._pendingInWater !== inWater) {
            this._pendingInWater = inWater;
            this._terrainPendingSince = now;
            return;
        }

        if (now - this._terrainPendingSince < this._terrainDebounceMs) return;

        this._pendingInWater = null;
        this._terrainPendingSince = 0;

        if (inWater) {
            this._transitionTo(this.states.SWIMMING);
        } else {
            this._transitionTo(this.states.WALKING);
        }
    }

    _activeAttackRadius() {
        return this.currentState === this.states.SWIMMING
            ? this._swimAttackRadius
            : this.attackRadius;
    }

    _activeAlertRadius() {
        return this.currentState === this.states.SWIMMING
            ? this._swimAlertRadius
            : this.alertRadius;
    }

    _activeChaseSpeedMultiplier() {
        return this.currentState === this.states.SWIMMING
            ? this._swimChaseSpeedMultiplier
            : 1;
    }

    _drawDebugRadii() {
        if (!this._debugGraphics) return;
        if (!this.showDebugAreas) {
            this._debugGraphics.clear();
            return;
        }

        this._debugGraphics.clear();
        this._debugGraphics.lineStyle(1, 0xffff00, 0.6);
        this._debugGraphics.strokeCircle(this.x, this.y, this._activeAlertRadius());
        this._debugGraphics.lineStyle(1, 0xff0000, 0.6);
        this._debugGraphics.strokeCircle(this.x, this.y, this._activeAttackRadius());
    }

    _idleSprite() {
        this.setTexture(this._isInWater() ? 'croco_submerge' : 'croco_idle');
    }

    _attackSprite() {
        this.setTexture(this._isInWater() ? 'croco_bubble' : 'croco_attack');
    }

    _safeSetFlipX(value) {
        if (value !== this._lastFlipX) {
            this._lastFlipX = value;
            this.setFlipX(value);
        }
    }

    _handleIdle(distance) {
        this.body?.setVelocity(0, 0);
        this._idleSprite();

        if (distance <= this._activeAlertRadius()) {
            this._transitionTo(this.states.ALERTED);
        }
    }

    _handleAlerted(player, distance, now) {
        this._lastKnownX = player.x;
        this._lastKnownY = player.y;

        // En tierra: comportamiento de coletazo estacionario
        if (this.currentState === this.states.WALKING) {
            // Si está atacando y el jugador se aleja, salir del ataque
            if (this.isAttacking && distance > this._activeAttackRadius()) {
                this.isAttacking = false;
                this._idleSprite();
            }

            if (distance <= this._activeAttackRadius()) {
                this.body?.setVelocity(0, 0);
                this._handleContactDamage(player, distance, now);
                return;
            }

            if (distance > this._activeAlertRadius()) {
                if (now >= this._lastShootingBurstTime + this._shootingBurstCooldownMs) {
                    this._beginShootingBurst(now);
                    return;
                }

                if (!this.isAttacking) {
                    this._moveTowards(player, this._activeChaseSpeedMultiplier());
                    this._idleSprite();
                }
                return;
            }

            if (!this.isAttacking) {
                this._moveTowards(player, this._activeChaseSpeedMultiplier());
                this._idleSprite();
            }
            return;
        }

        // En agua o estado ALERTED: comportamiento de persecución normal
        if (distance <= this._activeAttackRadius()) {
            if (distance < this.minimumApproachRadius) {
                this._moveAwayFrom(player);
            } else {
                this._moveTowards(player, this._activeChaseSpeedMultiplier());
            }
            this._idleSprite();
            this._handleContactDamage(player, distance, now);
            return;
        }

        if (distance > this._activeAlertRadius()) {
            if (now >= this._lastShootingBurstTime + this._shootingBurstCooldownMs) {
                this._beginShootingBurst(now);
                return;
            }

            if (!this.isAttacking) {
                this._moveTowards(player, this._activeChaseSpeedMultiplier());
                this._idleSprite();
            }
            return;
        }

        if (!this.isAttacking) {
            this._moveTowards(player, this._activeChaseSpeedMultiplier());
            this._idleSprite();
        }
    }

    _handleSwimming(player, distance, now) {
        if (distance <= this._activeAttackRadius()) {
            if (distance < this.minimumApproachRadius) {
                this._moveAwayFrom(player);
            } else {
                this._moveTowards(player, this._activeChaseSpeedMultiplier());
            }
            this._idleSprite();
            this._handleContactDamage(player, distance, now);
            return;
        }

        if (distance > this._activeAlertRadius()) {
            if (now >= this._lastShootingBurstTime + this._shootingBurstCooldownMs) {
                this._beginShootingBurst(now);
                return;
            }

            if (!this.isAttacking) {
                this._moveTowards(player, this._activeChaseSpeedMultiplier());
                this._idleSprite();
            }
            return;
        }

        if (!this.isAttacking) {
            this._moveTowards(player, this._activeChaseSpeedMultiplier());
            this._idleSprite();
        }
    }

    _handleShooting(player, distance, now) {
        if (now < this._shootingNextShotTime) return;

        if (this._shootingBurstShots >= this._shootingMaxShots) {
            this._endShootingBurst(now);
            return;
        }

        this._fireBubble(player);
        this._shootingBurstShots += 1;

        if (this._shootingBurstShots >= this._shootingMaxShots) {
            this._endShootingBurst(now);
            return;
        }

        this._shootingNextShotTime = now + this._shootingShotIntervalMs;
    }

    _swimNeutralMovement(now) {
        if (now >= this._swimNextStrafeSwitch) {
            this._swimStrafeDir *= -1;
            this._swimNextStrafeSwitch = now + Phaser.Math.Between(1200, 2400);
        }

        this._swimStrafeAngle += this._swimStrafeSpeed * this._swimStrafeDir * 0.016;

        const vx = Math.cos(this._swimStrafeAngle) * this._speed * 0.4;
        const vy = Math.sin(this._swimStrafeAngle) * this._speed * 0.4;

        this.body?.setVelocity(vx, vy);

        if (Math.abs(vx) > 8) {
            this._safeSetFlipX(vx < 0);
        }
    }

    _handleSearch(player, distance, delta) {
        if (distance <= this._activeAlertRadius()) {
            this._transitionTo(this.states.ALERTED);
            return;
        }

        if (this._lastKnownX !== null) {
            const target = { x: this._lastKnownX, y: this._lastKnownY };
            this._moveTowardsPoint(target);
            this._idleSprite();
        }

        this.searchTimer -= delta;
        if (this.searchTimer <= 0) {
            this._lastKnownX = null;
            this._lastKnownY = null;
            this._transitionTo(this.states.IDLE);
        }
    }

    _beginShootingBurst(now) {
        this.isAttacking = true;
        this._shootingBurstShots = 0;
        this._shootingNextShotTime = now;
        this._transitionTo(this.states.SHOOTING);
        this._handleShooting(this.scene?.duck, this._currentDistanceToDuck(), now);
    }

    _endShootingBurst(now) {
        this._lastShootingBurstTime = now;
        this._resetShootingBurst();
        this._transitionTo(this.states.ALERTED, true);
    }

    _resetShootingBurst() {
        this.isAttacking = false;
        this._shootingBurstShots = 0;
        this._shootingNextShotTime = 0;
    }

    _currentDistanceToDuck() {
        const player = this.scene?.duck;
        if (!player || typeof player.x !== 'number') return Infinity;
        return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    }

    _handleContactDamage(player, distance, now) {
        const contactRadius = this.currentState === this.states.SWIMMING
            ? this._swimContactRadius
            : this.contactRadius;

        if (!player || distance > contactRadius) return;

        if (this.currentState === this.states.SWIMMING) {
            if (now < this._lastSwimContactDamageTime + this._swimContactDamageMs) return;
            this._lastSwimContactDamageTime = now;
            player.takeDamage(1);
            return;
        }
        if (now < this._lastTailSwipeTime + this._tailSwipeCooldownMs) return;
        this._lastTailSwipeTime = now;

        this.isAttacking = true;
        this.body?.setVelocity(0, 0);
        this._attackSprite();
        player.takeDamage(this.damage);
        this.scene?.cameras?.main?.shake?.(160, 0.006);

        this.scene?.time?.delayedCall(700, () => {
            if (!this.active || this.currentState === this.states.DEAD) return;
            this.isAttacking = false;
            this._idleSprite();
        });
    }

    _fireBubble(player) {
        if (!player || typeof player.x !== 'number') return;

        const bubble = new BubblesCroco(this.scene, this.x, this.y, {
            team: TEAM.ENEMY,
            damage: this.damage,
            range: 3000
        });

        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const speed = 700;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        if (bubble.body) {
            bubble.body.setVelocity(vx, vy);
        }

        if (this.scene?.physics && player) {
            this.scene.physics.add.overlap(bubble, player, () => {
                if (!bubble.active) return;
                player.takeDamage(this.damage);
                bubble.destroy();
            });
        }

        this.scene?.time?.delayedCall(4000, () => {
            if (bubble?.active) bubble.destroy();
        });
    }

    _moveAwayFrom(target) {
        if (!target || typeof target.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }

        const angle = Phaser.Math.Angle.Between(target.x, target.y, this.x, this.y);
        const vx = Math.cos(angle) * this._speed * this._activeChaseSpeedMultiplier();
        const vy = Math.sin(angle) * this._speed * this._activeChaseSpeedMultiplier();
        this.body?.setVelocity(vx, vy);

        if (Math.abs(vx) > 8) {
            this._safeSetFlipX(vx < 0);
        }
    }

    _moveTowards(target, speedMultiplier = 1) {
        if (!target || typeof target.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }
        this.scene.physics.moveToObject(this, target, this._speed * speedMultiplier);

        const dx = target.x - this.x;
        if (Math.abs(dx) > 8) {
            this._safeSetFlipX(dx < 0);
        }
    }

    _moveTowardsPoint(point, speedMultiplier = 1) {
        if (!point || typeof point.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }

        const dist = Phaser.Math.Distance.Between(this.x, this.y, point.x, point.y);
        if (dist < 16) {
            this.body?.setVelocity(0, 0);
            return;
        }

        this.scene.physics.moveTo(this, point.x, point.y, this._speed * speedMultiplier);

        const dx = point.x - this.x;
        if (Math.abs(dx) > 8) {
            this._safeSetFlipX(dx < 0);
        }
    }

    _handleDeath() {
        console.log(`${this._nombre} ha muerto`);

        this.body?.setVelocity(0, 0);
        if (this.body) {
            this.body.enable = false;
        }

        this.setTexture('croco_idle');
        this.setAlpha(0.5);

        this._debugGraphics?.destroy();

        this.scene?.time?.delayedCall(5000, () => {
            if (this?.scene) this.destroy();
        });
    }

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

    preUpdate(time, delta) {
        super.preUpdate?.(time, delta);

        if (!this.active) return;
        if (this.currentState === this.states.DEAD) return;

        const player = this.scene?.duck;
        if (!player || !player.active) return;

        this._updateTerrainState(time);

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        switch (this.currentState) {
            case this.states.IDLE:
                this._handleIdle(distance);
                break;

            case this.states.ALERTED:
            case this.states.WALKING:
                this._handleAlerted(player, distance, time);
                break;

            case this.states.SHOOTING:
                this._handleShooting(player, distance, time);
                break;

            case this.states.SWIMMING:
                this._handleSwimming(player, distance, time);
                break;

            case this.states.SEARCH:
                this._handleSearch(player, distance, delta);
                break;
        }

        this._drawDebugRadii();

        if (this.weaponBar?.update) this.weaponBar.update();
    }
}

export { CrocoState };