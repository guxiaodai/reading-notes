var getNodes = (function() {
  const map = {
    "<option": [1, "<select>", "</select>"]
  }
  return function(htmlString, doc, fragment) {
    htmlString = convert(htmlString);
    console.log('htmlString', htmlString)
    const tagName = htmlString.match(/<\w+/);
    let mapEntry = map[tagName];
    if (!mapEntry) {
      mapEntry = [0, "", ""];
    }
    let div = (doc || document).createElement('div');
    div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];
    while (mapEntry[0]--) {
      div = div.lastChild;
    }
    // return div.childNodes;
    return div
  }
})()

function convert(html) {
  const tags = /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
    return tags.test(tag) ? all : front + '></' + tag + '>';
  })
}
var testHtml = '<option>Yoshi</option><option>Kuma</option><table/>';
console.log(getNodes(testHtml))
// console.log(getNodes.toString());
