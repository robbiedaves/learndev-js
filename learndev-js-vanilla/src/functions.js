import { addToIndexHTML } from './output.js'

export function runFunctions() {

  // Callback functions. Here is an example
  function ask(question, yes, no) {
    if (confirm(question)) yes()
    else no();
  }

  function showOk() {
    alert("you agreed");
  }
  function showCancel() {
    alert("you cancelled the execution");
  }
  ask("Do you agree", showOk, showCancel);


  // Example of an arrow function
  let sum = (a, b) => a + b;
  addToIndexHTML("Sum = " + sum(1,2));

}
