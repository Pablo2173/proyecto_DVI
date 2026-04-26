import Phaser from 'phaser';
import AttackPotion from './Consumables/attackPotion.js';
import SpeedPotion from './Consumables/SpeedPotion.js';
import SpeedAttackPotion from './Consumables/SpeedAttackPotion.js';
import Mcuaktro from './Weapons/Distance/mcuaktro.js';
import Mazo from './Weapons/Melee/mazo.js';
import Feather from './Consumables/Drops/dropFeather.js';
// Imports necesarios para usar los Drop como representación visual de items en tienda
import DropWeapon from './Consumables/Drops/dropWeapon.js';
import DropFeather from './Consumables/Drops/dropFeather.js';

/**
 * Store
 * Sistema de tienda en el mapa.
 * Genera 3 pociones en el suelo con precio visible.
 * El jugador puede comprarlas con panes (moneda) pulsando E.
 *
 * RESPONSABILIDADES:
 *  - Generar las pociones en el suelo
 *  - Asignar qué pociones aparecen (aleatorio)
 *  - Mostrar precios
 *  - Gestionar interacción (E)
 *  - Gestionar compra
 */
export default class Store {

    /**
     * Configuración de tipos disponibles con sus precios fijos.
     * AttackPotion → 1
     * SpeedPotion → 2
     * SpeedAttackPotion → 3
     * Mcuaktro → 10

     */
    static POTION_CATALOG = [
        { type: 'attack_potion',       PotionClass: AttackPotion,       price: 1 },
        { type: 'speed_potion',        PotionClass: SpeedPotion,        price: 2 },
        { type: 'speed_attack_potion', PotionClass: SpeedAttackPotion,  price: 3 },
        { type: 'feather',             FeatherClass: Feather,           price: 5 },
        { type: 'mcuaktro',            WeaponClass: Mcuaktro,           price: 10 },
        { type: 'mazo',                WeaponClass: Mazo,               price: 8 },
    ];

    // Separación horizontal entre cada slot de la tienda (px)
    static SLOT_SPACING = 120;

    // Distancia máxima (px) a la que el jugador puede interactuar con una poción
    static INTERACT_RADIUS = 60;

    // Mapa de tipo de item → clase de arma (para saber qué DropWeapon instanciar)
    static WEAPON_CLASS_MAP = {
        mcuaktro: Mcuaktro,
        mazo:     Mazo,
    };

    // Textura de la llave de cada tipo de arma (coincide con su texture key en Phaser)
    static WEAPON_TEXTURE_MAP = {
        mcuaktro: 'mcuaktro',
        mazo:     'mazo',
    };

    /**
     * @param {Phaser.Scene} scene         - Escena principal
     * @param {number}       x             - Posición X central de la tienda
     * @param {number}       y             - Posición Y de la tienda
     * @param {object}       duck          - Referencia al jugador (Duck)
     * @param {object}       consumableBar - Referencia a la barra de consumibles
     */
    constructor(scene, x, y, duck, consumableBar) {
        this.scene        = scene;
        this.x            = x;
        this.y            = y;
        this.duck         = duck;
        this.consumableBar = consumableBar;

        // Slots activos: cada elemento es { sprite, priceText, priceLabel, type, price } o null si ya fue comprado
        this.slots = [];

        // Índice del slot más cercano al jugador (-1 = ninguno)
        this._nearestSlotIndex = -1;

        // Posiciones guardadas para poder regenerar los items en el reroll
        this._spawnPositions = [];

        // Datos del slot de reroll: { sprite, priceLabel, slotX, slotY }
        this._rerollSlot = null;

        // Precio actual del reroll — se duplica en cada uso
        this.rerollPrice = 1;
    }

    // ─────────────────────────────────────────
    // SPAWN DE POCIONES
    // 5 pociones en línea horizontal, separadas uniformemente.
    // Ejemplo visual:
    //   [Poción]   [Poción]   [Poción]   [Poción]   [Poción]
    //     1           2          2          3          1
    // ─────────────────────────────────────────

