pre_sub & post_sub
------------------
**Chain**: Parent.  
**Synonyms**: `pre-sub`, `preSub`.  
**Synonyms**: `post-sub`, `postSub`.

`index` and the verbs get called only by the target-controller. `first` & `last` get called anyway, whether the controller is the target-controller or not. `pre_sub` and `post_sub` get called only by a parent-controller, before and after the sub-controller, respectively.
```
├── www
│   ├── first.js
│   ├── index.js
│   ├── pre_sub.js   <──
│   ├── post_sub.js  <──
│   ├── last.js
│   └── A
│       ├── first.js
│       ├── index.js
│       └── last.js
```

Assume all files log their names and calling `io.next()` as before:
```
request: /
logs:
	www/first
	www/index
	www/last
(no sub-controller was called)

request: /A
logs:
	www/first
	www/pre_sub   <──
	www/A/first
	www/A/index
	www/A/last
	www/post_sub  <──
	www/last
```

The "A" controller doesn't have any sub-controllers so `pre_sub` and `post_sub` would be redundent if existed. They would never get called.