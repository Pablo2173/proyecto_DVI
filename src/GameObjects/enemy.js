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
     */
    constructor(scene, name, x, y, texture = 'enemy', frame = null, visionRadius = 100) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        scene.add.existing(this);

        // Añade cuerpo físico si la escena tiene physics
        if (scene.physics && scene.physics.add) {
            scene.physics.add.existing(this);
            if (this.body && typeof this.body.setCollideWorldBounds === 'function') {
                this.body.setCollideWorldBounds(true);
            }
        }

        this._nombre = name;
        this._pos_x = x;
        this._pos_y = y;
        this._visionRadius = visionRadius;
        this._facingAngle = Math.PI; //Lo he puesto en Math.PI para que empiece mirando para la izquierda
        this._visionAngle = Math.PI / 2; //Esto es un cuarto de circulo para el cono de vision
        this._speed = null;
        this._weapon = null;
        this._state = StatusEnemy.IDLE;
        this._lastQuackTime = 0; // Para evitar alertas duplicadas del mismo quack
        this._quackCooldown = 100; // ms
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }

    // Sobrescribimos setPosition para mantener sincronía entre sprite y lógica
    setPosition(x, y) {
        super.setPosition(x, y);
        this._pos_x = x;
        this._pos_y = y;
        // Mantiene el body en la misma posición si existe
        if (this.body && this.body.position) {
            this.body.x = x - (this.displayWidth * this.originX);
            this.body.y = y - (this.displayHeight * this.originY);
        }
        return this;
    }

    setVisionRadius(radius) {
        this._visionRadius = radius;
    }

    // target: objeto con propiedades {x, y} (en este caso es el sprite del patete)
    canSee(target) {
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') return false;
        const dx = target.x - this._pos_x;
        const dy = target.y - this._pos_y;
        const dist2 = (dx * dx + dy * dy);
        if (dist2 > (this._visionRadius * this._visionRadius)) return false;

        // angle to target
        const angleToTarget = Math.atan2(dy, dx);
        // normalize difference to [-PI, PI]
        let diff = angleToTarget - this._facingAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        return Math.abs(diff) <= (this._visionAngle / 2);
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

        const px = this._pos_x;
        const py = this._pos_y;

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
    detectAndAlert(player) {
        if (!player) return false;
        const seen = this.canSee(player);
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

        const dx = audioEvent.position.x - this._pos_x;
        const dy = audioEvent.position.y - this._pos_y;
        const distance = Math.hypot(dx, dy);
        const soundRadius = audioEvent.radius || 0;

        // Si está dentro del radio del sonido, se alerta
        if (distance <= soundRadius && this._state !== StatusEnemy.ALERTED) {
            this._state = StatusEnemy.ALERTED;
        }
    }

    // El target es un objeto posicion por el cual hago que el enemigo ande hacia él.
    // - delta: tiempo desde el último frame en ms (pasar el "delta" del update de Phaser)
    moveTowards(target, speed = 80, delta = 16) {
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            return { x: this._pos_x, y: this._pos_y };
        }

        const dt = (typeof delta === 'number' && delta > 0) ? (delta / 1000) : (16 / 1000);
        const s = (typeof this._speed === 'number' && this._speed > 0) ? this._speed : speed;

        const dx = target.x - this._pos_x;
        const dy = target.y - this._pos_y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return { x: this._pos_x, y: this._pos_y };

        // actualizar ángulo de mirada según dirección de movimiento
        this._facingAngle = Math.atan2(dy, dx);

        const maxMove = s * dt;
        const move = Math.min(maxMove, dist);
        this._pos_x += (dx / dist) * move;
        this._pos_y += (dy / dist) * move;

        // Actualizar posición del sprite y del body si existe
        super.setPosition(this._pos_x, this._pos_y);
        if (this.body) {
            // establecer velocidad aproximada para el cuerpo (útil para colisiones)
            if (typeof this.body.setVelocity === 'function') {
                this.body.setVelocity((dx / dist) * s, (dy / dist) * s);
            } else if (this.body.velocity) {
                this.body.velocity.x = (dx / dist) * s;
                this.body.velocity.y = (dy / dist) * s;
            }
        }

        return { x: this._pos_x, y: this._pos_y };
    }

    preUpdate(time, delta) {
        if (super.preUpdate) super.preUpdate(time, delta);
        // Mantener la posición interna sincronizada por si se cambia la posición del sprite desde fuera
        this._pos_x = this.x;
        this._pos_y = this.y;
    }
}