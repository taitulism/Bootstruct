_pre_method & _post_method
--------------------------
**Chain**: Method.  
**Synonyms**: `_pre_method`, `_post_method` (respectively).

These reserved methods will run before and after the target-method (pre=before, post=after).
```
├── api
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
	api/_in
	api/index
	api/_out
(no method was called)

request: /a
logs:
	api/_in
	api/_pre_method   <──
	api/A.js
	api/_post_method  <──
	api/_out

request: /b
logs:
	api/_in
	api/_pre_method   <──
	api/B.js
	api/_post_method  <──
	api/_out
```
