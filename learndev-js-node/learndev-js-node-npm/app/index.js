// app/index.js

const result = "My Node application using NPM"
console.log(result) 

const _ = require('lodash')

_.forEach([1, 2], function(value) {
  console.log(value);
});
// => Logs `1` then `2`.