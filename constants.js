
const constants = { canvas:     {
                                    canvasWidth:          window.innerWidth,
                                    canvasHeight:         window.innerHeight,
                                    topMargin:            240,
                    }, 
                    
                    player:     {   width:                5900 / 59,
                                    height:               800 / 8,
                                    size:                 2,
                                    maxFrameX:            59, 
                                    maxFrameY:            8,
                                    radius:               60,
                                    speedModifier:        30,           
                    },

                    obstacle:   {
                                    width:                1000 / 4,
                                    height:               750 / 3,
                                    size:                 .5,
                                    maxFrameX:            4, 
                                    maxFrameY:            3,
                                    numberOffObstacles:   5,
                                    distanceBuffer:       100, 
                    },
  };
  
  export default constants;