_no_verb
--------
**Chain**: Target.  
**Synonym**: `_no-verb`.

The `_no_verb` method will get called for request type that the target-controller doesn't have a <verb> for, like a POST request to a controller without a `_post.js` file.

```
├── api
│   ├── index.js
│   ├── _get.js
│   └── _no_verb.js
```

If someone makes a non-supported HTTP verb request and you want to respond to this case, `_no_verb` is your method.
```
request: GET `/`
logs:
	api/index
	api/_get

request: POST `/`
logs:
	api/index
	api/_no_verb
```

The `_no_verb` method is kinda special because it's a delegated method: the controller who has it, delgates this method to all of its sub-controllers.
```
├── api (RC)
│   ├── index.js
│   ├── _get.js
│   ├── _post.js
│   ├── _no_verb.js
│   └── A
│       └── _get.js
```
On a POST request to `/A` (which doesn't have a `_post` method) you'll get the `api/_no_verb.js` called. Delegated from the "RC".

**IMPORTANT NOTE:** The `_no_verb` method gets called only if at least 1 verb file exists (`_get`, `_post`, `_put`, `_delete`).
