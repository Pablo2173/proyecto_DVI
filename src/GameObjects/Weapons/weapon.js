import Phaser from 'phaser';

/**
 * Weapon — clase única que unifica armas de distancia y melee.
 *
 * config {
 *   texture        : string        — clave del sprite ya cargado
 *   isRanged       : boolean       — true → proyectil | false → melee
 *   projectileClass: Class | null  — clase del proyectil (solo si isRanged)
 *   projectileSpeed: number        — velocidad del proyectil (default 600)
 *   damage         : number        — daño base (default 10)
 *   attackSpeed    : number        — ms entre ataques (default 500)
 *   durability     : number        — golpes que puede soportar el arma (default null)
 *   range          : number        — radio máximo del arma (default 800)
 *   optimalDistance: number        — distancia mínima recomendada (default range*0.7)
 *   swingAngle     : number        — amplitud del swing melee en grados (default 60)
 *   swingDuration  : number        — duración del swing en ms (default 120)
 *   scale          : number        — escala del sprite (default 1)
 *   spriteAngleOffset: number      — corrección angular del sprite (default 0)
 *   debug          : boolean       — dibuja círculos de range/optimalDistance
 * }
 */
export default class Weapon extends Phaser.GameObjects.Sprite {

    constructor(scene, owner, config = {}) {
        const texture = config.texture ?? '__DEFAULT';
        super(scene, owner.x, owner.y, texture);
        scene.add.existing(this);

        // ── Referencias ──
        this.scene = scene;
        this.owner = owner;

        // ── Tipo ──
        this.isRanged = config.isRanged ?? false;
        this.projectileClass = config.projectileClass ?? null;
        this.projectileSpeed = config.projectileSpeed ?? 600;

        // ── Estadísticas ──
        this.damage = config.damage ?? 10;
        this.attackSpeed = config.attackSpeed ?? 500;
        this.lastAttackTime = 0;
        this.isAttacking = false;
        this.baseDurability = this.isEnemy
            ? null
            : (Number.isFinite(Number(config.durability)) ? Math.max(1, Math.floor(Number(config.durability))) : null);
        this.maxDurability = this._getScaledDurability(this.baseDurability);
        this.durability = this.maxDurability;

        // ── Método para obtener daño con multiplicadores ──
        this.getDamage = () => {
            const temporaryDamageMult = this.owner?.damageMultiplier || 1;
            const baseAttackBonus = Math.max(0, Number(this.owner?.baseAttackBonusPercent) || 0);
            return this.damage * temporaryDamageMult * (1 + baseAttackBonus);
        };
        this.range = config.range ?? 800;
        this.optimalDistance = config.optimalDistance ?? this.range * 0.7;
        this.accuracy = Phaser.Math.Clamp(config.accuracy ?? 0, 0, 180);

        // ── Melee ──
        this.swingAngle = config.swingAngle ?? 60;
        this.swingDuration = config.swingDuration ?? 120;

        // ── Visual ──
        this.spriteAngleOffset = config.spriteAngleOffset ?? 0;
        this.setScale(config.scale ?? 1);
        this.setOrigin(0, 0.5);  // origen en la "empuñadura"

        // ── Debug ──
        this.debugMode = config.debug ?? false;
        this.debugGraphics = scene.add.graphics();
        this.debugGraphics.setDepth(9999);
    }

