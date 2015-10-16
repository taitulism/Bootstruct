Bootstruct Docs
===============

Table of Contents
-----------------
* [Main Page (Overview)](https://github.com/taitulism/Bootstruct/blob/master/README.md)
* [Get Started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get Started.md)
* Docs (this page)
	* [Terminology](#terminology)
	* [General](#general)
	* [App's Flow](#apps-flow)
	* [Controller's Flow](#controllers-flow)
	* [Methods](#methods)
	* [Files and Folders](#files-and-folders)
	* [URL parameters](#url-parameters)
	* [Extend Bootstruct](#extend-bootstruct)
* More Docs
	* [Reserved Entry Names](./Reserved Entry Names/README.md)
	* [Extending Bootstruct](./Docs/Hooks.md)




Terminology
-----------
Before we start, let's clarify some terms used in these docs:

* **RC**: The Root-Controller. The main controller parsed from the web-root folder.

* An **Entry**: Either a file or a folder. Folder's **entries** are the files and folders inside it. This term is used because from a certain aspect the type of an entry (a file or a folder) doesn't matter: `require('path/to/entry')`.

* An HTTP **Verb**: From Google: *"The primary or most-commonly-used HTTP verbs (or methods, as they are properly called) are POST, GET, PUT, and DELETE"*. The word "method" is used in these docs in the context of a function so "HTTP verbs" is used instead of "HTTP methods".

>**NOTE**: You can extend Bootstruct to support more HTTP verbs.


General
-------
Learning Bootstruct is more about understanding how it behaves based on your files and folders than code and syntax.

Bootstruct is based on a mix of two quite close conventions: a folder structure convention and a filename convention. 

When Bootstruct is initialized it parses your web-root folder recursively. Basically, folders become URL-controllers and files become their methods. Certain names are parsed into specific kinds of methods, whether they are files or folders. Eventually, your web-root folder and its sub-folders are translated into a root-controller, a nested structure of controllers and their sub-controllers. This Root-Controller (`RC` from now on) is your Bootstruct app's core object.

>**NOTE**: Bootstruct ignores files and folders that their names start with a dot or an underscore like `.ignored` or `_ignored`).




App's Flow
----------
The "moving parts" in your app are `io` objects which hold the `request` and the `response`. They move between controllers and their methods. 

On request, a new `io` object "checks-in" at your `RC`. It does its way in through sub-controllers to its target-controller and then "checks-out", going through the same controllers back to the `RC`.

As mention at the [overview](https://github.com/taitulism/Bootstruct/blob/master/README.md) on the main page, with this structure:
```
├── www (RC)
│   └── A
│       └── B
```

a request to `/A/B` would go through:
```
1. RC
2. RC/A
3. RC/A/B
4. RC/A
5. RC
```

With this behavior you can execute some code on controller "A" before and after controller "B" (steps 2 and 4). Of course, you can end the response whenever you like or use just a "half an onion":
```
1. RC
2. RC/A
3. RC/A/B
``` 




Controller's Flow
-----------------
Every request has a target-controller. A request's target-controller is the last existing controller whose name found in the URL. A controller can act as the request's target-controller or as one of the target-controller's parents. For example:
```
├── www
│   └── A
│       └── B
│           └── C.js
```
The **"A"** controller is **the target**-controller for requests to `/A` (and `/A/whatever`).  
The **"A"** controller is **a parent**-controller for requests to `/A/B` (and `/A/B/whatever`).  
For requests to `/A/B/C` (and `/A/B/C/whatever`), the **"B"** controller is **the target**-controller and `C.js` is its method. 

Controllers have three chains of methods they execute in each case: a target-chain, a parent-chain and a method-chain. These chains are arrays of functions (created on init) and when you name an entry with one of [Bootstruct's reserved names](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/README.md) you actually mount its exported function on one of these chains.  
When a request checks-in at a controller, the controller routes the request through one of its chains according to its role (parent/target/method).

>**NOTE**: All methods get called with an `io` as their first argument.

The following image describes these chains: The method-chain is on the right, the parent-chain is on the left and the target-chain is in the middle.
![Controller Flowchart](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)

>**NOTE**: Those are NOT all of Bootstruct's reserved names.

All of the three chains start with `first` and end with `last` methods. These are the very first and last methods a controller (who has them) would call, regardless of its role per request.

The principle is pretty simple: **each chain has a center, which is its main point, and you can run some code before and after that main point.**

The target-chain is all about the verbs (GET, POST, PUT, DELETE). They are for controllers' core functionality (see wiki: [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)). 

You can run some code before or after the verb method. A "verb method" would be the exported function from a `post.js` file or a `post` folder for example. `before_verb` is a synonym of `index`, mentioned in the [Get started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get Started.md) page, and another synonym is `all`. Their exported function gets called "before" the verb, for "all" verbs. `after_verb`'s synonym is `all_done`.

As `before_verb` and `after_verb` run in the target-chain before and after any verb method does, `pre_method` and `post_method` will run in the method-chain before and after any user method (e.g. `C.js`) and `pre_sub`/`post_sub` (parent-chain) will run before and after any sub-controller ("pre" = before, "post" = after, not to be confused with the `post` HTTP verb).

The "sub-ctrl" part is where the recursion happens, where an `io` checks in and out at controllers, parent -> child -> parent. The child, a controller itself, has its own chains and child-controller (sub-controllers).

See [Bootstruct's reserved names](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/README.md)




Methods
-------
Both types of methods, reserved methods and non-reserved methods (user methods) are being `require`-d to the controller (on init) so they must export a single function. On request, methods handle at least one argument, an `io` (mentioned above). It holds the `request` and the `response` (and some other props and methods. To move the `io` forward in the chain you call: `io.next()`, unless you choose to end the response with `io.res.end()`.

Your Bootstruct methods will generally look like:
```js
module.exports = function (io) {
	/* 
		"this" is the holding controller

		the "io" holds the request/response as props:
			io.req === request
			io.res === response

	*/

	// some code...


	io.next();
};
```

`io` is not the only argument your methods handle. Read about named params on the [URL parameters](#url-parameters) section below.

Methods get called with the context of their holding controller so the keyword "this" refers to the controller you're in.

All controllers have access to the same scope (`this.global`), which is the `app` instance itself so you could share data in your app without polluting any other global scope or reapeating the same `require`-s. 

See [Bootstruct Hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) to learn how to populate your app instance with properties on init.




Files and Folders
-----------------
As said, Bootstruct translates user folders to controllers and user files to methods but reserved name entries (both files and folders) become methods in the controllers' chains regardless of the entry type (file/folder). Since those are being `require`-d on controllers, when using a folder with a reserved name, you must include an `index.js` file with the exported function. Node expects an `index.js` file when: `require('path/to/a/FOLDER')`.

Consider this structure for example:
```
├── www
│   └── friends
│       ├── index.js
│       ├── get.js
│       └── post.js
```
`index`, `get` and `post` are all reserved names for target-chain methods.

Let's say we have a user's "/friends" page in our social network app. Our `index` checks for authentication before both verbs. Our `get` method is pretty simple, it gets the user's friends list and sends it back to the client. Our `post` method, from the other hand, is quite messy: it has a lot of dependencies, it validates, sends an email, etc. In this case it would be better to turn the `post.js` file into a `post` folder:
```
├── www
│   └── friends
│       ├── index.js   // reserved name `index`
│       ├── get.js
│       └── post
│           ├── index.js     // = post.js
│           ├── validate.js
│           ├── email.js
│           └── etc.js
```

The `post` folder is not parsed as a controller because of its meaningful name, therefore the `index.js` file inside it is not treated as a reserved name (like `www/friends/index.js` does). It's just what Node is looking for when `require`-ing a folder. Consider: `require('friends/post')`.

In another case we have a tiny controller with `index` as its only method:
```
├── www               ──> controller
│   └── home          ──> controller
│       └── index.js  ──> method
```
Here it would be wise to cut the overhead of a controller and turn it into a method (a file):
```
├── www          ──> controller
│   └── home.js  ──> method
```
Both handle requests to `/home` but now instead of having two controllers and a method we have only one controller with a single method.

Generally folders become controllers but let's say we want a `home` method but due to its complexity we would like to turn it into a folder. In this case, we can put a flag entry named **_METHOD** inside the `home` folder and it won't be parsed as a controller but as a method.
```
├── www
│   └── home               ──> becomes a method
│       ├── index.js
│       ├── dependency.js
│       └── _METHOD        ──> a file or a folder
```

If you want a certain entry to be ignored by the parser, add a preceding underscore or a dot to its name:
```
├── www
│   ├── _myModules      <── 
│   │   ├── helper1.js
│   │   └── helper2.js
│   ├── .myUtils        <──
│   └── index.js
```

>**NOTE**: Non `.js` files are all ignored (e.g. 'file.txt').




URL parameters
--------------
On request Bootstruct splits the URL pathname by slashs so a request to `/A/B/whatever` becomes an array: `['A','B','whatever']`. It is stored on the `io` as `io.params`. 

>**NOTE**: Bootstruct ignores trailing slashes in URLs and merges repeating slashes (e.g. `/A//B//` is treated like `/A/B`). Also, due to its nature, Bootstruct is CaSe-InSeNsItIvE when it comes to URLs that correspond with your folder/file names (e.g. `/A/B` is the same as `/a/b`).

The different items in that `io.params` array could be a controller name, a method, or just a parameter like "whatever" above:
```
domain.com/
domain.com/ctrl
domain.com/method
domain.com/param
domain.com/ctrl/param
domain.com/ctrl/ctrl/method/param1/param2
etc.
```

**IMPORTANT NOTE:** Bootstruct uses `io.params` to find the target-controller. Don't manipulate this array unless you know what you're doing. `.push`-ing and `.pop`-ing your own items is cool. Changing the existing items could cause unexpected behavior.

Controllers (with the `RC` as an exception) remove their names from the array (always the first item) so your target-controller's methods are only left with the params that doesn't stand for a controller or a method (e.g. `['whatever']`).
```
www      ──>  io.params = [A,B,whatever]
www/A    ──>  io.params = [B,whatever]
www/A/B  ──>  io.params = [whatever]
www/A    ──>  io.params = [whatever]
www      ──>  io.params = [whatever]
```

Methods always get called with `io` as their first argument. The rest of the arguments are the items in `io.params` (if any). On request to `/A/B/whatever` your methods in "B" controller's will get called with `io` as the first argument, and `whatever` as the second one so you can use named params in addition to the `io.params`:
```js
module.exports = function (io, param) {
	
	console.log(io.params); // -> ['whatever']
	console.log(param);     // -> 'whatever'

	// ...

	io.next();

};
```




Extend Bootstruct
-----------------
Bootstruct's three main classes are `App`, `Ctrl` and `IO`.

Controllers are nested inside each other and they all have a reference to the app object. The `io`s check in and out at this structure.

Bootstruct provides you with hooks to these classes and other main parts in its architecture. These hooks allow you to create your own API over Bootstruct's infrastructure.

* You can add methods to the `Ctrl`'s prototype and the `IO` prototype. Create a `this.kick(io)` or a `io.getIP()` methods.

* You can load your own stuff on the `app` object (`this.global` A.K.A the `app` instance) and access them from your controllers and methods. A database connection, a reference to the server, a log-to-file function or whatever.

* You can add your own [reserved entry names](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/README.md) on the parser and handle them. Cache the files when a "public" folder is found, precompile a "views" folder etc.

* You can create shared methods and shared controllers instead of copy-pasting the same files in every folder (when you need the same functionality in more than one place). A shared `test` method/controller will allow: `/anyController/test`).

* You can run some code on `io` initialization. This is the very first thing to run on each request, before the `io` checks-in at your app. Set some request related props like `io.ip` or `io.isLoggedIn` ready for use in your methods. You can create methods on the `io.prototype` (another hook) and invoke them on `io` initialization.

* You can run some code when the `io` checks-out from your app and choose what to do at the end of the request cycle (end the response? log it? pass it to another framework?).

With these hooks you can create yourself your own set of tools and use Bootstruct as a platform or infrastructure with your own syntax.

Read more about [Bootstruct Hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md).

