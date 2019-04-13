/**
 * 利用函数的length属性，实现函数重载
 * 注：通过闭包特性来获取old和fn
 * 这种方式就像剥洋葱皮一样，每一层检查参数个数是否匹配，如果不匹配的话，就推迟上一层创建的函数
 */
function addMethod(obj, name, fn) {
  var old = obj[name];
  obj[name] = function() {
    if(fn.length === arguments.length) {
      return fn.apply(this, arguments);
    }else if(typeof old === 'function') {
      return old.apply(this, arguments);
    }
  };
}

var najia = {
  values: ['asum xx', 'bsum dd', 'csum kk']
};

/**
 * test
 */
addMethod(najia, 'find', function() {
  return this.values;
})
addMethod(najia, 'find', function(name) {
  var ret = [];
  for(var i = 0; i < this.values.length; i++) {
    if(this.values[i].indexOf(name) === 0) {
      ret.push(this.values[i])
    }
  }
  return ret;
})

addMethod(najia, 'find', function(first, last) {
  var ret = [];
  for(var i = 0; i < this.values.length; i++)  {
    if(this.values[i] === (first + ' ' + last)) {
      ret.push(this.values[i]);
    }
  }
  return ret;
})

window.onload = function() {
  test("A test.", function() {
    assert(najia.find().length == 3, "Found all ninjas");
    assert(najia.find('asum').length == 1, "Found ninja by first name");
    assert(najia.find('bsum', 'dd').length == 1, "Found ninja by first and last name");
    assert(najia.find('bsum', 'dd', 'jjj') == null, "Found nothing");

  })
  var node = document.getElementById('results');
  console.log(Object.prototype.toString.call(node.getAttribute));
  console.log(typeof node.getAttribute == 'object');
}
