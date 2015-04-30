
Bootstruct
==========
>*"Routing by structure"*
A name-convention framework for Node.js

Get started
-----------

0. Start a new project: Create a folder with a special name.

1. Install Bootstruct: 
```sh
	$ npm install bootstruct
```
2. In your project's folder, create a `server.js` file with the following content:  
```js
	var http = require('http');
	var bts  = require('bootstruct');

	http.createServer(bts).listen(8080, '127.0.0.1');
```
3. Create a folder named `app` in your project's folder. The name "app" is a must.

4. Inside `app`, create a file named `get.js` and make it export a single function that accepts a single argument:
```js
	module.exports = function (io) {
		io.res.end('hello beautiful world');
	};
```
5. Start your server up:
```sh
$ node server.js
```

**You're now ready for GET requests to yourdomain.com:8080/**


General
-------
To support routes like:

	domain.com/
	domain.com/foo
	domain.com/foo/bar

you don't need to write any code, just structure your folders like:

```js
[app]
	[foo]
		[bar]
```
>NOTE: Square brackets stand for folders.

To handle requests of different kinds of HTTP verbs, add verb files. add a `get.js` file for `GET` requests:
```
[app]
	get.js
	[foo]
		get.js
		[bar]
			get.js
```
>NOTE: You can use `post`, `put` and `delete` (.js) as well. They are all reserved names for files and folders in Bootstruct.

With Bootstruct you structure your files and folders in a certain way to get a certain behavior.

```js
// NOT Bootstruct.
// express/connect equivalent:
app.get('/', function () {
	// ...
});

app.get('/foo', function () {
	// ...
});

app.get('/foo/bar', function () {
	// ...
});
```

Example explained
-----------------
1. If `npm install bootstruct` means nothing to you, welcome to Node!  
2. When Bootstruct is required it initializes and returns a function to the `bts` variable.
	 We pass this function to be used as the server's callback to run on every incoming request.
	 For every request the callback function gets called with the `request` and the `response` as arguments.
```js		
		// Pseudo code
		http.createSrever( fn(request, response){...} )
```
3. When Bootstruct initializes, it looks for a folder named `app` in your project's folder and parses it.  
	 Bootstruct counts this folder as your main router or the root-controller that handles all requests.
	 
4. When you've created that `get.js` file, you've actually binded its exported function to run on HTTP GET requests only. By placing it under the `app` folder (the root-controller) you make it the handler of all GET requests sent to yourdomain.com/.
The function that `get.js` file exports is called when a GET request is made to `yourdomain.com` (or `'/'` in common Nodish).
When called, it accepts a single argument `(io)`. This io holds the native request/response as properties:  
	io.req  
    io.res  
Both by reference, untouched.
If you used Node before, the `io.res.end` part should be very clear now.

5. Your app can now accept requests to `'/'`.  
	 You should get `hello beautiful world` in response.


>NOTE: The following is more about file-names, folder-names and folder-structure than code and syntax.



Reserved Entry Names
--------------------
Bootstruct has a few reserved meaningful names for files and folders (or "entries").  
1. app  
2. first  
3. all  
4. verbs  
5. get  
6. post  
7. put  
8. delete  
9. last  

>NOTE: We've already covered 5 of them.

These names, when given to an entry (a file or a folder) plays a certain roll in your app's flow.


app
---

`app` is reserved only in your project's folder. The folder named `app` in project's folder is what Bootstruct creates its root-controller from.

Example structure:
```
[my_special_project] 
	[app]            ===> root-controller
	server.js
	package.json
```

get, post, put, delete
----------------------

These 4 verb names are reserved for entries that exports functions, like in the get-started example.
These are some of the methods a controller can have.
For code separation you could use folders with these names as well, just make sure to export your function from an `index.js` file within.

Example structure:
```
[app]
	get.js
	[post]
		module.js
		index.js
	put.js
	delete.js
```

Example file:
```js
module.exports = function (io){
	// do your thing...

	io.res.end();
};
```

all
---
`all` works the same and should also export a function. Controllers run their `all` method before any kind of verb.

Example structure:
```
[app]
	all.js
	get.js
	post.js
```

`all.js` contents:
```js
module.exports = function (io) {
	io.res.write('from all \n');

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
from all
from get
```
On a `POST` request it would be:
```
from all
from post
```

The `all` method runs before any verb does. When you're done in `all` you use `io.next` to make Bootstruct call the next method in line: the verb method.


first & last
------------
These, as their names suggest, will be called before and after the `all` and the verb methods as intuitively expected. `first` runs before the `all`.  
`last` runs after the verb.

Example structure:
```
[app]
	first.js
	all.js
	get.js
	last.js
```

Export the same function in all files:
```js
module.exports = function (io) {
	console.log(__filename);
	io.next();
};
```

Your `last` will run last (of course) so there's no need to call `io.next` from there.
Instead, end the response:

`last.js` contents:
```js
module.exports = function (io) {
	console.log(__filename);
	io.res.end();
};
```
On a GET request to '/' you'll get the following logs, in this order:
	path/.../app/first.js
	path/.../app/all.js
	path/.../app/get.js
	path/.../app/last.js


verbs
-----
For an even better code separation, you could move all of your verbs into a `verbs` folder.  
When you'll have sub-controllers in the same containing folder, adding a `verbs` folder would be more easy on the eye. `verbs` is only a namespace for verb files so it should always be a folder.

