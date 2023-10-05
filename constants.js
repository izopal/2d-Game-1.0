
const constants = { game:     { name:                 'game',
                                level:                1,
                                maxLevel:             20,
                                canvasWidth:          window.innerWidth,
                                canvasHeight:         window.innerHeight,
                                
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
                                           overlay: {name:   overlay,
                                                     image:  true,
                                                     level:  [1],
                                                     width:  1280,
                                                     height: 720 },
                                  },
                    }, 

// =============================================================================================>
                    player:    { bull: { name:               'bull',
                                         image:                true,
                                         isFacingLeft:         true,
                                         level:                [1, 2, 3, 4, 5, 6], // Масив можливих значень level  
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
                    obstacle:  { obstacle: {name:                 'grass',
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

                                            speedX:               0, 
                                            speedY:               0, 
                                            dx:                   0, 
                                            dy:                   0,

                                            distanceBuffer:       100},
                    },
                    
// =============================================================================================>
                      enemy:  { toad:  {name:                 'toad',
                                        image:                true,
                                        isFacingLeft:         true,
                                        level:                [1, 3, 8], // Масив можливих значень level  
                                        number:               5,

                                        width:                140 / 1,
                                        height:               1040 / 4,
                                        size:                 .65,
                                        maxFrameX:            1, 
                                        maxFrameY:            1,
                                        radius:               30,

                                        speedXmax:            3.5, 
                                        speedXmin:            .5, 
                                        speedYmin:            0, 
                                        speedYmax:            0,

                                        distanceBuffer:       20,
                                        timeInterval:         5000,
                                        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
                                        borderX:              .5,
                                        borderY:              .2},
                      },

// =============================================================================================>
                      bonus:  {egg:     {name:                 'egg',
                                        image:                true,
                                        isFacingLeft:         true,
                                        level:                [1, 2, 4], // Масив можливих значень level  
                                        number:               10,
                                        
                                        width:                110,
                                        height:               135,
                                        size:                 .5,
                                        maxFrameX:            1, 
                                        maxFrameY:            1,
                                        radius:               20,

                                        distanceBuffer:       20,
                                        timeInterval:         500,
                                        // Параметри коригування щоб персонаж не вийшов за межі грального поля. 
                                        borderX:              .5,
                                        borderY:              .2 },
                      },
};
export default constants;


// Функція пошуку шляху до обєкта за вказаним ключем
const targetKey1 ='';
const targetKey2 = 'bull'

export  function findKey(constants, targetKey1, targetKey2, namePath) {
          targetKey1 = targetKey1 || targetKey2;
          const stack = [{ obj: constants, path: namePath }];
          const targetKey = `${targetKey2}`;

          while (stack.length > 0) {
            const { obj, path } = stack.pop();                           // отримуємо  послідній елемент в масиві
            for (const key in obj) {
              const currentPath = (path) ? `${path}.${key}` : key;
            
              if (key === targetKey1){
                  const result = findKey(obj[key], targetKey, targetKey, currentPath);
                  if (result) return result;
                  return currentPath;               
              };

              if (typeof obj[key] === 'object') stack.push({ obj: obj[key], path: currentPath });        // якщо даний ключ обєкт ми його додаємо до нашого масиву
            }
          }
          return null;
        }
          
        const foundPath = findKey(constants, targetKey1, targetKey2, '');
        console.log(foundPath)

    
