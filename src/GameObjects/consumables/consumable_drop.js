import DropItem from '../dropItem.js';

export default class ConsumableItem extends DropItem {
    
    constructor(scene, x, y, texture, consumableType, value = 1) {
        super(scene, x, y, texture);
        
        this.consumableType = consumableType; // ej: 'health', 'mana', etc.
        this.value = value; // cantidad a recuperar/añadir
        
        // Agregar al grupo de consumables de la escena
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }
    }

    /**
     * Implementación de interact para consumibles.
     * Añade el consumible a la lista del jugador si no está llena (max 9).
     * @param {Duck} player
     */
    interact(player) {
        // Inicializar lista si no existe
        if (!player.consumables) {
            player.consumables = [];
        }

        // Verificar si la lista está llena (máximo 9 items)
        if (player.consumables.length >= 9) {
            console.log('Inventario de consumibles lleno (máx 9)');
            return; // No hacer nada si está lleno
        }

        // Añadir el consumible a la lista
        player.consumables.push({
            type: this.consumableType,
            value: this.value
        });

        console.log(`Consumible recogido: ${this.consumableType} +${this.value}`);
        console.log(`Items en inventario: ${player.consumables.length}/9`);
        
        // Destruir el drop
        this.destroy();
    }

    /**
     * Aplica el efecto del consumible al jugador.
     * Puede ser sobrescrito en subclases.
     * @param {Duck} player
     */
    applyEffect(player) {
        console.log(`${this.consumableType} consumido: +${this.value}`);
        // Aquí se pueden añadir efectos específicos
    }
}
