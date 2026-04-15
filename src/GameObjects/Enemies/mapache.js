import Enemy, { StatusEnemy } from "../enemy";

export default class Mapache extends Enemy {

    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 750, hp = 65, speed = 100, hasFeather, routeFacing = []) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather, routeFacing);
        this.setScale(4);

        // El mapache tiene probabilidad de soltar una máscara al morir
        this.lootTable = [
            { id: 'mask', probability: 30 }
        ];

        // Item especial que suelta al morir (usado por dropSpecialItem en Enemy)
        this.specialDrop = 'mask';

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
        // Delega al sistema unificado de drops
        this.dropSpecialItem();
    }

    //como la habilidad del mapache es resucitar, sobreescribo el metodo die para que en vez de morir a la primera, se "resucite" una vez, y a la segunda muerte si muera de verdad
    die() {
        if (this._state === StatusEnemy.DEAD) return;

        if (!this._resurrected) {
            this._resurrected = true;

            this._state = StatusEnemy.DEAD;
            console.log(`${this._nombre} ha muerto (primera vez, resucitará)`);

            const dedTexture = this._textureKeyFor('ded');
            if (dedTexture && this.scene.textures.exists(dedTexture)) {
                this.anims?.stop();
                this.setTexture(dedTexture);
            } else {
                const deadTexture = `${this.texture.key}_corpse`;
                if (this.scene.textures.exists(deadTexture)) {
                    this.setTexture(deadTexture);
                } else if (this.scene.textures.exists('enemy_corpse')) {
                    this.setTexture('enemy_corpse');
                }
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
            super.die();
        }
    }

    revive() {
        if (!this.scene) return;

        this._state         = StatusEnemy.IDLE;
        this._isShowingHit  = false;
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