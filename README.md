Bootstruct
==========

>*Routing by structure.*

A folder-structure based routes for Node.js.


Overview
--------
Compared to Apache and IIS, Node seems to be missing a very usefull feature: the `www` folder, a folder that is "tied up" with your host root (or '/' in common Nodish) and on request, the corresponding target-folder's `index.js` file runs by default. Bootstruct brings this basic behavior to Node (and a lot more). It's kind of a make-sense-missing-layer in Node, IMHO.

To support routes like:

	domain.com/
	domain.com/foo
	domain.com/foo/bar

you don't need to write any code, just set up a `www` folder like:
```
├── myProject
│   ├── node_modules
│   ├── index.js               <── server index
│   └── www                    <── web server root directory
│       ├── index.js           <── called for all requests to: '/'
│       └── foo
│           ├── index.js       <── called for all requests to: '/foo'
│           └── bar
│               └── index.js   <── called for all requests to: '/foo/bar'
```

>NOTE: You can use `all.js` instead of `index.js` if you'd like.

From those `index.js` files export your handling functions:
```js
// index.js
module.exports = function (io) {
	/*
		'io' is explained later but just for now:
			io.req holds the request
			io.res holds the response
	*/

	io.res.write('Hello world');
	io.res.end();
};
```

Bootstruct:
* saves you from coding your routes
* enforces a natural code seperation by concept
* provides you with nice RESTfull URLs out of the box




What else?
----------
Running the index file on a requested folder is only a small part of what Bootstruct provides you with.

Supporting different HTTP verbs (GET, POST, PUT, DELETE) is as easy as creating a `get.js` file or a `post` folder.

>NOTE: Verb methods will run on the target-folder only.

In other frameworks the code that you write first will be the first to run. With Bootstruct the name of the file or folder in which you put your code in is what matters. Bootstruct has some reserved names for files and folders (like the `index` and `all` mentioned above) and when created, play a certain role in this "on request" play. Most of these reserved names, as you'll see in a moment, are very self explanatory (like `first`, `last`, `after` etc.).

>NOTE: The 4 HTTP verbs mentioned above are also reserved names for file and folders.

Read Bootstruct's manual for more.




Why using Bootstruct?
---------------------
Because you are tired of setting up your app's routes every time you start a new project.

Wether you're:
```
//  on vanilla Node-Mode:
if (request.url == '/foo'){
	if (request.method == 'GET') {
		// ...
	}
}

// or using express/connect:
app.get('/foo', function () {
	// ...
});
```

// or a Hapi server:
server.route({
	method: 'GET',
	path: '/foo',
	handler: function () {
		// ...
	}
});
```
or whatever. That's some tedious work to do when all you wanted is to wire up some URLs to their handler functions.
With Bootstruct - none of these. No new syntax to learn. No code involved.




What's next?
------------
	Read The Fabulous Manual