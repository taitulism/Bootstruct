
Bootstruct
==========
>*"Routing by structure"*  
A name-convention framework for Node.js

Table of contents
-----------------

  * [Get started](#get-started)
  * [Overview](#overview)
  * [Controllers](#controllers)
	* [get, post, put, delete](#get-post-put-delete)
  	* [index](#index)
  	* [first & last](#first--last)
  	* [verbs](#verbs)
  * [io](#io)
	* [io.params](#ioparams)
  	* [io other props](#io-other-props)
  * [Summary](#summary)
  	* [The Shorter Version](#the-shorter-version)
  	* [Important notes](#important-notes)


Get started
-----------

1. Start a new project: Create a folder with an extra ordinary name like: "myApp".

2. Install Bootstruct: 
	```sh
		$ npm install bootstruct
	```
	If this means nothing to you, welcome to Node!
3. In your project's folder, create a `server.js` file with the following content:
	```js
		var http = require('http');
		var bts  = require('bootstruct');


		// create a new Bootstruct app from `myApp` folder 
		var app = bts('myApp');


		// create a server and use `app` as its handler function
		http.createServer(app).listen(1001, function(){
			console.log('Listening on port 1001');
		});
	```
4. Create a folder named `app` in your project's folder.

5. Inside `app`, create a file named `get.js` and make it export a single function that accepts a single argument:
	```js
		module.exports = function (io) {
			io.res.end('hello beautiful world');
		};
	```
	`io` is an object that holds the native request/response as properties:  
	&nbsp; &nbsp; &nbsp; `io.req`  
	&nbsp; &nbsp; &nbsp; `io.res`  
	Both by reference, untouched.  
	If you used Node before, the `io.res.end` part should be very clear now.

6. Start your server up:  
	```
		$ node server.js
	```

** You're now ready for GET requests to `yourdomain.com:1001/` **

>NOTE: You can use `post`, `put` and `delete` (.js) as well. They are all reserved names for files and folders in Bootstruct.




#Overview
---------
With Bootstruct you structure your files and folders in a certain way to get a certain behavior.
To support routes like:

	domain.com/
	domain.com/foo
	domain.com/foo/bar

you don't need to learn any new syntax, just structure your files and folders like this:
```js
.
├── node_modules
├── app            <──
│   ├── index.js
│   └── foo
│       ├── index.js
│       └── bar
│           └── index.js
│
├── index.js 
└── package.json
```

**The `index.js` file will run only in the requested folder.**


If you're familiar with express/connect, the equivalent would be:

```js
// NOT Bootstruct! express/connect equivalent:
app.all('/', function () {
	// ...
});

app.all('/foo', function () {
	// ...
});

app.all('/foo/bar', function () {
	// ...
});

```

"Coding by convention" or "configuration over code" or whatever. They are all fine and it's all a matter of personal taste and project's needs.  
Bootstruct does it with names convention. "Routing by structure" if you'd like.

As such, learning Bootstruct is more about file-names, folder-names and folder-structure than code and syntax. Understand Bootstruct's flow.


As your app scales up, you can turn your files into folders. If the `get.js` file from the [Get started](#get-started) example would get bigger, you could replace it with a `get` folder containing an `index.js` file with whatever contents the original `get.js` file had. Anyway this is going to be "require"d as the folder's `get` method.

>NOTE: This is why Bootstruct doesn't matter if it's a file or a folder and in these docs files and folders are referred as **"entries"**.

You probably want to support different types of request methods individually, don't you?
Well, just add verb-entries where you need them (for example a `get.js` file or a `post` folder).

>NOTE: `index.js` is called before all verbs (when exists).

Bootstruct provides you with an even greater controll on requests' flow. The `index` and the verb entries only run for the requested folder (or the target folder). On a request to `/foo/bar`, `bar` is the target folder and requests are just "passing by" its parent folders `app` and `app/foo`.

If you want a folder to do something even if it's not the target folder, create a `first` entry in it. It will run for every request this folder was called in, even if it's not the target folder.

`first` is called in a folder when a request comes in whether or not this folder is the target folder or should the request be passed on. `first` is called when a request "checks-in" at a folder and `last` is called when it "checks-out", after the target folder is done with its `index` and verb files.

All of these special names we give our entries are reserved entry names in Bootstruct and play a cretain roll in your app's flow.

###Reserved Entry Names:
	1. first
	2. index
	3. get
	4. post
	5. put
	6. delete
	7. last

Entries with custom names (e.g. `foo`, `bar`) are parsed as Bootstruct controllers.



#Controllers
------------
A controller is an object that is parsed out from a folder. You can say it's a kind of a representation of a folder.
Folder's entries become controller's sub-controllers and methods.
Bootstruct builds its controller objects when it initializes (on require).
The Root-Controller (RC) is a javascript object that Bootstruct parses out from the `app` folder.
Let's say that when the `app` folder is empty - RC is empty:
```js
RC = {} // empty object
```

and when we create `index` and `get` entries inside it:
```js
RC = {
	index: fn
	get: fn
}
```

Controllers can have sub-controllers as folders can have sub-folders.

Example structure:
```
.
├── app
	├── get.js
	└── foo
		└── get.js
```

In a "let's-say" code:
```js
RC = {
	get: fn
	sub_controllers: {
		foo: {
			get: fn
		}
	}
}
```

>NOTE: `foo` will be parsed as a sub-controller of RC because `foo` is not a reserved entry name.

If you'd log the current filename in both `get.js` files:
```js
module.exports = function (io) {
	console.log(__filename);
	io.res.end();
};
```
and run the following GET requests:  

1. /
2. /foo
3. /foo/bar

You should get these logs:  

1. .../app/get.js
2. .../app/foo/get.js
3. .../app/foo/get.js

When addressing the root, the RC's `get` will run.
When addressing `foo`, foo's `get` will run.
When addressing a `bar` (which doesn't exist), `get` will run in the last controller found (`foo`).

>__IMPORTANT NOTE__: The last controller found in the URL parts is the only controller that also runs its `index` and verb methods. All of its parent-controllers only run their wrapping methods, `first` and `last`.




get, post, put, delete
----------------------
These 4 verb names are reserved for entries that exports functions, like in the get-started example.
These are some of the methods a controller can have.
For code separation you could use folders with these names as well, just make sure to export your function from an `index.js` file within.

Example structure:
```
.
├── app
    ├── get.js
    ├── post
    │   ├── module.js
    │   └── index.js
	├── put.js
	└── delete.js
```

Example file:
```js
module.exports = function (io){
	// do your thing...

	io.res.end();
};
```



index
-----
`index` works the same and should also export a function. Controllers run their `index` method before any kind of verb.

Example structure:
```
.
├── app
    ├── index.js
    ├── get.js
    └── post.js
```

`index.js` contents:
```js
module.exports = function (io) {
	io.res.write('from index \n');

	// explained later but might ring a bell
	io.next();
};
```

`get.js` contents:
```js
module.exports = function (io) {
	io.res.end('from get');
};
```

`post.js` contents:
```js
module.exports = function (io) {
	io.res.end('from post');
};
```

On a `GET` request to `'/'` the response would be:
```
from index
from get
```
On a `POST` request it would be:
```
from index
from post
```

The `index` method runs before any verb does. When you're done in `index` you use `io.next` to make Bootstruct call the next method in line: the verb method.




first & last
------------
These, as their names suggest, will be called before and after the `index` and the verb methods as intuitively expected. `first` runs before the `index`.  
`last` runs after the verb.

Example structure:
```
.
├── app
    ├── first.js
    ├── index.js
    ├── get.js
    └── last.js
```

Export the same function in all files:
```js
module.exports = function (io) {
	console.log(__filename);
	io.next();
};
```
On a GET request to '/' you'll get the following logs, in this order:
	path/.../app/first.js
	path/.../app/index.js
	path/.../app/get.js
	path/.../app/last.js




verbs
-----
For an even better code separation, you could move all of your verbs into a `verbs` folder.  
When you'll have sub-controllers in the same containing folder, adding a `verbs` folder would be more easy on the eye. `verbs` is only a namespace for verb files so it should always be a folder.

Example structure:
```
.
├── app
    ├── verbs
	│   ├── index.js
	│   ├── get.js
	│   ├── post.js
	│   ├── put.js
	│   └── delete.js
	├── foo
	│   ├── ...
	│   └── ...
	├── bar
	│   ├── ...
	│   └── ...
```




















#methods
********
Excluding `verbs`, entries with **reserved** names being translated into Bootstruct's **known methods** and Bootstruct runs them in a certain order (`first`, `last` etc.).
Bootstruct treats entries with **NON-reserved** names as sub-controllers or **custom methods** of the current controller.
Methods are just functions that handle the `io`. They could be a file or a folder (with an `index.js` file). Anyways, you should export that function because it's gonna be `require`d by a controller.
Methods in Bootstruct are like single-method-controllers, the `index` and they also have no sub-controllers.

>NOTE: if a folder contains an `index.js` file, or in other words: if a controller has an `.index` method, it will be the only method to run the `io`. Reserved entry names means nothing to Bootstruct when an `index.js` is found in the same folder.


Example structure:
```
.
├── app
	├── first.js
	├── foo
	│	└── get.js
	├── bar.js
	└── last.js
```

`bar.js` is a non-reserved name file so it should export a function that handles an io.

Let's say this function also logs the file's path, same as before.
So on request to:
	/bar

you'll see these logs:

	.../app/first.js
	.../app/bar.js
	.../app/last.js


>NOTE: You might want to use custom method files (e.g. `bar`) for simple stuff like handling a simple "about" page (`about.js`).




#io
***
`io` is an object that is being created on each request and being passed through your app's routes.
It holds the `request` and the `resonse` objects (`io.req` and `io.res`) and a `.next()` method to pass it to its next checkpoint.
Think of a flow chart that describes your app different possible routes. `io` is the object that walks along those routes.

```
	   (request,response)
		    └──┬──┘
		       │
function root (io) {
		   ┌───┘
	first(io)
		   │
	GET  (io)
		   │
	last (io)
}	       │
		   │

```




io.params
---------
Bootstruct refers the different URL parts as parameters so it splits the URL (pathname only, not the queryString) by slashes and stores the returned array in `io.params`.

Bootstruct also:  
* merges repeating slashes  
* trims slashes (preceding & trailing)

On request to: 
`http://yourdomain.com/aaa/bbb/ccc?flag=1&type=normal`

it'll be equal to: `['aaa', 'bbb', 'ccc']`.

Then Bootstruct checks the first parameter and if you have a controller with that name (e.g. `aaa`), it will handle the request only after removing its name from `io.params`. At this stage `io.params = ['bbb', 'ccc']`. Then the next param is being checked against an existing sub-controller (e.g. is there a folder name `bbb` inside `aaa`).


Considering Bootstruct's nature, this is how Bootstruct routes the io through your different folders/controllers structure: It always checks the next item in `io.params` for a matching controller's name.

Every time an io "checks-in" at a controller (with RC as an exception), the controller removes its name from the `io.params` array. It's always the first item.
On `foo` controller check-in, io.params changes: `[foo, bar, baz] ===> [bar, baz]`.  
Then the controller (starting with the RC) checks the first item:  
* If it has a sub-controller with a matching name (e.g. `foo`), it will pass the io to that sub-controller for another "check-in".  
* if there is no sub-controller with that name (e.g. `bar`), what's left in io.params is for you to handle as requests' parameters.

Example structure (same as the last one):
```
.
├── app
	├── get.js
	└── foo
		└── get.js
```

Run these 2 requests:
1. /bar
2. /foo/bar

You should get:	
1. path/.../app/get.js  
   Params: [bar]

2. path/.../app/foo/get.js  
   Params: [bar]




io other props
--------------
* io._ctrl     - (internal) The current handler
* io._profiles - (internal) io's state in all controllers




#Summary
********
Consider a structure:
```
.
├── app
	├── first.js
	├── index.js
	├── get.js
	├── last.js
	└── foo
		├── first.js
		├── index.js
		├── get.js
		├── last.js
		└── bar
			├── first.js
			├── index.js
			├── get.js
			└── last.js
```

>NOTE: This is a full use case. You don't have to use all of the controller's possible methods for every folder.

Consider all of these files contain:
```js
module.exports = function (io) {
	console.log(__filename);
	io.next();
};
```
All functions logs the filename they're exported from and moves on.

The following are examples of requested URLs (GET requests) and their expected logs given the above structure:
```
url: /
logs: 
    app/first
	app/index
	app/get
	app/last
```
```
url: /foo
logs:
    app/first
	app/foo/first
	app/foo/index
	app/foo/get
	app/foo/last
	app/last
```
```
url: /foo/bar
logs: 	
    app/first
	app/foo/first
	app/foo/bar/first
	app/foo/bar/index
	app/foo/bar/get
	app/foo/bar/last
	app/foo/last
	app/last
```

>NOTE: Do you see the onion-like layers? me too!

A pseudo javascript object that describes your root-controller for this case would be:
```js
RC = {
	first: fn,
	sub_controllers: {
		foo: {
			first: fn,
			sub_controllers: {
				bar: {
					first: fn,
					sub_controllers: {},
					verbs: {
						index: fn,
						get: fn
					},
					last : fn
				}
			}
			verbs: {
				index: fn,
				get: fn
			},
			last : fn
		}
	},
	verbs: {
		index: fn,
		get: fn
	},
	last : fn
}
```




The Shorter Version
-------------------
This is what happens for every request. Mind the loop:

1. Check-in: Controllers run their `first` method.
2. Controllers check the next URL part. Is there a matching sub-controller?  
	&nbsp; &nbsp; &nbsp; If so, the controller passes the `io` to that sub-controller for a check-in. **Back to 1**.  
	&nbsp; &nbsp; &nbsp; If not, current controller is the target-controller. It will run its `index` method and then its `verb` method.
3. Check-out: Controllers run their `last` method.
4. Controllers pass the `io` back to their parent controller for a check-out. **Back to 3**.





Important notes:
----------------
* Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and file names.
* Bootstruct ignores trailing slashes in URLs.
* Bootstruct ignores entries that their names start with an underscore and doesn't parse them (e.g. `_ignored.js`).
* You can use the `io` to hold different properties through its cycle.
* The context of the `this` keyword inside method functions refers to the current controller object.
  Each controller has a name (like `bar`) and a unique ID which is its folder path (e.g. `app/foo/bar`).  
  Try to log `this.name` and `this.id` in your different methods.
* Bootstruct haven't been tested for production environment. Yet.

More to come.

****
Questions, suggestions, bugs, hugs, criticism or kudos are all welcome.

*taitulism(at)gmail(dot)com*
