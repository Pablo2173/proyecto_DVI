import ConsumableItem from './Drops/consumableDrop.js';
import bread_sprite from '../../../assets/sprites/consumables/bread_item.png';

export default class Bread extends ConsumableItem {
    
    static preload(scene) {
        scene.load.image('bread_item', bread_sprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'bread_item', 'bread', 1);
        this.scale = 3;
        // El pan es moneda: el pickup type es auto para ser recogido al pasar por encima
        this.pickupType = 'auto';
    }

    /**
     * El pan es moneda del juego.
     * Al interactuar, incrementa el contador global de breadCount en la escena.
     * NO se añade a la ConsumableBar ni al inventario de consumibles.
     * @param {Duck} player
     */
    interact(player) {
        if (player.scene && typeof player.scene.addBread === 'function') {
            player.scene.addBread(1);
        }

        // Destruir el drop
        this.destroy();
    }

    /**
     * Aplica el efecto del pan (recupera vida)
     * @param {Duck} player
     */
    applyEffect(player) {
        console.log('Pan consumido: +10 salud');
        // Aquí se puede añadir lógica de recuperación de vida al pato
    }

    /**
     * Efecto de uso del pan: crea otro pan en posición aleatoria cerca del pato
     * @param {Duck} player - El pato que usa el consumible
     */
    use_effect(player) {
        
        // Generar posición aleatoria cerca del pato (radio de 100-200 píxeles)
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100; // Entre 100 y 200 píxeles
        
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        // Crear nuevo pan en la escena
        new Bread(player.scene, x, y);
    }
}