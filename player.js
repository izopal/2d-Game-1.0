import constants    from './constants.js';
import InputHandler from './input.js';

export default class Player {
    constructor(game){
        this.game          = game;
        // підключаємо модуль керування персонажем
        this.input         = new InputHandler(this.game);
        // паарметри зображення персонажа
        this.image         = document.getElementById('bull');
        // параметри початквого розміру кадру (frame) зображення для персонжа
        this.width         = constants.player.width ; 
        this.height        = constants.player.height ;
        // параметри кінцевого розміру кадру (frame) зображення для персонажа
        this.size          = constants.player.size;
        this.scale         = this.game.scale;
        this.playerWidth   = this.width * this.size * this.scale;
        this.playerHeight  = this.height * this.size * this.scale;
        // параметри розміщення і розмірів тіні персонажа
        this.radius        = constants.player.radius * this.scale;
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
        // параметри для зміни кадрів забраження персонажа
        this.frameX        = 0;
        this.frameY        = 0;  
        this.maxFrameX     = constants.player.maxFrameX;
        this.maxFrameY     = constants.player.maxFrameY;  
        
        // параметри регулювання руху швидкості персонажа і мишки
        this.speedX        = 0;
        this.speedY        = 0;
        this.speedModifier = constants.player.speedModifier * this.scale;
        this.dx            = 0;
        this.dy            = 0;

       
    }
    reset(){
        this.scale         = this.game.scale;
        this.playerWidth   = this.width * this.size * this.scale;
        this.playerHeight  = this.height * this.size * this.scale;
        this.radius        = constants.player.radius * this.scale;
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
        this.speedModifier = constants.player.speedModifier * this.scale;
        console.log(this.speedModifier )
        // this.x            ;
        // this.y             ;
    }
    update(){

        this.frameX = (this.frameX < this.maxFrameX - 1) ? ++this.frameX : 0;
      
        const dx           = this.input.mouse.x - this.x;         // визначаємо дистанцію по осі X між поточним і попереднім розміщенням курсора
        const dy           = this.input.mouse.y - this.y;         // визначаємо дистанцію по осі Y між поточним і попереднім розміщенням курсора
        const distance     = Math.hypot(dy, dx);        // ;
        this.angle         = Math.atan2(dy, dx) || 1.96;         
        const a            = Math.PI * 2 / this.maxFrameY;        // кут частинки кола
        
        // блок зміни кадрів персонажа в залежності від кута розвороту
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
        if     (this.x - this.playerWidth * .25 < 0 ) this.x  = this.playerWidth * .25;
        else if(this.x - this.playerWidth * .25 > this.game.width - this.playerWidth * .5) this.x = this.game.width - this.playerWidth * .25
        if     (this.y < this.game.topMargin) this.y = this.game.topMargin;
        else if(this.y > this.game.height - this.playerHeight *.2 ) this.y = this.game.height -  this.playerHeight *.2  ;

      

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
       
    }

    draw(ctx){
        // малюємо персонажа
        this.playerX = this.x - this.playerWidth * .5;
        this.playerY = this.y - this.playerHeight * .8;
        ctx.drawImage ( this.image, 
                        // параметри кадру, який обераємо
                        this.frameX * this.width, 
                        this.frameY * this.height , 
                        this.width, 
                        this.height , 
                        // параметри кадру, де буде розміщений і які розміри буде мати
                        this.playerX,                                                                                            
                        this.playerY, 
                        this.playerWidth, 
                        this.playerHeight );

        
        if(this.game.debug){
            this.rectX      = this.playerX + this.playerWidth * .25;   // початкова координата X розміщення;
            this.rectY      = this.playerY + this.playerHeight * .25;  // початкова координата Y розміщення;
            this.rectWidth  = this.playerWidth  * .5;
            this.rectHeight = this.playerHeight * .6;
            // малюємо квадрат
            ctx.strokeRect (this.rectX,  
                            this.rectY,  
                            this.rectWidth,           
                            this.rectHeight);        
            ctx.stroke      ();
            // малюємо квадрат
            ctx.strokeRect (this.playerX,  
                            this.playerY,  
                            this.playerWidth,           
                            this.playerHeight);        
            ctx.stroke      ();
    
            // малюємо коло
            ctx.beginPath   ();
            ctx.arc         (this.x,
                             this.y,
                             this.radius,
                             0,
                             Math.PI * 2);
            ctx.save        ();
                ctx.globalAlpha = .4;             
                ctx.fill    ();
            ctx.restore     (); 
            ctx.stroke      ();
    
            // малюємо лінію
            ctx.beginPath   ();
            ctx.moveTo      (this.x, this.y);
            ctx.lineTo      (this.input.mouse.x, this.input.mouse.y); 
            ctx.stroke      ();   
        };
    }
}