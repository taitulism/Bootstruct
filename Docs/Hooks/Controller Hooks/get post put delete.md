_get, _post, _put, _delete
--------------------------
**Chain**: Target.

>**NOTE**: In Bootstruct's docs, referred to as "\<verbs>". Not to be confused with [_verbs](https://github.com/taitulism/Bootstruct/blob/entry-names/Docs/Reserved%20Entry%20Names/WebRoot/%24verbs.md) which is another reserved entry name.

These 4 HTTP verbs are **currently** the only supported HTTP verbs in Bootstruct. These verb methods should hold the core functionality of their controller for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.

Example structure:
```
├── www
│   ├── _get.js       ──> GET requests to '/'
│   ├── _post.js      ──> POST requests to '/'
│   └── A
│       ├── _get.js   ──> GET requests to '/A'
│       └── _post.js  ──> POST requests to '/A'
```

If you have an `index` method as well, it will get called **before** any verb does. That's why `index` has `_before_verb` as a synonym.

>**NOTE**: There's also an `_after_verb` method.

```
├── www
│   ├── index.js      <── ALL  requests to '/'
│   ├── _get.js        <── GET  requests to '/'
│   ├── _post.js       <── POST requests to '/'
│   └── A
│       ├── index.js  <── ALL  requests to '/A'
│       ├── _get.js    <── GET  requests to '/A'
│       └── _post.js   <── POST requests to '/A'
```

You'll have to call `io.next()` to make the `io` move on from the `index` method to the verb method.

A `www/index.js` file like:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.next();
	};
```
and a `www/get.js` file like:
```js
	module.exports = function (io) {
		console.log(__filename);
		io.res.end();
	};
```
will log (on a GET request):  
 &nbsp; path/to/www/index.js  
 &nbsp; path/to/www/_get.js

If **any** reserved name file gets bigger, you can turn it into a folder.  

Example:
```
├── app
│   ├── index.js
│   ├── _get.js
│   ├── _post.js     <── file
│   ├── _put.js
│   └── _delete.js
```
Our `post.js` file does a lot of stuff: validates, sanitizes, sends email, writes to database etc. We would probably want to do it in more than one file. We could:

```
├── app
│   ├── index.js
│   ├── _get.js
│   ├── _post        <── folder
│   │   ├── index.js
│   │   ├── dependency_1.js
│   │   └── dependency_2.js
│   ├── _put.js
│   └── _delete.js
```
Just remember to export your function from an `index.js` file. In this case the `index.js` is NOT parsed as the reserved entry name, it's just what Node is looking for when `require`-ing a folder. From that `index.js` file you can `require` anything.
