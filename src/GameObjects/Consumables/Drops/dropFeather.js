import DropItem from '../../dropItem.js';

export default class DropFeather extends DropItem {

    constructor(scene, x, y) {
        super(scene, x, y, 'feather_icon');

        // añadir al grupo de consumibles
        if (scene.consumableItems) {
            scene.consumableItems.add(this);
        }

        // ajustar tamaño
        this.setScale(0.08);
    }

    interact(player) {

        // añadir una pluma al pato
        player.addFeather(1);

        // desaparecer
        this.destroy();
    }
}