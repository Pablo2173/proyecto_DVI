import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';
import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/player.png'; //la de pato_con_rama queda demasiado grande
import enemy_sprite from '../../assets/sprites/player.png';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('pato', player_sprite);
        this.load.image('enemy', enemy_sprite);
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // crear pato con sprite
        this.duck = new Duck(this, 200, 200, 'pato');

        // crear enemigo (uso el sprite del player porque aun no hay de enemigo xd)
        //esto es para pura prueba, en realidad habria que crear los diferentes tipos de enemigos 
        this.enemySprite = this.add.sprite(440, 200, 'enemy');
        this.enemySprite.setFlipX(true);
        this.enemy = new Enemy('Guard', this.enemySprite.x, this.enemySprite.y, 200);

        // graphics para depurar radio de visión
        this.visionGraphics = this.add.graphics();

        // instrucciones en pantalla
        this.add.text(10, 10, 'Control: Flechas | Dash: Espacio | Pick: P', {
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