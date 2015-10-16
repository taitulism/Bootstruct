Get Started
===========

1. Create a new folder for your project (e.g. "myProject").

2. Install Bootstruct in that folder: 
	```sh
		$ npm install bootstruct
	```

3. Unlike other frameworks, Bootstruct doesn't create a server for you.	In your new project folder, create a `server-index.js` file with the following content: 
	```js
		var http = require('http');
		
		var boots = require('bootstruct');

		var app = boots();

		http.createServer(app).listen(1001, function(){
			console.log('Listening on port 1001');
		});
	```

4. Create a `www` folder. `www` is the web-root folder's default name (borrowed from other platforms). To change it you can start Bootstruct with:
	```js
		var app = boots('yourFolderName');
	```

5. This is how your project folder tree should look like:
	```
	├── myProject
	│   ├── node_modules
	│   ├── www
	│   └── server-index.js
	```
	
This is our starting point for this tutorial.




Basics
------
Create an `index.js` file in your web-root folder `www`.
```
├── www
│   └── index.js
```

Copy the following to `index.js`:
```js
module.exports = function (io) {
	
	io.res.end('hello beautiful world');

};
```

Start your server up:
```sh
	$ node server-index.js
```

Try requesting:  
1. /  
2. /whatever


When initialized, Bootstruct parses your web-root folder (recursively) and translates folders to URL controllers (starting with the web-root folder itself as the root-controller) and files to their methods.

Your `www` folder becomes your app's root-controller and `index.js` is its only method so ANY request will be responded with "hello beautiful world".

The `io` argument is an object that holds the native `request`/`response` so `io.res.end` should be clear now.

Let's add another method (a file): `greet.js`
```
├── www
│   ├── greet.js
│   └── index.js
```

`greet.js` contents:
```js
module.exports = function (io, who) {
	
	if (who) {
		io.res.end('hey ' + who);
	}
	else {
		io.res.end('hello everyone');
	}

};
```

Request => Response:
```
/greet     => hello everyone
/greet/you => hey you
```

Our "www" controller now has another method named "greet".

Bootstruct splits the URL pathname by slashes. On a request to `/A/B/C`, an array is created and holds `['A','B','C']`.

Bootstruct takes out this array's first item if it means something (i.e. stands for a controller name or a method name). In this case `greet` is taken out so we left with the `who` we want to greet.

>**NOTE**: The first argument is always an `io`.

Now let's create a file named "first.js":
```
├── www
│   ├── first.js
│   ├── greet.js
│   └── index.js
```

`www/first.js` contents:
```js
module.exports = function (io) {
	
	io.res.write('first! ');

	io.next();

};
```

Request => Response:
```
/          => first! hello beautiful world
/whatever  => first! hello beautiful world
/first     => first! hello beautiful world
/greet     => first! hello everyone
/greet/you => first! hey you
```

`first` is one of Bootstruct's reserved names for files and folders. `first`'s exported function will run before the other two (`index` and `greet`). Because `first` is a reserved name, it won't be parsed as a method like `greet` and requesting `/first` will be handled by `www/index.js` just like requesting `/whatever`.

`io.next()` is called to move the `io` forward in the chain. You call it at the end of your methods.




Debugging
---------
Bootstruct can be initiated with a second argument (the first is your web-root folder name e.g. "www"). The second argument is a debug-mode flag (default: false). Start your app with a second truthy value argument to see logs (in console) of the `io`'s different checkpoints along its way:
```js
	var app = boots('www', true);
```


What's next?
------------
You've just tasted Bootstruct's basics. Find out more about Bootstruct's main components (app, controllers, io), how to control your request flow (with Bootstruct's reserved entry names) and how to extend Bootstruct and use your own API (using hooks). [Read The Fabulous Manual](https://github.com/taitulism/Bootstruct/blob/master/Docs/README.md).
