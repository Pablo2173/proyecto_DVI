import Enemy, { StatusEnemy } from "../enemy";
import DropWeapon from "../Weapons/drops/dropWeapon.js";

export default class Mapache extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon) {
        super(scene, name, x, y, texture, frame, 150, 100, 80, weapon); 
        //visionRadius = 150, hp = 100, speed = 80 para el mapache

        // guardamos las estadisticas originales para poder restaurarlas al resucitar
        this._resurrected = false;
        this._originalTexture = texture;
        this._originalVisionRadius = this._visionRadius;
        this._maxHP = 100;
        this._originalWeapon = weapon;
    }

    //como la habilidad del mapache es resucitar, sobreescribo el metodo die para que en vez de morir a la primera, se "resucite" una vez, y a la segunda muerte si muera de verdad
    die() {
        if (this._state === StatusEnemy.DEAD) return;

        if (!this._resurrected) {
            this._resurrected = true;

            this._state = StatusEnemy.DEAD;
            console.log(`${this._nombre} ha muerto`);

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
                if (this.body.checkCollision) {
                    this.body.checkCollision.none = true;
                }
            }

            this._visionRadius = 0;

            // revive a los 3 segundos
            this.scene.time.delayedCall(3000, () => this.revive());
        } else {
            // En la segunda muerte ya se muere normal
            
            if (this.weapon) {
                const drop = new DropWeapon(this.scene, this.x, this.y, this.weapon.constructor, this.weapon.texture.key);
                 if (this.scene.dropItems) {
                     this.scene.dropItems.add(drop);
                 }
                  this.weapon.destroy();
            }
            super.die();
        }
    }

    revive() {
        if (!this.scene) return;

        this._state = StatusEnemy.IDLE;
        this._hp = this._maxHP;
        this._visionRadius = this._originalVisionRadius;

        // vuelve a tener el sprite del mapache vivo
        this.setTexture(this._originalTexture);

        // reactiva las físicas/colisiones
        if (this.body) {
            this.body.enable = true;
            if (this.body.checkCollision) {
                this.body.checkCollision.none = false;
            }
            this.body.setVelocity(0, 0);
        }

        // reequipa el arma
        this.equipWeapon(this._originalWeapon);

        console.log(`${this._nombre} ha resucitado`);
    }
}