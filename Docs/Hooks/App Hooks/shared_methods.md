Hook: "shared_methods"
======================
**Entry Type**: both a file or a folder  
**Exports**: an object of functions (if file) or function files (if folder)

When Bootstruct is initialized it parses the web-root folder. User custom named folders become controllers, and files become methods.

When you need a certain method to be called by more than one controller, you don't want to duplicate the file in each folder you need it.

Let's say you are building a very friendly server: by requesting any of its paths with an additional `/help` in the URL (e.g. `/user/help`, `/user/profile/help`, `user/friends/help`) you get a response with some help text.

You can create a shared `help` method.

To create a shared method, create in your [hooks folder](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) a `shared_methods.js` file or a `shared_methods` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks
│       └── shared_methods.js  <──
```
When using a file it should export an object of named function:
```js
	// shared_methods.js
	module.exports = {
		help: function (io){...}
	};
```

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks
│       └── shared_methods  <──
│           └── help.js
```
When using a folder, its entry names become the keys and whatever you export are the values. If `help` gets too big for a single file, turn it into a folder and export the function from an `index.js` file.
