_after_verb
-----------
**Chain**: Target.  
**Synonym**: `_after-verb`

`_after_verb`, like `_before_verb` (`index` alias), will run for **any** request type in the **target**-controller but **after** the \<verb> method.
```
├── api
│   ├── _before_verb.js
│   ├── _get.js
│   ├── _post.js
│   └── _after_verb.js
```
```
request: GET `/`
logs:
	api/_before_verb
	api/_get
	api/_after_verb

request: POST `/`
logs:
	api/_before_verb
	api/_post
	api/_after_verb
```
