Bootstruct Hooks
================
Bootstruct provides you with hooks to some key points in its architecture. It would be easier to learn when you already have a decent grasp of 
Bootstruct's components. Not sure? read the following paragraph or go back to [docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md).

In short:  
* The `api` folder is an office building with departments (`controllers`) and sub-departments. 
* Visitors (`io`) check in and out at this office. 
* All departments have access to the building infrastructure (the `app` object).




The App Hooks Folder
--------------------
Up until now it was all about the web root folder, `api`. Bootstruct app level hooks are put in another folder. On init Bootstruct looks for a 
folder whose name is like your web root folder's name with a trailing: "**_hooks**" in its name. If your web root folder is `api`, Bootstruct will 
look for a folder named `api_hooks`:
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks   <──
```



Extend your App
---------------
The hooks folder is parsed when Bootstruct is initialized BEFORE the web root folder. You use hooks by creating entries in the hooks folder and 
naming them with certain names.

By default, any entry in your hooks folder with a non-reserved name (e.g. `WhatEver.js`) will be `require`-d as a property on 
your `app` instance and you could access it by using `this.app` in your methods. If the entry is a file (e.g. `WhatEver.js`), its 
extension (`.js`) will be ommited from the prop name:
``` js
	// this is kind of what's going on behind the scenes:
	app = {
		WhatEver: require('api_hooks/WhatEver');
	}
```

If the entry is a folder, make sure to include an `index.js` file within.
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── api
│   └── api_hooks
│       └── WhatEver     <──
│           └── index.js
```
This is how you extend your `app` instance. It loads props on your app's main object,. Use it for properties and methods you need access to, from anywhere in 
your app: a database connection, log methods, error methods or whatever you'd like.

Here are the rest of Bootstruct's hooks (click to read about):
* [ignore](./Hooks/App%20Hooks/ignore.md)
* [io_init](./Hooks/App%20Hooks/io_init.md)
* [io_exit](./Hooks/App%20Hooks/io_exit.md)
* [io_proto](./Hooks/App%20Hooks/io_proto.md)
* [ctrl_proto](./Hooks/App%20Hooks/ctrl_proto.md)
* [ctrl_hooks](./Hooks/App%20Hooks/ctrl_hooks.md)
* [shared_methods](./Hooks/App%20Hooks/shared_methods.md)
* [shared_ctrls](./Hooks/App%20Hooks/shared_ctrls.md)
