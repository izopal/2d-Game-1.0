import Game                         from "./game.js";

const body             = document.body;
const canvasMS         = document.getElementById('canvasMS');
const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
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
body.addEventListener('keydown', e => {
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

// ==========================Логіка керування за допомогою тачпада=============================>
//  блок наведення пальця на екран
const touchTreshold = 50;
let touchInProgress = false;
let touchStartTime  = '';
let touchEndTime    = '';
let touchY          = '';

body.addEventListener('touchstart', (e) => {
    touchInProgress = true;
    touchStartTime  = e.timeStamp;
    touchY          = e.changedTouches[0].pageY;
}); 

//  блок руху пальця на екрані.
body.addEventListener('touchmove', (e) => {
    touchInProgress     = false;
    const swipeDistance = e.changedTouches[0].pageY - touchY;
    if ((swipeDistance > touchTreshold || swipeDistance <  -touchTreshold) && game.gameOver ) {
        game.restart();
        animate(0);
    };
    // console.log(e)
}); 

body.addEventListener('touchend', (e) => {
    touchEndTime       =  e.timeStamp;
    const deltaTime    = touchEndTime - touchStartTime;
    if (deltaTime >= 1000 && !game.gameOver && touchInProgress) {
        game.isPaused  = !game.isPaused ; // Переключення стану паузи
        game.statusText.paused(ctx)
        if (!game.isPaused ) requestAnimationFrame(animate);
    };
}); 


window.addEventListener('load',  () => { 
animate(0);
});