    /**
     * Genera una poción aleatoria por cada posición recibida desde el mapa.
     * Sustituye al spawn manual de _spawnPotions() cuando se usa la capa 'Store' de Tiled.
     *
     * Cada posición corresponde exactamente a un objeto de la capa 'Store':
     *   { x: obj.x * SCALE, y: obj.y * SCALE }
     *
     * @param {Array<{x: number, y: number}>} positions - Posiciones escaladas de los objetos de slots del mapa
     * @param {{x: number, y: number}|null} rerollPosition - Posición del objeto 'reroll' en el mapa
     */
    spawnAtPositions(positions, rerollPosition = null) {
        const safePositions = Array.isArray(positions) ? positions : [];

        if (safePositions.length === 0 && !rerollPosition) {
            console.warn('[Store] spawnAtPositions: no se recibieron posiciones válidas.');
            return;
        }

        // Guardar posiciones para poder hacer reroll más adelante
        this._spawnPositions = safePositions;

        // Generar los items en cada posición
        this._spawnItemsAtPositions(safePositions);

        // Crear el slot de reroll solo si viene definido en la capa del mapa.
        if (rerollPosition) {
            this._spawnRerollSlot(rerollPosition);
        } else {
            this._destroyRerollSlot();
        }

        console.log(`[Store] spawnAtPositions: ${this.slots.length} item(s) de tienda generado(s) desde el mapa.`);
    }

    /**
     * Lógica interna de spawn de items.
     * Se extrae de spawnAtPositions para poder reutilizarla en el reroll.
     * @param {Array<{x: number, y: number}>} positions
     * @private
     */
    _spawnItemsAtPositions(positions) {
        positions.forEach(({ x: slotX, y: slotY }) => {
            // Selección aleatoria del catálogo (pueden repetirse entre slots)
            const catalogEntry = Phaser.Utils.Array.GetRandom(Store.POTION_CATALOG);

            // ── Representación visual usando el Drop system ──
            // Se usa DropWeapon o DropFeather según el tipo, en lugar de add.image(),
            // para garantizar escala y apariencia consistente con los drops de enemigos.
            const sprite = this._createDropVisual(catalogEntry.type, slotX, slotY);

            // Efecto flotante suave para que se vea viva
            this.scene.tweens.add({
                targets:  sprite,
                y:        slotY - 5,
                duration: 900,
                ease:     'Sine.easeInOut',
                yoyo:     true,
                repeat:   -1
            });

            // ── Texto de precio debajo del icono ──
            // Alineado con la poción
            const priceLabel = this.scene.add.text(slotX, slotY + 36, `${catalogEntry.price}`, {
                fontSize:        '22px',
                fill:            '#FFD700',
                fontStyle:       'bold',
                stroke:          '#000000',
                strokeThickness: 3,
                align:           'center',
            });
            priceLabel.setOrigin(0.5, 0);
            priceLabel.setDepth(101);

            // itemCategory identifica el flujo de compra:
            //   "weapon"  → equipar directamente al jugador
            //   "feather" → sumar +1 al contador de plumas
            //   "potion"  → añadir a consumable bar (flujo original)
            const itemCategory = Store.WEAPON_CLASS_MAP[catalogEntry.type]
                ? 'weapon'
                : catalogEntry.type === 'feather'
                    ? 'feather'
                    : 'potion';

            this.slots.push({
                sprite,
                priceLabel,
                type:         catalogEntry.type,
                itemCategory,
                price:        catalogEntry.price,
                slotX,
                slotY,
            });
        });
    }

