first & last
------------
**Chain**: All.

Another two reserved entry names. When exist, they always get called whether the controller is the target-controller or a parent. `first` is the first thing controllers run when an `io` checks-in and `last` is the very last thing to run.

Assume:
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       └── last.js
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
 &nbsp; path/to/www/first.js  
 &nbsp; path/to/www/index.js  
 &nbsp; path/to/www/last.js

**request**: `/A`  
**logs**:  
 &nbsp; path/to/www/first.js  
 &nbsp; path/to/www/A/first.js  
 &nbsp; path/to/www/A/index.js  
 &nbsp; path/to/www/A/last.js  
 &nbsp; path/to/www/last.js

`first` and `last` always run. `index` runs only in the target-controller. 

Now with verbs:
```
├── www
│   ├── first.js
│   ├── beforeVerb.js  ("index" synonym)
│   ├── get.js     <──
│   ├── post.js    <──
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── beforeVerb.js
│       ├── get.js     <──
│       ├── post.js    <──
│       └── last.js
```

>**NOTE**: The full path to the `www` folder and file extensions (.js) were removed from log for better readability:

```
request: GET `/`
logs:
	www/first
	www/index
	www/get
	www/last

request: POST `/`
logs:
	www/first
	www/index
	www/post
	www/last

request: GET `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/get
	www/A/last
	www/last

request: POST `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/post
	www/A/last
	www/last
```