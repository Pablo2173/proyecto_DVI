import Enemy from "../enemy";

export default class Zorro extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 750, hp = 60, speed = 140, hasFeather, routeFacing = []) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather, routeFacing);
        this.setScale(4);

        // Item especial que suelta al morir (usado por dropSpecialItem en Enemy)
        this.specialDrop = 'tail';
    }
    
}