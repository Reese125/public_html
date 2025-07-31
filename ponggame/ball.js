import { play_beep } from './view.js';
import { BOARD_WIDTH, BOARD_HEIGHT, BALL_RADIUS, SIDE } from "./model.js";

export default class Ball {
    posx;
    posy;
    velx;
    vely;

    constructor(posx, posy, velx, vely) {
        this.posx = posx;
        this.posy = posy;
        this.velx = velx;
        this.vely = vely;
    }


    move() {
        this.posx += this.velx;
        this.posy += this.vely;

    }

    bounce(model, things) {
        this.bounceWalls();
        for (let thing of things) {
            let side = thing.bounce(model, this);
            if (side != SIDE.NONE) return side;
        }
        if (this.posx + BALL_RADIUS > BOARD_WIDTH) return SIDE.RIGHT; // Someone got a point...
        if (this.posx + BALL_RADIUS < 0) return SIDE.LEFT; // Someone got a point...

        return SIDE.NONE;
    }

    bounceWalls() {
        if (this.posy - BALL_RADIUS < 0) {
            this.vely = Math.abs(this.vely);
            play_beep()
        }
        if (this.posy + BALL_RADIUS > BOARD_HEIGHT) {
            this.vely = -Math.abs(this.vely);
            play_beep()
        }
    }
}