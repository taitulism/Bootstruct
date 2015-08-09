Bootstruct
==========
>*Routing by structure.*

Bootstruct is a web framework for Node, based on a folder-structure / file-name convention.



Table of contents
-----------------

  * [Overview](#overview)
  * [Understanding Bootstruct](#understanding-bootstruct)
  * [Reserved Entry Names](#reserved-entry-names)
  * [Controller's flow](#controllers-flow)
  * [io](#io)
  * [Get Started](#get-started)
  * [index](#index)
  * [get, post, put, delete](#get-post-put-delete)
  * [verbs](#verbs)
  * [Breath](#breath)
  * [first & last](#first--last)
  * [pre_sub & post_sub](#pre_sub--post_sub)
  * [after_verb](#after_verb)
  * [no_verb](#no_verb)
  * [Full Example](#full-example)
  * [Important Notes](#important-notes)




Overview
--------
Creating web apps with Node requires wiring up your routes manually: we need to bind different URLs to different handlers. We usually do that by coding. With Bootstruct we do it by creating files and folders.

The whole story happens in a single folder, the web-server's root folder (might ring some bells):
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   └── www              <──
```

Bootstruct ties that folder with your host root (domain root, localhost or just `/` in common Nodish) and routes requests through that folder's structure, matching URLs to corresponding paths under that folder. 

To support routes like:
```
domain.com/
domain.com/A
domain.com/A/B
domain.com/A/B/C
```

your web-root folder tree should look like:
```
├── www
│   └── A
│       └── B
│           └── C
```

Bootstruct leverages the parental folder chain (e.g. '/A/B/C') and provides you with an onion-like layered app. 

A request to `/A/B/C` would go through:
```
1. www
2. www/A
3. www/A/B
4. www/A/B/C
5. www/A/B
6. www/A
7. www
```

>Do you see the onion?

Requests start at the web-root folder (e.g. "www"), do their way in to the target-folder, then go back out to the web-root folder and you can run some code on every step of the way.

**Bootstruct**:
- [x] saves you from coding your routes.
- [x] enforces a natural code separation by concept.
- [x] provides you with great control over request flow.




Understanding Bootstruct
------------------------
Learning Bootstruct is more about understanding how it behaves based on your web-root folder's structure than code and syntax.

When Bootstruct is initialized it parses your web-root folder. Basically, folders become URL-controllers and files become their methods. Your whole web-root folder is translated into a root-controller, containing sub-controllers, recursively. This Root-Controller (**"RC"** from now on) is your Bootstruct app's core object. 

This structure:
```
├── www           ──> controller (root)
│   └── A         ──> controller
│       └── B.js  ──> method
```
is parsed into something like:
```js
	/*────────────┐
	│ PSEUDO CODE │
	└────────────*/
	RC = {
		folder: 'path/to/www',
		url   : '/',
		methods: {},
		sub_controllers: {
			A: {
				folder: 'path/to/www/A',
				url   : '/A',
				methods: {
					B: require('www/A/B');
				}
				sub_controllers: {},
			}
		}
	}
```
>NOTE: On request Bootstruct splits the URL pathename by slashes and checks them one by one against existing sub-controllers so you cannot "escape" the web-root folder by using '../../' in URLs because there is no `RC.sub_controllers['..']`. Bootstruct does NOT statically serve anything.

See how "B" is `require`d above?  
Methods in Bootstruct are expected to export a single function (they are being `require`d on init):
```js
	module.exports = function () {...};
```




Reserved Entry Names
--------------------
Bootstruct has some reserved names for files and folders ("entries", for short) that are parsed differently. They are also being `require`d (like `B.js` above) as they are also methods and should export a single function as well. These special methods are not URL-reachable-methods like `B.js` and each plays its own role in the controller it's in. Here they are:
* index / all / before_verb
* get
* post
* put
* delete
* no_verb
* after_verb
* pre_sub
* post_sub
* first
* last
* verbs

>NOTE: Reserved names with under_scores have a dash-version and a camelCased version as synonyms e.g. `no_verb/`no-verb`/`noVerb`.




Controller's flow
-----------------
Every request has a target-controller. A request's target-controller is the last existing controller whose name found in the URL. A controller can act as the request's target-controller or as one of the target-controller's parents. For example:
```
├── www
│   └── A
│       └── B
```
The "A" controller is **the target**-controller for requests to `/A` (and `/A/whatever`).  
The "A" controller is **a parent**-controller for requests to `/A/B` (and `/A/B/whatever`).

Controllers can have 2 chains of methods they execute in each case: a target-chain and a parent-chain. When you name an entry with a reserved name you actually mount its exported function on one of these chains when each method has its own place. Some reserved methods belong to one chain, some belong to the other and some goes in both chains. 

Controller chart flow:  
![Controller Chart-Flow](https://github.com/taitulism/Bootstruct/tree/master/Docs/controller-chart-flow.png)

This image describes these chains and the controller's internal flow. The target-chain on the right and the parent-chain on the left. The `first` and the `last` methods are held in common by the two chains.

A controller is a representation of a folder structure and that `io` thingy is the "moving part" in your app's structure. 

The target-controller is the center of the onion:  
request: `/A`:
```
	www        check-in
	www/A      target
	www        check-out
```
request: `/A/B`:
```
	www        check-in
	www/A      check-in
	www/A/B    target
	www/A      check-out
	www        check-out
```
The target-chain methods (`index`, the verbs, etc.) should hold the controller's core functionality.

In the middle of the parent-chain there are the controller's sub-controllers. This point is where the `request` (held by the `io`) is passed from one controller to another.

On its way in to the target-controller, the `io` moves in the parent-controllers' parent-chains through the `first` and the `pre_sub` methods of each parent (check-in methods). It checks-in at sub-controllers recursively until it gets to the target-controller. There it walks through the whole target-chain and finally checks-out to finish the rest of all the parent-chains (`post_sub`, `last`).




io
--
All of the methods your files export, accept a single argument, an object called `io`. It holds the native `request`/`response` objects as `io.req` & `io.res` (respectively) so you could:
```js
	module.exports = function (io) {
		console.log(io.req.method); // ──> e.g. 'GET'

		io.res.write('hello world');
		io.res.end();
	};
```

The `io` moves from one controller to another and inside every controller, from one method to another. You move it around by calling `io.next()`:
```js
	module.exports = function (io) {
		io.res.write('hello ');
		io.next();
	};
```
```js
	module.exports = function (io) {
		io.res.write('world');
		io.next();
	};
```

You're encouraged to use the `io` as you like. Set it with your own props in an outer layer, use them in the inner parts. It's a good way to pass request related data along your app, without polluting any global scope:
```js
	// pseudo auth (for example in a 'www/Blog/first.js' file)
	module.exports = function (io) {
		io.isAdmin = true; /* "isAdmin" is a made up property */
		io.next();
	};
```
```js
	// somewhere down the road (e.g. 'www/Blog/Edit/index.js')
	module.exports = function (io) {
		if (io.isAdmin){
			//...
		}
	};
```

The `io` also holds the splitted URL pathname as `io.params`. Each controller the `io` checks-in at (with the "RC" as an exception) removes its name from the array. Let's say we have:
```
├── www     (RC)
│   ├── index.js
│   └── A
│       ├── index.js
│       └── B
│           └── index.js
```

On request to `/A/B/whatever` the `io.params` array starts as `['A','B','whatever']` but ends as `['whatever']`. Both "A" and "B" controllers remove their names on check-in:
```
www      ──>  io.params = [A,B,whatever]
www/A    ──>  io.params = [B,whatever]
www/A/B  ──>  io.params = [whatever]
www/A    ──>  io.params = [whatever]
www      ──>  io.params = [whatever]
```

**IMPORTANT NOTE:** Bootstruct uses the first item to find the target-controller. Don't manipulate this array unless you know what you're doing (`.push`ing and `.pop`ing your own items is cool. Changing the existing items could cause a mess).

Now, just before we get to know Bootstruct's reserved names, let's see how to init Bootstruct.




Get Started
-----------
1. Install Bootstruct in a new folder: 
	```sh
		$ npm install bootstruct
	```

2. Unlike other frameworks, Bootstruct doesn't create a server for you.	Create a `server-index.js` file with the following content: 
	```js
		var http = require('http');
		var app  = require('bootstruct')();  // <-- require and init

		http.createServer(app).listen(1001, function(){
			console.log('Listening on port 1001');
		});
	```

3. Create a `www` folder. `www` is the web-root folder's default name (borrowed from other platforms: Apache, IIS etc). To change it you can start Bootstruct with:
	```js
		var app = require('bootstruct')('yourFolderName');
	```

4. Your project folder tree should look like:
	```
	├── myProject
	│   ├── node_modules
	│   │   └── Bootstruct
	│   ├── server-index.js
	│   └── www
	```
	If so, you are basically ready to start your server up:
	```sh
		$ node server-index.js
	```

**BUT**  
Your `www` folder is currently empty. A controller without methods. You can make requests to `localhost:1001` but you'll get nothing :/

>NOTE: Bootstruct, as a "positive" module, responds with an empty `200 ok` by default and doesn't keep your requests hanging (pending until server timeout).

Now let's see how to control request flow using Bootstruct's reserved entry names.




index
-----
**Synonyms**: `all`, `beforeVerb`, `before_verb`, `before-verb`.

`index` is a reserved entry name (and so are its synonyms). Its exported function gets mounted on the target-chain of the controller it's in. The `index` method gets called when its controller is the request target-controller, for **any** type of request (HTTP verbs).

Example structure:
```
├── www   (RC)
│   ├── index.js      ──> handles requests to /
│   └── A
│       └── index.js  ──> handles requests to /A
```
This works very similar to other platforms where you ask for a folder and its default file is served/executed (index.html, index.php, index.asp etc).

If a controller has no sub-controllers and has only an `index` method, like "A" in our case, you can cut the overhead of a folder (a controller) and turn it into a file (a method).

Before:
```
├── www
│   ├── index.js
│   └── A          ──> folder
│       └── index.js
```
After:
```
├── www
│   ├── index.js
│   └── A.js       ──> file
```
Now "A" is a method in the "RC" instead of a single method controller.




get, post, put, delete
----------------------
These 4 HTTP verbs are reserved entry names and also get mounted on their controller's target-chain. The verb methods should hold the core functionality of their controller.

Example structure:
```
├── www
│   ├── get.js       ──> GET requests to '/'
│   ├── post.js      ──> POST requests to '/'
│   └── A
│       ├── get.js   ──> GET requests to '/A'
│       └── post.js  ──> POST requests to '/A'
```

If you have an `index` method as well, it will get called **before** any verb does. That's why `index` has `before_verb` as a synonym.

>NOTE: There's also an `after_verb` method...

```
├── www
│   ├── index.js      <── ALL  requests to '/'
│   ├── get.js        <── GET  requests to '/'
│   ├── post.js       <── POST requests to '/'
│   └── A
│       ├── index.js  <── ALL  requests to '/A'
│       ├── get.js    <── GET  requests to '/A'
│       └── post.js   <── POST requests to '/A'
```

Now you'll have to call `io.next()` to make the `io` move on from the `index` method to the verb method.

A `www/index.js` file like:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.next();
	};
```
and a `www/get.js` file like:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.res.end();
	};
```
will log (on a GET request):  
path/to/www/index.js  
path/to/www/get.js

BTW, If **any** reserved name file gets bigger, you can turn it into a folder:

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
Just remember to export your function from an `index.js` file. In this case the `index.js` is NOT parsed as the reserved entry name, it's just what Node is looking for when `require`ing a folder.




verbs
-----
`verbs` is a reserved entry name but it doesn't stand for a method like the others. `verbs` acts only as a namespace folder (always a folder) to hold the different verb files.

Using all verb types and having multiple sub-controllers/methods can hurt your eyes:
```
├── www
│   ├── [blog]      <── controller
│   ├── [messages]  <── controller
│   ├── [profile]   <── controller
│   ├── about.js    <── method
│   ├── all.js      <── verbs
│   ├── contact.js  <── method
│   ├── delete.js   <── verbs
│   ├── get.js      <── verbs
│   ├── post.js     <── verbs
│   └── put.js      <── verbs
```
For the sake of your eyes, you can use a `verbs` folder, just as a namespace to contain the verbs entries:
```
├── www
│   ├── [blog]
│   ├── [messages]
│   ├── [profile]
│   ├── about.js
│   ├── contact.js
│   └── verbs          <──
│       ├── all.js
│       ├── get.js
│       ├── post.js
│       ├── put.js
│       └── delete.js
```




first & last
------------
Another 2 reserved entry names. When exist they always get called whether the controller is the target-controller or a parent. `first` is the first thing controllers run when an `io` checks-in and `last` is the very last thing to run.

Assume:
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       └── last.js
```
Assume all files log their names and calling `io.next()`:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.next();
	};
```

The following shows the logs we'll get for different requests:

**request**: `/`  
**logs**:  
 &nbsp; path/to/www/first.js  
 &nbsp; path/to/www/index.js  
 &nbsp; path/to/www/last.js

**request**: `/A`  
**logs**:  
 &nbsp; path/to/www/first.js  
 &nbsp; path/to/www/A/first.js  
 &nbsp; path/to/www/A/index.js  
 &nbsp; path/to/www/A/last.js  
 &nbsp; path/to/www/last.js

`first` and `last` always run. `index` runs only in the target-controller. 

Now with verbs:
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── get.js     <──
│   ├── post.js    <──
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       ├── get.js     <──
│       ├── post.js    <──
│       └── last.js
```

>NOTE: The full path to the `www` folder and file extensions (.js) were removed from log for better readability:

```
request: GET `/`
logs:
	www/first
	www/index
	www/get
	www/last

request: POST `/`
logs:
	www/first
	www/index
	www/post
	www/last

request: GET `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/get
	www/A/last
	www/last

request: POST `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/post
	www/A/last
	www/last
```




after_verb
----------
**Synonyms**: `after-verb`, `afterVerb`.

`after_verb`, like `before_verb` (`index` synonym), will run for **any** request type in the target-controller but **after** the verb method. Probably very self explanatory by now.
```
├── www
│   ├── before_verb.js
│   ├── get.js
│   ├── post.js
│   └── after_verb.js
```
```
request: GET `/`
logs:
	www/before_verb
	www/get
	www/after_verb

request: POST `/`
logs:
	www/before_verb
	www/post
	www/after_verb
```




pre_sub & post_sub
------------------
**Synonyms**: `pre-sub`, `preSub`.
**Synonyms**: `post-sub`, `postSub`.

`index` and the verbs get called only by the target-controller. `first` & `last` get called anyway, whether the controller is the target-controller or not. `pre_sub` and `post_sub` get called only by a parent-controller, before and after the sub-controller, respectively (pre=before, post=after):
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── pre_sub.js   <──
│   ├── post_sub.js  <──
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       └── last.js
```

Assume all files log their names and calling `io.next()` as before:
```
request: /
logs:
	www/first
	www/index
	www/last
(no sub-controller was called)

request: /A
logs:
	www/first
	www/pre_sub   <──
	www/A/first
	www/A/index
	www/A/last
	www/post_sub  <──
	www/last
```

The "A" controller doesn't have any sub-controllers so `pre_sub` and `post_sub` would be redundent if existed. They would never get called.




no_verb
-------
**Synonyms**: `no-verb`, `noVerb`.

Another reserved entry name in the target-controller's chain. It will get called on a request type that the target-controller doesn't support.

```
├── www
│   ├── index.js
│   ├── get.js
│   └── no_verb.js
```

If someone makes a non-supported HTTP verb request and you want to respond to this case, `no_verb` is your method.
```
request: GET `/`
logs:
	www/index
	www/get

request: POST `/`
logs:
	www/index
	www/no_verb
```

The `no_verb` method is kinda special because it's a delegated method: the controller who has it, delgates this method to all of its sub-controllers.
```
├── www
│   ├── index.js
│   ├── get.js
│   ├── post.js
│   ├── no_verb.js
│   └── A
│       └── get.js
```
On a POST request to `/A` (which has no `post` method) you'll get the `www/no_verb.js` called. Delegated from the "RC".

**IMPORTANT NOTE:** The `no_verb` method gets called only if at least 1 verb file exists (`get`, `post`, `put`, `delete`).




Use case example
----------------
```
├── www
│   ├── first
│   │   ├── index.js
│   │   └── helper.js
│   ├── index.js
│   ├── qwe.js
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       ├── pre_sub.js
│       ├── post_sub.js
│       ├── last.js
│       └── B
│           ├── first.js
│           ├── before_verb
│           │    ├── index.js
│           │    └── helper.js
│           ├── get.js
│           ├── no_verb.js
│           ├── after_verb.js
│           ├── post_sub.js
│           ├── pre_sub.js
│           ├── last.js
│           └── C
│               ├── first.js
│               ├── all.js
│               ├── verbs
│               │   ├── get.js
│               │   └── post
│               │       ├── index.js
│               │       └── helper.js
│               └── last.js
```

All files contain:
```js
	module.exports = function (io) {
	    console.log(__filename);
	    io.next();
	};
```

```
request: ALL `/`
logs:
	www/first
	www/index
	www/last

request: ALL `/qwe`
logs:
	www/first
	www/qwe
	www/last

request: ALL `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/last
	www/last

request: GET `/A/B`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/before_verb
	www/A/B/get
	www/A/B/after_verb
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: POST `/A/B`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/before_verb
	www/A/B/no_verb
	www/A/B/after_verb
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: GET & POST `/A/B/C`
logs:	
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/pre_sub
	www/A/B/C/first
	www/A/B/C/all
	www/A/B/C/verbs/get|post (respectively)
	www/A/B/C/last
	www/A/B/post_sub
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: PUT & DELETE `/A/B/C`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/pre_sub
	www/A/B/C/first
	www/A/B/C/all
	www/A/B/no_verb ──> delegated
	www/A/B/C/last
	www/A/B/post_sub
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last
```




Important Notes
---------------
* Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and entry names (e.g. `/A/B` is the same as `/a/b`).
* Bootstruct ignores trailing slashes in URLs and merges repeating slashes (e.g. `/A//B//` is treated like `/A/B`).
* On init (parsing stage) Bootstruct ignores entries with names that start with an underscore (e.g. `_ignoredFile.js`).
* Methods belongs to controllers. The keyword "this" refers to the holding controller.
* If you're using the `verbs` folder, any duplicate verbs outside it will override the ones inside.

More to come.


*******************************************************************************
Questions, suggestions, criticism, bugs, hugs, typos and kudos are all welcome.

*taitulism(at)gmail(dot)com*