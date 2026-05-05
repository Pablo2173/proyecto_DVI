import Phaser from 'phaser';


import finalSceneSound from '../../assets/sounds/final_scene.mp3';

const FINISH_DISPLAY_MS = 15000;
const FADE_IN_DURATION = 1000;
const FADE_OUT_DURATION = 900;

export default class FinishScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinishScene' });
    }

    preload() {
        this.load.audio('final_scene', finalSceneSound);
    }

    create() {
        
        const W = this.scale.width;
        const H = this.scale.height;

        this.sound.stopAll();

        this.finalSceneSound = this.sound.add('final_scene', {
            volume: 1
        });

        this.finalSceneSound.play();

        this.events.once('shutdown', () => {
            if (this.finalSceneSound) {
                this.finalSceneSound.stop();
            }
        });
        // ─────────────────────────────────────────
        // FONDO — base oscura con viñeta radial
        // ─────────────────────────────────────────
        this.bg = this.add.rectangle(0, 0, W, H, 0x000000, 1)
            .setOrigin(0, 0)
            .setDepth(0);

        // Gradiente radial simulado con círculo central ligeramente más claro
        this.bgGlow = this.add.graphics().setDepth(1);
        this._drawBgGlow(W, H);

        // ─────────────────────────────────────────
        // TEXTO DE VICTORIA — aparece por líneas con fade in
        // ─────────────────────────────────────────
        const lines = [
            'EL DUCKLER HA VENCIDO',
            'BAJO LAS SOMBRAS DE LA ALCANTARILLA, EL PATO RECORDÓ QUIÉN ERA',
            'NO SOLO UNA PRESA. NO SOLO UN SUPERVIVIENTE.',
            'SINO EL GUARDIÁN DEL PARQUE.',
            'Y CUANDO EL ÚLTIMO ECO SE APAGÓ...',
            'EL PARQUE VOLVIÓ A RESPIRAR.'
        ];

        const lineSpacing = 58;
        const startY = H / 2 - 150; 

        this._textLines = lines.map((line, i) => {
            const t = this.add.text(
                W / 2,
                startY + i * lineSpacing,
                line,
                {
                    fontFamily: 'ReturnOfTheBoss',
                    fontSize: i === 0 ? '64px' : '30px',
                    color: i === 0 ? '#ff2222' : '#ffdddd',
                    stroke: '#000000',
                    strokeThickness: i === 0 ? 7 : 5,
                    align: 'center',
                    wordWrap: {
                        width: W * 0.86,
                        useAdvancedWrap: true
                    }
                }
            )
                .setOrigin(0.5)
                .setDepth(10)
                .setAlpha(0);

            return t;
        });

        // Pequeña línea decorativa bajo el primer texto
        this.divider = this.add.graphics().setDepth(9).setAlpha(0);
        this.divider.lineStyle(3, 0xff2222, 0.7);
        this.divider.beginPath();
        this.divider.moveTo(W / 2 - 260, startY + lineSpacing - 18);
        this.divider.lineTo(W / 2 + 260, startY + lineSpacing - 18);
        this.divider.strokePath();

        // ─────────────────────────────────────────
        // OVERLAY DE FADE (se usa para fade in y fade out)
        // ─────────────────────────────────────────
        this.fadeOverlay = this.add.rectangle(0, 0, W, H, 0x000000, 1)
            .setOrigin(0, 0)
            .setDepth(100);

        // ─────────────────────────────────────────
        // SECUENCIA DE ANIMACIÓN DE ENTRADA
        // ─────────────────────────────────────────
        this._playIntroSequence(W, H, startY, lineSpacing);

        // ─────────────────────────────────────────
        // RESIZE
        // ─────────────────────────────────────────
        this._onResize = (gameSize) => {
            const nW = gameSize.width;
            const nH = gameSize.height;

            this.bg.setSize(nW, nH);
            this.fadeOverlay.setSize(nW, nH);

            this.bgGlow.clear();
            this._drawBgGlow(nW, nH);

            const nStartY = nH / 2 - 150;
            this._textLines.forEach((t, i) => {
                t.setPosition(nW / 2, nStartY + i * lineSpacing);
            });

            this.divider.clear();
            this.divider.lineStyle(3, 0xff2222, 0.7);
            this.divider.beginPath();
            this.divider.moveTo(nW / 2 - 260, nStartY + lineSpacing - 18);
            this.divider.lineTo(nW / 2 + 260, nStartY + lineSpacing - 18);
            this.divider.strokePath();
        };
        this.scale.on('resize', this._onResize, this);
        this.events.once('shutdown', () => this.scale.off('resize', this._onResize, this));

        // ─────────────────────────────────────────
        // TEMPORIZADOR → FADE OUT → MENÚ
        // ─────────────────────────────────────────
        this.time.delayedCall(FINISH_DISPLAY_MS - FADE_OUT_DURATION, () => {
            this._fadeToMenu();
        });
    }

    // ─────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────

    _drawBgGlow(W, H) {
        // Viñeta: zona central ligeramente más cálida (rojo muy oscuro)
        const cx = W / 2;
        const cy = H / 2;
        const radius = Math.min(W, H) * 0.55;

        this.bgGlow.clear();

        // Varios círculos concéntricos con alpha decreciente para simular gradiente
        const steps = 6;
        for (let i = steps; i >= 1; i--) {
            const ratio = i / steps;
            const r = radius * ratio;
            const alpha = 0.055 * (1 - ratio);
            this.bgGlow.fillStyle(0x660000, alpha);
            this.bgGlow.fillCircle(cx, cy, r);
        }
    }

    _playIntroSequence(W, H, startY, lineSpacing) {
        // Fade in del overlay (negro → transparente)
        this.tweens.add({
            targets: this.fadeOverlay,
            alpha: 0,
            duration: FADE_IN_DURATION,
            ease: 'Power2.easeOut'
        });

        // Aparición por líneas: cada una sale con delay escalonado
        this._textLines.forEach((t, i) => {
            const delay = FADE_IN_DURATION * 0.4 + i * 350;

            // Scale in + fade in combinados
            t.setScale(0.85);
            this.tweens.add({
                targets: t,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 600,
                delay,
                ease: 'Back.easeOut'
            });
        });

        // Divider aparece tras las líneas
        this.tweens.add({
            targets: this.divider,
            alpha: 1,
            duration: 400,
            delay: FADE_IN_DURATION * 0.4 + (this._textLines.length - 1) * 350 + 300,
            ease: 'Power1'
        });

        // Oscilación leve continua del primer texto (solo tras aparecer)
        this.time.delayedCall(FADE_IN_DURATION * 0.4 + 700, () => {
            if (!this._textLines[0] || !this._textLines[0].active) return;
            this.tweens.add({
                targets: this._textLines[0],
                y: `+=${6}`,
                duration: 2200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Parpadeo suave en el color del primer texto
            this.tweens.add({
                targets: this._textLines[0],
                alpha: 0.82,
                duration: 1600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    _fadeToMenu() {
        if (!this.fadeOverlay || !this.fadeOverlay.active) return;

        this.tweens.add({
            targets: this.fadeOverlay,
            alpha: 1,
            duration: FADE_OUT_DURATION,
            ease: 'Power2.easeIn',
            onComplete: () => {
                this.scene.start('MenuScene');
            }
        });
    }
}