    // ─────────────────────────────────────────
    //  UPDATE — llamado cada frame desde el owner
    // ─────────────────────────────────────────
    update() {
        if (!this.owner || !this.scene) return;

        // 1. Sincronizar posición con el owner
        this.x = this.owner.x;
        this.y = this.owner.y;

        // ────LÓGICA PARA SWIMMING────
        if (this.owner.state === 4) {
            this.setVisible(false);
            return;     //no se puede hacer ninguna acción con el arma nadando
        } else { this.setVisible(true); }

        // 2. Rotar hacia el puntero o dirección del owner
        let angleDeg;
        if (this.owner._facingAngle !== undefined) {
            if (this.owner._state === 1) { // Solo apuntar al player si está alertado
                const player = this.scene.duck;
                if (player) {
                    const angleRad = Phaser.Math.Angle.Between(
                        this.owner.x, this.owner.y,
                        player.x, player.y
                    );
                    angleDeg = Phaser.Math.RadToDeg(angleRad) + this.spriteAngleOffset;
                } else {
                    angleDeg = 0; // fallback
                }
            } else {
                // Si no alertado, apuntar hacia la dirección que mira el enemigo
                angleDeg = Phaser.Math.RadToDeg(this.owner._facingAngle) + this.spriteAngleOffset;
            }
        } else {
            // Para el pato, hacia el puntero
            const pointer = this.scene.input.activePointer;
            const angleRad = Phaser.Math.Angle.Between(
                this.owner.x, this.owner.y,
                pointer.worldX, pointer.worldY
            );
            angleDeg = Phaser.Math.RadToDeg(angleRad) + this.spriteAngleOffset;
        }

        // Aplicar ángulo + corrección del sprite
        this.setAngle(angleDeg + this.spriteAngleOffset);

        // 3. Mirror vertical cuando el arma apunta hacia la izquierda
        //    para que el sprite no se vea al revés
        const wrapped = Phaser.Math.Angle.WrapDegrees(angleDeg);
        this.setFlipY(wrapped > 90 || wrapped < -90);

        // 4. Para enemigos, disparar automáticamente si el jugador está en rango y el enemigo está alertado
        if (this.owner._facingAngle !== undefined && this.owner._state === 1 && this.isRanged) {
            const player = this.scene.duck;
            if (player) {
                const dist = Phaser.Math.Distance.Between(this.owner.x, this.owner.y, player.x, player.y);
                if (dist <= this.range && this._canAttack()) {
                    this.attack();
                }
            }
        }

        // 5. Debug
        if (this.debugMode) {
            this._drawDebugCircles();
        } else {
            this.debugGraphics.clear();
        }
        if (this._canAttack())
            this.on_wait();
    }

    // ─────────────────────────────────────────
    //  ATTACK
    // ─────────────────────────────────────────
    attack() {
        if (!this._canAttack()) return;
        this.lastAttackTime = this.scene.time.now;

        this.on_shoot();

        // Si la acción de disparo destruyó el arma (por esto, mcuaktro barre todo), salir.
        if (!this.scene || !this.owner || !this.active) return;

        if (this.isRanged) {
            this._fireProjectile();
        } else {
            this._swingAnimation();
        }
    }

    _canAttack() {
        return (this.scene.time.now - this.lastAttackTime) >= this.attackSpeed
            && !this.isAttacking && this.barCanShoot() &&
            this.owner.state !== 4; // No se puede atacar nadando
    }

    _fireProjectile() {
        if (!this.projectileClass) {
            console.warn(`${this.constructor.name}: sin projectileClass definida.`);
            return;
        }

        // Ángulo base hacia el puntero o hacia el player si es enemigo
        let angle;
        if (this.owner._facingAngle !== undefined) {
            // Para enemigo, hacia el player
            const player = this.scene.duck;
            if (player) {
                angle = Phaser.Math.Angle.Between(
                    this.owner.x,
                    this.owner.y,
                    player.x,
                    player.y
                );
            } else {
                return; // no disparar si no hay player
            }
        } else {
            // Para el pato, hacia el puntero
            const pointer = this.scene.input.activePointer;
            angle = Phaser.Math.Angle.Between(
                this.owner.x,
                this.owner.y,
                pointer.worldX,
                pointer.worldY
            );
        }

        // ── Aplicar desviación según accuracy ──
        // accuracy = 0   → sin desviación
        // accuracy = 180 → ±90 grados
        if (this.accuracy > 0) {
            const maxDeviationRad = Phaser.Math.DegToRad(this.accuracy / 2);
            const deviation = Phaser.Math.FloatBetween(
                -maxDeviationRad,
                maxDeviationRad
            );
            angle += deviation;
        }

        // Dirección final
        const direction = new Phaser.Math.Vector2(
            Math.cos(angle),
            Math.sin(angle)
        );

        // Spawn en la punta del arma
        const length = this.displayWidth;
        const spawnX = this.owner.x + Math.cos(angle) * length;
        const spawnY = this.owner.y + Math.sin(angle) * length;

        new this.projectileClass(this.scene, spawnX, spawnY, {
            direction,
            speed: this.projectileSpeed,
            range: this.range,
            damage: this.getDamage(),
            owner: this.owner,
            team: this.owner?.team ?? 'neutral'
        });
    }

