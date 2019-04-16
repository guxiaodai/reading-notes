/*经典继承语法示例*/
(function() {
    var initializing = false,
    superPattern = /xyz/.test(function() { xyz }) ? /\b_super\b/ : /.*/;

    Object.subClass = function(properties) {
      var _super = this.prototype;
      initializing = true;
      var proto = new this();
      initializing = false;

      for (var name in properties) {
        proto[name] = typeof properties[name] == 'function' && typeof _super[name] == 'function' && superPattern.test(properties[name]) ?
        (function (name, fn) {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        })(name, properties[name]) :properties[name];
      }

      function Class() {
        if(!initializing && this.init) {
          this.init.apply(this, arguments);
        }
      }
      Class.prototype = proto;
      Class.prototype.constructor = Class; //重载构造器引用
      Class.subClass = arguments.callee; //让类可以继续扩展

      return Class;
    }
  })();

var Person = Object.subClass({
  init: function(name) {
    this.name = name;
  },
  dance: function(isDancing) {
    this.dance = isDancing;
  }
});
var p = new Person();
console.log(p.constructor === Person);

var Ninja = Person.subClass({
  init: function(name) {
    this.name = name;
  },
  dance: function() {
    this.super(false)
  }
});

var ninja = new Ninja('renzhe');
