Bootstruct Hooks
================
Bootstruct has some reserved names for files and folders ("entries", for short) that on parsing stage (app initialization) have a 
special meaning.

Bootstruct parses two folders on init: the web-root folder (e.g. `www`) and its related hooks folder (e.g. `www_hooks`, optional). 
Each has its own parser with its reserved names for entries (files and folders) and each entry with a reserved name plays its own role in 
your app's play.

When the parser hits these certain names it does something with the entry's content so 
these entries are expected to export a specific type of data (mostly a function).




Web-root Reserved Names
=======================
The web-root hooks (controller level hooks) become methods in their controller's chains so 
they all must eventually export a single function that handles a single argument, the `io`.

One exception is the `$verbs` name.

>**NOTE**: Reserved names with under_scores have a dash-version as synonym e.g. `$no_verb`/`$no-verb`.

The following image describes a controller's chains (explained in the 
[docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md#controllers-flow)): 
The target-chain is in the middle, the parent-chain is on the left and the method-chain is on the right.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)




All chains
----------
* [$in](./Controller Hooks/%24in%20%26%20%24out.md)
* [$out](./Controller Hooks/%24in%20%26%20%24out.md)




Target-chain
------------
* [index / $before_verb](./Controller Hooks/index.md)
* [$get](./Controller Hooks/get post put delete.md)
* [$post](./Controller Hooks/get post put delete.md)
* [$put](./Controller Hooks/get post put delete.md)
* [$delete](./Controller Hooks/get post put delete.md)
* [$no_verb](./Controller Hooks/%24no_verb.md)
* [$after_verb](./Controller Hooks/%24after_verb.md)
* [$verbs](./Controller Hooks/%24verbs.md) (EXCEPTION: not a method)




Parent-chain
------------
* [$pre_sub](./Controller Hooks/%24pre%20%26%20%24post%20sub.md)
* [$post_sub](./Controller Hooks/%24pre%20%26%20%24post%20sub.md)




Method-chain
------------
* [$pre_method](./Controller Hooks/%24pre%20%26%20%24post%20method.md)
* [$post_method](./Controller Hooks/%24pre%20%26%20%24post%20method.md)




App Hooks Folder
================
Bootstruct provides you with hooks to some key points in its architecture (app level hooks). You 
can extend prototypes, add your own controller-hooks and more. Read about [Bootstruct's hooks](../App Hooks.md).

* [ignore](./App Hooks/ignore.md)
* [io_init](./App Hooks/io_init.md)
* [io_exit](./App Hooks/io_exit.md)
* [io_proto](./App Hooks/io_proto.md)
* [ctrl_proto](./App Hooks/ctrl_proto.md)
* [ctrl_hooks](./App Hooks/ctrl_hooks.md)
* [shared_methods](./App Hooks/shared_methods.md)
* [shared_ctrls](./App Hooks/shared_ctrls.md)
