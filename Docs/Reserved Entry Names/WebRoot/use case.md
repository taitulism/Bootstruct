Use case example
----------------
```
├── www
│   ├── first
│   │   ├── index.js
│   │   └── helper.js
│   ├── index.js
│   ├── qwe.js
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       ├── pre_sub.js
│       ├── post_sub.js
│       ├── last.js
│       └── B
│           ├── first.js
│           ├── before_verb
│           │    ├── index.js
│           │    └── helper.js
│           ├── get.js
│           ├── no_verb.js
│           ├── after_verb.js
│           ├── post_sub.js
│           ├── pre_sub.js
│           ├── last.js
│           └── C
│               ├── first.js
│               ├── all.js
│               ├── verbs
│               │   ├── get.js
│               │   └── post
│               │       ├── index.js
│               │       └── helper.js
│               └── last.js
```

All files contain:
```js
	module.exports = function (io) {
	    console.log(__filename);
	    io.next();
	};
```

```
request: ALL `/`
logs:
	www/first
	www/index
	www/last

request: ALL `/qwe`
logs:
	www/first
	www/qwe
	www/last

request: ALL `/A`
logs:
	www/first
	www/A/first
	www/A/index
	www/A/last
	www/last

request: GET `/A/B`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/before_verb
	www/A/B/get
	www/A/B/after_verb
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: POST `/A/B`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/before_verb
	www/A/B/no_verb
	www/A/B/after_verb
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: GET & POST `/A/B/C`
logs:	
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/pre_sub
	www/A/B/C/first
	www/A/B/C/all
	www/A/B/C/verbs/get|post (respectively)
	www/A/B/C/last
	www/A/B/post_sub
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last

request: PUT & DELETE `/A/B/C`
logs:
	www/first
	www/A/first
	www/A/pre_sub
	www/A/B/first
	www/A/B/pre_sub
	www/A/B/C/first
	www/A/B/C/all
	www/A/B/no_verb ──> delegated
	www/A/B/C/last
	www/A/B/post_sub
	www/A/B/last
	www/A/post_sub
	www/A/last
	www/last
```