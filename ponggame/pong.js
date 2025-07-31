import { Model, STATE, SIDE } from './model.js';
import { bind_events, draw_game, speak_miss, updateScore } from './view.js';

export function onTick(model) {
    switch (model.state) {
        case STATE.STARTUP:
            model.state = STATE.PLAYING;
            break;
        case STATE.PLAYING:
            model.state = play(model);
            break;
        case STATE.GAMEOVER:
            break;
    }
    draw_game(model);
    model.intervalID = setTimeout(() => onTick(model), 10);
}

function play(model) {
    model.paddleL.move(false, model.ball);
    model.paddleR.move(model.is_cpu, model.ball);
    let scoreSide = model.ball.bounce(model, [model.paddleL, model.paddleR]);
    if (scoreSide != SIDE.NONE) {
        if (scoreSide == SIDE.LEFT) {
            speak_miss(model.nameL, model.nameR)
            model.scoreR++;
        }
        if (scoreSide == SIDE.RIGHT) {
            speak_miss(model.nameR, model.nameL)
            model.scoreL++;
        }
        updateScore(model);
        model.resetBall();
        if (model.scoreL > 10) {
            speak_win(model.nameL)
            return STATE.GAMEOVER;

        } else if (model.scoreR > 10) {
            speak_win(model.nameR)
            return STATE.GAMEOVER;
        }
    }
    model.ball.move();
    // Add serving the ball?
    // If a player wins, stop the game...
    return STATE.PLAYING;
}

window.onload = () => {
    const model = new Model();
    bind_events(model);
}