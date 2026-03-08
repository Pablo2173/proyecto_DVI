import Phaser from 'phaser';

const StatusEnemy = {
    IDLE: 0,
    ALERTED: 1,
    DEAD: 2,
    STUNNED: 3
};

export default class Enemy extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {any} frame
     * @param {number} visionRadius
     * @param {number} hp
     */
    constructor(scene, name, x, y, texture, frame = null, visionRadius, hp, speed, weapon) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        scene.add.existing(this);

        // --- FÍSICA (top-down) ---
        if (scene.physics && scene.physics.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setCollideWorldBounds(true);
                this.body.setAllowGravity(false); // Sin gravedad porque estamos haciendo un top-down
                this.body.setImmovable(false);    // Basicamente lo pongo a false para que le puedan empujar

                this.body.setSize(64, 64); //falta poner el tamanyo del sprite, este es provisional
                this.body.setOffset(4, 4);
            }
        }

        this._nombre = name;
        this._hp = hp;
        this._visionRadius = visionRadius;
        this._facingAngle = Math.PI; //Lo he puesto en Math.PI para que empiece mirando para la izquierda
        this._visionAngle = Math.PI / 2; //Esto es un cuarto de circulo para el cono de vision
        this._speed = speed;
        this._weapon = weapon;
        this._state = StatusEnemy.IDLE;
        this._lastQuackTime = 0; // Para evitar alertas duplicadas del mismo quack
        this._quackCooldown = 100; // ms
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }

    /**
     * Mueve al enemigo hacia un target usando el body de física.
     * @param {{x: number, y: number}} target
     * @param {number} speed  píxeles/segundo
     */
    moveTowards(target) {
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
           this.body?.setVelocity(0, 0);
            return;
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) {
            this.body?.setVelocity(0, 0);
            return;
        }

        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity(
           (dx / dist) * this._speed,
            (dy / dist) * this._speed
        );
    }

    /**
     * Detiene el movimiento del enemigo.
     */
    stop() {
        this.body?.setVelocity(0, 0);
    }

    setVisionRadius(radius) {
        this._visionRadius = radius;
    }

    // target: objeto con propiedades {x, y} (en este caso es el sprite del patete)
    /**
     * Comprueba si el enemigo puede ver al target dentro de su cono de visión.
     * @param {{x: number, y: number}} target
     */
    canSee(target) {
        if (this._state === StatusEnemy.DEAD) return false;
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') return false;

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 > this._visionRadius * this._visionRadius) return false;

        const angleToTarget = Math.atan2(dy, dx);
        let diff = angleToTarget - this._facingAngle;
        while (diff > Math.PI)  diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        return Math.abs(diff) <= this._visionAngle / 2;
    }

    // Dibuja el radio de visión usando un Phaser 3 Graphics.
    // Parámetros:
    //  - graphics: Phaser.GameObjects.Graphics (requerido)
    //  - options: { color, fillAlpha, lineAlpha, lineWidth, clearBefore }
    drawVision(graphics, options = {}) {
        if (!graphics || typeof graphics.clear !== 'function') return;
        const {
            color = 0x00ff00,
            fillAlpha = 0.15,
            lineAlpha = 1,
            lineWidth = 1,
            clearBefore = true
        } = options;

        if (clearBefore) graphics.clear();

        const px = this.x;
        const py = this.y;

        const startAngle = this._facingAngle - (this._visionAngle / 2);
        const endAngle = this._facingAngle + (this._visionAngle / 2);

        // Si Graphics soporta arc/path
        if (typeof graphics.beginPath === 'function' && typeof graphics.arc === 'function' && typeof graphics.fillPath === 'function') {
            graphics.fillStyle(color, fillAlpha);
            graphics.lineStyle(lineWidth, color, lineAlpha);
            graphics.beginPath();
            graphics.moveTo(px, py);
            graphics.arc(px, py, this._visionRadius, startAngle, endAngle, false);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else {
            // Fallback: dibuja el círculo completo si no hay arc
            if (typeof graphics.fillStyle === 'function') {
                graphics.fillStyle(color, fillAlpha);
                graphics.fillCircle(px, py, this._visionRadius);
            } else if (typeof graphics.fillCircle === 'function') {
                graphics.fillCircle(px, py, this._visionRadius);
            }
            if (typeof graphics.lineStyle === 'function' && typeof graphics.strokeCircle === 'function') {
                graphics.lineStyle(lineWidth, color, lineAlpha);
                graphics.strokeCircle(px, py, this._visionRadius);
            }
        }
    }

    // Si el patete entra en el radio de vision del enemigo cambia su estado a alertado
    /**
     * Comprueba si el jugador es visible y alerta al enemigo.
     * @param {{x: number, y: number}} player
     * @returns {boolean} true si acaba de alertarse
     */
    detectAndAlert(player) {
        if (!player) return false;
        const seen = this.canSee(player);
        if (this._state === StatusEnemy.DEAD) return false;
        if (seen && this._state !== StatusEnemy.ALERTED) {
            this._state = StatusEnemy.ALERTED;
            return true;
        }
        return false;
    }

    isAlerted() {
        return this._state === StatusEnemy.ALERTED;
    }

    /**
     * Observador general para eventos de sonido
     * @param {object} audioEvent Datos del evento de sonido: { soundType, source, position, radius, time, intensity }
     */
    onAudioEvent(audioEvent) {
        if (!audioEvent || typeof audioEvent.time !== 'number') return;

        // Tipos de sonido que alertan al enemigo
        const alertingSounds = ['quack'];
        if (!alertingSounds.includes(audioEvent.soundType)) return;

        // Evita procesar múltiples eventos del mismo sonido
        if (audioEvent.time <= this._lastQuackTime + this._quackCooldown) return;

        this._lastQuackTime = audioEvent.time;

        // Verifica si el enemigo está dentro del radio del sonido
        if (!audioEvent.position) return;

        const dx = audioEvent.position.x - this.x;
        const dy = audioEvent.position.y - this.y;
        const distance = Math.hypot(dx, dy);
        const soundRadius = audioEvent.radius || 0;

        // Si está dentro del radio del sonido, se alerta
        if (distance <= soundRadius && this._state !== StatusEnemy.ALERTED) {
            this._state = StatusEnemy.ALERTED;
        }
    }



    getState() {
        return this._state;
    }

    setState(state) {
        this._state = state;
    }

    isDead() {
        return this._state === StatusEnemy.DEAD;
    }

    isStunned() {
        return this._state === StatusEnemy.STUNNED;
    }

    /**
     * Reduce el HP del enemigo por daño de un proyectil
     * @param {number} damage - cantidad de daño a recibir
     */
    takeDamage(damage) {
        // ignorar daño si ya está muerto
        if (this._state === StatusEnemy.DEAD) return;

        this._hp -= damage;
        console.log(`${this._nombre} recibió ${damage} de daño. HP actual: ${this._hp}`);
        
        if (this._hp <= 0) {
            this.die();
        }
    }

    /**
     * Mata al enemigo
     */
    die() {
        if (this._state === StatusEnemy.DEAD) return; // evitar doble llamada

        this._state = StatusEnemy.DEAD;
        console.log(`${this._nombre} ha muerto`);

        // cambiar sprite al de muerto si existe
        const deadTexture = `${this.texture.key}_corpse`;
        if (this.scene.textures.exists(deadTexture)) {
            this.setTexture(deadTexture);
        } else if (this.scene.textures.exists('enemy_corpse')) {
            this.setTexture('enemy_corpse');
        }

        // desactivar física y colisiones
        if (this.body) {
            this.body.stop();
            this.body.setVelocity(0, 0);
            this.body.enable = false;
            if (this.body.checkCollision) {
                this.body.checkCollision.none = true;
            }
        }

        // deshabilitar visión y otras lógicas
        this._visionRadius = 0;

        // destruir después de 10 segundos (10000 ms)
        this.scene.time.delayedCall(10000, () => {
            // verifica que el objeto aún exista
            if (this && this.scene) {
                super.destroy();
            }
        });
    }

    /**
     * Obtiene el HP actual del enemigo
     * @returns {number} HP actual
     */
    getHP() {
        return this._hp;
    }

    preUpdate(time, delta) {
        if (super.preUpdate) super.preUpdate(time, delta);
    }
}
export { StatusEnemy };