import Enemy from "../enemy";
import FoxTail from '../consumables/foxTail.js';

export default class Zorro extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 150, hp = 80, speed = 80, hasFeather) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather);
        this.setScale(4);
    }

    dropFoxTail() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 48;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        new FoxTail(this.scene, this.x + dx, this.y + dy);
    }

    die() {
        if (this.isDead()) return;

        this.setState(2); // DEAD
        this._isShowingHit = false;
        this._visionAlertFlashUntil = 0;

        console.log(`${this._nombre} ha muerto`);

        this.dropWeapon();
        this.dropFeather();
        this.dropFoxTail(); // en vez de pan

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
    }
}