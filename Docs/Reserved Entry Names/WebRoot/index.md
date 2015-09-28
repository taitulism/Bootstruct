index
-----
**Chain**: Target.  
**Synonyms**: `all`, `beforeVerb`, `before_verb`, `before-verb`.

`index` is a reserved entry name (and so are its synonyms). Its exported function gets mounted on the target-chain of the controller it's in. The `index` method gets called when its controller is the request target-controller, for **any** type of request (HTTP verbs).

Example structure:
```
├── www   (RC)
│   ├── index.js      ──> handles requests to /
│   └── A
│       └── index.js  ──> handles requests to /A
```
This works very similar to other platforms where you ask for a folder and its default file is served/executed (index.html, index.php, index.asp etc).

If a controller has no sub-controllers and has only an `index` method, like "A" in our case, you can cut the overhead of a folder (a controller) and turn it into a file (a method).

Before:
```
├── www
│   ├── index.js
│   └── A          ──> folder
│       └── index.js
```
After:
```
├── www
│   ├── index.js
│   └── A.js       ──> file
```
Now "A" is a method in the "RC" instead of a single method controller.