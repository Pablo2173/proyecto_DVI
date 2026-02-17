class Proyectile {
    constructor() { // `constructor` es una palabra reservada
        this._hitbox = null;
        this._weapon = null;
        this._speed = null;
        this._acceleration = null;
    }



    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }
}