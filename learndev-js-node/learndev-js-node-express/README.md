# NPM - Node Express

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

const result = "My Express application"
console.log(result) 
```

Now add (in the root folder) package.json that looks like this:
```json
{
  "name": "learndev-js-node-express",
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


Now we need to download and install Express using NPM:
```
npm install express --save
```

This has added the following in the package.json
```
  "dependencies": {
    "express": "^4.15.2"
  }
```
and downloaded the express web server into the node_modules folder.

Now we have our project setup, we can edit the app/index.js and copy the following
```js
// app/index.js

const result = "My Express application"
console.log(result) 

const express = require('express')  
const app = express()  
const port = 3000

app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

app.listen(port, (err) => {  
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
Hello from Express!
```

## Middlewares
You can think of middlewares as Unix pipelines, but for HTTP requests.
[1st Middleware] -> [2nd Middleware] -> [3rd Middleware] -> [Optional route	handler]

In the above, you can see how a request can go through an Express application. Each middleware can modify it.
Then based on business logic either the 3rd middleware can send back the response or it can be a route handler.

Change the app/index.js to the following:
```
// app/index.js

const result = "My Express application"
console.log(result) 

const express = require('express')  
const app = express()  
const port = 3000


app.use((request, response, next) => {  
  console.log(request.headers)
  next()
})

app.use((request, response, next) => {  
  request.chance = Math.random()
  next()
})

app.get('/random', (request, response) => {  
  response.json({
    chance: request.chance
  })
})

app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
```

Now goto http://localhost:3000/random and see the random number in json format.

Notes:
* app.use: This is how you define the middlewares - It takes a function with 3 parameters, the first being the request, the second the response, and the 3rd one is the next callback. Calling next signals Express that it can jump to the next middleware or route handler.
* The first middleware just logs the header and instantly calls the next one.
* The second one adds an extra property to it - this is one of the most powerful features of the middleware pattern. Your middleware can append extra data to the request object that downstream middlewares can read or alter.


## Error Handling
In the app/index.js add the following function (make sure it is the last app.use function):
```
app.use((err, request, response, next) => {  
  // log the error, for now just console.log
  console.log(err)
  response.status(500).send('Something broke!')
})
```

and also add a new route
```
app.get('/error', (request, response) => {  
  throw new Error('oops')
})
```

Now re-start the server and go to: http://localhost:3000/error
You will see the error message being displayed to the console and to the page.

Notes:
* The error handler should be the last function added with app.use
* The error handler has a next callback - it can be used to chain multiple error handlers.








