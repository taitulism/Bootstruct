_after_verb
-----------
**Chain**: Target.  
**Synonym**: `_after-verb`

`_after_verb`, like `_before_verb` (`index` alias), will run for **any** request type in the **target**-controller but **after** the \<verb> method.
```
├── www
│   ├── _before_verb.js
│   ├── _get.js
│   ├── _post.js
│   └── _after_verb.js
```
```
request: GET `/`
logs:
	www/_before_verb
	www/_get
	www/_after_verb

request: POST `/`
logs:
	www/_before_verb
	www/_post
	www/_after_verb
```
