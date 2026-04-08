import Enemy, { StatusEnemy } from "../enemy";

export default class Frog extends Enemy {

    constructor(scene, name, x, y, texture, frame, weapon = null, movementType, visionRadius = 0, hp = 80, speed = 110, hasFeather = false) {
        // Pasamos null como weapon para que Enemy no intente equipar nada en super()
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, null, movementType, hasFeather);
        this.setScale(4);
    }

    preUpdate(time, delta) {
        super.preUpdate?.(time, delta);
        // Siempre forzar inmovilidad
        if (this.body) {
            this.body.setImmovable(true);
            this.body.setVelocity(0, 0);
        }
    }
    
    takeDamage(damage) {
        // Solo reducir vida y mostrar daño, sin alertar ni activar persecución
        this._hp -= damage;
        this.flashRed();
        this._showHitVisual();
        // La rana no puede morir, nunca llamar a die()
        if (this._hp <= 0) this._hp = 1;
    }

}