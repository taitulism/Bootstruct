_pre_method & _post_method
--------------------------
**Chain**: Method.  
**Synonyms**: `_pre_method`, `_post_method` (respectively).

These reserved methods will run before and after the target-method (pre=before, post=after).
```
├── www
│   ├── _in.js
│   ├── index.js
│   ├── _pre_method.js    <── runs before methods
│   ├── A.js              <── user file = method
│   ├── B.js              <── user file = method
│   ├── _post_method.js   <── runs after methods
│   └── _out.js
```

Assume all files log their names and calling `io.next()`:
```
request: /
logs:
	www/_in
	www/index
	www/_out
(no method was called)

request: /a
logs:
	www/_in
	www/_pre_method   <──
	www/A.js
	www/_post_method  <──
	www/_out

request: /b
logs:
	www/_in
	www/_pre_method   <──
	www/B.js
	www/_post_method  <──
	www/_out
```
