Bootstruct Hooks
================
Bootstruct provides you with hooks to some key points in its architecture. It would be easier to learn when you already have a decent grasp of Bootstruct's components. Not sure? read the following paragraph or go back to [docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md).

In short:  
* The `www` folder is an office building with departments (`controllers`) and sub-departments. 
* Visitors (`io`) check in and out at this office. 
* All departments have access to the building infrastructure (the `app` object).




The Hooks Folder
----------------
Up until now it was all about the web-root folder, `www`. Bootstruct hooks are put in another folder, the hooks folder. On init Bootstruct looks for a folder whose name is like your web-root folder's name with a trailing: "**_hooks**" in its name. If your web-root folder is `www`, Bootstruct will look for a folder named `www_hooks`:
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks   <──
```



Hooks
-----
The hooks folder is parsed when Bootstruct is initialized BEFORE the web-root folder. You use hooks by creating entries in the hooks folder and naming them with certain (reserved) names.

By default, any entry in your hooks folder with a non-reserved name (e.g. `WhatEver.js`) will be `require`-d as a property on your `app` instance and you could access it by using `this.global` in your methods. If the entry is a file (e.g. `WhatEver.js`), its extension (`.js`) will be ommited from the prop name:
``` js
	// PSEUDO result
	app = {
		WhatEver: require('www_hooks/WhatEver');
	}
```
If the entry is a folder, make sure to include an `index.js` file within.
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── WhatEver     <──
│           └── index.js
```
This is how you extend your `app` instance. Use it for properties and methods you need access to from anywhere in your app: a database connection, log methods, error methods, a reference to the server or whatever you'd like.

Here are the rest of Bootstruct's hooks (click to read about):
* [ignore](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/ignore.md)
* [io_init](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/io_init.md)
* [io_exit](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/io_exit.md)
* [io_proto](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/io_proto.md)
* [ctrl_proto](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/ctrl_proto.md)
* [entry_handlers](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/entry_handlers.md)
* [shared_methods](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/shared_methods.md)
* [shared_ctrls](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved-Entry-Names/Hooks/shared_ctrls.md)