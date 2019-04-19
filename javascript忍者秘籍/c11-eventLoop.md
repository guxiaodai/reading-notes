# Event Loop
* JavaScript是单线程的

  浏览器的单线程决定了，在同一时间内只能执行一个任务，且该任务不会被打断。除非浏览器决定终止执行该任务，如某个任务执行事件过长或内存占用过大
* 任务队列

  在各种JavaScript实现中，都至少会维护两个队列，一个`宏任务`(MacroTask)队列和一个`微任务`(MicroTask)队列
  * MacroTask

    包含：创建主文档对象、解析HTML、执行主线（或全局）Javascript代码，更改当前URL以及各种事件，如页面加载、输入、网络事件和定时器事件。

    从浏览器角度看，宏任务代表一个个独立、离散的工作单元，运行完任务后，浏览器可以进行其他调度，如重新渲染页面的UI或垃圾回收
  * MicroTask

    微任务更新应用程序状态，必须在浏览器任务继续执行其他任务之前执行。也就是说，它们必须在浏览器重新渲染UI之前执行。

    微任务包括Promise、DOM改变
* 事件循环

  在每次事件循环中，检测宏任务队列，若不为空，执行任务，在任务结束后检查微任务队列，微任务队列中的任务依次执行完毕后，浏览器可以尝试重新渲染。
  * 两个基本原则
    * 一次只执行一个任务
    * 一个任务开始后知道运行完成，不会被其他任务终端
  * 两类任务队列都是独立于事件循环之外的，这意味着任务队列的添加行为也发生在事件循环之外。
  * 所有微任务都会在下一次渲染前执行完成

    `vue nextTick`
* 浏览器通常会尝试每秒渲染页面60次，以达到每秒60帧的速度
  * 60fps通常是检验体验是否平滑流畅的标准
  * 这意味着浏览器会尝试在16ms内渲染一帧
  * 在页面渲染时，任何任务都无法再进行修改，要项实现平滑流畅的应用，理想情况下，单个任务和该任务附属的所有微任务，都应在16ms内完成。
  * 需要注意事件处理函数的发生频率以及执行耗时

    如`mouse-move`事件，鼠标移动会导致大量的事件进入队列，因此在处理函数中执行任何复杂操作都可能导致糟糕的用户体验
* 事件循环中的计时器

  计时器的回调函数在延时到期后加入任务队列，而此时队列中的同步任务可能没有处理完，这导致延时不准。
* 两种事件模型
  * 事件捕获
  * 事件冒泡
* 通过DOM代理事件

  原理： 事件冒泡
  ```Javascript
  const table = document.getElementById('someTable');
  table.addEventListener("click", () => {
    if(event.target.tagName.toLowerCase() === 'td') {
      event.target.style.backgroundColor = 'yellow';
    }
  })
  ```
  * 事件处理器中this和event.target的区别
    * this指向当前处理器注册的元素
    * event.target指向发生事件的元素
* 自定义事件
  ```Javascript
  function triggerEvent(target, eventType, eventDetail) {
    const event = new CustomEvent(eventType, {
      detail: eventDetail
    });
    target.dispatchEvent(event);
  }
  ```
  自定义事件通过高度解耦的方式实现以共享模式处理业务。这种级别的解耦有助于保持代码模块化，易于编写，并且在出错时更容易调试。