    /**
     * Crea la representación visual de un item de tienda usando el Drop system.
     * - Armas → DropWeapon (escala y textura correctas automáticamente)
     * - Pluma → DropFeather (escala correcta automáticamente)
     * - Pociones → add.image (no tienen Drop dedicado, mantienen su sprite)
     *
     * En todos los casos se desactivan físicas para que el item quede estático
     * y no sea recogido automáticamente al entrar en rango.
     *
     * @param {string} type   - Tipo del item del catálogo
     * @param {number} slotX  - Posición X en el mundo
     * @param {number} slotY  - Posición Y en el mundo
     * @returns {Phaser.GameObjects.GameObject} El sprite/drop creado
     * @private
     */
    _createDropVisual(type, slotX, slotY) {
        let visual;

        if (Store.WEAPON_CLASS_MAP[type]) {
            // ── Arma → usar DropWeapon para escala y textura idénticas al drop de enemigo ──
            const weaponClass   = Store.WEAPON_CLASS_MAP[type];
            const textureKey    = Store.WEAPON_TEXTURE_MAP[type];
            visual = new DropWeapon(this.scene, slotX, slotY, weaponClass, textureKey);

            // Neutralizar físicas: el item de tienda no debe caer ni moverse
            if (visual.body) {
                visual.body.setAllowGravity(false);
                visual.body.setVelocity(0, 0);
                visual.body.setImmovable(true);
            }

            // Sacar del grupo dropItems para que MainScene no lo trate como drop recogible
            if (this.scene.dropItems) {
                this.scene.dropItems.remove(visual, false, false);
            }

        } else if (type === 'feather') {
            // ── Pluma → usar DropFeather para escala correcta (0.08 definida en la clase) ──
            visual = new DropFeather(this.scene, slotX, slotY);

            // Neutralizar físicas
            if (visual.body) {
                visual.body.setAllowGravity(false);
                visual.body.setVelocity(0, 0);
                visual.body.setImmovable(true);
            }

            // Sacar del grupo consumableItems para que MainScene no lo recoja automáticamente
            if (this.scene.consumableItems) {
                this.scene.consumableItems.remove(visual, false, false);
            }

        } else {
            // ── Consumibles sin Drop dedicado → sprite estático igual que antes ──
            visual = this.scene.add.image(slotX, slotY, type);
            visual.setScale(4);
        }

        visual.setDepth(100);
        return visual;
    }

    /**
     * Crea el slot de reroll en la posición definida por el objeto 'reroll' del mapa.
     * @param {{x: number, y: number}} position
     * @private
     */
    _spawnRerollSlot(position) {
        this._destroyRerollSlot();

        const rerollX = position.x;
        const rerollY = position.y;

        // Sprite de reroll como representación del slot de reroll
        const sprite = this.scene.add.image(rerollX, rerollY, 'reroll_icon');
        sprite.setScale(2);
        sprite.setDepth(100);

        // Efecto flotante igual que los demás items
        this.scene.tweens.add({
            targets:  sprite,
            y:        rerollY - 5,
            duration: 900,
            ease:     'Sine.easeInOut',
            yoyo:     true,
            repeat:   -1
        });

        // Etiqueta de precio con el precio actual del reroll
        const priceLabel = this.scene.add.text(rerollX, rerollY + 36, `${this.rerollPrice}`, {
            fontSize:        '22px',
            fill:            '#FF8C00',
            fontStyle:       'bold',
            stroke:          '#000000',
            strokeThickness: 3,
            align:           'center',
        });
        priceLabel.setOrigin(0.5, 0);
        priceLabel.setDepth(101);

        this._rerollSlot = {
            sprite,
            priceLabel,
            slotX: rerollX,
            slotY: rerollY,
        };
    }

    _destroyRerollSlot() {
        if (!this._rerollSlot) return;

        this._rerollSlot.sprite?.destroy();
        this._rerollSlot.priceLabel?.destroy();
        this._rerollSlot = null;
    }

    // ─────────────────────────────────────────
    // UPDATE — llamar desde MainScene.update()
    // ─────────────────────────────────────────

