import { addToIndexHTML } from './output.js'

export function runVariables() {
  // 3 types of variables let, const, or var.
  // let and const are within the scope of where they are defined
  // var is not

  // myLetVariabe is not visible here
  for (let myLetVariable = 0; myLetVariable < 5; myLetVariable++) {
    addToIndexHTML("myLetVariable = " + myLetVariable); // myLetVariable is only visible within the for loop
  }
  // myLetVariabe is not visible here


  const myConstant = "Robs Constant";
  addToIndexHTML(myConstant);
  // myConstant = "New Constant";   // This will not work as it is a constant!


  // myVarVariabe is visible here
  addToIndexHTML(myVarVariable);
  for (var myVarVariable = 0; myVarVariable < 5; myVarVariable++) {
    addToIndexHTML("myVarVariable = " + myVarVariable); // myLetVariable is only visible within the for loop
  }
  // myVarVariabe is visible here
  addToIndexHTML(myVarVariable);
}
