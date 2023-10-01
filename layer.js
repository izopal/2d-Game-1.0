import constants    from './constants.js';

class Layer {
    constructor(image, width, height){
        // підключення зображення заднього фону 
        this.image         = image;
        // параметри початквого розміру зображення заднього фону 
        this.width         = width;
        this.height        = height;
        // параметри початкового розміщення на полотні
        this.x             = 0;
        this.y             = 0;
    }   
    reset(width, height){
        this.width         = width;
        this.height        = height;
    }
    draw(ctx){
        ctx.drawImage(this.image, 
                      this.x,
                      this.y,
                      this.width,
                      this.height);
    }
}


export class Background { 
    constructor(game){
        this.game               = game;
        // підключаємо задній фон вигляд - ЛІС
        this.Image1             = document.getElementById('background');
        this.Image2             = document.getElementById('overlay')
        // параметри початквого розміру зображення для заднього фону
        this.layerWidth         = this.game.width;
        this.layerHeight        = this.game.height;
        console.log(this.layerWidth)
        // підключаємо class Layer з його параметрами  і функціями
        this.layer1             = new Layer (this.Image1, this.layerWidth, this.layerHeight);
        this.layer2             = new Layer (this.Image2, this.layerWidth, this.layerHeight);
        // поміщаємо шари заднього фону до обєкту this.backgroundLayers
        this.backgroundLayers   = [this.layer1, this.layer2];
    }  
    
    reset(){
        // знаходимо в нашому масиві шар і запускаємо функцію reset() даного шару
        this.backgroundLayers.forEach(layer => layer.reset(this.game.width, this.game.height)); 
    }

    draw(ctx){
        // знаходимо в нашому масиві шар і запускаємо функцію draw(ctx) даного шару
        this.backgroundLayers.forEach(layer => layer.draw(ctx)); 
    }
}

 