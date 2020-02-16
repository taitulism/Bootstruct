_in & _out
----------
**Chain**: All.

`_in` is the first thing controllers run when an `io` checks-in and `_out` is the very last thing to run.  
They get called for **any** request to the controller they are in.

Assume:
```
├── api
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
 &nbsp; path/to/api/_in.js  
 &nbsp; path/to/api/index.js  
 &nbsp; path/to/api/_out.js

**request**: `/A`  
**logs**:  
 &nbsp; path/to/api/_in.js  
 &nbsp; path/to/api/A/_in.js  
 &nbsp; path/to/api/A/index.js  
 &nbsp; path/to/api/A/_out.js  
 &nbsp; path/to/api/_out.js

`_in` and `_out` always get called. `index` runs only in the target-controller. 

Now with verbs:
```
├── api
│   ├── _in.js
│   ├── _before_verb.js  ("index" alias)
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

>**NOTE**: The full path to the `api` folder and file extensions (.js) were removed from log for readability:

```
request: GET `/`
logs:
	api/_in
	api/index
	api/_get
	api/_out

request: POST `/`
logs:
	api/_in
	api/index
	api/_post
	api/_out

request: GET `/A`
logs:
	api/_in
	api/A/_in
	api/A/index
	api/A/_get
	api/A/_out
	api/_out

request: POST `/A`
logs:
	api/_in
	api/A/_in
	api/A/index
	api/A/_post
	api/A/_out
	api/_out
```
