import { speak_hit } from './view.js';
import { PADDLE_VELOCITY, BOARD_HEIGHT, BOARD_WIDTH, PADDLE_FORCE, BALL_RADIUS, SIDE } from './model.js';


export default class Paddle {
    posx;
    posy;
    width;
    height;
    color;
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
    }

    move(is_cpu, ball) {
        if (is_cpu) {
            // ball.y <- where the ball is
            // this.y <- where the paddle is
            // this.l <- how long the paddle is

            // control this.vy using ball
            // don't set this.y! (cheating)
            this.vely = Math.min(PADDLE_VELOCITY, Math.max(-PADDLE_VELOCITY, ball.posy - this.posy - this.height / 2));
        }
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
    }

    bounce(model, ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);
        // try bounce ball
        if (ball.posy >= this.posy && ball.posy <= this.posy + this.height && // within y
            ball.posx - BALL_RADIUS <= this.posx + this.width && ball.posx + BALL_RADIUS >= this.posx &&  // within x 
            ball.velx * bounce_dir < 0 // ball going into wall
        ) {
            speak_hit(this.side == SIDE.LEFT ? model.nameL : model.nameR)
            ball.velx = bounce_dir * PADDLE_FORCE * Math.abs(ball.velx);
            return SIDE.NONE;
        }

        return SIDE.NONE;
    }
}