    /**
     * Actualiza la tienda cada frame:
     *  - Detecta qué poción está más cerca del jugador
     *  - Muestra/oculta el indicador [E]
     *  - Gestiona la compra al pulsar E
     *
     * @param {boolean} eJustDown - true si E fue pulsada este frame (calculado en MainScene)
     */
    update(eJustDown = false) {
        if (!this.duck || !this.duck.active) return;

        this._nearestSlotIndex = -1;
        let nearestDist = Store.INTERACT_RADIUS;

        // ── Detectar la poción más cercana dentro del radio de interacción ──
        this.slots.forEach((slot, index) => {
            if (!slot) return; // slot ya fue comprado y limpiado

            const dist = Phaser.Math.Distance.Between(
                this.duck.x, this.duck.y,
                slot.slotX,  slot.slotY
            );

            if (dist < nearestDist) {
                nearestDist            = dist;
                this._nearestSlotIndex = index;
            }
        });

        // ── Detectar si el jugador está cerca del reroll ──
        let nearReroll = false;
        if (this._rerollSlot) {
            const rerollDist = Phaser.Math.Distance.Between(
                this.duck.x, this.duck.y,
                this._rerollSlot.slotX, this._rerollSlot.slotY
            );
            nearReroll = rerollDist < Store.INTERACT_RADIUS;
        }

        // ── Gestionar compra o reroll al pulsar E ──
        // El reroll tiene prioridad si el jugador está más cerca de él
        if (eJustDown) {
            if (nearReroll) {
                this._tryReroll();
            } else if (this._nearestSlotIndex !== -1) {
                this._tryPurchase(this._nearestSlotIndex);
            }
        }
    }

    // ─────────────────────────────────────────
    // COMPRA
    // ─────────────────────────────────────────

    /**
     * Intenta comprar la poción del slot indicado.
     *
     * AL PULSAR E:
     *   SI tiene dinero:
     *     1. Restar panes: scene.addBread(-precio)
     *     2. Eliminar poción del suelo
     *     3. Añadir a consumable bar: addItemByType(type)
     *   SI NO tiene dinero:
     *     - No hacer nada
     *
     * @param {number} slotIndex - Índice del slot a comprar
     * @private
     */
    _tryPurchase(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        const { type, itemCategory, price } = slot;

        // ── Condición: el jugador debe tener suficientes panes ──
        if (this.scene.breadCount < price) {
            // No hay dinero suficiente — no pasa nada
            console.log(`[Store] Sin panes suficientes. Necesitas ${price}, tienes ${this.scene.breadCount}`);
            this._flashNoBread(slot);
            return;
        }

        // Tiene dinero — proceder con la compra

        // 1. Restar panes
        this.scene.addBread(-price);

        // 2. Aplicar efecto según categoría del item
        this._applyPurchaseEffect(slot);

        // 3. Eliminar item del suelo y limpiar slot
        this._destroySlot(slotIndex);

        console.log(`[Store] Comprado: ${type} (${itemCategory}) por ${price} panes. Panes restantes: ${this.scene.breadCount}`);
    }

    /**
     * Aplica el efecto de compra según la categoría del item:
     *   "weapon"  → equipa el arma directamente usando la lógica de DropWeapon.swapWeapon()
     *   "feather" → suma +1 pluma usando duck.addFeather() igual que DropFeather.interact()
     *   "potion"  → añade a consumable bar (flujo original, sin cambios)
     *
     * No se reinventa lógica: se reutiliza la de DropWeapon y DropFeather.
     *
     * @param {object} slot - Slot activo con { sprite, type, itemCategory, price, slotX, slotY }
     * @private
     */
    _applyPurchaseEffect(slot) {
        const { itemCategory, sprite } = slot;

        switch (itemCategory) {
            case 'weapon':
                // Reutiliza DropWeapon.swapWeapon(): equipa la nueva arma y
                // deja caer la anterior al suelo exactamente igual que al recoger un drop
                if (sprite && typeof sprite.swapWeapon === 'function') {
                    sprite.swapWeapon(this.duck);
                }
                break;

            case 'feather':
                // Reutiliza la misma llamada que DropFeather.interact(): +1 pluma
                if (this.duck && typeof this.duck.addFeather === 'function') {
                    this.duck.addFeather(1);
                }
                break;

            case 'potion':
            default:
                // Flujo original — NO se modifica
                this._addToConsumableBar(slot.type);
                break;
        }
    }

