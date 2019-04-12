/**
 * 一个测试组
 */
(function() {
  var queue = [], paused = false, results;
  this.assert = function assert(value, desc) {
    let li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    results.appendChild(li);
    if (!value) {
      li.parentNode.parentNode.className = 'fail';
    }
    return li;
  }
  this.test = function test(name, fn) {
    queue.push(function() {
      results = document.getElementById("results");
      // appendChild方法的返回值： var child = node.appendChild(child);
      results = assert(true, name).appendChild(document.createElement("ul"));
      console.log('r: ', results)
      fn();
    });
    runTest();
  }
  this.pause = function () {
    paused = true;
  }
  this.resume = function () {
    paused = false;
    setTimeout(runTest, 1);
  }
  function runTest() {
    if(!paused && queue.length > 0) {
      queue.shift()();
      if(!paused) {
        console.log('!paused')
        resume();
      }
    }

  }
})()

window.onload = function() {
  test("A test.", function() {
    assert(true, "First assertion completed");
    assert(true, "Second assertion completed");
    assert(true, "Third assertion completed");
  })

  test("Another test", function() {
    assert(true, "First assertion completed");
    assert(false, "Second assertion failed");
    assert(true, "Third assertion completed");
  })

  test("A third test" ,function() {
    assert(null, "fail");
    assert(5, "pass");
  })

  //async test
  test("Async Test #1", function() {
    pause();
    setTimeout(function() {
      assert(true, "First test completed");
      resume();
    }, 1000)
  })

  test("Async Test #2", function() {
    pause();
    setTimeout(function() {
      assert(true, "Second test completed");
      resume();
    }, 1000)
  })
}
