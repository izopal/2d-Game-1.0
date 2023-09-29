import constants    from './constants.js';

export default class Egg {
    constructor(game){
        this.game           = game;
        // паарметри зображення перешкод
        this.image          = document.getElementById('egg');
        // параметри початкового розміру кадру (frame) зображення 
        this.width          = constants.egg.width; 
        this.height         = constants.egg.height;
        // параметри кінцевого розміру кадру (frame) зображення 
        this.size           = constants.egg.size;
        this.eggWidth       = this.width * this.size;
        this.eggHeight      = this.height * this.size;
        // параметри початкового розміщення на полотні
        this.radius         = constants.egg.radius;
        this.x              = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y              = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        // параметри для зміни кадрів забраження персонажа
        this.maxFrameX      = constants.egg.maxFrameX;
        this.maxFrameY      = constants.egg.maxFrameY;  
        this.frameX         = Math.floor(Math.random() * this.maxFrameX);
        this.frameY         = Math.floor(Math.random() * this.maxFrameY);  
    };
    redet(){
    };
    draw(ctx){
        // малюємо картинку з перонажем
        ctx.drawImage ( this.image, 
                        // параметри кадру, який обераємо
                        this.frameX * this.width, 
                        this.frameY * this.height , 
                        this.width, 
                        this.height , 
                        // параметри кадру, де буде розміщений і які розміри буде мати
                        this.x - this.eggWidth * .5,                                                                // відображаємо зображення в оригінальному вигляді                             
                        this.y - this.eggHeight * .8, 
                        this.eggWidth, 
                        this.eggHeight );

        if(this.game.debug){
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
            ctx.strokeRect (this.x - this.eggWidth * .5,  
                            this.y - this.eggHeight * .8, 
                            this.eggWidth, 
                            this.eggHeight); 
            ctx.stroke      ();
        };
    };
}