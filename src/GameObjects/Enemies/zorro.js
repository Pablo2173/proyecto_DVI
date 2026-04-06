import Enemy from "../enemy";

export default class Zorro extends Enemy {

    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 150, hp = 80, speed = 80, hasFeather) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather);
        this.setScale(4);

        // El zorro tiene probabilidad de soltar una cola al morir
        this.lootTable = [
            { id: 'tail', probability: 25 }
        ];
    }
}