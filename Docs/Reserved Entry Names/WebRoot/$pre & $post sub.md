$pre-sub & $post-sub
--------------------
**Chain**: Parent.  
**Synonyms**: `$pre-sub`, `$post-sub`.

These reserved methods will run before and after a child-controller (sub-ctrl) (pre=before, post=after).

`index` and the verbs get called only by the target-controller. `$in` & `$out` get called anyway, whether the controller is the target-controller or not. `pre_sub` and `post_sub` get called only by a parent-controller, before and after the sub-controller, respectively.
```
├── www
│   ├── $in.js
│   ├── index.js
│   ├── $pre-sub.js    <──
│   ├── $post-sub.js   <──
│   ├── $out.js
│   └── A
│       ├── $in.js
│       ├── index.js
│       └── $out.js
```

Assume all files log their names and calling `io.next()` as before:
```
request: /
logs:
	www/$in
	www/index
	www/$out
(no sub-controller was called)

request: /A
logs:
	www/$in
	www/$pre-sub   <──
	www/A/$in
	www/A/index
	www/A/$out
	www/$post-sub  <──
	www/$out
```

The "A" controller doesn't have any sub-controllers so `$pre-sub` and `$post-sub` would be redundent if existed. They would never get called.
