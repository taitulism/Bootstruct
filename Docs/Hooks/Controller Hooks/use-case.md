Use case example
----------------
```
├── www
│   ├── _in
│   │   ├── index.js
│   │   └── helper.js
│   ├── index.js
│   ├── qwe.js
│   ├── _out.js
│   └── A
│       ├── _in.js
│       ├── index.js
│       ├── _pre_sub.js
│       ├── _post_sub.js
│       ├── _out.js
│       └── B
│           ├── _in.js
│           ├── _before_verb
│           │    ├── index.js
│           │    └── helper.js
│           ├── _get.js
│           ├── _no_verb.js
│           ├── _after_verb.js
│           ├── _post_sub.js
│           ├── _pre_sub.js
│           ├── _out.js
│           └── C
│               ├── _in.js
│               ├── index.js
│               ├── verbs
│               │   ├── get.js
│               │   └── post
│               │       ├── index.js
│               │       └── helper.js
│               └── _out.js
```

Assume all files logs their paths (full path ommited for readability):
```js
	module.exports = function (io) {
	    console.log(__filename);
	    io.next();
	};
```

```
request: ALL `/`
logs:
	www/_in
	www/index
	www/_out

request: ALL `/qwe`
logs:
	www/_in
	www/qwe
	www/_out

request: ALL `/A`
logs:
	www/_in
	www/A/_in
	www/A/index
	www/A/_out
	www/_out

request: GET `/A/B`
logs:
	www/_in
	www/A/_in
	www/A/_pre_sub
	www/A/B/_in
	www/A/B/_before_verb
	www/A/B/get
	www/A/B/_after_verb
	www/A/B/_out
	www/A/_post_sub
	www/A/_out
	www/_out

request: POST `/A/B`
logs:
	www/_in
	www/A/_in
	www/A/_pre_sub
	www/A/B/_in
	www/A/B/_before_verb
	www/A/B/no_verb
	www/A/B/_after_verb
	www/A/B/_out
	www/A/_post_sub
	www/A/_out
	www/_out

request: GET | POST `/A/B/C`
logs:	
	www/_in
	www/A/_in
	www/A/_pre_sub
	www/A/B/_in
	www/A/B/_pre_sub
	www/A/B/C/_in
	www/A/B/C/index
	www/A/B/C/verbs/get|post (respectively)
	www/A/B/C/_out
	www/A/B/_post_sub
	www/A/B/_out
	www/A/_post_sub
	www/A/_out
	www/_out

request: PUT & DELETE `/A/B/C`
logs:
	www/_in
	www/A/_in
	www/A/_pre_sub
	www/A/B/_in
	www/A/B/_pre_sub
	www/A/B/C/_in
	www/A/B/C/index
	www/A/B/no_verb    ──> delegated
	www/A/B/C/_out
	www/A/B/_post_sub
	www/A/B/_out
	www/A/_post_sub
	www/A/_out
	www/_out
```
