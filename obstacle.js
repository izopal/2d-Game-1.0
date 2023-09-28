import constants from "./constants.js";

export default class Obstacle {
    constructor(game){
        this.game   = game;
        // паарметри зображення перешкод
        this.image  = document.getElementById('obstacle');
        // параметри початквого розміру кадру (frame) зображення для перешкод
        this.width          = constants.obstacle.width; 
        this.height         = constants.obstacle.height;
        // параметри кінцевого розміру кадру (frame) зображення для перешкод
        this.size           = constants.obstacle.size;
        this.obstacleWidth  = this.width * this.size;
        this.obstacleHeight = this.height * this.size;
        // параметри початкового розміщення перешкод на полотні
        // this.radius = this.obstacleWidth * .5 * Math.SQRT2;
        this.radius = this.obstacleWidth * .5;
        this.x      = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y      = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        // параметри для зміни кадрів забраження персонажа
        this.maxFrameX         = constants.obstacle.maxFrameX;
        this.maxFrameY         = constants.obstacle.maxFrameY;  
        this.frameX            = Math.floor(Math.random() * this.maxFrameX);
        this.frameY            = Math.floor(Math.random() * this.maxFrameY);  
        
    }
    draw(ctx){
        // малюємо перешкоду
        ctx.drawImage ( this.image, 
                        // параметри кадру, який обераємо
                        this.frameX * this.width, 
                        this.frameY * this.height , 
                        this.width, 
                        this.height , 
                        // параметри кадру, де буде розміщений і які розміри буде мати
                        this.x - this.obstacleWidth * .5,                                                                // відображаємо зображення в оригінальному вигляді                             
                        this.y - this.obstacleHeight * .5, 
                        this.obstacleWidth, 
                        this.obstacleHeight );
        // малюємо коло
        ctx.beginPath   ();
        ctx.arc         (this.x,
                         this.y,
                         this.radius,
                         0,
                         Math.PI * 2);
        ctx.save        ();
            ctx.strokeStyle = 'red';
            ctx.globalAlpha = .4;  
            ctx.fillStyle   = 'white';           
            ctx.fill    ();
        ctx.restore     (); 
        ctx.stroke      ();
         // малюємо квадрат
       
        ctx.strokeStyle = 'blue';
        ctx.strokeRect (this.x - this.obstacleWidth * .5,  
                        this.y - this.obstacleHeight * .5, 
                        this.obstacleWidth, 
                        this.obstacleHeight); 
        ctx.stroke      ();
    }
   

}