pre_method & post_method
------------------------
**Chain**: Method.  
**Synonyms**: `pre-method`, `preMethod`.  
**Synonyms**: `post-method`, `postMethod`.

These reserved methods will run before and after the target-method (pre=before, post=after).
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── pre_method.js    <──
│   ├── A.js
│   ├── B.js
│   ├── post_method.js   <──
│   └── last.js
```
Assume all files log their names and calling `io.next()` as before:
```
request: /
logs:
	www/first
	www/index
	www/last
(no method was called)

request: /a
logs:
	www/first
	www/pre_method   <──
	www/A.js
	www/post_method  <──
	www/last

request: /b
logs:
	www/first
	www/pre_method   <──
	www/B.js
	www/post_method  <──
	www/last
```