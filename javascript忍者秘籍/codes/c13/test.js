function* DomTraversal(element) {
  yield element;
  element = element.firstElementChild;
  while(element) {
    yield* DomTraversal(element);
    element = element.nextElementSibling;
  }
}
const subTree = document.getElementById("subTree");
const domIteritor = DomTraversal(subTree);
for(let element of domIteritor) {
  assert(element !== null, element.nodeName);
}
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
// const result2 = ninjaIterator.next();

ninjaIterator.throw("Catch this!"); //向生成器抛出一个异常
function assert(val, text) {
  if(val) {
    console.log(text);
  }
}
