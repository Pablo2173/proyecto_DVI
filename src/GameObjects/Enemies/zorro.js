import Enemy from "../enemy";

export default class Zorro extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 750, hp = 80, speed = 110, hasFeather) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather);
        this.setScale(4);

        // Item especial que suelta al morir (usado por dropSpecialItem en Enemy)
        this.specialDrop = 'tail';
    }
    /*
    die() {
        if (this.isDead()) return;

        this.setState(2); // DEAD
        this._isShowingHit = false;
        this._visionAlertFlashUntil = 0;

        console.log(`${this._nombre} ha muerto`);

        this.dropWeapon();
        this.dropFeather();
        this.dropSpecialItem(); // sistema unificado: suelta tail según this.specialDrop

        const dedTexture = this._textureKeyFor('ded');
        if (dedTexture && this.scene.textures.exists(dedTexture)) {
            this.anims?.stop();
            this.setTexture(dedTexture);
        }

        // El zorro tiene probabilidad de soltar una cola al morir
        this.lootTable = [
            { id: 'tail', probability: 25 }
        ];
        this.body?.setVelocity(0, 0);
        this.body?.setEnable(false);
    }*/
}