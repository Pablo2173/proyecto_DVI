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
        this.scene  = scene;
        this.owner  = owner;

        // ── Tipo ──
        this.isRanged        = config.isRanged        ?? false;
        this.projectileClass = config.projectileClass ?? null;
        this.projectileSpeed = config.projectileSpeed ?? 600;

        // ── Estadísticas ──
        this.damage      = config.damage      ?? 10;
        this.attackSpeed = config.attackSpeed ?? 500;
        this.lastAttackTime = 0;
        this.isAttacking    = false;

        // ── Radios de combate ──
        this.range           = config.range           ?? 800;
        this.optimalDistance = config.optimalDistance ?? this.range * 0.7;
        this.accuracy = Phaser.Math.Clamp(config.accuracy ?? 0, 0, 180);

        // ── Melee ──
        this.swingAngle    = config.swingAngle    ?? 60;
        this.swingDuration = config.swingDuration ?? 120;

        // ── Visual ──
        this.spriteAngleOffset = config.spriteAngleOffset ?? 0;
        this.setScale(1);
        this.setOrigin(0, 0.5);  // origen en la "empuñadura"

        // ── Debug ──
        this.debugMode     = config.debug ?? false;
        this.debugGraphics = scene.add.graphics();
        this.debugGraphics.setDepth(9999);

        //this.on_equip();
    }

    // ─────────────────────────────────────────
    //  UPDATE — llamado cada frame desde el owner
    // ─────────────────────────────────────────
    update() {
        if (!this.owner || !this.scene) return;

        // 1. Sincronizar posición con el owner
        this.x = this.owner.x;
        this.y = this.owner.y;

        // 2. Rotar hacia el puntero
        const pointer  = this.scene.input.activePointer;
        const angleRad = Phaser.Math.Angle.Between(
            this.owner.x, this.owner.y,
            pointer.worldX, pointer.worldY
        );
        const angleDeg = Phaser.Math.RadToDeg(angleRad);

        // Aplicar ángulo + corrección del sprite
        this.setAngle(angleDeg + this.spriteAngleOffset);

        // 3. Mirror vertical cuando el arma apunta hacia la izquierda
        //    para que el sprite no se vea al revés
        const wrapped = Phaser.Math.Angle.WrapDegrees(angleDeg);
        this.setFlipY(wrapped > 90 || wrapped < -90);

        // 4. Debug
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

        if (this.isRanged) {
            this._fireProjectile();
        } else {
            this._swingAnimation();
        }
    }

    _canAttack() {
        return (this.scene.time.now - this.lastAttackTime) >= this.attackSpeed
            && !this.isAttacking && this.barCanShoot();
    }

    _fireProjectile() {
        if (!this.projectileClass) {
            console.warn(`${this.constructor.name}: sin projectileClass definida.`);
            return;
        }

        const pointer = this.scene.input.activePointer;

        // Ángulo base hacia el puntero
        let angle = Phaser.Math.Angle.Between(
            this.owner.x,
            this.owner.y,
            pointer.worldX,
            pointer.worldY
        );

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
            damage: this.damage
        });
    }

    // ── Melee ──
    _swingAnimation() {
        this.isAttacking = true;

        // La rotación actual del arma determina la dirección del golpe
        const baseAngle = this.angle;
        const halfSwing = this.swingAngle / 2;

        this.scene.tweens.add({
            targets:  this,
            angle:    baseAngle + this.swingAngle,
            duration: this.swingDuration,
            yoyo:     true,
            ease:     'Power1',
            onComplete: () => {
                this.angle       = baseAngle;
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
    destroy(fromScene) {
        if (this.debugGraphics) {
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }
        super.destroy(fromScene);
    }

    // ─────────────────────────────────────────
    //  PRELOAD (override en subclases o helpers)
    // ─────────────────────────────────────────
    static preload(scene) {}

    setBar(combatBar){
        this.bar = combatBar
    }

    // Funciones a implementar para las armas especificas

    on_equip(){}    // Called when you equip the weapon
    on_shoot(){}    // Called when shooting a bullet
    on_wait(){}     // Called while not shooting
    barCanShoot(){return true}  // Called before shoot, after cooldown, to see if the bar state is acceptable for the weapon
    
}