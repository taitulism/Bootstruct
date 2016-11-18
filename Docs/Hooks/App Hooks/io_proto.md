Hook: "io_proto"
================
**Entry Type**: both a file or a folder  
**Exports**: anything

The `IO` class is one of the main components in Bootstruct. `io` instances are created on every request and used to carry request related data while they "travel" between your controllers and methods.

The `IO` prototype is extendable. You can create your own methods and use them when you handle requests.

Let's say you want to do something with the query-string (domain.com/?key=value) in some of your methods. You would probably prefer to work with an object rather than a string. Create a `parseQryStr` method on the `IO` prototype and call it with `io.parseQryStr()` from where you need it.

To extend the `IO` prototype, create in your [hooks folder](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) an `io_proto.js` file or an `io_proto` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_proto.js  <──
```
When using a file it should export an object:
```js
	// io_proto.js
	module.exports = {
		parseQryStr: function (){...}
	};
```

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── io_proto  <──
│           └── parseQryStr.js
```
When using a folder, its entry names become the keys and whatever you export are the values. If `parseQryStr` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.

As expected, the "this" keyword within `IO` prototype methods refers to the `io` instance.