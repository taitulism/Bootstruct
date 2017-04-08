Hook: "ctrl_hooks"
==================
**Entry Type**: both a file or a folder  
**Exports**: an object of functions (if file) or functions files (if folder)

When Bootstruct is initialized it parses the web-root folder. User folders become controllers, user files become methods and reserved name entries become methods in the controllers' chains. 

You can add your own reserved names and write their parser handlers.

An "entry handler" is a named function. The name is for the parser to match with entries in your web-root different folders (soon to become controllers). The handler, a function, is what should the parser do when it "hits" this name. "ctrl_hooks" are used to do something with a matched entry's contents in the context of the current holding folder/controller.

>**NOTE**: Bootstruct has an entry handler for each reserved name.

Let's say you want to read and cache some static resources or precompile some views (templates) in your different controllers. You can add the parser with a `views` handler or a `public` handler to run when it "hits" these names in your controllers. For example:
```
├── www (RC)
│   ├── blogPost
│   │    ├── get.js
│   │    ├── post.js
│   │    └── Views    ──> precompile and set on "blogPost" controller
│   └── Public        ──> read and cache on "RC"
```

To create controller-hooks, create in your [hooks folder](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md) a `ctrl_hooks.js` file or an `ctrl_hooks` folder.

**File**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── ctrl_hooks.js  <──
```
When using a file it should export an object of named functions like:
```js
	// ctrl_hooks.js
	module.exports = {
		views: function (){...},
		public: function (){...}
	};
```

**Folder**  
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── ctrl_hooks  <──
│           ├── views
│           └── public.js
```
When using a folder, its entry names are the function names and they export the functions. Files like `public.js` here should export a function and folders like `views` should have an `index.js` file that exports the function.




Handler Function
----------------
You have the controller in one hand (the context of `this`) and the content on the other hand (the function argument) so in your handler you access the content, parse it according to your needs and set the result as a property on the controller. That happens on init. Later on you could use these props from your web-root methods.

**Context**  
Inside the handler functions the "this" keyword refers to the current holding controller. In the `views` handler, the "this" keyword will refer to the "blogPost" controller (see above) and in the `public` handler, it will refer to the `RC`.

**Arguments**  
The only argument passed to your handler functions is an object called `entryMap`. Its purpose is to give you a good starting point to access the contents of your entries, the views in the `Views` folder and the static resources in the `Public` folder.

This object is a map of the parsed entry (e.g. `Public`, `Views`). It has two or three properties: 

* `path` (string) - The absolute path to the entry (e.g. `'c:/www/blogPost/views'`)

* `type` (number) - The type of the entry. `0` for folders and `1` for files (symlinks, junctions or any other types are currently not supported).

* `entries` (object) - This property exist only for folders. The entries inside the current folder are mapped with the same format (entryMaps). This object's keys are those entries names and its values are entryMap objects.

A generic example:
```js
	entryMap = {
	    type: 0|1,
	    path: 'absolute/path/to/entry',
	    entries: {
	        entryName1: {entryMap},
	        entryName2: {entryMap},
	        entryName3: {entryMap}
	    }
	};
```




Example
-------
```
├── www
│   ├── index.js
│   └── Views
│       ├── home.jade
│       └── contactForm.jade
```
"jade" is a template engine. `.jade` files need to be compiled before served as HTML.

Let's say we want the parser to do something every time it hits a `Views` folder: compile the files within (as jade temaplates) and set the result on the controller the `Views` folder was found in.

The `views` entry handler file could look like this:
```js
	// www_hooks/ctrl_hooks/views.js
	var fs   = require('fs');
	var jade = require('jade');

	module.exports = function (entryMap) {
		 /*
		 |	"this" refers to the "RC"
		 |
		 |	"entryMap" object contains:
		 |  {
		 |		path: 'path/to/www/Views',
		 |		type: 0,
		 |		entries: {
		 |			'home.jade': {
		 |				path: 'path/to/www/Views/home.jade',
		 |				type: 1
		 |			},
		 |			'contactForm.jade': {
		 |				path: 'path/to/www/Views/contactForm.jade',
		 |				type: 1
		 |			}
		 |		}
		 |	}
		*/
		var template, tplName;

		// set a new "views" prop on the controller
		this.views = {};

		 /*
		 | loop through the templates, compile them and 
		 | populate "views" on the controller
		*/
		for (tplName in entryMap.entries) {
			// read the template
			template = fs.readFileSync( entryMap.entries[tplName].path );

			// pseudo code to remove the ".jade" extension.
			// to store it on the controller without the '.jade' extension.
			tplName = removeExt(tplName);

			// compile the template
			this.views[tplName] = jade.compile(template);
		}
	};
```

To serve the compiled templates (HTML) you can use `this.views[tplName]` from your `www/index.js` file.
```js
	// www/index.js
	module.exports = function (io, action) {
		if (action == 'contactUs') { // request: '/contactUs'
			io.res.end( this.views['contactForm']() );
		}
		else {
			io.res.end( this.views['home']() );
		}
	};
```
