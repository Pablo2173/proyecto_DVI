import Phaser from 'phaser';
import Weapon from './weapon.js';

/**
 * Clase que representa el pato jugable. Se mueve por el mundo usando los cursores.
 * Soporta movimiento diagonal, dash y animaciones.
 */
export default class Duck extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del pato
     * @param {Phaser.Scene} scene Escena a la que pertenece el pato
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {string} texture Clave de textura (sprite key)
     */
    constructor(scene, x, y, weaponType = 'ramita') {
        super(scene, x, y, 'pato');
        this.scene = scene;
        scene.add.existing(this);

        // Propiedades del pato
        this._speed = 160; // px/s
        // para poner el arma a la derecha del pato
        this.weaponOffsetX = 36;
        this.weaponOffsetY = -6;
        this.weapon = new Weapon(scene, this.x + this.weaponOffsetX, this.y + this.weaponOffsetY, weaponType);
        this.dmgMult = 1;
        this.effMult = 1;
        this._state = 0; // MAIN

        // Animación
        this.animationState = 'idle';
        this.direction = 'right';
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 10;
        this.maxFrames = { idle: 2, walking: 4, picking: 4 };
        this.isMoving = false;

        // Dash
        this.dashSpeed = 600; // px/s
        this.dashDuration = 200; // ms
        this.dashCooldown = 800; // ms
        this.isDashing = false;
        this.dashEndTime = 0;
        this.lastDashTime = 0;
        this.dashVx = 0;
        this.dashVy = 0;

        // Inputs
        this.cursors = scene.input.keyboard.createCursorKeys();
        // WASD keys
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Listeners para dash y acciones
        this.keySpace.on('down', () => this.dash(this.cursors, scene.time.now));
        this.keyP.on('down', () => this.setAnimationState('picking'));
    }

    /**
     * Cambiar estado de animación
     * @param {string} state Estado: 'idle', 'walking', 'picking', etc.
     */
    setAnimationState(state) {
        if (this.maxFrames[state]) {
            this.animationState = state;
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
    }

    /**
     * Actualizar animación (ciclar frames)
     */
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % this.maxFrames[this.animationState];
            this.animationTimer = 0;
        }
    }

    /**
     * Mecánica de dash: movimiento rápido en dirección actual (diagonal incluida)
     * @param {object} inputKeys Objeto de cursors de Phaser
     * @param {number} time Tiempo actual de Phaser
     */
    dash(inputKeys, time) {
        if (time < this.lastDashTime + this.dashCooldown) return;

        // Calcular dirección en el momento del dash
        let dx = 0, dy = 0;
        if (inputKeys.up.isDown || this.keyW.isDown) dy -= 1;
        if (inputKeys.down.isDown || this.keyS.isDown) dy += 1;
        if (inputKeys.left.isDown || this.keyA.isDown) dx -= 1;
        if (inputKeys.right.isDown || this.keyD.isDown) dx += 1;

        // Si no hay dirección, mantener la anterior
        if (dx === 0 && dy === 0) {
            switch (this.direction) {
                case 'up': dy = -1; break;
                case 'down': dy = 1; break;
                case 'left': dx = -1; break;
                case 'right': dx = 1; break;
            }
        }

        // Normalizar para diagonales
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        this.dashVx = dx * this.dashSpeed;
        this.dashVy = dy * this.dashSpeed;
        this.isDashing = true;
        this.dashEndTime = time + this.dashDuration;
        this.lastDashTime = time;
        this.setAnimationState('dashing');
    }

    /**
     * Actualizar estado del pato (llamado cada frame desde preUpdate)
     * @param {number} time Tiempo actual
     * @param {number} dt Delta time en ms
     */
    updateDuckState(time, dt) {
        const deltaS = dt / 1000;

        // Finalizar dash
        if (this.isDashing && time >= this.dashEndTime) {
            this.isDashing = false;
            this.dashVx = 0;
            this.dashVy = 0;
            this.setAnimationState('idle');
        }

        // Transición a idle si no se mueve
        if (this.animationState === 'walking' && !this.isMoving) {
            this.setAnimationState('idle');
        }

        // Movimiento dash
        if (this.isDashing) {
            this.x += this.dashVx * deltaS;
            this.y += this.dashVy * deltaS;
            this.updateAnimation();
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
            return;
        }

        // Movimiento normal
        let vx = 0, vy = 0;
        let moved = false;

        if (this.cursors.left.isDown || this.keyA.isDown) { vx -= 1; moved = true; }
        if (this.cursors.right.isDown || this.keyD.isDown) { vx += 1; moved = true; }
        if (this.cursors.up.isDown || this.keyW.isDown) { vy -= 1; moved = true; }
        if (this.cursors.down.isDown || this.keyS.isDown) { vy += 1; moved = true; }

        this.isMoving = moved;

        if (moved) {
            const len = Math.hypot(vx, vy) || 1;
            vx = (vx / len) * this._speed;
            vy = (vy / len) * this._speed;

            this.x += vx * deltaS;
            this.y += vy * deltaS;

            // Actualizar dirección para dash futuro
            if (vx < 0) this.direction = 'left';
            else if (vx > 0) this.direction = 'right';
            if (vy < 0) this.direction = 'up';
            else if (vy > 0) this.direction = 'down';

            this.setAnimationState('walking');
            this.updateAnimation();
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
        } else {
            this.setAnimationState('idle');
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
        }
    }

    /**
     * preUpdate de Phaser (llamado automáticamente cada frame)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.updateDuckState(t, dt);
    }
}
