$no_verb
--------
**Chain**: Target.  
**Synonym**: `$no-verb`.

The `$no_verb` method will get called for request type that the target-controller doesn't have a <verb> for, like a POST request to a controller without a `$post.js` file.

```
├── www
│   ├── index.js
│   ├── $get.js
│   └── $no_verb.js
```

If someone makes a non-supported HTTP verb request and you want to respond to this case, `$no_verb` is your method.
```
request: GET `/`
logs:
	www/index
	www/$get

request: POST `/`
logs:
	www/index
	www/$no_verb
```

The `$no_verb` method is kinda special because it's a delegated method: the controller who has it, delgates this method to all of its sub-controllers.
```
├── www (RC)
│   ├── index.js
│   ├── $get.js
│   ├── $post.js
│   ├── $no_verb.js
│   └── A
│       └── $get.js
```
On a POST request to `/A` (which doesn't have a `$post` method) you'll get the `www/$no_verb.js` called. Delegated from the "RC".

**IMPORTANT NOTE:** The `$no_verb` method gets called only if at least 1 verb file exists (`$get`, `$post`, `$put`, `$delete`).
