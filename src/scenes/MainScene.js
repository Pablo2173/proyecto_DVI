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
import DropWeapon from '../GameObjects/Consumables/Drops/dropWeapon.js';
import Bread from '../GameObjects/Consumables/bread.js';

import AttackPotion from '../GameObjects/Consumables/attackPotion.js';

import SpeedPotion from '../GameObjects/Consumables/SpeedPotion.js';
import SpeedAttackPotion from '../GameObjects/Consumables/SpeedAttackPotion.js';
import Key from '../GameObjects/Consumables/key.js';

import DropBread from '../GameObjects/Consumables/Drops/dropBread.js';
import DropFeather from '../GameObjects/Consumables/Drops/dropFeather.js';


import Enemy from '../GameObjects/enemy.js';
import Store from '../GameObjects/store.js';
import Frog from '../GameObjects/Enemies/frog.js';
import { DUCK_STATE } from '../GameObjects/duck.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import sprint_sprite from '../../assets/sprites/duck/sprint_duck.png';
import dash_duck_sprite from '../../assets/Sprites/duck/dash_duck.png';
import cuack_sprite from '../../assets/sprites/duck/Cuack_duck.png';
import duck_swimming_sprite from '../../assets/sprites/duck/swimming_duck.png';
import enemy_sprite from '../../assets/sprites/player.png';

// Sprites de enemigos específicos
import zorro_idle from '../../assets/sprites/Zorro/zorro_idle.png';
import zorro_run from '../../assets/sprites/Zorro/zorro_run.png';
import zorro_hit from '../../assets/sprites/Zorro/zorro_hit.png';
import zorro_ded from '../../assets/sprites/Zorro/zorro_ded.png';

import mapache_idle from '../../assets/sprites/Mapache/mapache_idle.png';
import mapache_run from '../../assets/sprites/Mapache/mapache_run.png';
import mapache_hit from '../../assets/sprites/Mapache/mapache_hit.png';
import mapache_ded from '../../assets/sprites/Mapache/mapache_ded.png';

import cuervo_idle from '../../assets/Sprites/Cuervo/cuervo_idle.png';
import cuervo_run from '../../assets/Sprites/Cuervo/cuervo_run.png';
import cuervo_hit from '../../assets/Sprites/Cuervo/cuervo_hit.png';
import cuervo_ded from '../../assets/Sprites/Cuervo/cuervo_ded.png';

import rana_idle from '../../assets/sprites/Rana/rana_idle.png';

//Sounds
import cuackSound from '../../assets/sounds/cuack.mp3';
import deathSound from '../../assets/sounds/YouDied.mp3';
// Weapon bar
import bar from '../../assets/sprites/Weapons/weaponBar/weapon_bar_border.png';
import bar_fill from '../../assets/sprites/Weapons/weaponBar/weapon_bar_fill.png';
import up_bar from '../../assets/sprites/UI/up_bar.png';
import dash_charge_sprite from '../../assets/Sprites/UI/dash_charge.png';
import Puddle from '../GameObjects/puddle.js';
import PuddleUpgradePanel from '../GameObjects/Puddles/PuddleUpgradePanel.js';
import ConsumableBar from '../GameObjects/Consumables/ConsumableBar.js';

// Enemigos
import Zorro from '../GameObjects/Enemies/zorro.js';
import Mapache from '../GameObjects/Enemies/mapache.js';
import Cuervo from '../GameObjects/Enemies/cuervo.js';

