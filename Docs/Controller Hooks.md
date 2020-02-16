Controller Hooks
================
Bootstruct has some reserved names for files and folders ("entries", for short) that on parsing stage (app initialization) have a 
special meaning.

Bootstruct parses two folders on init: the web root folder (e.g. `api`) and its related hooks folder (e.g. `api_hooks`, optional). 
Each has its own parser with its reserved names for entries (files and folders) and each entry with a reserved name plays its own role in 
your app's play.

When the parser hits these certain names it does something with the entry's content so 
these entries are expected to export a specific type of data (mostly a function).




Web-Root Reserved Names
-----------------------
The web root hooks (controller level hooks) become methods in their controller's chains so 
they all must eventually export a single function that handles a single argument, the `io`.

One exception is the `_verbs` name.

>**NOTE**: Reserved names with under_scores have a dash-version as aliases e.g. `_no_verb`/`_no-verb`.

The following image describes a controller's chains (explained in the 
[docs main page](https://github.com/taitulism/Bootstruct/blob/master/README.md#controllers-flow)): 
The target-chain is in the middle, the parent-chain is on the left and the method-chain is on the right.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-flowchart.png)



All chains
----------
* [_in](./Controller%20Hooks/in%20%26%20out.md)
* [_out](./Controller%20Hooks/in%20%26%20out.md)



Target-chain
------------
* [index / _before_verb](./Controller%20Hooks/index.md)
* [_get](./Controller%20Hooks/get%20post%20put%20delete.md)
* [_post](./Controller%20Hooks/get%20post%20put%20delete.md)
* [_put](./Controller%20Hooks/get%20post%20put%20delete.md)
* [_delete](./Controller%20Hooks/get%20post%20put%20delete.md)
* [_no_verb](./Controller%20Hooks/no_verb.md)
* [_after_verb](./Controller%20Hooks/after_verb.md)
* [_verbs](./Controller%20Hooks/verbs.md) (EXCEPTION: not a method)



Parent-chain
------------
* [_pre_sub](./Controller%20Hooks/pre%20%26%20post%20sub.md)
* [_post_sub](./Controller%20Hooks/pre%20%26%20post%20sub.md)



Method-chain
------------
* [_pre_method](./Controller%20Hooks/pre%20%26%20post%20method.md)
* [_post_method](./Controller%20Hooks/pre%20%26%20post%20method.md)
