Get Started
===========

### 1. Install locally
```sh
$ npm install --save bootstruct
```

### 2. Create a server and initialize Bootstruct app
Your server's `index.js` file: 
```js
const http = require('http');
const bootstruct = require('bootstruct');

const app = bootstruct(folderPath); // <-- web root folder

http.createServer(app).listen(8080, () => {
    console.log('Listening on port 8080...');
});
```

### 3. Create your web root folder
The web root folder holds your entire API.
Pass whatever name you pick to the `bootstruct()` call above.

> Suggested names: `routes` | `api` | `app` | `www`.

We'll be using the name **"api"** for the rest of this tutorial.

&nbsp;

This is how your project folder tree should look like:
```
├── myProject
│   ├── node_modules
│   ├── api
│   └── index.js
```
	
### **This is our starting point for this tutorial.**
Now let's create our first route.

&nbsp;


"Hello World"
-------------
Create an `index.js` file in your web-root folder `api`.
```
├── api
│   └── index.js
```

Put the following in that `index.js`:
```js
module.exports = function (io) {
	io.res.end('hello world');
};
```

Start your server up:
```sh
$ node index.js
```
and open your browser in `http://localhost:8080`.

Your `api` folder becomes your app's root-controller and `index.js` is its only method so ANY request will be responded with "hello world".

The `io` argument is an object that holds Node's native `request`/`response` objects you probably know.

Method
------
Let's add another method (a file): `greet.js`
```
├── api
│   ├── greet.js
│   └── index.js
```

`api/greet.js` contents:
```js
module.exports = function (io, who) {
	if (who) {
		io.res.end('Hey ' + who);
	}
	else {
		io.res.end('Hello everyone');
	}
};
```

| Request    | Response       |
|------------|----------------|
|/greet      | Hello everyone |
|/greet/john | Hey john       |


Our "api" controller now has another method named "greet".

Hooks
-----
Now let's create a file named "_in.js":
```
├── api
│   ├── _in.js
│   ├── greet.js
│   └── index.js
```

`api/_in.js` contents:
```js
module.exports = function (io) {
	io.res.write('Yay! ');
	io.next();
};
```

| Request    | Response            |
|------------|---------------------|
|/           | Yay! hello world    |
|/whatever   | Yay! hello world    |
|/_in        | Yay! hello world    |
|/greet      | Yay! hello everyone |
|/greet/john | Yay! hey john       |


`_in` is one of Bootstruct's hooks. Its exported function will run before the other two (`index` and `greet`). This is why all the responses start with "Yay! ". Because `_in` is a reserved name, it won't be parsed as a method like `greet` so requesting `/_in` will be handled by `api/index.js` just like requesting `/whatever`.

`io.next()` is called to move the `io` forward in the chain, from one handler (_in) to the next one (index or greet). You call it at the end of your methods.




Debugging
---------
Bootstruct can be initiated with a second argument, a debug-mode flag (default: false). Start your app with a second truthy argument for console logs of the `io`'s different checkpoints along its way.
```js
const app = bootstruct('api', true);
```


What's next?
------------
This page covered Bootstruct's basics, but there's more.

[Read The Fabulous Manual](https://github.com/taitulism/Bootstruct/blob/master/Docs/README.md).
