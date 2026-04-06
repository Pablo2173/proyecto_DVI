import ConsumableItem from './consumable_drop.js';
import fox_tail_sprite from '../../../assets/sprites/consumables/fox_tail.png';

export default class FoxTail extends ConsumableItem {
    static preload(scene) {
        scene.load.image('fox_tail', fox_tail_sprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'fox_tail', 'fox_tail', 1);
        this.pickupType = 'interact';
        this.setScale(0.1);
    }
}