import DropItem from '../../dropItem.js';
import bread_sprite from '../../../../assets/sprites/consumables/bread_item.png';

export default class DropBread extends DropItem {

    static preload(scene) {
        scene.load.image('bread_item', bread_sprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'bread_item');

        // auto pickup: se recoge al hacer pasar por encima
        this.pickupType = 'auto';

        // añadir al grupo de consumibles para que el sistema de pickup del update() lo detecte
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }

        // ajustar tamaño
        this.setScale(3);
    }

    interact(player) {
        // El pan es moneda: se incrementa el contador global y se destruye
        // NO se añade a la ConsumableBar ni al inventario de consumibles
        if (player.scene && typeof player.scene.addBread === 'function') {
            player.scene.addBread(1);
        }

        this.destroy();
    }
}