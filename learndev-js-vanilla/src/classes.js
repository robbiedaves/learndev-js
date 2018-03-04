import { addToIndexHTML } from './output.js'

export function runClasses() {

  class User {
    constructor(name) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    set name(value) {
      return this._name = "SET: " + value;
    }
  }


  var user = new User("Robin");
  addToIndexHTML("Name Property: " + user.name);


}
