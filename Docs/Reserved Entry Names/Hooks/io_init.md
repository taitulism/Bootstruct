Hook: "io_init"
===============
**Entry Type**: both a file or a folder  
**Exports**: a function

The `IO` class is one of the main components in Bootstruct. `io` instances are created on every request and used to carry request related data while they "travel" between your controllers and methods.

You can write a function that will get called for any request on the `io` initialization, before the `io` checks-in at your `RC` (before `RC`'s `first` method). It's the very first code to run for any request. This way you can design the `io` to hold all the properties you'll need in your app. For example, having an `.IP` property or `.isLoggedIn` on your `io`s.

To do that, create in your [hooks folder](#hooks) an `io_init.js` file or an `io_init` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_init.js  <──
```
When using a file it should export an object:
```js
	// io_init.js
	module.exports = function (app) {...}
```

If your `io_init` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_init  <──
│           └── index.js
```



Context and arguments
---------------------
The context of the "this" keyword within the `io_init` function refers to the `io` instance.

The only argument the `io_init` function is called with is the `app` object. The `io_init` function hook could be considered as the lobby of your building, it's the first interaction point between your app and all incoming visitors but before any interaction with any controller.

At the end of the function, you need to tell Bootstruct the visitor (i.e. the `io`) is ready for a check-in at the root-controller (`RC`). You do that by calling a check-in method on the `app` object and pass it the `io`, which is the context of `this`.

```js
	module.exports = function my_init_fn (app) {
		// ... your code ...

		// "this" refers to the current "io" instance
		app.checkIn(this);
	};
```
