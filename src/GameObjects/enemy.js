import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { TEAM } from './team.js';

import Arco from './Weapons/Distance/arco.js';
import Mcuaktro from './Weapons/Distance/mcuaktro.js';
import Cuchillo from './Weapons/Melee/cuchillo.js';
import Mazo from './Weapons/Melee/mazo.js';
import Ramita from './Weapons/Melee/ramita.js';

import DropWeapon from './Weapons/drops/dropWeapon.js';
import DropFeather from './consumables/dropFeather.js';
import DropBread from './consumables/dropBread.js';

const StatusEnemy = {
    IDLE: 0,
    ALERTED: 1,
    DEAD: 2,
    STUNNED: 3
};

export default class Enemy extends BaseCharacter {
    constructor(scene, name, x, y, texture, frame = null, visionRadius, hp, speed, weapon, movementType, hasFeather) {
        super(scene, x, y, texture, frame, TEAM.ENEMY);

        // --- FÍSICA (top-down) ---
        if (scene.physics && scene.physics.add) {
            scene.physics.add.existing(this);
            if (this.body) {
                this.body.setCollideWorldBounds(true);
                this.body.setAllowGravity(false); // Sin gravedad porque estamos haciendo un top-down
                this.body.setImmovable(false); // Basicamente lo pongo a false para que le puedan empujar
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
        this._movementType = movementType;
        this._movementData = null; // para almacenar datos específicos del tipo de movimiento (ej. puntos de patrulla)
        this.hasFeather = hasFeather;

        this.weaponMap = {
            arco: Arco,
            mcuaktro: Mcuaktro,
            cuchillo: Cuchillo,
            mazo: Mazo,
            ramita: Ramita
        };

        this._lastQuackTime = 0; // Para evitar alertas duplicadas del mismo quack
        this._quackCooldown = 100;

        // equipar arma si fue pasada
        this.equipWeapon(weapon);
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
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
    }

    /**
     * Mueve al enemigo alejándose de un target usando el body de física.
     * @param {{x: number, y: number}} target
     */
    moveAwayFrom(target) {
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            this.body?.setVelocity(0, 0);
            return;
        }
        const dx = this.x - target.x; // invertido
        const dy = this.y - target.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) { this.body?.setVelocity(0, 0); return; }
        this._facingAngle = Math.atan2(dy, dx);
        this.body.setVelocity((dx / dist) * this._speed, (dy / dist) * this._speed);
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
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        return Math.abs(diff) <= this._visionAngle / 2;
    }

