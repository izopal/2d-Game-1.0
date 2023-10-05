import constants                    from "./constants.js";
import { findKey }                  from "./constants.js";
import { Background }               from './layer.js';
import Obstacle                     from './obstacle.js';
import Player                       from './player.js';
import Egg                          from './egg.js';
import Enemy                        from './enemy.js';
import GameObject from "./GameObject.js";



window.addEventListener('load',  function() { 
    const canvasMS         = document.getElementById('canvasMS');
    const body             = document.body;
    const mobilScreen      = window.innerWidth < window.innerHeight;
    const fullScreen       = constants.game.canvasWidth === window.innerWidth && constants.game.canvasHeight === window.innerHeight;

    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'none';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';
    

    // Проходимося по ключам обєкта constants та створюємо <img> елементи тільки для тих які мають ключ image: true
    // for (const key in constants) {
    //     if (constants[key].image === true) {
    //         const img = document.createElement('img');
    //         img.id    = key;
    //         img.src   = `./images/${key}.png`;
    //         img.alt   = '';

    //         body.appendChild(img);                 // Додаємо створений <img> елемент до <body>
    //     }
    // }

    class Game {
        constructor(canvasMS, constants){
            // перетворюємо обєкт constants в масив
            this.data              = constants;
            this.constants         = Object.values(constants);
            // параметри кмов різних пристроїв
            this.canvas            = canvasMS;
            canvasMS.width         = constants.game.canvasWidth;
            canvasMS.height        = constants.game.canvasHeight;
            // параметри масштабування
            this.scaleX            = canvasMS.width / constants.background.layer1.width;
            this.scaleY            = canvasMS.height / constants.background.layer1.height;
            this.scale             = Math.min(this.scaleX, this.scaleY);
            // параметри полотна
            this.width              = canvasMS.width;
            this.height             = canvasMS.height;
            this.topMargin          = constants.game.topMargin * this.scaleY;
            // параметри швидкості відображення кадрів
            this.fps                = constants.game.fps;
            this.frameInterval      = constants.game.timeInterval / this.fps;
            this.frameTimer         = 0;
            // підключаємо задні фони
            this.background         = new Background(this);
            // підключаємо модуль персонажа
            this.players           = [];
            // параметри першкод
            this.numberOffObstacles = 10;
            this.distanceBuffer     = 100;     //параметр буферної зони(мінімальна відстань між перешкодами) між перешкодами
            this.obstacles          = [];
            // параметри яїчок
            this.eggInterval        = this.constants[4].timeInterval/this.fps;
            this.eggTimer           = 0;
            this.eggs               = [];
            // параметри ворогів
            this.enemyInterval      = this.constants[5].timeInterval/this.fps;
            this.enemyTimer         = 0;
            this.enemies            = []; 
            // параметри всіх обєктів
            this.allGameObjects = [...this.players, ...this.obstacles, ...this.eggs, ...this.enemies];  // створюємо обєкт з усіма елементами які потрібно сортувати
            // параметри конструктора
            this.debug              = false;
        }

        resize(width, height){
            // обновлюємо значення полотна
            canvasMS.width   =  width;
            canvasMS.height  =  height;
            // параметри масштабування
            this.scaleX            = canvasMS.width / constants.background.layer1.width;
            this.scaleY            = canvasMS.height / constants.background.layer1.height;
            this.scale       = Math.min(this.scaleX, this.scaleY);
            // обновлюємо значення парметрів
            this.width       = canvasMS.width; 
            this.height      = canvasMS.height;
            this.topMargin   = constants.game.topMargin * this.scaleY;
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

       
        



        addPlayer(){
            const playerKey1 = "";
            const playerKey2 = "bull";
            const playerPath = findKey(constants, playerKey1, playerKey2, "");
            this.player      = new Player(this, `${playerPath}`);
            if(this.player.level.includes(constants.game.level) &&
            this.players.length < this.player.number) 
            this.players.push(this.player);

          
        };  
        addEnemy(){
            const enemyKey1 = "";
            const enemyKey2 = "toad";
            const enemyPath = findKey(constants, enemyKey1, enemyKey2, "");
            this.enemy      = new Enemy (this, `${enemyPath}`);
            if(this.enemy.level.includes(constants.game.level) &&
            this.enemies.length < this.enemy.number) 
            this.enemies.push(this.enemy);
        }
        addEgg(){
            const eggKey1 = "";
            const eggKey2 = "egg";
            const eggPath = findKey(constants, eggKey1, eggKey2, "");
            this.egg      = new Egg (this, `${eggPath}`);
            if(this.egg.level.includes(constants.game.level) &&
                this.eggs.length < this.egg.number) 
                this.eggs.push(this.egg); 
        };
        // addObstacle(){
        //     const obstacleKey1 = "";
        //     const obstacleKey2 = "obstacle";
        //     const obstaclePath = findKey(constants, obstacleKey1, obstacleKey2, "");
        //     console.log(obstaclePath)
        //     this.obstacle      = new Obstacle (this, `${obstaclePath}`);
        //     if(this.obstacle.level.includes(constants.game.level) &&
        //         this.obstacles.length < this.obstacle.number) 
        //         this.obstacles.push(this.obstacle); 
        // };



        init(){
            // умова щоб при генерації перешкод вони не перекривалися одна з одною
            // const obstacleKey = this.addKey("obstacle")
            const obstacleKey1 = "";
            const obstacleKey2 = "obstacle";
            const obstaclePath = findKey(constants, obstacleKey1, obstacleKey2, "");
    
            let attempts = 0;
          
            while (
                   this.obstacles.length < this.numberOffObstacles       && 
                   attempts < 500){
               
                        let firstObstacle   = new Obstacle (this, `${obstaclePath}`);
                        console.log(firstObstacle)
                        let overlap         = false;
                        this.obstacles.forEach(obstacle => {
                            this.dx             = firstObstacle.x - obstacle.x
                            this.dy             = firstObstacle.y - obstacle.y;
                            this.distance       = Math.hypot(this.dy, this.dx);
                            this.sumOffRadius   = firstObstacle.radius + obstacle.radius + this.distanceBuffer;
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
        
        }
        update(){
            this.allGameObjects.forEach(object => object.update());
        }
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
                // this.addObstacle()

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

    const game = new Game(canvasMS, constants);
    game.init();
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