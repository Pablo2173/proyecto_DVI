const StatusEnemy = {
    IDLE: 0,
    ALERTED: 1,
    DEAD: 2,
    STUNNED: 3
};

class Enemy {
    constructor(name, x, y, visionRadius) {
        this._nombre = name;
        this._pos_x = x;
        this._pos_y = y;
        this._visionRadius = visionRadius; 
        this._speed = null;
        this._weapon = null;
        this._state = StatusEnemy.IDLE;
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }

    setPosition(x, y) {
        this._pos_x = x;
        this._pos_y = y;
    }

    setVisionRadius(radius) {
        this._visionRadius = radius;
    }

    // target: objeto con propiedades {x, y} (en este caso es el sprite del patete)
    canSee(target) {
        if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') return false;
        const dx = target.x - this._pos_x;
        const dy = target.y - this._pos_y;
        return (dx * dx + dy * dy) <= (this._visionRadius * this._visionRadius);
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

        // rellenar
        if (typeof graphics.fillStyle === 'function') {
            graphics.fillStyle(color, fillAlpha);
            graphics.fillCircle(this._pos_x, this._pos_y, this._visionRadius);
        } else if (typeof graphics.fillCircle === 'function') {
            // fallback genérico
            graphics.fillCircle(this._pos_x, this._pos_y, this._visionRadius);
        }

        // contorno
        if (typeof graphics.lineStyle === 'function' && typeof graphics.strokeCircle === 'function') {
            graphics.lineStyle(lineWidth, color, lineAlpha);
            graphics.strokeCircle(this._pos_x, this._pos_y, this._visionRadius);
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
 
    // El target es un objeto posicion por el cual hago que el enemigo ande hacia él. 
    // el parámetro speed se quitará porque es la del propio enemigo (pero esq aujn no estan implementados jeje)
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

        const maxMove = s * dt;
        const move = Math.min(maxMove, dist);
        this._pos_x += (dx / dist) * move;
        this._pos_y += (dy / dist) * move;

        return { x: this._pos_x, y: this._pos_y };
    }
}

function EnemigoOld(nombre) {
    this._nombre = nombre;
}

EnemigoOld.prototype.mostrarNombre = function () {
    console.log(`Mi nombre es ${this._nombre}`);
}

////////////////////////////////////////////////////////////////////////
class Entidad { }

class EnemigoHerencia extends Entidad {
    constructor(nombre) {
        super(nombre);
    }
}

function EntidadOld() { }
function EnemigoOldHerencia(nombre) {
    this.nombre = nombre;
}

EnemigoOldHerencia.prototype = Object.create(EntidadOld.prototype);
EnemigoOldHerencia.prototype.constructor = EnemigoOldHerencia;

////////////////////////////////////////////////////////////////////////

class EnemigoMetodo extends Entidad { // ES6
    constructor(name) { super(name); }

    atacar(enemigo) { super.atacar(enemigo); }
}

function EntidadMetodoOld() { }
EntidadMetodoOld.prototype.atacar = function (enemigos) { }

function EnemigoMetodoOld(nombre) { EntidadMetodoOld.call(this, nombre); }

EnemigoMetodoOld.prototype = Object.create(EntidadMetodoOld.prototype);
EnemigoMetodoOld.prototype.constructor = EnemigoMetodoOld;

EnemigoMetodoOld.prototype.atacar = function (enemigo) {
    Entidad.prototype.atacar.apply(this, [enemigo]);
}

////////////////////////////////////////////////////////////////////////

class Personaje {
    constructor() {
        this._fuerza = 0;
    }

    get fuerza() {
        return this._fuerza;
    }

    set fuerza(f) {
        this._fuerza = f;
    }
}

let hero = new Personaje();
console.log(hero.fuerza);
hero.fuerza = 5;
console.log(hero.fuerza);

export default Enemy;