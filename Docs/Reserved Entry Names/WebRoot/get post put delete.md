get, post, put, delete
----------------------
**Chain**: Target.

These 4 HTTP verbs are reserved entry names and also get mounted on their controller's target-chain. The verb methods should hold the core functionality of their controller.

Example structure:
```
├── www
│   ├── get.js       ──> GET requests to '/'
│   ├── post.js      ──> POST requests to '/'
│   └── A
│       ├── get.js   ──> GET requests to '/A'
│       └── post.js  ──> POST requests to '/A'
```

If you have an `index` method as well, it will get called **before** any verb does. That's why `index` has `before_verb` as a synonym.

>**NOTE**: There's also an `after_verb` method...

```
├── www
│   ├── index.js      <── ALL  requests to '/'
│   ├── get.js        <── GET  requests to '/'
│   ├── post.js       <── POST requests to '/'
│   └── A
│       ├── index.js  <── ALL  requests to '/A'
│       ├── get.js    <── GET  requests to '/A'
│       └── post.js   <── POST requests to '/A'
```

Now you'll have to call `io.next()` to make the `io` move on from the `index` method to the verb method.

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
 &nbsp; path/to/www/get.js

BTW, If **any** reserved name file gets bigger, you can turn it into a folder.

```
├── app
│   ├── index.js
│   ├── get.js
│   ├── post.js     <── file
│   ├── put.js
│   └── delete.js
```
Our `post.js` file does a lot of stuff: validates, sanitizes, sends email, writes to database etc. We would probably want to do it in more than one file. We could:

```
├── app
│   ├── index.js
│   ├── get.js
│   ├── post        <── folder
│   │   ├── index.js
│   │   ├── dependency_1.js
│   │   └── dependency_2.js
│   ├── put.js
│   └── delete.js
```
Just remember to export your function from an `index.js` file. In this case the `index.js` is NOT parsed as the reserved entry name, it's just what Node is looking for when `require`ing a folder. From that `index.js` file you can `require` anything.