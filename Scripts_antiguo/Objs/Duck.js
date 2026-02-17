const StatusDuck = {
    MAIN: 0,
    STUNNED: 1,
    ROLLING: 2,
    SWIMMING: 3
};

class Duck extends GameItem {
    constructor(element) {
        super(element, 200, 200);
        this._speed = 5;
        this._weapon = null;
        this.dmgMult = 1;
        this.effMult = 1;
        this._state = StatusDuck.MAIN;

        // Animación
        this.animationState = "idle"; // Estados: "idle", "walking", "picking", etc.
        this.direction = "right"; // Dirección: "up", "down", "left", "right" (idle solo left/right)
        this.animationFrame = 0; // Frame actual
        this.animationTimer = 0; // Temporizador
        this.animationSpeed = 10; // Velocidad de animación
        this.maxFrames = { idle: 2, walking: 4, picking: 4 }; // Frames por estado

        // Dash
        this.dashSpeed = 15; // Velocidad durante dash
        this.dashDuration = 200; // Duración del dash en ms
        this.dashCooldown = 1000; // Cooldown en ms
        this.isDashing = false;
        this.dashEndTime = 0;
        this.lastDashTime = 0;
        this.dashDx = 0; // Velocidad X durante dash
        this.dashDy = 0; // Velocidad Y durante dash
    }

    // Cambiar estado de animación (para extras como recoger)
    setAnimationState(state) {
        if (this.maxFrames[state]) {
            this.animationState = state;
            this.animationFrame = 0; // Reinicia frame
            this.animationTimer = 0;
        }
    }

    // Actualizar animación
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % this.maxFrames[this.animationState];
            this.animationTimer = 0;
        }
    }

    // Renderiza la posición y sprite
    render() {
        super.render(); // Posición
        // Comentado para debug: usa cuadrado amarillo
        // const spritePath = `../Sprites/duck_${this.animationState}_${this.direction}_${this.animationFrame + 1}.png`;
        // this.element.style.backgroundImage = `url(${spritePath})`;
        // this.element.style.backgroundSize = "32px 32px";
    }

    // Movimiento con dirección
    move(direction) {
        if (this._state === StatusDuck.STUNNED) return;

        this.direction = direction;
        this.animationState = "walking"; // Cambia a walking al moverse
        this.updateAnimation();

        const speed = this.isDashing ? this.dashSpeed : this._speed;

        switch (direction) {
            case "up":
                this.y -= speed;
                break;
            case "down":
                this.y += speed;
                break;
            case "left":
                this.x -= speed;
                break;
            case "right":
                this.x += speed;
                break;
        }

        this.render();
    }

    // Mecánica de dash
    dash(pressedKeys) {  // Pasa pressedKeys como parámetro
        const now = Date.now();
        if (now - this.lastDashTime < this.dashCooldown) return;

        this.isDashing = true;
        this.dashEndTime = now + this.dashDuration;
        this.lastDashTime = now;

        // Calcula dirección basada en teclas presionadas (incluye diagonales)
        let dx = 0, dy = 0;
        if (pressedKeys.has("ArrowUp")) dy -= 1;
        if (pressedKeys.has("ArrowDown")) dy += 1;
        if (pressedKeys.has("ArrowLeft")) dx -= 1;
        if (pressedKeys.has("ArrowRight")) dx += 1;

        // Si no hay dirección, usa la actual
        if (dx === 0 && dy === 0) {
            switch (this.direction) {
                case "up": dy = -1; break;
                case "down": dy = 1; break;
                case "left": dx = -1; break;
                case "right": dx = 1; break;
            }
        }

        // Normaliza para diagonales (opcional, para velocidad consistente)
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }

        this.dashDx = dx * this.dashSpeed;
        this.dashDy = dy * this.dashSpeed;

        this.updateAnimation();
    }

    // Actualizar estado (llamar en el bucle de juego)
    update() {
        const now = Date.now();
        if (this.isDashing && now >= this.dashEndTime) {
            this.isDashing = false;
            this.dashDx = 0;
            this.dashDy = 0;
        }

        // Si no se mueve, vuelve a idle (solo si no está en estado especial)
        if (this.animationState === "walking" && !this.isMoving) {
            this.animationState = "idle";
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }
}