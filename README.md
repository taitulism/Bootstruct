Bootstruct
==========
>*Routing by structure.*

Bootstruct is a web framework for Node, based on a folder-structure / file-name convention.



Table of contents
-----------------

  * [Overview](#overview)
  * [Understand Bootstruct](#understand-bootstruct)
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

>NOTE: Bootstruct does NOT statically serve any file.

Bootstruct leverages the parental folder chain (e.g. '/A/B/C') and provides you with an onion-like layered app. 

A request to `/A/B` would go through:
```
1. www        check-in
2. www/A      check-in
3. www/A/B    check-in
3. www/A/B/C  target
3. www/A/B    check-out
4. www/A      check-out
5. www        check-out
```

>Do you see the onion?

Requests start at the web-root folder (e.g. "www"), do their way in to the target-folder, then go back out to the web-root folder and you can run some code on every step of the way.

**Bootstruct**:
- [x] saves you from coding your routes.
- [x] enforces a natural code seperation by concept.
- [x] provides you with great control over request flow.




Understand Bootstruct
---------------------
Learning Bootstruct is more about understanding how it behaves based on your web-root folder's structure than code and syntax.

When Bootstruct is initalized it parses your web-root folder: basically, folders become URL controllers and files become their methods. The web-root folder is the root-controller and sub-folders become its sub-controllers.

This structure:
```
├── www           ──> controller (root)
│   └── A         ──> controller
│       └── B.js  ──> method
```
is parsed into something like (pseudo code):
```js
	rootController = {
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

See how "B" is `require`d?  
Methods like `B.js` are expected to export a single function:
```js
	module.exports = function () {...};
```

The Root-Controller ("RC" from now on) is your Bootstruct app's core object. On request Bootstruct splits the URL pathename by slashes and checks them one by one against existing sub-controllers (recursively) under the "RC" so you cannot "escape" the web-root folder by using '../../' in URLs because `RC.sub_controllers['..'] === undefined`.




Reserved Entry Names
--------------------
>NOTE: The term "Entry" (plural: "Entries") is used to refer to both files and folders.

Bootstruct has some reserved names for files and folders that are parsed differently. Each entry with a reserved name plays its own role in the controller it's in. They are also being `require`d as methods (like `B.js` above) and should export a single function as well. Here they are:
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

>NOTE: Reserved names with under_scores have a dash-version and a camelCased version as synonyms. e.g. after_verb/after-verb/afterVerb.




Controller's flow
-----------------
Every request has its target-controller. A request's target-controller is the last existing controller whose name found in the URL. A controller can act as the request's target-controller or as one of the target-controller's parents. For example:
```
├── www    ──> (RC)
│   └── A
│       └── B
```
The "A" controller is **the target**-controller for requests to `/A` and `/A/whatever`.  
The "A" controller is **a parent**-controller for requests to `/A/B` and `/A/B/whatever` 

Controllers have 2 chains of methods they execute in each case: the target-chain and the parent-chain. On request controllers call one of those chains: parent-controllers run their parent-chain and the target-controller runs its target-chain. Some reserved methods belong to one chain, some belong to the other and some goes in both chains. When you name an entry with a reserved name you actually mount its exported function on one of these chains when each name has its own place.

Controller chart flow:
![Controller Chart-Flow](https://github.com/taitulism/Bootstruct/tree/master/Docs/controller-chart-flow.png)

This image describes these two chains and a controller's general flow.

We can see that the `first` and the `last` methods are held in common by the two chains. On the right side there's the target-chain and the parent-chain is on the left.

In the middle of the parent-chain there are the controller's sub-controllers (sub-ctrl). The sub-controller is the point where the `request` is passed from one controller to another. This is what gives Bootstruct its "onion" nature: a parent-controller passes the `request` to one of its child-controllers (sub) that runs its own whole chain. When that child is done it passes the `request` back to the parent to finish its chain. Parent-check-in ──> child ──> parent-check-out = onion style ((())).




io
--
All methods, the functions that your files export, deal with a single argument, an object called `io`. This object is the "moving part" in your app's structure. It holds the native `request`/`response` objects so you could:
```js
	module.exports = function (io) {
		console.log(io.req.method); // ──> e.g. 'GET'

		io.res.write('hello world');
		io.res.end();
	};
```

The `io` moves from one controller to another and inside every controller, from one method to another. You move it arround by calling `io.next()`:
```js
	module.exports = function (io) {
		io.res.write('hello ');
		io.next();               // <──
	};
```
```js
	module.exports = function (io) {
		io.res.write('world');
		io.next();               // <──
	};
```

You're encouraged to use the `io` as you like. Set it with props here, use them there. It's a good way to pass request related data along your app, without polluting any global scope:
```js
	module.exports = function (io) {
		io.isAdmin = true; // "isAdmin" is a made up property
		io.next();
	};
```
```js
	module.exports = function (io) {
		if (io.isAdmin){
			//...
		}
	};
```

The `io` also holds the splitted URL pathname as `io.params`. Each controller the `io` checks-in at (with the "RC" as an exception) removes its name from the array. Let's say we have:
```
├── www
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

Now, before we get to know Bootstruct's reserved names and how/when to use them, let's see how to init Bootstruct.




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

Now let's see how to to control request flow using Bootstruct's reserved entry names.




index
-----
**Synonyms**: `all`, `beforeVerb`, `before_verb`, `before-verb`.

`index` is a reserved entry name (and so are its synonyms). Its exported function gets mounted on the target-chain of the controller it's in. This means that only the target-controller will call its `index` method.

Example structure:
```
├── www   (RC)
│   ├── index.js      ──> handles requests to /
│   └── A
│       └── index.js  ──> handles requests to /A
```

The target-controller for requests to `/` is the "RC" so `www/index.js`'s exported function would be the handling function. For requests to `/A` the target-controller is `A` and `www/A/index.js` would be the handling function. 

If a controller has no sub-controllers and has only an `index` method, like "A" in our case, you can cut the overhead of a folder (a controller) and turn it into a file (a method):
```
├── www
│   ├── index.js
│   └── A          ──> folder
│       └── index.js
```
```
├── www
│   ├── index.js
│   └── A.js       ──> file
```
Now "A" is a method in the "RC" instead of a single method controller.




get, post, put, delete
----------------------
These 4 HTTP verbs are reserved entry names and also get mounted on their controller's target-chain.

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

Now you'll have to call `io.next()` from your `index` method to make the `io` move on to the verb method.

An `www/index.js` file like:
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
...path/to/www/index.js  
...path/to/www/get.js


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
Just remember to export your function from an `index.js` file. In this case the `index.js` is not parsed as the reserved entry name, it's just what Node is looking for when `require`ing a folder.




verbs
-----
`verbs` is reserved entry name but it doesn't stand for a method like the others. `verbs` acts only as a namespace folder (always a folder) to hold the different verb files.

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




Breath
------
>"Breath" is not a reserved word in Bootstruct but still a good one.

`index` and the verbs (the coolest band name or what?) only run in the target-controller. If we had:
```
├── www
│   ├── index.js
│   └── A
│       ├── get.js
│       ├── post.js
│       └── B.js
```
requests to `/A/B` would go straight to the "B" method and "A" would be just another letter in B's path. Nothing is wrong here. This might be exactly what you need, but let's see how to make "A" wrap "B" with some code and run some methods even if its not the target-controller, before and after "B".

```
www
www/A    <── check-in
www/A/B
www/A    <── check-out
www
```
The `io` checks-in, does its thing in the target-controller and then checks-out.




first & last
------------
Another 2 reserved entry names. When used they always get called wether or not the controller is the target-controller. Of course `first` is the first thing to run and `last` is last. Before and after the target-controller and its verbs, respectively.

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

request: `/`  
logs:  
.../www/first.js  
.../www/index.js  
.../www/last.js

request: `/A`  
logs:  
.../www/first.js  
.../www/A/first.js  
.../www/A/index.js  
.../www/A/last.js  
.../www/last.js

`first` and `last` always run. `index` runs only in the target-controller. Now with verbs:
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
request: GET `/`  
logs:  
.../www/first.js  
.../www/index.js  
.../www/get.js  
.../www/last.js

request: POST `/`  
logs:  
.../www/first.js  
.../www/index.js  
.../www/post.js  
.../www/last.js

request: GET `/A`  
logs:  
.../www/first.js  
.../www/A/first.js  
.../www/A/index.js  
.../www/A/get.js  
.../www/A/last.js  
.../www/last.js

request: POST `/A`  
logs:  
.../www/first.js  
.../www/A/first.js  
.../www/A/index.js  
.../www/A/post.js  
.../www/A/last.js  
.../www/last.js




pre_sub & post_sub
------------------
**Synonyms**: `pre-sub`, `preSub`.
**Synonyms**: `post-sub`, `postSub`.

`first` & `last` get called anyway, wether or not the controller is the target-controller. `index` and the verbs get called only by the taget-controller. `pre_sub` and `post_sub` get called only on a parent-controller, before and after the sub-controller, respectively (pre=before, post=after):
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

request: /  
logs:  
.../www/first.js  
.../www/index.js  
.../www/last.js  
(no sub-controller was called)

request: /A  
logs:  
.../www/first.js  
.../www/pre_sub.js  
.../www/A/first.js  
.../www/A/index.js  
.../www/A/last.js  
.../www/post_sub.js  
.../www/last.js

The "A" controller doesn't have any sub-controllers so `pre_sub` and `post_sub` will be useless if existed and would never get called.




after_verb
----------
**Synonyms**: `after-verb`, `afterVerb`.

`after_verb`, like `before_verb`, will run for any request type in the target-controller but **after** the verb method.
```
├── www
│   ├── before_verb.js  ──> index
│   ├── get.js
│   ├── post.js
│   └── after_verb.js
```

request: GET `/`  
logs:  
.../www/before_verb.js  
.../www/get.js  
.../www/after_verb.js

request: POST `/`  
logs:  
.../www/before_verb.js  
.../www/post.js  
.../www/after_verb.js




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

request: POST `/`  
logs:  
On a **GET** request to `/`:  
.../www/index.js  
.../www/**get**.js

request: **POST** `/`  
logs:  
.../www/index.js  
.../www/**no_verb**.js

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
On a POST request to `/A` (without a `post` method) you'll get the `www/no_verb.js` called.

>NOTE: `no_verb` gets called only if at least 1 verb file exists (`get`, `post`, `put`, `delete`).




Use case example
----------------
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       ├── pre_sub.js
│       ├── post_sub.js
│       ├── last.js
│       └── B
│           ├── first.js
│           ├── before_verb.js
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

The full path to the `www` folder and file extensions (.js) removed to make it more readable:

```
request: ALL `/`
logs:
	www/first
	www/index
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
* On init (parsing stage) Bootstruct ignores entries with names that starts with an underscore (e.g. `_ignoredFile.js`).
* Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and entry names (e.g. `/A/B` is the same as `/a/b`).
* Bootstruct ignores trailing slashes in URLs and merges repeating slashes (e.g. `/A//B//` is treated like `/A/B`).
* Methods belongs to controllers. The keyword "this" refers to the holding controller.
* If you're using the `verbs` folder, any duplicate verbs outside it will override the ones inside.

More to come.


*******************************************************************************
Questions, suggestions, criticism, bugs, hugs, typos and kudos are all welcome.

*taitulism(at)gmail(dot)com*