const StatusDuck = {
    MAIN: 0,
    STUNNED: 1,
    ROLLING: 2,
    SWIMMING: 3
};

class Duck {
    constructor(element) { // `constructor` es una palabra reservada
        super(element, 200, 200);
        this._speed = 5;
        this._weapon = null;
        this.dmgMult = 1;
        this.effMult = 1;
        this._state = StatusDuck.MAIN;
    }

    //Movimiento del pato
    move(direction) {
        if (this._state == StatusDuck.STUNNED) return;
        switch (direction) {
            case "up":
                this.y -= this._speed;
                break;
            case "down":
                this.y += this._speed;
                break;
            case "left":
                this.x -= this._speed;
                break;
            case "right":
                this.x += this._speed;
                break;
        }
        this.render();
    }


}
