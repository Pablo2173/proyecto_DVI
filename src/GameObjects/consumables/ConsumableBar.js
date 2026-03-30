import Phaser from 'phaser';
// Importar consumibles directamente
import Bread from './bread.js';
import AttackPotion from './attackPotion.js';
import SpeedPotion from './speedPotion.js';

export default class ConsumableBar {

    constructor(scene, duck) {
        this.scene = scene;
        this.duck = duck;

        // Posiciones y dimensiones de los slots
        this.slotWidth = 80;
        this.slotHeight = 80;
        this.slotSpacing = 10;
        this.startX = 100; // Posición inicial en X
        this.startY = 30;  // Posición inicial en Y (dentro de up_bar)

        this.slots = []; // Array de objetos gráficos para cada slot
        this.createSlots();
        this.setupKeyboardInput();
    }

    /**
     * Configura los controles de teclado para usar consumibles
     */
    setupKeyboardInput() {
        // Crear teclas para los números 1-9
        this.key1 = this.scene.input.keyboard.addKey('ONE');
        this.key2 = this.scene.input.keyboard.addKey('TWO');
        this.key3 = this.scene.input.keyboard.addKey('THREE');
        this.key4 = this.scene.input.keyboard.addKey('FOUR');
        this.key5 = this.scene.input.keyboard.addKey('FIVE');
        this.key6 = this.scene.input.keyboard.addKey('SIX');
        this.key7 = this.scene.input.keyboard.addKey('SEVEN');
        this.key8 = this.scene.input.keyboard.addKey('EIGHT');
        this.key9 = this.scene.input.keyboard.addKey('NINE');
    }

    /**
     * Crea los 9 slots visuales para los consumibles
     */
    createSlots() {
        for (let i = 0; i < 9; i++) {
            const x = this.startX + (i * (this.slotWidth + this.slotSpacing));
            const y = this.startY;

            // Crear un contenedor para cada slot
            const slot = {
                index: i + 1, // Números 1-9
                x: x,
                y: y,
                background: null,
                text: null,
                itemText: null
            };

            // Fondo del slot (ahora es interactivo)
            slot.background = this.scene.add.rectangle(x, y, this.slotWidth, this.slotHeight, 0x333333, 0.7);
            slot.background.setOrigin(0);
            slot.background.setScrollFactor(0);
            slot.background.setStrokeStyle(2, 0xffffff, 0.5);
            slot.background.setInteractive();

            // Evento de click en el slot
            slot.background.on('pointerdown', () => {
                this.onSlotClick(i);
            });

            // Número del slot (1-9)
            slot.text = this.scene.add.text(x + 5, y + 5, String(slot.index), {
                fontSize: '16px',
                fill: '#FFFFFF',
                fontStyle: 'bold'
            });
            slot.text.setOrigin(0);
            slot.text.setScrollFactor(0);

            // Sprite del item (vacío por ahora)
            slot.itemSprite = null;

            this.slots.push(slot);
        }
    }

    /**
     * Actualiza la visualización de los consumibles
     */
    update() {
        if (!this.duck.consumables) return;

        // Verificar input de teclado para consumir items
        this.checkKeyboardInput();

        // Limpiar todos los slots
        this.slots.forEach(slot => {
            if (slot.itemSprite) {
                slot.itemSprite.destroy();
                slot.itemSprite = null;
            }
            slot.background.setStrokeStyle(2, 0xffffff, 0.5);
        });

        // Llenar los slots con los consumibles actuales
        this.duck.consumables.forEach((consumable, index) => {
            if (index < this.slots.length) {
                const slot = this.slots[index];

                // Crear imagen del consumible
                const spriteKey = this.getSpriteKey(consumable.type);
                if (spriteKey) {
                    slot.itemSprite = this.scene.add.image(
                        slot.x + this.slotWidth / 2,
                        slot.y + this.slotHeight / 2,
                        spriteKey
                    );
                    slot.itemSprite.setScale(3); // Escalar para que sea x3 más grande
                    slot.itemSprite.setScrollFactor(0);
                }

                // Cambiar color del borde si hay item
                slot.background.setStrokeStyle(2, 0x00FF00, 1);
            }
        });
    }

    /**
     * Verifica el input de teclado para consumir items
     */
    checkKeyboardInput() {
        // Usar checkDown con cooldown para evitar consumos múltiples
        if (this.scene.input.keyboard.checkDown(this.key1, 250)) {
            this.onSlotClick(0); // Slot 1 (índice 0)
        }
        if (this.scene.input.keyboard.checkDown(this.key2, 250)) {
            this.onSlotClick(1); // Slot 2 (índice 1)
        }
        if (this.scene.input.keyboard.checkDown(this.key3, 250)) {
            this.onSlotClick(2); // Slot 3 (índice 2)
        }
        if (this.scene.input.keyboard.checkDown(this.key4, 250)) {
            this.onSlotClick(3); // Slot 4 (índice 3)
        }
        if (this.scene.input.keyboard.checkDown(this.key5, 250)) {
            this.onSlotClick(4); // Slot 5 (índice 4)
        }
        if (this.scene.input.keyboard.checkDown(this.key6, 250)) {
            this.onSlotClick(5); // Slot 6 (índice 5)
        }
        if (this.scene.input.keyboard.checkDown(this.key7, 250)) {
            this.onSlotClick(6); // Slot 7 (índice 6)
        }
        if (this.scene.input.keyboard.checkDown(this.key8, 250)) {
            this.onSlotClick(7); // Slot 8 (índice 7)
        }
        if (this.scene.input.keyboard.checkDown(this.key9, 250)) {
            this.onSlotClick(8); // Slot 9 (índice 8)
        }
    }