    // ── Melee ──
    _swingAnimation() {
        this.isAttacking = true;

        // La rotación actual del arma determina la dirección del golpe
        const baseAngle = this.angle;
        const halfSwing = this.swingAngle / 2;

        this.scene.tweens.add({
            targets: this,
            angle: baseAngle + this.swingAngle,
            duration: this.swingDuration,
            yoyo: true,
            ease: 'Power1',
            onComplete: () => {
                this.angle = baseAngle;
                this.isAttacking = false;
            }
        });
    }

    // ─────────────────────────────────────────
    //  DEBUG
    // ─────────────────────────────────────────
    _drawDebugCircles() {
        this.debugGraphics.clear();
        const cx = this.owner ? this.owner.x : this.x;
        const cy = this.owner ? this.owner.y : this.y;

        // Círculo exterior → range
        this.debugGraphics.lineStyle(2, 0xff0000, 0.4);
        this.debugGraphics.strokeCircle(cx, cy, this.range);

        // Círculo interior → optimalDistance
        this.debugGraphics.lineStyle(2, 0x00ff00, 0.4);
        this.debugGraphics.strokeCircle(cx, cy, this.optimalDistance);
    }

    // ─────────────────────────────────────────
    //  DESTROY
    // ─────────────────────────────────────────
    destroy(fromScene, options = {}) {
        const { notifyOwner = true } = options;

        // Notificar al dueño para gestión de arma rota
        if (notifyOwner && this.owner && typeof this.owner.onWeaponDestroyed === 'function') {
            this.owner.onWeaponDestroyed(this);
        }

        if (this.debugGraphics) {
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }
        super.destroy(fromScene);
    }

    consumeDurability(amount = 1) {
        if (typeof this.durability !== 'number') return false;
        if (amount <= 0) return false;

        this.durability = Math.max(0, this.durability - amount);

        if (this.durability <= 0) {
            this.destroy();
            return true;
        }

        return false;
    }

    onHitTarget(_target) {
        return this.consumeDurability(1);
    }

    _getScaledDurability(baseDurability) {
        if (typeof baseDurability !== 'number') return null;

        const durationBonus = Math.max(0, Number(this.owner?.weaponDurationBonusPercent) || 0);
        return Math.max(1, Math.ceil(baseDurability * (1 + durationBonus)));
    }

    applyOwnerDurationBonus() {
        if (typeof this.baseDurability !== 'number') return;

        const previousMaxDurability = this.maxDurability;
        const previousDurability = this.durability;

        this.maxDurability = this._getScaledDurability(this.baseDurability);

        if (typeof previousDurability === 'number' && typeof previousMaxDurability === 'number' && previousMaxDurability > 0) {
            const ratio = Phaser.Math.Clamp(previousDurability / previousMaxDurability, 0, 1);
            this.durability = Math.max(1, Math.ceil(this.maxDurability * ratio));
            return;
        }

        this.durability = this.maxDurability;
    }

    // ─────────────────────────────────────────
    //  PRELOAD (override en subclases o helpers)
    // ─────────────────────────────────────────
    static preload(scene) { }

    setBar(combatBar) {
        this.bar = combatBar
        this.on_equip();
    }

    get isEnemy() {
        return this.owner?._facingAngle !== undefined;
    }

    // Funciones a implementar para las armas especificas

    on_equip() { }    // Called when you equip the weapon
    on_shoot() { }    // Called when shooting a bullet
    onDash() { }      // Called when the owner finishes a dash
    on_wait() { }     // Called while not shooting
    barCanShoot() { return true }  // Called before shoot, after cooldown, to see if the bar state is acceptable for the weapon

}