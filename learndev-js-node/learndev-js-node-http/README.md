# NPM - Node HTTP Server

To build HTTP based applications in node, we can use the built in http/https modules

To create a simple node.js HTTP server we will require the http module and we can bind our server to the port 3000.

First create a new project folder and set up the following strucuture:
```
|--- app
|       |--- index.js
|--- index.js
```

the root index.js should be simply
```js
require('./app/index')
```

The index.js in the app folder should be:
```
// app/index.js

const result = "My Node HTTP application"
console.log(result) 
```

Now add (in the root folder) package.json that looks like this:
```json
{
  "name": "learndev-js-node-http",
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
Note: You can manually add the package.json file or type npn init and enter the details on the command line.

Now we have our project setup, we can edit the app/index.js and copy the following
```js
// app/index.js

const result = "My Node HTTP application"
console.log(result) 

const http = require('http')  
const port = 3000

const requestHandler = (request, response) => {  
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
```

Now start the server using
```
node index.js
```

Now goto http://localhost:3000/ and you should see the following text appear:
```
Hello Node.js Server!
```

Note:
* requestHandler: this function will be invoked every time a request hits the server. 2 logs messages appear when you visit the page. One for / and the other for favicon.ico
* if (err): error handling - if the port is already taken, or any other reason our server cannot start, we get notified here.

The http module is very low level. We usually would use a framework to work with like express.