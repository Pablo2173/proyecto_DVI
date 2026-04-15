import DropItem from '../dropItem.js';
import key_item from '../../../assets/sprites/consumables/key_item.png';

export default class Key extends DropItem {
    
    static preload(scene) {
        scene.load.image('key_item', key_item);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'key_item');
        this.setScale(3);

        // interact pickup: se recoge con la tecla E
        this.pickupType = 'interact';

        // añadir al grupo de consumibles
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }
    }

    /**
     * La llave abre puertas cerradas cercanas.
     * Solo funciona si hay una puerta cerrada dentro del rango.
     * @param {Duck} player
     */
    interact(player) {
        if (!player.consumables) {
            player.consumables = [];
        }

        if (player.consumables.length >= 9) {
            console.log('Inventario de consumibles lleno (max 9)');
            return;
        }

        player.consumables.push({ type: 'key', value: 1 });
        player.scene?.consumableBar?.update?.();
        console.log(`Llave recogida. Items en inventario: ${player.consumables.length}/9`);

        this.destroy();
    }

    /**
     * Intenta abrir una puerta cerrada cerca del jugador.
     * @param {Duck} player
     * @returns {boolean} true si abrió una puerta, false si no había puertas cerca
     */
    openNearbyDoor(player) {
        if (!player.scene || !player.scene.puertaCerradaLayer) {
            return false;
        }

        const SCALE = 4; // Escala del mapa (definida en MainScene)
        const TILE_SIZE = 16; // Tamaño de los tiles en pixeles
        const range = 80; // Rango de deteccion de puertas

        // Convertir coordenadas de pixeles a coordenadas de tiles
        const playerTileX = Math.floor(player.x / SCALE / TILE_SIZE);
        const playerTileY = Math.floor(player.y / SCALE / TILE_SIZE);
        const rangeTiles = Math.ceil(range / SCALE / TILE_SIZE);

        // Obtener los tiles de puerta cerrada en un area alrededor del jugador
        const tilesX = player.scene.puertaCerradaLayer.getTilesWithin(
            playerTileX - rangeTiles,
            playerTileY - rangeTiles,
            rangeTiles * 2,
            rangeTiles * 2
        ).filter(tile => tile && tile.index !== -1);

        if (tilesX.length > 0) {
            // Hay una puerta cerrada cerca, remover los tiles
            tilesX.forEach(tile => {
                player.scene.puertaCerradaLayer.removeTileAt(tile.x, tile.y);
            });

            return true;
        }

        return false;
    }
}
