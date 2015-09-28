Hook: "io_exit"
===============
**Entry Type**: both a file or a folder  
**Exports**: a function

The `IO` class is one of the main components in Bootstruct. `io` instances are created on every request and used to carry request related data while they "travel" between your controllers and methods.

You can write a function that will get called for any request on the `io`'s way out, after the `RC`'s `last` method. It's the very last code to run for any request. This can be used to set a default ending response like a "404 - not found".

To do that, create in your [hooks folder](#hooks) an `io_exit.js` file or an `io_exit` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_exit.js  <──
```
When using a file it should export an object:
```js
	// io_exit.js
	module.exports = function (app) {...}
```

If your `io_exit` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_exit  <──
│           └── index.js
```

The context of the "this" keyword within the `io_exit` function refers to the `io` instance.

The only argument the `io_exit` function is called with is the `app` object.