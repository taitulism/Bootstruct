[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/Bootstruct.svg?branch=master)](https://travis-ci.org/taitulism/Bootstruct)

Bootstruct
==========
Bootstruct is a web framework for Node, based on a folder-structure / file-name convention.

>*Routing by structure.*



Table of contents
-----------------

* Overview (this page)
* [Get Started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get%20Started.md)
* [Docs](https://github.com/taitulism/Bootstruct/blob/master/Docs/README.md)





Overview
--------
Creating web apps with Node requires wiring up our routes manually: we need to bind different URL paths to their handlers. We usually do that by declerative coding like: `bind('GET', '/api', handler)`.

With Bootstruct you don't code your routes. You just export your handler and name the file with its route name.

Technically, Bootstruct creates routes by parsing your routes folder and routes requests through that folder's structure, matching URLs to corresponding paths under that folder. 

Meaning, to support routes like:
```
domain.com/
domain.com/A
domain.com/A/B
domain.com/A/B/C
```

your routes folder tree would generally look like:
```
├── routes
│   ├── index.js
│   └── A
│       ├── index.js
│       └── B
│           ├── index.js
│           └── C
│               └──index.js
```

&nbsp;

Controling Request Flow
-----------------------
When working with middlware functions (`express`, `connect`...) you control request flow by binding 'this' route before 'that' route. The order in which you code your routes matters.

Bootstruct provides you with an onion-like layered app by leveraging the parental folder chain. So a request to `/A/B/C` would go through:
```
1. /
2. /A
3. /A/B
4. /A/B/C
5. /A/B
6. /A
7. /
```
>Do you see the onion?

&nbsp;

Naming Convention
-----------------
Bootstruct uses files and folders with certain names as different hooks.

For example, to handle `GET` requests, name your handler file `_get.js`. To handle `POST` requests, name it `_post.js`.

>**You can create your own hooks**

&nbsp;

What Else?
----------
* Create your own hook
* Handle dynamic url params (e.g. `/A/B/whatever`)
* 
* Extend Bootstruct's different prototypes and more.

&nbsp;

Bootstruct:
-----------
- [x] saves you from coding your routes.
- [x] enforces a natural code separation by concept.
- [x] provides you with great control over request flow.
- [x] is extensible.

&nbsp;

### Start Using Bootstruct
* [Get Started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get%20Started.md)
* [Docs](https://github.com/taitulism/Bootstruct/blob/master/Docs/README.md)




*******************************************************************************
Questions, suggestions, criticism, bugs, hugs, typos and kudos are all welcome.

*taitu.dev (at) gmail dot com*
