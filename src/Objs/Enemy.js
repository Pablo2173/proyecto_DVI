const StatusEnemy = {
    IDLE: 0,
    ALERTED: 1,
    DEAD: 2,
    STUNNED: 3
};

class Enemy {
    constructor() { // `constructor` es una palabra reservada
        this._speed = null;
        this._weapon = null;
        this._state = StatusEnemy.IDLE;
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
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
        this.nombre = nombre; // este cÃ³digo da un error
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