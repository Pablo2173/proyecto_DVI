import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';

// Armas
import Arco from '../GameObjects/Weapons/Distance/arco.js';
import Mcuaktro from '../GameObjects/Weapons/Distance/mcuaktro.js';
import Cuchillo from '../GameObjects/Weapons/Melee/cuchillo.js';
import Mazo from '../GameObjects/Weapons/Melee/mazo.js';
import Ramita from '../GameObjects/Weapons/Melee/ramita.js';
import Escoba from '../GameObjects/Weapons/Melee/escoba.js';

// Proyectiles
import Flecha from '../GameObjects/Projectiles/flecha.js';
import Bala from '../GameObjects/Projectiles/bala.js';

// Drops
import DropWeapon from '../GameObjects/Weapons/drops/dropWeapon.js';
import Bread from '../GameObjects/consumables/bread.js';

import AttackPotion from '../GameObjects/consumables/attackPotion.js';

import SpeedPotion from '../GameObjects/consumables/SpeedPotion.js';
import SpeedAttackPotion from '../GameObjects/consumables/SpeedAttackPotion.js';


import DropBread from '../GameObjects/consumables/dropBread.js';
import DropMask from '../GameObjects/consumables/dropMask.js';


import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import sprint_sprite from '../../assets/sprites/duck/sprint_duck.png';
import cuack_sprite from '../../assets/sprites/duck/Cuack_duck.png';
import enemy_sprite from '../../assets/sprites/player.png';

//Sounds
import cuackSound from '../../assets/sounds/cuack.mp3';
import deathSound from '../../assets/sounds/YouDied.mp3';
// Weapon bar
import bar from '../../assets/sprites/Weapons/weaponBar/weapon_bar_border.png';
import bar_fill from '../../assets/sprites/Weapons/weaponBar/weapon_bar_fill.png';
import up_bar from '../../assets/sprites/UI/up_bar.png';
import Puddle from '../GameObjects/puddle.js';
import ConsumableBar from '../GameObjects/consumables/ConsumableBar.js';

// Enemigos
import Zorro from '../GameObjects/Enemies/zorro.js';
import Mapache from '../GameObjects/Enemies/mapache.js';

// Tilesets
import mapaJson from '../../assets/maps/level1_entrada_al_parque_mapa.json';
import darkGrassMiddleMiddle from '../../assets/tilesets/dark-grass-middle-middle.png';
import sidewalk1 from '../../assets/tilesets/sidewalk-1.png';
import asphaltRoad1 from '../../assets/tilesets/asphalt-road-1.png';
import asphaltRoad3 from '../../assets/tilesets/asphalt-road-3.png';
import asphaltRoad2 from '../../assets/tilesets/asphalt-road-2.png';
import sidewalk5 from '../../assets/tilesets/sidewalk-5.png';
import dirtpath1 from '../../assets/tilesets/dirtpath-1.png';
import dirtpath8 from '../../assets/tilesets/dirtpath-8.png';
import dirtpath9 from '../../assets/tilesets/dirtpath-9.png';
import dirtpath10 from '../../assets/tilesets/dirtpath-10.png';
import dirtpath11 from '../../assets/tilesets/dirtpath-11.png';
import dirtpath15 from '../../assets/tilesets/dirtpath-15.png';
import dirtpath12 from '../../assets/tilesets/dirtpath-12.png';
import dirtpath13 from '../../assets/tilesets/dirtpath-13.png';
import dirtpath14 from '../../assets/tilesets/dirtpath-14.png';
import dirtpath2 from '../../assets/tilesets/dirtpath-2.png';
import dirtpath5 from '../../assets/tilesets/dirtpath-5.png';
import dirtpath4 from '../../assets/tilesets/dirtpath-4.png';
import dirtpath6 from '../../assets/tilesets/dirtpath-6.png';
import house2 from '../../assets/tilesets/house-2.png';
import woodFenceLeftMiddle from '../../assets/tilesets/wood-fence-left-middle.png';
import woodFenceRightMiddle from '../../assets/tilesets/wood-fence-right-middle.png';
import woodFenceInteriorCorner1 from '../../assets/tilesets/wood-fence-interior-corner-1.png';
import woodFenceBottomMiddle from '../../assets/tilesets/wood-fence-bottom-middle.png';
import woodFenceInteriorCorner2 from '../../assets/tilesets/wood-fence-interior-corner-2.png';
import woodFenceInteriorCorner3 from '../../assets/tilesets/wood-fence-interior-corner-3.png';
import woodFenceTopLeftCorner from '../../assets/tilesets/wood-fence-top-left-corner.png';
import apartmentBuilding from '../../assets/tilesets/apartment-building.png';
import groceryStore from '../../assets/tilesets/grocery-store.png';
import tree1 from '../../assets/tilesets/tree-1.png';
import smallBushesBlueBerries from '../../assets/tilesets/small-bushes-blue-berries.png';
import waterFountain from '../../assets/tilesets/water-fountain.png';
import woodFenceInteriorCorner4 from '../../assets/tilesets/wood-fence-interior-corner-4.png';
import tallGrassMiddle from '../../assets/tilesets/tall-grass-middle.png';
import bush from '../../assets/tilesets/bush.png';
import Overworld from '../../assets/tilesets/Overworld.png';
import objects from '../../assets/tilesets/objects.png';
import carGreenBack from '../../assets/tilesets/car-green-back.png';
import carBlueBack from '../../assets/tilesets/car-blue-back.png';
import truckRedFront from '../../assets/tilesets/truck-red-front.png';

