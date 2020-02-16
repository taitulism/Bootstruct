Use case example
----------------
```
├── api
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
	api/_in
	api/index
	api/_out

request: ALL `/qwe`
logs:
	api/_in
	api/qwe
	api/_out

request: ALL `/A`
logs:
	api/_in
	api/A/_in
	api/A/index
	api/A/_out
	api/_out

request: GET `/A/B`
logs:
	api/_in
	api/A/_in
	api/A/_pre_sub
	api/A/B/_in
	api/A/B/_before_verb
	api/A/B/get
	api/A/B/_after_verb
	api/A/B/_out
	api/A/_post_sub
	api/A/_out
	api/_out

request: POST `/A/B`
logs:
	api/_in
	api/A/_in
	api/A/_pre_sub
	api/A/B/_in
	api/A/B/_before_verb
	api/A/B/no_verb
	api/A/B/_after_verb
	api/A/B/_out
	api/A/_post_sub
	api/A/_out
	api/_out

request: GET | POST `/A/B/C`
logs:	
	api/_in
	api/A/_in
	api/A/_pre_sub
	api/A/B/_in
	api/A/B/_pre_sub
	api/A/B/C/_in
	api/A/B/C/index
	api/A/B/C/verbs/get|post (respectively)
	api/A/B/C/_out
	api/A/B/_post_sub
	api/A/B/_out
	api/A/_post_sub
	api/A/_out
	api/_out

request: PUT & DELETE `/A/B/C`
logs:
	api/_in
	api/A/_in
	api/A/_pre_sub
	api/A/B/_in
	api/A/B/_pre_sub
	api/A/B/C/_in
	api/A/B/C/index
	api/A/B/no_verb    ──> delegated
	api/A/B/C/_out
	api/A/B/_post_sub
	api/A/B/_out
	api/A/_post_sub
	api/A/_out
	api/_out
```
