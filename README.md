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
Creating web apps with Node requires wiring up our routes manually: we need to bind different URLs to different handlers. We usually do that by coding. With Bootstruct we do it by creating files and folders.

The whole story (well, most of it) happens in a single folder, the web-server's root folder (might ring some bells):
```
├── myProject
│   ├── node_modules
│   ├── server-index.js
│   └── www              <──
```

Bootstruct ties that folder with your domain root (`/` in common Nodish) and routes requests through that folder's structure, matching URLs to corresponding paths under that folder. 

Meaning, to support routes like:
```
domain.com/
domain.com/A
domain.com/A/B
domain.com/A/B/C
```

your web-root folder tree would generally look like:
```
├── www
│   └── A
│       └── B
│           └── C
```

Bootstruct leverages the parental folder chain (e.g. '/A/B/C') and provides you with an onion-like layered app. 

A request to `/A/B/C` would go through:
```
1. www
2. www/A
3. www/A/B
4. www/A/B/C
5. www/A/B
6. www/A
7. www
```

>Do you see the onion?

Requests start at the web-root folder (e.g. "www"), do their way into the target-folder, then go back out to the web-root folder and you can run some code on every step of the way.




What Else?
----------
Bootstruct uses files and folders with special meanings as different lifecycle hooks. In addition, you can create your own hooks, extend the different components' prototypes and more.




Bootstruct:
-----------
- [x] saves you from coding your routes.
- [x] enforces a natural code separation by concept.
- [x] provides you with great control over request flow.
- [x] can be used alongside with express/connect.
- [x] is extendable.




Start Using Bootstruct
----------------------
* [Get Started](https://github.com/taitulism/Bootstruct/blob/master/Docs/Get%20Started.md)
* [Docs](https://github.com/taitulism/Bootstruct/blob/master/Docs/README.md)




*******************************************************************************
Questions, suggestions, criticism, bugs, hugs, typos and kudos are all welcome.

*taitulism(at)gmail(dot)com*