>NOTE: The `all` method can also be in the `verbs` folder.

Example structure:
```
[app]
	[verbs]
		[post]
		[put]
		[get]
		[delete]
		all.js
	[foo]
		...
	[bar]
		...
```

Controllers
-----------
A controller is an object that is parsed out from a folder. You can say it's a kind of a representation of a folder.
Folder's entries become controller's sub-controllers and methods.
Bootstruct builds its controller objects when it initializes (on require).
The Root-Controller (RC) is a javascript object that Bootstruct parses out from the `app` folder.
Let's say that when the `app` folder is empty - RC is empty:
```js
RC = {} // empty object
```

and when we create `all` and `get` entries inside it:
```js
RC = {
	all: fn
	get: fn
}
```

Controllers can have sub-controllers as folders can have sub-folders.

Example structure:
```
[app]
	get.js
	[foo]
		get.js
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

>__IMPORTANT NOTE__: The last controller found in the URL parts is the only controller that also runs its `all` and verb methods. All of its parent-controllers only run their wrapping methods, `first` and `last`.


io.params
---------
On request, Bootstruct splits the requested URL (the pathname) by slashes and stores the returned array on the io as io.params.

When request.url is:
```
/foo/bar/baz
```

io.params will hold 3 items:
```
[foo, bar, baz]
```

>NOTE: Bootstruct uses io.params itself so treat io.params as "read-only".

Considering Bootstruct's nature, this is how Bootstruct routes the io through your different folders/controllers structure: It always checks the next item in io.params for a matching controller's name.

Every time an io "checks-in" a controller (with RC as an exception), the controller removes its name from the `io.params` array. It's always the first item.
On `foo` controller check-in io.params changes: `[foo, bar, baz] ===> [bar, baz]`.  
Then the controller (starting with the RC) checks the first item:  
* If it has a sub-controller with a matching name (e.g. `foo`), it will pass the io to that sub-controller for another "check-in".  
* if there is no sub-controller with that name (e.g. `bar`), what's left in io.params is for you to handle as requests' parameters.

Example structure (same as the last one):
```
[app]
	get.js
	[foo]
		get.js
```

Run these 2 requests:
1. /bar
2. /foo/bar

You should get:	
1. path/.../app/get.js  
   Params: [bar]

2. path/.../app/foo/get.js  
   Params: [bar]


io.urlObj
---------
The io also holds a `urlObj` property which is and object, the result of Node's native url.parse() of the current URL.

>NOTE: url.parse() returns an object that is similar to the window.location object. It's called with a `true` flag what makes the query-string parsed as a key-value object. 

So when requesting:
`yourdomain.com?aaa=111&bbb=222`

io.urlObj.query equals to:
```js
io.urlObj.query = {
	aaa : 111,
	bbb : 222
}
```

io.urlObj.split
---------------
Bootstruct adds a usefull property to the above `io.urlObj`. It splits the URL (the pathname) by slashes and stores the returned array as `io.urlObj.split`.

On request to: 
`yourdomain.com/aaa/bbb`

io.urlObj.split equals to:`['aaa', 'bbb']`

misc
----
* io.method   - Lowercased request method (e.g. `get`)
* io.VERB     - Uppercased request method (e.g. `GET`)
* io.ctrl     - (internal) The current handler
* io.profiles - (internal) io's state in all controllers



********
#Summary
Consider a structure:
```
[app]
	first.js
	all.js
	get.js
	last.js
	[foo]
		first.js
		all.js
		get.js
		last.js
		[bar]
			first.js
			all.js
			get.js
			last.js
```

>NOTE: This is a full use case. You don't have to use all of the controller's possible methods for every folder.

Consider all of these files contain:
```js
module.exports = function (io) {
	console.log(__filename);
	io.next();
};
```
All functions logs the filename they're exported from and moves on, except for `app/last.js`. This is the last method to run so it doesn't need to call `io.next`. Instead, it should end the response with `io.res.end()`.

The following are examples of requested URLs (GET requests) and their expected logs given the above structure:
```
url: /
logs: 
    app/first
	app/all
	app/get
	app/last
```
```
url: /foo
logs:
    app/first
	app/foo/first
	app/foo/all
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
	app/foo/bar/all
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
						all: fn,
						get: fn
					},
					last : fn
				}
			}
			verbs: {
				all: fn,
				get: fn
			},
			last : fn
		}
	},
	verbs: {
		all: fn,
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
		If so, the controller passes the io to that sub-controller for a check-in. **Back to 1**.  
		If not, current controller is the target-controller. It will run its `all` method and then its `verb` method.
	3. Check-out: Controllers run their `last` method.
	4. Controllers pass the io back to their parent controller for a check-out. **Back to 3**.


Important notes:
----------------
* Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and file names.
* Bootstruct ignores trailing slashes in URLs.
* Bootstruct ignores entries that their names start with an underscore and doesn't parse them (e.g. `_ignored.js`).
* You can use the io to hold different properties throgh its cycle.
* The context of the `this` keyword inside method functions refers to the current controller object.
  Each controller has a name (like `bar`) and a unique ID which is its folder path (e.g. `app/foo/bar`).  
  Try to log `this.name` and `this.id` in your different methods.  

More to come.

****
Questions, suggestions, bugs, hugs, criticism or kudos are all welcome.

*taitulism(at)gmail(dot)com*


`DISCLAIMER`: Bootstruct haven't been tested for production environment. Yet.

