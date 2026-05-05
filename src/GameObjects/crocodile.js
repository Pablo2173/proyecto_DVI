import Phaser from 'phaser';
import Enemy, { StatusEnemy } from './enemy.js';
import BubblesCroco from './Projectiles/bubblesCroco.js';

// ─────────────────────────────────────────
//  ESTADOS PROPIOS DEL COCODRILO
//  (complementan StatusEnemy; SWIMMING es
//   el único estado exclusivo de Crocodile)
// ─────────────────────────────────────────
const CrocoState = Object.freeze({
    IDLE:     'idle',
    WALKING:  'walking',
    SWIMMING: 'swimming',
    ALERTED:  'alerted',
    SEARCH:   'search',
    DEAD:     'dead'
});

export default class Crocodile extends Enemy {

    // ─────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────
    constructor(scene, name, x, y, texture, frame = null) {
        // Enemy espera: scene, name, x, y, texture, frame,
        //              visionRadius, hp, speed, weapon, movementType, hasFeather
        // El cocodrilo NO usa arma → null; tampoco suelta pluma → false
        super(
            scene,
            name,
            x, y,
            texture ?? 'croco_idle',
            frame,
            /*visionRadius*/ 400,   // usaremos alertRadius como visión base
            /*hp*/           120,
            /*speed*/        200,
            /*weapon*/       null,
            /*movementType*/ null,
            /*hasFeather*/   false
        );

        // ── Stats propios ──
        this.damage  = 2;

        // ── Radios diferenciados por terreno ──
        this.attackRadius = 200;    // melee (walking)
        this.alertRadius  = 400;

        this._swimAttackRadius = 400;   // ranged (swimming)
        this._swimAlertRadius  = 200;

        // ── Estado de terreno ──
        this._isSwimming = false;   // flag sincronizado con el tile layer

        // ── Gracia de entrada al agua ──
        // Durante este tiempo tras entrar en swimming NO se aplica
        // movimiento evasivo, evitando que el croco rebote hacia tierra.
        this._swimEntryGraceMs    = 600;  // ms de gracia tras entrar en agua
        this._swimEntryGraceUntil = 0;    // timestamp hasta el que dura la gracia

        // ── Ataque ──
        this.isAttacking    = false;
        this.attackCooldown = 2000;
        this.lastAttackTime = 0;

        // ── Búsqueda ──
        this._lastKnownX = null;
        this._lastKnownY = null;

        // ── Control de transición de terreno (debounce) ──
        this._terrainDebounceMs   = 120;
        this._pendingInWater      = null;
        this._terrainPendingSince = 0;

        // ── Ajustar física al tamaño del cocodrilo ──
        if (this.body) {
            this.body.setSize(28, 28);
            this.body.setOffset(2, 2);
        }

        // ── Sprite inicial ──
        this.setTexture('croco_idle');
        this.setScale(3);
        this.setDepth(10);

        // ── Enemy configura _visionRadius = alertRadius ──
        //    Redefinir para que coincida con el radio según terreno
        this._visionRadius = this.alertRadius;
        // Ángulo de visión: 360° para que detecte en todas direcciones
        this._visionAngle = Math.PI * 2;

        // ── Debug radios (siempre visibles) ──
        this._debugGraphics = scene.add.graphics();
        this._debugGraphics.setDepth(999);
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

    _updateTerrainState(now) {
        if (this._state === StatusEnemy.DEAD) return;

        const inWater = this._isInWater();

        // Si el terreno coincide con el estado actual, resetear cualquier cambio pendiente
        if (inWater === this._isSwimming) {
            this._pendingInWater      = null;
            this._terrainPendingSince = 0;
            return;
        }

        // Nuevo valor de terreno detectado — iniciar o continuar debounce
        if (this._pendingInWater !== inWater) {
            this._pendingInWater      = inWater;
            this._terrainPendingSince = now;
            return;
        }

        // El cambio pendiente lleva menos tiempo del umbral → esperar
        if (now - this._terrainPendingSince < this._terrainDebounceMs) return;

        // El cambio se ha mantenido estable el tiempo suficiente → aplicar transición
        this._pendingInWater      = null;
        this._terrainPendingSince = 0;

        const wasSwimming = this._isSwimming;
        this._isSwimming  = inWater;

        // Al entrar en agua: iniciar período de gracia para que el croco
        // se estabilice dentro antes de aplicar movimiento evasivo
        if (!wasSwimming && inWater) {
            this._swimEntryGraceUntil = now + this._swimEntryGraceMs;
            this.body?.setVelocity(0, 0);
        }

        // Actualizar radio de visión de Enemy según terreno
        this._visionRadius = this._activeAlertRadius();

        // Sincronizar sprite de terreno
        this._idleSprite();
    }

    // ─────────────────────────────────────────
    //  RADIOS ACTIVOS SEGÚN TERRENO
    // ─────────────────────────────────────────

    _activeAttackRadius() {
        return this._isSwimming ? this._swimAttackRadius : this.attackRadius;
    }

    _activeAlertRadius() {
        return this._isSwimming ? this._swimAlertRadius : this.alertRadius;
    }

    // ─────────────────────────────────────────
    //  DIBUJO DE RADIOS (siempre visibles)
    // ─────────────────────────────────────────

    _drawDebugRadii() {
        if (!this._debugGraphics) return;

        this._debugGraphics.clear();

        // Radio de alerta — amarillo
        this._debugGraphics.lineStyle(1, 0xffff00, 0.6);
        this._debugGraphics.strokeCircle(this.x, this.y, this._activeAlertRadius());

        // Radio de ataque — rojo
        this._debugGraphics.lineStyle(1, 0xff0000, 0.6);
        this._debugGraphics.strokeCircle(this.x, this.y, this._activeAttackRadius());
    }

    // ─────────────────────────────────────────
    //  SPRITE BASE SEGÚN TERRENO
    // ─────────────────────────────────────────

    _idleSprite() {
        this.setTexture(this._isSwimming ? 'croco_submerge' : 'croco_idle');
    }

    _attackSprite() {
        this.setTexture(this._isSwimming ? 'croco_bubble' : 'croco_attack');
    }

    // ─────────────────────────────────────────
    //  HOOKS DE Enemy — COMPORTAMIENTO DE COMBATE
    // ─────────────────────────────────────────

    /**
     * En WALKING: strafing estándar de Enemy (no se sobreescribe).
     * En SWIMMING: Enemy llamará a onRetreatMovement cuando esté
     *              demasiado cerca, pero nosotros queremos alejarse
     *              siempre que esté en radio de alerta. Se gestiona
     *              en onCombatMovement y onChaseMovement.
     */

    onCombatMovement(target, dist) {
        if (this._isSwimming) {
            // En agua: alejarse, pero solo si ya pasó la gracia de entrada
            this._fleeInsideWater(target);
        } else {
            // En tierra: strafing estándar de Enemy
            super.onCombatMovement(target, dist);
        }
    }

    onChaseMovement(target, dist) {
        if (this._isSwimming) {
            // En agua: aunque esté fuera del rango, alejarse igualmente
            this._fleeInsideWater(target);
        } else {
            // En tierra: persecución estándar de Enemy
            super.onChaseMovement(target, dist);
        }
    }

    onRetreatMovement(target, dist) {
        if (this._isSwimming) {
            this._fleeInsideWater(target);
        } else {
            super.onRetreatMovement(target, dist);
        }
    }

    // ─────────────────────────────────────────
    //  HUIDA SEGURA DENTRO DEL AGUA
    //  Calcula el vector de huida y lo cancela
    //  si la posición proyectada sale del agua,
    //  evitando que el croco rebote en la orilla.
    //  Durante el período de gracia de entrada
    //  el croco simplemente se queda quieto.
    // ─────────────────────────────────────────

    _fleeInsideWater(target) {
        if (!target || typeof target.x !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }

        const now = this.scene?.time?.now ?? 0;

        // Período de gracia: quedarse quieto para estabilizarse en el agua
        if (now < this._swimEntryGraceUntil) {
            this.body?.setVelocity(0, 0);
            return;
        }

        const angle = Phaser.Math.Angle.Between(target.x, target.y, this.x, this.y);
        const vx    = Math.cos(angle) * this._speed;
        const vy    = Math.sin(angle) * this._speed;

        // Comprobar si la posición proyectada (1 frame adelante ~16ms) sigue en agua
        const dt         = 0.016;
        const projX      = this.x + vx * dt;
        const projY      = this.y + vy * dt;
        const tileSize   = 16 * 4;
        const layer      = this.scene?.zonasAcuaticasLayer;
        const projInWater = layer
            ? !!layer.getTileAt(Math.floor(projX / tileSize), Math.floor(projY / tileSize))
            : false;

        if (!projInWater) {
            // El vector de huida sacaría al croco del agua → intentar
            // moverse lateralmente a lo largo de la orilla en su lugar
            const perpAngle = angle + Math.PI / 2;
            const pvx = Math.cos(perpAngle) * this._speed * 0.7;
            const pvy = Math.sin(perpAngle) * this._speed * 0.7;

            const ppX = this.x + pvx * dt;
            const ppY = this.y + pvy * dt;
            const perpInWater = layer
                ? !!layer.getTileAt(Math.floor(ppX / tileSize), Math.floor(ppY / tileSize))
                : false;

            if (perpInWater) {
                this.body?.setVelocity(pvx, pvy);
            } else {
                // Ambas direcciones salen → quedarse quieto (croco está en esquina)
                this.body?.setVelocity(0, 0);
            }
            return;
        }

        // Vector de huida válido: aplicar y orientar sprite
        this.body?.setVelocity(vx, vy);
        if (Math.abs(vx) > 1) this.setFlipX(vx < 0);
    }

    // ─────────────────────────────────────────
    //  ATAQUE — SOBREESCRIBE movementAlerted
    //  para inyectar el sistema de ataque propio
    //  (melee / proyectil) sin arma de Enemy
    // ─────────────────────────────────────────

    movementAlerted(target) {
        if (!this.isAlerted() || !target) return;

        const now      = this.scene.time.now;
        const dist     = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const alertR   = this._activeAlertRadius();
        const attackR  = this._activeAttackRadius();

        // Atacar si está en rango de ataque, sin cooldown activo y sin estar atacando ya
        if (dist <= attackR && !this.isAttacking && now >= this.lastAttackTime + this.attackCooldown) {
            this._executeAttack(target, now);
            return;
        }

        // Movimiento según terreno (hooks de arriba)
        if (!this.isAttacking) {
            if (dist < attackR * 0.65) {
                this.onRetreatMovement(target, dist);
            } else if (dist > alertR) {
                // Fuera de radio de alerta → dejar que Enemy gestione la búsqueda
                // delegando en super para que active SEARCH si procede
                super.movementAlerted(target);
                return;
            } else {
                this.onCombatMovement(target, dist);
            }
            this._idleSprite();
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
        this._attackSprite();

        if (this._isSwimming) {
            // ── Ranged: lanzar proyectil BubblesCroco ──
            this._shootBubble(player);
        } else {
            // ── Melee: daño directo al jugador ──
            player.takeDamage(this.damage);
            this.scene?.cameras?.main?.shake?.(200, 0.008);
        }

        // Finalizar ataque tras 500ms
        this.scene?.time?.delayedCall(500, () => {
            if (!this.active || this._state === StatusEnemy.DEAD) return;

            this.isAttacking = false;

            // Restaurar sprite según terreno actual
            this._idleSprite();
        });
    }

    // ─────────────────────────────────────────
    //  PROYECTIL (SWIMMING)
    // ─────────────────────────────────────────

    _shootBubble(player) {
        if (!player) return;

        // Asegurar que el grupo de proyectiles existe en la escena
        if (!this.scene.projectiles) return;

        const bubble = new BubblesCroco(this.scene, this.x, this.y, { team: 'enemy' });
        this.scene.projectiles.add(bubble);

        // Dirigir el proyectil hacia el jugador
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const speed = 300;
        bubble.body?.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    // ─────────────────────────────────────────
    //  HOOKS DE CICLO DE VIDA DE Enemy
    // ─────────────────────────────────────────

    onDead(_context) {
        console.log(`${this._nombre} ha muerto`);

        this.setTexture('croco_idle');
        this.setAlpha(0.5);

        this._debugGraphics?.destroy();
    }

    // ─────────────────────────────────────────
    //  DAÑO
    // ─────────────────────────────────────────

    afterTakeDamage(damage, previousHealth, newHealth) {
        console.log(`${this._nombre} recibió ${damage} de daño. HP: ${newHealth}`);

        if (!this.scene?.sound) return;

        if (!this._lastDamageSound || this.scene.time.now > this._lastDamageSound + 100) {
            this.scene.sound.play('damage_hit', { volume: 0.6 });
            this._lastDamageSound = this.scene.time.now;
        }
    }

    // ─────────────────────────────────────────
    //  PREUPDATE — FSM PRINCIPAL
    //  Enemy.preUpdate gestiona knockback,
    //  routing de estados y weaponBar.
    //  Aquí añadimos: terreno, debug radios
    //  y el override de _updateVisualState.
    // ─────────────────────────────────────────

    preUpdate(time, delta) {
        if (!this.active) return;
        if (this._state === StatusEnemy.DEAD) return;

        const player = this.scene?.duck;
        if (!player || !player.active) return;

        // Actualizar estado de terreno (agua / tierra) antes del tick de Enemy
        this._updateTerrainState(time);

        // Delegar FSM, knockback, detección, etc. a Enemy
        super.preUpdate(time, delta);

        // Actualizar awareness con radio activo según terreno
        // (Enemy.preUpdate no llama a updateAwareness; lo hacemos aquí
        //  si la escena no lo gestiona externamente)
        // this.updateAwareness(player, time); // ← descomentar si la escena no lo llama

        // Dibujar radios en cada frame (siempre visibles)
        this._drawDebugRadii();
    }

    // ─────────────────────────────────────────
    //  OVERRIDE DE VISUAL STATE
    //  Enemy._updateVisualState usa spriteBaseKey
    //  y animaciones estándar. El cocodrilo
    //  gestiona su propio sprite según terreno.
    // ─────────────────────────────────────────

    _updateVisualState(time) {
        if (this._state === StatusEnemy.DEAD) return;
        if (this.isAttacking) return; // el ataque ya puso su propio sprite

        this._idleSprite();
    }

    // ─────────────────────────────────────────
    //  STATIC PRELOAD
    // ─────────────────────────────────────────

    static preload(scene) {
        BubblesCroco.preload(scene);
    }

    // ─────────────────────────────────────────
    //  DESTROY
    // ─────────────────────────────────────────

    destroy(fromScene) {
        this._debugGraphics?.destroy();
        this._debugGraphics = null;
        super.destroy(fromScene);
    }
}

export { CrocoState };