# learndev-js-node-hello

This is from the following tutorial:
https://blog.risingstack.com/node-hero-npm-tutorial/

Download and install node.js by downloading it from:
https://nodejs.org/en/download/

To test node is running, use the following command:
```
node --version
```

To test node is running, use the following command:
```
node --version
```

To begin, start node by typing node on the command line. 
A ‘>’ should be displayed. Now type 
```
console.log('hello world')
```

Hello world should be display on the next line.

Create a folder and create a new index.js file in the root. In that file put 
```
console.log('hello world')
```

Now open the command line in this folder and type 
```
node index.js
```

Again, hello world should be displayed.
Package Structure
Now, create the follow folder structure with empty files:
```
|--- app
|       |--- calc.js
|       |--- index.js
|--- index.js
```

Every node.js project starts with a package.json file.It contains details of the project like author and dependencies.
Type npn init to create the package.json. Hit enter to accept the defaults.

It is good practice to add a start script to the package.json so add the following
"start": "node index.js"
This allows the application with the npm start command and also is useful if you deploy your application to a PaaS provider, as they can recognise it and start your application with it.

The file should now look like this:

```json
{
  "name": "learndev-js-node-hello",
  "version": "1.0.0",
  "description": "This is from the following tutorial:\r https://blog.risingstack.com/node-hero-npm-tutorial/",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
	"start": "node index.js"
  },
  "author": "Robin Davies",
  "license": "ISC"
}
```

Now let’s head back to the first file you created called index.js. Its recommended to keep the this file very thin - only requiring the application itself (the index.js file from the /app subdirectory you created before). 
Copy the following script into your index.js file and hit save to do this:

```js
require('./app/index') 
```

Now open the index.js file in the /app folder and enter following:

```js
// app/index.js
const message = require('./message')

const result = message.getMessage("My first node app")
console.log(result) 
```

Note: The backticks around `The result is: ${result}` - if you use ‘ instead, ${result} will be printed when you run the package.

Then paste the following business logic into calc.js in the /app folder:

```js
// app/message.js
function getMessage (arg) {  
  return 'Hello, your message is: ' + arg
}

module.exports.getMessage = getMessage 
``` 

Now to test this worked, enter on the command line
```
npm start
```
or
```
node index.js
```

The following should be displayed: 

```
Hello, your message is: My first node app
```
