const StatusWeapon = {
    DROPPED: 0,
    READY: 1,
    CHARGING: 2,
    COOLDOWN: 3
};

class Weapon {
    constructor() { // `constructor` es una palabra reservada
        this._fireRate = null;
        this.proyectile = null;
        this.user = null;
        this.state = StatusWeapon.READY;
    }



    mostrarNombre() {
        console.log(`Mi nombre es ${this._nombre}`);
    }
}