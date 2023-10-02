
const constants = { game:      {
                                    canvasWidth:          window.innerWidth,
                                    canvasHeight:         window.innerHeight,
                                    // canvasWidth:          400,
                                    // canvasHeight:         400,
                                    topMargin:            260,
                                    fps:                  100,
                                    timeInterval:         1000,
                    }, 
                    layer:      {
                                    width:                1280,
                                    height:               720,
                        
                    }, 
                    
                    player:     {   width:                5900 / 59,
                                    height:               800 / 8,
                                    size:                 2,
                                    maxFrameX:            59, 
                                    maxFrameY:            8,
                                    radius:               40,
                                    
                                    speedModifier:        20,
                    },

                    obstacle:   {
                                    width:                1000 / 4,
                                    height:               750 / 3,
                                    size:                 .75,
                                    maxFrameX:            4, 
                                    maxFrameY:            3,
                                    radius:               40,
                                    speedX:               0, 
                                    speedY:               0, 
                                    dx:                   0, 
                                    dy:                   0,

                                    number:               5,
                                    distanceBuffer:       100, 
                    },
                    egg:        {
                                    width:                110,
                                    height:               135,
                                    size:                 .75,
                                    maxFrameX:            1, 
                                    maxFrameY:            1,
                                    radius:               20,

                                    number:               10,
                                    distanceBuffer:       20,
                                    timeInterval:         500,
                    },
                    enemy:        {
                                    width:                140 / 1,
                                    height:               1040 / 4,
                                    size:                 .75,
                                    maxFrameX:            1, 
                                    maxFrameY:            1,
                                    radius:               20,

                                    number:               10,
                                    distanceBuffer:       20,
                                    timeInterval:         500,
                                    speedXmax:            3.5, 
                                    speedXmin:            .5, 
                                    speedYmin:            0, 
                                    speedYmax:            0, 
        },
  };
console.log(constants)  

  export default constants;