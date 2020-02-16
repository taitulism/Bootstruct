Extending Bootstruct
====================
Bootstruct provides you with hooks to some key points in its architecture.
These hooks allow you to create your own API over Bootstruct's infrastructure.

* You can add methods to the `Ctrl`'s prototype and the `IO` prototype. Create a `this.kick(io)` or a `io.getIP()` methods.

* You can load your own stuff on your `app` instance and access them from your controllers and methods (`this.app`). A database connection, a reference to the server, a log-to-file function or whatever.

* You can add your own [Hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks/README.md) on the parser. For example, precompile "views" folders.

* You can create shared methods and shared controllers instead of copy-pasting the same files in every folder (when you need the same functionality in more than one place). A shared `help` method/controller will allow: `/any-url/help`).

* You can run some code on `io` initialization. This is the very first thing to run on each request, before the `io` checks-in at your app. Set some request related props like `io.isAuthorized` or `io.isIdle` ready for use in your methods. You can create methods on the `io.prototype` (another hook) and invoke them on `io` initialization.

* You can run some code when the `io` checks-out from your app and choose what to do at the end of the request cycle (end the response? log it? pass it to another framework?).

With these hooks you can create yourself your own set of tools and use Bootstruct as a platform or infrastructure with your own syntax.

Read more about [Bootstruct Hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md).


Bootstruct Classes
------------------
The three main classes are `App`, `Ctrl` and `IO`.

The story, in short:
* The `api` web root folder is an office building with different departments (`controllers`) and sub-departments. 
* Client requests are the visitors (`IO`s) checking in and out at this office. 
* All departments have access to the building infrastructure (the `app` object).

So controllers are nested inside each other and they all have a reference to the app object. `IO`s check in and out at this structure.


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
* [ignore](./App%20Hooks/ignore.md)
* [io_init](./App%20Hooks/io_init.md)
* [io_exit](./App%20Hooks/io_exit.md)
* [io_proto](./App%20Hooks/io_proto.md)
* [ctrl_proto](./App%20Hooks/ctrl_proto.md)
* [ctrl_hooks](./App%20Hooks/ctrl_hooks.md)
* [shared_methods](./App%20Hooks/shared_methods.md)
* [shared_ctrls](./App%20Hooks/shared_ctrls.md)
