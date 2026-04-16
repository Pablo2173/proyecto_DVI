import Enemy from "../enemy";

export default class Zorro extends Enemy {
    static BASE_STATS = {
        visionRadius: 750,
        hp: 60,
        speed: 140
    };

    constructor(scene, name, x, y, texture, frame, weapon, movementType, hasFeather, routeFacing = []) {
        const stats = Zorro.BASE_STATS;
        super(scene, name, x, y, texture, frame, stats.visionRadius, stats.hp, stats.speed, weapon, movementType, hasFeather, routeFacing);
        this.setScale(4);

        // Item especial que suelta al morir (usado por dropSpecialItem en Enemy)
        this.specialDrop = 'tail';
    }
    
}