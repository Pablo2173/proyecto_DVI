import Enemy from "../enemy";

export default class Zorro extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType) {
        super(scene, name, x, y, texture, frame, 150, 80, 80, weapon, movementType);
        //visionRadius = 150, hp = 80, speed = 80 para el zorro
    }
}