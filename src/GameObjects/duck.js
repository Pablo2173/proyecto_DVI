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

        // Animación (falta implementar animaciones reales)
        this.animationState = 'idle';
        this.direction = 'right';
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 10;
        this.maxFrames = { idle: 2, walking: 4, picking: 4, cuack: 1 };
        this.isMoving = false;

        // Estado de Quack
        this.isQuacking = false;
        this.quackDuration = 600; // ms
        this.quackEndTime = 0;
        this.previousAnimationState = 'idle';
        this.quackAnimationFrame = 0;
        this.quackAnimationTimer = 0;

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
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // Listeners para dash y acciones
        this.keySpace.on('down', () => this.dash(this.cursors, scene.time.now));
        this.keyE.on('down', () => this.setAnimationState('picking'));
        this.keyC.on('down', () => this.quack()); // Hacer cuack con sonido

        // Hitbox de depuración (círculo verde)
        this.baseHitboxRadius = 40; // valor por defecto (px) - será multiplicado por la escala del sprite
        this.showHitbox = true; // mostrar por defecto para depuración
        this.hitboxGraphics = scene.add.graphics();
        this.hitboxGraphics.setDepth(1000);
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
        // Si está haciendo cuack, mantener la animación del cuack visible
        if (this.isQuacking) {
            // La animación del cuack se actualiza en updateDuckState
            this.animationFrame = this.quackAnimationFrame;
            return;
        }

        // Animación normal de movimiento
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
     * Hacer cuack: reproducir sonido y animación sin bloquear movimiento
     */
    quack() {
        // No permitir cuack durante dash, pero permitir solapamiento de sonidos al spammear
        if (this.isDashing) return;

        // Reproducir una instancia del sonido (permite solapamiento)
        if (this.scene && this.scene.sound) {
            this.scene.sound.play('cuack', { volume: 1 });
        }
        // Actualizar tiempo de fin del cuack (extiende la duración) en cada pulsación
        this.quackEndTime = this.scene.time.now + this.quackDuration;

        // Si no estaba en cuack, iniciar animación/estado
        if (!this.isQuacking) {
            this.isQuacking = true;
            this.quackAnimationFrame = 0;
            this.quackAnimationTimer = 0;
        }

        // Expandir hitbox inmediatamente en cada pulsación: guardar el radio anterior
        // solo la primera vez que se expande y luego poner radio que cubra la pantalla
        if (this.hitboxGraphics) {
            if (!this.hitboxExpanded) {
                this._prevBaseHitboxRadius = this.baseHitboxRadius;
            }
            const w = (this.scene && this.scene.scale) ? this.scene.scale.width : 800;
            const h = (this.scene && this.scene.scale) ? this.scene.scale.height : 600;
            const screenRadius = Math.ceil(Math.hypot(w, h) / 2);
            this.baseHitboxRadius = screenRadius;
            this.hitboxExpanded = true;
        }
    }


    /**
     * Actualizar estado del pato (llamado cada frame desde preUpdate)
     * @param {number} time Tiempo actual
     * @param {number} dt Delta time en ms
     */
    updateDuckState(time, dt) {
        const deltaS = dt / 1000;

        // Finalizar quack (restaurar hitbox si fue expandida)
        if (this.isQuacking && time >= this.quackEndTime) {
            this.isQuacking = false;
            if (this.hitboxExpanded) {
                this.baseHitboxRadius = (typeof this._prevBaseHitboxRadius === 'number') ? this._prevBaseHitboxRadius : this.baseHitboxRadius;
                this._prevBaseHitboxRadius = undefined;
                this.hitboxExpanded = false;
            }
        }

        // Actualizar animación de quack si está activa (de forma independiente)
        if (this.isQuacking) {
            this.quackAnimationTimer++;
            if (this.quackAnimationTimer >= this.animationSpeed) {
                this.quackAnimationFrame = (this.quackAnimationFrame + 1) % this.maxFrames['cuack'];
                this.quackAnimationTimer = 0;
            }
            this.animationFrame = this.quackAnimationFrame;
        }

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

        // Movimiento dash (bloquea otros movimientos)
        if (this.isDashing) {
            this.x += this.dashVx * deltaS;
            this.y += this.dashVy * deltaS;
            this.updateAnimation();
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
            return;
        }

        // Movimiento normal (permitido incluso durante cuack)
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

            // Solo cambiar estado si NO está haciendo cuack
            if (!this.isQuacking) {
                this.setAnimationState('walking');
                this.updateAnimation();
            }
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
        } else {
            // Solo cambiar estado si NO está haciendo cuack
            if (!this.isQuacking) {
                this.setAnimationState('idle');
                this.updateAnimation();
            }
            if (this.weapon) { this.weapon.x = this.x + this.weaponOffsetX; this.weapon.y = this.y + this.weaponOffsetY; this.weapon.facing = this.direction; }
        }

        // Dibujar hitbox de depuración (si está activada). El radio sigue la escala del sprite.
        if (this.showHitbox && this.hitboxGraphics) {
            const scaleFactor = Math.max(this.scaleX || 1, this.scaleY || 1);
            const radius = Math.max(0, Math.round(this.baseHitboxRadius * scaleFactor));
            this.hitboxGraphics.clear();
            this.hitboxGraphics.fillStyle(0x00ff00, 0.08);
            this.hitboxGraphics.fillCircle(Math.round(this.x), Math.round(this.y), radius);
            this.hitboxGraphics.lineStyle(2, 0x00ff00, 0.9);
            this.hitboxGraphics.strokeCircle(Math.round(this.x), Math.round(this.y), radius);
        }
    }

    /**
     * Ajustar radio de la hitbox en píxeles
     * @param {number} r
     */
    setHitboxRadius(r) {
        // Ajusta el radio base que luego se multiplica por la escala del sprite
        this.baseHitboxRadius = Math.max(0, Number(r) || 0);
    }

    /**
     * Mostrar u ocultar la hitbox de depuración
     * @param {boolean} v
     */
    setShowHitbox(v) {
        this.showHitbox = !!v;
        if (!this.showHitbox && this.hitboxGraphics) this.hitboxGraphics.clear();
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
