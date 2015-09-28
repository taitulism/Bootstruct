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
		var app  = require('bootstruct')();  // <-- require and init

		http.createServer(app).listen(1001, function(){
			console.log('Listening on port 1001');
		});
	```

4. Create a `www` folder. `www` is the web-root folder's default name (borrowed from other platforms). To change it you can start Bootstruct with:
	```js
		var app = require('bootstruct')('yourFolderName');
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
	
	io.res.end('hello world');

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

Your `www` folder becomes your app's root-controller and `index.js` is its only method so any request will be responded with "hello world".

The `io` argument is an object that holds the native `request`/`response` so `io.res.end` should be clear now ([if not](link to Node docs))


>**NOTE**: IO.prototype is extendable. Read: io_proto hook.


Let's add another file: `greet.js`
```
├── www
│   ├── index.js
│   └── greet.js
```

`greet.js` contents:
```js
module.exports = function (io) {
	
	if (io.params[0]) {
		io.res.end('hey ' + io.params[0]);
	}
	else {
		io.res.end('hello everyone');
	}

};
```

Request/Response:
1. /greet     => hello everyone
2. /greet/you => hey you

Our "www" controller now has another method named "greet".

`io.params` is an array, the URL pathname split by slashes. On a request to `/A/B/C`, `io.params` will hold `['A','B','C']`.

>**NOTE**: Bootstruct ignores trailing slashes in URLs and merges repeating slashes (e.g. `/A//B//` is treated like `/A/B`).




Now let's create a folder named "A" and another "index.js" file inside it:
```
├── www
│   ├── A
│   │   └── index.js
│   ├── index.js
│   └── greet.js
```

`www/A/index.js` contents:
```js
module.exports = function (io) {
	
	io.res.end(this.id);

};
```

Request: `/A`  
Response: '/a'

By creating the "A" folder, we've actually created a controller, a sub-controller to our root-controller ("www"). The "this" keyword in methods refers to their holding controller object.

try logging `this.id` in `www/index.js`.





What's next?
------------
This page describes Bootstruct's most basic behavior. Find out more about flow control and how to customize Bootstruct. [Read the Docs](#docs).
