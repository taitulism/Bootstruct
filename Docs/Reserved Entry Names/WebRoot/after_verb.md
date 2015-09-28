after_verb
----------
**Chain**: Target.  
**Synonyms**: `all_done`, `all-done`, `allDone`, `after-verb`, `afterVerb`.

`after_verb`, like `before_verb` (`index` synonym), will run for **any** request type in the target-controller but **after** the verb method. Probably very self explanatory by now.
```
├── www
│   ├── before_verb.js
│   ├── get.js
│   ├── post.js
│   └── after_verb.js
```
```
request: GET `/`
logs:
	www/before_verb
	www/get
	www/after_verb

request: POST `/`
logs:
	www/before_verb
	www/post
	www/after_verb
```