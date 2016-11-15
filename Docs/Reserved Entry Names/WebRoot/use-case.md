Use case example
----------------
```
├── www
│   ├── $in
│   │   ├── index.js
│   │   └── helper.js
│   ├── index.js
│   ├── qwe.js
│   ├── $out.js
│   └── A
│       ├── $in.js
│       ├── index.js
│       ├── $pre-sub.js
│       ├── $post-sub.js
│       ├── $out.js
│       └── B
│           ├── $in.js
│           ├── $before-verb
│           │    ├── index.js
│           │    └── helper.js
│           ├── $get.js
│           ├── $no-verb.js
│           ├── $after-verb.js
│           ├── $post-sub.js
│           ├── $pre-sub.js
│           ├── $out.js
│           └── C
│               ├── $in.js
│               ├── index.js
│               ├── verbs
│               │   ├── get.js
│               │   └── post
│               │       ├── index.js
│               │       └── helper.js
│               └── $out.js
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
	www/$in
	www/index
	www/$out

request: ALL `/qwe`
logs:
	www/$in
	www/qwe
	www/$out

request: ALL `/A`
logs:
	www/$in
	www/A/$in
	www/A/index
	www/A/$out
	www/$out

request: GET `/A/B`
logs:
	www/$in
	www/A/$in
	www/A/$pre-sub
	www/A/B/$in
	www/A/B/$before-verb
	www/A/B/get
	www/A/B/$after-verb
	www/A/B/$out
	www/A/$post-sub
	www/A/$out
	www/$out

request: POST `/A/B`
logs:
	www/$in
	www/A/$in
	www/A/$pre-sub
	www/A/B/$in
	www/A/B/$before-verb
	www/A/B/no_verb
	www/A/B/$after-verb
	www/A/B/$out
	www/A/$post-sub
	www/A/$out
	www/$out

request: GET | POST `/A/B/C`
logs:	
	www/$in
	www/A/$in
	www/A/$pre-sub
	www/A/B/$in
	www/A/B/$pre-sub
	www/A/B/C/$in
	www/A/B/C/index
	www/A/B/C/verbs/get|post (respectively)
	www/A/B/C/$out
	www/A/B/$post-sub
	www/A/B/$out
	www/A/$post-sub
	www/A/$out
	www/$out

request: PUT & DELETE `/A/B/C`
logs:
	www/$in
	www/A/$in
	www/A/$pre-sub
	www/A/B/$in
	www/A/B/$pre-sub
	www/A/B/C/$in
	www/A/B/C/index
	www/A/B/no_verb    ──> delegated
	www/A/B/C/$out
	www/A/B/$post-sub
	www/A/B/$out
	www/A/$post-sub
	www/A/$out
	www/$out
```
