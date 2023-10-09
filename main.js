import data                         from "./constants.js";
import { findGameObject }           from "./constants.js";
import { Background }               from './layer.js';

const canvasMS         = document.getElementById('canvasMS');
const body             = document.body;
const mobilScreen      = window.innerWidth < window.innerHeight;
const fullScreen       = data.game.canvasWidth === window.innerWidth && data.game.canvasHeight === window.innerHeight;


window.addEventListener('load',  function() { 

    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'none';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';
         

    class Game {
        constructor(canvasMS){
            this.data              = data;      
            // ключі для гри 
            const objectConfigs = [
                { array: "players", key: this.playerKey },
                { array: "enemies", key: this.enemyKey },
                { array: "larvas", key: this.larvaKey },
                { array: "eggs", key: this.eggKey },
            ];
            this.playerKey         = 'bull';
            this.enemyKey          = 'toad';
            this.eggKey            = 'egg';
            this.larvaKey          = 'larva';
            this.obstacleKey       = 'obstacle';
          
            this.gameKey           = 'game'
            this.layerKey          = 'layer1';

            this.game              = findGameObject(this.data, this.gameKey);
            this.layer             = findGameObject(this.data, this.layerKey)

            // параметри кмов різних пристроїв
            this.canvas            = canvasMS;
            canvasMS.width         = this.game.canvasWidth;
            canvasMS.height        = this.game.canvasHeight;
            // параметри полотна
            this.width             = canvasMS.width;
            this.height            = canvasMS.height;
            // підключаємо задні фони
            this.background        = new Background(this);
            // параметри масштабування
            this.scaleX            = canvasMS.width / this.layer.width;
            this.scaleY            = canvasMS.height / this.layer.height;
            this.scale             = Math.min(this.scaleX, this.scaleY);
            this.topMargin         = this.game.topMargin * this.scaleY;
            // параметри швидкості відображення кадрів
            this.fps               = this.game.fps;
            this.frameInterval     = this.game.timeInterval / this.fps;
            this.frameTimer        = 0;
          
           
            // параметри яїчок
            // this.eggInterval        = game[4].timeInterval/this.fps;
            this.eggInterval       = 1000;
            this.eggTimer          = 0;
            // параметри ворогів
            // this.enemyInterval      = game[5].timeInterval/this.fps;
            // this.enemyInterval     = 500/this.fps;
            // this.enemyTimer        = 0;
            // параметри всіх обєктів
            this.players           = [];
            this.enemies           = [];
            this.eggs              = [];
            this.larvas            = [];
            this.obstacles         = [];


            this.allGameObjects    = [...this.players, ...this.obstacles, ...this.eggs, ...this.enemies, ...this.larvas];  // створюємо обєкт з усіма елементами які потрібно сортувати
            
            // параметри конструктора
            this.debug             = false;
        }

        resize(width, height){
            // обновлюємо значення полотна
            canvasMS.width   =  width;
            canvasMS.height  =  height;
            // параметри масштабування
            this.scaleX      = canvasMS.width / this.layer.width;
            this.scaleY      = canvasMS.height / this.layer.height;
            this.scale       = Math.min(this.scaleX, this.scaleY);
            // обновлюємо значення парметрів
            this.width       = canvasMS.width; 
            this.height      = canvasMS.height;
            this.topMargin   = this.game.topMargin * this.scaleY;
            // обновлюємо значення модулів
            this.background.reset();
            this.allGameObjects.forEach(gameObject => gameObject.reset());
        };
         
        // =========================== Алгоритм вкл./викл. повноекранного режиму =================================>
        toggleFullscreen() {
            if (!document.fullscreenButton) {
                canvasMS.requestFullscreen().catch(err => {
                    alert("Помилка. Не вдається увімкнути повноекранний режим: " + err.message);
                });
            } else { 
                document.exitFullscreen();
            }
}
     

        // Інформацційне повідомлення кнопки повноекранний режим
        updateButtonSize() {
            const buttonBorderRadius = 20; // Встановлюємо бажане значення для зміщення зверху
            fullscreenButton.style.borderRadius = (buttonBorderRadius * this.scale) + 'px';
            fullscreenButton.style.fontSize = (20 * this.scale) + 'px';
        
        };
        
        checkCollision(a, b){
            const dx           = a.x - b.x; 
            const dy           = a.y - b.y;
            const distance     = Math.hypot(dy, dx);
            const sumOffRadius = a.radius + b.radius;
            return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
        };
       
        addGameObject(array, key, x, y) {
            const Class          = findGameObject(this.data, key).class;
            const gameObject     = new  Class (this, key, x, y);
            if ( gameObject.level.includes(this.game.level) && array.length < gameObject.number){
                array.push(gameObject);
            }; 
        };

        removeGameObject(){
            this.eggs   = this.eggs.filter(obj => !obj.markedForDelition);
            this.larvas = this.larvas.filter(obj => !obj.markedForDelition);
        };
 
        addObstacle(){
            const Class          = findGameObject(this.data, this.obstacleKey).class;
            const distanceBuffer = findGameObject(this.data, this.obstacleKey).distanceBuffer; 
            const number         = findGameObject(this.data, this.obstacleKey).number; 
          
            let attempts = 0;
            // умова щоб при генерації перешкод вони не перекривалися одна з одною
            while (
                   this.obstacles.length < number && 
                   attempts < 500){
               
                        let firstObstacle   = new Class (this, this.obstacleKey);
                        let overlap         = false;
                        this.obstacles.forEach(obstacle => {
                            this.dx             = firstObstacle.x - obstacle.x
                            this.dy             = firstObstacle.y - obstacle.y;
                            this.distance       = Math.hypot(this.dy, this.dx);
                            this.sumOffRadius   = firstObstacle.radius + obstacle.radius + distanceBuffer;
                            if(this.distance < this.sumOffRadius) overlap = true;
                        });
                        if(!overlap)
                        this.obstacles.push(firstObstacle);
              
                ++attempts;
            }
        };

        draw(ctx){
            this.updateButtonSize()
            this.background.backgroundLayers[0].draw(ctx);
          
            this.allGameObjects = [...this.players, ...this.enemies, ...this.eggs, ...this.larvas, ...this.obstacles] || 0;  // створюємо обєкт з усіма елементами які потрібно сортувати
            // console.log(this.allGameObjects)
            this.allGameObjects.sort((a, b) => a.y - b.y);                               // Сортуємо за координатою y (від меншого до більшого)
            this.allGameObjects.forEach(object => object.draw(ctx));
            
            this.background.backgroundLayers[1].draw(ctx);
        };
        
        update(deltaTime) {
            this.allGameObjects.forEach(object => object.update(deltaTime));
        };

        render(ctx, deltaTime){
            // Викликаємо функцію для додавання обєктів
           
           this.addGameObject(this.players, this.playerKey);
           this.addGameObject(this.enemies, this.enemyKey);
           
         
           
           this.addObstacle()
           
           if (this.frameTimer > this.frameInterval) {
               ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
               this.draw(ctx);
               this.update(deltaTime);
               this.frameTimer = 0;
            };
            this.frameTimer += deltaTime;
            
            // інтервал появи яїчок
            if(this.eggTimer > this.eggInterval){
                this.addGameObject(this.eggs,    this.eggKey);
                this.eggTimer = 0;
            }else{
                this.eggTimer += deltaTime;
            };

            // інтервал появи ворогів
            // if(this.enemyTimer > this.enemyInterval && this.enemies.length < this.numberOffEnemies){
            //     this.addEnemy();
            //     this.enemyTimer = 0;
            // }else{
            //     this.enemyTimer += deltaTime;
            // };
        }
    }

    const game = new Game(canvasMS);

    let lastTime = 0 
    function animate (timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.render(ctx, deltaTime);
        requestAnimationFrame(animate)
    }
    animate(0);

});



