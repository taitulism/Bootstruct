$after-verb
-----------
**Chain**: Target.  
**Synonym**: `$after_verb`

`$after-verb`, like `$before-verb` (`index` synonym), will run for **any** request type in the **target**-controller but **after** the \<verb> method.
```
├── www
│   ├── $before-verb.js
│   ├── $get.js
│   ├── $post.js
│   └── $after-verb.js
```
```
request: GET `/`
logs:
	www/$before-verb
	www/$get
	www/$after-verb

request: POST `/`
logs:
	www/$before-verb
	www/$post
	www/$after-verb
```
