import ConsumableItem from './consumable_drop.js';

export default class DropMask extends ConsumableItem {

    constructor(scene, x, y) {
        super(scene, x, y, 'feather_icon'); // Usamos el mismo sprite que la ramita, pero podría ser otro específico para la máscara

        // ajustar tamaño
        this.setScale(0.08);
    }

    interact(player) {
        // Solo destruir la máscara al recogerla, sin efecto
        this.destroy();
    }
}