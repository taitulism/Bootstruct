Bootstruct
==========

>*Routing by structure.*

A name-convention framework for Node.js

Get started
-----------

1. Install Bootstruct in a new folder: 
	```sh
		$ npm install bootstruct
	```

2. Create an `index.js` file and an `app` folder.

3. Copy the following to your `index.js` file:
	```js
		var http = require('http');
		var bts  = require('bootstruct');


		// this creates a new Bootstruct app from `app` folder 
		var app = bts('app');


		// create a server and use `app` as its handler function
		http.createServer(app).listen(1001, function(){
			console.log('Listening on port 1001');
		});
	```

4. Inside `app` folder, create a `get.js` file with the following content:
	```js
		module.exports = function (io) {
			io.res.end('hello beautiful world');
		};
	```

5. Start your server up:  
	```
		$ node index.js
	```

**You're now ready for GET requests to `yourdomain.com:1001/`**

>NOTE: You can use `post`, `put` and `delete` (.js) as well. They are all reserved names for files and folders in Bootstruct.




Table of contents
-----------------

  * [Get started](#get-started)
  * [Overview](#overview)
  * [get, post, put, delete](#get-post-put-delete)
  * [A "stale" folder](#a-stale-folder)
  * [Scale It Up](#scale-it-up)
  * ['verbs' folder](#verbs-folder)
  * [first & last](#first--last)
  * [Reserved Entry Names](#reserved-entry-names)
  * [io](#io)
	* [io.params](#ioparams)
  	* [io other props](#io-other-props)
  * [Bootstruct Flow](#bootstruct-flow)
  * [The Shorter Version](#the-shorter-version)
  * [Important notes](#important-notes)




intro
-----
"Coding by convention" or "configuration over code" or whatever. They are all fine and it's all a matter of personal taste and project's needs.  
Bootstruct does it with names convention. "Routing by structure" if you'd like.

As such, learning Bootstruct is more about understanding how it reads your folder-structure and behave based on this structure than code and syntax.




Overview
--------
What Bootstruct does?

	* Bootstruct saves you from coding your routes
	* Bootstruct enforces a good code seperation by design
	* Bootstruct gives you intuitive control over requests' flow 
	* Bootstruct provides you with nice RESTfull URLs


To support routes like:

	domain.com/
	domain.com/foo
	domain.com/foo/bar

you don't have to write any code but the handler functions themselves. Just structure your app folder like the following and export your handlers from the `index.js` files like in the [Get started](#get-started) example above:
```
├── app
│   ├── index.js           <── called for all requests to: '/'
│   └── foo
│       ├── index.js       <── called for all requests to: '/foo'
│       └── bar
│           └── index.js   <── called for all requests to: '/foo/bar'
```

If you're familiar with express/connect, the equivalent would be:

```js
// NOT Bootstruct! **express/connect** equivalent:
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




get, post, put, delete
----------------------
You probably want to be more specific about different types of request methods. Just add verb-files where you need them (e.g. `get.js`, `post.js`):

```
├── app
│   ├── index.js           <── called for ALL  requests to: '/'
│   ├── get.js             <── called for GET  requests to: '/'
│   └── foo
│       ├── index.js       <── called for ALL  requests to: '/foo'
│       ├── get.js         <── called for GET  requests to: '/foo'
│       ├── post.js        <── called for POST requests to: '/foo'
│       └── bar
│           └── index.js   <── called for ALL  requests to: '/foo/bar'
```

You don't have to use an `index.js`:
```
├── app
│   ├── get.js            <── called for GET  requests to: '/'
│   └── foo
│       ├── get.js        <── called for GET  requests to: '/foo'
│       ├── post.js       <── called for POST requests to: '/foo'
│       └── bar
│           └── get.js    <── called for GET  requests to: '/foo/bar'
```

If an `index.js` exists it will run before the verb and they are both called only for the target folder. The target folder is the last folder whose name found in the request pathname (e.g. `bar` on request to: `/foo/bar`).

**express/connect** equivalent would be:

```js
// NOT Bootstruct! express/connect equivalent:
app.all('/', function () {
	// ...
});

app.get('/', function () {
	// ...
});

app.all('/foo', function () {
	// ...
});

app.get('/foo', function () {
	// ...
});

app.post('/foo', function () {
	// ...
});

app.all('/foo/bar', function () {
	// ...
});

```




A "stale" folder
----------------
If `bar`, for example, is a "stale" folder (has no sub-folders and no other methods but `index`), you can cut the overhead of a folder and turn it into a file:

Before:
```
├── app
│   ├── index.js
│   └── foo
│       ├── index.js
│       └── bar          <── folder
│           └── index.js
```

After:
```
├── app
│   ├── index.js
│   └── foo
│       ├── index.js
│       └── bar.js       <── file
```




Scale It Up
-----------
If any method file gets bigger, turn it into a folder:

Before:
```
├── app
│   ├── index.js
│   ├── get.js
│   ├── post.js     <── file
│   ├── put.js
│   └── delete.js
```

After:
```
├── app
│   ├── index.js
│   ├── get.js
│   ├── post        <── folder
│   │   ├── index.js
│   │   ├── dependency_1.js
│   │   └── dependency_2.js
│   ├── put.js
│   └── delete.js
```




'verbs' folder
--------------
If you use all verbs, having multiple sub-folders can hurt your eyes:
```
├── app
│   ├── about
│   ├── contact
│   ├── delete.js
│   ├── get.js
│   ├── index.js
│   ├── messages
│   ├── post.js
│   ├── profile
│   └── put.js
```

For the sake of your eyes, you can use a `verbs` folder, just as a namespace to contain the verbs entries:
```
├── app
│   ├── about
│   ├── contact
│   ├── index.js
│   ├── messages
│   ├── profile
│   └── verbs          <──
│       ├── get.js
│       ├── post.js
│       ├── put.js
│       └── delete.js
```




first & last
------------
As we saw earlier, the `index` and the verb entries (files or folders) only run for the target-folder.

If you want a folder to do something even if it's not the target-folder but its name was addressed in the request (e.g. `foo` in `foo/bar`), you could use 2 other methods: `first` and `last`. Both are called when a folder is requested whether or not it's the target-folder or should the request be passed on. `first` is called before the target-folder is done with its `index` and the verb method. `last` is called after the target-folder is done.

```
├── app
│   ├── index.js
│   ├── get.js
│   └── foo
│       ├── first.js        <──
│       ├── index.js
│       ├── get.js
│       ├── post.js
│       ├── bar
│       │   ├── first.js    <──
│       │   ├── index.js
│       │   └── last.js     <──
│       └── last.js         <──
```

We'll see how these `first` and `last` methods fit in the flow in a sec.




Reserved Entry Names
--------------------
All of these names are all reserved names for entries (files or folders) in Bootstruct. You name your entries with these names and get a certain behavior.

```
	1. first  - first thing to run in a folder
	2. verbs  - just a namespace folder to hold your verb handlers
	3. index  - called on all      HTTP requests   ─┐
	4. get    - called on `GET`    HTTP requests    │
	5. post   - called on `POST`   HTTP requests    ├─ on target folder only
	6. put    - called on `PUT`    HTTP requests    │
	7. delete - called on `DELETE` HTTP requests   ─┘
	8. last   - last thing to run in a folder
```

_Custom_ named entries (like `foo` or `bar`) become controllers which are URL namespace handlers for requests containing their name (e.g. `/foo` and `/foo/bar`).

Reserved entry names are parsed as those controllers' different methods and they are called when needed according to their role listed above. Methods expected to export a single function that accept `io` as a single argument (see [Get started](#get-started) for an example) and they pass this `io` from one to another.

An example of a **pseudo** object that describes `foo` controller with a `bar` sub-controller:
```js
var foo = {
	first: require('foo/first'),
	index: require('foo/index'),
	verbs: {
		get: require('foo/get'),
		post: require('foo/post'),
	},
	subControllers: {
		bar: {
			first: require('foo/bar/first'),
			index: require('foo/bar/index'),
			verbs: {
				get: require('foo/bar/get'),
				post: require('foo/bar/post'),
			},
			subControllers: null,
			last: require('foo/bar/last')
		}
	},
	last: require('foo/last')
};
```
Something very similar is generated on Bootstruct init, when your `app` folder is being parsed.




io
--
**express/connect** middleware functions accept 2-3 arguments: `request`, `response` and `next`.  
Bootstruct methods handles only a single argument: `io`.  
`io` is an object that holds the native request/response as properties and a `next` method (and more):  
&nbsp; &nbsp; &nbsp; `io.req`  
&nbsp; &nbsp; &nbsp; `io.res`  
Both by reference, untouched.  

`io.next()` is for you to call from within your methods when they are done and the `io` is ready for the next method.

With **express/connect**:

```js
// NOT Bootstruct!
app.get('/foo', function(req, res, next){
	res.send('hello world');

	next();
});
```

With **Bootstruct**:
```js
// file: /app/foo/get.js
module.exports = function (io) {
	io.res.send('hello world');

	io.next();
};
```




io.params
---------
Bootstruct refers the different URL parts as parameters so it splits the URL by slashes (pathname only) and stores the returned array in `io.params`.

On request to: `/foo/bar/aaa/bbb`

`io.params` starts as: `['foo', 'bar', 'aaa', 'bbb']`.

Starting at your `app` folder, Bootstruct uses `io.params` to check if `app` folder is the target-folder by checking the first item for an existing sub-folder. If the first item (e.g. `foo`) is a sub-folder, `app` is not the target. Next, `foo` removes its name from `io.params` (always the first item) and checks the new first item (e.g. `bar`) for a sub-folder and so on. This way the target-folder (`bar`) is left with the params that are not controllers in your app (e.g. `['aaa', 'bbb']`).

A Request to: `/foo/bar/john`:  
with **express/connect**:
```js
// NOT Bootstruct!
app.get('/foo/bar/:name', function(req, res, next){
	console.log(req.params.name); // --> 'john'
	
	next();
});
```

and with **Bootstruct**:
```js
// file: .../app/foo/bar/get.js
module.exports = function (io) {
	console.log(io.params[0]); // --> 'john'
	
	io.next();
};
```




io other props
--------------
* io._ctrl     - (internal) The current handling controller
* io._profiles - (internal) io's state in all controllers




Bootstruct Flow
---------------
Consider a structure:
```
├── app
│   ├── first.js
│   ├── index.js
│   ├── get.js
│   ├── last.js
│   └── foo
│       ├── first.js
│       ├── index.js
│       ├── get.js
│       ├── last.js
│       └── bar
│           ├── first.js
│           ├── index.js
│           ├── get.js
│           └── last.js
```
There are 3 levels of nested folders as before: `app/foo/bar`.
Each has the following methods:
* `first`
* `index`
* a verb (`get`)
* `last`

>NOTE: This is a full use case. You don't have to use all of the possible methods for every folder.

Consider all of these files contain:
```js
module.exports = function (io) {
	console.log(__filename);
	io.next();
};
```
i.e. logs the current file path and moves on to the next method. This will make Bootstruct's flow "visible" to you.

The following are examples of different requests supported by the given structure (GET requests only) and their expected logs.

>NOTE: To make it more easy on the eye, preceding `long/path/to/app` and `.js` extensions were removed from the log.

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




The Shorter Version
-------------------
This is what happens for every request. Mind the loop:

1. **Check-in**: A folder run its `first` method.
2. **Check: IsTarget?**: Bootstruct checks the next URL part. Is there a matching sub-folder in the current one?  
	&nbsp; &nbsp; &nbsp; **If so**, the folder passes the `io` to that sub-folder for a check-in. **Back to 1**.  
	&nbsp; &nbsp; &nbsp; **If not**, current folder is the target-folder. It will run its `index` method and its `verb` methods.
3. **Check-out**: The folder run its `last` method.
4. the folder passes the `io` back to its parent folder for a check-out. **Back to 3**.




Important notes:
----------------
* Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and file names.
* Bootstruct ignores trailing slashes in URLs and merges repeating slashes.
* Bootstruct ignores entries that their names start with an underscore and doesn't parse them (e.g. `_ignored.js`).
* You can use the `io` to hold different properties through its cycle.
* The context of the `this` keyword inside method functions refers to the current controller object.
  Each controller has a name (like `bar`) and a unique ID which is its folder path (e.g. `app/foo/bar`).  
  Try to log `this.name` and `this.id` in your different methods.
* Bootstruct haven't been tested for production environment. Yet.

More to come.

***********************************************************************
Questions, suggestions, bugs, hugs, criticism or kudos are all welcome.

*taitulism(at)gmail(dot)com*







