    /**
     * Obtiene la clave del sprite basado en el tipo de consumible
     * @param {string} type - Tipo del consumible
     * @returns {string|null} - Clave del sprite o null si no existe
     */
    getSpriteKey(type) {
        const spriteMap = {
            'bread': 'bread_item',
            'attack_potion': 'attack_potion',
            'speed_potion': 'speed_potion',
            'health_potion': 'bread_item', // Placeholder
            'mana_potion': 'bread_item',   // Placeholder
            // Agregar más tipos aquí: 'health': 'health_potion', etc.
        };
        return spriteMap[type] || null;
    }

    /**
     * Maneja el click en un slot
     * @param {number} slotIndex - Índice del slot clickeado (0-8)
     */
    onSlotClick(slotIndex) {
        if (!this.duck.consumables || slotIndex >= this.duck.consumables.length) {
            return; // Slot vacío
        }

        const consumable = this.duck.consumables[slotIndex];

        // Llamar al efecto de uso del consumable
        this.useConsumable(consumable);

        // Remover del inventario
        this.duck.consumables.splice(slotIndex, 1);

        // Actualizar la visualización
        this.update();
    }

    /**
     * Usa un consumible llamando a su función use_effect
     * @param {Object} consumable - El objeto consumible con type y value
     */
    useConsumable(consumable) {
        // Ejecutar el efecto directamente basado en el tipo
        this.executeUseEffect(consumable.type, this.duck);
    }

    /**
     * Ejecuta el efecto de uso basado en el tipo de consumible
     * @param {string} type - Tipo del consumible
     * @param {Duck} duck - El pato que usa el consumible
     */
    executeUseEffect(type, duck) {
        switch (type) {
            case 'bread':
                this.useBreadEffect(duck);
                break;
            case 'attack_potion':
                this.useAttackPotionEffect(duck);
                break;
            case 'speed_potion':
                this.useSpeedPotionEffect(duck);
                break;
            case 'health_potion':
                this.useHealthPotionEffect(duck);
                break;
            case 'mana_potion':
                this.useManaPotionEffect(duck);
                break;
            // Agregar más casos aquí para otros consumibles
            default:
                console.log(`Efecto de uso no definido para: ${type}`);
        }
    }

    /**
     * Efecto específico del bread: crea otro pan cerca del pato
     * @param {Duck} duck - El pato que usa el consumible
     */
    useBreadEffect(duck) {
        console.log('Usando pan: creando nuevo pan cerca del pato');

        // Generar posición aleatoria cerca del pato (radio de 100-200 píxeles)
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100; // Entre 100 y 200 píxeles

        const x = duck.x + Math.cos(angle) * distance;
        const y = duck.y + Math.sin(angle) * distance;

        // Crear nuevo pan directamente
        new Bread(duck.scene, x, y);
    }

    /**
     * Efecto específico de la poción de ataque: duplica el daño por 30 segundos
     * @param {Duck} duck - El pato que usa el consumible
     */
    useAttackPotionEffect(duck) {
        console.log('Usando poción de ataque: duplicando daño por 30 segundos');

        // Duplicar el multiplicador de daño
        if (!duck.damageMultiplier) {
            duck.damageMultiplier = 1;
        }
        duck.damageMultiplier *= 2;

        // Resetear después de 30 segundos
        duck.scene.time.delayedCall(30000, () => {
            if (duck.damageMultiplier) {
                duck.damageMultiplier /= 2;
                console.log('Efecto de poción de ataque terminado: daño restaurado');
            }
        });
    }

    /**
     * Efecto específico de la poción de velocidad: duplica la velocidad por 15 segundos
     * @param {Duck} duck - El pato que usa el consumible
     */
    useSpeedPotionEffect(duck) {
        console.log('Usando poción de velocidad: duplicando velocidad por 15 segundos');
        
        // Duplicar el multiplicador de velocidad
        if (!duck.speedMultiplier) {
            duck.speedMultiplier = 1;
        }
        duck.speedMultiplier *= 2;

        // Resetear después de 15 segundos
        duck.scene.time.delayedCall(15000, () => {
            if (duck.speedMultiplier) {
                duck.speedMultiplier /= 2;
                console.log('Efecto de poción de velocidad terminado: velocidad restaurada');
            }
        });
    }

    /**
     * Destruye la barra de consumibles
     */
    destroy() {
        this.slots.forEach(slot => {
            slot.background?.destroy();
            slot.text?.destroy();
            slot.itemSprite?.destroy();
        });
        this.slots = [];
    }
}
