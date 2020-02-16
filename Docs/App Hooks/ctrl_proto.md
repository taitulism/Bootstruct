Hook: "ctrl_proto"
==================
**Entry Type**: both a file or a folder  
**Exports**: anything

The `Ctrl` class is one of the main components in Bootstruct. `ctrl` instances (controllers) are nested inside each other and the root controller is the building that `io`s visit its different "departments" and "sub-departments".

The `Ctrl` prototype is extendable. You can create your own methods and use them when you handle requests.

Let's say you want to be able to log some request data to a file. Create on the `Ctrl` prototype a `log2file` method that accepts an `io` as an argument and call it when you need it with `this.log2file(io)`.

To extend the `Ctrl` prototype, create in your [hooks folder](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) an `ctrl_proto.js` file or an `ctrl_proto` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks
│       └── ctrl_proto.js  <──
```
When using a file it should export an object:
```js
	// ctrl_proto.js
	module.exports = {
		log2file: function (io){...}
	};
```

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks
│       └── ctrl_proto  <──
│           └── log2file.js
```
When using a folder, its entry names become the keys and whatever you export are the values. If `log2file` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.

As expected, the "this" keyword within `Ctrl` prototype methods refers to the `ctrl` instance.