    // Dibuja el radio de visión usando un Phaser 3 Graphics.
    // Parámetros:
    //  - graphics: Phaser.GameObjects.Graphics (requerido)
    //  - options: { color, fillAlpha, lineAlpha, lineWidth, clearBefore }
    drawVision(graphics, options = {}) {
        if (!graphics || typeof graphics.clear !== 'function') return;
        const { color = 0x00ff00, fillAlpha = 0.15, lineAlpha = 1, lineWidth = 1, clearBefore = true } = options;
        if (clearBefore) graphics.clear();
        const px = this.x;
        const py = this.y;
        const startAngle = this._facingAngle - (this._visionAngle / 2);
        const endAngle   = this._facingAngle + (this._visionAngle / 2);
        
        // Si Graphics soporta arc/path
        if (typeof graphics.beginPath === 'function') {
            graphics.fillStyle(color, fillAlpha);
            graphics.lineStyle(lineWidth, color, lineAlpha);
            graphics.beginPath();
            graphics.moveTo(px, py);
            graphics.arc(px, py, this._visionRadius, startAngle, endAngle, false);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        } else {
            graphics.fillStyle?.(color, fillAlpha);
            graphics.fillCircle?.(px, py, this._visionRadius);
            graphics.lineStyle?.(lineWidth, color, lineAlpha);
            graphics.strokeCircle?.(px, py, this._visionRadius);
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

    getState()       { return this._state; }
    setState(state)  { this._state = state; }
    isDead()         { return this._state === StatusEnemy.DEAD; }
    isStunned()      { return this._state === StatusEnemy.STUNNED; }

    /**
     * Reduce el HP del enemigo por daño de un proyectil
     * @param {number} damage - cantidad de daño a recibir
     */
    takeDamage(damage) {
        if (this._state === StatusEnemy.DEAD) return;
        this._hp -= damage;
        if (this._state !== StatusEnemy.ALERTED) this._state = StatusEnemy.ALERTED; // Si recibe daño, se alerta aunque no haya visto al jugador
        console.log(`${this._nombre} recibió ${damage} de daño. HP actual: ${this._hp}`);
        // parpadeo rojo momentáneo
        this.flashRed();
        if (this._hp <= 0) this.die();
    }

    /**
     * Devuelve un offset aleatorio para dispersar los drops.
     */
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
        const { dx, dy } = this._randomDropOffset();
        new DropBread(this.scene, this.x + dx, this.y + dy);
    }

    die() {
        if (this._state === StatusEnemy.DEAD) return; // evitar doble llamada

        this._state = StatusEnemy.DEAD;
        console.log(`${this._nombre} ha muerto`);

        this.dropWeapon();
        this.dropFeather();
        this.dropBread();

        // Cambiar sprite al de muerto si existe
        const deadTexture = `${this.texture.key}_corpse`;
        if (this.scene.textures.exists(deadTexture)) {
            this.setTexture(deadTexture);
        } else if (this.scene.textures.exists('enemy_corpse')) {
            this.setTexture('enemy_corpse');
        }

        // Desactivar física
        if (this.body) {
            this.body.stop();
            this.body.setVelocity(0, 0);
            this.body.enable = false;
            if (this.body.checkCollision) this.body.checkCollision.none = true;
        }

        this._visionRadius = 0;

        this.scene.time.delayedCall(10000, () => {
            if (this && this.scene) super.destroy();
        });
    }

    /**
     * Obtiene el HP actual del enemigo
     * @returns {number} HP actual
     */
    getHP() { return this._hp; }

    // Reproduce un parpadeo rojo rápido para indicar daño recibido
    flashRed(duration = 100) {
        if (!this.scene) return;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(duration, () => {
            if (this && this.clearTint) this.clearTint();
        });
    }

    /**
     * Sobre-escribimos destroy para también limpiar arma y barra.
     */
    destroy(fromScene) {
        if (this.weapon)    this.weapon.destroy();
        if (this.weaponBar) this.weaponBar.destroy();
        super.destroy(fromScene);
    }

    /*
--------------------------------------------------------------------------------
                   MOVIMIENTOS PREDEFINIDOS PARA ENEMIGOS
--------------------------------------------------------------------------------
    */

    //persecución cuando está alertado
    movementAlerted(target) {
        if (!this.isAlerted() || !target) return;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        const optimalDist = this.weapon?.optimalDistance ?? 200;
        const range = this.weapon?.range ?? 300;
        if (dist < optimalDist)       this.moveAwayFrom(target);
        else if (dist > range)        this.moveTowards(target);
        else                          this.stop();
        this.setFlipX(this.x >= target.x);
    }

    //se mueve 3 segundos hacia un lado y se para 2 segundos, luego repite hacia el otro lado.
    movementPointToPoint() {
        if (!this._movementData) {
            this._movementData = { cycleTimer: 0, isMoving: true, isMovingRight: true };
        }

        if (this.isAlerted()) return;

        const data = this._movementData;
        data.cycleTimer += this.scene.game.loop.delta;

        const moveDuration  = 3000;
        const pauseDuration = 2000;
        const cycleDuration = moveDuration + pauseDuration;
        
        // Reinicia el ciclo
        if (data.cycleTimer >= cycleDuration) {
            data.cycleTimer = 0;
            data.isMovingRight = !data.isMovingRight;
        }
        
        // Determina si está en fase de movimiento o pausa
        data.isMoving = data.cycleTimer < moveDuration;

        if (data.isMoving) {
            // Moverse 3 segundos
            const dir = data.isMovingRight ? 1 : -1;
            this.body.setVelocity(dir * this._speed, 0);
            this.setFlipX(!data.isMovingRight);
            this._facingAngle = data.isMovingRight ? 0 : Math.PI;
        } else {
            // Parar 2 segundos
            this.stop();
            this.setFlipX(!data.isMovingRight);
            this._facingAngle = data.isMovingRight ? 0 : Math.PI;
        }
    }

    //movimientos aleatorios en un radio de 150 px.
    movementRandomAroundPoint(radius = 150) {
        if (!this._movementData) {
            this._movementData = {
                centerX: this.x, centerY: this.y, radius,
                targetPoint: { x: this.x, y: this.y },
                changeTimer: 0, changeInterval: 2000
            };
        }
        if (this.isAlerted()) { this._movementData.changeTimer = 0; return; }
        const data = this._movementData;
        data.changeTimer += this.scene.game.loop.delta;
        if (data.changeTimer >= data.changeInterval) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * data.radius;
            data.targetPoint = {
                x: data.centerX + Math.cos(angle) * distance,
                y: data.centerY + Math.sin(angle) * distance
            };
            data.changeTimer = 0;
        }
        const dist = Phaser.Math.Distance.Between(this.x, this.y, data.targetPoint.x, data.targetPoint.y);
        if (dist > 5) this.moveTowards(data.targetPoint);
        else          this.stop();
    }

