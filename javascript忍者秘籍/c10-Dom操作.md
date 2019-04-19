# Dom操作
* HTML字符串转dom节点
  * 验证字符串是否合法
  * 将其包装为闭合标签
  ```javascript
  function convert(html) {
    const tags = /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
    return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
      return tags.test(tag) ? all : front + '></' + tag + '>';
    })
  }
  ```
  * 浏览器规定，有些标签（如<option>）只能包含在某些特定标签内部。直接使用innerHTML()方法插入可能会失败。

    将这段字符串插入到`<select>`标签中，会自动舍弃`<table></table>`：
    ```javascript
    '<option>Yoshi</option><option>Kuma</option><table/>'
    ```
  * 使用innerHTML将HTML插入虚拟Dom元素
  * 最后将创建的DOM节点提取出来
* fragments（DOM片段）

  fragment提供了一个存储临时DOM节点的容器
  ```javascript
  var fragment = document.createDocumentFragment();
  ```
  通过fragment插入DOM节点不会触发回流和重绘，操作完成后一次性将fragment注入到文档中，大大减少了实际DOM操作，提升性能
  ```javascript
  if (fragment) {
    while( div.firstChild) {
      fragment.appendChild(div.firstChild);
    }
  }
  ```
* 元素特性和属性

  特性: elem.id

  属性: elem.getAttribute('id')

  * 如果是DOM原生的特性，如id，那么elem.id和elem.getAttribute('id')效果完全一致
  * 但如果是自定义属性，如data-msd，则只能使用elem.getAttribute('data-msd')操作
* 样式
  * div.style.color

    使用元素样式对象`style`只能获取在内联样式中设置过的属性，获取不到在`<style>`标签和css中设置的样式
  * 获取计算后的样式
    ```javascript
    function fetchComputedStyle(elem, property) {
      const computedStyles = getComputedStyle(elem);
      if(computedStyles) {
        property = property.replace(([A-Z])/g, -$1).toLowerCase();
        return computedStyles.getPropertyValue(property);
      }
    }
    ```
  * 测量元素实际的with和height

    `offsetHeight`,`offsetWidth`.
    * 包含了padding
    * 无法获取display: none; 元素的宽高
    * 获取隐形元素宽高技巧
* 避免布局抖动

  * 由于重新计算布局十分昂贵，浏览器尽可能少、尽可能延缓布局的工作，尝试在队列中批量处理DOM上尽可能多的写入操作，以便一次性执行这些操作。
  * 连续的读写可能造成布局抖动

    当我们修改DOM时，浏览器必须在读取任何布局信息（如clientHeight、getBoundingClientRect)之前先重新计算布局，这时浏览器会勉强服从，执行所有批量操作，最后更新布局
  * 批量DOM读取和写入以避免布局抖动
* React的virtual DOM

  React使用虚拟DOM和一组Javascript对象，通过模拟实际DOM来实现极佳的性能。实际开发时，在virtual DOM中执行所有修改，React在恰当的时候比对虚拟DOM和实际DOM来保证UI同步。
