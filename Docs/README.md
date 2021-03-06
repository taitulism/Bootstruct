Bootstruct Docs
===============

Table of Contents
-----------------
* [Main Page (Overview)](https://github.com/taitulism/Bootstruct)
* [Get Started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get%20Started.md)
* Docs (this page)
	* [Terminology](#terminology)
	* [General](#general)
	* [App's Flow](#apps-flow)
	* [Controller's Flow](#controllers-flow)
	* [Methods](#methods)
	* [Files and Folders](#files-and-folders)
	* [URL parameters](#url-parameters)
	* [Argument Smart Matching](#argument-smart-matching)
* More Docs
	* [Controller Hooks](./Controller%20Hooks.md)
	* [Extend Bootstruct](./Extending%20Bootstruct.md)




Terminology
-----------
Before we start, let's clarify some terms used in these docs:

* The **web root folder**: Bootstruct turns folders and files into url url handlers. The web root folder is the top most folder Bootstruct parses inside your project. You can give it whatever name you want but in the docs we'll use the name: **"api"**.

* The **RC**: The Root-Controller. The main controller parsed from the web root folder.

* An **Entry**: Either a file or a folder. Folder's **entries** are the files and folders inside it.

* An HTTP **Verb**: From Google: *"The primary or most-commonly-used HTTP verbs (or methods, as they are properly called) are POST, GET, PUT, and DELETE"*.  
The word "method" is used in these docs in the context of a function so "HTTP verbs" is used instead of "HTTP methods".




General
-------
Learning Bootstruct is more about understanding how it behaves based on your files and folders than code and syntax.

Bootstruct is based on a mix of two quite close conventions: a folder structure convention and a filename convention. 

When Bootstruct is initialized it parses your web root folder recursively. Basically, folders become URL-controllers and files become their methods. Certain names (start with a `_` sign) are parsed into specific kinds of methods, whether they are files or folders. Eventually, your web root folder and its sub-folders are translated into a root-controller, a nested structure of controllers and their sub-controllers. This Root-Controller (`RC` from now on) is your Bootstruct app's core object.

>**NOTE**: Bootstruct ignores files and folders that their names start with a dot or an underscore like `.ignored` or `_ignored`).




App's Flow
----------
The "moving parts" in your app are `io` objects which hold the `request` and the `response`. They move between controllers and their methods. 

On request, a new `io` object "checks-in" at your `RC`. It does its way in through sub-controllers to its target-controller and then "checks-out", going through the same controllers back to the `RC`.

As mention at the [overview](https://github.com/taitulism/Bootstruct/blob/master/README.md) on the main page, with this structure:
```
├── api (RC)
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
├── api
│   └── A
│       └── B
│           └── C.js
```
The **"A"** controller is **the target**-controller for requests to `/A` (and `/A/whatever`).  
The **"A"** controller is **a parent**-controller for requests to `/A/B` (and `/A/B/whatever`).  
For requests to `/A/B/C` (and `/A/B/C/whatever`), the **"B"** controller is **the target**-controller and `C.js` is its method. 

Controllers have three chains of methods they execute in each case: a target-chain, a parent-chain and a method-chain. These chains are arrays of functions (created on init) and when you name an entry with one of [Bootstruct's reserved names](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks/README.md) you actually mount its exported function on one of these chains.  
When a request checks-in at a controller, the controller routes the request through one of its chains according to its role (parent/target/method).

>**NOTE**: All methods get called with an `io` as their first argument.

The following image describes these chains: The method-chain is on the right, the parent-chain is on the left and the target-chain is in the middle.  
![Controller Flowchart](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)

>**NOTE**: Those are NOT all of Bootstruct's reserved names.

All of the three chains start with `_in` and end with `_out` methods. These are the very first and last methods a controller (who has them) would call, regardless of its role per request.

The principle is pretty simple: **each chain has a center, which is its main point, and you can run some code before and after that main point.**

The target-chain is all about the verbs (GET, POST, PUT, DELETE). They are for controllers' core functionality (see wiki: [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)). 

You can run some code before or after the verb method. A "verb method" would be the exported function from a `_post.js` file or a `_post` folder for example. `_before_verb` is an alias of `index`, mentioned in the [Get started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get%20Started.md) page. Their exported function gets called "before" any \<verb>.

As `_before_verb` and `_after_verb` run in the target-chain before and after any verb method does, `_pre_method` and `_post_method` will run in the method-chain before and after any user \<method> (e.g. `C.js`) and `_pre_sub`/`_post_sub` (parent-chain) will run before and after any \<sub-controller> ("pre" = before, "post" = after, not to be confused with the `_post` HTTP verb).

The \<sub-ctrl> part is where the recursion happens, where an `io` checks in and out at controllers, parent -> child -> parent. The child, a controller itself, has its own chains and child-controllers (sub-controllers).

See [Bootstruct's reserved names](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks/README.md)




Methods
-------
Both types of methods, reserved methods and non-reserved methods (user methods) are being `require`-d to the controller on init so they must export a single function. On request, methods handle at least one argument, an `io` (mentioned above). It holds the `request` and the `response` (and some other props and methods. To move the `io` forward in the chain you call: `io.next()`, unless you choose to end the response with `io.res.end()`.

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

All controllers have access to the same scope (`this.app`), which is the `app` instance itself so you could share data in your app without polluting any global scope or reapeating the same `require`-s. 

See [Bootstruct Hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) to learn how to populate your app instance with properties on init.




Files and Folders
-----------------
As said, Bootstruct translates user folders to controllers and user files to methods but reserved name entries (both files and folders) become methods in the controllers' chains regardless of the entry type (file/folder). Since those are being `require`-d on controllers, when using a folder with a reserved name, you must include an `index.js` file with the exported function. Node expects an `index.js` file when: `require('path/to/a/FOLDER')`.

Consider this structure for example:
```
├── api
│   └── friends
│       ├── index.js
│       ├── _get.js
│       └── _post.js
```
`index`, `_get` and `_post` are all reserved names for target-chain methods.

Let's say we have a user's "/friends" page in our social network app. Our `index` checks for authentication before both verbs. Our `_get` method is pretty simple, it gets the user's friends list and sends it back to the client. Our `_post` method, from the other hand, is quite messy: it has a lot of dependencies, it validates, sends an email, etc. In this case it would be better to turn the `_post.js` file into a `_post` folder:
```
├── api
│   └── friends
│       ├── index.js   // reserved name `index`
│       ├── _get.js
│       └── _post
│           ├── index.js     // = _post.js
│           ├── validate.js
│           ├── email.js
│           └── etc.js
```

The `_post` folder does NOT parsed as a controller because of its meaningful name, therefore the `index.js` file inside it is not treated as a reserved name (like `api/friends/index.js` does). It's just what Node is looking for when `require`-ing a folder. Consider: `require('friends/post')`.

In another case we have a tiny controller with `index` as its only method:
```
├── api               ──> controller
│   └── home          ──> controller
│       └── index.js  ──> method
```
Here it would be wise to cut the overhead of a controller and turn it into a method (a file):
```
├── api          ──> controller
│   └── home.js  ──> method
```
Both handle requests to `/home` but now instead of having two controllers and a method we have only one controller with a single method.

Generally folders become controllers but let's say we want a `home` method but due to its complexity we would like to turn it into a folder. In this case, we can put a flag entry named **_METHOD** inside the `home` folder and it won't be parsed as a controller but as a method.
```
├── api
│   └── home               ──> becomes a method
│       ├── index.js
│       ├── dependency.js
│       └── _METHOD        ──> a file or a folder
```

If you want a certain entry to be ignored by the parser, add a preceding underscore or a dot to its name:
```
├── api
│   ├── _myModules      <── 
│   │   ├── helper1.js
│   │   └── helper2.js
│   ├── _myUtils        <──
│   └── index.js
```

>**NOTE**: Non-`.js` files are always ignored (e.g. 'file.txt').




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
api      ──>  io.params = [A,B,whatever]
api/A    ──>  io.params = [B,whatever]
api/A/B  ──>  io.params = [whatever]
api/A    ──>  io.params = [whatever]
api      ──>  io.params = [whatever]
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




Argument Smart Matching
-----------------------
Let's say you want to support requests like: `/bookId/351/chapter/12`. Without the smart-matching your method will probably look like:
```js
module.exports = function (io, bookId, bookIdValue, chapter, chapterValue) {
	// ...
}
```

This makes your key params ("bookId" and "chpater") redundant:
```js
module.exports = function (io, bookId, bookIdValue, chapter, chapterValue) {
	bookId === 'bookId'   // static value - not very usefull
	bookIdValue === 351   // dynamic value
	chapter === 'chapter' // static value - not very usefull
	chapterValue === 12   // dynamic value
}
```

You can skip the duplication by doing:
```js
module.exports = function (io, $bookId, $chapter) {
	$bookId === 351
	$chapter === 12
}
```

Bootstruct reads your methods on initialization and looks at their params. For any parameter that starts with a `$` sign (e.g. `$myParam`), Bootstruct will "smart-match" its value.

single values like "blah" in `/bookId/351/blah/chapter/12` will be pushed last:
```js
module.exports = function (io, $bookId, $chapter, single) {
	$bookId === 351
	$chapter === 12
	single === 'blah'
}
```

**IMPORTANT NOTE:** The way Bootstruct extracts $params is by calling `.toString()` on your methods and a regular string match to get the $params. Currently ES6's default value feature is not supported:  
`function (io, $a, $b = 'default') {...}`
