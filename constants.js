
const constants = { game:      {
                                    canvasWidth:          window.innerWidth,
                                    canvasHeight:         window.innerHeight,
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
                                    number:               3,
                                    distanceBuffer:       20,
                                    timeInterval:         500,
                    },
  };
  

  export default constants;