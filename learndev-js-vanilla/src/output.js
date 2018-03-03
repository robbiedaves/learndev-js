export function addToIndexHTML(output) {
  var ul = document.getElementById("output-list");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(output));
  ul.appendChild(li);
}
