import Game                         from "./game.js";

const canvasMS       = document.getElementById('canvasMS');
const ctx            = canvasMS.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle    = 'none';
      ctx.lineStroke   = 3;
      ctx.strokeStyle  = 'red';

const game   = new Game(canvasMS, ctx);

let lastTime = 0 
function animate (timeStamp){
    const deltaTime = timeStamp - lastTime;
    if(!game.isPaused ){
        lastTime        = timeStamp;
        game.render(ctx, deltaTime);

        game.statusText.updateButtonSize(ctx);
        game.statusText.displayStatusText(ctx);
        if(!game.gameOver)requestAnimationFrame(animate);
    }
}

// Умова обробник події для паузи і перезапуску гри
window.addEventListener('keydown', e => {
    if (e.key === "Enter" && game.gameOver) {
        game.restart();
        animate(0);
    };

    if (e.key === ' ' && !game.gameOver) {
        game.isPaused  = !game.isPaused ; // Переключення стану паузи
        game.statusText.paused(ctx)
        if (!game.isPaused ) requestAnimationFrame(animate);
    };
});



window.addEventListener('load',  () => { 
animate(0);
});



