Bootstruct Docs
===============

Table of Contents
-----------------
* [Main Page (Overview)](#main-page)
* [Get Started](#get-started)
* Docs (this page)
	* [Terminology] (#terminology)
	* [General] (#general)
	* [App's Flow] (#apps-flow)
	* [Controller's Flow] (#controllers-flow)
	* [Methods] (#methods)
	* [Files and Folders] (#files-and-folders)
	* [URL parameters] (#url-parameters)
	* [Extend Bootstruct](#extend-bootstruct)
* More Docs
	* [App](#app.md)
	* [Controller](#controller.md)
	* [io](#io.md)
	* [Reserved Entry Names](#rens.md)
	* [Extending Bootstruct](#hooks.md)




Terminology
-----------
Before we start, let's clarify some terms used in these docs:

* **RC**:  
The Root-Controller. The main controller parsed from the web-root folder.
* An **Entry**:  
Either a file or a folder. Folder's **entries** are the files and folders inside it. This term is used because from a certain aspect the type of an entry (a file or a folder) doesn't matter: `require('path/to/entry')`.
* An HTTP **Verb**:  
From Google: "The primary or most-commonly-used HTTP verbs (or methods, as they are properly called) are POST, GET, PUT, and DELETE". The word "method" is used in these docs in the context of a function so "HTTP verbs" is used instead of "HTTP methods".




General
-------
Learning Bootstruct is more about understanding how it behaves based on your files and folders than code and syntax.

Bootstruct is based on a mix of two quite close conventions: a folder structure convention and a filename convention. 

When Bootstruct is initialized it parses your web-root folder recursively. Basically, folders become URL-controllers and files become their methods. Certain names are parsed into specific kinds of methods, whether they are files or folders. Eventually, your web-root folder and its sub-folders are translated into a root-controller, a nested structure of controllers and their sub-controllers. This Root-Controller (`RC` from now on) is your Bootstruct app's core object.

>**NOTE**: Bootstruct ignores files and folders that their names start with a dot or an underscore like `.npmignore` or `_ignoredFile.js`).




App's Flow
----------
The "moving parts" in your app are `io` objects which hold the `request` and the `response`. They move between controllers and their methods. 

On request, a new `io` object "checks-in" at your `RC`, dives in through sub-controllers to its target-controller and then "checks-out" through all the parent-controllers back to the `RC`.

As mention at the [Overview](#readme.md) on the main page, with this structure:
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

You can execute some code on controller "A" before and after "B" (steps 2 and 4). Of course, you can end the response whenever you like or use just a "half an onion":
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
For requests to `/A/B/C` (and `/A/B/C/whatever`), the **"B"** controller is **the handling**-controller but this time the target is a method (`C.js`). 

Controllers have three chains of methods they execute in each case: a target-chain, a parent-chain and a method-chain. These chains are arrays of functions (created on init) and when you name an entry with one of [Bootstruct's reserved names](#rens) you actually mount its exported function on one of these chains.  
When a request "checks-in" at a controller, the controller routes the request through one of its chains according to its role (parent/target/method).

>**NOTE**: All methods get called with an `io` as an argument.

The following image describes these chains: The target-chain is on the right, the parent-chain is on the left and the method-chain is in the middle.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/mini-controller-chart-flow.png)

>**NOTE**: Those are NOT all of Bootstruct's reserved names.

The three chains start with `first` and end with `last` methods. These are the very first and last methods a controller (who has them) would call, regardless of its role per request.

The target-chain is all about the verbs, which are the controller's core functionality (see wiki: [CRUD](#https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)). Bootstruct supports 4 HTTP verbs: GET, POST, PUT AND DELETE, they are all reserved names in Bootstruct. A "verb method" would be the exported function from a `post.js` file or a `post` folder for example.

>**NOTE**: You can extend Bootstruct to support more HTTP verbs.

 You can run some code before or after the verb method. `before_verb` is a synonym of `index`, mentioned in the [Get started](#get-started) page, and another synonym is `all`. Their exported function gets called "before" the verb, for "all" verbs.  
 `after_verb`'s synonym is `all_done`.

`before_verb` and `after_verb` will run before and after any verb method does. `pre_method` and `post_method` (method-chain) will run before and after any user method (e.g. `www/A/B/C.js`). `pre_sub` and `post_sub` (parent-chain) will run before and after any sub-controller ("pre" = before, "post" = after).

See [Bootstruct's reserved entry names](#rens).

The "sub-ctrl" part is the recursion point, where an `io` checks in and out at controllers, parent -> child -> parent. The child , a controller itself, has its own chains and children.




Methods
-------
Both types of methods, reserved methods and non-reserved methods (user methods) are being `require`d to the controller (on init) so they must export a single function. On request, methods handle a single argument, the `io`. It holds the `request` and the `response` and some other props and methods (see [io](#io)). To move the `io` forward in the chain you call: `io.next()`, unless you choose to end the response with `io.res.end()`.

Your Bootstruct methods will generally look like:
```js
module.exports = function (io) {
	/* 
		the "io" holds the request/response as props:
			io.req === request
			io.res === response
	*/

	// some code...

	io.next();
};
```
Methods get called with the context of their holding controller so the keyword "this" refers to the controller you're in (see [Controller](#ctrl)).

All controllers have access to the same scope, which is the `app` instance itself so you could share data in your app without polluting any other global scope: `this.global`.




Files and Folders
-----------------
As said, Bootstruct translates user folders to controllers and user files to methods but reserved name entries (both files and folders) become methods in the controllers' chains regardless of the entry type (file/folder). Since those are being `require`-d, when using a **folder** with a reserved name, you must include an `index.js` file with the exported function. Node expects an `index.js` file when: `require('path/to/folder')`.

Consider this structure for example:
```
├── www
│   └── friends
│       ├── index.js
│       ├── get.js
│       └── post.js
```
`index`, `get` and `post` are all reserved names for target-chain methods.

Let's say we have a user's "/friends" page in our social network app. Our `index` checks for authentication before both verbs. Our `get` method is pretty simple, it gets the user's friend list and sends it back to the client. From the other hand, our `post` method,  is quite messy: it has a lot of dependencies, it validates, sends an email, etc. In this case it would be better to turn the `post.js` file into a `post` folder:
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

The `post` folder is not parsed as a controller because of its meaningful name, therefore the `index.js` file inside it is not treated as a reserved name (like `www/friends/index.js` does). It's just what Node is looking for when `require`-ing a folder: `require('friends/post')`.

In another case we have a tiny controller with `index` as its only method:
```
├── www
│   └── home
│       └── index.js
```
Here it would be wise to cut the overhead of a controller and turn it into a method (a file):
```
├── www
│   └── home.js
```
Both handle requests to `/home`.

If you want a certain entry to be ignored by the parser, add a preceding underscore to its name:
```
├── www
│   ├── _myModules
│   │   ├── helper1.js
│   │   ├── helper2.js
│   │   └── helper3.js
│   └── index.js
```




URL parameters
--------------
On request Bootstruct splits the URL pathname by slashs so a request to `/A/B/whatever` becomes an array: `['A','B','whatever']`. It is stored on the `io` as `io.params`. 

>**NOTE**: Bootstruct ignores trailing slashes in URLs and merges repeating slashes (e.g. `/A//B//` is treated like `/A/B`). Also, due to its nature, Bootstruct is CaSe-InSeNsItIvE when it comes to URLs and entry names (e.g. `/A/B` is the same as `/a/b`).

The different items could be a controller name, a method, or just a parameter like "whatever" above:
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

Controllers (with the `RC` as an exception) remove their names from the array (always the first item) so your target-controller's methods are only left with the params (e.g. `['whatever']`).
```
www      ──>  io.params = [A,B,whatever]
www/A    ──>  io.params = [B,whatever]
www/A/B  ──>  io.params = [whatever]
www/A    ──>  io.params = [whatever]
www      ──>  io.params = [whatever]
```

>**NOTE**: Bootstruct doesn't handle the URL query-string (e.g `/?a=1&b=2`).



Extend Bootstruct
-----------------
Bootstruct's three main classes are `App`, `Ctrl` and `IO`.

Controllers are nested inside each other and they all have a reference to the app object. The `io`s check in and out at this structure. Bootstruct provides you with hooks to these classes and other main parts. These hooks allow you to create your own API over Bootstruct's infrastructure.

* You can add methods to the controller's prototype and the `io` prototype (create `this.kick(io)` or maybe `io.die(reason)`).  
* You can load your own stuff on the `app` object (`this.global`) and access them from you controllers and methods (the server object, a database connection, a log file).  
* You can add your own reserved entry names to the parser and handle them (cache a 'public' folder, precompile a `views` folder).  
* You can create shared methods and shared controllers instead of copy-pasting the same files in every folder (a shared `test` controller will allow: `/anyController/test`).  
* You can run some code on `io` initialization and set some request related props like `io.ip` or `io.isLoggedIn` ready for use in your methods.  
* You can run some code on `io` termination and choose what to do at the end of the request cycle (end the response? log it? pass it to another framework?)

Read more about [hooks](#hooks).
