(function($) {

  $.fn.orbit = function(method) {
    
    return this.each(function() {
        
        var EXPLODE_SIZE = 30;
        if ($(this).attr("data-explode-distance"))
            EXPLODE_SIZE=parseInt($(this).attr("data-explode-distance"));
        
        var SPEED = 15;
        if ($(this).attr("data-speed"))
            SPEED=parseInt($(this).attr("data-speed"));
        
        var REWIND = true;
        if ($(this).attr("data-rewind"))
            REWIND = ($(this).attr("data-rewind")==true);
        
        var VARY_SIZE_PERCENT = 0;
        if ($(this).attr("data-vary-size"))
            VARY_SIZE_PERCENT = parseInt($(this).attr("data-vary-size"));
        
        
        $(this).css("position","relative");
        $("img",this).css("position","absolute");
        
        var satelites = $("img",this);
        var firstsatelite = $("img:first",this);
        
        
        var eclipse_height = $(this).height()-firstsatelite.height();
        var eclipse_width = $(this).width()-firstsatelite.width();
        
        
        var center_x = $(this).width()/2;
        var center_y = $(this).height()/2;
        
        var offset_x=center_x-firstsatelite.width()/2;
        var offset_y=center_y-firstsatelite.height()/2;
        
        var a = eclipse_width/2;
        var b = eclipse_height/2;
        
        
        var ellipse_size_offset = EXPLODE_SIZE;
        
        var stopping = false;
        
        var animationID;
        var animation_position=0;
        
        var animation_position_offset=0;
        if ($(this).attr("data-start-position"))
            animation_position_offset=parseInt($(this).attr("data-start-position"))%360;
        
        var animation_end_position = 361;
        if ($(this).attr("data-end-position"))
            animation_end_position=parseInt($(this).attr("data-end-position"))%360;
        
        var animation_direction_acw = false;
        if ($(this).attr("data-direction"))
            animation_direction_acw=($(this).attr("data-direction")=="anticlockwise");
        
        function animateNextFrame()
        {
            if (firstsatelite.queue().length > 2)
                return; // don't allow animation to queue up
            
            
            // while stopping implode
            if (REWIND && stopping && (animation_position <= EXPLODE_SIZE))
                ellipse_size_offset=EXPLODE_SIZE-animation_position;
            
            if ((animation_end_position-animation_position) <= EXPLODE_SIZE)
            {
                ellipse_size_offset=EXPLODE_SIZE-(animation_end_position-animation_position);
            }
            
            var angle,nexX,newY;
            for (var i=0;i<satelites.length;i++)
            {
                angle=animation_position+animation_position_offset+i*(360/satelites.length);
                
                if (animation_direction_acw)
                    angle=-angle
                
                newX = offset_x + (a-ellipse_size_offset)*Math.cos(angle*Math.PI/180);
                newY = offset_y + (b-ellipse_size_offset)*Math.sin(angle*Math.PI/180);
                
                var newcss = {  "top": newY+"px", 
                                "left": newX+"px", 
                                "z-index": parseInt(10+newY)
                             }
                if (VARY_SIZE_PERCENT)
                {
                    var percent = (((100-VARY_SIZE_PERCENT)+(newY/eclipse_height)*VARY_SIZE_PERCENT));
                    newcss["width"]  =  percent*+satelites[i].naturalWidth/100;
                    newcss["height"] = percent*+satelites[i].naturalHeight/100;
                    newcss["top"]    = (newY+(satelites[i].naturalHeight-newcss["height"])/2)+"px";
                    newcss["left"]   = (newX+(satelites[i].naturalWidth-newcss["width"])/2)+"px";
                }
                
                $(satelites[i]).animate(newcss,SPEED);
            }
            
            // while starting explode
            if (!stopping && ellipse_size_offset>0) 
                ellipse_size_offset--;
            
            
            if (stopping)
            {
                if (animation_position==0 || !REWIND)
                {
                    window.clearInterval(animationID);
                    animationID=false;
                }
                else
                {
                    animation_position=Math.abs((animation_position-1)%360);
                }
            }
            else
            {
                if (animation_position <= animation_end_position)
                    animation_position=(animation_position+1)%360;
            }
        }
        
        
        function startAnimate()
        {
            stopping = false;
            if (!animationID)
                animationID = setInterval(animateNextFrame,SPEED);
        }
        function stopAnimate()
        {
            stopping = true;
        }
        
        
        // event handlers
        
        $(this).mouseover(function(e) {
            startAnimate();
        });
        $(this).mouseout(function(e) {
            stopAnimate();
        });
        
        var elem = $(this).get(0);
        if (elem.addEventListener)
        {
            elem.addEventListener("touchstart", function(e) {
              startAnimate();
            }, false);
            elem.addEventListener("touchend", function(e) {
              stopAnimate();
            }, false);
        }
        
        animateNextFrame(); // init positions
    });
  }
})(jQuery);
