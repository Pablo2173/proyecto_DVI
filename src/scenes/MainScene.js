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

import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/player.png';
import enemy_sprite from '../../assets/sprites/player.png';
import cuackSound from '../../assets/sounds/cuack.mp3';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('pato', player_sprite);
        this.load.image('enemy', enemy_sprite);
        this.load.audio('cuack', cuackSound);
        // No se si esto hay que cargarlo aqui o cada arma se encarga de cargar su propia textura
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // Pre-cargar sonido de cuack para evitar input lag
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // crear el pato con arma
        this.duck = new Duck(this, 200, 200, 'mazo');

        // click para atacar con el arma del pato
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // crear enemigo (uso el sprite del player porque aun no hay de enemigo xd)
        //esto es para pura prueba, en realidad habria que crear los diferentes tipos de enemigos 
        this.enemySprite = this.add.sprite(440, 200, 'enemy');
        this.enemySprite.setFlipX(true);
        this.enemy = new Enemy('Guard', this.enemySprite.x, this.enemySprite.y, 200);

        // graphics para depurar radio de visión
        this.visionGraphics = this.add.graphics();

        // instrucciones en pantalla
        this.add.text(10, 10, 'Control: Flechas | Dash: Espacio | Pick: E | Drop: Q | Atacar: Click izquierdo | Cuack: C', {
            fontSize: '16px',
            fill: '#FFFFFF'
        });
    }

    update(time, delta) {
        // Duck.preUpdate se llama automáticamente
        // actualizar lógica del enemigo: sincronizar posición y detectar al jugador
        if (this.enemySprite && this.enemy) {
            this.enemy.setPosition(this.enemySprite.x, this.enemySprite.y);
            const alerted = this.enemy.detectAndAlert(this.duck);
            if (alerted) {
                this.enemySprite.setTint(0xff0000);
            } else {
                this.enemySprite.clearTint();
            }

            // dibujar radio de visión (para hacer nosotros las pruebas, para la version final esto se quita)
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }
}