import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';

// Armas
import Arco from '../GameObjects/Weapons/Distance/arco.js';
import Mcuaktro from '../GameObjects/Weapons/Distance/mcuaktro.js';
import Cuchillo from '../GameObjects/Weapons/Melee/cuchillo.js';
import Mazo from '../GameObjects/Weapons/Melee/mazo.js';
import Ramita from '../GameObjects/Weapons/Melee/ramita.js';

// Proyectiles
import Flecha from '../GameObjects/Projectiles/flecha.js';
import Bala from '../GameObjects/Projectiles/bala.js';

// Drops
import DropWeapon from '../GameObjects/Weapons/drops/dropWeapon.js';

import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import sprint_sprite from '../../assets/sprites/duck/sprint_duck.png';
import cuack_sprite from '../../assets/sprites/duck/Cuack_duck.png';
import enemy_sprite from '../../assets/sprites/player.png';
import cuackSound from '../../assets/sounds/cuack.mp3';

// Weapon bar
import bar from '../../assets/sprites/Weapons/weaponBar/weapon_bar_border.png';
import bar_fill from '../../assets/sprites/Weapons/weaponBar/weapon_bar_fill.png';
import Puddle from '../GameObjects/puddle.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.spritesheet('idle_duck', player_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck_walk', sprint_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-cuack', cuack_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-dash', sprint_sprite, { // Cambiar a sprite de bolita
            frameWidth: 32,
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

        // Preload de la barra de arma del jugador
        this.load.image('weapon_bar_border', bar);
        this.load.image('weapon_bar_fill', bar_fill);
    }

    create() {

        this.anims.create({
            key: 'duck-idle',
            frames: this.anims.generateFrameNumbers('idle_duck', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'duck-walk',
            frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'duck-cuack',
            frames: this.anims.generateFrameNumbers('duck-cuack', { start: 0, end: 0 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'duck-dash',
            frames: this.anims.generateFrameNumbers('duck-dash', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: 'duck-swimming',
            frames: this.anims.generateFrameNumbers('duck-swimming', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
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
        new DropWeapon(this, 450, 450, Mazo, 'mazo');

        // Arco en posición aleatoria
        new DropWeapon(
            this,
            Phaser.Math.Between(0, 1000),
            Phaser.Math.Between(0, 1000),
            Arco,
            'arco'
        );

        // ── Spawn de charco de agua visible temporal ──   
        const puddle = new Puddle(this, 300, 300, 100);
        const g = this.add.graphics();
        g.lineStyle(2, 0x0000ff, 1);
        g.strokeCircle(puddle.x, puddle.y, puddle.radius);

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
                if (this.enemy.isAlerted()) {
                    this.enemy.moveTowards(this.duck); // solo el target, sin más parámetros
                    this.enemy.setFlipX(this.enemy.x >= this.duck.x);
                }

                this.enemy.setFlipX(this.enemy.x >= this.duck.x);
            }

            // Radio de visión debug
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }

}