import Phaser from 'phaser';
import ramita_file from '../../assets/sprites/Weapons/ramita.png';
import mazo_file from '../../assets/sprites/Weapons/mazo.png';
import mcuaktro_file from '../../assets/sprites/Weapons/mcuaktro.png';
import cuchillo_file from '../../assets/sprites/Weapons/cuchillo.png';
import arco_file from '../../assets/sprites/Weapons/arco.png';
import bala_mcuaktro_file from '../../assets/sprites/Proyectiles/bala_mcuaktro.png';
import flecha_arco_file from '../../assets/sprites/Proyectiles/flecha_arco.png';
import { handleDistanceAttack } from './distanceWeapons.js';
import { handleMeleeAttack } from './meleeWeapons.js';

const WEAPON_CONFIG = {
    ramita: { texture: 'ramita', file: ramita_file, type: 'melee', scale: 0.15, origin: { x: 0.5, y: 0.5 } },
    mazo: { texture: 'mazo', file: mazo_file, type: 'melee', scale: 0.2, origin: { x: 0.5, y: 0.5 } },
    mcuaktro: { texture: 'mcuaktro', file: mcuaktro_file, type: 'distance', scale: 0.2, origin: { x: 0.4, y: 0.4 } },
    cuchillo: { texture: 'cuchillo', file: cuchillo_file, type: 'melee', scale: 0.2, origin: { x: 0.5, y: 0.5 } },
    arco: { texture: 'arco', file: arco_file, type: 'distance', scale: 0.2, origin: { x: 0.6, y: 0.4 } }
};

const StatusWeapon = {
    DROPPED: 0,
    READY: 1,
    CHARGING: 2,
    COOLDOWN: 3
};

export default class Weapon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, weaponType = 'ramita') {
        if (!WEAPON_CONFIG[weaponType]) {
            console.error(`Weapon: unknown weaponType '${weaponType}'. Falling back to 'ramita'.`);
            weaponType = 'ramita';
        }

        const cfg = WEAPON_CONFIG[weaponType];
        super(scene, x, y, cfg.texture);

        scene.add.existing(this);

        this.scene = scene;
        this.weaponType = weaponType;
        this.cfg = cfg;
        this.isAttacking = false;

        this.setScale(cfg.scale);
        this.setOrigin(cfg.origin.x, cfg.origin.y);
        
            // He tenido que rotar el mcuaktro a mano 
            if (weaponType === 'mcuaktro') {
                this.setAngle(45);
            }
    }

    // Para cargar todas las armas de una
    static preload(scene) {
        Object.values(WEAPON_CONFIG).forEach(cfg => {
            scene.load.image(cfg.texture, cfg.file);
        });
        scene.load.image('bala_mcuaktro', bala_mcuaktro_file);
        scene.load.image('flecha_arco', flecha_arco_file);
    }

    // El ataque diferencia entre melee y distancia
    attack() {
        if (this.cfg && this.cfg.type === 'distance') {
            handleDistanceAttack(this);
            return;
        }

        if (this.cfg && this.cfg.type === 'melee') {
            handleMeleeAttack(this);
            return;
        }

        handleMeleeAttack(this);
    }
}