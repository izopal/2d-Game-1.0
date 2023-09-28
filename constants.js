
const constants = { canvas:     {
                                    canvasWidth:          window.innerWidth,
                                    canvasHeight:         window.innerHeight,
                                    topMargin:            240,
                    }, 
                    
                    player:     {
                                    radius:               30,
                                    speedModifier:        30,           
                    },

                    obstacle:   {
                                    width:                250,
                                    height:               250,
                                    size:                 .5,
                                    maxFrameX:            4, 
                                    maxFrameY:            3,
                                    numberOffObstacles:   5,
                                    distanceBuffer:       100, 
                    },
  };
  
  export default constants;