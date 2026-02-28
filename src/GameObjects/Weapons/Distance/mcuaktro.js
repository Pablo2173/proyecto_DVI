import Weapon from '../weapon.js';
import Bala from '../../Projectiles/bala.js';
import mcuaktroSprite from '../../../../assets/sprites/weapons/mcuaktro.png';

export default class Mcuaktro extends Weapon {
    constructor(scene, owner, bar = null) {
        super(scene, owner, {
            texture:         'mcuaktro',
            isRanged:        true,
            projectileClass: Bala,
            projectileSpeed: 900,
            damage:          15,
            attackSpeed:     200,   // cadencia alta
            range:           500,
            optimalDistance: 350,
            scale:           1,
            spriteAngleOffset: 0,
            debug:           true,
            accuracy:        0
        });
    }

    static preload(scene) {
        scene.load.image('mcuaktro', mcuaktroSprite);
    }

    // Called when you equip the weapon
    on_equip(){
        if(this.bar)
            this.bar.setFull();
    }

    // Called when shooting a bullet
    on_shoot(){
        if(this.bar)
            this.bar.removeCharge(5);
        if (this.bar.isEmpty())
            this.destroy()
        this.attackSpeed += 3
        this.accuracy +=7
    }    
    
    // Called before shoot, after cooldown, to see if the bar state is acceptable for the weapon
    barCanShoot(){ 
        return !this.bar.isEmpty();
    }  

    // Called while not shooting
    on_wait(){
        if(this.bar)
            this.bar.addCharge(1);
        this.attackSpeed = 200
        this.accuracy = 0
    }
}