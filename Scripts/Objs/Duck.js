const StatusDuck = {
    MAIN: 0,
    STUNNED: 1,
    ROLLING: 2,
    SWIMMING: 3
};

class Duck {
    constructor() { // `constructor` es una palabra reservada
        this._speed = null;
        this._weapon = null;
        this.dmgMult = 1;
        this.effMult = 1;
        this._state = StatusDuck.MAIN;
    }

    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }
}
