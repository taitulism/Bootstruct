* If you're using the `verbs` folder, any duplicate verbs outside it will override the ones inside.

verbs
-----
`verbs` is a reserved entry name but it doesn't stand for a method like the others. `verbs` acts only as a namespace entry to hold the different verb files.

Using all verb types and having multiple sub-controllers/methods can hurt your eyes:
```
├── www
│   ├── [blog]      <── controller
│   ├── [messages]  <── controller
│   ├── [profile]   <── controller
│   ├── about.js    <── method
│   ├── all.js      <── verbs ("index" synonym)
│   ├── contact.js  <── method
│   ├── delete.js   <── verbs
│   ├── get.js      <── verbs
│   ├── post.js     <── verbs
│   └── put.js      <── verbs
```
For the sake of your eyes, you can use a `verbs` folder, just as a namespace to contain the verbs entries:
```
├── www
│   ├── [blog]
│   ├── [messages]
│   ├── [profile]
│   ├── about.js
│   ├── contact.js
│   └── verbs          <──
│       ├── all.js
│       ├── get.js
│       ├── post.js
│       ├── put.js
│       └── delete.js
```

You can also use a `verbs.js` file to export your verbs methods from an object:
```
├── www
│   ├── [blog]
│   ├── [messages]
│   ├── [profile]
│   ├── about.js
│   ├── contact.js
│   └── verbs.js          <──
```

```js
// verbs.js
module.exports = {
	get: function (io) {

	},
	post: function (io) {

	},
	put: function (io) {

	},
	delete: function (io) {

	},
	noVerb: function (io) {

	}
};
```