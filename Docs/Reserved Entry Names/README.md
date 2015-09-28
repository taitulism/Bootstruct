Bootstruct Reserved Entry Names
===============================
Bootstruct has some reserved names for files and folders ("entries", for short) that on parsing stage have a special meaning.

Bootstruct parses two folders on init: the web-root folder (e.g. `www`) and the hooks folder (e.g. `www_hooks`, optional), each has its own parser with its reserved names for entries (files and folders) and each entry with a reserved name plays its own role in your app's play.

When the parser hits these certain names it does something with the entry's content so these entries are expected to export a specific type of data (mostly a function).




Web-root Reserved Names
-----------------------
The web-root reserved entry names become methods in their controller's chains so they all must eventually export a single function that handles a single argument, the `io`.

One exception is the `verbs` name.

>**NOTE**: Reserved names with under_scores have a dash-version and a camelCased version as synonyms e.g. `no_verb`/`no-verb`/`noVerb`.

The following image describes a controller's chains (similar to the one shown in the [Docs main page](#docs)): The target-chain is on the right, the parent-chain is on the left and the method-chain is in the middle.
![Controller Chart-Flow](https://raw.githubusercontent.com/taitulism/Bootstruct/master/Docs/controller-chart-flow.png)

All chains
----------
* [first](#first)
* [last](#last)

Target-chain
------------
* [before_verb / index / all](#index)
* [get](#get)
* [post](#post)
* [put](#put)
* [delete](#delete)
* [no_verb](#no_verb)
* [after_verb / all_done](#after_verb)
* [verbs](#verbs) (EXCEPTION: not a method)

Parent-chain
------------
* [pre_sub](#pre_sub)
* [post_sub](#post_sub)

Method-chain
------------
* [pre_method](#pre_method)
* [post_method](#post_method)

[Full Example](#full-example)




Hooks Folder Reserved Names
---------------------------
Bootstruct provides you with hooks to some key points in its architecture (on init). You can extend prototypes, add your own reserved entry names and more.

*[ignore](#ignore)
*[io_init](#io_init)
*[io_exit](#io_exit)
*[io_proto](#io_proto)
*[ctrl_proto](#ctrl_proto)
*[entry_handlers](#entry_handlers)
*[shared_methods](#shared_methods)
*[shared_ctrls](#shared_ctrls)
*[default](#default)