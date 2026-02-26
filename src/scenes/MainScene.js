import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';

// Armas
import Arco     from '../GameObjects/Weapons/Distance/arco.js';
import Mcuaktro from '../GameObjects/Weapons/Distance/mcuaktro.js';
import Cuchillo from '../GameObjects/Weapons/Melee/cuchillo.js';
import Mazo     from '../GameObjects/Weapons/Melee/mazo.js';
import Ramita   from '../GameObjects/Weapons/Melee/ramita.js';

// Proyectiles
import Flecha from '../GameObjects/Projectiles/flecha.js';
import Bala   from '../GameObjects/Projectiles/bala.js';

// Drops
import DropWeapon from '../GameObjects/Weapons/drops/dropWeapon.js';

import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import enemy_sprite  from '../../assets/sprites/player.png';
import cuackSound    from '../../assets/sounds/cuack.mp3';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.spritesheet('idle_duck', player_sprite, {
            frameWidth:  32,
            frameHeight: 32
        });
        this.load.image('enemy', enemy_sprite);
        this.load.audio('cuack', cuackSound);

        // Preload de todas las armas (cambiar)
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);
    }

    create() {

        // ── Animaciones del pato ──
        this.anims.create({
            key:       'duck-idle',
            frames:    this.anims.generateFrameNumbers('idle_duck', { start: 0, end: 3 }),
            frameRate: 8,
            repeat:    -1
        });

        // ── Fondo ──
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // ── Sonido ──
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // ── Grupo de drops — debe crearse ANTES que el pato y los drops ──
        this.dropItems = this.add.group();

        // ── Pato ──
        this.duck = new Duck(this, 200, 200, 'mcuaktro');

        // ── Atacar con click izquierdo (puntual o mantenido) ──
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // ── Enemigo ──
        this.enemy = new Enemy(this, 'Guard', 440, 200, 'enemy', null, 200);
        this.enemy.setFlipX(true);

        // ── Eventos de audio para el enemigo ──
        this.events.on('audio:event', (audioEvent) => {
            if (this.enemy) this.enemy.onAudioEvent(audioEvent);
        });

        // ── Graphics para radio de visión ──
        this.visionGraphics = this.add.graphics();
        this.enemyAlertTime = null;

        // ── Spawn de drops de ejemplo ──
        // Mazo en posición fija
        new DropWeapon(this, 350, 350, {
            texture:         'mazo',
            isRanged:        false,
            projectileClass: null,
            damage:          45,
            attackSpeed:     800,
            range:           90,
            optimalDistance: 65,
            swingAngle:      90,
            swingDuration:   180,
            scale:           1,
            debug:           true
        });

        // Arco en posición aleatoria
        new DropWeapon(
            this,
            Phaser.Math.Between(0, 1000),
            Phaser.Math.Between(0, 1000),
            {
                texture:         'arco',
                isRanged:        true,
                projectileClass: Flecha,
                projectileSpeed: 700,
                damage:          20,
                attackSpeed:     600,
                range:           400,
                optimalDistance: 280,
                scale:           1,
                debug:           true
            }
        );

        // ── HUD ──
        this.add.text(10, 10,
            'Mover: WASD / Flechas | Dash: Espacio | Recoger arma: E | Atacar: Click | Cuack: C',
            { fontSize: '14px', fill: '#FFFFFF' }
        );
    }

    update(time, delta) {
        // ── Ataque continuo mientras se mantiene el botón izquierdo ──
        if (this.input.activePointer.isDown && this.duck && this.duck.weapon) {
            this.duck.weapon.attack();
        }

        if (this.enemy) {
            this.enemy.detectAndAlert(this.duck);

            // Parpadeo amarillo 0.5s al alertarse
            if (this.enemy.isAlerted()) {
                if (this.enemyAlertTime === null) {
                    this.enemyAlertTime = time;
                    this.enemy.setTint(0xFFFF01);
                }
                if (time - this.enemyAlertTime > 500) {
                    this.enemy.clearTint();
                }
            } else {
                this.enemyAlertTime = null;
                this.enemy.clearTint();
            }

            // Enemigo camina hacia el pato cuando está alertado
            if (this.enemy.isAlerted()) {
                const pos = this.enemy.moveTowards(this.duck, 80, delta);
                this.enemy.setPosition(pos.x, pos.y);

                this.enemy.setFlipX(this.enemy.x >= this.duck.x);
            }

            // Radio de visión debug
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }
}