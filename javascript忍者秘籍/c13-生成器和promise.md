# 生成器和promise

  引入生成器和promise，实现非阻塞代码且代码结构清晰，避免回调地狱
* 生成器generator

  generator函数能生成一组值的序列，每个值的生成基于每次请求，必须显示的向生成器请求一个新的值，随后生成器要么响应一个新生成的值，要么就告诉我们它之后不会再生成新值。每当遇到yield，生成一个新值后，生成器就会非阻塞的挂起执行，随后等待下一次值请求。

  * 基本语法
    ```javascript
    function* WeaponGenerator() {
      yield "Katana";
      yield "Wakizashi";
    }
    for(let weapon of WeaponGenerator()) {
      if(!weapon.done) {
        assert(weapon.value, "not done");
      }
    }
    ```
    * 调用generator函数不一定会执行函数体，而是会创建一个迭代器(iterator)。迭代器控制生成器的执行，可以调用iterator.next()方法请求新值，或者通过for-of取出生成的值序列。
    ```javascript
    const weaponGenerator = WeaponGenerator();
    const result1 = weaponGenerator.next();
    ```
    result1结果为一个对象，其中包含一个返回值，以及一个指示器告诉我们生成器是否还会生成新值

  * 使用yield操作符将执行器交给另一个生成器
    ```javascript
    function* WarriorGenerator() {
      yield "Sun Tzu";
      yield* NinjaGenerator();
      yield "Genghis Khan";
    }
    function* NinjaGenerator() {
      yield "Hattori";
      yield "Yoshi";
    }

    for(let warrior of WarriorGenerator()) {
      assert(warrior !== null, warrior);
    }
    ```
    在迭代器上使用yield*caozuofu ,程序会跳转到另一个生成器上执行。每次调用 WarriorGenerator返回迭代器的next方法，都会使执行重新寻址到 NinjaGenerator上。该生成器会一直持有执行权，直到无工作可做。

    for-of不关心 WarriorGenerator是否委托到另一个生成器上，它只关心在done到来之前都一直调用next()方法。
  * 生成器应用
    * 生成ID序列
      在创建某些对象时，经常需要为每个对象赋一个唯一ID。通过使用生成器，可以避免使用全局变量计数。
      ```javascript
      function* IdGenerator() {
        let id = 0;
        while(true) { //循环生成无限长度的ID序列
          ++id;
        }
      }
      const idIterator = IdGenerator();
      const ninja1 = {id: idIterator.next().value};
      const ninja2 = {id: idIterator.next().value};
      ```
      注：标准函数中一般不应该写无限循环，但是在生成器中没哟问题！当生成器遇到了一个yield语句，它就会一直挂起直到下一次调用next方法。

      如果还需要另外一个迭代器来记录ID序列，只需要再初始化一个新iterator就可以了。
    * 递归遍历DOM

      一般遍历DOM相对简单的方法都是实现一个递归函数：
      ```javascript
      function traverseDOM(element, callback) {
        callback(element);
        element = element.firstElementChild;
        while(element) {
          traverseDOM(element, callback);
          element = element.nextElementSibling;
        }
      }
      const subTree = document.getElementById("subTree");
      traverseDOM(subTree, function(element) {
        assert(element !== null, element.nodeName);
      })
      ```
      使用生成器实现：
      ```javascript
      function* DomTraversal(element) {
        yield element;
        element = element.firstElementChild;
        whild(element) {
          yield* DomTraversal();
          element = element.nextElementSibling;
        }
      }
      const subTree = document.getElementById("subTree");
      const domIteritor = DomTraversal(subTree);
      for(let element of domIteritor) {
        assert(element !== null, element.nodeName);
      }
      ```
      这个案例是一个相当好的例子，因为它还告诉我们如何在不使用回调函数的情况下，泗洪生成器函数来解耦代码，从而使生产值（HTML节点）的代码和消费值（循环打印）的代码分开。很多场景下，使用迭代器要比使用递归自然。
    * 与生成器交互

      使用next方法向生成器发送值
      ```javascript
      function* NinjaGenerator(action) {
        const imposter = yield ("Hattori " + action);

        assert(imposter === "Hanzo", "The generator has been infiltrated");
        yield ("Yoshi (" + imposter + ") " + action);
      }

      const ninjaIterator = NinjaGenerator("shulk");
      const result1 = ninjaIterator.next();
      const result2 = ninjaIterator.next("Hanzo");
      ```
      第二次调用 ninjaIterator.next('Hanzo')又请求了一个新值，同时向生成器发送了实参Hanzo，作为第一个yield表达式的返回值，因此imposter的值为"Hanzo".

      我们通过 yield语句从生成器中返回值，再使用迭代器的next()方法把值传回生成器.
    * 向生成器抛出异常

      每个迭代器除了有一个 next 方法，还有一个 throw 方法。
      ```javascript
      function* NinjaGenerator() {
        try {
          yield "Hattori";
          fail("The expected exception didn't occur"); //此处的错误将不会发生
        } catch (e) {
          assert(e === "Catch this!", "Aha! We caught an exception.");
        }
      }
      const ninjaIterator = NinjaGenerator();

      const result1 = ninjaIterator.next();
      ninjaIterator.throw("Catch this!"); //向生成器抛出一个异常
      ```
    * 生成器内部构成

      生成器所有不可思议的特点都来源于一点即当我们从生成器取得控制权后（创建一个迭代器），生成器的执行环境上下文是一直保存的，而不是像标准函数一样推出后销毁。
