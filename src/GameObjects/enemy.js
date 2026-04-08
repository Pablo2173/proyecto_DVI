import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';

import Arco from './Weapons/Distance/arco.js';
import Mcuaktro from './Weapons/Distance/mcuaktro.js';
import Cuchillo from './Weapons/Melee/cuchillo.js';
import Mazo from './Weapons/Melee/mazo.js';
import Ramita from './Weapons/Melee/ramita.js';
import Escoba from './Weapons/Melee/escoba.js';

import DropWeapon from './Consumables/Drops/dropWeapon.js';
import DropFeather from './Consumables/Drops/dropFeather.js';
import DropBread from './Consumables/Drops/dropBread.js';
import DropMask from './Consumables/Drops/dropMask.js';
import DropTail from './Consumables/Drops/dropTail.js';

// ─────────────────────────────────────────
//  ESTADOS
// ─────────────────────────────────────────
const StatusEnemy = {
    IDLE:     0,
    ALERTED:  1,
    SEARCH:   2,
    DEAD:     3,
    STUNNED:  4
};

export default class Enemy extends BaseCharacter {

    // ─────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────
    constructor(scene, name, x, y, texture, frame = null, visionRadius, hp, speed, weapon, movementType, hasFeather) {
        super(scene, x, y, texture, frame, TEAM.ENEMY);

        // ── Física ──
        if (scene.physics?.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setCollideWorldBounds(true);
                this.body.setAllowGravity(false);
                this.body.setImmovable(false);
                this.body.setSize(20, 30);
                this.body.setOffset(4, 4);
            }
        }

        // ── Identidad ──
        this._nombre        = name;
        this._hp            = hp;
        this._speed         = speed;
        this._weapon        = weapon;
        this._movementType  = movementType;
        this._movementData  = null;
        this.hasFeather     = hasFeather;

        // ── Visión ──
        this._visionRadius  = visionRadius;
        this._visionAngle   = Math.PI / 2;
        this._facingAngle   = Math.PI;
        this._showVision    = false;
        this._visionGraphics = scene.add.graphics();

        // ── Máquina de estados ──
        this._state = StatusEnemy.IDLE;

        // ── Timers internos ──
        this._knockbackUntil        = 0;
        this._visionAlertFlashUntil = 0;
        this._lastQuackTime         = 0;
        this._quackCooldown         = 100;

        // ── Combate ──
        this._inRangeStartTime  = 0;
        this._attackDelay       = 800;      // ms antes del primer ataque al entrar en rango
        this._inRangeLeaveCooldown = 500;   // ms que tiene que estar fuera del rango para resetear el delay

        this._strafeDirection = Math.random() < 0.5 ? -1 : 1;
        this._nextStrafeSwitchTime = 0;

        this._lastDodgeTime = 0;
        this._dodgeCooldown = 900;
        this._dodgeDuration = 180;
        this._dodgeSpeedMultiplier = 2.2;
        this._projectileAwarenessRadius = 140;

        // ── Búsqueda ──
        this._searchStartTime       = 0;
        this._searchDuration        = 2000;
        this._searchTurns           = 2;
        this._searchStartFacingAngle = this._facingAngle;

        // ── Visual de daño ──
        this._spriteBaseKey  = this._resolveSpriteBaseKey(texture);
        this._isShowingHit   = false;
        this._hitUntil       = 0;
        this._hitDuration    = 120;

        // ── Loot ──
        this.lootTable   = [];
        this.specialDrop = null;

        this.weaponMap = { arco: Arco, mcuaktro: Mcuaktro, cuchillo: Cuchillo, mazo: Mazo, ramita: Ramita, escoba: Escoba };

