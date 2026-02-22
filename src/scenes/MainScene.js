import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';
import Weapon from '../GameObjects/weapon.js';
import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/player.png'; //la de pato_con_rama queda demasiado grande
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
        Weapon.preload(this);
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // Pre-cargar sonido de cuack para evitar input lag
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // crear el pato con arma (si cambias el nombre cambia el arma)
        this.duck = new Duck(this, 200, 200, 'mcuaktro');

        // click para atacar con el arma del pato
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // crear enemigo (uso el sprite del player porque aun no hay de enemigo xd)
        //esto es para pura prueba, en realidad habria que crear los diferentes tipos de enemigos 
        this.enemySprite = this.add.sprite(440, 200, 'enemy');
        this.enemySprite.setFlipX(true);
        this.enemy = new Enemy('Guard', this.enemySprite.x, this.enemySprite.y, 200);

        // Registra observador: el enemigo escucha los eventos de sonido
        // Esto permite que el enemigo reaccione a diferentes tipos de sonidos (cuac, dash, disparos, etc.)
        this.events.on('audio:event', (audioEvent) => {
            if (this.enemy) {
                this.enemy.onAudioEvent(audioEvent);
            }
        });

        // graphics para depurar radio de visión
        this.visionGraphics = this.add.graphics();

        // tracking del estado de alerta del enemigo para el parpadeo
        this.enemyAlertTime = null;

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
            this.enemy.detectAndAlert(this.duck);
            
            // Parpadeo amarillo claro de 0.5s cuando se alerta
            if (this.enemy.isAlerted()) {
                if (this.enemyAlertTime === null) {
                    // Acaba de alertarse: registrar el tiempo
                    this.enemyAlertTime = time;
                    this.enemySprite.setTint(0xFFFF01); //lo he puesto en amarillo claro porque no me deja con blanco
                }
                // Si han pasado 500ms desde la alerta, limpiar el tint
                if (time - this.enemyAlertTime > 500) {
                    this.enemySprite.clearTint();
                }
            } else {
                this.enemyAlertTime = null;
                this.enemySprite.clearTint();
            }

            // Cuando el enemigo detecta al patete camina hacia él
            if (this.enemy.isAlerted()) {
                const pos = this.enemy.moveTowards(this.duck, 80, delta); //lo llamo con 80 de speed por probar
                this.enemySprite.setPosition(pos.x, pos.y);               //la speed se cambiará por la del propio enemigo

                if (this.enemySprite.x < this.duck.x) {
                    this.enemySprite.setFlipX(false);
                } else {
                    this.enemySprite.setFlipX(true);
                }
            }

            // dibuja el radio de visión (para hacer nosotros las pruebas, para la version final esto se quita)
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }
}