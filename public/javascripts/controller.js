
socket.on('selected', function (data) {
    var list = document.getElementById('list')
    var controller = document.getElementById('controller')
    list.classList.add('hidden');
    setTimeout(function(){

        list.style.display = "none";
        controller.style.display = "grid";
        var topbuttons = document.querySelector("topb");
        var dpad = document.querySelector("dpad");
        var actions = document.querySelector("actions");
        var start = document.querySelector('b[data-button="start"]');
        var select = document.querySelector('b[data-button="select"]');
     
      

        function presskey(button){
            var key = button.getAttribute("data-key")
            return function(){
                socket.emit("press", key)
            }
        }
        function releasekey(button){
            var key = button.getAttribute("data-key")
            return function(){
                socket.emit("release", key)
            }
        }
        topbuttons.querySelectorAll('b').forEach(function(button){
            button.addEventListener("touchstart", presskey(button))
        })
        actions.querySelectorAll('b').forEach(function(button){
            button.addEventListener("touchstart", presskey(button))
        })
        dpad.querySelectorAll('b').forEach(function(button){        
            button.addEventListener("touchstart", presskey(button))
        })
        topbuttons.querySelectorAll('b').forEach(function(button){
            button.addEventListener("touchend", releasekey(button))
        })
        actions.querySelectorAll('b').forEach(function(button){
            button.addEventListener("touchend", releasekey(button))
        })
        dpad.querySelectorAll('b').forEach(function(button){        
            button.addEventListener("touchend", releasekey(button))
        })
        var pressed = undefined;
        var dpadbtn = dpad.querySelectorAll('b');
        var actionsbtn = actions.querySelectorAll('b');
        ontouchmove = function(e){
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;

            dpadbtn.forEach(function(button){        
                var rect = button.getBoundingClientRect();
                if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom){
                    if(pressed !== button.getAttribute("data-key")){
                        if(typeof pressed !== 'undefined'){
                            console.log(pressed)
                            socket.emit("release", pressed)
                        }
                        pressed = button.getAttribute("data-key");
                        socket.emit("press", pressed);
                    }

                }
            })
            actionsbtn.forEach(function(button){        
                var rect = button.getBoundingClientRect();
                if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom){
                    if(pressed !== button.getAttribute("data-key")){
                        if(typeof pressed !== 'undefined'){
                            console.log(pressed)
                            socket.emit("release", pressed)
                        }
                        pressed = button.getAttribute("data-key");
                        socket.emit("press", pressed);
                    }

                }
            })
        }

       
        start.addEventListener("touchstart", presskey(start))
        select.addEventListener("touchstart", presskey(select))
        start.addEventListener("touchend", releasekey(start))
        select.addEventListener("touchend", releasekey(select))
    },300)
});
