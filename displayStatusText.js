export default class DisplayStatusText {
    constructor(game){
        this.game = game;
       
    };
     // Інформацційне повідомлення кнопки повноекранний режим
     updateButtonSize() {
        // блок малювання кнопки
        const buttonBorderRadius            = 20; // Встановлюємо бажане значення для зміщення зверху
        fullscreenButton.style.borderRadius = (buttonBorderRadius * this.game.scale) + 'px';
        fullscreenButton.style.fontSize     = (20 * this.game.scale) + 'px';
    };
    
    displayStatusText(ctx) {
        // блок малювання результатів гри
        ctx.font = `${40 * this.game.scale}px Helvetica`;
       
      ;
        const textX           = 100 * this.game.scale;
        const textY           = 50 * this.game.scale;
       


        const interval      =  this.game.scoreLoss;  // 50
        const displayTimer  =  this.game.score
        const maxValue      =  0;
        const scaleWidth    =  100 - displayTimer;
        
        console.log(displayTimer, interval, this.game.scoreWin )
      
        
        // const alpha         = (interval - displayTimer) / interval
        
        let scaleColor = scaleWidth > 0 ? 'red' : 'blue';
       
      
        // Малюємо саму шкалу з врахуванням коліру
        ctx.save();
            ctx.globalAlpha = .1;
            ctx.fillStyle   = 'yellow';
            ctx.fillRect(textX-50, textY, 100, 10 * this.game.scaleY);  // Малюємо шкалу від ліва до центра
        ctx.restore();
        ctx.save();
            ctx.globalAlpha = .6;
            ctx.fillStyle   = scaleColor;
            ctx.fillRect(textX, textY,  maxValue - scaleWidth, 10 * this.game.scaleY);  // Малюємо шкалу від права до центра
        ctx.restore();

       
         // Інформаційне повідомлення якщо ігра програна/виграна
        if (this.game.gameOver){
            let text = ''
            if(this.game.score === this.game.scoreLoss)       text = 'Невдача, спробуйте ще раз';
            else if (this.game.score === this.game.scoreWin)  text = 'Вітаю ви перемогли'; 
            
            const textWidth   = ctx.measureText(text).width;
            const textX       = (canvasMS.width - textWidth) / 2;
            const textY       = canvasMS.height / 2;
            const textXY      = 2 * this.game.scale;
            ctx.fillStyle     = 'black';
            ctx.fillText(text, textX, textY);
            ctx.fillStyle     = 'white';
            ctx.fillText(text, textX + textXY, textY + textXY);
        }
    };

    paused(ctx){
        if(this.game.isPaused){
            const text        = 'Пауза';
            const textWidth   = ctx.measureText(text).width;
            const textX       = (this.game.width - textWidth) / 2;
            const textY       = this.game.height / 2;
            const textXY      = 2 * this.game.scale;
            const fontSize    = 40 * this.game.scale; 

            ctx.font          = `${fontSize}px Arial`;
            ctx.fillStyle     = 'black';
            ctx.fillText(text, textX, textY);
            ctx.fillStyle     = 'white';
            ctx.fillText(text, textX + textXY, textY + textXY);
        }
    }
}