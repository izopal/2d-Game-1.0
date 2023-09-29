import constants    from './constants.js';

export default class Player {
    constructor(game){
        this.game          = game;
        // паарметри зображення персонажа
        this.image         = document.getElementById('bull');
        // параметри початквого розміру кадру (frame) зображення для персонжа
        this.width         = constants.player.width; 
        this.height        = constants.player.height;
        // параметри кінцевого розміру кадру (frame) зображення для персонажа
        this.size          = constants.player.size;
        this.playerWidth   = this.width * this.size;
        this.playerHeight  = this.height * this.size;
        // параметри розміщення і розмірів тіні персонажа
        this.radius        = constants.player.radius;
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
        // параметри для зміни кадрів забраження персонажа
        this.frameX        = 0;
        this.frameY        = 4;  
        this.maxFrameX     = constants.player.maxFrameX;
        this.maxFrameY     = constants.player.maxFrameY;  
        // параметри регулювання руху швидкості персонажа і мишки
        this.speedX        = 0;
        this.speedY        = 0;
        this.speedModifier = constants.player.speedModifier;
        this.dx            = 0;
        this.dy            = 0;
    }
    update(mouse){
        this.mouse         = mouse;
        this.dx            = this.mouse.x - this.x;         // визначаємо дистанцію по осі X між поточним і попереднім розміщенням курсора
        this.dy            = this.mouse.y - this.y;         // визначаємо дистанцію по осі Y між поточним і попереднім розміщенням курсора
        const angle        = Math.atan2(this.dy, this.dx);
        const a            = Math.PI * 2 / this.maxFrameY;  //кут частинки кола
        // блок зміни фреймів персонажа 
        if     (angle < -a * .5 - a * 2)                   this.frameY = 7;    // вліво-верх
        else if(angle < -a * .5 - a)                       this.frameY = 0;    // верх
        else if(angle < -a * .5)                           this.frameY = 1;    // вправо-верх  
        else if(angle <  a * .5)                           this.frameY = 2;    // вправо
        else if(angle <  a * .5 + a)                       this.frameY = 3;    // вправо-низ
        else if(angle <  a * .5 + a * 2)                   this.frameY = 4;    // низ
        else if(angle <  a * .5 + a * 3)                   this.frameY = 5;    // вліво-вниз
        else if(angle < -a * .5 - a * 3 || a * .5 + a * 3) this.frameY = 6;    // вліво
     
        const distance     = Math.hypot(this.dy, this.dx);  // ;
        if( distance > this.speedModifier){
            this.speedX    = this.dx / distance || 0;       // якщо значення  this.dx / distance = undefined тоді this.speedX  = 0
            this.speedY    = this.dy / distance || 0;
        }else{
            this.speedX    = 0;
            this.speedY    = 0;
        }
        this.x            += this.speedX * this.speedModifier;
        this.y            += this.speedY * this.speedModifier;

        this.playerX       
        // this.x          = this.game.mouse.x;
        // this.y          = this.game.mouse.y;
        
        // умова зіткнення персонажа з першкодами
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
        ctx.drawImage ( this.image, 
                        // параметри кадру, який обераємо
                        this.frameX * this.width, 
                        this.frameY * this.height , 
                        this.width, 
                        this.height , 
                        // параметри кадру, де буде розміщений і які розміри буде мати
                        this.x - this.playerWidth * .5,                                                                // відображаємо зображення в оригінальному вигляді                             
                        this.y - this.playerHeight * .5, 
                        this.playerWidth, 
                        this.playerHeight );
        // малюємо квадрат
       
        ctx.strokeRect (this.x - this.playerWidth * .5,  
                        this.y - this.playerHeight * .5, 
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
        ctx.lineTo      (this.game.input.mouse.x, this.game.input.mouse.y); 
        ctx.stroke      ();   
    }
}