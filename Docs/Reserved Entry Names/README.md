Bootstruct Reserved Entry Names
===============================
Bootstruct has some reserved names for files and folders ("entries", for short) that on parsing stage have a special meaning.

Bootstruct parses two folders on init: the web-root folder (e.g. `www`) and the hooks folder (e.g. `www_hooks`, optional), each has its own parser with its reserved names for entries (files and folders) and each entry with a reserved name plays its own role in your app's play.

When the parser hits these certain names it does something with the entry's content so these entries are expected to export a specific type of data (mostly a function).




Web-root Reserved Names
=======================
The web-root reserved entry names become methods in their controller's chains so they all must eventually export a single function that handles a single argument, the `io`.

One exception is the `verbs` name.

>**NOTE**: Reserved names with under_scores have a dash-version as synonyms e.g. `$no_verb`/`$no-verb`.

The following image describes a controller's chains (explained in the [docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md#controllers-flow)): The target-chain is in the middle, the parent-chain is on the left and the method-chain is on the right.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)




All chains
----------
* [$in](./WebRoot/%24in%20%26%20%24out.md)
* [$out](./WebRoot/%24in%20%26%20%24out.md)




Target-chain
------------
* [index / $before_verb](./WebRoot/index.md)
* [$get](./WebRoot/get post put delete.md)
* [$post](./WebRoot/get post put delete.md)
* [$put](./WebRoot/get post put delete.md)
* [$delete](./WebRoot/get post put delete.md)
* [$no_verb](./WebRoot/%24no_verb.md)
* [$after_verb](./WebRoot/%24after_verb.md)
* [$verbs](./WebRoot/%24verbs.md) (EXCEPTION: not a method)




Parent-chain
------------
* [$pre_sub](./WebRoot/%24pre-post sub.md)
* [$post_sub](./WebRoot/%24pre-post sub.md)




Method-chain
------------
* [$pre_method](./WebRoot/%24pre-post method.md)
* [$post_method](./WebRoot/%24pre-post method.md)




Hooks Folder Reserved Names
===========================
Bootstruct provides you with hooks to some key points in its architecture (on init). You can extend prototypes, add your own reserved entry names and more. Read about [Bootstruct's hooks](../Hooks.md).

* [ignore](./Hooks/ignore.md)
* [io_init](./Hooks/io_init.md)
* [io_exit](./Hooks/io_exit.md)
* [io_proto](./Hooks/io_proto.md)
* [ctrl_proto](./Hooks/ctrl_proto.md)
* [entry_handlers](./Hooks/entry_handlers.md)
* [shared_methods](./Hooks/shared_methods.md)
* [shared_ctrls](./Hooks/shared_ctrls.md)