// Drops de enemigos
import mask_icon from '../../assets/sprites/consumables/Mask.png';
import fox_tail from '../../assets/sprites/consumables/fox_tail.png';

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

        this.load.spritesheet('duck-swimming', duck_swimming_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-dash', dash_duck_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.image('enemy', enemy_sprite);

        // Cargar spritesheets de zorro (4 frames cada uno, 32x32)
        this.load.spritesheet('zorro_idle', zorro_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('zorro_run', zorro_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('zorro_hit', zorro_hit);
        this.load.image('zorro_ded', zorro_ded);
        // Alias para el sprite muerto (usado en Enemy.die())
        this.load.image('zorro_idle_corpse', zorro_ded);

        // Cargar spritesheets de mapache (4 frames cada uno, 32x32)
        this.load.spritesheet('mapache_idle', mapache_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('mapache_run', mapache_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('mapache_hit', mapache_hit);
        this.load.image('mapache_ded', mapache_ded);
        // Alias para el sprite muerto (usado en Enemy.die())
        this.load.image('mapache_idle_corpse', mapache_ded);

        this.load.spritesheet('cuervo_idle', cuervo_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('cuervo_run', cuervo_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('cuervo_hit', cuervo_hit);
        this.load.image('cuervo_ded', cuervo_ded);
        this.load.image('cuervo_idle_corpse', cuervo_ded);

        this.load.spritesheet('rana_idle', rana_idle, {
            frameWidth: 32,
            frameHeight: 32
        });

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



        Bread.preload(this);

        AttackPotion.preload(this);
        SpeedPotion.preload(this);
        SpeedAttackPotion.preload(this);
        Key.preload(this);

        DropBread.preload(this);


        // Preload de la barra de arma del jugador
        this.load.image('weapon_bar_border', bar);
        this.load.image('weapon_bar_fill', bar_fill);

        // Preload de UI
        this.load.image('up_bar', up_bar);
        this.load.image('dash_charge', dash_charge_sprite);
        this.load.image('feather_icon', feather_icon);

        // Preload de drops de enemigos
        this.load.image('mask_icon', mask_icon);
        this.load.image('fox_tail', fox_tail);
    }

    create() {
        const SCALE = 4;
        //PARAR música del menú
        const menuMusic = this.sound.get("menu_music");

        if (menuMusic) {
            menuMusic.stop();
        }
        // ─────────────────────────────────────────
        // CONFIG GENERAL DE LA ESCENA
        // ─────────────────────────────────────────
        this.isPlayerDead = false;
        this.playerSpawn = null;
        this.playerWeapon = 'cuchillo';
        this.positionText = null;
        this.puddles = [];
        this.currentPuddle = null;
        this.previousCheckpointBeforePuddle = null;
        this.puddleUpgradePanel = null;

        // Limpia listeners anteriores por seguridad al reiniciar la escena
        this.input.removeAllListeners();

        // ─────────────────────────────────────────
        // MAPA
        // ─────────────────────────────────────────
        this.map = this.make.tilemap({
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

        const tilesets = tilesetNames.map(name => this.map.addTilesetImage(name, name));

        this.baseLayer = this.map.createLayer('base', tilesets, 0, 0);
        this.baseLayer.setScale(SCALE);

        this.patrones1Layer = this.map.createLayer('Capa de patrones 1', tilesets, 0, 0);
        this.patrones1Layer.setScale(SCALE);

        this.patrones2Layer = this.map.createLayer('Capa de patrones 2', tilesets, 0, 0);
        this.patrones2Layer.setScale(SCALE);

        this.carreteraLayer = this.map.createLayer('carretera', tilesets, 0, 0);
        this.carreteraLayer.setScale(SCALE);

        this.desnivelLayer = this.map.createLayer('Desnivel', tilesets, 0, 0);
        this.desnivelLayer.setScale(SCALE);

        this.zonasAcuaticasLayer = this.map.createLayer('Zonas aquaticas', tilesets, 0, 0);
        this.zonasAcuaticasLayer.setScale(SCALE);

        this.sombreado1Layer = this.map.createLayer('Sombreado1', tilesets, 0, 0);
        this.sombreado1Layer.setScale(SCALE);

        this.colisionLayer = this.map.createLayer('Zonas con colision', tilesets, 0, 0);
        this.colisionLayer.setScale(SCALE);

        this.estetica1Layer = this.map.createLayer('Objetos estéticos sin colision', tilesets, 0, 0);
        this.estetica1Layer.setScale(SCALE);

        this.puertaAbiertaLayer = this.map.createLayer('puerta', tilesets, 0, 0);
        this.puertaAbiertaLayer.setScale(SCALE);

        this.puertaCerradaLayer = this.map.createLayer('puertaCerrada', tilesets, 0, 0);
        this.puertaCerradaLayer.setScale(SCALE);

        this.vallaLayer = this.map.createLayer('Valla', tilesets, 0, 0);
        this.vallaLayer.setScale(SCALE);

        this.sombreado2Layer = this.map.createLayer('Sombreado2', tilesets, 0, 0);
        this.sombreado2Layer.setScale(SCALE);
        this.sombreado2Layer.setDepth(200);

        this.estetica2Layer = this.map.createLayer('Objetos estéticos sin colision 2', tilesets, 0, 0);
        this.estetica2Layer.setScale(SCALE);
        this.estetica2Layer.setDepth(201); //le he añadido esto para que el patete este por debajo

        this.techo1Layer = this.map.createLayer('Techo1', tilesets, 0, 0);
        this.techo1Layer.setScale(SCALE);
        this.techo1Layer.setDepth(202);

        const duckLayer = this.map.getObjectLayer('duck');
        if (!duckLayer || duckLayer.objects.length === 0) {
            throw new Error('Falta la capa de objetos duck o esta vacia. Debes definir el jugador desde el mapa.');
        }

        const duckObj = duckLayer.objects.find(obj => (obj.name || '').trim().toLowerCase() === 'duck');
        if (!duckObj) {
            throw new Error('Falta un objeto llamado duck dentro de la capa duck.');
        }

        this.playerSpawn = {
            x: duckObj.x * SCALE,
            y: duckObj.y * SCALE
        };

        this._applyStoredCheckpointSpawn();

        if (duckObj.properties) {
            const duckProps = {};
            duckObj.properties.forEach(p => duckProps[p.name] = p.value);
            if (Object.prototype.hasOwnProperty.call(duckProps, 'weapon')) {
                const weaponFromMap = duckProps.weapon;

                if (weaponFromMap === null) {
                    this.playerWeapon = 'ramita';
                } else if (typeof weaponFromMap === 'string') {
                    const normalizedWeapon = weaponFromMap.trim().toLowerCase();
                    this.playerWeapon = normalizedWeapon === '' || normalizedWeapon === 'null'
                        ? 'ramita'
                        : normalizedWeapon;
                } else {
                    this.playerWeapon = weaponFromMap;
                }
            }
        }

        this._applyStoredRespawnWeapon();

        // Si esta capa es solo para colisión, marcamos colisión en todo tile no vacío.
        // Esto evita depender de propiedades "collides" en cada tile del tileset.
        this.colisionLayer.setCollisionByExclusion([-1], true);
        this.puertaCerradaLayer.setCollisionByExclusion([-1], true);
        this.vallaLayer.setCollisionByExclusion([-1], true);
        this.desnivelLayer.setCollisionByExclusion([-1], true);
        this.zonasAcuaticasLayer.setCollisionByExclusion([-1], true);

        const worldWidth = this.map.widthInPixels * SCALE;
        const worldHeight = this.map.heightInPixels * SCALE;

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        // Esto es para arreglar que el dash atraviesa paredes al ir muy rapido
        this.physics.world.setFPS(120);
        this.physics.world.TILE_BIAS = Math.max(this.physics.world.TILE_BIAS, 48);

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

        if (!this.anims.exists('duck-swimming')) {
            this.anims.create({
                key: 'duck-swimming',
                frames: this.anims.generateFrameNumbers('duck-swimming', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('zorro-idle') && this.textures.exists('zorro_idle')) {
            this.anims.create({
                key: 'zorro-idle',
                frames: this.anims.generateFrameNumbers('zorro_idle', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('zorro-run') && this.textures.exists('zorro_run')) {
            this.anims.create({
                key: 'zorro-run',
                frames: this.anims.generateFrameNumbers('zorro_run', { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.anims.exists('mapache-idle') && this.textures.exists('mapache_idle')) {
            this.anims.create({
                key: 'mapache-idle',
                frames: this.anims.generateFrameNumbers('mapache_idle', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('mapache-run') && this.textures.exists('mapache_run')) {
            this.anims.create({
                key: 'mapache-run',
                frames: this.anims.generateFrameNumbers('mapache_run', { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.anims.exists('cuervo-idle') && this.textures.exists('cuervo_idle')) {
            this.anims.create({
                key: 'cuervo-idle',
                frames: this.anims.generateFrameNumbers('cuervo_idle', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('cuervo-run') && this.textures.exists('cuervo_run')) {
            this.anims.create({
                key: 'cuervo-run',
                frames: this.anims.generateFrameNumbers('cuervo_run', { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.anims.exists('rana-idle') && this.textures.exists('rana_idle')) {
            this.anims.create({
                key: 'rana-idle',
                frames: this.anims.generateFrameNumbers('rana_idle', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
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

        this.duck = new Duck(this, this.playerSpawn.x, this.playerSpawn.y, this.playerWeapon);
        this.crowSpawner = {
            holdDurationMs: 5000,
            holdStartTime: null,
            lastWeaponKey: this._getCurrentDuckWeaponKey(),
            spawnedForCurrentWeapon: false
        };

        // ─────────────────────────────────────────
        // UI
        // ─────────────────────────────────────────
        this.breadCount = 0;
        this.consumableBar = new ConsumableBar(this, this.duck);
        this.enemiesKilled = 0;

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
        this.input.on('pointerdown', (pointer) => {
            if (this.isPlayerDead) return;
            if (pointer?.button !== 0) return;
            console.log('[INPUT] pointerdown — weapon:', this.duck?.weapon?.constructor?.name, '| active:', this.duck?.weapon?.active);
            if (this.duck && this.duck.weapon && this.duck.weapon.attack) {
                this.duck.weapon.attack();
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (pointer?.button !== 0) return;
            console.log('[INPUT] pointerup — arma actual:', this.duck?.weapon?.constructor?.name);
            if (this.duck && this.duck.weapon && this.duck.weapon.releaseAttack) {
                this.duck.weapon.releaseAttack();
            }
        });

        // Tecla E: usada exclusivamente para recoger items de tipo 'interact' (DropMask)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // ─────────────────────────────────────────
        // ENEMIGOS DESDE RUTAS
        // ─────────────────────────────────────────
        this.enemies = this.physics.add.group();
        this.setupEnemiesFromRoutes(SCALE);


        // ─────────────────────────────────────────
        // CONSUMIBLES DESDE TILED
        // ─────────────────────────────────────────
        this.setupConsumablesFromLayer(SCALE);

        // ─────────────────────────────────────────
        // TIENDA DESDE TILED
        // Las posiciones de los 5 slots provienen de la capa 'Store' del mapa.
        // ─────────────────────────────────────────
        this.setupStoreFromLayer(SCALE);

        // ─────────────────────────────────────────
        // RANA DESDE TILED
        // La posición de la rana proviene de la capa 'Rana' del mapa.
        // ─────────────────────────────────────────
        this.setupFrogFromLayer(SCALE);


        // ─────────────────────────────────────────
        // CHARCOS DESDE TILED
        // La capa 'charquito' define polígonos que actúan como zonas de SWIMMING.
        // ─────────────────────────────────────────
        this.setupPuddlesFromLayer(SCALE);

        this.puddleUpgradePanel = new PuddleUpgradePanel(this, (puddle, upgradeId) => {
            this._onPuddleUpgradePurchase(puddle, upgradeId);
        }, (puddle) => {
            this._onPuddleClaimReward(puddle);
        });


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
        this.physics.add.collider(this.duck, this.puertaCerradaLayer);
        this.physics.add.collider(
            this.duck,
            this.desnivelLayer,
            null,
            (duck) => duck?.body?.velocity?.y < 0,
            this
        );

        this.physics.add.collider(
            this.duck,
            this.vallaLayer,
            null,
            (duck) => duck?.state !== DUCK_STATE.DASHING, // si estas haciendo dash no tienes colision con las vallas
            this
        );

        // Colisiones con todos los enemigos
        this.enemies.getChildren().forEach(enemy => {
            this._wireEnemyCollisions(enemy);
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

        this.physics.add.collider(this.projectiles, this.puertaCerradaLayer, (projectile) => {
            if (!projectile || !projectile.active) return;
            projectile.destroy();
        });

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
        // ESTADO SWIMMING SEGÚN CAPA ACUÁTICA
        // ─────────────────────────────────────────
        this._updateDuckSwimmingState();

        // ─────────────────────────────────────────
        // CHARQUITOS DESDE TILED
        // Se mantiene separado de la lógica de agua para futuras extensiones.
        // ─────────────────────────────────────────
        this._updateCharquitoState();

        // ─────────────────────────────────────────
        // RECOGIDA DE CONSUMIBLES
        // Usa isNear() (igual que el duck con las plumas) para detectar rango.
        // - pickupType 'auto'     → interact() se llama inmediatamente (DropBread)
        // - pickupType 'interact' → interact() solo se llama al pulsar E (DropMask)
        // La recogida del mundo tiene prioridad sobre el consumo de inventario con E.
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

            // Pasar eJustDown a la tienda para que gestione la compra con E
            if (this.store) {
                this.store.update(eJustDown);
            }
        }

        // ─────────────────────────────────────────
        // ACTUALIZAR BARRA DE CONSUMIBLES
        // Se actualiza después de la recogida del mundo para que la tecla E
        // dé prioridad a recoger DropMask del suelo antes de consumir del inventario.
        // ─────────────────────────────────────────
        if (this.consumableBar) {
            this.consumableBar.update();
        }

        // ─────────────────────────────────────────
        // CÁMARA ENTRE PATO Y RATÓN
        // Si el cursor está en la deadzone central (50%),
        // cámara fija al pato. Fuera: 70% pato, 30% ratón.
        // El centro se interpola para evitar saltos bruscos.
        // Si el pato está en un charco activo: cámara bloqueada
        // y desplazada un 30% a la derecha.
        // ─────────────────────────────────────────
        if (this.duck && this.duck.active) {
            const pointer = this.input.activePointer;
            const camera = this.cameras.main;
            const screenW = this.scale.width;
            const screenH = this.scale.height;

            // Zona muerta circular centrada en la pantalla.
            // Mantiene un área similar a la antigua caja del 50% central,
            // pero con transición radial alrededor del pato.
            const deadzoneCenterX = screenW * 0.5;
            const deadzoneCenterY = screenH * 0.5;
            const deadzoneRadius = Math.min(screenW, screenH) * 0.25;
            const pointerDistanceFromCenter = Phaser.Math.Distance.Between(
                pointer.x,
                pointer.y,
                deadzoneCenterX,
                deadzoneCenterY
            );

            const isPointerInsideDeadzone = pointerDistanceFromCenter <= deadzoneRadius;

            const isPuddleCameraLocked = !!(
                this.currentPuddle &&
                !this.currentPuddle.isRemoved &&
                this.currentPuddle.getPrimaryUpgrade?.()
            );

            let targetCamX = this.duck.x;
            let targetCamY = this.duck.y;

            if (isPuddleCameraLocked) {
                targetCamX = this.duck.x + camera.width * 0.3;
            } else if (!isPointerInsideDeadzone) {
                pointer.updateWorldPoint(this.cameras.main);
                const mouseX = pointer.worldX;
                const mouseY = pointer.worldY;

                targetCamX = this.duck.x * 0.7 + mouseX * 0.3;
                targetCamY = this.duck.y * 0.7 + mouseY * 0.3;
            }

            const currentCenterX = camera.scrollX + camera.width * 0.5;
            const currentCenterY = camera.scrollY + camera.height * 0.5;
            const cameraLerp = 0.15;

            const smoothCamX = Phaser.Math.Linear(currentCenterX, targetCamX, cameraLerp);
            const smoothCamY = Phaser.Math.Linear(currentCenterY, targetCamY, cameraLerp);

            camera.centerOn(smoothCamX, smoothCamY);
        }

        // ─────────────────────────────────────────
        // ATAQUE CONTINUO MIENTRAS SE MANTIENE CLICK
        // Para armas con carga (arco), attack() debe
        // gestionar internamente no reiniciarse mal.
        // ─────────────────────────────────────────
        if (
            this.input.activePointer.leftButtonDown() &&
            this.duck &&
            this.duck.active &&
            this.duck.weapon
        ) {
            this.duck.weapon.attack();
        }

        this._updateCrowSpawnTimer(time);

        // ─────────────────────────────────────────
        // IA / VISIÓN DEL ENEMIGO
        // ─────────────────────────────────────────
        if (this.duck && this.duck.active) {
            this.enemies.getChildren().forEach(enemy => {
                if (!enemy || !enemy.active || enemy.isDead?.()) return;

                // Detección y feedback visual manejados por la propia clase Enemy
                enemy.updateAwareness(this.duck, time);
            });
        }

    }

    _updateDuckSwimmingState() {
        if (!this.duck || !this.duck.active || !this.zonasAcuaticasLayer) return;

        const tileSize = 16 * 4;
        const tileX = Math.floor(this.duck.x / tileSize);
        const tileY = Math.floor(this.duck.y / tileSize);

        const waterTile = this.zonasAcuaticasLayer.getTileAt(tileX, tileY);
        const isInWater = !!waterTile;

        if (isInWater) {
            if (this.duck.state !== DUCK_STATE.SWIMMING && this.duck.state !== DUCK_STATE.DASHING) {
                this.duck.setState(DUCK_STATE.SWIMMING);
            }
            return;
        }

        if (this.duck.state === DUCK_STATE.SWIMMING) {
            this.duck.setState(DUCK_STATE.IDLE);
        }
    }

    _updateCharquitoState() {
        if (!this.duck || !this.duck.active || !Array.isArray(this.puddles) || this.puddles.length === 0) return;

        const puddle = this.puddles.find(charco => charco?.containsDuck?.(this.duck)) || null;

        if (!puddle) {
            this.currentPuddle = null;
            this.puddleUpgradePanel?.hide();
            return;
        }

        if (this.currentPuddle !== puddle) {
            if (!puddle.getCheckpointBackup?.()) {
                puddle.setCheckpointBackup?.(this._getCurrentCheckpointData());
            }

            this.previousCheckpointBeforePuddle = puddle.getCheckpointBackup?.() || null;
            this.currentPuddle = puddle;
            this._setCheckpointFromPuddle(puddle);
            this.puddleUpgradePanel?.show(puddle, this.duck);
        } else {
            this.puddleUpgradePanel?.update(this.duck);
        }

        if (this.duck.state !== DUCK_STATE.SWIMMING && this.duck.state !== DUCK_STATE.DASHING) {
            this.duck.setState(DUCK_STATE.SWIMMING);
        }
    }

    _onPuddleUpgradePurchase(puddle, upgradeId) {
        if (!puddle || !this.duck) return;

        const purchase = puddle.purchaseUpgrade?.(upgradeId, this.duck);
        const success = !!purchase?.success;
        let purchaseMessage = purchase?.message || '';
        if (success) {
            const spentFeathers = Number(purchase?.spentFeathers) || 0;
            const remainingFeathers = Number(purchase?.remainingFeathers);
            if (Number.isFinite(remainingFeathers)) {
                purchaseMessage = `${purchaseMessage} (-${spentFeathers} feather, left: ${remainingFeathers})`;
            }
        }

        this.puddleUpgradePanel?.showPurchaseResult(success, purchaseMessage);
        if (!success) return;
    }

    _onPuddleClaimReward(puddle) {
        if (!puddle || !this.duck) return;

        const rewardFeathers = 2;
        this.duck.addFeather?.(rewardFeathers);

        const checkpointToRestore = puddle.getCheckpointBackup?.() || this.previousCheckpointBeforePuddle;
        this._restoreCheckpoint(checkpointToRestore);

        this._removePuddle(puddle);

        this.previousCheckpointBeforePuddle = null;
        if (this.currentPuddle === puddle) {
            this.currentPuddle = null;
        }

        this.puddleUpgradePanel?.hide();
        this.puddleUpgradePanel?.showPurchaseResult(true, `Reward claimed! (+${rewardFeathers} feathers)`);
    }

    _removePuddle(puddle) {
        if (!puddle || !Array.isArray(this.puddles)) return;

        this.puddles = this.puddles.filter(item => item !== puddle);
        puddle.destroy?.();
    }

    _getCurrentCheckpointData() {
        const checkpoint = this.registry?.get('duckCheckpointSpawn');
        const checkpointX = Number(checkpoint?.x);
        const checkpointY = Number(checkpoint?.y);

        if (Number.isFinite(checkpointX) && Number.isFinite(checkpointY)) {
            return {
                x: checkpointX,
                y: checkpointY,
                puddleName: checkpoint?.puddleName || ''
            };
        }

        const spawnX = Number(this.playerSpawn?.x);
        const spawnY = Number(this.playerSpawn?.y);
        if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return null;

        return {
            x: spawnX,
            y: spawnY,
            puddleName: ''
        };
    }

    _restoreCheckpoint(checkpointData) {
        if (!checkpointData) return;

        const checkpointX = Number(checkpointData.x);
        const checkpointY = Number(checkpointData.y);
        if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

        this.playerSpawn = {
            x: checkpointX,
            y: checkpointY
        };

        this.registry?.set('duckCheckpointSpawn', {
            x: checkpointX,
            y: checkpointY,
            puddleName: checkpointData.puddleName || ''
        });

        if (this.duck?.setCheckpoint) {
            this.duck.setCheckpoint({
                x: checkpointX,
                y: checkpointY,
                puddleName: checkpointData.puddleName || ''
            });
        }
    }

    _applyStoredCheckpointSpawn() {
        const checkpoint = this.registry?.get('duckCheckpointSpawn');
        if (!checkpoint) return;

        const checkpointX = Number(checkpoint.x);
        const checkpointY = Number(checkpoint.y);
        if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

        this.playerSpawn = {
            x: checkpointX,
            y: checkpointY
        };
    }

    _applyStoredRespawnWeapon() {
        const storedWeapon = this.registry?.get('duckRespawnWeapon');
        if (typeof storedWeapon !== 'string') return;

        const normalizedWeapon = storedWeapon.trim().toLowerCase();
        if (!normalizedWeapon) return;

        const allowedWeapons = new Set(['arco', 'mcuaktro', 'cuchillo', 'mazo', 'ramita', 'escoba']);
        if (!allowedWeapons.has(normalizedWeapon)) return;

        this.playerWeapon = normalizedWeapon;
    }

    _setCheckpointFromPuddle(puddle) {
        const spawnPoint = puddle?.getSpawnPoint?.();
        if (!spawnPoint) return;

        const spawnX = Number(spawnPoint.x);
        const spawnY = Number(spawnPoint.y);
        if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return;

        this.playerSpawn = {
            x: spawnX,
            y: spawnY
        };

        this.registry?.set('duckCheckpointSpawn', {
            x: spawnX,
            y: spawnY,
            puddleName: puddle?.name || ''
        });

        if (this.duck?.setCheckpoint) {
            this.duck.setCheckpoint({
                x: spawnX,
                y: spawnY,
                puddleName: puddle?.name || ''
            });
        }
    }

    _getCurrentDuckWeaponKey() {
        return this.duck?.weapon?.texture?.key ?? null;
    }

    _resolveRespawnWeaponKey() {
        const weapon = this.duck?.weapon;
        if (!weapon) return 'ramita';

        const byConstructorName = {
            arco: 'arco',
            mcuaktro: 'mcuaktro',
            cuchillo: 'cuchillo',
            mazo: 'mazo',
            ramita: 'ramita',
            escoba: 'escoba'
        };

        const constructorName = String(weapon.constructor?.name || '').trim().toLowerCase();
        if (byConstructorName[constructorName]) {
            return byConstructorName[constructorName];
        }

        const textureKey = String(weapon.texture?.key || '').trim().toLowerCase();
        if (textureKey.includes('arco')) return 'arco';
        if (textureKey.includes('mcuaktro')) return 'mcuaktro';
        if (textureKey.includes('cuchillo')) return 'cuchillo';
        if (textureKey.includes('mazo')) return 'mazo';
        if (textureKey.includes('escoba')) return 'escoba';
        if (textureKey.includes('ramita')) return 'ramita';

        return 'ramita';
    }

    _isHoldingNonBranchWeapon() {
        const weaponKey = this._getCurrentDuckWeaponKey();
        return !!weaponKey && weaponKey !== 'ramita';
    }

    _updateCrowSpawnTimer(time) {
        if (!this.crowSpawner || !this.duck || !this.duck.active) return;

        const currentWeaponKey = this._getCurrentDuckWeaponKey();
        if (currentWeaponKey !== this.crowSpawner.lastWeaponKey) {
            this.crowSpawner.lastWeaponKey = currentWeaponKey;
            this.crowSpawner.spawnedForCurrentWeapon = false;
            this.crowSpawner.holdStartTime = this._isHoldingNonBranchWeapon() ? time : null;
            return;
        }

        if (!this._isHoldingNonBranchWeapon()) {
            this.crowSpawner.holdStartTime = null;
            this.crowSpawner.spawnedForCurrentWeapon = false;
            return;
        }

        if (this.crowSpawner.spawnedForCurrentWeapon) {
            return;
        }

        if (this.crowSpawner.holdStartTime === null) {
            this.crowSpawner.holdStartTime = time;
            return;
        }

        const holdElapsed = time - this.crowSpawner.holdStartTime;
        if (holdElapsed >= this.crowSpawner.holdDurationMs) {
            this._spawnCrowOutsidePlayerVision(time);
            this.crowSpawner.spawnedForCurrentWeapon = true;
        }
    }

    _spawnCrowOutsidePlayerVision(time) {
        const spawnPoint = this._getRandomPointOutsideCameraView();
        if (!spawnPoint) return;

        const enemyName = `Cuervo_${Math.floor(time)}`;
        const enemy = new Cuervo(this, enemyName, spawnPoint.x, spawnPoint.y, 'cuervo_idle', null, null, null);
        this.enemies.add(enemy);
        this._wireEnemyCollisions(enemy);
    }

    _getRandomPointOutsideCameraView() {
        const cameraView = this.cameras?.main?.worldView;
        if (!cameraView) return null;

        const worldBounds = this.physics?.world?.bounds;
        if (!worldBounds) return null;

        const margin = 120;

        for (let i = 0; i < 8; i++) {
            const edge = Phaser.Math.Between(0, 3);
            let x = this.duck?.x ?? cameraView.centerX;
            let y = this.duck?.y ?? cameraView.centerY;

            if (edge === 0) {
                x = cameraView.left - margin;
                y = Phaser.Math.Between(Math.floor(cameraView.top), Math.floor(cameraView.bottom));
            } else if (edge === 1) {
                x = cameraView.right + margin;
                y = Phaser.Math.Between(Math.floor(cameraView.top), Math.floor(cameraView.bottom));
            } else if (edge === 2) {
                x = Phaser.Math.Between(Math.floor(cameraView.left), Math.floor(cameraView.right));
                y = cameraView.top - margin;
            } else {
                x = Phaser.Math.Between(Math.floor(cameraView.left), Math.floor(cameraView.right));
                y = cameraView.bottom + margin;
            }

            x = Phaser.Math.Clamp(x, worldBounds.left + 32, worldBounds.right - 32);
            y = Phaser.Math.Clamp(y, worldBounds.top + 32, worldBounds.bottom - 32);

            if (!cameraView.contains(x, y)) {
                return { x, y };
            }
        }

        return null;
    }

    _wireEnemyCollisions(enemy) {
        if (!enemy) return;

        this.physics.add.collider(
            this.duck,
            enemy,
            null,
            (duck) => duck?.state !== DUCK_STATE.DASHING,
            this
        );

        if (!enemy.ignoresObstacleHitbox) {
            this.physics.add.collider(enemy, this.colisionLayer);
            this.physics.add.collider(enemy, this.puertaCerradaLayer);
            this.physics.add.collider(enemy, this.vallaLayer);
            this.physics.add.collider(enemy, this.zonasAcuaticasLayer);
        }

        this.physics.add.overlap(this.projectiles, enemy, (projectile, en) => {
            if (this.isPlayerDead) return;
            this._onProjectileHitEnemy(projectile, en);
        });

        this.physics.add.overlap(this.duck, enemy, (duck, en) => {
            if (this.isPlayerDead) return;
            this._onEnemyHitDuck(duck, en);
        });
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

        const respawnWeaponKey = this._resolveRespawnWeaponKey();
        this.registry?.set('duckRespawnWeapon', respawnWeaponKey);

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

        if (Array.isArray(this.puddles)) {
            this.puddles.forEach(puddle => puddle?.destroy?.());
            this.puddles = [];
        }
        this.currentPuddle = null;
        this.previousCheckpointBeforePuddle = null;

        if (this.puddleUpgradePanel) {
            this.puddleUpgradePanel.destroy();
            this.puddleUpgradePanel = null;
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

        if (this.consumableBar) {
            this.consumableBar.destroy();
            this.consumableBar = null;
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
        if (duck.state === DUCK_STATE.DASHING) return;
        if (duck.isInvulnerable) return;

        return;
    }

    _onProjectileHitDuck(projectile, duck) {
        if (this.isPlayerDead) return;
        if (!projectile || !duck) return;
        if (!projectile.active || !duck.active) return;
        if (duck.state === DUCK_STATE.DASHING) return;
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
     * Crea enemigos basándose en los polígonos de la capa "routes" en Tiled
     * 
     * Cada polígono DEBE tener las siguientes propiedades personalizadas en Tiled:
     * - enemyType (string): "mapache" o "zorro"
     * - weaponType (string): "cuchillo", "arco", "mazo", "ramita", "escoba", "mcuaktro"
     * 
     * @param {number} scale - Escala del mapa
     */
    setupEnemiesFromRoutes(scale) {
        const routesLayer = this.map.getObjectLayer('routes');

        if (!routesLayer || !routesLayer.objects) {
            console.warn(' No se encontró la capa "routes" en el mapa');
            return;
        }

        console.log(` Capa routes encontrada con ${routesLayer.objects.length} objeto(s)`);

        let enemyCount = 0;

        routesLayer.objects.forEach((obj, index) => {
            console.log(`\n Procesando objeto ${index}:`, obj);

            // Extraer propiedades - soporta varios formatos de Tiled
            let enemyType = 'mapache';
            let weaponType = 'cuchillo';
            let ellipseSegments = 16;

            console.log(` Propiedades del objeto:`, obj.properties);

            // Formato 1: propiedades como array de objetos {name, value}
            if (obj.properties && Array.isArray(obj.properties)) {
                console.log(`  Format: Array de propiedades`);
                obj.properties.forEach(prop => {
                    console.log(`    - ${prop.name}: ${prop.value}`);
                    if (prop.name === 'enemyType' && prop.value) enemyType = String(prop.value).toLowerCase();
                    if (prop.name === 'weaponType' && prop.value) weaponType = String(prop.value).toLowerCase();
                    if ((prop.name === 'routeSegments' || prop.name === 'segments') && Number.isFinite(Number(prop.value))) {
                        ellipseSegments = Number(prop.value);
                    }
                });
            }
            // Formato 2: propiedades como objeto directo
            else if (obj.properties && typeof obj.properties === 'object') {
                console.log(`  Format: Objeto directo`);
                if (obj.properties.enemyType) enemyType = String(obj.properties.enemyType).toLowerCase();
                if (obj.properties.weaponType) weaponType = String(obj.properties.weaponType).toLowerCase();
                if (Number.isFinite(Number(obj.properties.routeSegments))) {
                    ellipseSegments = Number(obj.properties.routeSegments);
                } else if (Number.isFinite(Number(obj.properties.segments))) {
                    ellipseSegments = Number(obj.properties.segments);
                }
            } else {
                console.warn(`   Sin propiedades detectadas`);
            }

            console.log(`  → enemyType: ${enemyType}, weaponType: ${weaponType}`);

            // Convertir forma de Tiled a puntos de ruta en coordenadas del mundo.
            // Soportado: polygon, polyline, ellipse y punto fijo.
            let routePoints = [];

            if (Array.isArray(obj.polygon) && obj.polygon.length > 0) {
                routePoints = obj.polygon.map(point => ({
                    x: (obj.x + point.x) * scale,
                    y: (obj.y + point.y) * scale
                }));
                console.log(`✓ Es polígono con ${routePoints.length} punto(s)`);
            } else if (Array.isArray(obj.polyline) && obj.polyline.length > 0) {
                routePoints = obj.polyline.map(point => ({
                    x: (obj.x + point.x) * scale,
                    y: (obj.y + point.y) * scale
                }));
                console.log(`✓ Es polyline con ${routePoints.length} punto(s)`);
            } else if (!obj.ellipse && Number(obj.width) > 1 && Number(obj.height) > 1) {
                // Rectángulo de Tiled: se convierte a 4 esquinas para patrulla en cuadrado.
                const x = Number(obj.x) || 0;
                const y = Number(obj.y) || 0;
                const width = Number(obj.width) || 0;
                const height = Number(obj.height) || 0;

                routePoints = [
                    { x: x * scale, y: y * scale },
                    { x: (x + width) * scale, y: y * scale },
                    { x: (x + width) * scale, y: (y + height) * scale },
                    { x: x * scale, y: (y + height) * scale }
                ];
                console.log(`✓ Es rectángulo con patrulla cuadrada (${routePoints.length} punto(s))`);
            } else if (obj.ellipse) {
                const width = Number(obj.width) || 0;
                const height = Number(obj.height) || 0;

                if (width > 0 && height > 0) {
                    const safeSegments = Math.max(3, Math.floor(ellipseSegments));
                    const centerX = obj.x + width / 2;
                    const centerY = obj.y + height / 2;
                    const radiusX = width / 2;
                    const radiusY = height / 2;

                    for (let i = 0; i < safeSegments; i++) {
                        const angle = (Math.PI * 2 * i) / safeSegments;
                        routePoints.push({
                            x: (centerX + Math.cos(angle) * radiusX) * scale,
                            y: (centerY + Math.sin(angle) * radiusY) * scale
                        });
                    }
                    console.log(`✓ Es elipse/círculo con ${safeSegments} segmento(s)`);
                } else {
                    routePoints = [{ x: obj.x * scale, y: obj.y * scale }];
                    console.warn(`⚠️ Elipse sin tamaño válido en routes ${index}; se usará punto fijo`);
                }
            } else {
                routePoints = [{ x: obj.x * scale, y: obj.y * scale }];
                console.log(`✓ Objeto puntual en routes ${index}: enemigo estático`);
            }

            if (routePoints.length === 0) {
                console.warn(`⚠️ Objeto en routes ${index} no tiene puntos de ruta válidos, ignorando...`);
                return;
            }

            const startX = routePoints[0].x;
            const startY = routePoints[0].y;
            const enemyName = `${enemyType.charAt(0).toUpperCase() + enemyType.slice(1)}_${index}`;

            // Mapeo de tipos de armas a clases
            const weaponClassMap = {
                'arco': Arco,
                'mcuaktro': Mcuaktro,
                'cuchillo': Cuchillo,
                'mazo': Mazo,
                'ramita': Ramita,
                'escoba': Escoba
            };

            const WeaponClass = weaponClassMap[weaponType] || Cuchillo;

            // Crear el enemigo del tipo especificado
            let enemy;
            let texture;
            if (enemyType === 'zorro') {
                texture = 'zorro_idle';
                enemy = new Zorro(this, enemyName, startX, startY, texture, null, WeaponClass, 'followRoute');
            } else {
                texture = 'mapache_idle';
                enemy = new Mapache(this, enemyName, startX, startY, texture, null, WeaponClass, 'followRoute');
            }

            // Asignar la ruta al enemigo
            enemy._movementData = {
                routePoints: routePoints,
                currentPointIndex: 0,
                pauseTimer: 0
            };

            this.enemies.add(enemy);
            enemyCount++;

            console.log(` ${enemyName} (${enemyType} con ${weaponType}) creado en (${startX}, ${startY}) con ruta de ${routePoints.length} puntos`);
        });

        console.log(`\n Total de enemigos creados: ${enemyCount}`);
        if (enemyCount === 0) {
            console.warn(`\n SIN ENEMIGOS CREADOS. Revisa:\n  1. La capa se llama "routes" en Tiled? (case-sensitive)\n  2. Los objetos tienen propiedades "enemyType" y "weaponType"?\n  3. Son polígonos (polygon), no otros tipos de objeto?`);
        }
    }

    /*
        CREACCIÓN DE CONSUMIBLES USANDO LA CAPA DE CONSUMABLES DE TILED
    */
    setupConsumablesFromLayer(scale) {
        const consumableLayer = this.map.getObjectLayer('consumables') || this.map.getObjectLayer('consummable') || this.map.getObjectLayer('consumable');

        if (!consumableLayer || !Array.isArray(consumableLayer.objects)) {
            console.warn('No se encontró una capa de consumables en Tiled. Nombres válidos: consumables, consummable, consumable.');
            return;
        }

        const allConsumableTypes = ['bread', 'attack_potion', 'speed_potion', 'speed_attack_potion', 'feather', 'key'];

        consumableLayer.objects.forEach((obj) => {
            const resolvedType = this.resolveConsumableTypeFromObject(obj, allConsumableTypes);
            const selectedType = resolvedType || Phaser.Utils.Array.GetRandom(allConsumableTypes);

            if (!selectedType) {
                console.warn('Consumable sin tipo válido:', obj);
                return;
            }

            this.createConsumable(selectedType, obj.x * scale, obj.y * scale);
        });
    }

    /**
     * Intenta resolver el tipo de consumible desde el objeto de Tiled.
     * Prioridad: obj.name -> property.name.
     * Si no coincide con un tipo válido, el caller debe usar aleatorio.
     * @param {Phaser.Types.Tilemaps.TiledObject} obj
     * @param {string[]} validTypes
     * @returns {string|null}
     */
    resolveConsumableTypeFromObject(obj, validTypes) {
        const normalize = (value) => {
            const normalized = String(value || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/-/g, '_');

            switch (normalized) {
                case 'dropfeather':
                case 'drop_feather':
                    return 'feather';
                case 'bread_item':
                case 'dropbread':
                case 'drop_bread':
                    return 'bread';
                case 'attackpotion':
                    return 'attack_potion';
                case 'speedpotion':
                    return 'speed_potion';
                case 'speed_attackpotion':
                case 'speedattackpotion':
                    return 'speed_attack_potion';
                case 'key':
                case 'key_item':
                case 'llave':
                    return 'key';
                default:
                    return normalized;
            }
        };

        const objectName = normalize(obj?.name);
        if (objectName && objectName !== 'consumable' && objectName !== 'consummable' && validTypes.includes(objectName)) {
            return objectName;
        }

        const propertyName = Array.isArray(obj?.properties)
            ? normalize(obj.properties.find(p => String(p.name || '').toLowerCase() === 'name')?.value)
            : '';

        if (propertyName && propertyName !== 'consumable' && propertyName !== 'consummable' && validTypes.includes(propertyName)) {
            return propertyName;
        }

        return null;
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
            case 'feather':
                new DropFeather(this, x, y);
                break;
            case 'key':
                new Key(this, x, y);
                break;
            default:
                console.warn(`Tipo de consumible desconocido: ${type}`);
        }
    }

    // ─────────────────────────────────────────
    // SISTEMA MONETARIO DE PAN
    // ─────────────────────────────────────────

    /**
     * Incrementa el contador de pan (moneda del juego) y actualiza la UI.
     * Llamado por Bread.interact() y DropBread.interact() al recoger un pan.
     * @param {number} amount - Cantidad de panes a añadir
     */
    addBread(amount) {
        this.breadCount += amount;

        if (this.consumableBar) {
            this.consumableBar.update();
            this.consumableBar.pulseBread?.();
        }
    }

    tryOpenNearbyClosedDoor(player, consumeKey = true) {
        if (!player || !this.puertaCerradaLayer) {
            return false;
        }

        const SCALE = 4;
        const TILE_SIZE = 16;
        const range = 80;

        const playerTileX = Math.floor(player.x / SCALE / TILE_SIZE);
        const playerTileY = Math.floor(player.y / SCALE / TILE_SIZE);
        const rangeTiles = Math.ceil(range / SCALE / TILE_SIZE);

        const doorTiles = this.puertaCerradaLayer.getTilesWithin(
            playerTileX - rangeTiles,
            playerTileY - rangeTiles,
            rangeTiles * 2,
            rangeTiles * 2
        ).filter(tile => tile && tile.index !== -1);

        if (doorTiles.length === 0) {
            return false;
        }

        if (consumeKey) {
            const keyIndex = (player.consumables || []).findIndex(item => item?.type === 'key');
            if (keyIndex === -1) {
                return false;
            }

            player.consumables.splice(keyIndex, 1);
        }

        doorTiles.forEach(tile => {
            this.puertaCerradaLayer.removeTileAt(tile.x, tile.y);
        });

        this.consumableBar?.update?.();
        console.log('Puerta cerrada abierta con llave');
        return true;
    }

    /**
     * Actualiza el texto del contador de pan en el HUD.
     */
    updateBreadUI() {
        if (this.consumableBar) {
            this.consumableBar.update();
        }
    }

    // ─────────────────────────────────────────
    // TIENDA DESDE TILED
    // ─────────────────────────────────────────

    /**
     * Lee la capa 'Store' del mapa, extrae las posiciones de sus objetos
     * y los pasa a la clase Store para que genere una poción aleatoria en cada uno.
     *
     * Cada objeto de la capa representa un slot de tienda independiente.
     * Las posiciones se escalan igual que el resto del mapa (× SCALE).
     *
     * @param {number} scale - Escala del mapa
     */
    setupStoreFromLayer(scale) {
        const storeLayer = this.map.getObjectLayer('store');

        if (!storeLayer || !Array.isArray(storeLayer.objects) || storeLayer.objects.length === 0) {
            console.warn('[MainScene] No se encontró la capa "Store" en el mapa o está vacía.');
            return;
        }

        console.log(`[MainScene] Capa Store encontrada con ${storeLayer.objects.length} objeto(s).`);

        // Extraer posiciones escaladas directamente de los objetos del mapa
        const positions = storeLayer.objects.map(obj => ({
            x: obj.x * scale,
            y: obj.y * scale,
        }));

        // Instanciar la tienda sin posición central fija; los slots vienen del mapa
        this.store = new Store(this, 0, 0, this.duck, this.consumableBar);

        // Generar una poción aleatoria en cada posición del mapa
        this.store.spawnAtPositions(positions);
    }

    // ─────────────────────────────────────────
    // RANA DESDE TILED
    // ─────────────────────────────────────────

    /**
     * Lee la capa 'Rana' del mapa, localiza el objeto llamado 'Rana'
     * y spawnea la clase Frog en esa posición exacta.
     *
     * La posición se escala igual que el resto del mapa (× SCALE).
     *
     * @param {number} scale - Escala del mapa
     */
    setupFrogFromLayer(scale) {
        const frogLayer = this.map.getObjectLayer('rana');

        if (!frogLayer || !Array.isArray(frogLayer.objects)) {
            console.warn('[MainScene] No se encontró la capa "Rana" en el mapa.');
            return;
        }

        const frogObject = frogLayer.objects.find(
            obj => (obj.name || '').trim().toLowerCase() === 'rana'
        );

        if (!frogObject) {
            console.warn('[MainScene] No se encontró un objeto llamado "Rana" dentro de la capa "Rana".');
            return;
        }

        const frogX = frogObject.x * scale;
        const frogY = frogObject.y * scale;

        // Spawnear la rana en la posición exacta del mapa
        this.frog = new Frog(this, 'rana', frogX, frogY, 'rana_idle', null);

        console.log(`[MainScene] Frog spawneada en (${frogX}, ${frogY}) desde la capa "Rana".`);
    }

    // ─────────────────────────────────────────
    // CHARCOS DESDE TILED
    // ─────────────────────────────────────────

    /**
     * Lee la capa 'charquito' del mapa y crea una instancia de Puddle por cada polígono.
     *
     * Cada objeto debe tener el campo `polygon` de Tiled. Las coordenadas se escalan igual
     * que el resto del mapa (× SCALE).
     *
     * @param {number} scale - Escala del mapa
     */
    setupPuddlesFromLayer(scale) {
        const puddleLayer = this.map.getObjectLayer('charquito');

        this.puddles = [];

        if (!puddleLayer || !Array.isArray(puddleLayer.objects) || puddleLayer.objects.length === 0) {
            console.log('[MainScene] No se encontró la capa "charquito" o está vacía.');
            return;
        }

        puddleLayer.objects.forEach((obj, index) => {
            if (!Array.isArray(obj.polygon) || obj.polygon.length < 3) {
                return;
            }

            const points = obj.polygon.map(point => ({
                x: (obj.x + point.x) * scale,
                y: (obj.y + point.y) * scale
            }));

            const puddle = new Puddle(this, points, obj.name || `charco_${index + 1}`);
            this.puddles.push(puddle);
        });

        console.log(`[MainScene] Capa charquito encontrada con ${this.puddles.length} charco(s).`);
    }

}