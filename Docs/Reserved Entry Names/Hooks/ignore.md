Hook: "ignore"
==============
**Entry Type**: file  
**Exports**: a string or an array of strings

When Bootstruct is initialized it parses the web-root folder. User folders become controllers, user files become methods and reserved name entries become methods in the controllers' chains. When you need an entry (a file or a folder) to be ignored you can give it a name that starts with an underscore or a dot (e.g. `.ignoredEntry` or `_ignoredEntry`).

An example would be:
```
├── www
│   ├── _myModules     <── ignored by parser
│   │   ├── helper1.js
│   │   ├── helper2.js
│   │   └── helper3.js
│   └── index.js
```
In this case `_myModules` is not parsed as a controller and you cannot reach it by requesting `/_myModules`. This request would be handled by the `index` method and `_myModules` would be a parameter in `io.params` array.

An underscore in your entry names is generally not a pretty sight.

You can add "myModules" (without the underscore) to the parser's ignore list. You do that by creating a file named `ignore.js` in your [hooks folder](#hooks) and exporting your ignored names:
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── ignore.js   <──
```

From within `ignore.js` you export a string:
```js
	module.exports = 'myModules';
```
or an array of strings (ignore list)
```js
	module.exports = ['myModules', 'myHelpers'];
```
