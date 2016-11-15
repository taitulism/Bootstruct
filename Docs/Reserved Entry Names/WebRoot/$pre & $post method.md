$pre-method & $post-method
--------------------------
**Chain**: Method.  
**Synonyms**: `$pre_method`, `$post_method` (respectively).

These reserved methods will run before and after the target-method (pre=before, post=after).
```
├── www
│   ├── $in.js
│   ├── index.js
│   ├── $pre-method.js    <── runs before methods
│   ├── A.js              <── file = method
│   ├── B.js              <── file = method
│   ├── $post-method.js   <── runs after methods
│   └── $out.js
```

Assume all files log their names and calling `io.next()`:
```
request: /
logs:
	www/$in
	www/index
	www/$out
(no method was called)

request: /a
logs:
	www/$in
	www/$pre-method   <──
	www/A.js
	www/$post-method  <──
	www/$out

request: /b
logs:
	www/$in
	www/$pre-method   <──
	www/B.js
	www/$post-method  <──
	www/$out
```
