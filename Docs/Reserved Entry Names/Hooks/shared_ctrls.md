Hook: "shared_ctrls"
======================
**Entry Type**: a folder

When Bootstruct is initialized it parses the web-root folder. User custom named folders become controllers, and files become methods.

A shared controller is a "standalone" controller, a child-controller that can be "adopted" by any controller in your web-root.

Let's say you want to run the same test over all of your controllers when addressing them with an additional `/test` in the URL (e.g. `/user/test`, `/user/profile/test`, `user/friends/test`).

You can create a shared `test` controller.

To create a shared controller, create in your [hooks folder](#hooks) a `shared_ctrls` folder.

```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   ├── www
│   └── www_hooks
│       └── shared_ctrls  <──
│           └── test
```

Folders inside `shared_ctrls` (like `test`) will be parsed as controllers as if they were in your web-root folder.