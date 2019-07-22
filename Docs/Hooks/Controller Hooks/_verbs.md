_verbs
------

>**NOTE**: If you're using the `_verbs` folder, any duplicate \<verbs> outside it will override the ones inside.

`_verbs` is a reserved entry name but it doesn't stand for a method like the others. `_verbs` acts only as a namespace entry to hold the different verb files.

Using all verb types and having multiple sub-controllers/methods can hurt your eyes:
```
├── www
│   ├── [blog]      <── controller
│   ├── [messages]  <── controller
│   ├── [profile]   <── controller
│   ├── about.js    <── method
│   ├── index.js    <── verbs ("index" synonym)
│   ├── contact.js  <── method
│   ├── _delete.js  <── verb
│   ├── _get.js     <── verb
│   ├── _post.js    <── verb
│   └── _put.js     <── verb
```
For the sake of your eyes, you can use a `_verbs` folder, just as a namespace to contain the verbs entries:
```
├── www
│   ├── [blog]
│   ├── [messages]
│   ├── [profile]
│   ├── about.js
│   ├── contact.js
│   └── _verbs          <──
│       ├── index.js
│       ├── get.js
│       ├── post.js
│       ├── put.js
│       └── delete.js
```

>**NOTE**: Under `_verbs` namespace (file or folder), you won't be needing the `_` sign for your verbs (e.g. _get, _post etc.)

You can also use a `_verbs.js` file to export your verbs methods from an object:
```
├── www
│   ├── [blog]
│   ├── [messages]
│   ├── [profile]
│   ├── about.js
│   ├── contact.js
│   └── _verbs.js       <──
```

```js
// _verbs.js
module.exports = {
	get: function (io) {

	},
	post: function (io) {

	},
	put: function (io) {

	},
	delete: function (io) {

	},
	no_verb: function (io) {

	}
};
```
