/**central timer contro*/
var timers = {
  timerId: 0,
  timers: [],
  add: function(callback) {
    this.timers.push(callback);
  },
  start: function() {
    if(this.timerId) { return }
    (function runNext() {
      if(timers.timers.length > 0) {
        for(var i = 0; i < timers.timers.length; i++) {
          if(timers.timers[i]() === false) {
            timers.timers.splice(i, 1);
            i--;
          }
        }
        timers.timerId = setTimeout(runNext, 0);
      }
    })()
  },
  stop: function() {
    clearTimeout(this.timerId);
    this.timerId = 0;
  }
}

window.onload = function() {
  var box = document.getElementById('box');
  timers.add((function() {
    var x= 0;
    return function() {
      box.style.left = x + "px";
      if(++x > 50) {
        return false
      }
    }
  })());
  timers.add((function() {
    var y= 100;
    return function() {
      box.style.top = y + "px";
      y += 2;
      if(y > 220) {
        return false
      }
    }
  })());
  document.getElementById('btn').addEventListener('click', function() {
    timers.start();
  })
}