    /**
     * Intenta ejecutar el reroll de la tienda.
     * Condición: el jugador debe tener suficientes panes (>= rerollPrice).
     *
     * AL EJECUTAR:
     *  1. Restar panes
     *  2. Duplicar el precio del reroll para el siguiente uso
     *  3. Destruir todos los items actuales
     *  4. Regenerar nuevos items en las mismas posiciones del mapa
     * @private
     */
    _tryReroll() {
        if (!this._rerollSlot) return;

        // ── Condición: panes suficientes para el reroll ──
        if (this.scene.breadCount < this.rerollPrice) {
            console.log(`[Store] Reroll: Sin panes suficientes. Necesitas ${this.rerollPrice}, tienes ${this.scene.breadCount}`);
            this._flashNoBread(this._rerollSlot);
            return;
        }

        // 1. Restar panes
        this.scene.addBread(-this.rerollPrice);
        console.log(`[Store] Reroll ejecutado por ${this.rerollPrice} panes.`);

        // 2. Duplicar precio para el siguiente reroll
        this.rerollPrice *= 2;

        // 3. Destruir todos los items actuales
        this._destroyAllSlots();

        // 4. Regenerar items en las mismas posiciones del mapa
        this._spawnItemsAtPositions(this._spawnPositions);

        // 5. Actualizar la etiqueta de precio del reroll con el nuevo valor
        if (this._rerollSlot.priceLabel && this._rerollSlot.priceLabel.active) {
            this._rerollSlot.priceLabel.setText(`${this.rerollPrice}`);
        }

        console.log(`[Store] Reroll completado. ${this.slots.length} nuevos items generados. Próximo reroll: ${this.rerollPrice} panes.`);
    }

    /**
     * Añade una poción al inventario del jugador a través de la ConsumableBar.
     * Usa el sistema existente de consumables — NO crea lógica nueva de inventario.
     * Respeta los slots disponibles (máx 9).
     * @param {string} type - Tipo de consumible (ej: 'attack_potion')
     * @private
     */
    _addToConsumableBar(type) {
        if (!this.duck.consumables) {
            this.duck.consumables = [];
        }

        // Respetar slots disponibles (máx 9)
        if (this.duck.consumables.length >= 9) {
            console.log('[Store] Inventario lleno (máx 9). No se puede añadir el item.');
            return;
        }

        // Usar el sistema existente de consumables
        this.duck.consumables.push({
            type:  type,
            value: 1,
        });
    }

    /**
     * Destruye todos los elementos visuales de un slot y lo marca como nulo.
     * @param {number} slotIndex
     * @private
     */
    _destroySlot(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        slot.sprite?.destroy();
        slot.priceLabel?.destroy();

        // Marcar como comprado/vacío
        this.slots[slotIndex] = null;
    }

    /**
     * Destruye todos los slots activos de la tienda sin tocar el slot de reroll.
     * Usado internamente por el sistema de reroll.
     * @private
     */
    _destroyAllSlots() {
        this.slots.forEach((_, i) => this._destroySlot(i));
        this.slots = [];
    }

    /**
     * Feedback visual cuando no hay suficientes panes:
     * el precio parpadea en rojo brevemente.
     * @param {object} slot
     * @private
     */
    _flashNoBread(slot) {
        if (!slot?.priceLabel) return;

        const originalColor = '#FFD700';
        slot.priceLabel.setStyle({ fill: '#FF4444' });

        this.scene.time.delayedCall(400, () => {
            if (slot.priceLabel && slot.priceLabel.active) {
                slot.priceLabel.setStyle({ fill: originalColor });
            }
        });
    }

    /**
     * Destruye completamente la tienda (todos los slots, cartel y listeners).
     * Llamar si la tienda desaparece del mapa.
     */
    destroy() {
        this.slots.forEach((_, i) => this._destroySlot(i));
        this.slots = [];
        this._signText?.destroy();

        // Destruir slot de reroll
        this._destroyRerollSlot();
    }
}