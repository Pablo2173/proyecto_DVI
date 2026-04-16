import ConsumableItem from './Drops/consumableDrop.js';
import speedPotionSprite from '../../../assets/sprites/consumables/speed_potion.png'; // Placeholder, usar bread_item por ahora

export default class SpeedPotion extends ConsumableItem {

    static preload(scene) {
        scene.load.image('speed_potion', speedPotionSprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'speed_potion', 'speed_potion', 1);
        this.scale = 3;
    }

    /**
     * Aplica el efecto de la poción de velocidad (duplica la velocidad durante 15 segundos)
     * @param {Duck} player
     */
    applyEffect(player) {
        console.log('Poción de velocidad consumida: velocidad duplicada por 15 segundos');
        // Aquí se puede añadir lógica de boost de velocidad al pato
    }

    /**
     * Efecto de uso de la poción de velocidad: duplica la velocidad del jugador por 15 segundos
     * @param {Duck} player - El pato que usa el consumible
     */
    use_effect(player) {
        console.log('Usando poción de velocidad: duplicando velocidad por 15 segundos');

        // Duplicar el multiplicador de velocidad
        if (!player.speedMultiplier) {
            player.speedMultiplier = 1;
        }
        player.speedMultiplier *= 2;

        // Resetear después de 15 segundos
        player.scene.time.delayedCall(15000, () => {
            if (player.speedMultiplier) {
                player.speedMultiplier /= 2;
                console.log('Efecto de poción de velocidad terminado: velocidad restaurada');
            }
        });
    }
}