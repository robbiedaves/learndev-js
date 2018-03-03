//  simple types
import {addToIndexHTML} from './output.js'

export function runTypes() {

  // Numbers
  addToIndexHTML("Numbers");
  var intResult = 1 + 2;
  addToIndexHTML("1 + 2 = " + intResult);

  // Strings
  addToIndexHTML("Strings");
  addToIndexHTML("'hello'.charAt(0) = " + 'hello'.charAt(0));
  addToIndexHTML("'hello, world'.replace('hello', 'goodbye'); = " + 'hello, world'.replace('hello', 'goodbye') );
  addToIndexHTML("'hello'.toUpperCase();", 'hello'.toUpperCase());

}