        this.equipWeapon(weapon);
        this.drawVision({ color: 0xff0000, fillAlpha: 0.08 });
    }

    // ─────────────────────────────────────────
    //  MÁQUINA DE ESTADOS — punto de entrada único para cambiar estado
    // ─────────────────────────────────────────

    /**
     * Única forma de cambiar el estado. Llama a _onExitState y _onEnterState.
     * Las subclases pueden sobreescribir _onEnterState/_onExitState para
     * añadir comportamientos específicos sin romper la lógica base.
     */
    _transitionTo(newState, context = {}) {
        if (this._state === newState) return;
        this._onExitState(this._state, newState, context);
        const prevState = this._state;
        this._state = newState;
        this._onEnterState(newState, prevState, context);
    }

    /** Llamado al SALIR de un estado. Sobreescribible en subclases. */
    _onExitState(exitingState, _nextState, _context) {
        // Limpiar tint de alerta al salir de ALERTED si no hay flash de daño activo
        if (exitingState === StatusEnemy.ALERTED) {
            if (this.tintTopLeft !== 0xFF0000) this.clearTint();
        }
    }

    /** Llamado al ENTRAR en un estado. Sobreescribible en subclases. */
    _onEnterState(enteringState, _prevState, context) {
        const now = this.scene?.time?.now ?? 0;

        switch (enteringState) {

            case StatusEnemy.ALERTED:
                this._visionAlertFlashUntil = now + 500;
                // No resetear _inRangeStartTime aquí — se gestiona en movementAlerted
                this.onAlerted(context);
                break;

            case StatusEnemy.SEARCH:
                this._searchStartTime        = context.time ?? now;
                this._searchStartFacingAngle = this._facingAngle;
                this._inRangeStartTime       = 0;
                this.stop();
                this.onStartSearch(context);
                break;

            case StatusEnemy.IDLE:
                this._inRangeStartTime = 0;
                this.onReturnIdle(context);
                break;

            case StatusEnemy.DEAD:
                this.onDead(context);
                break;

            case StatusEnemy.STUNNED:
                this.onStunned(context);
                break;
        }
    }

    // ─────────────────────────────────────────
    //  HOOKS — sobreescribir en subclases para comportamientos únicos
    // ─────────────────────────────────────────

    /** Llamado cuando el enemigo se alerta por primera vez. */
    onAlerted(_context) {}

    /** Llamado cuando el enemigo entra en modo búsqueda. */
    onStartSearch(_context) {}

    /** Llamado cuando el enemigo vuelve a IDLE. */
    onReturnIdle(_context) {}

    /** Llamado cuando el enemigo muere (antes de los drops). */
    onDead(_context) {}

    /** Llamado cuando el enemigo es stunteado. */
    onStunned(_context) {}

    /**
     * HOOK DE MOVIMIENTO EN COMBATE — sobreescribir en subclases.
     *
     * Define cómo se mueve el enemigo cuando está ALERTED y en rango de ataque.
     * Por defecto: se queda parado. El zorro podría hacer strafing, el mapache
     * podría retroceder, etc.
     *
     * @param {Phaser.GameObjects.GameObject} target — el jugador
     * @param {number} dist — distancia actual al jugador
     */
    onCombatMovement(target, _dist) {
        const now = this.scene?.time?.now ?? 0;

        if (!this._nextStrafeSwitchTime || now >= this._nextStrafeSwitchTime) {
            this._strafeDirection *= -1;
            this._nextStrafeSwitchTime = now + Phaser.Math.Between(700, 1400);
        }

        this.moveLateral(target, 0.55, this._strafeDirection);
    }

    /**
     * HOOK DE PERSECUCIÓN — sobreescribir en subclases.
     *
     * Define cómo se mueve el enemigo cuando está ALERTED y fuera de rango.
     * Por defecto: se acerca directamente.
     *
     * @param {Phaser.GameObjects.GameObject} target
     * @param {number} dist
     */
    onChaseMovement(target, _dist) {
        this.moveTowards(target);
    }

    /**
     * HOOK DE RETIRADA — sobreescribir en subclases.
     *
     * Define cómo se mueve el enemigo cuando está ALERTED y demasiado cerca.
     * Por defecto: se aleja directamente.
     *
     * @param {Phaser.GameObjects.GameObject} target
     * @param {number} dist
     */
    onRetreatMovement(target, _dist) {
        this.moveAwayFrom(target);
    }

    // ─────────────────────────────────────────
    //  DETECCIÓN Y ALERTA
    // ─────────────────────────────────────────

    canSee(target) {
        if (this._state === StatusEnemy.DEAD) return false;
        if (!target || typeof target.x !== 'number') return false;
        if (typeof target.isInvisibleState === 'function' && target.isInvisibleState()) return false;

        const dx = target.x - this.x;
        const dy = target.y - this.y;

        if (dx * dx + dy * dy > this._visionRadius * this._visionRadius) return false;

        const angleToTarget = Math.atan2(dy, dx);
        let diff = angleToTarget - this._facingAngle;

        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        if (Math.abs(diff) > this._visionAngle / 2) return false;

        return this.hasLineOfSight(target);
    }

    hasLineOfSight(target) {
        if (!target || !this.scene) return false;

        const layersToCheck = [
            this.scene.colisionLayer,
            this.scene.vallaLayer,
            this.scene.desnivelLayer
        ].filter(Boolean);

        if (layersToCheck.length === 0) return true;

        const line = new Phaser.Geom.Line(this.x, this.y, target.x, target.y);

        for (const layer of layersToCheck) {
            const tiles = layer.getTilesWithinShape(line, { isNotEmpty: true });

            for (const tile of tiles) {
                if (!tile) continue;

                const tileWidth = layer.tilemap.tileWidth * layer.scaleX;
                const tileHeight = layer.tilemap.tileHeight * layer.scaleY;

                const tileRect = new Phaser.Geom.Rectangle(
                    tile.pixelX * layer.scaleX,
                    tile.pixelY * layer.scaleY,
                    tileWidth,
                    tileHeight
                );

                if (Phaser.Geom.Intersects.LineToRectangle(line, tileRect)) {
                    return false;
                }
            }
        }

        return true;
    }

    detectAndAlert(player, time = this.scene?.time?.now ?? 0) {
        if (!player) return false;

        const playerIsInvisible = typeof player.isInvisibleState === 'function' && player.isInvisibleState();

        if (playerIsInvisible) {
            if (this._state === StatusEnemy.ALERTED) this._transitionTo(StatusEnemy.SEARCH, { time });
            if (this._state === StatusEnemy.SEARCH && time >= this._searchStartTime + this._searchDuration) {
                this._transitionTo(StatusEnemy.IDLE, { time });
            }
            return false;
        }

        if (this._state === StatusEnemy.DEAD) return false;

        const seen = this.canSee(player);

        if (seen) {
            if (this._state !== StatusEnemy.ALERTED) {
                this._transitionTo(StatusEnemy.ALERTED, { time, player });
            }
            return true;
        }

        if (this._state === StatusEnemy.SEARCH && time >= this._searchStartTime + this._searchDuration) {
            this._transitionTo(StatusEnemy.IDLE, { time });
        }

        return false;
    }

    updateAwareness(player, time = this.scene?.time?.now ?? 0) {
        this.detectAndAlert(player, time);
        if (this._state === StatusEnemy.SEARCH) this._updateSearchFacing(time);
        this._updateVisionAlertFlash(time);
        this.drawVision({ color: 0xff0000, fillAlpha: 0.08 });
    }

    onAudioEvent(audioEvent) {
        if (!audioEvent || typeof audioEvent.time !== 'number') return;
        if (typeof this.scene?.duck?.isInvisibleState === 'function' && this.scene.duck.isInvisibleState()) {
            if (this._state === StatusEnemy.ALERTED) this._transitionTo(StatusEnemy.SEARCH, { time: audioEvent.time });
            return;
        }

        const alertingSounds = ['quack'];
        if (!alertingSounds.includes(audioEvent.soundType)) return;
        if (audioEvent.time <= this._lastQuackTime + this._quackCooldown) return;
        this._lastQuackTime = audioEvent.time;

        if (!audioEvent.position) return;
        const dx = audioEvent.position.x - this.x;
        const dy = audioEvent.position.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance <= (audioEvent.radius || 0) && this._state !== StatusEnemy.ALERTED) {
            this._transitionTo(StatusEnemy.ALERTED, { time: audioEvent.time });
        }
    }

    // ─────────────────────────────────────────
    //  MOVIMIENTO
    // ─────────────────────────────────────────

    moveTowards(target) {
        if (!target || typeof target.x !== 'number') { this.body?.setVelocity(0, 0); return; }
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    moveAwayFrom(target) {
        if (!target || typeof target.x !== 'number') { this.body?.setVelocity(0, 0); return; }
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    /**
     * Movimiento lateral perpendicular al objetivo (strafing).
     * Útil para subclases de enemigos a distancia.
     * @param {object} target
     * @param {number} speedMultiplier — fracción de this._speed (default 0.4)
     * @param {number} direction — 1 o -1
     */
    moveLateral(target, speedMultiplier = 0.4, direction = 1) {
        if (!target) { this.stop(); return; }
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.stop(); return; }
        // Vector perpendicular al objetivo
        const perpX = (-dy / dist) * direction;
        const perpY = ( dx / dist) * direction;
        this.body.setVelocity(perpX * this._speed * speedMultiplier, perpY * this._speed * speedMultiplier);
    }

    stop() {
        this.body?.setVelocity(0, 0);
    }

    applyKnockback(nx, ny, speed = 100, duration = 120) {
        if (!this.body || !Number.isFinite(nx) || !Number.isFinite(ny)) return;
        const length = Math.hypot(nx, ny);
        if (length <= 0.0001) return;
        this._knockbackUntil = (this.scene?.time?.now ?? 0) + duration;
        this.body.setVelocity((nx / length) * speed, (ny / length) * speed);
    }

    tryDodgeIncomingProjectiles(time = this.scene?.time?.now ?? 0) {
        if (!this.scene?.projectiles || !this.body || this.isDead()) return;
        if (time < this._lastDodgeTime + this._dodgeCooldown) return;

        const projectiles = this.scene.projectiles.getChildren?.() ?? [];

        for (const projectile of projectiles) {
            if (!projectile?.active) continue;

            const dx = this.x - projectile.x;
            const dy = this.y - projectile.y;
            const distSq = dx * dx + dy * dy;

            if (distSq > this._projectileAwarenessRadius * this._projectileAwarenessRadius) continue;

            const vx = projectile.body?.velocity?.x ?? 0;
            const vy = projectile.body?.velocity?.y ?? 0;

            if (Math.abs(vx) < 1 && Math.abs(vy) < 1) continue;

            // Comprobar si el proyectil viene hacia el enemigo
            const towardDot = dx * vx + dy * vy;
            if (towardDot <= 0) continue;

            const projSpeed = Math.hypot(vx, vy);
            if (projSpeed < 1) continue;

            const perpX = -vy / projSpeed;
            const perpY = vx / projSpeed;
            const dodgeDir = Math.random() < 0.5 ? -1 : 1;

            this.body.setVelocity(
                perpX * this._speed * this._dodgeSpeedMultiplier * dodgeDir,
                perpY * this._speed * this._dodgeSpeedMultiplier * dodgeDir
            );

            this._lastDodgeTime = time;
            this._knockbackUntil = time + this._dodgeDuration;
            return;
        }
    }

    // ─────────────────────────────────────────
    //  COMBATE — lógica base, personalizable via hooks
    // ─────────────────────────────────────────

    /**
     * Lógica de combate principal.
     * Decide si perseguir, retroceder o atacar según distancias.
     * El comportamiento dentro de cada zona se delega a los hooks.
     */
    movementAlerted(target) {
        if (!this.isAlerted() || !target) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const optimalDist = this.weapon?.optimalDistance ?? 200;
        const range = this.weapon?.range ?? 300;
        const now = this.scene.time.now;
        const hasLOS = this.hasLineOfSight(target);

        // Si no hay línea de visión, recolocarse en vez de disparar
        if (!hasLOS) {
            this._inRangeStartTime = 0;

            if (!this._nextStrafeSwitchTime || now >= this._nextStrafeSwitchTime) {
                this._strafeDirection = Math.random() < 0.5 ? -1 : 1;
                this._nextStrafeSwitchTime = now + Phaser.Math.Between(500, 1100);
            }

            if (dist > optimalDist * 0.9) {
                this.onChaseMovement(target, dist);
            } else {
                this.moveLateral(target, 0.8, this._strafeDirection);
            }

            return;
        }

        if (dist < optimalDist * 0.65) {
            this.onRetreatMovement(target, dist);
            this._inRangeStartTime = 0;
            return;
        }

        if (dist > range) {
            this.onChaseMovement(target, dist);
            this._inRangeStartTime = 0;
            return;
        }

        this.onCombatMovement(target, dist);

        if (this.weapon && typeof this.weapon.attack === 'function') {
            if (this._inRangeStartTime === 0) this._inRangeStartTime = now;
            if (now - this._inRangeStartTime >= this._attackDelay) {
                this.weapon.attack();
            }
        }
    }

    // ─────────────────────────────────────────
    //  PATRULLA POR RUTA
    // ─────────────────────────────────────────

    movementFollowRoute() {
        if (!this._movementData?.routePoints || this._movementData.routePoints.length < 2) return;
        if (this.isAlerted()) return;

        const data          = this._movementData;
        const points        = data.routePoints;
        const currentTarget = points[data.currentPointIndex];
        const dist          = Phaser.Math.Distance.Between(this.x, this.y, currentTarget.x, currentTarget.y);

        if (dist < 10) {
            data.currentPointIndex = (data.currentPointIndex + 1) % points.length;
            data.pauseTimer = 0;
            return;
        }

        data.pauseTimer = (data.pauseTimer ?? 0) + this.scene.game.loop.delta;
        if (data.pauseTimer < 1000) { this.stop(); return; }

        this.moveTowards(currentTarget);
    }

    // ─────────────────────────────────────────
    //  BÚSQUEDA
    // ─────────────────────────────────────────

    _startSearch(time = this.scene?.time?.now ?? 0) {
        this._transitionTo(StatusEnemy.SEARCH, { time });
    }

    _updateSearchFacing(time = this.scene?.time?.now ?? 0) {
        if (this._state !== StatusEnemy.SEARCH || this._searchDuration <= 0) return;
        const elapsed  = Math.max(0, time - this._searchStartTime);
        const progress = Phaser.Math.Clamp(elapsed / this._searchDuration, 0, 1);
        this._facingAngle = this._searchStartFacingAngle + (Math.PI * 2) * this._searchTurns * progress;
    }

    // ─────────────────────────────────────────
    //  DAÑO Y MUERTE
    // ─────────────────────────────────────────

    canTakeDamage() {
        return super.canTakeDamage() && !this.isDead();
    }

    afterTakeDamage(damage, previousHealth, newHealth) {
        if (this._state !== StatusEnemy.ALERTED) {
            this._transitionTo(StatusEnemy.ALERTED, { source: 'damage' });
        }
        console.log(`${this._nombre} recibió ${damage} de daño. HP: ${newHealth}`);
    }

    onHealthDepleted() {
        this.die();
    }

    takeDamage(damage) {
        if (this._state === StatusEnemy.DEAD) return;
        this._hp -= damage;
        if (this._state !== StatusEnemy.ALERTED) {
            this._transitionTo(StatusEnemy.ALERTED, { source: 'damage' });
        }
        console.log(`${this._nombre} recibió ${damage} de daño. HP: ${this._hp}`);
        this.flashRed();
        this._showHitVisual();
        if (this._hp <= 0) this.die();
    }

    _showHitVisual(duration = this._hitDuration) {
        if (this._state === StatusEnemy.DEAD) return;
        const hitTexture = this._textureKeyFor('hit');
        const now        = this.scene?.time?.now ?? 0;
        if (hitTexture && this.scene?.textures?.exists(hitTexture)) {
            this._isShowingHit = true;
            this._hitUntil     = now + duration;
            this.anims?.stop();
            this.setTexture(hitTexture);
            return;
        }
        this.flashRed(duration);
    }

    die() {
        if (this._state === StatusEnemy.DEAD) return;
        this._transitionTo(StatusEnemy.DEAD);

        this._isShowingHit          = false;
        this._visionAlertFlashUntil = 0;
        console.log(`${this._nombre} ha muerto`);

        this.dropWeapon();
        this.dropFeather();
        this.dropBread();
        this.dropSpecialItem();

        // Sprite de muerte
        const dedTexture = this._textureKeyFor('ded');
        if (dedTexture && this.scene.textures.exists(dedTexture)) {
            this.anims?.stop();
            this.setTexture(dedTexture);
        } else {
            const fallback = `${this.texture.key}_corpse`;
            if      (this.scene.textures.exists(fallback))        this.setTexture(fallback);
            else if (this.scene.textures.exists('enemy_corpse'))  this.setTexture('enemy_corpse');
        }

        if (this.body) {
            this.body.stop();
            this.body.setVelocity(0, 0);
            this.body.enable = false;
            if (this.body.checkCollision) this.body.checkCollision.none = true;
        }

        this._visionRadius = 0;
        this.drawVision();

        this.scene.time.delayedCall(10000, () => {
            if (this?.scene) super.destroy();
        });
    }

    // ─────────────────────────────────────────
    //  DROPS
    // ─────────────────────────────────────────

    _randomDropOffset(minRadius = 10, maxRadius = 50) {
        const angle  = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const radius = Phaser.Math.FloatBetween(minRadius, maxRadius);
        return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius };
    }

    dropWeapon() {
        if (!this.weapon) return;
        const { dx, dy } = this._randomDropOffset();
        new DropWeapon(this.scene, this.x + dx, this.y + dy, this.weapon.constructor, this.weapon.texture.key);
        this.weapon.destroy();
        this.weapon = null;
    }

    dropFeather() {
        if (!this.hasFeather) return;
        const { dx, dy } = this._randomDropOffset();
        new DropFeather(this.scene, this.x + dx, this.y + dy);
    }

    dropBread() {
        for (let i = 0; i < 3; i++) {
            const { dx, dy } = this._randomDropOffset();
            new DropBread(this.scene, this.x + dx, this.y + dy);
        }
    }

    dropSpecialItem() {
        if (!this.specialDrop) return;
        const { dx, dy } = this._randomDropOffset();
        const spawnX = this.x + dx;
        const spawnY = this.y + dy;
        switch (this.specialDrop) {
            case 'mask': new DropMask(this.scene, spawnX, spawnY); break;
            case 'tail': new DropTail(this.scene, spawnX, spawnY); break;
        }
    }

    dropUseItem() {
        if (!this.lootTable?.length) return;

        const totalProbability = this.lootTable.reduce((sum, e) => sum + e.probability, 0);
        const maxRange         = Math.max(100, totalProbability);
        const random           = Phaser.Math.Between(1, maxRange);

        if (random >= totalProbability) return;

        let cumulative   = 0;
        let selectedItem = null;
        for (const entry of this.lootTable) {
            cumulative += entry.probability;
            if (random < cumulative) { selectedItem = entry; break; }
        }
        if (!selectedItem) return;

        const angle  = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist   = 60;
        const spawnX = this.x + Math.cos(angle) * dist;
        const spawnY = this.y + Math.sin(angle) * dist;

        if      (selectedItem.id === 'mask') new DropMask(this.scene, spawnX, spawnY);
        else if (selectedItem.id === 'tail') new DropTail(this.scene, spawnX, spawnY);
    }

    // ─────────────────────────────────────────
    //  VISUAL
    // ─────────────────────────────────────────

    drawVision(options = {}) {
        if (!this._visionGraphics || typeof this._visionGraphics.clear !== 'function') return;
        const { color = 0x00ff00, fillAlpha = 0.15, lineAlpha = 1, lineWidth = 1, clearBefore = true } = options;
        if (clearBefore) this._visionGraphics.clear();
        if (!this._showVision || this._state === StatusEnemy.DEAD || this._visionRadius <= 0) return;

        const px         = this.x;
        const py         = this.y;
        const startAngle = this._facingAngle - (this._visionAngle / 2);
        const endAngle   = this._facingAngle + (this._visionAngle / 2);

        if (typeof this._visionGraphics.beginPath === 'function') {
            this._visionGraphics.fillStyle(color, fillAlpha);
            this._visionGraphics.lineStyle(lineWidth, color, lineAlpha);
            this._visionGraphics.beginPath();
            this._visionGraphics.moveTo(px, py);
            this._visionGraphics.arc(px, py, this._visionRadius, startAngle, endAngle, false);
            this._visionGraphics.closePath();
            this._visionGraphics.fillPath();
            this._visionGraphics.strokePath();
        } else {
            this._visionGraphics.fillStyle(color, fillAlpha);
            this._visionGraphics.fillCircle(px, py, this._visionRadius);
        }
    }

    flashRed(duration = 100) {
        if (!this.scene) return;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(duration, () => {
            if (this?.clearTint) this.clearTint();
        });
    }

    _updateVisionAlertFlash(time) {
        if (this._visionAlertFlashUntil <= 0) return;
        if (time <= this._visionAlertFlashUntil) {
            if (this.tintTopLeft !== 0xFF0000) this.setTint(0xFFFF01);
            return;
        }
        this._visionAlertFlashUntil = 0;
        if (this.tintTopLeft !== 0xFF0000) this.clearTint();

    }

    _resolveSpriteBaseKey(textureKey) {
        if (typeof textureKey !== 'string') return null;
        const match = textureKey.match(/^(.*)_(idle|run|hit|ded)$/);
        return match ? match[1] : null;
    }

    _textureKeyFor(state) {
        return this._spriteBaseKey ? `${this._spriteBaseKey}_${state}` : null;
    }

    _animKeyFor(state) {
        return this._spriteBaseKey ? `${this._spriteBaseKey}-${state}` : null;
    }

    _updateFacingFromVelocity() {
        if (!this.body) return;
        const vx = this.body.velocity?.x ?? 0;
        if (Math.abs(vx) < 1) return;
        if (vx > 0) this.setFlipX(true);
        if (vx < 0) this.setFlipX(false);
    }

    _updateVisualState(time = this.scene?.time?.now ?? 0) {
        if (!this.body || !this.anims || this._state === StatusEnemy.DEAD) return;
        if (!this._spriteBaseKey) return;
        if (this._isShowingHit) {
            if (time < this._hitUntil) return;
            this._isShowingHit = false;
        }

        const speed         = Math.hypot(this.body.velocity.x, this.body.velocity.y);
        const targetState   = speed > 1 ? 'run' : 'idle';
        const targetTexture = this._textureKeyFor(targetState);
        const targetAnim    = this._animKeyFor(targetState);

        if (targetTexture && this.texture?.key !== targetTexture && this.scene.textures.exists(targetTexture)) {
            this.setTexture(targetTexture);
        }
        if (targetAnim && this.scene.anims.exists(targetAnim)) {
            if (!this.anims.isPlaying || this.anims.currentAnim?.key !== targetAnim) {
                this.play(targetAnim, true);
            }
        }
    }

    // ─────────────────────────────────────────
    //  PREUPDATE — bucle principal
    // ─────────────────────────────────────────

    preUpdate(time, delta) {
        this.tryDodgeIncomingProjectiles(time);
        const isUnderKnockback = time < this._knockbackUntil;

        if (!isUnderKnockback) {
            switch (this._state) {
                case StatusEnemy.IDLE:
                    if (this._movementType === 'followRoute') this.movementFollowRoute();
                    break;
                case StatusEnemy.SEARCH:
                    this.stop();
                    this._updateSearchFacing(time);
                    break;
                case StatusEnemy.ALERTED:
                    if (this.scene.duck) this.movementAlerted(this.scene.duck);
                    break;
                // DEAD y STUNNED no hacen nada por defecto
            }
        }

        this._updateFacingFromVelocity();
        this._updateVisualState(time);

        if (this.weapon?.update)    this.weapon.update();
        if (this.weaponBar?.update) this.weaponBar.update();

        if (super.preUpdate) super.preUpdate(time, delta);
    }

    // ─────────────────────────────────────────
    //  HELPERS PÚBLICOS
    // ─────────────────────────────────────────

    mostrarNombre()  { console.log(`Mi nombre es ${this._nombre}`); }
    getHP()          { return this._hp; }
    getState()       { return this._state; }
    isDead()         { return this._state === StatusEnemy.DEAD; }
    isAlerted()      { return this._state === StatusEnemy.ALERTED; }
    isStunned()      { return this._state === StatusEnemy.STUNNED; }
    setVisionRadius(r) { this._visionRadius = r; }

    setState(state) {
        // Mantener compatibilidad con código externo que llame setState directamente
        this._transitionTo(state);
    }

    resetAlertState() {
        if (this._state !== StatusEnemy.ALERTED && this._state !== StatusEnemy.SEARCH) return;
        this._transitionTo(StatusEnemy.IDLE);
        if (this.tintTopLeft !== 0xFF0000) this.clearTint();
    }

    destroy(fromScene) {
        if (this._visionGraphics) {
            this._visionGraphics.destroy();
            this._visionGraphics = null;
        }
        super.destroy(fromScene);
    }
}

export { StatusEnemy };