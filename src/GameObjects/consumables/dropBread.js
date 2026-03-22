import DropItem from '../dropItem.js';
import bread_sprite from '../../../assets/sprites/consumables/bread_item.png';

export default class DropBread extends DropItem {

    static preload(scene) {
        scene.load.image('bread_item', bread_sprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'bread_item');

        // auto pickup: se recoge al hacer pasar por encima
        this.pickupType = 'auto';

        // añadir al grupo de consumibles
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }

        // ajustar tamaño
        this.setScale(3);
    }

    interact(player) {
        // inicializar inventario si no existe
        if (!player.consumables) {
            player.consumables = [];
        }

        // no recoger si el inventario está lleno
        if (player.consumables.length >= 9) {
            console.log('Inventario de consumibles lleno (máx 9)');
            return;
        }

        // añadir pan al inventario
        player.consumables.push({ type: 'bread', value: 1 });
        console.log(`Pan recogido. Items en inventario: ${player.consumables.length}/9`);

        this.destroy();
    }
}