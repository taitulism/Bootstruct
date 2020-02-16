_pre_sub & _post_sub
--------------------
**Chain**: Parent.  
**Synonyms**: `_pre-sub`, `_post-sub` (respectively).

These reserved methods will run before and after a child-controller (sub-ctrl) (pre=before, post=after).

`index` and the verbs get called only by the target-controller. `_in` & `_out` get called anyway, whether the controller is the target-controller or not. `pre_sub` and `post_sub` get called only by a parent-controller, before and after the sub-controller, respectively.
```
├── api
│   ├── _in.js
│   ├── index.js
│   ├── _pre_sub.js    <──
│   ├── _post_sub.js   <──
│   ├── _out.js
│   └── A
│       ├── _in.js
│       ├── index.js
│       └── _out.js
```

Assume all files log their names and calling `io.next()` as before:
```
request: /
logs:
	api/_in
	api/index
	api/_out
(no sub-controller was called)

request: /A
logs:
	api/_in
	api/_pre_sub   <──
	api/A/_in
	api/A/index
	api/A/_out
	api/_post_sub  <──
	api/_out
```

The "A" controller doesn't have any sub-controllers so `_pre_sub` and `_post_sub` would be redundent if existed. They would never get called.
