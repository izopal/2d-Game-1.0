import Obstacle                     from './obstacle.js';
import Player                       from './player.js';
import Egg                          from './egg.js';
import Enemy                        from './enemy.js';
import Larva                        from './larva.js';

const data =      { game:     { name:                 'game',
                                level:                1,
                                levelDifficulty:      1,
                                maxLevel:             20,

                                score:                100,
                                scoreLoss:            50,
                                scoreWin:             150,

                                gameOver:             false,  
                                isPaused:             false,
                                debug:                false,

                                canvasHeight:         window.innerHeight,
                                canvasWidth:          window.innerWidth,
                                topMargin:            260,

                                fps:                  100,
                                timeInterval:         1000},

// =============================================================================================>
                    background: { layer1:{ width:   1280,
                                           height:  720,
                                           level:   [1], 
                                           forest:  {name:   'forest',
                                                     image:  true,
                                                     level:  [1],
                                                     width:  1280,
                                                     height: 720 },
                                           overlay: {name:   'overlay',
                                                     image:  true,
                                                     level:  [1,2],
                                                     width:  1280,
                                                     height: 720 },
                                  },
                    }, 

// =============================================================================================>
                    player:    { bull: { name:                 'bull',
                                         class:                Player,
                                         image:                true,
                                         isFacingLeft:         true,
                                         markedForDelition:    false,     
                                         level:                [1, 3, 4, 5, 6], // Масив можливих значень level  
                                         number:               1,
                                         
                                         width:                5900 / 59,
                                         height:               800 / 8,
                                         size:                 2,
                                         maxFrameX:            59, 
                                         maxFrameY:            8,
                                         radius:               40,

                                         speedModifier:        20,
                                         // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
                                         borderX:              .25,
                                         borderY:              .2},
                    },

// =============================================================================================>
                    obstacle:  { obstacle: {name:                 'obstacle',
                                            class:                Obstacle,
                                            image:                true,
                                            isFacingLeft:         false,
                                            level:                [1, 3],
                                            number:               5,

                                            width:                1000 / 4,
                                            height:               750 / 3,
                                            size:                 .675,
                                            maxFrameX:            4, 
                                            maxFrameY:            3,
                                            radius:               40,

                                            distanceBuffer:       200},
                    },
                    
// =============================================================================================>
                      enemy:  { toad:  {name:                 'toads',
                                        class:                Enemy,
                                        image:                true,
                                        isFacingLeft:         true,
                                        markedForDelition:    false,
                                        level:                [1, 3, 8], // Масив можливих значень level  
                                        number:               5,

                                        width:                140 / 1,
                                        height:               1040 / 4,
                                        size:                 .65,
                                        maxFrameX:            1, 
                                        maxFrameY:            4,
                                        radius:               30,

                                        speedXmax:            6.5, 
                                        speedXmin:            2.5, 
                                        speedYmin:            0, 
                                        speedYmax:            0,

                                        timer:                0,
                                        interval:             500,
                                        
                                        friction:             .88,
                                        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
                                        borderX:              .5,
                                        borderY:              .2},

                                larva: {name:                 'larva',
                                        class:                Larva,
                                        image:                true,
                                        isFacingLeft:         true,
                                        markedForDelition:    false,
                                        level:                [1, 3, 8], // Масив можливих значень level  
                                        number:               10,

                                        
                                        width:                150 / 1,
                                        height:               300 / 2,
                                        size:                 .25,
                                        maxFrameX:            1, 
                                        maxFrameY:            2,
                                        radius:               30,

                                        speedXmax:            7.5, 
                                        speedXmin:            -7.5, 
                                        speedYmax:            8,
                                        speedYmin:            -2, 

                                        distanceBuffer:       250},
                      },

// =============================================================================================>
                      bonus:  {egg:     {name:                 'egg',
                                        class:                Egg,
                                        image:                true,
                                        isFacingLeft:         true,
                                        markedForDelition:    false,
                                        level:                [1, 4], // Масив можливих значень level  
                                        number:               5,
                                        
                                        width:                110,
                                        height:               135,
                                        size:                 .5,
                                        maxFrameX:            1, 
                                        maxFrameY:            1,
                                        radius:               20,

                                        timer:                0,
                                        interval:             1000,
                                        hatchInterval:        10000,

                                        distanceBuffer:       20,
                                        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
                                        borderX:              .5,
                                        borderY:              .2},
                      },
};
export default data;

// Функція пошуку  значення обєкта за вказаним ключем
export  function findGameObject(obj, targetKey) {
  let stack     = [obj] ;
 
  while (stack.length > 0) {
    let value = stack.pop();                                             // отримуємо  послідній елемент в масиві
    for (const key in value) {
     
      if (key === targetKey){
          const result = findGameObject(value[key], targetKey);
          if (result) return result;
          return value[key];               
      };

      if (typeof value[key] === 'object') stack.push(value[key]);        // якщо даний ключ обєкт ми його додаємо до нашого масиву
    }
  }
  return null;
}