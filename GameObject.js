import constants from "./constants.js";

export default class GameObject {
    constructor(game, key) {
        this.game         = game;
        // початкові параметри 
        this.key                        = `${key}`.split('.');
        this.level                      = constants[this.key[0]][this.key[1]].level;
        this.number                     = constants[this.key[0]][this.key[1]].number;
        // підключаємо зображення
        // this.image                      = new Image;
        // this.image.src                  = `./image/${this.key[1]}.png`;
        // console.log(this.image.src)


        
        this.image        = document.getElementById(`${this.key[1]}`);
        // параметри початкового розміру кадру (frame) зображення 
        this[`${this.key[1]}Width`]  = constants[this.key[0]][this.key[1]].width;
        this[`${this.key[1]}Height`] = constants[this.key[0]][this.key[1]].height;
        // параметри кінцевого розміру кадру (frame) зображення 
        this.size         = constants[this.key[0]][this.key[1]].size;
        this.scaleX       = this.game.scaleX;
        this.scaleY       = this.game.scaleY;
        this.width        = this[`${this.key[1]}Width`] * this.size * this.game.scaleX;
        this.height       = this[`${this.key[1]}Height`] * this.size * this.game.scaleY;
        // параметри початкового розміщення на полотні
        this.scale        = this.game.scale;
        this.radius       = constants[this.key[0]][this.key[1]].radius * this.scale;
        this.x            = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y            = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        // параметри регулювання руху швидкості персонажа і мишки
        this.speedX        = constants[this.key[0]][this.key[1]].speedX;
        this.speedY        = constants[this.key[0]][this.key[1]].speedY;
        this.speedModifier = constants[this.key[0]][this.key[1]].speedModifier * this.scale;
        this.dx            = constants[this.key[0]][this.key[1]].dx;
        this.dy            = constants[this.key[0]][this.key[1]].dy;
        // параметри кадрів забраження
        this.maxFrameX    = constants[this.key[0]][this.key[1]].maxFrameX;
        this.maxFrameY    = constants[this.key[0]][this.key[1]].maxFrameY;
        this.frameX       = Math.floor(Math.random() * this.maxFrameX);
        this.frameY       = Math.floor(Math.random() * this.maxFrameY);
        // Параметри швидкості
        this.speedX       = Math.random() * (constants[this.key[0]][this.key[1]].speedXmax - constants[this.key[0]][this.key[1]].speedXmin) + constants[this.key[0]][this.key[1]].speedXmin; 
        this.speedY       = Math.random() * (constants[this.key[0]][this.key[1]].speedYmax - constants[this.key[0]][this.key[1]].speedYmin) + constants[this.key[0]][this.key[1]].speedYmin; 
        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
        this.borderX      = constants[this.key[0]][this.key[1]].borderX;
        this.borderY      = constants[this.key[0]][this.key[1]].borderY;
        // параметри відзеркалення персонажа
        this.isFacingLeft = constants[this.key[0]][this.key[1]].isFacingLeft; 
    };

    reset() {
        this.width     = this[`${this.key[1]}Width`] * this.size * this.game.scaleX;
        this.height    = this[`${this.key[1]}Height`] * this.size * this.game.scaleY;
        this.radius    = constants[this.key[0]][this.key[1]].radius * this.game.scale;
        this.x         = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y         = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
    };

    draw(ctx) {
        // малюємо персонажів
        if(this.isFacingLeft){
            ctx.drawImage( this.image, 
                           // параметри кадру, який обераємо
                           this.frameX * this[`${this.key[1]}Width`], 
                           this.frameY * this[`${this.key[1]}Height`], 
                           this[`${this.key[1]}Width`], 
                           this[`${this.key[1]}Height`], 
                           // параметри кадру, де буде розміщений і які розміри буде мати
                           this.x - this.width * .5, 
                           this.y - this.height * .8, 
                           this.width, 
                           this.height );
        } else {
            ctx.save      ();
            ctx.scale     (-1, 1);
            ctx.drawImage ( this.image, 
                            // параметри кадру, який обераємо
                            this.frameX * this[`${this.key[1]}Width`], 
                            this.frameY * this[`${this.key[1]}Height`], 
                            this[`${this.key[1]}Width`], 
                            this[`${this.key[1]}Height`], 
                            // параметри кадру, де буде розміщений і які розміри буде мати
                            -(this.x - this.width * .5) - this.width,          // відображаємо зображення в дезркальному вигляді по осі X
                            this.y - this.height * .8,
                            this.width, 
                            this.height );
            ctx.restore    ();
        }
       

        if (this.game.debug) {
            // малюємо коло
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.globalAlpha = .4;  
            ctx.fillStyle = 'white';           
            ctx.fill();
            ctx.restore(); 
            ctx.stroke();
            // малюємо квадрат
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x - this.width * .5, 
                           this.y - this.height * .8, 
                           this.width, 
                           this.height); 
            ctx.stroke();
        }
    };

    update(){
        // блок зіткнення з границями екрану
        if     (this.x < 0 + this.width * this.borderX)                  this.x = this.width * this.borderX;
        else if(this.x > this.game.width - this.width * this.borderX)    this.x = this.game.width - this.width * this.borderX;
        if     (this.y < this.game.topMargin)                            this.y = this.game.topMargin;
        else if(this.y > this.game.height - this.height * this.borderY ) this.y = this.game.height -  this.height * this.borderY  ; 
     }
}
