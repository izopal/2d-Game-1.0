import constants    from './constants.js';

export default class Player {
    constructor(game){
        this.game          = game;
        // пареметри розмізення персонажа
        // параметри розміщення і розмірів тіні персонажа
        this.radius        = constants.player.radius;
        this.x             = this.game.width * .5;
        this.y             = this.game.height * .5;
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