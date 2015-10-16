Bootstruct Reserved Entry Names
===============================
Bootstruct has some reserved names for files and folders ("entries", for short) that on parsing stage have a special meaning.

Bootstruct parses two folders on init: the web-root folder (e.g. `www`) and the hooks folder (e.g. `www_hooks`, optional), each has its own parser with its reserved names for entries (files and folders) and each entry with a reserved name plays its own role in your app's play.

When the parser hits these certain names it does something with the entry's content so these entries are expected to export a specific type of data (mostly a function).




Web-root Reserved Names
=======================
The web-root reserved entry names become methods in their controller's chains so they all must eventually export a single function that handles a single argument, the `io`.

One exception is the `verbs` name.

>**NOTE**: Reserved names with under_scores have a dash-version and a camelCased version as synonyms e.g. `no_verb`/`no-verb`/`noVerb`.

The following image describes a controller's chains (explained in the [docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md#controllers-flow)): The target-chain is in the middle, the parent-chain is on the left and the method-chain is on the right.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)




All chains
----------
* [first](/first & last.md)
* [last](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/first & last.md)




Target-chain
------------
* [before_verb / index / all](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/index.md)
* [get](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/get post put delete.md)
* [post](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/get post put delete.md)
* [put](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/get post put delete.md)
* [delete](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/get post put delete.md)
* [no_verb](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/no_verb.md)
* [after_verb / all_done](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/after_verb.md)
* [verbs](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/verbs.md) (EXCEPTION: not a method)




Parent-chain
------------
* [pre_sub](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/pre-post sub.md)
* [post_sub](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/pre-post sub.md)




Method-chain
------------
* [pre_method](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/pre-post method.md)
* [post_method](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/WebRoot/pre-post method.md)




Hooks Folder Reserved Names
===========================
Bootstruct provides you with hooks to some key points in its architecture (on init). You can extend prototypes, add your own reserved entry names and more. Read about [Bootstruct's hooks](https://github.com/taitulism/Bootstruct/blob/master/Docs/Hooks.md).

* [ignore](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/ignore.md)
* [io_init](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/io_init.md)
* [io_exit](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/io_exit.md)
* [io_proto](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/io_proto.md)
* [ctrl_proto](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/ctrl_proto.md)
* [entry_handlers](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/entry_handlers.md)
* [shared_methods](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/shared_methods.md)
* [shared_ctrls](https://github.com/taitulism/Bootstruct/blob/master/Docs/Reserved Entry Names/Hooks/shared_ctrls.md)