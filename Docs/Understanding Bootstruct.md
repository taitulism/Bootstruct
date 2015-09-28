io
--
All of the methods your files export, accept a single argument, an object called `io`. It holds the native `request`/`response` objects as `io.req` & `io.res` (respectively) so you could:
```js
	module.exports = function (io) {
		console.log(io.req.method); // ──> e.g. 'GET'

		io.res.write('hello world');
		io.res.end();
	};
```

The `io` moves from one controller to another and inside controllers, from one method to another. You move it around by calling `io.next()`:
```js
	module.exports = function (io) {
		io.res.write('hello ');
		io.next();
	};
```
```js
	module.exports = function (io) {
		io.res.write('world');
		io.next();
	};
```

You're encouraged to use the `io` as you like. Set it with your own props in an outer layer, use them in the inner parts. It's a good way to pass request related data along your app, without polluting any global scope. for example: request to `/blog/edit`:
```js
	// pseudo auth (for example in a 'www/Blog/first.js' file)
	module.exports = function (io) {
		io.isAdmin = true; /* "isAdmin" is a made up property */
		io.next();
	};
```
```js
	// somewhere down the road...
	// same request, in a different file (e.g. 'www/Blog/Edit/index.js')
	module.exports = function (io) {
		if (io.isAdmin){
			//...
		}
	};
```

The `io` also holds an array of the split URL pathname (by slash) as `io.params`. Each controller the `io` checks-in at (with the "RC" as an exception) removes its name from the array. Let's say we have:
```
├── www     (RC)
│   ├── index.js
│   └── A
│       ├── index.js
│       └── B
│           └── index.js
```

On request to `/A/B/whatever` the `io.params` array starts as `['A','B','whatever']` but ends as `['whatever']`. Both "A" and "B" controllers remove their names on check-in:
```
www      ──>  io.params = [A,B,whatever]
www/A    ──>  io.params = [B,whatever]
www/A/B  ──>  io.params = [whatever]
www/A    ──>  io.params = [whatever]
www      ──>  io.params = [whatever]
```

**IMPORTANT NOTE:** Bootstruct uses the first item to find the target-controller. Don't manipulate this array unless you know what you're doing (`.push`ing and `.pop`ing your own items is cool. Changing the existing items could cause a mess).




