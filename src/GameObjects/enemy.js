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
    constructor(scene, name, x, y, texture, frame = null, visionRadius, hp, speed, weapon, movementType, hasFeather, routeFacing = []) {
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
        this._routeFacing   = this._sanitizeRouteFacing(routeFacing);
        this.hasFeather     = hasFeather;

        // ── Visión ──
        this._visionRadius   = visionRadius;
        this._visionAngle    = Math.PI / 2;
        this._facingAngle    = Math.PI;
        this._showVision     = false;
        this._visionGraphics = scene.add.graphics();

        if (this._routeFacing[0]) {
            this.setFacingDirection(this._routeFacing[0]);
        } else {
            this.setFacingDirection('left');
        }

        // ── Máquina de estados ──
        this._state = StatusEnemy.IDLE;

        // ── Timers internos ──
        this._knockbackUntil        = 0;
        this._visionAlertFlashUntil = 0;
        this._lastQuackTime         = 0;
        this._quackCooldown         = 100;

        // ── Combate ──
        this._inRangeStartTime     = 0;
        this._attackDelay          = 800;
        this._inRangeLeaveCooldown = 500;

        // ── Strafing ──
        this._strafeDirection      = Math.random() < 0.5 ? -1 : 1;
        this._nextStrafeSwitchTime = 0;

        // ── Esquiva de proyectiles ──
        this._lastDodgeTime             = 0;
        this._dodgeCooldown             = 900;
        this._dodgeDuration             = 180;
        this._dodgeSpeedMultiplier      = 2.2;
        this._projectileAwarenessRadius = 140;
        // Dirección de esquiva: se alterna para evitar zigzag errático
        this._currentDodgeDir = 0;

        // ── Memoria — última posición conocida del jugador ──
        // Permite que el enemigo vaya al último punto visto aunque pierda LOS
        this._lastKnownPlayerX = null;
        this._lastKnownPlayerY = null;
        this._lastSeenTime     = 0;
        this._memoryDuration   = 4000; // ms que recuerda la posición antes de ir a SEARCH

        // ── Reposicionamiento (sin línea de visión) ──
        this._reposStrafeDir       = Math.random() < 0.5 ? -1 : 1;
        this._reposNextSwitchTime  = 0;
        this._reposStuckCheckTimer = 0;
        this._reposLastX           = 0;
        this._reposLastY           = 0;
        this._reposStuckThreshold  = 8;   // píxeles mínimos de movimiento para no considerarse atascado
        this._reposStuckCheckMs    = 600; // cada cuánto ms se comprueba si está atascado

        // ── Búsqueda ──
        this._searchStartTime        = 0;
        this._searchDuration         = 2000;
        this._searchTurns            = 2;
        this._searchStartFacingAngle = this._facingAngle;

        // ── Visual de daño ──
        this._spriteBaseKey  = this._resolveSpriteBaseKey(texture);
        this._isShowingHit   = false;
        this._hitUntil       = 0;
        this._hitDuration    = 220;

        // ── Loot ──
        this.lootTable   = [];
        this.specialDrop = null;
        this.breadDropCount = 3;

        this.weaponMap = { arco: Arco, mcuaktro: Mcuaktro, cuchillo: Cuchillo, mazo: Mazo, ramita: Ramita, escoba: Escoba };

        this.equipWeapon(weapon);
        this.drawVision({ color: 0xff0000, fillAlpha: 0.08 });
    }

    // ─────────────────────────────────────────
    //  MÁQUINA DE ESTADOS
    // ─────────────────────────────────────────

    _transitionTo(newState, context = {}) {
        if (this._state === newState) return;
        this._onExitState(this._state, newState, context);
        const prevState = this._state;
        this._state = newState;
        this._onEnterState(newState, prevState, context);
    }

    _onExitState(exitingState, _nextState, _context) {
        if (exitingState === StatusEnemy.ALERTED) {
            if (this.tintTopLeft !== 0xFF0000) this.clearTint();
        }
    }

    _onEnterState(enteringState, _prevState, context) {
        const now = this.scene?.time?.now ?? 0;

        switch (enteringState) {
            case StatusEnemy.ALERTED:
                this._visionAlertFlashUntil = now + 500;
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
                this._lastKnownPlayerX = null;
                this._lastKnownPlayerY = null;
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
    //  HOOKS — sobreescribir en subclases
    // ─────────────────────────────────────────

    onAlerted(_context) {}
    onStartSearch(_context) {}
    onReturnIdle(_context) {}
    onDead(_context) {}
    onStunned(_context) {}

    /**
     * Movimiento en rango óptimo con LOS.
     * Por defecto: strafing con cambio de dirección aleatorio.
     * Sobreescribir en subclases (ej. mapache que carga, zorro que hace
     * strafing más agresivo, etc.)
     */
    onCombatMovement(target, _dist) {
        const now = this.scene?.time?.now ?? 0;
        if (!this._nextStrafeSwitchTime || now >= this._nextStrafeSwitchTime) {
            this._strafeDirection     *= -1;
            this._nextStrafeSwitchTime = now + Phaser.Math.Between(700, 1400);
        }
        this.moveLateral(target, 0.55, this._strafeDirection);
    }

    /**
     * Movimiento cuando el jugador está fuera del rango de ataque.
     * Por defecto: aproximación directa.
     */
    onChaseMovement(target, _dist) {
        this.moveTowards(target);
    }

    /**
     * Movimiento cuando el jugador está demasiado cerca.
     * Por defecto: retroceder directamente.
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
        while (diff > Math.PI)  diff -= Math.PI * 2;
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
                const tileWidth  = layer.tilemap.tileWidth  * layer.scaleX;
                const tileHeight = layer.tilemap.tileHeight * layer.scaleY;
                const tileRect   = new Phaser.Geom.Rectangle(
                    tile.pixelX * layer.scaleX,
                    tile.pixelY * layer.scaleY,
                    tileWidth,
                    tileHeight
                );
                if (Phaser.Geom.Intersects.LineToRectangle(line, tileRect)) return false;
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
            // Actualizar memoria de posición
            this._lastKnownPlayerX = player.x;
            this._lastKnownPlayerY = player.y;
            this._lastSeenTime     = time;

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
    //  MOVIMIENTO BASE
    // ─────────────────────────────────────────

    moveTowards(target) {
        if (!target || typeof target.x !== 'number') { this.body?.setVelocity(0, 0); return; }
        const dx   = target.x - this.x;
        const dy   = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    moveTowardsPoint(px, py) {
        const dx   = px - this.x;
        const dy   = py - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    moveAwayFrom(target) {
        if (!target || typeof target.x !== 'number') { this.body?.setVelocity(0, 0); return; }
        const dx   = this.x - target.x;
        const dy   = this.y - target.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    /**
     * Strafing perpendicular al objetivo.
     * @param {object} target
     * @param {number} speedMultiplier — fracción de this._speed
     * @param {number} direction — 1 o -1
     */
    moveLateral(target, speedMultiplier = 0.4, direction = 1) {
        if (!target) { this.stop(); return; }
        const dx   = target.x - this.x;
        const dy   = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.stop(); return; }
        const perpX = (-dy / dist) * direction;
        const perpY = ( dx / dist) * direction;
        this.body.setVelocity(perpX * this._speed * speedMultiplier, perpY * this._speed * speedMultiplier);
    }

    /**
     * Mezcla de aproximación y strafing.
     * Útil para rodear obstáculos manteniéndose orientado al objetivo.
     * @param {object} target
     * @param {number} chaseRatio — 0..1 (cuánto va hacia el objetivo vs lateral)
     * @param {number} lateralDir — 1 o -1
     */
    moveBlended(target, chaseRatio = 0.6, lateralDir = 1) {
        if (!target) { this.stop(); return; }
        const dx   = target.x - this.x;
        const dy   = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.stop(); return; }

        const fwdX     = dx / dist;
        const fwdY     = dy / dist;
        const perpX    = (-dy / dist) * lateralDir;
        const perpY    = ( dx / dist) * lateralDir;
        const latRatio = 1 - chaseRatio;

        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity(
            (fwdX * chaseRatio + perpX * latRatio) * this._speed,
            (fwdY * chaseRatio + perpY * latRatio) * this._speed
        );
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

    // ─────────────────────────────────────────
    //  ESQUIVA DE PROYECTILES
    // ─────────────────────────────────────────

    /**
     * Detecta proyectiles enemigos que se aproximan y esquiva perpendicularmente.
     * La dirección se alterna cada esquiva para evitar zigzag errático.
     */
    tryDodgeIncomingProjectiles(time = this.scene?.time?.now ?? 0) {
        if (!this.scene?.projectiles || !this.body || this.isDead()) return;
        if (time < this._lastDodgeTime + this._dodgeCooldown) return;

        const projectiles = this.scene.projectiles.getChildren?.() ?? [];

        for (const projectile of projectiles) {
            if (!projectile?.active) continue;
            // Solo esquivar proyectiles del jugador
            if (projectile.team === 'enemy') continue;

            const dx     = this.x - projectile.x;
            const dy     = this.y - projectile.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > this._projectileAwarenessRadius * this._projectileAwarenessRadius) continue;

            const vx = projectile.body?.velocity?.x ?? 0;
            const vy = projectile.body?.velocity?.y ?? 0;
            if (Math.abs(vx) < 1 && Math.abs(vy) < 1) continue;

            // Solo esquivar si el proyectil viene hacia el enemigo
            const towardDot = dx * vx + dy * vy;
            if (towardDot <= 0) continue;

            const projSpeed = Math.hypot(vx, vy);
            if (projSpeed < 1) continue;

            // Alternar dirección de esquiva en cada dodge
            this._currentDodgeDir = this._currentDodgeDir === 0
                ? (Math.random() < 0.5 ? 1 : -1)
                : -this._currentDodgeDir;

            const perpX = -vy / projSpeed;
            const perpY =  vx / projSpeed;

            this.body.setVelocity(
                perpX * this._speed * this._dodgeSpeedMultiplier * this._currentDodgeDir,
                perpY * this._speed * this._dodgeSpeedMultiplier * this._currentDodgeDir
            );

            this._lastDodgeTime  = time;
            this._knockbackUntil = time + this._dodgeDuration;
            return;
        }
    }

    // ─────────────────────────────────────────
    //  REPOSICIONAMIENTO SIN LOS
    // ─────────────────────────────────────────

    /**
     * Intenta rodear el obstáculo que bloquea la LOS usando moveBlended.
     * Si detecta que está atascado (apenas se ha movido), invierte la dirección
     * de rodeo para salir del bloqueo.
     *
     * @param {{x:number, y:number}} target — último punto conocido del jugador
     * @param {number} now — timestamp actual
     */
    _repositionTowardsTarget(target, now) {
        // Cambiar dirección de rodeo periódicamente
        if (!this._reposNextSwitchTime || now >= this._reposNextSwitchTime) {
            this._reposStrafeDir     *= -1;
            this._reposNextSwitchTime = now + Phaser.Math.Between(500, 1100);
        }

        // Detección de atasco
        this._reposStuckCheckTimer = (this._reposStuckCheckTimer ?? 0) + this.scene.game.loop.delta;
        if (this._reposStuckCheckTimer >= this._reposStuckCheckMs) {
            const moved = Math.hypot(this.x - this._reposLastX, this.y - this._reposLastY);
            if (moved < this._reposStuckThreshold) {
                // Invertir dirección inmediatamente
                this._reposStrafeDir     *= -1;
                this._reposNextSwitchTime = now + Phaser.Math.Between(400, 900);
            }
            this._reposLastX           = this.x;
            this._reposLastY           = this.y;
            this._reposStuckCheckTimer = 0;
        }

        const dist       = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const chaseRatio = dist > 200 ? 0.65 : 0.4; // más lateral cuando ya está cerca del último punto
        this.moveBlended(target, chaseRatio, this._reposStrafeDir);
    }

    // ─────────────────────────────────────────
    //  COMBATE PRINCIPAL
    // ─────────────────────────────────────────

    movementAlerted(target) {
        if (!this.isAlerted() || !target) return;

        const now         = this.scene.time.now;
        const dist        = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const optimalDist = this.weapon?.optimalDistance ?? 200;
        const range       = this.weapon?.range ?? 300;
        const hasLOS      = this.hasLineOfSight(target);

        // Actualizar memoria si hay LOS
        if (hasLOS) {
            this._lastKnownPlayerX = target.x;
            this._lastKnownPlayerY = target.y;
            this._lastSeenTime     = now;
        }

        // ── Sin LOS: ir al último punto conocido intentando rodear el obstáculo ──
        if (!hasLOS) {
            this._inRangeStartTime = 0;

            const memoryValid = this._lastKnownPlayerX !== null
                && (now - this._lastSeenTime) < this._memoryDuration;

            if (memoryValid) {
                const memTarget  = { x: this._lastKnownPlayerX, y: this._lastKnownPlayerY };
                const distToMem  = Phaser.Math.Distance.Between(this.x, this.y, memTarget.x, memTarget.y);

                if (distToMem < 30) {
                    // Llegó al último punto conocido pero sin ver al jugador → buscar
                    this._transitionTo(StatusEnemy.SEARCH, { time: now });
                } else {
                    this._repositionTowardsTarget(memTarget, now);
                }
            } else {
                // Memoria expirada → buscar
                this._transitionTo(StatusEnemy.SEARCH, { time: now });
            }

            return;
        }

        // ── Con LOS ──

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

        // En rango óptimo
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
            this._applyRouteFacingForPoint(data.currentPointIndex);
            data.currentPointIndex = (data.currentPointIndex + 1) % points.length;
            data.pauseTimer        = 0;
            return;
        }

        data.pauseTimer = (data.pauseTimer ?? 0) + this.scene.game.loop.delta;
        if (data.pauseTimer < 1000) { this.stop(); return; }

        this.moveTowards(currentTarget);
    }

    _directionToAngle(direction) {
        const normalized = this._normalizeFacingDirection(direction);
        switch (normalized) {
            case 'right': return 0;
            case 'down':  return Math.PI / 2;
            case 'left':  return Math.PI;
            case 'up':    return -Math.PI / 2;
            default:      return null;
        }
    }

    setFacingDirection(direction) {
        const normalized = this._normalizeFacingDirection(direction);
        const angle = this._directionToAngle(normalized);
        if (angle == null) return false;

        this._facingAngle = angle;
        if (normalized === 'right') this.setFlipX(true);
        if (normalized === 'left') this.setFlipX(false);
        return true;
    }

    setRouteFacing(routeFacing) {
        this._routeFacing = this._sanitizeRouteFacing(routeFacing);
        if (this._routeFacing[0]) {
            this.setFacingDirection(this._routeFacing[0]);
        } else {
            this.setFacingDirection('left');
        }
    }

    _applyRouteFacingForPoint(pointIndex) {
        const facingList = (this._routeFacing?.length ? this._routeFacing : this._movementData?.routeFacing);
        if (!Array.isArray(facingList) || facingList.length === 0) return;
        const direction = facingList[pointIndex];
        if (!direction) return;
        this.setFacingDirection(direction);
    }

    _normalizeFacingDirection(direction) {
        const raw = String(direction ?? '').trim().toLowerCase();
        if (!raw) return null;

        const aliases = {
            izquierda: 'left',
            izq: 'left',
            left: 'left',
            l: 'left',
            derecha: 'right',
            der: 'right',
            right: 'right',
            r: 'right',
            arriba: 'up',
            up: 'up',
            u: 'up',
            abajo: 'down',
            down: 'down',
            d: 'down'
        };

        return aliases[raw] ?? null;
    }

    _sanitizeRouteFacing(routeFacing) {
        let entries = [];

        if (Array.isArray(routeFacing)) {
            entries = routeFacing;
        } else if (typeof routeFacing === 'string') {
            const raw = routeFacing.trim();
            if (!raw) return [];

            if (raw.startsWith('[') && raw.endsWith(']')) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) entries = parsed;
                } catch {
                    // Si no es JSON válido, se procesa como lista separada por delimitadores.
                }
            }

            if (entries.length === 0) {
                entries = raw.split(/[,;|]/);
            }
        } else if (routeFacing != null) {
            entries = [routeFacing];
        }

        return entries
            .map((entry) => this._normalizeFacingDirection(entry))
            .filter(Boolean);
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
        if (!this._lastDamageSound || this.scene.time.now > this._lastDamageSound + 100) {
            this.scene.sound.play('damage_hit', { volume: 0.6 });
            this._lastDamageSound = this.scene.time.now;
        }
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

        this.scene.sound.play('enemy_death', {
            volume: 0.7,
            rate: Phaser.Math.FloatBetween(0.92, 1.08)
        });

        this.dropWeapon();
        this.dropFeather();
        this.dropBread();
        this.dropSpecialItem();

        const dedTexture = this._textureKeyFor('ded');
        if (dedTexture && this.scene.textures.exists(dedTexture)) {
            this.anims?.stop();
            this.setTexture(dedTexture);
        } else {
            const fallback = `${this.texture.key}_corpse`;
            if      (this.scene.textures.exists(fallback))       this.setTexture(fallback);
            else if (this.scene.textures.exists('enemy_corpse')) this.setTexture('enemy_corpse');
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

    _randomDropOffset(minRadius = 50, maxRadius = 120) {
        const angle  = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const radius = Phaser.Math.FloatBetween(minRadius, maxRadius);
        return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius };
    }

    _findValidDropPosition(minRadius = 50, maxRadius = 120, attempts = 24) {
        const layers = [
            this.scene?.colisionLayer,
            this.scene?.vallaLayer,
            this.scene?.desnivelLayer,
            this.scene?.puertaCerradaLayer,
            this.scene?.zonasAcuaticasLayer
        ].filter(Boolean);

        for (let i = 0; i < attempts; i++) {
            const angle  = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const radius = Phaser.Math.FloatBetween(minRadius, maxRadius);
            const x = this.x + Math.cos(angle) * radius;
            const y = this.y + Math.sin(angle) * radius;

            const dropArea = new Phaser.Geom.Rectangle(x - 14, y - 14, 28, 28);
            let blocked = false;

            for (const layer of layers) {
                const tiles = layer.getTilesWithinShape(dropArea, { isNotEmpty: true });
                if (!tiles.length) continue;

                const line = new Phaser.Geom.Line(this.x, this.y, x, y);
                for (const tile of tiles) {
                    if (!tile) continue;
                    const tileWidth  = layer.tilemap.tileWidth  * layer.scaleX;
                    const tileHeight = layer.tilemap.tileHeight * layer.scaleY;
                    const tileRect   = new Phaser.Geom.Rectangle(
                        tile.pixelX * layer.scaleX,
                        tile.pixelY * layer.scaleY,
                        tileWidth,
                        tileHeight
                    );
                    if (Phaser.Geom.Intersects.LineToRectangle(line, tileRect)) {
                        blocked = true;
                        break;
                    }
                }

                if (blocked) break;
            }

            if (blocked) continue;

            return { x, y };
        }

        return { x: this.x, y: this.y };
    }

    dropWeapon() {
        if (!this.weapon) return;
        const spawnPoint = this._findValidDropPosition();
        new DropWeapon(this.scene, spawnPoint.x, spawnPoint.y, this.weapon.constructor, this.weapon.texture.key);
        this.weapon.destroy();
        this.weapon = null;
    }

    dropFeather() {
        if (!this.hasFeather) return;
        const spawnPoint = this._findValidDropPosition();
        new DropFeather(this.scene, spawnPoint.x, spawnPoint.y);
    }

    dropBread() {
        const breadCount = Math.max(0, Math.floor(this.breadDropCount ?? 3));
        for (let i = 0; i < breadCount; i++) {
            const spawnPoint = this._findValidDropPosition();
            new DropBread(this.scene, spawnPoint.x, spawnPoint.y);
        }
    }

    dropSpecialItem() {
        if (!this.specialDrop) return;
        const spawnPoint = this._findValidDropPosition();
        switch (this.specialDrop) {
            case 'mask': new DropMask(this.scene, spawnPoint.x, spawnPoint.y); break;
            case 'tail': new DropTail(this.scene, spawnPoint.x, spawnPoint.y); break;
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

        const spawnPoint = this._findValidDropPosition(60, 90, 30);

        if      (selectedItem.id === 'mask') new DropMask(this.scene, spawnPoint.x, spawnPoint.y);
        else if (selectedItem.id === 'tail') new DropTail(this.scene, spawnPoint.x, spawnPoint.y);
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

    flashRed(duration = 220) {
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

    _textureKeyFor(state) { return this._spriteBaseKey ? `${this._spriteBaseKey}_${state}` : null; }
    _animKeyFor(state)    { return this._spriteBaseKey ? `${this._spriteBaseKey}-${state}` : null; }

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
    //  PREUPDATE
    // ─────────────────────────────────────────

    preUpdate(time, delta) {
        // La esquiva tiene prioridad sobre el resto del movimiento
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

    mostrarNombre()    { console.log(`Mi nombre es ${this._nombre}`); }
    getHP()            { return this._hp; }
    getState()         { return this._state; }
    isDead()           { return this._state === StatusEnemy.DEAD; }
    isAlerted()        { return this._state === StatusEnemy.ALERTED; }
    isStunned()        { return this._state === StatusEnemy.STUNNED; }
    setVisionRadius(r) { this._visionRadius = r; }

    setState(state) {
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