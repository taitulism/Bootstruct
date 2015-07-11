Bootstruct
==========

>*Routing by structure.*


Table of contents
-----------------

  * [What is Bootstruct?](#what-is-bootstruct)
  * [Overview](#overview)
  * [What's next](#whats-next)




What is Bootstruct?
-------------------
Bootstruct is a Node web framework, based on a folder-structure / file-name convention.

Creating web apps with Node requires wiring up routes manually: We need to bind different URLs to different handlers. We usually do that by coding. With Bootstruct we do it by creating files and folders.

**Bootstruct**:
- [x] saves you from coding your routes.
- [x] enforces a natural code seperation by concept.
- [x] naturally provides you with nice URLs.
- [x] provides you with great control over request flow.




Overview
--------
The whole story happens in a single folder, the web-server's root folder (might ring some bells):
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   └── www              <──
```

Bootstruct ties that folder with your host root (domain root, localhost) and routes requests through that folder's structure, matching URLs to corresponding paths under that folder. 

To support routes like:

	domain.com/
	domain.com/A
	domain.com/A/B
	domain.com/A/B/C

your `www` folder tree should look like:
```
├── www
│   └── A
│       └── B
│           └── C
```

>NOTE: Bootstruct does not statically serve any file.

Bootstruct leverages the parental folders chain and provides you with an onion-like layered app with a great flow control over requests. For example, a request to `/A/B` (given the structure above) would go through:
```
1. www
2. www/A
3. www/A/B  <── request's target-folder
4. www/A
5. www
```

>Do you see the onion?

Requests start at the root folder `www`, do their way in to the target-folder, then go back out to the root folder and you can run some code on every step of the way.





Understand Bootstruct
---------------------
>NOTE: The term "Entry" (plural: "Entries") is used here to refer to both files and folders.

When Bootstruct is initalized it parses your `www` folder and creates an object that reflects your folder structure: the root-controller. Sub-folders become this controller's sub-controllers. Files become methods to their folder/controller:


Entries generally become controllers and sub-controllers




<!-- folders to ctrls -->
<!-- methods -->





Flow Control
------------
You control your app's flow by creating entries (files and folders) with certain names. Bootstruct has some reserved names for entries and each plays a certain role in the flow chain. Like a chain with named links, you mount your code on the chain by giving it on of these specific names:

* index / all / before_verb  ─┐
* get                         │
* post                        │
* put                         ├─ target-chain
* delete                      │
* no_verb                     │
* verbs                       │
* after_verb                 ─┘
* first
* pre_sub
* post_sub
* last



























 by creating files and folders with certain names. Bootstruct has some reserved names for entries (files and folders) and when a request arrives Bootstruct calls them in a certain order. .











Your folders become controllers and their relative paths under the web-root folder become your web-app's API.










To make it do something you can put some `index.js` files in those folders. This is the most basic setup:
```
├── www
│   ├── index.js              <── /
│   └── A
│       ├── index.js          <── /A
│       └── B
│           ├── index.js      <── /A/B
│           └── C
│               └── index.js  <── /A/B/C
```


Bootstruct has some reserved names for entries (files and folders) and `index` is one of them. These entries expected to export a single function because they are being `require`d as methods to your controllers. `index`'s job is to run only on the target-controller (target-folder). `index` and other methods should generally be like:
```js
	module.exports = function () {...};
```
then "www" becomes something like:
```js
	// pseudo code
	root_controller = {
		url  : '/'
		index: require('www/index')	
		sub_controllers: {
			A: {
				url  : '/A'
				index: require('www/A/index')	
				sub_controllers: {B...}
			}
		}
	}
```




You don't call these methods yourself, Bootstruct calls them in a certain order

These methods takes a single argument: `io`. It holds the native `request`/`response`, a `next` method and more. The `io` moves from one method to another and you can set your own prop on it.













Reserved Entry Names
--------------------

* index / all / before_verb  ─┐
* get                         │
* post                        │
* put                         ├─ target-chain
* delete                      │
* no_verb                     │
* verbs (!)                   │
* after_verb                 ─┘
* first
* pre_sub
* post_sub
* last

Each plays a certain role in the flow chain:

[IMAGE]
[IMAGE]
[IMAGE]






















`index` is a reserved name
Those `index.js` files are expected to export a single function:

 and its exported function will be called for any request to its containing folder. Reserved names are being `require`d as methods while custom name entries are parsed as 







 a dynamic array that holds the different URL parts (/A/B/C ──> ['A','B','C']). It's dynamic because on request to `/A/B/foo` it's only left with `['foo']`.













What's next?
------------
  * [Get started](#get-started)
  * [Read The Fabulous Manual](#read-the-fabulous-manual)




***********************************************************************
Questions, suggestions, criticism, bugs, hugs, typos and kudos are all welcome.

*taitulism(at)gmail(dot)com*

































For example, supporting different HTTP verbs (GET, POST, PUT, DELETE) is as easy as creating a `get.js` or a `post.js` file. These 4 verbs are reserved names in Bootstruct:
```
├── www
│   ├── get.js
│   ├── post.js
│   └── A
│       ├── get.js
│       ├── post.js
│       └── B
│           ├── get.js
│           ├── post.js
│           └── C
│               ├── get.js
│               └── post.js
```

Verbs files (and the `index.js` file mentioned above) are all called on the target-folder only. An `index.js` file (when exists) would run **before** any specific verb-file does. If you want some code to run **after** the verb, put it in an `after_verb.js` file.

```
├── www
│   ├── index.js
│   ├── get.js
│   ├── post.js
│   ├── after_verb.js
│   └── A
│       └── ...
```
On a **GET** request to `/`, Bootstruct will call the files in `www` in that order:
1. index.js
2. **get**.js
3. after_verb.js

On a **POST** request to `/`:
1. index.js
2. **post**.js
3. after_verb.js

>NOTE: `index.js` will run before any verb does, for all kinds of verbs. That's why you could also name it `before_verb.js` or `all.js`.




How Bootstruct files should look like?
--------------------------------------
Bootstruct expects reserved name entries to export a single function that accepts a single argument (they are being `require`d as methods on init). That argument is an object called: `io`. It holds the native `request`/`response` objects as props, a `next()` method that you call when your ready to move on to the next method and an array that holds the different URL parts:
* `io.req`
* `io.res`
* `io.next`
* `io.params`

Example:  
```js
	// index.js
	module.exports = function (io) {
		console.log(io.req.url); // ──> '/A/B/C'
		console.log(io.params);  // ──> ['A','B','C']

		io.res.write('hello world');

		io.next();
	};
```