    //mirar hacia un lado durante 3 segundos y luego hacia el otro también 3 segundos
    movementStayAndLook(lookInterval = 3000) {
        if (!this._movementData) {
            this._movementData = {
                initialX: this.x, initialY: this.y,
                lookInterval, lookTimer: 0,
                isMovingRight: true,
                movementDuration: 200, // ms para moverse un poco antes de quedarse mirando
                movementTimer: 0
            };
        }

        if (this.isAlerted()) return;

        const data = this._movementData;
        data.lookTimer     += this.scene.game.loop.delta;
        data.movementTimer += this.scene.game.loop.delta;
        
        // Cambia de dirección cada lookInterval
        if (data.lookTimer >= data.lookInterval) {
            data.isMovingRight = !data.isMovingRight;
            data.lookTimer = 0;
            data.movementTimer = 0;
        }
        
        // Mueve durante los primeros 200ms del intervalo
        if (data.movementTimer < data.movementDuration) {
            const dir = data.isMovingRight ? 1 : -1;
            this.body.setVelocity(dir * this._speed, 0);
            this.setFlipX(!data.isMovingRight);
            this._facingAngle = data.isMovingRight ? 0 : Math.PI;
        } else {
            // Se detiene el resto del intervalo
            this.stop();
            this.setFlipX(!data.isMovingRight);
            this._facingAngle = data.isMovingRight ? 0 : Math.PI;
        }
    }

    /*
--------------------------------------------------------------------------------
                          PRECARGA DEL OBJETO ENEMIGO
--------------------------------------------------------------------------------
    */

    preUpdate(time, delta) {
        // Ejecutar movimiento si está en IDLE
        if (this._state === StatusEnemy.IDLE && this._movementType) {
            switch (this._movementType) {
                case 'pointToPoint':  this.movementPointToPoint(); break;
                case 'AroundPoint':   this.movementRandomAroundPoint(); break;
                case 'StayAndLook':   this.movementStayAndLook(); break;
            }
        } else if (this.isAlerted()) {
            if (this.scene.duck) this.movementAlerted(this.scene.duck);
        }

        // el arma también debe actualizarse para seguir al enemigo
        if (this.weapon && typeof this.weapon.update === 'function') this.weapon.update();
        // actualizar posición de la barra si existe
        if (this.weaponBar && typeof this.weaponBar.update === 'function') this.weaponBar.update();

        if (super.preUpdate) super.preUpdate(time, delta);
    }
}

export { StatusEnemy };