//Plumas
import feather_icon from '../../assets/sprites/UI/pluma.png';
import FeatherUI from '../GameObjects/featherUI.js';

// Drops de enemigos
import mask_icon from '../../assets/sprites/Weapons/ramita.png';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {

        // ── Mapa ──
        this.load.tilemapTiledJSON('level1', mapaJson);

        //this.load.image('dark-grass-middle-middle', darkGrassMiddleMiddle);
        this.load.image('sidewalk-1', sidewalk1);
        this.load.image('asphalt-road-1', asphaltRoad1);
        this.load.image('asphalt-road-3', asphaltRoad3);
        this.load.image('asphalt-road-2', asphaltRoad2);
        this.load.image('sidewalk-5', sidewalk5);
        this.load.image('dirtpath-1', dirtpath1);
        this.load.image('dirtpath-8', dirtpath8);
        this.load.image('dirtpath-9', dirtpath9);
        this.load.image('dirtpath-10', dirtpath10);
        this.load.image('dirtpath-11', dirtpath11);
        this.load.image('dirtpath-15', dirtpath15);
        this.load.image('dirtpath-12', dirtpath12);
        this.load.image('dirtpath-13', dirtpath13);
        this.load.image('dirtpath-14', dirtpath14);
        this.load.image('dirtpath-2', dirtpath2);
        this.load.image('dirtpath-5', dirtpath5);
        this.load.image('dirtpath-4', dirtpath4);
        this.load.image('dirtpath-6', dirtpath6);
        this.load.image('house-2', house2);
        this.load.image('wood-fence-left-middle', woodFenceLeftMiddle);
        this.load.image('wood-fence-right-middle', woodFenceRightMiddle);
        this.load.image('wood-fence-interior-corner-1', woodFenceInteriorCorner1);
        this.load.image('wood-fence-bottom-middle', woodFenceBottomMiddle);
        this.load.image('wood-fence-interior-corner-2', woodFenceInteriorCorner2);
        this.load.image('wood-fence-interior-corner-3', woodFenceInteriorCorner3);
        this.load.image('wood-fence-top-left-corner', woodFenceTopLeftCorner);
        this.load.image('apartment-building', apartmentBuilding);
        this.load.image('grocery-store', groceryStore);
        this.load.image('tree-1', tree1);
        this.load.image('small-bushes-blue-berries', smallBushesBlueBerries);
        this.load.image('water-fountain', waterFountain);
        this.load.image('wood-fence-interior-corner-4', woodFenceInteriorCorner4);
        this.load.image('tall-grass-middle', tallGrassMiddle);
        this.load.image('bush', bush);

        this.load.image('Overworld', Overworld);
        this.load.image('objects', objects);
        this.load.image('car-green-back', carGreenBack);
        this.load.image('car-blue-back', carBlueBack);
        this.load.image('truck-red-front', truckRedFront);

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
        this.load.audio('death_sound', deathSound);

        // Preload de todas las armas (cambiar)
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);
        Escoba.preload(this);

        // Preload de consumibles
        Bread.preload(this);

        AttackPotion.preload(this);
        SpeedPotion.preload(this);
        SpeedAttackPotion.preload(this);

        DropBread.preload(this);


        // Preload de la barra de arma del jugador
        this.load.image('weapon_bar_border', bar);
        this.load.image('weapon_bar_fill', bar_fill);

        // Preload de UI
        this.load.image('up_bar', up_bar);
        this.load.image('feather_icon', feather_icon);

        // Preload de drops de enemigos
        this.load.image('mask_icon', mask_icon);
    }

    /*
    create() {

        const SCALE = 3;
        
        const map = this.make.tilemap({ 
        key: 'level1',
        tileWidth: 16 * SCALE,  
        tileHeight: 16 * SCALE
        });

        const tilesetNames = [
            'dark-grass-middle-middle', 'sidewalk-1', 'asphalt-road-1', 'asphalt-road-3',
            'asphalt-road-2', 'sidewalk-5', 'dirtpath-1', 'dirtpath-8', 'dirtpath-9',
            'dirtpath-10', 'dirtpath-11', 'dirtpath-15', 'dirtpath-12', 'dirtpath-13',
            'dirtpath-14', 'dirtpath-2', 'dirtpath-5', 'dirtpath-4', 'dirtpath-6',
            'house-2', 'wood-fence-left-middle', 'wood-fence-right-middle',
            'wood-fence-interior-corner-1', 'wood-fence-bottom-middle',
            'wood-fence-interior-corner-2', 'wood-fence-interior-corner-3',
            'wood-fence-top-left-corner', 'apartment-building', 'grocery-store',
            'tree-1', 'small-bushes-blue-berries', 'water-fountain',
            'wood-fence-interior-corner-4', 'tall-grass-middle', 'bush'
        ];

        const tilesets = tilesetNames.map(name => map.addTilesetImage(name, name));

        const baseLayer = map.createLayer('base', tilesets, 0, 0);
        baseLayer.setScale(SCALE);

        const patronesLayer = map.createLayer('Capa de patrones 1', tilesets, 0, 0);
        patronesLayer.setScale(SCALE);

        const colisionLayer = map.createLayer('Zonas con colision', tilesets, 0, 0);
        colisionLayer.setScale(SCALE);

        const esteticaLayer = map.createLayer('Objetos estéticos sin colision', tilesets, 0, 0);
        esteticaLayer.setScale(SCALE);

        colisionLayer.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);

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
        //const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        //bg.setOrigin(0);

        // ── Sonido ──
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // ── Grupo de drops — debe crearse ANTES que el pato y los drops ──
        this.dropItems = this.add.group();
        
        // ── Grupo de consumables ──
        this.consumableItems = this.add.group();

        // ── Grupo de proyectiles ──
        this.projectiles = this.add.group();

        // ── Pato ──
        this.duck = new Duck(this, 1700, 9500, 'mcuaktro');
        
        // ── Barra de consumibles ──
        this.consumableBar = new ConsumableBar(this, this.duck);



        // ── Atacar con click izquierdo (puntual o mantenido) ──
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // ── Soltar click: necesario para armas con carga (arco) ──
        this.input.on('pointerup', () => {
            if (this.duck && this.duck.weapon && this.duck.weapon.releaseAttack) {
                this.duck.weapon.releaseAttack();
            }
        });

        // ── Enemigo ──
        this.enemy = new Mapache(this, 'Mapache', 2000, 9500, 'enemy', null, 'mcuaktro'); //de momento el weapon se lo pongo a null hasta que este implementado
        this.enemy.setFlipX(true);

        // ── Eventos de audio para el enemigo ──
        this.events.on('audio:event', (audioEvent) => {
            if (this.enemy) this.enemy.onAudioEvent(audioEvent);
        });

        // ── Graphics para radio de visión ──
        this.visionGraphics = this.add.graphics();
        this.enemyAlertTime = null;

        // ── Spawn de drops de ejemplo ──
        // Múltiples panes en posiciones estratégicas para testing
        new Bread(this, 50, 50);      // Cerca del spawn del pato
        new Bread(this, 200, 100);    // Arriba a la derecha
        new Bread(this, 400, 200);    // Centro-derecha
        new Bread(this, 100, 300);    // Abajo a la izquierda
        new Bread(this, 350, 400);    // Centro-abajo
        new Bread(this, 600, 150);    // Derecha-arriba
        new Bread(this, 250, 500);    // Abajo-centro
        
        // AttackPotion para testing
        new AttackPotion(this, 1700, 9600); // Cerca del duck
        
        // SpeedPotion para testing
        new SpeedPotion(this, 1750, 9600); // Cerca del duck
        
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



        // ── Barra superior UI (x3) ──
        const upBar = this.add.image(960, 0, 'up_bar');
        upBar.setOrigin(0.5, 0);
        upBar.setScale(3);
        upBar.setScrollFactor(0);

        // ── HUD ──
        this.add.text(10, 10,
            'Mover: WASD / Flechas | Dash: Espacio | Recoger arma: E | Atacar: Click | Cuack: C',
            { fontSize: '14px', fill: '#FFFFFF' }
        );

        this.physics.add.collider(this.duck, colisionLayer); //colisiones del mapa
        this.physics.add.collider(this.enemy, colisionLayer);

        // contacto enemigo → pato
        this.physics.add.overlap(this.duck, this.enemy, (duck, enemy) => {
            this._onEnemyHitDuck(duck, enemy);
        });

        // proyectil → enemigo
        this.physics.add.overlap(this.projectiles, this.enemy, (projectile, enemy) => {
            this._onProjectileHitEnemy(projectile, enemy);
        });

        // proyectil → pato
        this.physics.add.overlap(this.projectiles, this.duck, (projectile, duck) => {
            this._onProjectileHitDuck(projectile, duck);
        });

        //Spawn de pluma para testing
        this.featherUI = new FeatherUI(this, this.duck);
        this.enemiesKilled = 0;

       //TESTING PLUMAS EN EL MAPA
        const testPluma = this.add.image(this.duck.x, this.duck.y - 100, 'feather_icon');
        testPluma.setScale(1);
        testPluma.setDepth(9999);

        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0xff0000, 1);
        graphics.strokeRect(
            testPluma.getBounds().x,
            testPluma.getBounds().y,
            testPluma.getBounds().width,
            testPluma.getBounds().height
        ); 
        
        // Cámara
        // No usar startFollow, lo haremos manualmente en update()
    }*/

    create() {
        const SCALE = 4;

        // ─────────────────────────────────────────
        // CONFIG GENERAL DE LA ESCENA
        // ─────────────────────────────────────────
        this.isPlayerDead = false;
        this.playerSpawn = { x: 1229, y: 7500 };
        this.positionText = null;

        // Limpia listeners anteriores por seguridad al reiniciar la escena
        this.input.removeAllListeners();

        // ─────────────────────────────────────────
        // MAPA
        // ─────────────────────────────────────────
        const map = this.make.tilemap({
            key: 'level1',
            tileWidth: 16,
            tileHeight: 16
        });

        const tilesetNames = [
            'dark-grass-middle-middle', 'sidewalk-1', 'asphalt-road-1', 'asphalt-road-3',
            'asphalt-road-2', 'sidewalk-5', 'dirtpath-1', 'dirtpath-8', 'dirtpath-9',
            'dirtpath-10', 'dirtpath-11', 'dirtpath-15', 'dirtpath-12', 'dirtpath-13',
            'dirtpath-14', 'dirtpath-2', 'dirtpath-5', 'dirtpath-4', 'dirtpath-6',
            'house-2', 'wood-fence-left-middle', 'wood-fence-right-middle',
            'wood-fence-interior-corner-1', 'wood-fence-bottom-middle',
            'wood-fence-interior-corner-2', 'wood-fence-interior-corner-3',
            'wood-fence-top-left-corner', 'apartment-building', 'grocery-store',
            'tree-1', 'small-bushes-blue-berries', 'water-fountain',
            'wood-fence-interior-corner-4', 'tall-grass-middle', 'bush',
            'Overworld', 'objects', 'car-green-back', 'car-blue-back', 'truck-red-front'   
        ];

        const tilesets = tilesetNames.map(name => map.addTilesetImage(name, name));

        this.baseLayer = map.createLayer('base', tilesets, 0, 0);
        this.baseLayer.setScale(SCALE);

        this.patrones1Layer = map.createLayer('Capa de patrones 1', tilesets, 0, 0);
        this.patrones1Layer.setScale(SCALE);

        this.patrones2Layer = map.createLayer('Capa de patrones 2', tilesets, 0, 0);
        this.patrones2Layer.setScale(SCALE);

        this.zonasAcuaticasLayer = map.createLayer('Zonas aquaticas', tilesets, 0, 0);
        this.zonasAcuaticasLayer.setScale(SCALE);

        this.sombreado1Layer = map.createLayer('Sombreado1', tilesets, 0, 0);
        this.sombreado1Layer.setScale(SCALE);

        this.colisionLayer = map.createLayer('Zonas con colision', tilesets, 0, 0);
        this.colisionLayer.setScale(SCALE);

        this.estetica1Layer = map.createLayer('Objetos estéticos sin colision', tilesets, 0, 0);
        this.estetica1Layer.setScale(SCALE);

        this.vallaLayer = map.createLayer('Valla', tilesets, 0, 0);
        this.vallaLayer.setScale(SCALE);

        this.sombreado2Layer = map.createLayer('Sombreado2', tilesets, 0, 0);
        this.sombreado2Layer.setScale(SCALE);
        this.sombreado2Layer.setDepth(200);

        this.estetica2Layer = map.createLayer('Objetos estéticos sin colision 2', tilesets, 0, 0);
        this.estetica2Layer.setScale(SCALE);
        this.estetica2Layer.setDepth(201); //le he añadido esto para que el patete este por debajo

        this.techo1Layer = map.createLayer('Techo1', tilesets, 0, 0);
        this.techo1Layer.setScale(SCALE);
        this.techo1Layer.setDepth(202);

        // Si esta capa es solo para colisión, marcamos colisión en todo tile no vacío.
        // Esto evita depender de propiedades "collides" en cada tile del tileset.
        this.colisionLayer.setCollisionByExclusion([-1], true);

        const worldWidth = map.widthInPixels * SCALE;
        const worldHeight = map.heightInPixels * SCALE;

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        // ─────────────────────────────────────────
        // ANIMACIONES
        // ─────────────────────────────────────────
        if (!this.anims.exists('duck-idle')) {
            this.anims.create({
                key: 'duck-idle',
                frames: this.anims.generateFrameNumbers('idle_duck', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('duck-walk')) {
            this.anims.create({
                key: 'duck-walk',
                frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('duck-cuack')) {
            this.anims.create({
                key: 'duck-cuack',
                frames: this.anims.generateFrameNumbers('duck-cuack', { start: 0, end: 0 }),
                frameRate: 8,
                repeat: 0
            });
        }

        if (!this.anims.exists('duck-dash')) {
            this.anims.create({
                key: 'duck-dash',
                frames: this.anims.generateFrameNumbers('duck-dash', { start: 0, end: 3 }),
                frameRate: 16,
                repeat: 0
            });
        }

        /* if (!this.anims.exists('duck-swimming') && this.textures.exists('duck-swimming')) {
             this.anims.create({
                 key: 'duck-swimming',
                 frames: this.anims.generateFrameNumbers('duck-swimming', { start: 0, end: 3 }),
                 frameRate: 8,
                 repeat: -1
             });
         }*/

        // ─────────────────────────────────────────
        // AUDIO
        // ─────────────────────────────────────────
        this.cuackSound = this.sound.add('cuack', { volume: 1 });
        this.deathSound = this.sound.add('death_sound', { volume: 1 });

        // ─────────────────────────────────────────
        // GRUPOS
        // ─────────────────────────────────────────
        this.dropItems = this.add.group();
        this.consumableItems = this.add.group();
        this.projectiles = this.add.group();

        // ─────────────────────────────────────────
        // PLAYER
        // ─────────────────────────────────────────

        this.duck = new Duck(this, this.playerSpawn.x, this.playerSpawn.y, 'cuchillo');


        // ─────────────────────────────────────────
        // UI
        // ─────────────────────────────────────────
        this.consumableBar = new ConsumableBar(this, this.duck);
        this.featherUI = new FeatherUI(this, this.duck);
        this.enemiesKilled = 0;

        // Dar poción de velocidad al pato para depurar
        this.duck.consumables.push({ type: 'speed_potion', value: 1 });

        const upBar = this.add.image(960, 0, 'up_bar');
        upBar.setOrigin(0.5, 0);
        upBar.setScale(3);
        upBar.setScrollFactor(0);
        upBar.setDepth(9000);

        this.controlsText = this.add.text(
            10,
            10,
            'Mover: WASD / Flechas | Dash: Espacio | Recoger arma: E | Atacar: Click | Cuack: C',
            { fontSize: '14px', fill: '#FFFFFF' }
        );
        this.controlsText.setScrollFactor(0);
        this.controlsText.setDepth(9001);

        // ─────────────────────────────────────────
        // OVERLAY DE MUERTE
        // ─────────────────────────────────────────
        this.deathOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(10000);
        this.deathOverlay.setVisible(false);

        const deathBg = this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.82
        ).setOrigin(0, 0);

        const deathText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'YOU DIED',
            {
                fontFamily: 'Arial Black',
                fontSize: '72px',
                color: '#b30000',
                stroke: '#000000',
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        this.deathOverlay.add([deathBg, deathText]);

        // Si la ventana cambia, reajustamos overlay
        if (this._onResize) {
            this.scale.off('resize', this._onResize, this);
        }
        this._onResize = (gameSize) => {
            deathBg.setSize(gameSize.width, gameSize.height);
            deathText.setPosition(gameSize.width / 2, gameSize.height / 2);
        };
        this.scale.on('resize', this._onResize, this);

        // Limpieza segura al reiniciar/destruir la escena
        this.events.once('shutdown', this._cleanupScene, this);
        this.events.once('destroy', this._cleanupScene, this);

        // ─────────────────────────────────────────
        // INPUTS
        // ─────────────────────────────────────────
        this.input.on('pointerdown', () => {
            if (this.isPlayerDead) return;
            if (this.duck && this.duck.weapon) {
                this.duck.weapon.attack();
            }
        });

        this.input.on('pointerup', () => {
            if (this.duck && this.duck.weapon && this.duck.weapon.releaseAttack) {
                this.duck.weapon.releaseAttack();
            }
        });

        // Tecla E: usada exclusivamente para recoger items de tipo 'interact' (DropMask)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // ─────────────────────────────────────────
        // ENEMIGOS
        // ─────────────────────────────────────────
        this.enemies = [];

        const enemigosPorCapa = {
            'enemies/Mapache': Mapache,
            'enemies/Zorro': Zorro,
        };


        Object.entries(enemigosPorCapa).forEach(([nombreCapa, Clase]) => {
            const capa = map.getObjectLayer(nombreCapa);
            if (!capa) return; // si la capa no existe, salta

            capa.objects.forEach(obj => {
                const props = {};
                if (obj.properties) {
                    obj.properties.forEach(p => props[p.name] = p.value);
                }

                console.log('Creando enemigo:', obj.name, 'en', obj.x, obj.y, 'props:', props);

                const enemy = new Clase(
                    this,
                    obj.name,
                    obj.x * SCALE,
                    obj.y * SCALE,
                    props.texture ?? 'enemy',
                    null,
                    props.weapon ?? 'arco',
                    props.movementType ?? 'stay',
                    props.visionRadius,
                    props.hp,
                    props.speed,
                    props.hasFeather ?? false
                );

                this.add.existing(enemy);
                this.enemies.push(enemy);

            });
        });


        // ─────────────────────────────────────────
        // CONSUMIBLES DESDE TILED
        // ─────────────────────────────────────────
        // Sistema para evitar repeticiones: tipos disponibles y usados
        this.availableConsumableTypes = ['bread', 'speed_potion', 'attack_potion', 'speed_attack_potion'];
        this.usedConsumableTypes = [];

        const consumableLayer = map.getObjectLayer('consumables') || map.getObjectLayer('consummable') || map.getObjectLayer('consumable');
        if (consumableLayer) {
            consumableLayer.objects.forEach(obj => {
                const objectName = (obj.name || '').toLowerCase();
                const objectTypeRaw = (obj.type || '').toLowerCase();
                const objectTypeProp = (obj.properties && obj.properties.find(p => p.name === 'type')?.value || '').toLowerCase();
                const objectType = objectTypeRaw || objectTypeProp;

                // Aceptar nombre/tipo 'consumable' o 'consummable' (se aceptan ambos por si hay typo)
                const isConsumableObject =
                    objectName === 'consumable' || objectName === 'consummable' ||
                    objectType === 'consumable' || objectType === 'consummable';
                if (!isConsumableObject) {
                    return;
                }

                let selectedType = null;

                // Si en Tiled el objeto viene con obj.type: 'speed_potion', use eso.
                if (objectType && this.availableConsumableTypes.includes(objectType)) {
                    selectedType = objectType;
                }

                if (!selectedType) {
                    // Elegir tipo aleatorio sin repetición
                    if (this.availableConsumableTypes.length > 0) {
                        const randomIndex = Phaser.Math.Between(0, this.availableConsumableTypes.length - 1);
                        selectedType = this.availableConsumableTypes.splice(randomIndex, 1)[0];
                        this.usedConsumableTypes.push(selectedType);
                    } else {
                        // Si se agotaron, resetear y permitir repeticiones
                        this.availableConsumableTypes = [...this.usedConsumableTypes];
                        this.usedConsumableTypes = [];
                        const randomIndex = Phaser.Math.Between(0, this.availableConsumableTypes.length - 1);
                        selectedType = this.availableConsumableTypes.splice(randomIndex, 1)[0];
                        this.usedConsumableTypes.push(selectedType);
                    }
                }

                if (!selectedType) {
                    console.warn('Consumable sin tipo válido:', obj);
                    return;
                }

                console.log('Spawn consumable:', selectedType, 'en', obj.x, obj.y, 'layer', consumableLayer.name);
                this.createConsumable(selectedType, obj.x * SCALE, obj.y * SCALE);
            });
        } else {
            console.warn('No se encontró una capa de consumables en Tiled. Nombres válidos: consumables, consummable, consumable.');
        }


        // Eventos de audio para todos los enemigos
        this.events.on('audio:event', (audioEvent) => {
            if (this.isPlayerDead) return;
            this.enemies.forEach(enemy => {
                if (enemy && !enemy.isDead?.()) {
                    enemy.onAudioEvent(audioEvent);
                }
            });
        });

        // ─────────────────────────────────────────
        // COLISIONES
        // ─────────────────────────────────────────
        this.physics.add.collider(this.duck, this.colisionLayer);

        // Colisiones con todos los enemigos
        this.enemies.forEach(enemy => {
            this.physics.add.collider(this.duck, enemy);
            this.physics.add.collider(enemy, this.colisionLayer);
            this.physics.add.overlap(this.projectiles, enemy, (projectile, en) => {
                if (this.isPlayerDead) return;
                this._onProjectileHitEnemy(projectile, en);
            });
            this.physics.add.overlap(this.duck, enemy, (duck, en) => {
                if (this.isPlayerDead) return;
                this._onEnemyHitDuck(duck, en);
            });
        });

        this.physics.add.overlap(this.projectiles, this.duck, (projectile, duck) => {
            if (this.isPlayerDead) return;
            this._onProjectileHitDuck(projectile, duck);
        });

        // proyectil -> capa de colisión del mapa
        this.physics.add.collider(this.projectiles, this.colisionLayer, (projectile) => {
            if (!projectile || !projectile.active) return;
            projectile.destroy();
        });

        // Consumibles y drops
        new Bread(this, 500, 9400);
        new Bread(this, 1800, 9200);
        new DropWeapon(this, 1500, 9600, Mazo, 'mazo');

        //inicialización de la cámara centrada en el jugador antes del update
        //como el movimiento depende del ratón inicializaremos el puntero en la posición del jugador
        this.cameras.main.centerOn(this.playerSpawn.x, this.playerSpawn.y);
        this.input.activePointer.worldX = this.playerSpawn.x;
        this.input.activePointer.worldY = this.playerSpawn.y;
    }

    /*update(time, delta) {
        // ── Actualizar barra de consumibles ──
        if (this.consumableBar) {
            this.consumableBar.update();
        }

        // ── Cámara entre pato y ratón ──
        if (this.duck) {
            const mouseX = this.input.activePointer.worldX;
            const mouseY = this.input.activePointer.worldY;
            
            // 70% hacia el pato, 30% hacia el ratón
            const camX = this.duck.x * 0.7 + mouseX * 0.3;
            const camY = this.duck.y * 0.7 + mouseY * 0.3;
            
            this.cameras.main.centerOn(camX, camY, 1, 1); // suavizado
        }

        // ── Ataque continuo mientras se mantiene el botón izquierdo ──
        // Para armas con carga (arco), attack() solo inicia la carga una vez
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
                    // only clear if not currently flashing red
                    if (this.enemy.tintTopLeft !== 0xFF0000) {
                        this.enemy.clearTint();
                    }
                }
            } else {
                this.enemyAlertTime = null;
                // clear only if not flashing damage
                if (this.enemy.tintTopLeft !== 0xFF0000) {
                    this.enemy.clearTint();
                }
            }

            // Radio de visión debug
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }*/
    update(time, delta) {
        // ─────────────────────────────────────────
        // BLOQUEO TOTAL SI EL JUGADOR ESTÁ MUERTO
        // ─────────────────────────────────────────
        if (this.isPlayerDead) {
            return;
        }


        // ─────────────────────────────────────────
        // ACTUALIZAR BARRA DE CONSUMIBLES
        // ─────────────────────────────────────────
        if (this.consumableBar) {
            this.consumableBar.update();
        }

        // ─────────────────────────────────────────
        // RECOGIDA DE CONSUMIBLES
        // Usa isNear() (igual que el duck con las plumas) para detectar rango.
        // - pickupType 'auto'     → interact() se llama inmediatamente (DropBread)
        // - pickupType 'interact' → interact() solo se llama al pulsar E (DropMask)
        // ─────────────────────────────────────────
        if (this.duck && this.duck.active) {
            const eJustDown = Phaser.Input.Keyboard.JustDown(this.keyE);

            this.consumableItems.getChildren().forEach(item => {
                if (!item || !item.active) return;
                if (!item.isNear(this.duck, 60)) return;

                if (item.pickupType === 'auto') {
                    // auto pickup: recoger inmediatamente al entrar en rango
                    item.interact(this.duck);
                } else if (item.pickupType === 'interact' && eJustDown) {
                    // interact pickup: solo recoger si el jugador pulsa E estando en rango
                    item.interact(this.duck);
                }
            });
        }

        // ─────────────────────────────────────────
        // CÁMARA ENTRE PATO Y RATÓN
        // 70% hacia el pato, 30% hacia el ratón
        // ─────────────────────────────────────────
        if (this.duck && this.duck.active) {
            this.input.activePointer.updateWorldPoint(this.cameras.main);
            const mouseX = this.input.activePointer.worldX;
            const mouseY = this.input.activePointer.worldY;

            const camX = this.duck.x * 0.7 + mouseX * 0.3;
            const camY = this.duck.y * 0.7 + mouseY * 0.3;

            this.cameras.main.centerOn(camX, camY);
        }

        // ─────────────────────────────────────────
        // ATAQUE CONTINUO MIENTRAS SE MANTIENE CLICK
        // Para armas con carga (arco), attack() debe
        // gestionar internamente no reiniciarse mal.
        // ─────────────────────────────────────────
        if (
            this.input.activePointer.isDown &&
            this.duck &&
            this.duck.active &&
            this.duck.weapon
        ) {
            this.duck.weapon.attack();
        }

        // ─────────────────────────────────────────
        // IA / VISIÓN DEL ENEMIGO
        // ─────────────────────────────────────────
        if (this.duck && this.duck.active) {
            this.enemies.forEach(enemy => {
                if (!enemy || !enemy.active || enemy.isDead?.()) return;

                // Detección y feedback visual manejados por la propia clase Enemy
                enemy.updateAwareness(this.duck, time);
            });
        }

    }

    showDeathScreen() {
        if (!this.deathOverlay || this.deathOverlay.visible) return;

        this.deathOverlay.setVisible(true);
        this.deathOverlay.setAlpha(0);

        this.tweens.add({
            targets: this.deathOverlay,
            alpha: 1,
            duration: 400,
            ease: 'Power2'
        });
    }

    handlePlayerDeath() {
        if (this.isPlayerDead) return;

        this.isPlayerDead = true;

        if (this.duck?.body) {
            this.duck.body.setVelocity(0, 0);
            this.duck.body.enable = false;
        }

        if (this.duck?.weapon?.releaseAttack) {
            this.duck.weapon.releaseAttack();
        }

        // Detener todos los enemigos
        /*
        this.enemies.forEach(enemy => {
            if (enemy?.body) {
                enemy.body.setVelocity(0, 0);
                enemy.body.enable = false;
            }
        });
        */

        this.showDeathScreen();
        this.deathSound?.play();

        this.time.delayedCall(2500, () => {
            this.scene.restart();
        });
    }

    _cleanupScene() {
        this.input.removeAllListeners();

        if (this._onResize) {
            this.scale.off('resize', this._onResize, this);
            this._onResize = null;
        }

        if (this.puddleDebug) {
            this.puddleDebug.destroy();
            this.puddleDebug = null;
        }

        if (this.deathOverlay) {
            this.deathOverlay.destroy();
            this.deathOverlay = null;
        }

        if (this.positionText) {
            this.positionText.destroy();
            this.positionText = null;
        }

        if (this.controlsText) {
            this.controlsText.destroy();
            this.controlsText = null;
        }
    }

    /**
     * Maneja la colisión entre un proyectil y un enemigo
     * @param {Projectile} projectile - El proyectil que colisionó
     * @param {Enemy} enemy - El enemigo que fue golpeado
     */
    _onProjectileHitEnemy(projectile, enemy) {
        if (this.isPlayerDead) return;
        if (!projectile || !enemy) return;
        if (!projectile.active || !enemy.active) return;
        if (enemy.isDead && enemy.isDead()) return;

        if (projectile.team && enemy.team && projectile.team === enemy.team) {
            return; // No se golpea equipo propio
        }

        if (projectile.hitEnemies) {
            if (projectile.hitEnemies.has(enemy)) return;
            projectile.hitEnemies.add(enemy);
        }

        const damage = projectile.damage ?? 1;
        enemy.takeDamage(damage);
        projectile.owner?.weapon?.onHitTarget?.(enemy);

        if (!projectile.piercing) {
            projectile.destroy();
        }

        console.log(`¡Proyectil impactó! Daño: ${damage}, HP enemigo: ${enemy.getHP()}`);
    }

    _onEnemyHitDuck(duck, enemy) {
        if (this.isPlayerDead) return;
        if (!duck || !enemy) return;
        if (!duck.active || !enemy.active) return;
        if (enemy.isDead && enemy.isDead()) return;
        if (duck.isInvulnerable) return;

        const contactDamage = enemy.contactDamage ?? 10;
        duck.takeDamage(contactDamage);

        console.log(`¡El pato recibió daño cuerpo a cuerpo! Daño: ${contactDamage}, Vida restante: ${duck.health}, Plumas restantes: ${duck.feathers}`);
    }

    _onProjectileHitDuck(projectile, duck) {
        if (this.isPlayerDead) return;
        if (!projectile || !duck) return;
        if (!projectile.active || !duck.active) return;
        if (projectile.team && duck.team && projectile.team === duck.team) {
            return; // No se golpea equipo propio
        }
        if (duck.isInvulnerable) return;

        const damage = projectile.damage ?? 1;
        duck.takeDamage(damage);
        projectile.owner?.weapon?.onHitTarget?.(duck);

        if (!projectile.piercing) {
            projectile.destroy();
        }

        console.log(`¡El pato recibió daño! Daño: ${damage}, Vida restante: ${duck.health}, Plumas restantes: ${duck.feathers}`);
    }

    /**
     * Crea un consumible basado en el tipo especificado
     * @param {string} type - Tipo del consumible ('bread', 'attack_potion', 'speed_potion', etc.)
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     */
    createConsumable(type, x, y) {
        switch (type) {
            case 'bread':
                new Bread(this, x, y);
                break;
            case 'attack_potion':
                new AttackPotion(this, x, y);
                break;
            case 'speed_potion':
                new SpeedPotion(this, x, y);
                break;
            case 'speed_attack_potion':
                new SpeedAttackPotion(this, x, y);
                break;
            default:
                console.warn(`Tipo de consumible desconocido: ${type}`);
        }
    }

}