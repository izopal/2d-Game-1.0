import GameObject   from './GameObject.js';
import InputHandler from './input.js';

export default class Player extends GameObject {
    constructor(game, key){
        super(game, key)
        this.input         = new InputHandler(this.game);
        // параметри розміщення і розмірів тіні персонажа
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
        // параметри для зміни кадрів забраження персонажа
        this.frameX        = 0;
        this.frameY        = 0;  
        // підключаємо модуль керування персонажем
    };

    reset(){
        super.reset();
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
        this.speedModifier = this.gameObject.speedModifier * this.scale;
    };

    update(){
        this.frameX = (this.frameX < this.maxFrameX - 1) ? ++this.frameX : 0;
      
        // блок зміни кадрів персонажа в залежності від кута розвороту
        const dx           = this.input.mouse.x - this.x;         // визначаємо дистанцію по осі X між поточним і попереднім розміщенням курсора
        const dy           = this.input.mouse.y - this.y;         // визначаємо дистанцію по осі Y між поточним і попереднім розміщенням курсора
        const distance     = Math.hypot(dy, dx);        // ;
        this.angle         = Math.atan2(dy, dx) || 1.96;         
        const a            = Math.PI * 2 / this.maxFrameY;        // кут частинки кола
        
        if     (this.angle < -a * .5 - a * 2)                   this.frameY = 7;    // вліво-верх
        else if(this.angle < -a * .5 - a)                       this.frameY = 0;    // верх
        else if(this.angle < -a * .5)                           this.frameY = 1;    // вправо-верх  
        else if(this.angle <  a * .5)                           this.frameY = 2;    // вправо
        else if(this.angle <  a * .5 + a)                       this.frameY = 3;    // вправо-низ
        else if(this.angle <  a * .5 + a * 2)                   this.frameY = 4;    // низ
        else if(this.angle <  a * .5 + a * 3)                   this.frameY = 5;    // вліво-вниз
        else if(this.angle < -a * .5 - a * 3 || a * .5 + a * 3) this.frameY = 6;    // вліво
      
        // блок зміни швидкості персонажа
        if( distance > this.speedModifier){
            this.speedX    = dx / distance || 0;       // якщо значення  this.dx / distance = undefined тоді this.speedX  = 0
            this.speedY    = dy / distance || 0;
        }else{
            this.speedX    = 0;
            this.speedY    = 0;
        }
        this.x            += this.speedX * this.speedModifier;
        this.y            += this.speedY * this.speedModifier;
        
        // блок зіткнення з границями екрану
        super.update()

        // блок зіткнення персонажа з першкодами
        this.game.obstacles.forEach(obstacl => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, obstacl);
            if(collision){
                const unit_x = dx / distance || 0;
                const unit_y = dy / distance || 0;
                this.x       = obstacl.x + (sumOffRadius +1) * unit_x;
                this.y       = obstacl.y + (sumOffRadius +1) * unit_y;
            }
        });
    };

    draw(ctx){
        // малюємо персонажа
        super.draw(ctx);

        if(this.game.debug){
            // малюємо лінію
            ctx.beginPath   ();
            ctx.moveTo      (this.x, this.y);
            ctx.lineTo      (this.input.mouse.x, this.input.mouse.y); 
            ctx.stroke      ();   

            // малюємо квадрат
            this.playerX    = this.x - this.width * .5;
            this.playerY    = this.y - this.height * .8;
            this.rectX      = this.playerX + this.width * .25;   // початкова координата X розміщення;
            this.rectY      = this.playerY + this.height * .25;  // початкова координата Y розміщення;
            this.rectWidth  = this.width  * .5;
            this.rectHeight = this.height * .6;
            ctx.strokeRect (this.rectX,  
                            this.rectY,  
                            this.rectWidth,           
                            this.rectHeight);        
            ctx.stroke      ();
        };
    }
}