* promise

  promise对象是对我们现在尚未得到但将来会得到的值的占位符，它是对我们最终能够得知异步计算结果的一种保证。用于更简单的处理异步任务
  * 异步中的回调函数带来的问题
    * 不利于处理异常，无法用内置语言结构来处理
    * 执行连续步骤非常棘手。嵌套回调函数会增加代码的复杂度，降低可读性。
    * 执行很多并行任务也很棘手
  * rejected

    如果promise的reject函数被调用，或者如果一个未处理的异常在promise调用的过程中发生了，promise就会进入到拒绝状态。可以在catch中处理。
  * 创建 getJSON promise 实例
    ```javascript
    function getJSON(url) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open("GET", url);

        request.onload = function() {
          try {
            if (this.status === 200) {
              resolve(JSON.parse(this.response));
            }else {
              reject(this.status + " " + this.statusText);
            }
          } catch (e) {
            reject(e.message);
          }
        }

        request.onerror = function() {
          reject(this.status)
        };

        request.send();
      });
    }

    getJSON('data/ninjas.json').then(ninjas => {
      assert(ninjas !== null, ninjas);
    }).catch(err => {
      fail("Shouldn't be here:" + err);
    })
    ```
  * Promise.all()
  * Promise.race()
* 生成器和promise结合
  ```javascript
  async(function* () {
    try {
      const ninjas = yield getJSON("data/ninjas.json");
      const missions = yield getJSON(ninjas[0].missionUrl);
      const missionDescription = yield getJSON(missions[0].detailsUrl);
      //study the mission details
    } catch (e) {

    }
  });
  function async(generator) {
    var iterator = generator();

    function handle(iteratorResult) {
      if (iteratorResult.done) {
        return;
      }
      const iteratorValue = iteratorResult.value;
      if (iteratorValue instanceof Promise) {
        iteratorValue
        .then(res => handle(iterator.next(res)))
        .catch(err => iterator.throw(err));
      }
    }
    try {
      handle(iterator.next());
    } catch (e) {
      iterator.throw(e)
    }
  }
  ```
* async 和 await
  用于替换上面的样板代码，实现生成器与promise相结合的功能
  ```javascript
  (async function() {
    try {
      const ninjas = await getJSON("data/ninjas.json");
      const missions = await getJSON(ninjas[0].missionUrl);
    } catch (e) {
      console.log("Error: ", e);
    }
  })();
  ```
