_in & _out
----------
**Chain**: All.

`_in` is the first thing controllers run when an `io` checks-in and `_out` is the very last thing to run.  
They get called for **any** request to the controller they are in.

Assume:
```
├── www
│   ├── _in.js
│   ├── index.js
│   ├── _out.js
│   └── A
│       ├── _in.js
│       ├── index.js
│       └── _out.js
```
Assume all files log their names and calling `io.next()`:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.next();
	};
```

The following shows the logs we'll get for different requests:

**request**: `/`  
**logs**:  
 &nbsp; path/to/www/_in.js  
 &nbsp; path/to/www/index.js  
 &nbsp; path/to/www/_out.js

**request**: `/A`  
**logs**:  
 &nbsp; path/to/www/_in.js  
 &nbsp; path/to/www/A/_in.js  
 &nbsp; path/to/www/A/index.js  
 &nbsp; path/to/www/A/_out.js  
 &nbsp; path/to/www/_out.js

`_in` and `_out` always get called. `index` runs only in the target-controller. 

Now with verbs:
```
├── www
│   ├── _in.js
│   ├── _before_verb.js  ("index" synonym)
│   ├── _get.js     <──
│   ├── _post.js    <──
│   ├── _out.js
│   └── A
│       ├── _in.js
│       ├── _before_verb.js
│       ├── _get.js     <──
│       ├── _post.js    <──
│       └── _out.js
```

>**NOTE**: The full path to the `www` folder and file extensions (.js) were removed from log for readability:

```
request: GET `/`
logs:
	www/_in
	www/index
	www/_get
	www/_out

request: POST `/`
logs:
	www/_in
	www/index
	www/_post
	www/_out

request: GET `/A`
logs:
	www/_in
	www/A/_in
	www/A/index
	www/A/_get
	www/A/_out
	www/_out

request: POST `/A`
logs:
	www/_in
	www/A/_in
	www/A/index
	www/A/_post
	www/A/_out
	www/_out
```
