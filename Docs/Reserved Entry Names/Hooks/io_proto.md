Hook: "io_proto"
================
**Entry Type**: both a file or a folder  
**Exports**: anything

The `IO` class is one of the main components in Bootstruct. `io` instances are created on every request and used to carry request related data while they "travel" between your controllers and methods.

The `IO` prototype is extendable. You can create your own methods and use them when you handle requests.

Let's say you need to get the request IP in some of your methods. Create a `getIP` method on the `IO` prototype and call it with `io.getIP()` from where you need it.

To extend the `IO` prototype, create in your [hooks folder](#hooks) an `io_proto.js` file or an `io_proto` folder.

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
		getIP: function (){...}
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
│           └── getIP.js
```
When using a folder, its entry names become the keys and whatever you export are the values. If `getIP` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.

As expected, the "this" keyword within `IO` prototype methods refers to the `io` instance.