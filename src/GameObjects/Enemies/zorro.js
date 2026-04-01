import Enemy from "../enemy";

export default class Zorro extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 150, hp = 80, speed = 80) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType);
        //visionRadius = 150, hp = 80, speed = 80 para el zorro
    }
}