import { findGameObject }           from "./constants.js";

export default class GameObject {
    constructor(game, key) {
        this.game                        = game;
        // початкові параметри 
        this.gameObject                  = findGameObject(this.game.data, key);
        this.objectName                  = this.gameObject.name;
        this.level                       = this.gameObject.level;
        this.number                      = this.gameObject.number;
        // підключаємо зображення
        this.image                       = new Image;
        this.image.src                   = `images/${this.objectName}.png`;
        // параметри початкового розміру кадру (frame) зображення 
        this[`${this.objectName}Width`]  = this.gameObject.width;
        this[`${this.objectName}Height`] = this.gameObject.height;
        // параметри кінцевого розміру кадру (frame) зображення 
        this.size              = this.gameObject.size;
        this.scaleX            = this.game.scaleX;
        this.scaleY            = this.game.scaleY;
        this.width             = this[`${this.objectName}Width`] * this.size * this.game.scaleX;
        this.height            = this[`${this.objectName}Height`] * this.size * this.game.scaleY;
        // параметри початкового розміщення на полотні
        this.scale             = this.game.scale;
        this.radius            = this.gameObject.radius * this.scale;
        this.x                 = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y                 = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        // параметри кадрів забраження
        this.maxFrameX         = this.gameObject.maxFrameX;
        this.maxFrameY         = this.gameObject.maxFrameY;
        this.frameX            = Math.floor(Math.random() * this.maxFrameX);
        this.frameY            = Math.floor(Math.random() * this.maxFrameY);
        // Параметри швидкості
        this.speedModifier     = this.gameObject.speedModifier * this.scale;
        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
        this.borderX           = this.gameObject.borderX;
        this.borderY           = this.gameObject.borderY;
        // параметр відзеркалення персонажа
        this.isFacingLeft      = this.gameObject.isFacingLeft;
        // параметр навидалення 
        this.markedForDelition = this.gameObject.markedForDelition;  
        // параметри часу появи обєкту
        this.timer             = this.gameObject.timer    || 0;
        this.interval          = this.gameObject.interval || 0;
    };
    
    // функція для отримання обєкту за вказаними ключем
    getGameObject(constants, keyArray) {
        let value = constants;
        for (const key of keyArray) {
            value = value[key];
        }
        return value;
    };

    reset() {
        this.width     = this[`${this.objectName}Width`] * this.size * this.game.scaleX;
        this.height    = this[`${this.objectName}Height`] * this.size * this.game.scaleY;
        this.radius    = this.gameObject.radius * this.game.scale;
        this.x         = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y         = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
    };

    draw(ctx) {
        // параметри дотику
        this.colisionX         = this.x - this.width * .5;
        this.colisionY         = this.y - this.height * .8;
        // малюємо персонажів
        if(this.isFacingLeft){
            ctx.drawImage( this.image, 
                           // параметри кадру, який обераємо
                           this.frameX * this[`${this.objectName}Width`], 
                           this.frameY * this[`${this.objectName}Height`], 
                           this[`${this.objectName}Width`], 
                           this[`${this.objectName}Height`], 
                           // параметри кадру, де буде розміщений і які розміри буде мати
                           this.colisionX, 
                           this.colisionY, 
                           this.width, 
                           this.height );
        } else {
            ctx.save      ();
            ctx.scale     (-1, 1);
            ctx.drawImage ( this.image, 
                            // параметри кадру, який обераємо
                            this.frameX * this[`${this.objectName}Width`], 
                            this.frameY * this[`${this.objectName}Height`], 
                            this[`${this.objectName}Width`], 
                            this[`${this.objectName}Height`], 
                            // параметри кадру, де буде розміщений і які розміри буде мати
                            -this.colisionX - this.width,          // відображаємо зображення в дезркальному вигляді по осі X
                            this.colisionY,
                            this.width, 
                            this.height );
            ctx.restore    ();
        }
       

        if (this.game.debug) {
            // малюємо коло
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.save();
            ctx.globalAlpha = .4;  
            ctx.fillStyle = 'white';           
            ctx.fill();
            ctx.restore(); 
            // малюємо квадрат
            ctx.strokeRect(this.colisionX, 
                           this.colisionY, 
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
    };
}
