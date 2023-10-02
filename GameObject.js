import constants from "./constants.js";

export default class GameObject {
    constructor(game, key) {
        this.game      = game;
        this.key       = key;
        // підключаємо зображення
        this.image     = document.getElementById(`${this.key}`);
        // параметри початкового розміру кадру (frame) зображення 
        this[`${this.key}Width`]  = constants[this.key].width;
        this[`${this.key}Height`] = constants[this.key].height;
        // параметри кінцевого розміру кадру (frame) зображення 
        this.size      = constants[this.key].size;
        this.scaleX    = this.game.scaleX;
        this.scaleY    = this.game.scaleY;
        this.width     = this[`${this.key}Width`] * this.size * this.game.scaleX;
        this.height    = this[`${this.key}Height`] * this.size * this.game.scaleY;
        // параметри початкового розміщення на полотні
        this.scale     = this.game.scale;
        this.radius    = constants[this.key].radius * this.scale;
        this.x         = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y         = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        // параметри кадрів забраження
        this.maxFrameX = constants[this.key].maxFrameX;
        this.maxFrameY = constants[this.key].maxFrameY;
        this.frameX    = Math.floor(Math.random() * this.maxFrameX);
        this.frameY    = Math.floor(Math.random() * this.maxFrameY);
        // Параметри швидкості
        this.speedX    = Math.random() * (constants[this.key].speedXmax - constants[this.key].speedXmin) + constants.enemy.speedXmin; 
        this.speedY    = Math.random() * (constants[this.key].speedYmax - constants[this.key].speedYmin) + constants.enemy.speedYmin; 
    }

    reset() {
        this.width     = this[`${this.key}Width`] * this.size * this.game.scaleX;
        this.height    = this[`${this.key}Height`] * this.size * this.game.scaleY;
        this.radius    = constants[this.key].radius * this.game.scale;
        this.x         = Math.random() * (this.game.width - this.radius * 2) + this.radius;
        this.y         = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
    }

    draw(ctx) {
        // малюємо персонажів
        ctx.drawImage(this.image, 
                      // параметри кадру, який обераємо
                      this.frameX * this[`${this.key}Width`], 
                      this.frameY * this[`${this.key}Height`], 
                      this[`${this.key}Width`], 
                      this[`${this.key}Height`], 
                      // параметри кадру, де буде розміщений і які розміри буде мати
                      this.x - this.width * .5, 
                      this.y - this.height * .8, 
                      this.width, 
                      this.height);

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
    }
}
