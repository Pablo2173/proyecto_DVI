import Phaser from 'phaser';

const FINISH_DISPLAY_MS = 15000;

export default class FinishScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinishScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // ─────────────────────────────────────────
        // FONDO NEGRO
        // ─────────────────────────────────────────
        this.bg = this.add.rectangle(0, 0, W, H, 0x000000, 1)
            .setOrigin(0, 0)
            .setDepth(0);

        // ─────────────────────────────────────────
        // TEXTO DE VICTORIA
        // ─────────────────────────────────────────
        this.victoryText = this.add.text(
            W / 2,
            H / 2,
            'ENHORABUENA\n\nHAS CONSEGUIDO VENGARTE\n\nEL PARQUE VUELVE A ESTAR A SALVO',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '72px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }
        )
            .setOrigin(0.5)
            .setDepth(1);

        // ─────────────────────────────────────────
        // RESIZE
        // ─────────────────────────────────────────
        this._onResize = (gameSize) => {
            this.bg.setSize(gameSize.width, gameSize.height);
            this.victoryText.setPosition(gameSize.width / 2, gameSize.height / 2);
        };
        this.scale.on('resize', this._onResize, this);
        this.events.once('shutdown', () => this.scale.off('resize', this._onResize, this));

        // ─────────────────────────────────────────
        // TEMPORIZADOR → VOLVER AL MENÚ
        // ─────────────────────────────────────────
        this.time.delayedCall(FINISH_DISPLAY_MS, () => {
            this.scene.start('MenuScene');
        });
    }
}