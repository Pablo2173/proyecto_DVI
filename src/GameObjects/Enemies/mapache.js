import Enemy, { StatusEnemy } from "../enemy";
import DropMask from "../consumables/dropMask.js";

export default class Mapache extends Enemy {

    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 150, hp = 100, speed = 80, hasFeather) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather);
      

        // guardamos las estadisticas originales para poder restaurarlas al resucitar
        this._resurrected = false;
        this._originalTexture = texture;
        this._originalVisionRadius = visionRadius;
        this._maxHP = hp;
        this._originalWeapon = weapon;
        this.hasFeather          = true;
    }

    // Drop del mapache
    dropMask() {
        const { dx, dy } = this._randomDropOffset();
        new DropMask(this.scene, this.x + dx, this.y + dy);
    }

    //como la habilidad del mapache es resucitar, sobreescribo el metodo die para que en vez de morir a la primera, se "resucite" una vez, y a la segunda muerte si muera de verdad
    die() {
        if (this._state === StatusEnemy.DEAD) return;

        if (!this._resurrected) {
            this._resurrected = true;

            this._state = StatusEnemy.DEAD;
            console.log(`${this._nombre} ha muerto (primera vez, resucitará)`);

            const deadTexture = `${this.texture.key}_corpse`;
            if (this.scene.textures.exists(deadTexture)) {
                this.setTexture(deadTexture);
            } else if (this.scene.textures.exists('enemy_corpse')) {
                this.setTexture('enemy_corpse');
            }

            if (this.body) {
                this.body.stop();
                this.body.setVelocity(0, 0);
                this.body.enable = false;
                if (this.body.checkCollision) this.body.checkCollision.none = true;
            }

            this._visionRadius = 0;

            // Revive a los 3 segundos
            this.scene.time.delayedCall(3000, () => this.revive());

        } else {
            // Segunda muerte: drops completos y muerte real
            // Los drops estándar (weapon, feather, bread) los gestiona super.die()
            this.dropMask();
            super.die();
        }
    }

    revive() {
        if (!this.scene) return;

        this._state         = StatusEnemy.IDLE;
        this._hp            = this._maxHP;
        this._visionRadius  = this._originalVisionRadius;

        // vuelve a tener el sprite del mapache vivo
        this.setTexture(this._originalTexture);

        // reactiva las físicas/colisiones
        if (this.body) {
            this.body.enable = true;
            if (this.body.checkCollision) this.body.checkCollision.none = false;
            this.body.setVelocity(0, 0);
        }

        // reequipa el arma
        this.equipWeapon(this._originalWeapon);

        console.log(`${this._nombre} ha resucitado`);
    }
}