Bootstruct Hooks
================
Bootstruct provides you with hooks to some key points in its architecture. That said, you should probably understand Bootstruct's architecture before moving on. Back to [docs main page](#docs).

Up until now it was all about the web-root folder, `www`. Bootstruct hooks are put in another folder. Bootstruct looks for a folder whose name is like your web-root folder's name with a trailing: "**_hooks**". If your web-root folder is `www`, your hooks folder would be `www_hooks`:
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks   <──
```

This folder is parsed when Bootstruct is initialized. Here too, certain names have their meanings:

* [ignore](#ignore)
* [io_init](#io_init)
* [io_exit](#io_exit)
* [io_proto](#io_proto)
* [ctrl_proto](#ctrl_proto)
* [entry_handlers](#entry_handlers)
* [shared_methods](#shared_methods)
* [shared_ctrls](#shared_ctrls)

By default, any entry in your hooks folder with a non-reserved name (e.g. `WhatEver.js`) will be `require`-d as a property to your `app` object (`this.global`). If the entry is a file, its extension will be ommited from the prop name:
``` js
	app = {
		WhatEver: require('www_hooks/WhatEver');
	}
```
If the entry is a folder, make sure to include an `index.js` file within.
