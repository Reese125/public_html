import { STATE, PADDLE_VELOCITY } from './model.js';
import { onTick } from './pong.js';
import { speak_reset } from './view.js';


export function keyDown(model, event) {
    const key = event.code;

    switch (key) {
        case "KeyW":
            model.paddleL.vely = -PADDLE_VELOCITY;
            break;
        case "KeyS":
            model.paddleL.vely = PADDLE_VELOCITY;
            break;
        case "ArrowUp":
            model.paddleR.vely = -PADDLE_VELOCITY;
            break;
        case "ArrowDown":
            model.paddleR.vely = PADDLE_VELOCITY;
            break;
        case "End":
            model.resetGame();
            break;
    }
}


export function keyUp(model, event) {
    const key = event.code;

    switch (key) {
        case "KeyW":
        case "KeyS":
            model.paddleL.vely = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
            model.paddleR.vely = 0;
            break;
    }
}

export function resetGame(model) {
    if (model.state != STATE.STARTUP) {
        speak_reset()
    }
    model.resetGame();
    onTick(model);
}

export function set_cpu(model, event) {
    model.is_cpu = event.target.checked;
}

export function set_left_name(model, event) {
    model.nameL = event.target.value;
}

export function set_right_name(model, event) {
    model.nameR = event.target.value;
}