import DropItem from '../dropItem.js';

export default class DropTail extends DropItem {
    constructor(scene, x, y) {
        super(scene, x, y, 'tail_icon');
        this.setScale(3);

        // interact pickup: se recoge con la tecla E
        this.pickupType = 'interact';

        // añadir al grupo de consumibles
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }
    }

    interact(player) {
        // Añadir la cola a la barra de consumibles del jugador
        if (!player.consumables) {
            player.consumables = [];
        }

        if (player.consumables.length >= 9) {
            console.log('Inventario de consumibles lleno (máx 9)');
            return;
        }

        player.consumables.push({ type: 'tail', value: 1 });
        console.log(`Cola recogida. Items en inventario: ${player.consumables.length}/9`);

        this.destroy();
    }
}