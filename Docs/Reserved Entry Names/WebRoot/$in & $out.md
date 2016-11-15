$in & $out
----------
**Chain**: All.

`$in` is the first thing controllers run when an `io` checks-in and `$out` is the very last thing to run.  
They get called for **any** request to the controller they are in.

Assume:
```
├── www
│   ├── $in.js
│   ├── index.js
│   ├── $out.js
│   └── A
│       ├── $in.js
│       ├── index.js
│       └── $out.js
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
 &nbsp; path/to/www/$in.js  
 &nbsp; path/to/www/index.js  
 &nbsp; path/to/www/$out.js

**request**: `/A`  
**logs**:  
 &nbsp; path/to/www/$in.js  
 &nbsp; path/to/www/A/$in.js  
 &nbsp; path/to/www/A/index.js  
 &nbsp; path/to/www/A/$out.js  
 &nbsp; path/to/www/$out.js

`$in` and `$out` always get called. `index` runs only in the target-controller. 

Now with verbs:
```
├── www
│   ├── $in.js
│   ├── $before-verb.js  ("index" synonym)
│   ├── $get.js     <──
│   ├── $post.js    <──
│   ├── $out.js
│   └── A
│       ├── $in.js
│       ├── $before_verb.js
│       ├── $get.js     <──
│       ├── $post.js    <──
│       └── $out.js
```

>**NOTE**: The full path to the `www` folder and file extensions (.js) were removed from log for readability:

```
request: GET `/`
logs:
	www/$in
	www/index
	www/$get
	www/$out

request: POST `/`
logs:
	www/$in
	www/index
	www/$post
	www/$out

request: GET `/A`
logs:
	www/$in
	www/A/$in
	www/A/index
	www/A/$get
	www/A/$out
	www/$out

request: POST `/A`
logs:
	www/$in
	www/A/$in
	www/A/index
	www/A/$post
	www/A/$out
	www/$out
```
