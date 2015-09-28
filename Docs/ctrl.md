This structure:
```
├── www           ──> controller (root)
│   └── A         ──> controller
│       └── B.js  ──> method
```
is parsed into something like:



```js
	/*────────────┐
	│ PSEUDO CODE │
	└────────────*/
	RC = {
		folder: 'path/to/www',
		url   : '/',
		methods: {},
		sub_controllers: {
			A: {
				folder: 'path/to/www/A',
				url   : '/A',
				methods: {
					B: require('www/A/B')
				}
				sub_controllers: {},
			}
		}
	}
```

||OR smaller||


```js
	/*────────────┐
	│ PSEUDO CODE │
	└────────────*/
	RC = {
		methods: {}
		sub_controllers: {
			A: {
				methods: {
					B: require('www/A/B')
				}
				sub_controllers: {}
			}
		}
	}
```



>**NOTE**: On request Bootstruct splits the URL pathename by slashes and checks them one by one against existing sub-controllers so you cannot "escape" the web-root folder by requesting '../../' because there is no `RC.sub_controllers['..']`. Bootstruct does NOT statically serve anything.



See how "B" is `require`d above?  
Methods in Bootstruct are expected to export a single function (they are being `require`d on init):
```js
	module.exports = function () {...};
```




```js
	/*────────────┐
	│ PSEUDO CODE │
	└────────────*/
	app = {
		RC: {
			global: app
			sub_ctrls: {
				A: {
					global: app
					sub_ctrls: {}
				}
			}
		}
	}
```


The "RC" is a property of another object, the `app` and all the controllers have a refference to `app` named `global`:




>**NOTE**: If the next URL part is neither a file or a folder (= a method or a controller) of the current one - it's the target-contoller.