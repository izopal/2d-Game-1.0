import data                         from "./constants.js";
import { findGameObject }           from "./constants.js";
import { Background }               from './layer.js';
import Obstacle                     from './obstacle.js';
import Player                       from './player.js';
import Egg                          from './egg.js';
import Enemy                        from './enemy.js';


window.addEventListener('load',  function() { 
    const canvasMS         = document.getElementById('canvasMS');
    const body             = document.body;
    const mobilScreen      = window.innerWidth < window.innerHeight;
    const fullScreen       = data.game.canvasWidth === window.innerWidth && data.game.canvasHeight === window.innerHeight;

    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'none';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';

    class Game {
        constructor(canvasMS){
            this.data              = data;      
            // ключі для гри 
            this.gameKey           = 'game';
            this.playerKey         = 'bull';
            this.enemyKey          = 'toad';
            this.eggKey            = 'egg';
            this.obstacleKey       = 'obstacle';
            this.layer             = 'layer1';
            this.constants         = findGameObject(this.data, this.gameKey);
            // параметри кмов різних пристроїв
            this.canvas            = canvasMS;
            canvasMS.width         = this.constants.canvasWidth;
            canvasMS.height        = this.constants.canvasHeight;
            // параметри полотна
            this.width             = canvasMS.width;
            this.height            = canvasMS.height;
            // підключаємо задні фони
            this.background        = new Background(this);
            // параметри масштабування
            this.scaleX            = canvasMS.width / findGameObject(this.data, this.layer).width;
            this.scaleY            = canvasMS.height / findGameObject(this.data, this.layer).height;
            this.scale             = Math.min(this.scaleX, this.scaleY);
            this.topMargin         = this.constants.topMargin * this.scaleY;
            // параметри швидкості відображення кадрів
            this.fps               = this.constants.fps;
            this.frameInterval     = this.constants.timeInterval / this.fps;
            this.frameTimer        = 0;
            // параметри першкод
            this.players           = [];
            this.obstacles         = [];
            this.eggs              = [];
            this.enemies           = []; 
            // параметри яїчок
            // this.eggInterval        = constants[4].timeInterval/this.fps;
            // this.eggInterval       = 1000/this.fps;
            // this.eggTimer          = 0;
            // параметри ворогів
            // this.enemyInterval      = constants[5].timeInterval/this.fps;
            // this.enemyInterval     = 500/this.fps;
            // this.enemyTimer        = 0;
            // параметри всіх обєктів
            this.allGameObjects    = [...this.players, ...this.obstacles, ...this.eggs, ...this.enemies];  // створюємо обєкт з усіма елементами які потрібно сортувати
            // параметри конструктора
            this.debug             = false;
        }

        resize(width, height){
            // обновлюємо значення полотна
            canvasMS.width   =  width;
            canvasMS.height  =  height;
            // параметри масштабування
            this.scaleX      = canvasMS.width / findGameObject(this.data, this.layer).width;
            this.scaleY      = canvasMS.height / findGameObject(this.data, this.layer).height;
            this.scale       = Math.min(this.scaleX, this.scaleY);
            // обновлюємо значення парметрів
            this.width       = canvasMS.width; 
            this.height      = canvasMS.height;
            this.topMargin   = this.constants.topMargin * this.scaleY;
            // обновлюємо значення модулів
            this.background.reset();
            this.allGameObjects.forEach(gameObject => gameObject.reset())
        };

        
        checkCollision(a, b){
            const dx           = a.x - b.x; 
            const dy           = a.y - b.y;
            const distance     = Math.hypot(dy, dx);
            const sumOffRadius = a.radius + b.radius;
            return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
        };

        addGameObject(Class, array, key) {
            const gameObject = new Class (this, key);
            if (gameObject.level.includes(this.constants.level) && array.length < gameObject.number)
            array.push(gameObject);
        }
        // Викликаємо функцію для додавання обєктів
        addPlayer() {this.addGameObject(Player, this.players, this.playerKey)};
        addEnemy()  {this.addGameObject(Enemy,  this.enemies, this.enemyKey)};
        addEgg()    {this.addGameObject(Egg,    this.eggs,    this.eggKey)};
       
        addObstacle(){
            this.obstacle      = new Obstacle (this, this.obstacleKey);
            let attempts = 0;
            // умова щоб при генерації перешкод вони не перекривалися одна з одною
            while (
                   this.obstacles.length < this.obstacle.number && 
                   attempts < 500){
               
                        let firstObstacle   = new Obstacle (this, this.obstacleKey);
                        let overlap         = false;
                        this.obstacles.forEach(obstacle => {
                            this.dx             = firstObstacle.x - obstacle.x
                            this.dy             = firstObstacle.y - obstacle.y;
                            this.distance       = Math.hypot(this.dy, this.dx);
                            this.sumOffRadius   = firstObstacle.radius + obstacle.radius + this.obstacle.distanceBuffer;
                            if(this.distance < this.sumOffRadius) overlap = true;
                        });
                        if(!overlap)
                        this.obstacles.push(firstObstacle);
              
                ++attempts;
            }
        }

        draw(ctx){
            this.background.backgroundLayers[0].draw(ctx);
           
            this.allGameObjects = [...this.players, ...this.obstacles, ...this.eggs, ...this.enemies] || 0;  // створюємо обєкт з усіма елементами які потрібно сортувати
            this.allGameObjects.sort((a, b) => a.y - b.y);                               // Сортуємо за координатою y (від меншого до більшого)
            this.allGameObjects.forEach(object => object.draw(ctx));
            
            this.background.backgroundLayers[1].draw(ctx);
        
        };
        
        update(){
            this.allGameObjects.forEach(object => object.update());
        };

        render(ctx, deltaTime, constants){
            if (this.frameTimer > this.frameInterval) {
                ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
                this.draw(ctx);
                this.update(constants);
                this.frameTimer = 0;
            };
            this.frameTimer += deltaTime;

            this.addPlayer()
            this.addEgg();
            this.addEnemy();
            this.addObstacle()

            // інтервал появи яїчок
            // if(this.eggTimer > this.eggInterval ){
               
            // }else{
            //     this.eggTimer += deltaTime;
            // };
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
    // console.log(game);

    let lastTime = 0 
    function animate (timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.render(ctx, deltaTime);
        requestAnimationFrame(animate)
    }
    animate(0);

});