$after_verb
-----------
**Chain**: Target.  
**Synonym**: `$after-verb`

`$after_verb`, like `$before_verb` (`index` synonym), will run for **any** request type in the **target**-controller but **after** the \<verb> method.
```
├── www
│   ├── $before_verb.js
│   ├── $get.js
│   ├── $post.js
│   └── $after_verb.js
```
```
request: GET `/`
logs:
	www/$before_verb
	www/$get
	www/$after_verb

request: POST `/`
logs:
	www/$before_verb
	www/$post
	www/$after_verb
```
