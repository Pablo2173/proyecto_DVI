import Phaser from 'phaser';

export default class FeatherUI {

    constructor(scene, duck) {

        this.scene = scene;
        this.duck = duck;
        this.icons = [];

        const startX = 1450;   // posición horizontal
        const startY = 32;   // posición vertical
        const spacing = 80;  // separación entre plumas

        for (let i = 0; i < duck.maxFeathers; i++) {

            const icon = scene.add.image(
                startX + i * spacing,
                startY,
                'feather_icon'
            );

            icon.setOrigin(0,0);
            icon.setScrollFactor(0);
            icon.setDepth(2000);
            icon.setScale(0.15);

            this.icons.push(icon);
        }

        this.refresh();
    }

    refresh() {

        for (let i = 0; i < this.icons.length; i++) {

            this.icons[i].setVisible(i < this.duck.feathers);

        }
    }

}